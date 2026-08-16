import { auth, defineMcp } from "@lovable.dev/mcp-js";
import searchServices from "./tools/search-services";
import getWalletBalance from "./tools/get-wallet-balance";
import listOrders from "./tools/list-orders";
import getOrder from "./tools/get-order";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "boostan",
  title: "Boostan",
  version: "0.1.0",
  instructions:
    "Tools for Boostan, a social growth panel. Search the service catalog, check the signed-in user's wallet balance, and review their orders.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [searchServices, getWalletBalance, listOrders, getOrder],
});
