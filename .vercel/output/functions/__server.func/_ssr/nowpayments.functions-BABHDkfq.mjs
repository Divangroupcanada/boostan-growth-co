import { c as createSsrRpc } from "./createSsrRpc-CdhWFolZ.mjs";
import { a as createServerFn } from "./server-B-gRx3ND.mjs";
import { a as attachSupabaseAuth, r as requireSupabaseAuth } from "./auth-client-middleware-B9dl4-ow.mjs";
import { f as object, n as number, d as string, k as boolean, _ as _enum } from "../_libs/zod.mjs";
const createDepositSchema = object({
  amount_usd: number().positive().max(1e4)
});
const createDeposit = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => createDepositSchema.parse(input)).handler(createSsrRpc("a3f46637b482306e515f028fc8375ca1977ca5077bfacbbed17a1163376c7935"));
const checkSchema = object({
  payment_id: string().min(1)
});
createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => checkSchema.parse(input)).handler(createSsrRpc("e1af295702a143ff2280038af37c51808bb42db2ac786d065b5c9cbb861ac748"));
const markEtransferSchema = object({
  amount_usd: number().positive().max(1e4)
});
const markManualEtransfer = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => markEtransferSchema.parse(input)).handler(createSsrRpc("8f7b989abb69a2670f2232bff153b37987b8b8e96d0eea38f9da4be4d63d45b2"));
const confirmSchema = object({
  transaction_id: string().uuid(),
  amount_usd: number().positive().max(1e4)
});
const adminConfirmManualDeposit = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => confirmSchema.parse(input)).handler(createSsrRpc("51ba010ccb741c6348eb23d0012a0894698d5ef8567f1c9c2df174896404676c"));
const listLogsSchema = object({
  limit: number().int().min(1).max(200).default(50),
  only_failures: boolean().default(false)
});
const listWebhookLogs = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => listLogsSchema.parse(input)).handler(createSsrRpc("dc7921b24945922cdae72dcca24b37c9128e5d2247423f5fbb424911be35e784"));
const testWebhookSchema = object({
  payment_id: string().min(1).optional(),
  amount_usd: number().positive().max(1e4).default(1),
  status: _enum(["finished", "confirmed", "partially_paid", "failed", "expired", "waiting"]).default("finished")
});
const triggerTestWebhook = createServerFn({
  method: "POST"
}).middleware([attachSupabaseAuth, requireSupabaseAuth]).inputValidator((input) => testWebhookSchema.parse(input)).handler(createSsrRpc("2e84c9bf2439f492f741fe95523f277c6fc04a6ad007e6b81bd306620b13d349"));
export {
  adminConfirmManualDeposit as a,
  createDeposit as c,
  listWebhookLogs as l,
  markManualEtransfer as m,
  triggerTestWebhook as t
};
