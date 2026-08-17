// Server-only SMMFLW provider helpers. Never import from client code.
// Docs: POST https://panel.smmflw.com/api/v2 with JSON body { key, action, ... }

const SMMFLW_URL = "https://panel.smmflw.com/api/v2";

type SmmAction =
  | { action: "services" }
  | { action: "balance" }
  | { action: "add"; service: string | number; link: string; quantity: number; is_test?: 0 | 1 }
  | { action: "status"; order: string | number };

export type SmmflwService = {
  service: string | number;
  name: string;
  type?: string;
  category?: string;
  rate: string | number;
  min: string | number;
  max: string | number;
  refill?: boolean;
  cancel?: boolean;
};

export async function smmflwCall<T = unknown>(payload: SmmAction): Promise<T> {
  const key = process.env.SMMFLW_API_KEY;
  console.log(`[smmflw] action=${payload.action} key present: ${!!key && key.length > 0}`);
  if (!key) throw new Error("SMMFLW_API_KEY is not configured");

  const form = new URLSearchParams();
  form.set("key", key);
  for (const [k, v] of Object.entries(payload)) {
    if (v !== undefined && v !== null) form.set(k, String(v));
  }

  const res = await fetch(SMMFLW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const rawText = await res.text();
  console.log(
    `[smmflw] action=${payload.action} status=${res.status} raw=${rawText.slice(0, 500)}`,
  );

  if (!res.ok) {
    throw new Error(`SMMFLW HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`SMMFLW non-JSON response: ${rawText.slice(0, 200)}`);
  }
  // `action=services` legitimately returns a top-level ARRAY; other actions
  // return an object. Only reject responses that are neither.
  if (!data || typeof data !== "object") {
    throw new Error(`SMMFLW unexpected response for ${payload.action}: ${rawText.slice(0, 200)}`);
  }
  if (!Array.isArray(data) && "error" in data && data.error) {
    throw new Error(`SMMFLW error: ${String(data.error)}`);
  }
  return data as T;
}

// Map SMMFLW status string -> our order_status enum values.
export function mapProviderStatus(s: string | undefined): string {
  const v = String(s ?? "")
    .toLowerCase()
    .replace(/\s+/g, "_");
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

// Pick a display tier label for the UI from rate/category heuristics.
export function pickDisplayTier(rate: number): "Starter" | "Pro" | "Premium" {
  if (rate < 1) return "Starter";
  if (rate < 5) return "Pro";
  return "Premium";
}

// Detect platform from the SMMFLW category string or, when absent, the name.
//
// Order matters: check the most specific tokens first so "Instagram Reels"
// doesn't fall through to a looser match. Anything unrecognised returns null
// and is skipped at sync time rather than landing in the catalog untyped.
export function detectPlatform(...sources: Array<string | undefined>): string | null {
  // Providers differ: some return a `category` field, others (smmflw) omit it
  // entirely and only encode the platform in the service name. Match against
  // whatever we were given so neither shape silently yields zero services.
  const c = sources.filter(Boolean).join(" ").toLowerCase();
  if (c.includes("instagram")) return "Instagram";
  if (c.includes("tiktok") || c.includes("tik tok")) return "TikTok";
  if (c.includes("youtube") || c.includes("you tube")) return "YouTube";
  // Telegram matters disproportionately for the Persian-speaking market.
  if (c.includes("telegram")) return "Telegram";
  if (c.includes("spotify")) return "Spotify";
  if (c.includes("twitter") || /\bx\b\s*\(twitter\)/.test(c)) return "X";
  if (c.includes("facebook")) return "Facebook";
  if (c.includes("linkedin")) return "LinkedIn";
  if (c.includes("threads")) return "Threads";
  if (c.includes("soundcloud")) return "SoundCloud";
  return null;
}
