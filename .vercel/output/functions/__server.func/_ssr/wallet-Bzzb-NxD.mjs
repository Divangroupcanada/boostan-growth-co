import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { f as useSearch } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-CdhWFolZ.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import { a as useAuth } from "./router-Db83cYJW.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { c as createDeposit, m as markManualEtransfer } from "./nowpayments.functions-BABHDkfq.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { B as Bitcoin, o as Mail, P as Plus, E as ExternalLink, t as Clock, u as ArrowDownRight, s as ArrowUpRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./server-B-gRx3ND.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./nowpayments.server-D_G7i1Kn.mjs";
import "../_libs/zod.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
import "./auth-client-middleware-B9dl4-ow.mjs";
const PRESETS = [25, 50, 100, 250];
function WalletPage() {
  const {
    status
  } = useSearch({
    from: "/_authenticated/wallet"
  });
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const [tab, setTab] = reactExports.useState("crypto");
  const [amount, setAmount] = reactExports.useState(25);
  const [loading, setLoading] = reactExports.useState(false);
  const [etransferAmount, setEtransferAmount] = reactExports.useState(25);
  const [etransferLoading, setEtransferLoading] = reactExports.useState(false);
  const createDepositFn = useServerFn(createDeposit);
  const markEtransferFn = useServerFn(markManualEtransfer);
  reactExports.useEffect(() => {
    if (status === "success") {
      toast.success("Payment received! Balance updates within 1–2 minutes once confirmed on-chain.", {
        duration: 8e3
      });
    } else if (status === "cancel") {
      toast.info("Payment cancelled. You can try again any time.");
    }
  }, [status]);
  const {
    data: settings
  } = useQuery({
    queryKey: ["settings-min"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("settings").select("min_deposit").eq("id", true).maybeSingle();
      return data;
    }
  });
  const minDeposit = Number(settings?.min_deposit ?? 25);
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("profiles").select("balance").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user,
    refetchInterval: 3e4
    // auto-refresh every 30s to catch webhook updates
  });
  const {
    data: txs
  } = useQuery({
    queryKey: ["txs", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("transactions").select("*").order("created_at", {
        ascending: false
      }).limit(50);
      return data ?? [];
    },
    enabled: !!user,
    refetchInterval: 3e4
  });
  const startCryptoDeposit = async () => {
    if (!user) return;
    if (amount < minDeposit) {
      toast.error(`Minimum deposit is $${minDeposit.toFixed(2)}`);
      return;
    }
    setLoading(true);
    try {
      const res = await createDepositFn({
        data: {
          amount_usd: amount
        }
      });
      qc.invalidateQueries({
        queryKey: ["txs", user.id]
      });
      window.location.href = res.invoice_url;
    } catch (e) {
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
      await markEtransferFn({
        data: {
          amount_usd: etransferAmount
        }
      });
      qc.invalidateQueries({
        queryKey: ["txs", user.id]
      });
      toast.success("Marked as sent. Admin will credit within 4 hours during business hours.");
    } catch (e) {
      toast.error(e?.message ?? "Failed to record e-transfer");
    } finally {
      setEtransferLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "flex flex-wrap items-end justify-between gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-foreground-subtle", children: "Wallet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl md:text-4xl", children: "Balance & top-ups" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-5 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass relative overflow-hidden rounded-2xl p-7 lg:col-span-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-orb", style: {
          top: -120,
          right: -120,
          background: "var(--primary-glow)",
          opacity: 0.35,
          width: 280,
          height: 280
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-muted", children: "Available balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabular gradient-text mt-2 text-5xl", children: [
            "$",
            Number(profile?.balance ?? 0).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs text-foreground-subtle", children: "USD · auto-refreshes every 30s" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-7 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex gap-2 border-b border-[var(--border)] pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("crypto"), className: `inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${tab === "crypto" ? "bg-[var(--surface)] text-foreground" : "text-foreground-muted hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bitcoin, { className: "h-3.5 w-3.5" }),
            " Crypto"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTab("etransfer"), className: `inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${tab === "etransfer" ? "bg-[var(--surface)] text-foreground" : "text-foreground-muted hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3.5 w-3.5" }),
            " E-transfer (Canada)"
          ] })
        ] }),
        tab === "crypto" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg", children: "Top up with crypto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground-muted", children: "Pay with USDT (TRC-20). You'll be redirected to NOWPayments hosted checkout." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap gap-2", children: [
            PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setAmount(p), className: `rounded-lg px-4 py-2 text-sm transition ${amount === p ? "gradient-bg text-white" : "glass text-foreground-muted hover:text-foreground"}`, children: [
              "$",
              p
            ] }, p)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: minDeposit, value: amount, onChange: (e) => setAmount(Number(e.target.value)), className: "w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: startCryptoDeposit, disabled: loading || amount < minDeposit, className: "btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm disabled:opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" }),
            " ",
            loading ? "Creating invoice…" : `Pay $${amount.toFixed(2)} with crypto`,
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs text-foreground-subtle", children: [
            "Minimum deposit $",
            minDeposit.toFixed(2),
            ". Balance is credited automatically once on-chain confirmation completes."
          ] })
        ] }),
        tab === "etransfer" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg", children: "E-transfer (Canada)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ol", { className: "mt-3 space-y-2 text-sm text-foreground-muted", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "1. Send your deposit to ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "balamchi.shahab@gmail.com" }),
              " (Interac e-transfer)."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "2. Use auto-deposit, or password: ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-[var(--surface)] px-1.5 py-0.5", children: "BOOSTAN" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "3. Include your registered email in the message." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "4. Funds credited within 4 hours during business hours." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground-muted", children: "Amount sent (USD):" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", min: minDeposit, value: etransferAmount, onChange: (e) => setEtransferAmount(Number(e.target.value)), className: "w-28 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm outline-none" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submitEtransfer, disabled: etransferLoading || etransferAmount < minDeposit, className: "btn-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm disabled:opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
            " ",
            etransferLoading ? "Submitting…" : "Mark as sent"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass overflow-hidden rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg", children: "Transaction history" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
          (txs ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "px-6 py-16 text-center text-foreground-muted", children: "No transactions yet." }) }),
          (txs ?? []).map((t) => {
            const positive = Number(t.amount) > 0;
            const isPending = t.type === "deposit_pending" || t.type === "manual_etransfer";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 capitalize", children: [
                isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3.5 w-3.5 text-[var(--warning)]" }) : positive ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownRight, { className: "h-3.5 w-3.5 text-[var(--success)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5 text-foreground-muted" }),
                String(t.type).replace(/_/g, " ")
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-foreground-muted", children: t.description ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `tabular px-6 py-4 ${positive ? "text-[var(--success)]" : ""}`, children: Number(t.amount) === 0 ? "—" : `${positive ? "+" : ""}$${Math.abs(Number(t.amount)).toFixed(2)}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-xs text-foreground-muted capitalize", children: isPending ? "⏳ pending" : t.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-xs text-foreground-muted", children: new Date(t.created_at).toLocaleString() })
            ] }, t.id);
          })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  WalletPage as component
};
