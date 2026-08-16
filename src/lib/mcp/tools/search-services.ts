import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_services",
  title: "Search services",
  description:
    "Search the Boostan catalog of social growth services (Instagram, TikTok, YouTube) with pricing, tier and quantity limits.",
  inputSchema: {
    query: z.string().trim().optional().describe("Text to match against the service name."),
    platform: z
      .string()
      .trim()
      .optional()
      .describe("Platform filter, e.g. instagram, tiktok, youtube."),
    service_type: z
      .string()
      .trim()
      .optional()
      .describe("Service type filter, e.g. followers, likes, views."),
    limit: z.number().int().min(1).max(50).default(10).describe("Max results to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, platform, service_type, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("services")
      .select("id,name,platform,service_type,tier,rate_per_1000,min_quantity,max_quantity,is_featured")
      .eq("active", true)
      .order("is_featured", { ascending: false })
      .order("rate_per_1000", { ascending: true })
      .limit(limit ?? 10);

    if (query) q = q.ilike("name", `%${query}%`);
    if (platform) q = q.ilike("platform", platform);
    if (service_type) q = q.ilike("service_type", service_type);

    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { services: data ?? [] },
    };
  },
});
