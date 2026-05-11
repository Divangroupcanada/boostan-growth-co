import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search } from "lucide-react";
import { ServiceCard, type ServiceCardData } from "@/components/service-card";
import type { Tier } from "@/lib/service-tier";

export const Route = createFileRoute("/_authenticated/services")({
  component: ServicesPage,
  head: () => ({ meta: [{ title: "Services — Boostan" }] }),
});

function ServicesPage() {
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<string | null>(null);

  const { data: services } = useQuery({
    queryKey: ["services-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("rate_per_1000");
      return (data ?? []) as any[];
    },
  });

  const platforms = Array.from(new Set((services ?? []).map((s) => s.platform)));
  const filtered = (services ?? []).filter(
    (s) =>
      (!platform || s.platform === platform) &&
      (q === "" || (s.display_name || s.name).toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--text-tertiary)]">Catalog</p>
          <h1 className="mt-1 text-3xl md:text-4xl text-[var(--text-primary)]">All services</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Browse {services?.length ?? 0} active services. Click any card to place an order.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] px-3 py-2">
          <Search className="h-4 w-4 text-[var(--text-tertiary)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services…"
            className="w-64 bg-transparent text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]"
          />
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <Chip active={platform === null} onClick={() => setPlatform(null)}>All</Chip>
        {platforms.map((p) => (
          <Chip key={p} active={platform === p} onClick={() => setPlatform(p)}>{p}</Chip>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          };
          return <ServiceCard key={s.id} s={card} />;
        })}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3.5 py-1.5 text-xs transition-colors ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-white"
          : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}
