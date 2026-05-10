import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Search = { service?: string };

export const Route = createFileRoute("/_authenticated/new-order")({
  component: NewOrderPage,
  head: () => ({ meta: [{ title: "New order — Boostan" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    service: typeof s.service === "string" ? s.service : undefined,
  }),
});

function NewOrderPage() {
  const { service: preselect } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: services } = useQuery({
    queryKey: ["services-all"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("active", true).order("name");
      return data ?? [];
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("balance").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const [serviceId, setServiceId] = useState<string>(preselect ?? "");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState<number>(1000);
  const [submitting, setSubmitting] = useState(false);

  const service = useMemo(
    () => (services ?? []).find((s) => s.id === (serviceId || preselect)),
    [services, serviceId, preselect],
  );
  const price = service ? (Number(service.rate_per_1000) * quantity) / 1000 : 0;
  const balance = Number(profile?.balance ?? 0);
  const canPay = balance >= price && service && quantity >= service.min_quantity && quantity <= service.max_quantity;

  const submit = async () => {
    if (!service || !user) return;
    if (!link) return toast.error("Add a link or username");
    if (!canPay) return toast.error("Insufficient balance or invalid quantity");
    setSubmitting(true);
    const { error: orderErr } = await supabase.from("orders").insert({
      user_id: user.id,
      service_id: service.id,
      link,
      quantity,
      price,
      status: "pending",
    });
    if (orderErr) {
      setSubmitting(false);
      return toast.error(orderErr.message);
    }
    await supabase
      .from("profiles")
      .update({ balance: balance - price })
      .eq("user_id", user.id);
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "order",
      amount: -price,
      status: "completed",
      description: `${service.name} × ${quantity}`,
    });
    qc.invalidateQueries({ queryKey: ["profile", user.id] });
    qc.invalidateQueries({ queryKey: ["orders", user.id] });
    setSubmitting(false);
    toast.success("Order placed");
    navigate({ to: "/orders" });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">New order</p>
        <h1 className="mt-1 text-3xl md:text-4xl">Place an <span className="gradient-text">order</span></h1>
      </header>

      <div className="glass rounded-2xl p-6 md:p-8">
        <div className="space-y-5">
          <Field label="Service">
            <select
              value={serviceId || preselect || ""}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--border-strong)]"
            >
              <option value="">Select a service…</option>
              {(services ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.platform} · {s.name} (${Number(s.rate_per_1000).toFixed(2)}/1k)
                </option>
              ))}
            </select>
          </Field>

          <Field label="Link or username">
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--border-strong)]"
            />
          </Field>

          <Field label={`Quantity${service ? ` · min ${service.min_quantity.toLocaleString()} / max ${service.max_quantity.toLocaleString()}` : ""}`}>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min={service?.min_quantity ?? 1}
              max={service?.max_quantity ?? 1_000_000}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--border-strong)]"
            />
          </Field>
        </div>

        <div className="mt-7 grid gap-3 rounded-xl bg-[var(--surface)] p-5 text-sm sm:grid-cols-3">
          <Stat label="Order price" value={`$${price.toFixed(2)}`} />
          <Stat label="Wallet balance" value={`$${balance.toFixed(2)}`} />
          <Stat label="After order" value={`$${(balance - price).toFixed(2)}`} accent={!canPay} />
        </div>

        <button
          disabled={!canPay || submitting}
          onClick={submit}
          className="btn-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "Placing order…" : (
            <>
              <Sparkles className="h-4 w-4" /> Place order <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
        {!canPay && service && balance < price && (
          <p className="mt-3 text-center text-xs text-[var(--warning)]">Top up your wallet to continue.</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs text-foreground-muted">{label}</span>
      {children}
    </label>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-xs text-foreground-subtle">{label}</div>
      <div className={`tabular mt-1 text-lg ${accent ? "text-[var(--warning)]" : ""}`}>{value}</div>
    </div>
  );
}
