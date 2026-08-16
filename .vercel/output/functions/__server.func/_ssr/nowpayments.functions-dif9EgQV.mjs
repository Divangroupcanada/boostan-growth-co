import { c as createServerRpc } from "./createServerRpc-BfVdOdWe.mjs";
import { a as createServerFn, g as getRequest } from "./server-B-gRx3ND.mjs";
import { createHmac } from "crypto";
import { a as attachSupabaseAuth, r as requireSupabaseAuth } from "./auth-client-middleware-B9dl4-ow.mjs";
import { s as supabaseAdmin } from "./client.server-j8IJ-cKj.mjs";
import { n as npFetch, g as getIpnSecret } from "./nowpayments.server-D_G7i1Kn.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { f as object, n as number, d as string, k as boolean, _ as _enum } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function originFromRequest() {
  const req = getRequest();
  const url = new URL(req.url);
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? url.host;
  const proto = forwardedProto ?? url.protocol.replace(":", "");
  return `${proto}://${host}`;
}
async function assertAdmin(userId) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}
const createDepositSchema = object({
  amount_usd: number().positive().max(1e4)
});
const createDeposit_createServerFn_handler = createServerRpc({
  id: "a3f46637b482306e515f028fc8375ca1977ca5077bfacbbed17a1163376c7935",
  name: "createDeposit",
  filename: "src/lib/nowpayments.functions.ts"
}, (opts) => createDeposit.__executeServer(opts));
const createDeposit = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => createDepositSchema.parse(input)).handler(createDeposit_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: settings,
    error: sErr
  } = await supabaseAdmin.from("settings").select("min_deposit").eq("id", true).single();
  if (sErr) throw new Error(sErr.message);
  const minDeposit = Number(settings.min_deposit);
  if (data.amount_usd < minDeposit) {
    throw new Error(`Minimum deposit is $${minDeposit.toFixed(2)}`);
  }
  const orderId = `boostan-deposit-${userId}-${Date.now()}`;
  const origin = originFromRequest();
  const invoice = await npFetch("/invoice", {
    method: "POST",
    body: {
      price_amount: data.amount_usd,
      price_currency: "usd",
      pay_currency: "usdttrc20",
      order_id: orderId,
      order_description: "Boostan wallet deposit",
      ipn_callback_url: `${origin}/api/public/nowpayments-webhook`,
      success_url: `${origin}/wallet?status=success`,
      cancel_url: `${origin}/wallet?status=cancel`
    }
  });
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("balance").eq("user_id", userId).single();
  const currentBalance = Number(profile?.balance ?? 0);
  const {
    error: txErr
  } = await supabaseAdmin.from("transactions").insert({
    user_id: userId,
    type: "deposit_pending",
    amount: 0,
    status: "pending",
    description: `Crypto deposit pending — $${data.amount_usd.toFixed(2)} USD`,
    balance_after: currentBalance,
    payment_id: String(invoice.id),
    pay_currency: "usdttrc20",
    payment_status: "waiting"
  });
  if (txErr) throw new Error(`Failed to record pending deposit: ${txErr.message}`);
  return {
    invoice_url: invoice.invoice_url,
    payment_id: String(invoice.id),
    order_id: orderId
  };
});
const checkSchema = object({
  payment_id: string().min(1)
});
const checkDepositStatus_createServerFn_handler = createServerRpc({
  id: "e1af295702a143ff2280038af37c51808bb42db2ac786d065b5c9cbb861ac748",
  name: "checkDepositStatus",
  filename: "src/lib/nowpayments.functions.ts"
}, (opts) => checkDepositStatus.__executeServer(opts));
const checkDepositStatus = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => checkSchema.parse(input)).handler(checkDepositStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: tx,
    error
  } = await supabaseAdmin.from("transactions").select("id, user_id, payment_status").eq("payment_id", data.payment_id).eq("user_id", userId).limit(1).maybeSingle();
  if (error) throw new Error(error.message);
  if (!tx) throw new Error("Payment not found");
  const status = await npFetch(`/payment/${data.payment_id}`);
  return {
    payment_status: status.payment_status,
    raw: status
  };
});
const markEtransferSchema = object({
  amount_usd: number().positive().max(1e4)
});
const markManualEtransfer_createServerFn_handler = createServerRpc({
  id: "8f7b989abb69a2670f2232bff153b37987b8b8e96d0eea38f9da4be4d63d45b2",
  name: "markManualEtransfer",
  filename: "src/lib/nowpayments.functions.ts"
}, (opts) => markManualEtransfer.__executeServer(opts));
const markManualEtransfer = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => markEtransferSchema.parse(input)).handler(markManualEtransfer_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    userId
  } = context;
  const {
    data: settings,
    error: sErr
  } = await supabaseAdmin.from("settings").select("min_deposit").eq("id", true).single();
  if (sErr) throw new Error(sErr.message);
  if (data.amount_usd < Number(settings.min_deposit)) {
    throw new Error(`Minimum deposit is $${Number(settings.min_deposit).toFixed(2)}`);
  }
  const {
    data: profile
  } = await supabaseAdmin.from("profiles").select("balance").eq("user_id", userId).single();
  const currentBalance = Number(profile?.balance ?? 0);
  const {
    data: row,
    error
  } = await supabaseAdmin.from("transactions").insert({
    user_id: userId,
    type: "manual_etransfer",
    amount: 0,
    status: "pending",
    description: `E-transfer pending — $${data.amount_usd.toFixed(2)} USD (awaiting admin confirmation)`,
    balance_after: currentBalance,
    payment_status: "waiting",
    pay_amount: data.amount_usd,
    pay_currency: "cad_etransfer"
  }).select("id").single();
  if (error) throw new Error(error.message);
  return {
    id: row.id
  };
});
const confirmSchema = object({
  transaction_id: string().uuid(),
  amount_usd: number().positive().max(1e4)
});
const adminConfirmManualDeposit_createServerFn_handler = createServerRpc({
  id: "51ba010ccb741c6348eb23d0012a0894698d5ef8567f1c9c2df174896404676c",
  name: "adminConfirmManualDeposit",
  filename: "src/lib/nowpayments.functions.ts"
}, (opts) => adminConfirmManualDeposit.__executeServer(opts));
const adminConfirmManualDeposit = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => confirmSchema.parse(input)).handler(adminConfirmManualDeposit_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const {
    data: pending,
    error: pErr
  } = await supabaseAdmin.from("transactions").select("id, user_id, type, payment_status").eq("id", data.transaction_id).single();
  if (pErr) throw new Error(pErr.message);
  if (pending.type !== "manual_etransfer") throw new Error("Not a manual e-transfer");
  if (pending.payment_status === "finished") return {
    ok: true,
    already: true
  };
  const {
    data: profile,
    error: prErr
  } = await supabaseAdmin.from("profiles").select("balance").eq("user_id", pending.user_id).single();
  if (prErr) throw new Error(prErr.message);
  const newBalance = Number(profile.balance) + data.amount_usd;
  const {
    error: balErr
  } = await supabaseAdmin.from("profiles").update({
    balance: newBalance,
    updated_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("user_id", pending.user_id);
  if (balErr) throw new Error(balErr.message);
  const {
    error: insErr
  } = await supabaseAdmin.from("transactions").insert({
    user_id: pending.user_id,
    type: "deposit",
    amount: data.amount_usd,
    status: "completed",
    description: "E-transfer confirmed by admin",
    balance_after: newBalance
  });
  if (insErr) throw new Error(insErr.message);
  await supabaseAdmin.from("transactions").update({
    payment_status: "finished",
    description: `E-transfer credited — $${data.amount_usd.toFixed(2)} USD`
  }).eq("id", data.transaction_id);
  return {
    ok: true,
    new_balance: newBalance
  };
});
const listLogsSchema = object({
  limit: number().int().min(1).max(200).default(50),
  only_failures: boolean().default(false)
});
const listWebhookLogs_createServerFn_handler = createServerRpc({
  id: "dc7921b24945922cdae72dcca24b37c9128e5d2247423f5fbb424911be35e784",
  name: "listWebhookLogs",
  filename: "src/lib/nowpayments.functions.ts"
}, (opts) => listWebhookLogs.__executeServer(opts));
const listWebhookLogs = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => listLogsSchema.parse(input)).handler(listWebhookLogs_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  let q = supabaseAdmin.from("webhook_logs").select("*").order("created_at", {
    ascending: false
  }).limit(data.limit);
  if (data.only_failures) {
    q = q.or("signature_valid.eq.false,error.not.is.null");
  }
  const {
    data: rows,
    error
  } = await q;
  if (error) throw new Error(error.message);
  return {
    rows: rows ?? []
  };
});
function sortKeysDeep(value) {
  if (Array.isArray(value)) return value.map(sortKeysDeep);
  if (value && typeof value === "object") {
    const obj = value;
    const out = {};
    for (const k of Object.keys(obj).sort()) out[k] = sortKeysDeep(obj[k]);
    return out;
  }
  return value;
}
const testWebhookSchema = object({
  payment_id: string().min(1).optional(),
  amount_usd: number().positive().max(1e4).default(1),
  status: _enum(["finished", "confirmed", "partially_paid", "failed", "expired", "waiting"]).default("finished")
});
const triggerTestWebhook_createServerFn_handler = createServerRpc({
  id: "2e84c9bf2439f492f741fe95523f277c6fc04a6ad007e6b81bd306620b13d349",
  name: "triggerTestWebhook",
  filename: "src/lib/nowpayments.functions.ts"
}, (opts) => triggerTestWebhook.__executeServer(opts));
const triggerTestWebhook = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => testWebhookSchema.parse(input)).handler(triggerTestWebhook_createServerFn_handler, async ({
  data,
  context
}) => {
  await assertAdmin(context.userId);
  const paymentId = data.payment_id ?? `TEST-${Date.now()}`;
  const payload = {
    payment_id: paymentId,
    payment_status: data.status,
    price_amount: data.amount_usd,
    price_currency: "usd",
    pay_address: "TEST_ADDRESS_TRC20",
    pay_amount: data.amount_usd,
    pay_currency: "usdttrc20",
    actually_paid: data.amount_usd,
    order_id: `boostan-test-${Date.now()}`
  };
  const sortedJson = JSON.stringify(sortKeysDeep(payload));
  const sig = createHmac("sha512", getIpnSecret()).update(sortedJson).digest("hex");
  const req = getRequest();
  const url = new URL(req.url);
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  const host = forwardedHost ?? url.host;
  const proto = forwardedProto ?? url.protocol.replace(":", "");
  const webhookUrl = `${proto}://${host}/api/public/nowpayments-webhook`;
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-nowpayments-sig": sig,
      "x-boostan-test": "1"
    },
    body: sortedJson
  });
  const body = await res.text();
  return {
    webhook_url: webhookUrl,
    payment_id: paymentId,
    response_status: res.status,
    response_body: body,
    tested_existing_payment: !!data.payment_id
  };
});
export {
  adminConfirmManualDeposit_createServerFn_handler,
  checkDepositStatus_createServerFn_handler,
  createDeposit_createServerFn_handler,
  listWebhookLogs_createServerFn_handler,
  markManualEtransfer_createServerFn_handler,
  triggerTestWebhook_createServerFn_handler
};
