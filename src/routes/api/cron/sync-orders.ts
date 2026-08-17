import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

/**
 * Scheduled order-status sync (Vercel Cron -> see vercel.json).
 *
 * Without this, an order's status only changes when a user happens to open the
 * page and click refresh. This polls the provider for every order still in
 * flight and writes back status / start_count / remains, and refunds the
 * undelivered portion when the provider reports a partial delivery.
 *
 * Protected by CRON_SECRET: Vercel Cron sends it as `Authorization: Bearer ...`.
 */

const PROVIDER_URL = "https://panel.smmflw.com/api/v2";
const BATCH_LIMIT = 100;

type ProviderStatus = {
  status?: string;
  start_count?: string | number;
  remains?: string | number;
  charge?: string | number;
  error?: string;
};

const STATUS_MAP: Record<string, string> = {
  pending: "pending",
  processing: "processing",
  "in progress": "in_progress",
  inprogress: "in_progress",
  completed: "completed",
  partial: "partial",
  canceled: "canceled",
  cancelled: "canceled",
  fail: "failed",
  failed: "failed",
};

function toInt(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export const Route = createFileRoute("/api/cron/sync-orders")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env.CRON_SECRET;
        const auth = request.headers.get("authorization");
        if (!secret || auth !== `Bearer ${secret}`) {
          return new Response("Unauthorized", { status: 401 });
        }

        const supabaseUrl = process.env.SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const apiKey = process.env.SMMFLW_API_KEY;
        if (!supabaseUrl || !serviceKey || !apiKey) {
          return new Response("Missing server configuration", { status: 500 });
        }

        const db = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false, autoRefreshToken: false },
        });

        const { data: orders, error } = await db
          .from("orders")
          .select("id, provider_order_id, status, quantity, charge, price")
          .in("status", ["pending", "processing", "in_progress"])
          .not("provider_order_id", "is", null)
          .order("created_at", { ascending: true })
          .limit(BATCH_LIMIT);

        if (error) {
          return Response.json({ ok: false, error: error.message }, { status: 500 });
        }
        if (!orders?.length) {
          return Response.json({ ok: true, checked: 0, updated: 0 });
        }

        let updated = 0;
        let refunded = 0;
        const failures: string[] = [];

        // The provider supports multi-order status (comma-separated ids), which
        // matters here: one request per order would mean up to BATCH_LIMIT
        // sequential fetches and a serverless timeout. Chunk instead.
        const CHUNK = 25;
        const statuses = new Map<string, ProviderStatus>();

        for (let i = 0; i < orders.length; i += CHUNK) {
          const slice = orders.slice(i, i + CHUNK);
          const ids = slice.map((o) => String(o.provider_order_id)).join(",");
          try {
            const body = new URLSearchParams({
              key: apiKey,
              api: apiKey, // provider docs list `api` for the multi-status call
              action: "status",
              orders: ids,
            });
            const res = await fetch(PROVIDER_URL, {
              method: "POST",
              headers: { "content-type": "application/x-www-form-urlencoded" },
              body,
            });
            if (!res.ok) {
              failures.push(`batch ${i}: provider HTTP ${res.status}`);
              continue;
            }
            const payload = (await res.json()) as Record<string, ProviderStatus> | ProviderStatus;

            // A single-id batch can come back unkeyed.
            if (slice.length === 1 && "status" in (payload as ProviderStatus)) {
              statuses.set(String(slice[0].provider_order_id), payload as ProviderStatus);
            } else {
              for (const [id, st] of Object.entries(payload as Record<string, ProviderStatus>)) {
                statuses.set(id, st);
              }
            }
          } catch (err) {
            failures.push(`batch ${i}: ${err instanceof Error ? err.message : "unknown error"}`);
          }
        }

        for (const order of orders) {
          try {
            const payload = statuses.get(String(order.provider_order_id));
            if (!payload) continue;
            if (payload.error || !payload.status) {
              failures.push(`${order.id}: ${payload.error ?? "no status returned"}`);
              continue;
            }

            const mapped = STATUS_MAP[String(payload.status).toLowerCase().trim()];
            if (!mapped || mapped === order.status) continue;

            const remains = toInt(payload.remains);
            const { error: updErr } = await db
              .from("orders")
              .update({
                status: mapped,
                start_count: toInt(payload.start_count),
                remains,
                updated_at: new Date().toISOString(),
              })
              .eq("id", order.id);

            if (updErr) {
              failures.push(`${order.id}: ${updErr.message}`);
              continue;
            }
            updated++;

            // Provider failed or canceled outright -> full refund.
            if (mapped === "canceled" || mapped === "failed") {
              const { error: rErr } = await db.rpc("refund_order", {
                _order_id: order.id,
                _reason: `Provider reported ${mapped}`,
              });
              if (rErr) failures.push(`${order.id} refund: ${rErr.message}`);
              else refunded++;
            }

            // Partial delivery -> refund only the undelivered share.
            if (mapped === "partial" && remains && remains > 0 && order.quantity > 0) {
              const charge = Number(order.charge ?? order.price ?? 0);
              const undelivered = Math.round(((charge * remains) / order.quantity) * 100) / 100;
              if (undelivered > 0) {
                const { error: rErr } = await db.rpc("refund_order_partial", {
                  _order_id: order.id,
                  _amount: undelivered,
                  _reason: `Partial delivery — ${remains} of ${order.quantity} not delivered`,
                });
                if (rErr) failures.push(`${order.id} partial refund: ${rErr.message}`);
                else refunded++;
              }
            }
          } catch (err) {
            failures.push(`${order.id}: ${err instanceof Error ? err.message : "unknown error"}`);
          }
        }

        return Response.json({
          ok: true,
          checked: orders.length,
          updated,
          refunded,
          failures: failures.slice(0, 20),
        });
      },
    },
  },
});
