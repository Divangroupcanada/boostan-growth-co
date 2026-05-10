import { Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import {
  type Tier,
  tierPillClasses,
  tierLabel,
  inferCategory,
  hasRefill,
  hasDripFeed,
} from "@/lib/service-tier";

export type ServiceCardData = {
  id: string;
  platform: string;
  name: string;
  display_name?: string | null;
  description?: string | null;
  service_type?: string | null;
  marked_up_rate: number | null;
  rate_per_1000: number;
  min_quantity: number;
  max_quantity: number;
  tier?: Tier | null;
};

const PLATFORM_ICON: Record<string, any> = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  YouTube: FaYoutube,
  "Twitter / X": FaXTwitter,
};

export function ServiceCard({ s }: { s: ServiceCardData }) {
  const Icon = PLATFORM_ICON[s.platform] ?? FaInstagram;
  const rate = Number(s.marked_up_rate ?? s.rate_per_1000);
  const category = inferCategory(s.display_name || s.name);
  const refills = hasRefill(s.name, s.description);
  const drips = hasDripFeed(s.name, s.service_type, s.description);
  const isFollowers = category === "Followers";

  return (
    <div className="group flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 transition-colors hover:border-[var(--border-default)] hover:bg-[var(--bg-surface-2)]">
      <div className="flex items-start justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-md bg-[var(--bg-surface-2)] text-[var(--text-primary)] group-hover:bg-[var(--bg-surface-3)]">
          <Icon className="h-4 w-4" />
        </span>
        {s.tier && (
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${tierPillClasses(s.tier)}`}
          >
            {tierLabel(s.tier)}
          </span>
        )}
      </div>

      <div className="mt-5 line-clamp-2 min-h-[44px] text-sm font-medium text-[var(--text-primary)]">
        {s.display_name || s.name}
      </div>
      {category && (
        <div className="mt-1 text-xs text-[var(--text-tertiary)]">{s.platform} · {category}</div>
      )}

      <div className="mt-5">
        <div className="text-xs text-[var(--text-tertiary)]">per 1,000</div>
        <div className="tabular text-2xl text-[var(--text-primary)]">${rate.toFixed(2)}</div>
        <div className="mt-1 text-xs text-[var(--text-tertiary)]">
          Min {s.min_quantity.toLocaleString()} · Max {s.max_quantity.toLocaleString()}
        </div>
      </div>

      <ul className="mt-5 space-y-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-secondary)]">
        <li className="flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-[var(--success)]" />
          Starts in &lt;30 seconds
        </li>
        {isFollowers && (
          <li className="flex items-center gap-2">
            {refills ? (
              <>
                <Check className="h-3.5 w-3.5 text-[var(--success)]" />
                30-day refill on drops
              </>
            ) : (
              <span className="text-[var(--text-tertiary)]">Refill: case-by-case</span>
            )}
          </li>
        )}
        {drips && (
          <li className="flex items-center gap-2">
            <Check className="h-3.5 w-3.5 text-[var(--success)]" />
            Drip-feed delivery available
          </li>
        )}
      </ul>

      <div className="mt-6 flex-1" />
      <Link
        to="/new-order"
        search={{ service: s.id } as any}
        className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-default)] bg-transparent px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white"
      >
        Order <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
