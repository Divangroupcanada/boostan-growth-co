import { c as createServerRpc } from "./createServerRpc-BfVdOdWe.mjs";
import { a as createServerFn } from "./server-B-gRx3ND.mjs";
import { a as attachSupabaseAuth, r as requireSupabaseAuth } from "./auth-client-middleware-B9dl4-ow.mjs";
import { s as supabaseAdmin } from "./client.server-j8IJ-cKj.mjs";
import { i as inferServiceType } from "./service-tier-Br2B6ZKx.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { f as object, k as boolean, n as number, d as string } from "../_libs/zod.mjs";
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
import "crypto";
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
const SMMFLW_URL = "https://panel.smmflw.com/api/v2";
async function smmflwCall(payload) {
  const key = process.env.SMMFLW_API_KEY;
  console.log(`[smmflw] action=${payload.action} key present: ${!!key && key.length > 0}`);
  if (!key) throw new Error("SMMFLW_API_KEY is not configured");
  const form = new URLSearchParams();
  form.set("key", key);
  for (const [k, v] of Object.entries(payload)) {
    if (v !== void 0 && v !== null) form.set(k, String(v));
  }
  const res = await fetch(SMMFLW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString()
  });
  const rawText = await res.text();
  console.log(`[smmflw] action=${payload.action} status=${res.status} raw=${rawText.slice(0, 500)}`);
  if (!res.ok) {
    throw new Error(`SMMFLW HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  }
  let data;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`SMMFLW non-JSON response: ${rawText.slice(0, 200)}`);
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new Error(`SMMFLW unexpected response for ${payload.action}: ${rawText.slice(0, 200)}`);
  }
  if (data && typeof data === "object" && "error" in data && data.error) {
    throw new Error(`SMMFLW error: ${String(data.error)}`);
  }
  return data;
}
function mapProviderStatus(s) {
  const v = String(s ?? "").toLowerCase().replace(/\s+/g, "_");
  switch (v) {
    case "completed":
      return "completed";
    case "in_progress":
    case "processing":
      return "in_progress";
    case "pending":
      return "pending";
    case "partial":
      return "partial";
    case "canceled":
    case "cancelled":
      return "canceled";
    case "failed":
    case "error":
      return "failed";
    default:
      return "pending";
  }
}
function pickDisplayTier(rate) {
  if (rate < 1) return "Starter";
  if (rate < 5) return "Pro";
  return "Premium";
}
function detectPlatform(category) {
  const c = category.toLowerCase();
  if (c.includes("instagram")) return "Instagram";
  if (c.includes("tiktok")) return "TikTok";
  if (c.includes("youtube")) return "YouTube";
  return null;
}
async function assertAdmin(userId) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}
async function getSettings() {
  const {
    data,
    error
  } = await supabaseAdmin.from("settings").select("markup_percentage, fixed_fee, min_deposit").eq("id", true).single();
  if (error) throw new Error(error.message);
  return {
    markup: Number(data.markup_percentage),
    fee: Number(data.fixed_fee),
    minDeposit: Number(data.min_deposit)
  };
}
function applyMarkup(baseRate, markupPct, fee) {
  const marked = baseRate * (1 + markupPct / 100) + fee;
  return Math.round(marked * 100) / 100;
}
const syncServices_createServerFn_handler = createServerRpc({
  id: "2cc2529d722680413988547990e4c5c27cb45c7d102e265dcf9694a3425e006e",
  name: "syncServices",
  filename: "src/lib/smmflw.functions.ts"
}, (opts) => syncServices.__executeServer(opts));
const syncServices = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).handler(syncServices_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const {
    markup,
    fee
  } = await getSettings();
  const services = await smmflwCall({
    action: "services"
  });
  if (!Array.isArray(services)) throw new Error("Unexpected services payload");
  let upserts = 0;
  const now = (/* @__PURE__ */ new Date()).toISOString();
  const rows = [];
  for (const s of services) {
    const platform = detectPlatform(String(s.category ?? ""));
    if (!platform) continue;
    const baseRate = Number(s.rate);
    if (!Number.isFinite(baseRate)) continue;
    const marked = applyMarkup(baseRate, markup, fee);
    rows.push({
      smmflw_id: String(s.service),
      provider_service_id: String(s.service),
      name: s.name,
      display_name: s.name,
      platform,
      service_type: inferServiceType(s.name, String(s.category ?? "")),
      base_rate: baseRate,
      marked_up_rate: marked,
      rate_per_1000: marked,
      min_quantity: Math.max(1, parseInt(String(s.min), 10) || 100),
      max_quantity: Math.max(1, parseInt(String(s.max), 10) || 1e5),
      display_tier: pickDisplayTier(marked),
      active: true,
      synced_at: now,
      updated_at: now
    });
  }
  if (rows.length) {
    const {
      error
    } = await supabaseAdmin.from("services").upsert(rows, {
      onConflict: "smmflw_id"
    });
    if (error) throw new Error(error.message);
    upserts = rows.length;
  }
  await supabaseAdmin.from("settings").update({
    last_services_sync: now
  }).eq("id", true);
  return {
    synced: upserts,
    total_from_provider: services.length
  };
});
const placeOrderSchema = object({
  serviceId: string().uuid(),
  link: string().min(1).max(500),
  quantity: number().int().min(1).max(1e7),
  testMode: boolean().default(true)
});
const placeOrder_createServerFn_handler = createServerRpc({
  id: "1d8f124e3efcbf67e658a83cead1bf8f9c4d742b5bdbfc2913de523c02caad60",
  name: "placeOrder",
  filename: "src/lib/smmflw.functions.ts"
}, (opts) => placeOrder.__executeServer(opts));
const placeOrder = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => placeOrderSchema.parse(input)).handler(placeOrder_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase,
    userId
  } = context;
  const {
    data: service,
    error: svcErr
  } = await supabase.from("services").select("id, smmflw_id, marked_up_rate, base_rate, rate_per_1000, min_quantity, max_quantity, name, active").eq("id", data.serviceId).maybeSingle();
  if (svcErr) throw new Error(svcErr.message);
  if (!service || !service.active) throw new Error("Service not available");
  if (data.quantity < service.min_quantity || data.quantity > service.max_quantity) {
    throw new Error(`Quantity must be between ${service.min_quantity} and ${service.max_quantity}`);
  }
  const rate = Number(service.marked_up_rate ?? service.rate_per_1000);
  const baseRate = Number(service.base_rate ?? rate);
  const charge = Math.round(rate * data.quantity / 1e3 * 100) / 100;
  const cost = Math.round(baseRate * data.quantity / 1e3 * 100) / 100;
  const {
    data: orderId,
    error: rpcErr
  } = await supabase.rpc("place_order_atomic", {
    _service_id: data.serviceId,
    _link: data.link,
    _quantity: data.quantity,
    _charge: charge,
    _cost: cost,
    _is_test: data.testMode
  });
  if (rpcErr) throw new Error(rpcErr.message);
  if (!orderId) throw new Error("Order creation failed");
  if (!service.smmflw_id) throw new Error("Service missing provider id");
  const resp = await smmflwCall({
    action: "add",
    service: service.smmflw_id,
    link: data.link,
    quantity: data.quantity,
    ...data.testMode ? {
      is_test: 1
    } : {}
  });
  if (!resp.order) throw new Error("Provider did not return an order id");
  const providerOrderId = String(resp.order);
  const providerStatus = "in_progress";
  const {
    error: updErr
  } = await supabaseAdmin.from("orders").update({
    smmflw_order_id: providerOrderId,
    provider_order_id: providerOrderId,
    status: providerStatus
  }).eq("id", orderId);
  if (updErr) throw new Error(updErr.message);
  return {
    orderId,
    providerOrderId,
    testMode: data.testMode
  };
});
const checkStatusSchema = object({
  orderId: string().uuid()
});
const checkOrderStatus_createServerFn_handler = createServerRpc({
  id: "f60f79903a085a8aefc4c1ce566953f1a3714f695dd67625718bc704358bd59b",
  name: "checkOrderStatus",
  filename: "src/lib/smmflw.functions.ts"
}, (opts) => checkOrderStatus.__executeServer(opts));
const checkOrderStatus = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => checkStatusSchema.parse(input)).handler(checkOrderStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const {
    supabase
  } = context;
  const {
    data: order,
    error: oErr
  } = await supabase.from("orders").select("id, smmflw_order_id, provider_order_id, status").eq("id", data.orderId).maybeSingle();
  if (oErr) throw new Error(oErr.message);
  if (!order) throw new Error("Order not found");
  const providerId = order.smmflw_order_id ?? order.provider_order_id;
  if (!providerId) throw new Error("Order has no provider id");
  const resp = await smmflwCall({
    action: "status",
    order: providerId
  });
  const status = mapProviderStatus(resp.status);
  const start_count = resp.start_count != null ? parseInt(String(resp.start_count), 10) : null;
  const remains = resp.remains != null ? parseInt(String(resp.remains), 10) : null;
  const {
    error: updErr
  } = await supabaseAdmin.from("orders").update({
    status,
    start_count,
    remains
  }).eq("id", data.orderId);
  if (updErr) throw new Error(updErr.message);
  return {
    status,
    start_count,
    remains,
    test: false
  };
});
const getProviderBalance_createServerFn_handler = createServerRpc({
  id: "da19624aa9037b62b7745093213038a00932614bf2baee2d83619ab6b881f798",
  name: "getProviderBalance",
  filename: "src/lib/smmflw.functions.ts"
}, (opts) => getProviderBalance.__executeServer(opts));
const getProviderBalance = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).handler(getProviderBalance_createServerFn_handler, async ({
  context
}) => {
  await assertAdmin(context.userId);
  const resp = await smmflwCall({
    action: "balance"
  });
  console.log(`[smmflw] balance parsed: ${JSON.stringify(resp)}`);
  if (resp.balance === void 0 || resp.balance === null) {
    throw new Error(resp.message ?? `SMMFLW balance request failed: ${JSON.stringify(resp)}`);
  }
  const balance = parseFloat(String(resp.balance));
  if (!Number.isFinite(balance)) {
    throw new Error(`SMMFLW returned invalid balance: ${JSON.stringify(resp)}`);
  }
  return {
    balance,
    currency: String(resp.currency ?? "USD"),
    raw: resp
  };
});
export {
  checkOrderStatus_createServerFn_handler,
  getProviderBalance_createServerFn_handler,
  placeOrder_createServerFn_handler,
  syncServices_createServerFn_handler
};
