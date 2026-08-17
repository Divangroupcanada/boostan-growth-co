import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { Tier } from "@/lib/service-tier";

type TierInfo = {
  key: Tier;
  label: string;
  bullets: string[];
};

const TIERS: TierInfo[] = [
  {
    key: "basic",
    label: "Standard",
    bullets: [
      "Real-looking accounts",
      "60-second start time",
      "7-day auto-refill (followers only)",
    ],
  },
  {
    key: "premium",
    label: "Premium",
    bullets: [
      "Active accounts with profile activity",
      "30-second start time",
      "30-day auto-refill",
      "Drip-feed delivery available",
    ],
  },
  {
    key: "vip",
    label: "Pro",
    bullets: [
      "Premium quality, longer retention",
      "Instant start",
      "Extended refill where supported",
      "Best for serious accounts",
    ],
  },
];

export function TierComparison({ startingFrom }: { startingFrom: Partial<Record<Tier, number>> }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div>
          <div className="text-sm font-medium text-[var(--text-primary)]">
            Choose your quality tier
          </div>
          <div className="text-xs text-[var(--text-tertiary)]">
            {open ? "Hide tier details" : "Learn about our tiers"}
          </div>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[var(--text-secondary)] transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="grid gap-4 border-t border-[var(--border-subtle)] p-5 md:grid-cols-3">
          {TIERS.map((t) => {
            const price = startingFrom[t.key];
            const isPro = t.key === "vip";
            return (
              <div
                key={t.key}
                className={`rounded-xl border p-6 ${
                  isPro
                    ? "border-[var(--accent)] bg-[var(--bg-surface-2)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-surface-1)]"
                }`}
              >
                <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
                  {t.label}
                </div>
                <div className="mt-2 text-xs text-[var(--text-secondary)]">
                  Starting from{" "}
                  <span className="text-[var(--text-primary)] tabular">
                    ${(price ?? defaultPrice(t.key)).toFixed(2)}
                  </span>{" "}
                  / 1k
                </div>
                <ul className="mt-4 space-y-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-secondary)]">
                  {t.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function defaultPrice(t: Tier): number {
  return t === "basic" ? 1.5 : t === "premium" ? 3.0 : 7.0;
}
