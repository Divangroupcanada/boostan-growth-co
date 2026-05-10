import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Search, ArrowRight, Instagram, Youtube, Twitter, Music2, Send } from "lucide-react";

export const Route = createFileRoute("/_authenticated/services")({
  component: ServicesPage,
  head: () => ({ meta: [{ title: "Services — Boostan" }] }),
});

const PLATFORM_ICON: Record<string, any> = {
  Instagram, YouTube: Youtube, "Twitter / X": Twitter, TikTok: Music2, Telegram: Send,
};

function ServicesPage() {
  const [q, setQ] = useState("");
  const [platform, setPlatform] = useState<string | null>(null);

  const { data: services } = useQuery({
    queryKey: ["services-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*, categories(name, slug)")
        .eq("active", true)
        .order("rate_per_1000");
      return data ?? [];
    },
  });

  const platforms = Array.from(new Set((services ?? []).map((s) => s.platform)));
  const filtered = (services ?? []).filter(
    (s) =>
      (!platform || s.platform === platform) &&
      (q === "" || s.name.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">Catalog</p>
          <h1 className="mt-1 text-3xl md:text-4xl">All services</h1>
          <p className="mt-2 text-sm text-foreground-muted">
            Browse {services?.length ?? 0} active services. Click any service to place an order.
          </p>
        </div>
        <div className="glass flex items-center gap-2 rounded-xl px-3 py-2">
          <Search className="h-4 w-4 text-foreground-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services…"
            className="w-64 bg-transparent text-sm outline-none placeholder:text-foreground-subtle"
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
          const Icon = PLATFORM_ICON[s.platform] ?? Instagram;
          return (
            <Link
              key={s.id}
              to="/new-order"
              search={{ service: s.id }}
              className="glass group rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-strong"
            >
              <div className="flex items-start justify-between">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-brand-soft)]">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs text-foreground-subtle">{s.platform}</span>
              </div>
              <div className="mt-4 text-sm font-medium">{s.name}</div>
              {s.description && <p className="mt-1 text-xs text-foreground-muted line-clamp-2">{s.description}</p>}
              <div className="mt-5 flex items-end justify-between">
                <div>
                  <div className="text-xs text-foreground-subtle">per 1,000</div>
                  <div className="tabular text-2xl">${Number(s.rate_per_1000).toFixed(2)}</div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-foreground-muted group-hover:text-foreground">
                  Order <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
              <div className="mt-3 text-xs text-foreground-subtle">
                Min {s.min_quantity.toLocaleString()} · Max {s.max_quantity.toLocaleString()}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs transition ${
        active ? "gradient-bg text-white" : "glass text-foreground-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
