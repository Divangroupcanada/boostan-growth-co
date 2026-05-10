import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { syncServices, getProviderBalance } from "@/lib/smmflw.functions";
import { adminConfirmManualDeposit } from "@/lib/nowpayments.functions";
import { useState } from "react";
import { toast } from "sonner";
import { RefreshCw, Wallet, Database, Settings as SettingsIcon, Mail, Check } from "lucide-react";

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
