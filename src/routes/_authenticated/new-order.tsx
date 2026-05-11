import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { placeOrder } from "@/lib/smmflw.functions";
import { useAuth } from "@/lib/auth";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, FlaskConical, Info } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";
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

type Search = {
  service?: string;
  platform?: string;
  category?: string;
  qty?: number;
  tier?: string;
};

export const Route = createFileRoute("/_authenticated/new-order")({
  component: NewOrderWizard,
  head: () => ({ meta: [{ title: "New order — Boostan" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    service: typeof s.service === "string" ? s.service : undefined,
    platform: typeof s.platform === "string" ? s.platform : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    qty: typeof s.qty === "number" ? s.qty : typeof s.qty === "string" ? Number(s.qty) : undefined,
    tier: typeof s.tier === "string" ? s.tier : undefined,
  }),
});

const PLATFORMS = [
  { key: "Instagram", count: 75, Icon: FaInstagram },
  { key: "TikTok", count: 21, Icon: FaTiktok },
  { key: "YouTube", count: 47, Icon: FaYoutube },
] as const;

type PlatformKey = (typeof PLATFORMS)[number]["key"];

function NewOrderWizard() {
  const search = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const place = useServerFn(placeOrder);

  const { data: services } = useQuery({
    queryKey: ["services-all"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("active", true)
        .order("marked_up_rate");
      return (data ?? []) as any[];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  // Wizard state
  const [step, setStep] = useState(1);
  const [platform, setPlatform] = useState<PlatformKey | "">("");
  const [category, setCategory] = useState<Category | "">("");
  const [qty, setQty] = useState<number>(1000);
  const [tier, setTier] = useState<Tier | "">("");
  const [link, setLink] = useState("");
  const [testMode, setTestMode] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill from URL search params or sessionStorage
  const preselectedService = useMemo(() => {
    if (!search.service || !services) return null;
    return (services as any[]).find((s) => s.id === search.service) ?? null;
  }, [search.service, services]);

  useEffect(() => {
    // Direct service preselection — skip wizard, jump to delivery link
    if (preselectedService) {
      const ps = preselectedService;
      setPlatform(ps.platform as PlatformKey);
      const c = inferCategory(ps.display_name || ps.name);
      if (c) setCategory(c);
      if (ps.tier) setTier(ps.tier as Tier);
      const minQ = ps.min_quantity ?? 1000;
      setQty((q) => (q >= ps.min_quantity && q <= ps.max_quantity ? q : Math.max(1000, minQ)));
      setStep(5);
      return;
    }
    let prefill: Partial<Search & { serviceId?: string }> = {};
    try {
      const stored = sessionStorage.getItem("boostan:order-prefill");
      if (stored) prefill = JSON.parse(stored);
    } catch {}
    const p = (search.platform || prefill.platform) as PlatformKey | undefined;
    const c = (search.category || prefill.category) as Category | undefined;
    const q = search.qty || prefill.qty;
    const t = (search.tier || prefill.tier) as Tier | undefined;
    if (p && PLATFORMS.find((x) => x.key === p)) setPlatform(p);
    if (c && CATEGORIES.includes(c)) setCategory(c);
    if (q && Number(q) > 0) setQty(Number(q));
    if (t && ["basic", "premium", "vip"].includes(t)) setTier(t);
    if (p && c && q && t) setStep(5); // Jump to link input
    try { sessionStorage.removeItem("boostan:order-prefill"); } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preselectedService]);

  // Categories available for the chosen platform
  const availableCategories = useMemo(() => {
    if (!platform) return [];
    const set = new Set<Category>();
    for (const s of services ?? []) {
      if (s.platform === platform) {
        const c = inferCategory(s.display_name || s.name);
        if (c) set.add(c);
      }
    }
    return CATEGORIES.filter((c) => set.has(c));
  }, [services, platform]);

  // Resolve matched service
  const match = useMemo(() => {
    if (!platform || !category || !tier) return null;
    const candidates = (services ?? []).filter((s: any) => {
      if (s.platform !== platform) return false;
      if (s.tier !== tier) return false;
      const c = inferCategory(s.display_name || s.name);
      return c === category;
    });
    const inRange = candidates.filter((s: any) => qty >= s.min_quantity && qty <= s.max_quantity);
    if (!inRange.length) return null;
    return inRange.reduce((a: any, b: any) =>
      Number(a.marked_up_rate) <= Number(b.marked_up_rate) ? a : b,
    );
  }, [services, platform, category, tier, qty]);

  const sliderBounds = useMemo(() => {
    if (!platform || !category) return { min: 100, max: 25000 };
    const c = (services ?? []).filter(
      (s: any) =>
        s.platform === platform &&
        inferCategory(s.display_name || s.name) === category,
    );
    if (!c.length) return { min: 100, max: 25000 };
    return {
      min: Math.min(...c.map((s: any) => s.min_quantity)),
      max: Math.max(...c.map((s: any) => s.max_quantity)),
    };
  }, [services, platform, category]);

  const rate = match ? Number(match.marked_up_rate) : 0;
  const price = match ? (rate * qty) / 1000 : 0;
  const balance = Number(profile?.balance ?? 0);
  const canPay = !!match && balance >= price;

  const submit = async () => {
    if (!match || !user) return;
    if (!link) return toast.error("Add a link or username");
    if (!canPay) return toast.error("Insufficient balance");
    setSubmitting(true);
    try {
      const res = await place({ data: { serviceId: match.id, link, quantity: qty, testMode } });
      qc.invalidateQueries({ queryKey: ["profile", user.id] });
      qc.invalidateQueries({ queryKey: ["orders", user.id] });
      qc.invalidateQueries({ queryKey: ["orders-all", user.id] });
      toast.success(testMode ? `Test order placed (${res.providerOrderId})` : "Order placed");
      navigate({ to: "/orders" });
    } catch (e: any) {
      toast.error(e?.message ?? "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  // ---- Render ----
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">New order</p>
        <h1 className="text-3xl md:text-4xl">Place an order</h1>
        <ProgressBar step={step} total={6} />
      </header>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 md:p-8">
        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mb-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </button>
        )}

        {step === 1 && (
          <StepBlock title="Pick a platform">
            <div className="grid gap-3 sm:grid-cols-3">
              {PLATFORMS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => { setPlatform(p.key); setCategory(""); setStep(2); }}
                  className={`flex flex-col items-start gap-3 rounded-lg border p-5 text-left transition-colors duration-200 ${
                    platform === p.key
                      ? "border-[var(--accent)] bg-[var(--accent-subtle)]"
                      : "border-[var(--border-default)] hover:bg-[var(--bg-surface-2)]"
                  }`}
                >
                  <p.Icon className={`h-6 w-6 ${platform === p.key ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`} />
                  <div>
                    <div className="text-sm font-medium text-[var(--text-primary)]">{p.key}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{p.count} services</div>
                  </div>
                </button>
              ))}
            </div>
          </StepBlock>
        )}

        {step === 2 && (
          <StepBlock title="Choose a category">
            <div className="flex flex-wrap gap-2">
              {availableCategories.map((c) => (
                <Chip key={c} active={c === category} onClick={() => { setCategory(c); setStep(3); }}>
                  {c}
                </Chip>
              ))}
            </div>
          </StepBlock>
        )}

        {step === 3 && (
          <StepBlock title="How many?">
            <div className="flex flex-wrap gap-2">
              {QTY_PRESETS.map((q) => (
                <Chip key={q} active={q === qty} onClick={() => setQty(q)}>
                  {formatQty(q)}
                </Chip>
              ))}
            </div>
            <div className="mt-5">
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
            <button
              onClick={() => setStep(4)}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </StepBlock>
        )}

        {step === 4 && (
          <StepBlock title="Quality tier">
            <div className="inline-flex rounded-lg border border-[var(--border-default)] p-1">
              {(["basic", "premium", "vip"] as Tier[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTier(t); setStep(5); }}
                  title={TIER_DESCRIPTIONS[t]}
                  className={`flex items-center gap-1.5 rounded-md px-5 py-2 text-sm transition-colors duration-200 ${
                    t === tier
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {tierLabel(t)} <Info className="h-3 w-3 opacity-60" />
                </button>
              ))}
            </div>
            {tier && (
              <p className="mt-3 text-xs text-[var(--text-tertiary)]">{TIER_DESCRIPTIONS[tier as Tier]}</p>
            )}
          </StepBlock>
        )}

        {step === 5 && (
          <StepBlock title="Where should we deliver?">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://instagram.com/yourpost"
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-2)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
            />
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">
              Paste the URL of the post or profile you want to grow.
            </p>
            <button
              onClick={() => link.trim() && setStep(6)}
              disabled={!link.trim()}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-40"
            >
              Review order <ArrowRight className="h-4 w-4" />
            </button>
          </StepBlock>
        )}

        {step === 6 && (
          <StepBlock title="Review your order">
            {!match ? (
              <p className="text-sm text-[var(--warning)]">
                No service matches this combination. <button onClick={() => setStep(3)} className="underline">Adjust quantity</button>.
              </p>
            ) : (
              <>
                <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-5 text-sm">
                  <Row label="Service" value={match.display_name || match.name} />
                  <Row label="Platform" value={platform} />
                  <Row label="Category" value={category} />
                  <Row label="Quantity" value={qty.toLocaleString()} />
                  <Row label="Tier" value={tierLabel(tier as Tier)} />
                  <Row label="Link" value={link} mono />
                  <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
                    <Row label="Rate" value={`$${rate.toFixed(2)} / 1,000`} />
                    <Row label="Wallet balance" value={`$${balance.toFixed(2)}`} />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[var(--text-secondary)]">Total</span>
                      <span className="tabular text-2xl text-[var(--text-primary)]">${price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4">
                  <input
                    type="checkbox"
                    checked={testMode}
                    onChange={(e) => setTestMode(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[var(--accent)]"
                  />
                  <div className="flex-1 text-sm">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-3.5 w-3.5" />
                      <span>Test mode</span>
                      <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--accent)]">
                        default
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-foreground-muted">
                      Wallet is debited and the order is recorded, but the SMMFLW provider is not called.
                    </p>
                  </div>
                </label>

                <button
                  disabled={!canPay || submitting}
                  onClick={submit}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? "Placing order…" : (
                    <>
                      <Sparkles className="h-4 w-4" /> Place {testMode ? "test " : ""}order <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                {!canPay && match && balance < price && (
                  <p className="mt-3 text-center text-xs text-[var(--warning)]">
                    Top up your wallet to continue. <Link to="/wallet" className="underline">Add funds</Link>.
                  </p>
                )}
              </>
            )}
          </StepBlock>
        )}
      </div>
    </div>
  );
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs text-[var(--text-tertiary)]">
        <span>Step {step} of {total}</span>
        <span className="tabular">{Math.round(pct)}%</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StepBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-medium text-[var(--text-primary)]">{title}</h2>
      <div>{children}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 py-1 text-sm">
      <span className="text-[var(--text-tertiary)]">{label}</span>
      <span className={`text-[var(--text-primary)] ${mono ? "font-mono text-xs" : ""} truncate`}>{value}</span>
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


