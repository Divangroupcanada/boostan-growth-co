import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { attachSupabaseAuth } from "./auth-client-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { npFetch, type Invoice, type PaymentStatus } from "./nowpayments.server";

function originFromRequest(): string {
  const req = getRequest();
  const url = new URL(req.url);
  // Prefer x-forwarded-host (behind proxy)
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? url.host;
  const proto = forwardedProto ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}

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

// ---------- 1. createDeposit (user) ----------

const createDepositSchema = z.object({
  amount_usd: z.number().positive().max(10_000),
});

export const createDeposit = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => createDepositSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Validate amount against settings.min_deposit
    const { data: settings, error: sErr } = await supabaseAdmin
      .from("settings").select("min_deposit").eq("id", true).single();
    if (sErr) throw new Error(sErr.message);
    const minDeposit = Number(settings.min_deposit);
    if (data.amount_usd < minDeposit) {
      throw new Error(`Minimum deposit is $${minDeposit.toFixed(2)}`);
    }

    const orderId = `boostan-deposit-${userId}-${Date.now()}`;
    const origin = originFromRequest();

    const invoice = await npFetch<Invoice>("/invoice", {
      method: "POST",
      body: {
        price_amount: data.amount_usd,
        price_currency: "usd",
        pay_currency: "usdttrc20",
        order_id: orderId,
        order_description: "Boostan wallet deposit",
        ipn_callback_url: `${origin}/api/public/nowpayments-webhook`,
        success_url: `${origin}/wallet?status=success`,
        cancel_url: `${origin}/wallet?status=cancel`,
      },
    });

    // Insert pending transaction (admin client — no user INSERT policy on transactions)
    const { data: profile } = await supabaseAdmin
      .from("profiles").select("balance").eq("user_id", userId).single();
    const currentBalance = Number(profile?.balance ?? 0);

    const { error: txErr } = await supabaseAdmin.from("transactions").insert({
      user_id: userId,
      type: "deposit_pending",
      amount: 0,
      status: "pending",
      description: `Crypto deposit pending — $${data.amount_usd.toFixed(2)} USD`,
      balance_after: currentBalance,
      payment_id: String(invoice.id),
      pay_currency: "usdttrc20",
      payment_status: "waiting",
    });
    if (txErr) throw new Error(`Failed to record pending deposit: ${txErr.message}`);

    return {
      invoice_url: invoice.invoice_url,
      payment_id: String(invoice.id),
      order_id: orderId,
    };
  });

// ---------- 2. checkDepositStatus (user) ----------

const checkSchema = z.object({ payment_id: z.string().min(1) });

export const checkDepositStatus = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => checkSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    // Verify ownership
    const { data: tx, error } = await supabaseAdmin
      .from("transactions")
      .select("id, user_id, payment_status")
      .eq("payment_id", data.payment_id)
      .eq("user_id", userId)
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!tx) throw new Error("Payment not found");

    const status = await npFetch<PaymentStatus>(`/payment/${data.payment_id}`);
    return { payment_status: status.payment_status, raw: status };
  });

// ---------- 3. markManualEtransfer (user) ----------

const markEtransferSchema = z.object({
  amount_usd: z.number().positive().max(10_000),
});

export const markManualEtransfer = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => markEtransferSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    const { data: settings, error: sErr } = await supabaseAdmin
      .from("settings").select("min_deposit").eq("id", true).single();
    if (sErr) throw new Error(sErr.message);
    if (data.amount_usd < Number(settings.min_deposit)) {
      throw new Error(`Minimum deposit is $${Number(settings.min_deposit).toFixed(2)}`);
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles").select("balance").eq("user_id", userId).single();
    const currentBalance = Number(profile?.balance ?? 0);

    const { data: row, error } = await supabaseAdmin.from("transactions").insert({
      user_id: userId,
      type: "manual_etransfer",
      amount: 0,
      status: "pending",
      description: `E-transfer pending — $${data.amount_usd.toFixed(2)} USD (awaiting admin confirmation)`,
      balance_after: currentBalance,
      payment_status: "waiting",
      pay_amount: data.amount_usd,
      pay_currency: "cad_etransfer",
    }).select("id").single();
    if (error) throw new Error(error.message);

    return { id: row.id };
  });

// ---------- 4. adminConfirmManualDeposit (admin) ----------

const confirmSchema = z.object({
  transaction_id: z.string().uuid(),
  amount_usd: z.number().positive().max(10_000),
});

export const adminConfirmManualDeposit = createServerFn({ method: "POST" })
  .middleware([attachSupabaseAuth, requireSupabaseAuth])
  .inputValidator((input: unknown) => confirmSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);

    const { data: pending, error: pErr } = await supabaseAdmin
      .from("transactions")
      .select("id, user_id, type, payment_status")
      .eq("id", data.transaction_id)
      .single();
    if (pErr) throw new Error(pErr.message);
    if (pending.type !== "manual_etransfer") throw new Error("Not a manual e-transfer");
    if (pending.payment_status === "finished") return { ok: true, already: true };

    const { data: profile, error: prErr } = await supabaseAdmin
      .from("profiles").select("balance").eq("user_id", pending.user_id).single();
    if (prErr) throw new Error(prErr.message);
    const newBalance = Number(profile.balance) + data.amount_usd;

    const { error: balErr } = await supabaseAdmin
      .from("profiles").update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq("user_id", pending.user_id);
    if (balErr) throw new Error(balErr.message);

    const { error: insErr } = await supabaseAdmin.from("transactions").insert({
      user_id: pending.user_id,
      type: "deposit",
      amount: data.amount_usd,
      status: "completed",
      description: "E-transfer confirmed by admin",
      balance_after: newBalance,
    });
    if (insErr) throw new Error(insErr.message);

    await supabaseAdmin
      .from("transactions")
      .update({
        payment_status: "finished",
        description: `E-transfer credited — $${data.amount_usd.toFixed(2)} USD`,
      })
      .eq("id", data.transaction_id);

    return { ok: true, new_balance: newBalance };
  });
