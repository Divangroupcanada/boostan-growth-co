import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { verifyIpnSignature } from "@/lib/nowpayments.server";

type IpnBody = {
  payment_id: number | string;
  payment_status: string;
  price_amount: number;
  price_currency?: string;
  pay_address?: string;
  pay_amount?: number;
  pay_currency?: string;
  actually_paid?: number;
  order_id?: string;
};

export const Route = createFileRoute("/api/public/nowpayments-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const sig = request.headers.get("x-nowpayments-sig");

        console.log(`[nowpayments-webhook] received sig=${sig?.slice(0, 16)}… body_len=${raw.length}`);

        if (!verifyIpnSignature(raw, sig)) {
          console.error("[nowpayments-webhook] INVALID SIGNATURE — rejecting");
          return new Response("Invalid signature", { status: 401 });
        }

        let body: IpnBody;
        try {
          body = JSON.parse(raw);
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }

        const paymentId = String(body.payment_id);
        const status = String(body.payment_status ?? "").toLowerCase();
        console.log(`[nowpayments-webhook] payment_id=${paymentId} status=${status}`);

        // Look up the original pending tx
        const { data: pending, error: pErr } = await supabaseAdmin
          .from("transactions")
          .select("id, user_id, type, payment_status")
          .eq("payment_id", paymentId)
          .eq("type", "deposit_pending")
          .maybeSingle();
        if (pErr) {
          console.error(`[nowpayments-webhook] db error: ${pErr.message}`);
          return new Response("DB error", { status: 500 });
        }
        if (!pending) {
          console.warn(`[nowpayments-webhook] no pending tx for payment_id=${paymentId} — ignoring`);
          return new Response("ok", { status: 200 });
        }

        const isCredit = status === "finished" || status === "confirmed";
        const isFailed = status === "failed" || status === "expired" || status === "refunded";
        const isPartial = status === "partially_paid";

        // Always update the pending row with latest status + raw payload
        await supabaseAdmin
          .from("transactions")
          .update({
            payment_status: status,
            ipn_payload: body as any,
            pay_address: body.pay_address ?? null,
            pay_amount: body.pay_amount ?? null,
            pay_currency: body.pay_currency ?? null,
          })
          .eq("id", pending.id);

        if (isCredit) {
          const amountUsd = Number(body.price_amount);
          if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
            console.error(`[nowpayments-webhook] invalid price_amount: ${body.price_amount}`);
            return new Response("ok", { status: 200 });
          }

          const { data: profile, error: prErr } = await supabaseAdmin
            .from("profiles").select("balance").eq("user_id", pending.user_id).single();
          if (prErr) {
            console.error(`[nowpayments-webhook] profile lookup failed: ${prErr.message}`);
            return new Response("ok", { status: 200 });
          }
          const newBalance = Number(profile.balance) + amountUsd;

          // Idempotent insert — unique index on payment_id where type='deposit'
          const { error: insErr } = await supabaseAdmin.from("transactions").insert({
            user_id: pending.user_id,
            type: "deposit",
            amount: amountUsd,
            status: "completed",
            description: "Crypto deposit confirmed via NOWPayments",
            balance_after: newBalance,
            payment_id: paymentId,
            payment_status: status,
            ipn_payload: body as any,
          });

          if (insErr) {
            // Duplicate key = already credited (webhook retry). Safe to ignore.
            if (insErr.code === "23505") {
              console.log(`[nowpayments-webhook] already credited payment_id=${paymentId} — idempotent skip`);
              return new Response("ok", { status: 200 });
            }
            console.error(`[nowpayments-webhook] insert deposit failed: ${insErr.message}`);
            return new Response("ok", { status: 200 });
          }

          // Credit balance
          const { error: balErr } = await supabaseAdmin
            .from("profiles")
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq("user_id", pending.user_id);
          if (balErr) {
            console.error(`[nowpayments-webhook] balance update failed: ${balErr.message}`);
          }

          console.log(`[nowpayments-webhook] credited $${amountUsd} to user ${pending.user_id}, new balance $${newBalance}`);
        } else if (isPartial) {
          await supabaseAdmin.from("transactions").update({
            description: `⚠ Partial payment — admin review needed (paid: ${body.actually_paid} ${body.pay_currency})`,
          }).eq("id", pending.id);
          console.warn(`[nowpayments-webhook] partial payment for ${paymentId} — flagged for review`);
        } else if (isFailed) {
          console.log(`[nowpayments-webhook] payment ${paymentId} ${status}`);
        } else {
          console.log(`[nowpayments-webhook] intermediate status ${status} for ${paymentId}`);
        }

        return new Response("ok", { status: 200 });
      },
    },
  },
});
