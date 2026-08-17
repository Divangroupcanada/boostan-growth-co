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

const SENSITIVE_HEADER_KEYS = new Set([
  "authorization",
  "cookie",
  "x-nowpayments-sig",
  "x-api-key",
]);

function maskHeaders(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((value, key) => {
    if (SENSITIVE_HEADER_KEYS.has(key.toLowerCase())) {
      out[key] = value.length <= 8 ? "***" : `${value.slice(0, 6)}…(${value.length})`;
    } else {
      out[key] = value;
    }
  });
  return out;
}

type LogEntry = {
  source: string;
  method: string;
  headers: Record<string, string>;
  raw_body: string;
  parsed_payload: unknown;
  signature_valid: boolean | null;
  signature_reason: string | null;
  payment_id: string | null;
  payment_status: string | null;
  tx_lookup_found: boolean | null;
  tx_id: string | null;
  action: string | null;
  amount_credited: number | null;
  response_status: number;
  error: string | null;
  is_test: boolean;
};

async function persistLog(entry: LogEntry) {
  try {
    await supabaseAdmin.from("webhook_logs").insert(entry as any);
  } catch (e: any) {
    console.error(`[nowpayments-webhook] failed to persist log: ${e?.message}`);
  }
}

export async function processNowpaymentsWebhook(
  raw: string,
  sig: string | null,
  meta: { method: string; headers: Headers; isTest: boolean },
): Promise<{ status: number; body: string; log: LogEntry }> {
  const log: LogEntry = {
    source: "nowpayments",
    method: meta.method,
    headers: maskHeaders(meta.headers),
    raw_body: raw,
    parsed_payload: null,
    signature_valid: null,
    signature_reason: null,
    payment_id: null,
    payment_status: null,
    tx_lookup_found: null,
    tx_id: null,
    action: null,
    amount_credited: null,
    response_status: 200,
    error: null,
    is_test: meta.isTest,
  };

  console.log(
    `[nowpayments-webhook] received sig=${sig?.slice(0, 16) ?? "null"}… body_len=${raw.length} test=${meta.isTest}`,
  );

  const sigValid = verifyIpnSignature(raw, sig);
  log.signature_valid = sigValid;
  if (!sigValid) {
    log.signature_reason = sig ? "HMAC mismatch" : "missing x-nowpayments-sig header";
    log.action = "rejected_invalid_signature";
    log.response_status = 401;
    log.error = log.signature_reason;
    console.error(`[nowpayments-webhook] INVALID SIGNATURE — ${log.signature_reason}`);
    await persistLog(log);
    return { status: 401, body: "Invalid signature", log };
  }
  log.signature_reason = "ok";

  let body: IpnBody;
  try {
    body = JSON.parse(raw);
    log.parsed_payload = body;
  } catch (e: any) {
    log.action = "bad_json";
    log.error = e?.message ?? "JSON parse error";
    log.response_status = 400;
    await persistLog(log);
    return { status: 400, body: "Bad JSON", log };
  }

  const paymentId = String(body.payment_id);
  const status = String(body.payment_status ?? "").toLowerCase();
  log.payment_id = paymentId;
  log.payment_status = status;
  console.log(`[nowpayments-webhook] payment_id=${paymentId} status=${status}`);

  const { data: pending, error: pErr } = await supabaseAdmin
    .from("transactions")
    .select("id, user_id, type, payment_status")
    .eq("payment_id", paymentId)
    .eq("type", "deposit_pending")
    .maybeSingle();

  if (pErr) {
    log.action = "db_error";
    log.error = pErr.message;
    log.response_status = 500;
    console.error(`[nowpayments-webhook] db error: ${pErr.message}`);
    await persistLog(log);
    return { status: 500, body: "DB error", log };
  }

  log.tx_lookup_found = !!pending;
  if (!pending) {
    log.action = "no_pending_tx_ignored";
    console.warn(`[nowpayments-webhook] no pending tx for payment_id=${paymentId} — ignoring`);
    await persistLog(log);
    return { status: 200, body: "ok", log };
  }
  log.tx_id = pending.id;

  const isCredit = status === "finished" || status === "confirmed";
  const isFailed = status === "failed" || status === "expired" || status === "refunded";
  const isPartial = status === "partially_paid";

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
      log.action = "invalid_amount";
      log.error = `invalid price_amount: ${body.price_amount}`;
      console.error(`[nowpayments-webhook] ${log.error}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }

    const { data: profile, error: prErr } = await supabaseAdmin
      .from("profiles")
      .select("balance")
      .eq("user_id", pending.user_id)
      .single();
    if (prErr) {
      log.action = "profile_lookup_failed";
      log.error = prErr.message;
      console.error(`[nowpayments-webhook] profile lookup failed: ${prErr.message}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }
    const newBalance = Number(profile.balance) + amountUsd;

    const { error: insErr } = await supabaseAdmin.from("transactions").insert({
      user_id: pending.user_id,
      type: "deposit",
      amount: amountUsd,
      status: "completed",
      description: meta.isTest
        ? "TEST webhook — simulated credit (no real funds)"
        : "Crypto deposit confirmed via NOWPayments",
      balance_after: newBalance,
      payment_id: paymentId,
      payment_status: status,
      ipn_payload: body as any,
    });

    if (insErr) {
      if (insErr.code === "23505") {
        log.action = "already_credited_idempotent";
        console.log(`[nowpayments-webhook] already credited payment_id=${paymentId}`);
        await persistLog(log);
        return { status: 200, body: "ok", log };
      }
      log.action = "insert_deposit_failed";
      log.error = insErr.message;
      console.error(`[nowpayments-webhook] insert deposit failed: ${insErr.message}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }

    const { error: balErr } = await supabaseAdmin
      .from("profiles")
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", pending.user_id);
    if (balErr) {
      log.action = "balance_update_failed";
      log.error = balErr.message;
      console.error(`[nowpayments-webhook] balance update failed: ${balErr.message}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }

    log.action = "credited";
    log.amount_credited = amountUsd;
    console.log(
      `[nowpayments-webhook] credited $${amountUsd} to user ${pending.user_id}, new balance $${newBalance}`,
    );
  } else if (isPartial) {
    await supabaseAdmin
      .from("transactions")
      .update({
        description: `⚠ Partial payment — admin review needed (paid: ${body.actually_paid} ${body.pay_currency})`,
      })
      .eq("id", pending.id);
    log.action = "partial_flagged";
    console.warn(`[nowpayments-webhook] partial payment for ${paymentId}`);
  } else if (isFailed) {
    log.action = `marked_${status}`;
    console.log(`[nowpayments-webhook] payment ${paymentId} ${status}`);
  } else {
    log.action = `intermediate_${status}`;
    console.log(`[nowpayments-webhook] intermediate status ${status} for ${paymentId}`);
  }

  await persistLog(log);
  return { status: 200, body: "ok", log };
}

export const Route = createFileRoute("/api/public/nowpayments-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const sig = request.headers.get("x-nowpayments-sig");
        const result = await processNowpaymentsWebhook(raw, sig, {
          method: "POST",
          headers: request.headers,
          isTest: request.headers.get("x-boostan-test") === "1",
        });
        return new Response(result.body, { status: result.status });
      },
    },
  },
});
