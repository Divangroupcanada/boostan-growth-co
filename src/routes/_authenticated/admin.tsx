import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { syncServices, getProviderBalance } from "@/lib/smmflw.functions";
import { adminConfirmManualDeposit, listWebhookLogs, triggerTestWebhook } from "@/lib/nowpayments.functions";
import { Fragment, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Wallet, Database, Settings as SettingsIcon, Mail, Check, Activity, PlayCircle, ChevronDown, ChevronRight, Star, Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Boostan" }] }),
});

function AdminPage() {
  const qc = useQueryClient();
  const sync = useServerFn(syncServices);
  const balance = useServerFn(getProviderBalance);

  const [syncing, setSyncing] = useState(false);
  const [loadingBal, setLoadingBal] = useState(false);
  const [providerBal, setProviderBal] = useState<{ balance: number; currency: string } | null>(null);

  const { data: settings } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await supabase.from("settings").select("*").eq("id", true).maybeSingle();
      return data;
    },
  });

  const { data: serviceCount } = useQuery({
    queryKey: ["services-count"],
    queryFn: async () => {
      const { count } = await supabase
        .from("services")
        .select("*", { count: "exact", head: true })
        .eq("active", true);
      return count ?? 0;
    },
  });

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await sync();
      toast.success(`Synced ${res.synced} services (${res.total_from_provider} from provider)`);
      qc.invalidateQueries({ queryKey: ["services-all"] });
      qc.invalidateQueries({ queryKey: ["services-count"] });
      qc.invalidateQueries({ queryKey: ["settings"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const handleBalance = async () => {
    setLoadingBal(true);
    try {
      const res = await balance();
      setProviderBal(res);
    } catch (e: any) {
      toast.error(e?.message ?? "Balance check failed");
    } finally {
      setLoadingBal(false);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">Admin</p>
        <h1 className="mt-1 text-3xl md:text-4xl">Operations</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4" /> Services catalog
          </div>
          <div className="tabular mt-3 text-3xl">{serviceCount ?? "—"}</div>
          <div className="text-xs text-foreground-subtle">
            Last sync:{" "}
            {settings?.last_services_sync
              ? new Date(settings.last_services_sync).toLocaleString()
              : "never"}
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="btn-gradient mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing…" : "Sync services from SMMFLW"}
          </button>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 text-sm">
            <Wallet className="h-4 w-4" /> Provider balance
          </div>
          <div className="tabular mt-3 text-3xl">
            {providerBal ? `$${providerBal.balance.toFixed(2)}` : "—"}
          </div>
          <div className="text-xs text-foreground-subtle">
            {providerBal?.currency ?? "Click to fetch from SMMFLW"}
          </div>
          <button
            onClick={handleBalance}
            disabled={loadingBal}
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface)] disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loadingBal ? "animate-spin" : ""}`} />
            Check balance
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-2 text-sm">
          <SettingsIcon className="h-4 w-4" /> Pricing settings
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Stat label="Markup" value={`${Number(settings?.markup_percentage ?? 0)}%`} />
          <Stat label="Fixed fee / 1k" value={`$${Number(settings?.fixed_fee ?? 0).toFixed(2)}`} />
          <Stat label="Min deposit" value={`$${Number(settings?.min_deposit ?? 0).toFixed(2)}`} />
        </div>
        <p className="mt-4 text-xs text-foreground-subtle">
          Markup applies on next sync: <code>base × (1 + markup%) + fee</code>
        </p>
      </div>

      <PendingManualDeposits />

      <FeaturedServicesManager />

      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList>
          <TabsTrigger value="webhooks" className="gap-2">
            <Activity className="h-4 w-4" /> Webhook activity
          </TabsTrigger>
          <TabsTrigger value="test" className="gap-2">
            <PlayCircle className="h-4 w-4" /> Test webhook
          </TabsTrigger>
        </TabsList>
        <TabsContent value="webhooks">
          <WebhookActivity />
        </TabsContent>
        <TabsContent value="test">
          <TestWebhook />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function WebhookActivity() {
  const listFn = useServerFn(listWebhookLogs);
  const [onlyFailures, setOnlyFailures] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["webhook-logs", onlyFailures],
    queryFn: () => listFn({ data: { limit: 100, only_failures: onlyFailures } }),
    refetchInterval: 15_000,
  });

  const rows = data?.rows ?? [];

  const actionTone = (r: any) => {
    if (r.signature_valid === false) return "text-red-400";
    if (r.error) return "text-amber-400";
    if (r.action === "credited") return "text-emerald-400";
    if (r.action === "already_credited_idempotent") return "text-foreground-muted";
    return "text-foreground";
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4" /> Recent webhook calls
          </div>
          <p className="mt-1 text-xs text-foreground-subtle">
            Live log of every NOWPayments callback. Auto-refreshes every 15s. For the first 30 days, every call is captured in full.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs">
            <input type="checkbox" checked={onlyFailures} onChange={(e) => setOnlyFailures(e.target.checked)} />
            Only failures
          </label>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-[var(--surface)]"
          >
            <RefreshCw className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle">
              <th className="px-2 py-2 font-normal w-6"></th>
              <th className="px-2 py-2 font-normal">Time</th>
              <th className="px-2 py-2 font-normal">Sig</th>
              <th className="px-2 py-2 font-normal">Payment ID</th>
              <th className="px-2 py-2 font-normal">Status</th>
              <th className="px-2 py-2 font-normal">Action</th>
              <th className="px-2 py-2 font-normal">Credited</th>
              <th className="px-2 py-2 font-normal">HTTP</th>
              <th className="px-2 py-2 font-normal">Test</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={9} className="px-3 py-6 text-center text-foreground-muted">No webhook activity yet.</td></tr>
            )}
            {rows.map((r: any) => {
              const isOpen = !!expanded[r.id];
              return (
                <Fragment key={r.id}>
                  <tr key={r.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="px-2 py-2">
                      <button onClick={() => setExpanded((s) => ({ ...s, [r.id]: !isOpen }))}>
                        {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </button>
                    </td>
                    <td className="px-2 py-2 text-xs text-foreground-muted whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="px-2 py-2">
                      {r.signature_valid === true ? (
                        <span className="text-emerald-400 text-xs">✓</span>
                      ) : r.signature_valid === false ? (
                        <span className="text-red-400 text-xs">✗</span>
                      ) : (
                        <span className="text-foreground-muted text-xs">—</span>
                      )}
                    </td>
                    <td className="px-2 py-2 font-mono text-xs">{r.payment_id ?? "—"}</td>
                    <td className="px-2 py-2 text-xs">{r.payment_status ?? "—"}</td>
                    <td className={`px-2 py-2 text-xs ${actionTone(r)}`}>{r.action ?? "—"}</td>
                    <td className="px-2 py-2 tabular text-xs">{r.amount_credited ? `$${Number(r.amount_credited).toFixed(2)}` : "—"}</td>
                    <td className="px-2 py-2 tabular text-xs">{r.response_status}</td>
                    <td className="px-2 py-2 text-xs">{r.is_test ? <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-400">TEST</span> : ""}</td>
                  </tr>
                  {isOpen && (
                    <tr key={r.id + "-d"} className="border-b border-[var(--border)] bg-[var(--surface)]/40">
                      <td></td>
                      <td colSpan={8} className="px-2 py-3">
                        <div className="space-y-2 text-xs">
                          {r.error && <div><span className="text-foreground-subtle">error:</span> <span className="text-red-400">{r.error}</span></div>}
                          {r.signature_reason && <div><span className="text-foreground-subtle">sig reason:</span> {r.signature_reason}</div>}
                          <div><span className="text-foreground-subtle">tx lookup:</span> {r.tx_lookup_found ? `found (${r.tx_id?.slice(0,8)}…)` : "not found"}</div>
                          <details>
                            <summary className="cursor-pointer text-foreground-subtle">headers</summary>
                            <pre className="mt-1 overflow-x-auto rounded bg-black/30 p-2 text-[10px]">{JSON.stringify(r.headers, null, 2)}</pre>
                          </details>
                          <details>
                            <summary className="cursor-pointer text-foreground-subtle">payload</summary>
                            <pre className="mt-1 overflow-x-auto rounded bg-black/30 p-2 text-[10px]">{JSON.stringify(r.parsed_payload ?? r.raw_body, null, 2)}</pre>
                          </details>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestWebhook() {
  const triggerFn = useServerFn(triggerTestWebhook);
  const qc = useQueryClient();
  const [paymentId, setPaymentId] = useState("");
  const [amount, setAmount] = useState(1);
  const [status, setStatus] = useState<"finished" | "confirmed" | "partially_paid" | "failed" | "expired" | "waiting">("finished");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  const run = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await triggerFn({
        data: {
          payment_id: paymentId.trim() || undefined,
          amount_usd: Number(amount),
          status,
        },
      });
      setResult(res);
      toast.success(`Webhook returned ${res.response_status}`);
      qc.invalidateQueries({ queryKey: ["webhook-logs"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Test failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-sm">
        <PlayCircle className="h-4 w-4" /> Trigger test webhook
      </div>
      <p className="mt-1 text-xs text-foreground-subtle">
        Posts a fake-but-cryptographically-valid NOWPayments callback to <code>/api/public/nowpayments-webhook</code>.
        Leave Payment ID blank to verify HMAC + lookup path. To test the full credit pipeline,
        paste a real <code>payment_id</code> from a pending crypto deposit (the user's balance WILL be credited and a transaction labeled "TEST" will be recorded).
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="text-xs">
          <span className="text-foreground-subtle">Payment ID (optional)</span>
          <input
            value={paymentId}
            onChange={(e) => setPaymentId(e.target.value)}
            placeholder="leave blank for fake"
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
        </label>
        <label className="text-xs">
          <span className="text-foreground-subtle">Amount USD</span>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm tabular"
          />
        </label>
        <label className="text-xs">
          <span className="text-foreground-subtle">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          >
            {["finished","confirmed","partially_paid","failed","expired","waiting"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        onClick={run}
        disabled={busy}
        className="btn-gradient mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50"
      >
        <PlayCircle className="h-4 w-4" /> {busy ? "Sending…" : "Trigger test webhook"}
      </button>

      {result && (
        <pre className="mt-4 overflow-x-auto rounded bg-black/30 p-3 text-[11px]">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}

function PendingManualDeposits() {
  const qc = useQueryClient();
  const confirmFn = useServerFn(adminConfirmManualDeposit);
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: pending } = useQuery({
    queryKey: ["pending-etransfers"],
    queryFn: async () => {
      const { data } = await supabase
        .from("transactions")
        .select("id, user_id, pay_amount, payment_status, created_at, description")
        .eq("type", "manual_etransfer")
        .neq("payment_status", "finished")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    refetchInterval: 30_000,
  });

  const confirm = async (id: string, amount: number) => {
    setBusyId(id);
    try {
      await confirmFn({ data: { transaction_id: id, amount_usd: amount } });
      toast.success(`Credited $${amount.toFixed(2)}`);
      qc.invalidateQueries({ queryKey: ["pending-etransfers"] });
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to credit");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-sm">
        <Mail className="h-4 w-4" /> Pending manual deposits
      </div>
      <p className="mt-1 text-xs text-foreground-subtle">
        E-transfers submitted by users. Verify the funds landed, then click confirm to credit the wallet.
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle">
              <th className="px-3 py-2 font-normal">User</th>
              <th className="px-3 py-2 font-normal">Amount</th>
              <th className="px-3 py-2 font-normal">Submitted</th>
              <th className="px-3 py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {(pending ?? []).length === 0 && (
              <tr><td colSpan={4} className="px-3 py-6 text-center text-foreground-muted">No pending e-transfers.</td></tr>
            )}
            {(pending ?? []).map((p: any) => (
              <tr key={p.id} className="border-b border-[var(--border)] last:border-0">
                <td className="px-3 py-3 font-mono text-xs">{String(p.user_id).slice(0, 8)}…</td>
                <td className="px-3 py-3 tabular">${Number(p.pay_amount ?? 0).toFixed(2)}</td>
                <td className="px-3 py-3 text-xs text-foreground-muted">{new Date(p.created_at).toLocaleString()}</td>
                <td className="px-3 py-3 text-right">
                  <button
                    onClick={() => confirm(p.id, Number(p.pay_amount ?? 0))}
                    disabled={busyId === p.id || !p.pay_amount}
                    className="btn-gradient inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs disabled:opacity-50"
                  >
                    <Check className="h-3 w-3" /> {busyId === p.id ? "Crediting…" : `Confirm + credit $${Number(p.pay_amount ?? 0).toFixed(2)}`}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-foreground-subtle">{label}</div>
      <div className="tabular mt-1 text-2xl">{value}</div>
    </div>
  );
}

function FeaturedServicesManager() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: featured } = useQuery({
    queryKey: ["services-featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("id, name, display_name, platform, service_type, is_featured, display_order")
        .eq("is_featured", true)
        .order("display_order", { ascending: true, nullsFirst: false });
      return data ?? [];
    },
  });

  const { data: matches } = useQuery({
    queryKey: ["services-search", q],
    queryFn: async () => {
      if (!q.trim()) return [];
      const { data } = await supabase
        .from("services")
        .select("id, name, display_name, platform, service_type, is_featured, display_order")
        .or(`name.ilike.%${q}%,display_name.ilike.%${q}%`)
        .eq("active", true)
        .limit(15);
      return data ?? [];
    },
  });

  const update = async (id: string, patch: { is_featured?: boolean; display_order?: number | null }) => {
    setBusyId(id);
    try {
      const { error } = await supabase.from("services").update(patch).eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({ queryKey: ["services-featured"] });
      qc.invalidateQueries({ queryKey: ["services-search"] });
      qc.invalidateQueries({ queryKey: ["services-public"] });
      toast.success("Updated");
    } catch (e: any) {
      toast.error(e?.message ?? "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 text-sm">
        <Star className="h-4 w-4" /> Featured services management
      </div>
      <p className="mt-1 text-xs text-foreground-subtle">
        Featured services appear first on the public /services grid, sorted by display order (lower = earlier).
      </p>

      <div className="mt-4">
        <div className="text-xs uppercase tracking-wider text-foreground-subtle">Currently featured</div>
        <div className="mt-2 space-y-1">
          {(featured ?? []).length === 0 && (
            <div className="text-xs text-foreground-muted">None featured yet.</div>
          )}
          {(featured ?? []).map((s: any) => (
            <FeaturedRow key={s.id} s={s} busy={busyId === s.id} onUpdate={update} />
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--border)] pt-4">
        <div className="flex items-center gap-2">
          <SearchIcon className="h-4 w-4 text-foreground-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search services to feature…"
            className="flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm"
          />
        </div>
        {q.trim() && (
          <div className="mt-2 space-y-1">
            {(matches ?? []).map((s: any) => (
              <FeaturedRow key={s.id} s={s} busy={busyId === s.id} onUpdate={update} />
            ))}
            {matches && matches.length === 0 && (
              <div className="text-xs text-foreground-muted">No matches.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FeaturedRow({
  s,
  busy,
  onUpdate,
}: {
  s: any;
  busy: boolean;
  onUpdate: (id: string, patch: { is_featured?: boolean; display_order?: number | null }) => void;
}) {
  const [order, setOrder] = useState<string>(s.display_order?.toString() ?? "");
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border)] px-3 py-2">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm">{s.display_name || s.name}</div>
        <div className="text-[11px] text-foreground-subtle">{s.platform} · {s.service_type}</div>
      </div>
      <input
        type="number"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        onBlur={() =>
          onUpdate(s.id, {
            display_order: order === "" ? null : Number(order),
          })
        }
        placeholder="order"
        className="w-20 rounded border border-[var(--border)] bg-transparent px-2 py-1 text-xs tabular"
      />
      <button
        disabled={busy}
        onClick={() => onUpdate(s.id, { is_featured: !s.is_featured })}
        className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${
          s.is_featured
            ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25"
            : "border border-[var(--border)] text-foreground-subtle hover:bg-[var(--surface)]"
        }`}
      >
        <Star className={`h-3 w-3 ${s.is_featured ? "fill-amber-300" : ""}`} />
        {s.is_featured ? "Featured" : "Feature"}
      </button>
    </div>
  );
}
