// Server-only SMMFLW provider helpers. Never import from client code.
// Docs: POST https://panel.smmflw.com/api/v2 with JSON body { key, action, ... }

const SMMFLW_URL = "https://panel.smmflw.com/api/v2";

type SmmAction =
  | { action: "services" }
  | { action: "balance" }
  | { action: "add"; service: string | number; link: string; quantity: number }
  | { action: "status"; order: string | number };

export type SmmflwService = {
  service: string | number;
  name: string;
  type?: string;
  category: string;
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

  const res = await fetch(SMMFLW_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, ...payload }),
  });

  const rawText = await res.text();
  console.log(`[smmflw] action=${payload.action} status=${res.status} raw=${rawText.slice(0, 500)}`);

  if (!res.ok) {
    throw new Error(`SMMFLW HTTP ${res.status}: ${rawText.slice(0, 200)}`);
  }

  let data: any;
  try {
    data = JSON.parse(rawText);
  } catch {
    throw new Error(`SMMFLW non-JSON response: ${rawText.slice(0, 200)}`);
  }
  if (data && typeof data === "object" && "error" in data && data.error) {
    throw new Error(`SMMFLW error: ${String(data.error)}`);
  }
  return data as T;
}

// Map SMMFLW status string -> our order_status enum values.
export function mapProviderStatus(s: string | undefined): string {
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

// Pick a display tier label for the UI from rate/category heuristics.
export function pickDisplayTier(rate: number): "Starter" | "Pro" | "Premium" {
  if (rate < 1) return "Starter";
  if (rate < 5) return "Pro";
  return "Premium";
}

// Detect platform from SMMFLW category string.
export function detectPlatform(category: string): string | null {
  const c = category.toLowerCase();
  if (c.includes("instagram")) return "Instagram";
  if (c.includes("tiktok")) return "TikTok";
  if (c.includes("youtube")) return "YouTube";
  return null;
}
