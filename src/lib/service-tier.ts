// Shared service helpers — tier badging, category inference, feature flags.

export type Tier = "basic" | "premium" | "vip";

export const TIER_DESCRIPTIONS: Record<Tier, string> = {
  basic: "Cost-effective. Best for boosting low-engagement posts.",
  premium: "Balanced quality and price. Recommended for most users.",
  vip: "Highest quality, slowest drop, most realistic. For brand-critical work.",
};

export function tierPillClasses(tier: Tier | null | undefined): string {
  switch (tier) {
    case "vip":
      return "bg-[var(--accent)] text-white";
    case "premium":
      return "bg-[var(--accent-subtle)] text-[var(--accent)]";
    case "basic":
    default:
      return "bg-[var(--bg-surface-3)] text-[var(--text-secondary)]";
  }
}

export function tierLabel(tier: Tier | null | undefined): string {
  if (!tier) return "Standard";
  return tier === "vip" ? "VIP" : tier[0].toUpperCase() + tier.slice(1);
}

export const CATEGORIES = [
  "Followers",
  "Likes",
  "Views",
  "Comments",
  "Subscribers",
  "Watch Time",
] as const;
export type Category = (typeof CATEGORIES)[number];

/** Infer a coarse category from a service's display name. */
export function inferCategory(name: string): Category | null {
  const n = (name || "").toLowerCase();
  if (n.includes("watch time") || n.includes("watchtime")) return "Watch Time";
  if (n.includes("subscriber")) return "Subscribers";
  if (n.includes("comment")) return "Comments";
  if (n.includes("view") || n.includes("impression")) return "Views";
  if (n.includes("like")) return "Likes";
  if (n.includes("follower") || n.includes("member")) return "Followers";
  return null;
}

/** True if the service likely refills drops (followers + R-tag indicators). */
export function hasRefill(name: string, description?: string | null): boolean {
  const text = `${name || ""} ${description || ""}`.toLowerCase();
  return /\br(30|60|90|180|365)\b|refill/.test(text);
}

/** True if the service supports drip-feed delivery. */
export function hasDripFeed(name: string, serviceType?: string | null, description?: string | null): boolean {
  const text = `${name || ""} ${description || ""} ${serviceType || ""}`.toLowerCase();
  return text.includes("drip");
}

export const QTY_PRESETS = [100, 500, 1000, 2500, 5000, 10000, 25000] as const;

/** Snap an arbitrary quantity to a "nice" round number. */
export function snapQuantity(n: number): number {
  if (n < 1000) return Math.max(1, Math.round(n / 100) * 100);
  if (n < 10000) return Math.round(n / 500) * 500;
  return Math.round(n / 1000) * 1000;
}

export function formatQty(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return n.toString();
}
