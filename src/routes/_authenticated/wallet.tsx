import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { Plus, ArrowDownRight, ArrowUpRight, Bitcoin, Mail, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { createDeposit, markManualEtransfer } from "@/lib/nowpayments.functions";

type Search = { status?: string };

export const Route = createFileRoute("/_authenticated/wallet")({
  component: WalletPage,
  head: () => ({ meta: [{ title: "Wallet — Boostan" }] }),
  validateSearch: (s: Record<string, unknown>): Search => ({
    status: typeof s.status === "string" ? s.status : undefined,
  }),
});

const PRESETS = [25, 50, 100, 250];

function WalletPage() {
  const { status } = useSearch({ from: "/_authenticated/wallet" });
  const { user } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"crypto" | "etransfer">("crypto");
  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);
  const [etransferAmount, setEtransferAmount] = useState(25);
  const [etransferLoading, setEtransferLoading] = useState(false);

  const createDepositFn = useServerFn(createDeposit);
  const markEtransferFn = useServerFn(markManualEtransfer);

  // Show toast on redirect from NOWPayments
  useEffect(() => {
    if (status === "success") {
      toast.success("Payment received! Balance updates within 1–2 minutes once confirmed on-chain.", {
        duration: 8000,
      });
    } else if (status === "cancel") {
      toast.info("Payment cancelled. You can try again any time.");
    }
  }, [status]);

  const { data: settings } = useQuery({
    queryKey: ["settings-min"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("min_deposit").eq("id", true).maybeSingle();
      return data;
    },
  });
  const minDeposit = Number(settings?.min_deposit ?? 25);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("balance").eq("user_id", user!.id).maybeSingle();
      return data;
    },
    enabled: !!user,
    refetchInterval: 30_000, // auto-refresh every 30s to catch webhook updates
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
    refetchInterval: 30_000,
  });

  const startCryptoDeposit = async () => {
    if (!user) return;
    if (amount < minDeposit) {
      toast.error(`Minimum deposit is $${minDeposit.toFixed(2)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await createDepositFn({ data: { amount_usd: amount } });
      qc.invalidateQueries({ queryKey: ["txs", user.id] });
      // Redirect to NOWPayments hosted checkout
      window.location.href = res.invoice_url;
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to create invoice");
      setLoading(false);
    }
  };

  const submitEtransfer = async () => {
    if (!user) return;
    if (etransferAmount < minDeposit) {
      toast.error(`Minimum deposit is $${minDeposit.toFixed(2)}`);
      return;
    }
    setEtransferLoading(true);
    try {
      await markEtransferFn({ data: { amount_usd: etransferAmount } });
      qc.invalidateQueries({ queryKey: ["txs", user.id] });
      toast.success("Marked as sent. Admin will credit within 4 hours during business hours.");
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to record e-transfer");
    } finally {
      setEtransferLoading(false);
    }
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
            <div className="mt-1 text-xs text-foreground-subtle">USD · auto-refreshes every 30s</div>
          </div>
        </div>

        <div className="glass rounded-2xl p-7 lg:col-span-2">
          <div className="mb-5 flex gap-2 border-b border-[var(--border)] pb-3">
            <button
              onClick={() => setTab("crypto")}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
                tab === "crypto" ? "bg-[var(--surface)] text-foreground" : "text-foreground-muted hover:text-foreground"
              }`}
            >
              <Bitcoin className="h-3.5 w-3.5" /> Crypto
            </button>
            <button
              onClick={() => setTab("etransfer")}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
                tab === "etransfer" ? "bg-[var(--surface)] text-foreground" : "text-foreground-muted hover:text-foreground"
              }`}
            >
              <Mail className="h-3.5 w-3.5" /> E-transfer (Canada)
            </button>
          </div>

          {tab === "crypto" && (
            <>
              <h2 className="text-lg">Top up with crypto</h2>
              <p className="text-xs text-foreground-muted">
                Pay with USDT (TRC-20). You'll be redirected to NOWPayments hosted checkout.
              </p>

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
                  min={minDeposit}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none"
                />
              </div>

              <button
                onClick={startCryptoDeposit}
                disabled={loading || amount < minDeposit}
                className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm disabled:opacity-50"
              >
                <Plus className="h-4 w-4" /> {loading ? "Creating invoice…" : `Pay $${amount.toFixed(2)} with crypto`}
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <p className="mt-3 text-xs text-foreground-subtle">
                Minimum deposit ${minDeposit.toFixed(2)}. Balance is credited automatically once on-chain confirmation completes.
              </p>
            </>
          )}

          {tab === "etransfer" && (
            <>
              <h2 className="text-lg">E-transfer (Canada)</h2>
              <ol className="mt-3 space-y-2 text-sm text-foreground-muted">
                <li>1. Send your deposit to <span className="text-foreground">balamchi.shahab@gmail.com</span> (Interac e-transfer).</li>
                <li>2. Use auto-deposit, or password: <code className="rounded bg-[var(--surface)] px-1.5 py-0.5">BOOSTAN</code></li>
                <li>3. Include your registered email in the message.</li>
                <li>4. Funds credited within 4 hours during business hours.</li>
              </ol>

              <div className="mt-5 flex flex-wrap items-center gap-2">
                <span className="text-xs text-foreground-muted">Amount sent (USD):</span>
                <input
                  type="number"
                  min={minDeposit}
                  value={etransferAmount}
                  onChange={(e) => setEtransferAmount(Number(e.target.value))}
                  className="w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none"
                />
              </div>

              <button
                onClick={submitEtransfer}
                disabled={etransferLoading || etransferAmount < minDeposit}
                className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm disabled:opacity-50"
              >
                <Mail className="h-4 w-4" /> {etransferLoading ? "Submitting…" : "Mark as sent"}
              </button>
            </>
          )}
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
                const isPending = t.type === "deposit_pending" || t.type === "manual_etransfer";
                return (
                  <tr key={t.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)]">
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 capitalize">
                        {isPending ? (
                          <Clock className="h-3.5 w-3.5 text-[var(--warning)]" />
                        ) : positive ? (
                          <ArrowDownRight className="h-3.5 w-3.5 text-[var(--success)]" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5 text-foreground-muted" />
                        )}
                        {String(t.type).replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-foreground-muted">{t.description ?? "—"}</td>
                    <td className={`tabular px-6 py-4 ${positive ? "text-[var(--success)]" : ""}`}>
                      {Number(t.amount) === 0 ? "—" : `${positive ? "+" : ""}$${Math.abs(Number(t.amount)).toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 text-xs text-foreground-muted capitalize">
                      {isPending ? "⏳ pending" : t.status}
                    </td>
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
