const TIER_DESCRIPTIONS = {
  basic: "Cost-effective. Best for boosting low-engagement posts.",
  premium: "Balanced quality and price. Recommended for most users.",
  vip: "Highest quality, slowest drop, most realistic. For brand-critical work."
};
function tierPillClasses(tier) {
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
const TIER_LABELS = {
  basic: "Standard",
  premium: "Premium",
  vip: "Pro"
};
function tierLabel(tier) {
  if (!tier) return "Standard";
  return TIER_LABELS[tier] ?? "Standard";
}
const SERVICE_TYPE_LABEL = {
  followers: "Followers",
  likes: "Likes",
  views: "Views",
  comments: "Comments",
  story_views: "Story Views",
  subscribers: "Subscribers",
  watch_time: "Watch Time",
  shares: "Shares",
  saves: "Saves",
  reels_plays: "Reels Plays",
  other: "Other"
};
function inferServiceType(name, category) {
  const n = `${name || ""} ${category || ""}`.toLowerCase();
  if (/watch\s?time/.test(n)) return "watch_time";
  if (/story\s+(view|impression)/.test(n)) return "story_views";
  if (/reel/.test(n)) return "reels_plays";
  if (/subscriber/.test(n)) return "subscribers";
  if (/share|repost|retweet/.test(n)) return "shares";
  if (/save|bookmark/.test(n)) return "saves";
  if (/comment/.test(n)) return "comments";
  if (/follower|member/.test(n)) return "followers";
  if (/like/.test(n)) return "likes";
  if (/view|impression|play/.test(n)) return "views";
  return "other";
}
const CATEGORIES = [
  "Followers",
  "Likes",
  "Views",
  "Comments",
  "Subscribers",
  "Watch Time"
];
function inferCategory(name) {
  const n = (name || "").toLowerCase();
  if (n.includes("watch time") || n.includes("watchtime")) return "Watch Time";
  if (n.includes("subscriber")) return "Subscribers";
  if (n.includes("comment")) return "Comments";
  if (n.includes("view") || n.includes("impression")) return "Views";
  if (n.includes("like")) return "Likes";
  if (n.includes("follower") || n.includes("member")) return "Followers";
  return null;
}
function hasRefill(name, description) {
  const text = `${name || ""} ${description || ""}`.toLowerCase();
  return /\br(30|60|90|180|365)\b|refill/.test(text);
}
function hasDripFeed(name, serviceType, description) {
  const text = `${name || ""} ${description || ""} ${serviceType || ""}`.toLowerCase();
  return text.includes("drip");
}
const QTY_PRESETS = [100, 500, 1e3, 2500, 5e3, 1e4, 25e3];
function snapQuantity(n) {
  if (n < 1e3) return Math.max(1, Math.round(n / 100) * 100);
  if (n < 1e4) return Math.round(n / 500) * 500;
  return Math.round(n / 1e3) * 1e3;
}
function formatQty(n) {
  if (n >= 1e3) {
    const k = n / 1e3;
    return Number.isInteger(k) ? `${k}K` : `${k.toFixed(1)}K`;
  }
  return n.toString();
}
export {
  CATEGORIES as C,
  QTY_PRESETS as Q,
  SERVICE_TYPE_LABEL as S,
  TIER_DESCRIPTIONS as T,
  inferCategory as a,
  hasDripFeed as b,
  tierPillClasses as c,
  formatQty as f,
  hasRefill as h,
  inferServiceType as i,
  snapQuantity as s,
  tierLabel as t
};
