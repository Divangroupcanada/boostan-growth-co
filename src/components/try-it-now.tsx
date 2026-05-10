import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, Info } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import { supabase } from "@/integrations/supabase/client";
import {
  type Tier,
  type Category,
  CATEGORIES,
  TIER_DESCRIPTIONS,
  QTY_PRESETS,
  inferCategory,
  snapQuantity,
  formatQty,
  tierLabel,
} from "@/lib/service-tier";

const PLATFORMS = [
  { key: "Instagram", count: 75, Icon: FaInstagram },
  { key: "TikTok", count: 21, Icon: FaTiktok },
  { key: "YouTube", count: 47, Icon: FaYoutube },
] as const;

type PlatformKey = (typeof PLATFORMS)[number]["key"];

type Svc = {
  id: string;
  platform: string;
  name: string;
  display_name: string | null;
  marked_up_rate: number;
  min_quantity: number;
  max_quantity: number;
  tier: Tier | null;
  smmflw_id: string | null;
  category: Category | null;
};

export function TryItNow() {
  const [all, setAll] = useState<Svc[]>([]);
  const [platform, setPlatform] = useState<PlatformKey>("Instagram");
  const [category, setCategory] = useState<Category>("Followers");
  const [qty, setQty] = useState<number>(1000);
  const [tier, setTier] = useState<Tier>("premium");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("services")
        .select("id, platform, name, display_name, marked_up_rate, min_quantity, max_quantity, tier, smmflw_id")
        .eq("active", true);
      if (!alive || !data) return;
      const mapped = data.map((s: any): Svc => ({
        id: s.id,
        platform: s.platform,
        name: s.name,
        display_name: s.display_name,
        marked_up_rate: Number(s.marked_up_rate ?? 0),
        min_quantity: s.min_quantity,
        max_quantity: s.max_quantity,
        tier: s.tier,
        smmflw_id: s.smmflw_id,
        category: inferCategory(s.display_name || s.name),
      }));
      setAll(mapped);
    })();
    return () => { alive = false; };
  }, []);

  // Categories that exist for the selected platform
  const availableCategories = useMemo(() => {
    const set = new Set<Category>();
    for (const s of all) {
      if (s.platform === platform && s.category) set.add(s.category);
    }
    return CATEGORIES.filter((c) => set.has(c));
  }, [all, platform]);

  // If selected category not available on this platform, fall back to first available
  useEffect(() => {
    if (availableCategories.length && !availableCategories.includes(category)) {
      setCategory(availableCategories[0]);
    }
  }, [availableCategories, category]);

  // Find matched service: same platform + category + tier, qty within range, cheapest
  const match = useMemo(() => {
    const candidates = all.filter(
      (s) => s.platform === platform && s.category === category && s.tier === tier,
    );
    const inRange = candidates.filter((s) => qty >= s.min_quantity && qty <= s.max_quantity);
    if (inRange.length === 0) return null;
    return inRange.reduce((a, b) => (a.marked_up_rate <= b.marked_up_rate ? a : b));
  }, [all, platform, category, tier, qty]);

  const price = match ? (match.marked_up_rate * qty) / 1000 : null;

  // Quantity slider bounds: from cheapest min to most-expensive max for the category+platform
  const sliderBounds = useMemo(() => {
    const c = all.filter((s) => s.platform === platform && s.category === category);
    if (!c.length) return { min: 100, max: 25000 };
    return {
      min: Math.min(...c.map((s) => s.min_quantity)),
      max: Math.max(...c.map((s) => s.max_quantity)),
    };
  }, [all, platform, category]);

  return (
    <section className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <div className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]">Try it now</div>
      <div className="mb-10 max-w-2xl">
        <h2 className="text-3xl tracking-tight md:text-4xl">See instant pricing.</h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          Configure an order across our 143 services. No sign-up required to browse.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* LEFT — picker */}
        <div className="space-y-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 md:p-8">
          {/* Step 1 — platform */}
          <Step n={1} label="Pick a platform">
            <div className="grid gap-3 sm:grid-cols-3">
              {PLATFORMS.map((p) => {
                const active = p.key === platform;
                return (
                  <button
                    key={p.key}
                    onClick={() => setPlatform(p.key)}
                    className={`flex items-center gap-3 rounded-lg border p-4 transition-colors duration-200 ${
                      active
                        ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--text-primary)]"
                        : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]"
                    }`}
                  >
                    <p.Icon className={`h-5 w-5 ${active ? "text-[var(--accent)]" : ""}`} />
                    <div className="text-left">
                      <div className="text-sm font-medium text-[var(--text-primary)]">{p.key}</div>
                      <div className="text-xs text-[var(--text-tertiary)]">{p.count} services</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </Step>

          {/* Step 2 — category */}
          <Step n={2} label="Choose a category">
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((c) => (
                <Chip key={c} active={c === category} onClick={() => setCategory(c)}>
                  {c}
                </Chip>
              ))}
            </div>
          </Step>

          {/* Step 3 — quantity */}
          <Step n={3} label="How many?">
            <div className="flex flex-wrap gap-2">
              {QTY_PRESETS.map((q) => (
                <Chip key={q} active={q === qty} onClick={() => setQty(q)}>
                  {formatQty(q)}
                </Chip>
              ))}
            </div>
            <div className="mt-4">
              <input
                type="range"
                min={sliderBounds.min}
                max={sliderBounds.max}
                step={100}
                value={Math.min(Math.max(qty, sliderBounds.min), sliderBounds.max)}
                onChange={(e) => setQty(snapQuantity(Number(e.target.value)))}
                className="w-full accent-[var(--accent)]"
              />
              <div className="mt-1 flex justify-between text-xs text-[var(--text-tertiary)] tabular">
                <span>{formatQty(sliderBounds.min)}</span>
                <span className="text-[var(--text-primary)]">{qty.toLocaleString()}</span>
                <span>{formatQty(sliderBounds.max)}</span>
              </div>
            </div>
          </Step>

          {/* Step 4 — tier */}
          <Step n={4} label="Quality tier">
            <div className="inline-flex rounded-lg border border-[var(--border-default)] p-1">
              {(["basic", "premium", "vip"] as Tier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  title={TIER_DESCRIPTIONS[t]}
                  className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm transition-colors duration-200 ${
                    t === tier
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tierLabel(t)}
                  <Info className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">{TIER_DESCRIPTIONS[tier]}</p>
          </Step>
        </div>

        {/* RIGHT — result */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 lg:sticky lg:top-24 lg:self-start">
          <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">Estimate</div>
          {match && price !== null ? (
            <>
              <div className="mt-3 line-clamp-2 text-sm font-medium text-[var(--text-primary)]">
                {match.display_name || match.name}
              </div>
              {match.smmflw_id && (
                <div className="mt-1 font-mono text-[10px] text-[var(--text-tertiary)]">
                  ref · {match.smmflw_id}
                </div>
              )}
              <div className="mt-6 tabular text-5xl font-medium tracking-tight text-[var(--text-primary)]">
                ${price.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-[var(--text-tertiary)]">
                {qty.toLocaleString()} × ${match.marked_up_rate.toFixed(2)} / 1,000
              </div>

              <ul className="mt-6 space-y-2 border-t border-[var(--border-subtle)] pt-5 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--success)]" /> Starts in &lt;30 seconds
                </li>
                {category === "Followers" && (
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[var(--success)]" /> 30-day auto-refill
                  </li>
                )}
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[var(--success)]" /> No subscription
                </li>
              </ul>

              <Link
                to="/signup"
                search={{ platform, category, qty, tier } as any}
                onClick={() => {
                  try {
                    sessionStorage.setItem(
                      "boostan:order-prefill",
                      JSON.stringify({ platform, category, qty, tier, serviceId: match.id }),
                    );
                  } catch {}
                }}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
              >
                Sign up & order — $25 minimum <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          ) : (
            <>
              <div className="mt-6 text-2xl text-[var(--text-secondary)]">No match</div>
              <p className="mt-2 text-sm text-[var(--text-tertiary)]">
                Adjust quantity to fit available service ranges (try {sliderBounds.min.toLocaleString()} – {sliderBounds.max.toLocaleString()}), or pick another tier.
              </p>
              <button
                disabled
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--bg-surface-2)] px-5 py-3 text-sm font-medium text-[var(--text-disabled)]"
              >
                Adjust to continue
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Step({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--bg-surface-2)] text-[10px] tabular text-[var(--text-tertiary)]">
          {n}
        </span>
        <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
      </div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3.5 py-1.5 text-sm transition-colors duration-200 ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}
