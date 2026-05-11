import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo, useState } from "react";
import { ServiceCard, type ServiceCardData } from "@/components/service-card";
import {
  type ServiceType,
  type Tier,
  SERVICE_TYPE_LABEL,
} from "@/lib/service-tier";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "All services — Boostan" },
      { name: "description", content: "143 premium services across Instagram, TikTok, and YouTube. Click any to order." },
    ],
  }),
});

const PLATFORMS = ["Instagram", "TikTok", "YouTube"] as const;
const TIER_RANK: Record<string, number> = { vip: 0, premium: 1, basic: 2 };

function ServicesPage() {
  const [platform, setPlatform] = useState<string | null>(null);
  const [stype, setStype] = useState<string | null>(null);

  // Hydrate persisted platform on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("boostan-services-platform");
      if (saved !== null) setPlatform(saved === "all" ? null : saved);
    } catch {}
  }, []);

  // Hydrate persisted type when platform changes.
  useEffect(() => {
    try {
      const key = `boostan-services-type-${platform ?? "all"}`;
      const saved = localStorage.getItem(key);
      setStype(saved && saved !== "all" ? saved : null);
    } catch {}
  }, [platform]);

  const setPlatformPersist = (p: string | null) => {
    setPlatform(p);
    try { localStorage.setItem("boostan-services-platform", p ?? "all"); } catch {}
  };
  const setStypePersist = (t: string | null) => {
    setStype(t);
    try { localStorage.setItem(`boostan-services-type-${platform ?? "all"}`, t ?? "all"); } catch {}
  };

  const { data: services } = useQuery({
    queryKey: ["services-public"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("active", true);
      return (data ?? []) as any[];
    },
  });

  const all = services ?? [];

  const platformCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of all) m[s.platform] = (m[s.platform] ?? 0) + 1;
    return m;
  }, [all]);

  const platformFiltered = platform ? all.filter((s) => s.platform === platform) : all;

  const typeCounts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const s of platformFiltered) {
      const t = s.service_type ?? "other";
      m[t] = (m[t] ?? 0) + 1;
    }
    return m;
  }, [platformFiltered]);

  const visibleTypes = useMemo(
    () =>
      (Object.keys(typeCounts) as ServiceType[]).sort(
        (a, b) => typeCounts[b] - typeCounts[a],
      ),
    [typeCounts],
  );

  const filtered = useMemo(() => {
    let rows = platformFiltered;
    if (stype) rows = rows.filter((s) => (s.service_type ?? "other") === stype);
    return [...rows].sort((a, b) => {
      // featured first, by display_order asc
      if (!!b.is_featured !== !!a.is_featured) return b.is_featured ? 1 : -1;
      if (a.is_featured && b.is_featured) {
        const ao = a.display_order ?? 9999;
        const bo = b.display_order ?? 9999;
        if (ao !== bo) return ao - bo;
      }
      // most popular
      if ((b.order_count ?? 0) !== (a.order_count ?? 0))
        return (b.order_count ?? 0) - (a.order_count ?? 0);
      // tier
      const at = TIER_RANK[a.tier ?? "basic"] ?? 3;
      const bt = TIER_RANK[b.tier ?? "basic"] ?? 3;
      if (at !== bt) return at - bt;
      // cheapest of equal
      return Number(a.marked_up_rate ?? a.rate_per_1000) - Number(b.marked_up_rate ?? b.rate_per_1000);
    });
  }, [platformFiltered, stype]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-24">
      <header className="mb-10">
        <h1 className="text-[40px] font-medium leading-tight tracking-[-0.02em] text-[var(--text-primary)]">
          Services
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-[var(--text-secondary)]">
          {(all.length || 143)} premium services across Instagram, TikTok, and YouTube. Click to order.
        </p>
      </header>

      {/* Layer 1: platform tabs */}
      <div className="sticky top-0 z-10 -mx-6 mb-6 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/85 px-6 backdrop-blur">
        <div className="flex items-center gap-1 overflow-x-auto">
          <PlatformTab active={platform === null} onClick={() => setPlatformPersist(null)}>
            All Platforms
          </PlatformTab>
          {PLATFORMS.map((p) => (
            <PlatformTab key={p} active={platform === p} onClick={() => setPlatformPersist(p)}>
              {p} <span className="text-[var(--text-tertiary)]">({platformCounts[p] ?? 0})</span>
            </PlatformTab>
          ))}
        </div>
      </div>

      {/* Layer 2: type chips */}
      <div className="mb-8 flex flex-nowrap gap-2 overflow-x-auto pb-1">
        <Chip active={stype === null} onClick={() => setStypePersist(null)}>
          All Types
        </Chip>
        {visibleTypes.map((t) => (
          <Chip key={t} active={stype === t} onClick={() => setStypePersist(t)}>
            {SERVICE_TYPE_LABEL[t]} <span className="opacity-70">({typeCounts[t]})</span>
          </Chip>
        ))}
      </div>

      {/* Layer 3: grid */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center">
          <p className="text-[var(--text-secondary)]">No services match this filter. Try a different type.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => {
            const card: ServiceCardData = {
              id: s.id,
              platform: s.platform,
              name: s.name,
              display_name: s.display_name,
              description: s.description,
              service_type: s.service_type,
              marked_up_rate: s.marked_up_rate == null ? null : Number(s.marked_up_rate),
              rate_per_1000: Number(s.rate_per_1000),
              min_quantity: s.min_quantity,
              max_quantity: s.max_quantity,
              tier: (s.tier ?? null) as Tier | null,
              is_featured: s.is_featured,
              order_count: s.order_count,
            };
            return <ServiceCard key={s.id} s={card} />;
          })}
        </div>
      )}

      {/* CTA strip */}
      <section className="mt-20 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-10 text-center">
        <h2 className="text-2xl font-medium text-[var(--text-primary)]">Don't see what you need?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
          Email <a href="mailto:hello@boostan.co" className="text-[var(--accent)] hover:underline">hello@boostan.co</a> — we can often source specific services from our upstream catalog of 1,000+ options.
        </p>
        <a
          href="mailto:hello@boostan.co"
          className="mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white"
        >
          Contact us <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </section>
    </div>
  );
}

function PlatformTab({
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
      className={`relative whitespace-nowrap px-4 py-3 text-sm transition-colors ${
        active
          ? "font-medium text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
      {active && <span className="absolute inset-x-3 -bottom-px h-0.5 bg-[var(--accent)]" />}
    </button>
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
      className={`shrink-0 rounded-md border px-3.5 py-1.5 text-xs transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}
