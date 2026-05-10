import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useState } from "react";
import { Plus, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/wallet")({
  component: WalletPage,
  head: () => ({ meta: [{ title: "Wallet — Boostan" }] }),
});

const PRESETS = [10, 25, 50, 100];

function WalletPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("balance").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: txs } = useQuery({
    queryKey: ["txs", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      return data ?? [];
    },
    enabled: !!user,
  });

  const deposit = async () => {
    if (!user || amount <= 0) return;
    setLoading(true);
    const newBalance = Number(profile?.balance ?? 0) + amount;
    await supabase.from("profiles").update({ balance: newBalance }).eq("user_id", user.id);
    await supabase.from("transactions").insert({
      user_id: user.id,
      type: "deposit",
      amount,
      status: "completed",
      description: "Demo top-up (test mode)",
    });
    qc.invalidateQueries({ queryKey: ["profile", user.id] });
    qc.invalidateQueries({ queryKey: ["txs", user.id] });
    setLoading(false);
    toast.success(`+ $${amount.toFixed(2)} added to wallet`);
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">Wallet</p>
          <h1 className="mt-1 text-3xl md:text-4xl">Balance & top-ups</h1>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass relative overflow-hidden rounded-2xl p-7 lg:col-span-1">
          <div className="glow-orb" style={{ top: -120, right: -120, background: "var(--primary-glow)", opacity: .35, width: 280, height: 280 }} />
          <div className="relative">
            <div className="text-xs text-foreground-muted">Available balance</div>
            <div className="tabular gradient-text mt-2 text-5xl">${Number(profile?.balance ?? 0).toFixed(2)}</div>
            <div className="mt-1 text-xs text-foreground-subtle">USD</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-7 lg:col-span-2">
          <h2 className="text-lg">Top up</h2>
          <p className="text-xs text-foreground-muted">Pay-as-you-go. Crypto, card, and PayPal accepted on production.</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={`rounded-lg px-4 py-2 text-sm transition ${
                  amount === p ? "gradient-bg text-white" : "glass text-foreground-muted hover:text-foreground"
                }`}
              >
                ${p}
              </button>
            ))}
            <input
              type="number"
              min={5}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none"
            />
          </div>

          <button
            onClick={deposit}
            disabled={loading || amount < 1}
            className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> {loading ? "Processing…" : `Add $${amount.toFixed(2)}`}
          </button>
          <p className="mt-3 text-xs text-foreground-subtle">Test mode — no real charge. Replace with Stripe/Crypto in production.</p>
        </div>
      </div>

      <section className="glass overflow-hidden rounded-2xl">
        <div className="px-6 py-5">
          <h2 className="text-lg">Transaction history</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle">
                <th className="px-6 py-3 font-normal">Type</th>
                <th className="px-6 py-3 font-normal">Description</th>
                <th className="px-6 py-3 font-normal">Amount</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal">Date</th>
              </tr>
            </thead>
            <tbody>
              {(txs ?? []).length === 0 && (
                <tr><td colSpan={5} className="px-6 py-16 text-center text-foreground-muted">No transactions yet.</td></tr>
              )}
              {(txs ?? []).map((t: any) => {
                const positive = Number(t.amount) > 0;
                return (
                  <tr key={t.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)]">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 capitalize">
                        {positive ? <ArrowDownRight className="h-3.5 w-3.5 text-[var(--success)]" /> : <ArrowUpRight className="h-3.5 w-3.5 text-foreground-muted" />}
                        {t.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">{t.description ?? "—"}</td>
                    <td className={`tabular px-6 py-4 ${positive ? "text-[var(--success)]" : ""}`}>
                      {positive ? "+" : ""}${Math.abs(Number(t.amount)).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs text-foreground-muted capitalize">{t.status}</td>
                    <td className="px-6 py-4 text-xs text-foreground-muted">{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
