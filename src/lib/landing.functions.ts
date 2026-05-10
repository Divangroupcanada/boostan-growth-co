import { createServerFn } from "@tanstack/react-start";
import { getSupabaseServerClient } from "@/integrations/supabase/client.server";

export type LandingService = {
  id: string;
  platform: string;
  name: string;
  marked_up_rate: number;
  min_quantity: number;
  max_quantity: number;
  display_tier: string | null;
};

export const getLandingServices = createServerFn({ method: "GET" }).handler(
  async (): Promise<Record<string, LandingService[]>> => {
    const supabase = getSupabaseServerClient();
    const platforms = ["Instagram", "TikTok", "YouTube"];
    const result: Record<string, LandingService[]> = {};
    for (const p of platforms) {
      const { data } = await supabase
        .from("services")
        .select("id, platform, display_name, name, marked_up_rate, min_quantity, max_quantity, display_tier")
        .eq("active", true)
        .eq("platform", p)
        .order("marked_up_rate", { ascending: true })
        .limit(3);
      result[p] = (data || []).map((s: any) => ({
        id: s.id,
        platform: s.platform,
        name: s.display_name || s.name,
        marked_up_rate: Number(s.marked_up_rate),
        min_quantity: s.min_quantity,
        max_quantity: s.max_quantity,
        display_tier: s.display_tier,
      }));
    }
    return result;
  },
);
