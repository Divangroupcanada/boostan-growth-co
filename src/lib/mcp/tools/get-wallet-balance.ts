import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "get_wallet_balance",
  title: "Get wallet balance",
  description: "Return the signed-in Boostan user's wallet balance in USD.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("profiles")
      .select("balance,display_name")
      .eq("user_id", ctx.getUserId()!)
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const balance = Number(data?.balance ?? 0);
    return {
      content: [{ type: "text", text: `Wallet balance: $${balance.toFixed(2)} USD` }],
      structuredContent: { balance, currency: "USD" },
    };
  },
});
