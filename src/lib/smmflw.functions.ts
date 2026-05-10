import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "./auth-client-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import {
  smmflwCall,
  mapProviderStatus,
  pickDisplayTier,
  detectPlatform,
  type SmmflwService,
} from "./smmflw.server";

// ---------- helpers ----------

async function assertAdmin(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

async function getSettings() {
  const { data, error } = await supabaseAdmin
    .from("settings")
    .select("markup_percentage, fixed_fee, min_deposit")
    .eq("id", true)
    .single();
  if (error) throw new Error(error.message);
  return {
    markup: Number(data.markup_percentage),
    fee: Number(data.fixed_fee),
    minDeposit: Number(data.min_deposit),
  };
}

function applyMarkup(baseRate: number, markupPct: number, fee: number): number {
  // base + markup% + fixed fee per 1000
  const marked = baseRate * (1 + markupPct / 100) + fee;
  return Math.round(marked * 100) / 100;
}

// ---------- 1. sync-services (admin) ----------

export const syncServices = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const { markup, fee } = await getSettings();

    const services = await smmflwCall<SmmflwService[]>({ action: "services" });
    if (!Array.isArray(services)) throw new Error("Unexpected services payload");

    let upserts = 0;
    const now = new Date().toISOString();
    const rows: any[] = [];

    for (const s of services) {
      const platform = detectPlatform(String(s.category ?? ""));
      if (!platform) continue; // only IG / TikTok / YT
      const baseRate = Number(s.rate);
      if (!Number.isFinite(baseRate)) continue;
      const marked = applyMarkup(baseRate, markup, fee);

      rows.push({
        smmflw_id: String(s.service),
        provider_service_id: String(s.service),
        name: s.name,
        display_name: s.name,
        platform,
        service_type: String(s.type ?? "default"),
        base_rate: baseRate,
        marked_up_rate: marked,
        rate_per_1000: marked,
        min_quantity: Math.max(1, parseInt(String(s.min), 10) || 100),
        max_quantity: Math.max(1, parseInt(String(s.max), 10) || 100000),
        display_tier: pickDisplayTier(marked),
        active: true,
        synced_at: now,
        updated_at: now,
      });
    }

    if (rows.length) {
      const { error } = await supabaseAdmin
        .from("services")
        .upsert(rows, { onConflict: "smmflw_id" });
      if (error) throw new Error(error.message);
      upserts = rows.length;
    }

    await supabaseAdmin
      .from("settings")
      .update({ last_services_sync: now })
      .eq("id", true);

    return { synced: upserts, total_from_provider: services.length };
  });

// ---------- 2. place-order (user) ----------

const placeOrderSchema = z.object({
  serviceId: z.string().uuid(),
  link: z.string().min(1).max(500),
  quantity: z.number().int().min(1).max(10_000_000),
  testMode: z.boolean().default(true),
});

export const placeOrder = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => placeOrderSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Load service via the user's RLS-scoped client (must be active).
    const { data: service, error: svcErr } = await supabase
      .from("services")
      .select("id, smmflw_id, marked_up_rate, base_rate, rate_per_1000, min_quantity, max_quantity, name, active")
      .eq("id", data.serviceId)
      .maybeSingle();
    if (svcErr) throw new Error(svcErr.message);
    if (!service || !service.active) throw new Error("Service not available");
    if (data.quantity < service.min_quantity || data.quantity > service.max_quantity) {
      throw new Error(`Quantity must be between ${service.min_quantity} and ${service.max_quantity}`);
    }

    const rate = Number(service.marked_up_rate ?? service.rate_per_1000);
    const baseRate = Number(service.base_rate ?? rate);
    const charge = Math.round((rate * data.quantity) / 1000 * 100) / 100;
    const cost = Math.round((baseRate * data.quantity) / 1000 * 100) / 100;

    // Atomic balance debit + order insert + transaction (uses auth.uid()).
    const { data: orderId, error: rpcErr } = await supabase.rpc("place_order_atomic", {
      _service_id: data.serviceId,
      _link: data.link,
      _quantity: data.quantity,
      _charge: charge,
      _cost: cost,
    });
    if (rpcErr) throw new Error(rpcErr.message);
    if (!orderId) throw new Error("Order creation failed");

    let providerOrderId: string;
    let providerStatus = "pending";

    if (data.testMode) {
      providerOrderId = `TEST-${String(orderId).slice(0, 8)}`;
      providerStatus = "in_progress";
    } else {
      if (!service.smmflw_id) throw new Error("Service missing provider id");
      const resp = await smmflwCall<{ order?: string | number; error?: string }>({
        action: "add",
        service: service.smmflw_id,
        link: data.link,
        quantity: data.quantity,
      });
      if (!resp.order) throw new Error("Provider did not return an order id");
      providerOrderId = String(resp.order);
      providerStatus = "in_progress";
    }

    // Persist provider id (admin client to bypass RLS UPDATE restrictions).
    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({
        smmflw_order_id: providerOrderId,
        provider_order_id: providerOrderId,
        status: providerStatus as "in_progress" | "pending",
      })
      .eq("id", orderId as string);
    if (updErr) throw new Error(updErr.message);

    return { orderId: orderId as string, providerOrderId, testMode: data.testMode };
  });

// ---------- 3. check-status (user) ----------

const checkStatusSchema = z.object({ orderId: z.string().uuid() });

export const checkOrderStatus = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => checkStatusSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;

    const { data: order, error: oErr } = await supabase
      .from("orders")
      .select("id, smmflw_order_id, provider_order_id, status")
      .eq("id", data.orderId)
      .maybeSingle();
    if (oErr) throw new Error(oErr.message);
    if (!order) throw new Error("Order not found");

    const providerId = order.smmflw_order_id ?? order.provider_order_id;
    if (!providerId) throw new Error("Order has no provider id");

    // Test orders never hit the API — simulate progression.
    if (providerId.startsWith("TEST-")) {
      await supabaseAdmin
        .from("orders")
        .update({ status: "completed", remains: 0 })
        .eq("id", data.orderId);
      return { status: "completed", remains: 0, start_count: 0, test: true };
    }

    const resp = await smmflwCall<{
      status?: string;
      start_count?: string | number;
      remains?: string | number;
      charge?: string | number;
    }>({ action: "status", order: providerId });

    const status = mapProviderStatus(resp.status);
    const start_count = resp.start_count != null ? parseInt(String(resp.start_count), 10) : null;
    const remains = resp.remains != null ? parseInt(String(resp.remains), 10) : null;

    const { error: updErr } = await supabaseAdmin
      .from("orders")
      .update({ status: status as any, start_count, remains })
      .eq("id", data.orderId);
    if (updErr) throw new Error(updErr.message);

    return { status, start_count, remains, test: false };
  });

// ---------- 4. get-balance (admin) ----------

export const getProviderBalance = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.userId);
    const resp = await smmflwCall<{ balance?: string | number; currency?: string }>({
      action: "balance",
    });
    return {
      balance: Number(resp.balance ?? 0),
      currency: String(resp.currency ?? "USD"),
    };
  });
