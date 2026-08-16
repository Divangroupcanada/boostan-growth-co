import { c as createSsrRpc } from "./createSsrRpc-CdhWFolZ.mjs";
import { a as createServerFn } from "./server-B-gRx3ND.mjs";
import { a as attachSupabaseAuth, r as requireSupabaseAuth } from "./auth-client-middleware-B9dl4-ow.mjs";
import { f as object, d as string, k as boolean, n as number } from "../_libs/zod.mjs";
const syncServices = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).handler(createSsrRpc("2cc2529d722680413988547990e4c5c27cb45c7d102e265dcf9694a3425e006e"));
const placeOrderSchema = object({
  serviceId: string().uuid(),
  link: string().min(1).max(500),
  quantity: number().int().min(1).max(1e7),
  testMode: boolean().default(true)
});
const placeOrder = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => placeOrderSchema.parse(input)).handler(createSsrRpc("1d8f124e3efcbf67e658a83cead1bf8f9c4d742b5bdbfc2913de523c02caad60"));
const checkStatusSchema = object({
  orderId: string().uuid()
});
const checkOrderStatus = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => checkStatusSchema.parse(input)).handler(createSsrRpc("f60f79903a085a8aefc4c1ce566953f1a3714f695dd67625718bc704358bd59b"));
const getProviderBalance = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).handler(createSsrRpc("da19624aa9037b62b7745093213038a00932614bf2baee2d83619ab6b881f798"));
export {
  checkOrderStatus as c,
  getProviderBalance as g,
  placeOrder as p,
  syncServices as s
};
