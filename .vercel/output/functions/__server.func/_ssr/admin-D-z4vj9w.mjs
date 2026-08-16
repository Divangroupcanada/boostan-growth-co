import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-CdhWFolZ.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import { s as syncServices, g as getProviderBalance } from "./smmflw.functions-CQqGXrXR.mjs";
import { a as adminConfirmManualDeposit, l as listWebhookLogs, t as triggerTestWebhook } from "./nowpayments.functions-BABHDkfq.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as Root2, L as List, T as Trigger, C as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { c as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import "../_libs/seroval.mjs";
import { D as Database, R as RefreshCw, W as Wallet, l as Settings, m as Activity, n as CirclePlay, o as Mail, a as Check, b as Star, p as Search, C as ChevronDown, q as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "./auth-client-middleware-B9dl4-ow.mjs";
import "../_libs/zod.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/radix-ui__react-presence.mjs";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Tabs = Root2;
const TabsList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  List,
  {
    ref,
    className: cn(
      "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
      className
    ),
    ...props
  }
));
TabsList.displayName = List.displayName;
const TabsTrigger = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Trigger,
  {
    ref,
    className: cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
      className
    ),
    ...props
  }
));
TabsTrigger.displayName = Trigger.displayName;
const TabsContent = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content,
  {
    ref,
    className: cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    ),
    ...props
  }
));
TabsContent.displayName = Content.displayName;
function AdminPage() {
  const qc = useQueryClient();
  const sync = useServerFn(syncServices);
  const balance = useServerFn(getProviderBalance);
  const [syncing, setSyncing] = reactExports.useState(false);
  const [loadingBal, setLoadingBal] = reactExports.useState(false);
  const [providerBal, setProviderBal] = reactExports.useState(null);
  const {
    data: settings
  } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("settings").select("*").eq("id", true).maybeSingle();
      return data;
    }
  });
  const {
    data: serviceCount
  } = useQuery({
    queryKey: ["services-count"],
    queryFn: async () => {
      const {
        count
      } = await supabase.from("services").select("*", {
        count: "exact",
        head: true
      }).eq("active", true);
      return count ?? 0;
    }
  });
  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await sync();
      toast.success(`Synced ${res.synced} services (${res.total_from_provider} from provider)`);
      qc.invalidateQueries({
        queryKey: ["services-all"]
      });
      qc.invalidateQueries({
        queryKey: ["services-count"]
      });
      qc.invalidateQueries({
        queryKey: ["settings"]
      });
    } catch (e) {
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
    } catch (e) {
      toast.error(e?.message ?? "Balance check failed");
    } finally {
      setLoadingBal(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-foreground-subtle", children: "Admin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl md:text-4xl", children: "Operations" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-4 w-4" }),
          " Services catalog"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabular mt-3 text-3xl", children: serviceCount ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-foreground-subtle", children: [
          "Last sync:",
          " ",
          settings?.last_services_sync ? new Date(settings.last_services_sync).toLocaleString() : "never"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSync, disabled: syncing, className: "btn-gradient mt-5 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${syncing ? "animate-spin" : ""}` }),
          syncing ? "Syncing…" : "Sync services from SMMFLW"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "h-4 w-4" }),
          " Provider balance"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabular mt-3 text-3xl", children: providerBal ? `$${providerBal.balance.toFixed(2)}` : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-subtle", children: providerBal?.currency ?? "Click to fetch from SMMFLW" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleBalance, disabled: loadingBal, className: "mt-5 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] px-4 py-2 text-sm hover:bg-[var(--surface)] disabled:opacity-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${loadingBal ? "animate-spin" : ""}` }),
          "Check balance"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "h-4 w-4" }),
        " Pricing settings"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Markup", value: `${Number(settings?.markup_percentage ?? 0)}%` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Fixed fee / 1k", value: `$${Number(settings?.fixed_fee ?? 0).toFixed(2)}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Min deposit", value: `$${Number(settings?.min_deposit ?? 0).toFixed(2)}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-xs text-foreground-subtle", children: [
        "Markup applies on next sync: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "base × (1 + markup%) + fee" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PendingManualDeposits, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedServicesManager, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "webhooks", className: "w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "webhooks", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
          " Webhook activity"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "test", className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4" }),
          " Test webhook"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "webhooks", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WebhookActivity, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "test", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TestWebhook, {}) })
    ] })
  ] });
}
function WebhookActivity() {
  const listFn = useServerFn(listWebhookLogs);
  const [onlyFailures, setOnlyFailures] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState({});
  const {
    data,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ["webhook-logs", onlyFailures],
    queryFn: () => listFn({
      data: {
        limit: 100,
        only_failures: onlyFailures
      }
    }),
    refetchInterval: 15e3
  });
  const rows = data?.rows ?? [];
  const actionTone = (r) => {
    if (r.signature_valid === false) return "text-red-400";
    if (r.error) return "text-amber-400";
    if (r.action === "credited") return "text-emerald-400";
    if (r.action === "already_credited_idempotent") return "text-foreground-muted";
    return "text-foreground";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "h-4 w-4" }),
          " Recent webhook calls"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-foreground-subtle", children: "Live log of every NOWPayments callback. Auto-refreshes every 15s. For the first 30 days, every call is captured in full." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: onlyFailures, onChange: (e) => setOnlyFailures(e.target.checked) }),
          "Only failures"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => refetch(), className: "inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs hover:bg-[var(--surface)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3 w-3 ${isFetching ? "animate-spin" : ""}` }),
          " Refresh"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal w-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "Sig" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "Payment ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "Action" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "Credited" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "HTTP" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-2 py-2 font-normal", children: "Test" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        rows.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 9, className: "px-3 py-6 text-center text-foreground-muted", children: "No webhook activity yet." }) }),
        rows.map((r) => {
          const isOpen = !!expanded[r.id];
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--border)] last:border-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setExpanded((s) => ({
                ...s,
                [r.id]: !isOpen
              })), children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-xs text-foreground-muted whitespace-nowrap", children: new Date(r.created_at).toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: r.signature_valid === true ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-400 text-xs", children: "✓" }) : r.signature_valid === false ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 text-xs", children: "✗" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground-muted text-xs", children: "—" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 font-mono text-xs", children: r.payment_id ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-xs", children: r.payment_status ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: `px-2 py-2 text-xs ${actionTone(r)}`, children: r.action ?? "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 tabular text-xs", children: r.amount_credited ? `$${Number(r.amount_credited).toFixed(2)}` : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 tabular text-xs", children: r.response_status }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-xs", children: r.is_test ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-400", children: "TEST" }) : "" })
            ] }, r.id),
            isOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--border)] bg-[var(--surface)]/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-2 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs", children: [
                r.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground-subtle", children: "error:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400", children: r.error })
                ] }),
                r.signature_reason && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground-subtle", children: "sig reason:" }),
                  " ",
                  r.signature_reason
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground-subtle", children: "tx lookup:" }),
                  " ",
                  r.tx_lookup_found ? `found (${r.tx_id?.slice(0, 8)}…)` : "not found"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-foreground-subtle", children: "headers" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-1 overflow-x-auto rounded bg-black/30 p-2 text-[10px]", children: JSON.stringify(r.headers, null, 2) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer text-foreground-subtle", children: "payload" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-1 overflow-x-auto rounded bg-black/30 p-2 text-[10px]", children: JSON.stringify(r.parsed_payload ?? r.raw_body, null, 2) })
                ] })
              ] }) })
            ] }, r.id + "-d")
          ] }, r.id);
        })
      ] })
    ] }) })
  ] });
}
function TestWebhook() {
  const triggerFn = useServerFn(triggerTestWebhook);
  const qc = useQueryClient();
  const [paymentId, setPaymentId] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState(1);
  const [status, setStatus] = reactExports.useState("finished");
  const [busy, setBusy] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const run = async () => {
    setBusy(true);
    setResult(null);
    try {
      const res = await triggerFn({
        data: {
          payment_id: paymentId.trim() || void 0,
          amount_usd: Number(amount),
          status
        }
      });
      setResult(res);
      toast.success(`Webhook returned ${res.response_status}`);
      qc.invalidateQueries({
        queryKey: ["webhook-logs"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Test failed");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4" }),
      " Trigger test webhook"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-xs text-foreground-subtle", children: [
      "Posts a fake-but-cryptographically-valid NOWPayments callback to ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "/api/public/nowpayments-webhook" }),
      ". Leave Payment ID blank to verify HMAC + lookup path. To test the full credit pipeline, paste a real ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "payment_id" }),
      ` from a pending crypto deposit (the user's balance WILL be credited and a transaction labeled "TEST" will be recorded).`
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground-subtle", children: "Payment ID (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: paymentId, onChange: (e) => setPaymentId(e.target.value), placeholder: "leave blank for fake", className: "mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground-subtle", children: "Amount USD" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", step: "0.01", value: amount, onChange: (e) => setAmount(Number(e.target.value)), className: "mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm tabular" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground-subtle", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: status, onChange: (e) => setStatus(e.target.value), className: "mt-1 w-full rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm", children: ["finished", "confirmed", "partially_paid", "failed", "expired", "waiting"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: run, disabled: busy, className: "btn-gradient mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm disabled:opacity-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "h-4 w-4" }),
      " ",
      busy ? "Sending…" : "Trigger test webhook"
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-4 overflow-x-auto rounded bg-black/30 p-3 text-[11px]", children: JSON.stringify(result, null, 2) })
  ] });
}
function PendingManualDeposits() {
  const qc = useQueryClient();
  const confirmFn = useServerFn(adminConfirmManualDeposit);
  const [busyId, setBusyId] = reactExports.useState(null);
  const {
    data: pending
  } = useQuery({
    queryKey: ["pending-etransfers"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("transactions").select("id, user_id, pay_amount, payment_status, created_at, description").eq("type", "manual_etransfer").neq("payment_status", "finished").order("created_at", {
        ascending: false
      });
      return data ?? [];
    },
    refetchInterval: 3e4
  });
  const confirm = async (id, amount) => {
    setBusyId(id);
    try {
      await confirmFn({
        data: {
          transaction_id: id,
          amount_usd: amount
        }
      });
      toast.success(`Credited $${amount.toFixed(2)}`);
      qc.invalidateQueries({
        queryKey: ["pending-etransfers"]
      });
    } catch (e) {
      toast.error(e?.message ?? "Failed to credit");
    } finally {
      setBusyId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-4 w-4" }),
      " Pending manual deposits"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-foreground-subtle", children: "E-transfers submitted by users. Verify the funds landed, then click confirm to credit the wallet." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-normal", children: "User" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-normal", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-normal", children: "Submitted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 font-normal" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        (pending ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 4, className: "px-3 py-6 text-center text-foreground-muted", children: "No pending e-transfers." }) }),
        (pending ?? []).map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--border)] last:border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 font-mono text-xs", children: [
            String(p.user_id).slice(0, 8),
            "…"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-3 py-3 tabular", children: [
            "$",
            Number(p.pay_amount ?? 0).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-xs text-foreground-muted", children: new Date(p.created_at).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => confirm(p.id, Number(p.pay_amount ?? 0)), disabled: busyId === p.id || !p.pay_amount, className: "btn-gradient inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs disabled:opacity-50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3 w-3" }),
            " ",
            busyId === p.id ? "Crediting…" : `Confirm + credit $${Number(p.pay_amount ?? 0).toFixed(2)}`
          ] }) })
        ] }, p.id))
      ] })
    ] }) })
  ] });
}
function Stat({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-subtle", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabular mt-1 text-2xl", children: value })
  ] });
}
function FeaturedServicesManager() {
  const qc = useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [busyId, setBusyId] = reactExports.useState(null);
  const {
    data: featured
  } = useQuery({
    queryKey: ["services-featured"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("services").select("id, name, display_name, platform, service_type, is_featured, display_order").eq("is_featured", true).order("display_order", {
        ascending: true,
        nullsFirst: false
      });
      return data ?? [];
    }
  });
  const {
    data: matches
  } = useQuery({
    queryKey: ["services-search", q],
    queryFn: async () => {
      if (!q.trim()) return [];
      const {
        data
      } = await supabase.from("services").select("id, name, display_name, platform, service_type, is_featured, display_order").or(`name.ilike.%${q}%,display_name.ilike.%${q}%`).eq("active", true).limit(15);
      return data ?? [];
    }
  });
  const update = async (id, patch) => {
    setBusyId(id);
    try {
      const {
        error
      } = await supabase.from("services").update(patch).eq("id", id);
      if (error) throw error;
      qc.invalidateQueries({
        queryKey: ["services-featured"]
      });
      qc.invalidateQueries({
        queryKey: ["services-search"]
      });
      qc.invalidateQueries({
        queryKey: ["services-public"]
      });
      toast.success("Updated");
    } catch (e) {
      toast.error(e?.message ?? "Update failed");
    } finally {
      setBusyId(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4" }),
      " Featured services management"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-foreground-subtle", children: "Featured services appear first on the public /services grid, sorted by display order (lower = earlier)." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-foreground-subtle", children: "Currently featured" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
        (featured ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-muted", children: "None featured yet." }),
        (featured ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedRow, { s, busy: busyId === s.id, onUpdate: update }, s.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 border-t border-[var(--border)] pt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4 w-4 text-foreground-subtle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search services to feature…", className: "flex-1 rounded-lg border border-[var(--border)] bg-transparent px-3 py-2 text-sm" })
      ] }),
      q.trim() && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
        (matches ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(FeaturedRow, { s, busy: busyId === s.id, onUpdate: update }, s.id)),
        matches && matches.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-muted", children: "No matches." })
      ] })
    ] })
  ] });
}
function FeaturedRow({
  s,
  busy,
  onUpdate
}) {
  const [order, setOrder] = reactExports.useState(s.display_order?.toString() ?? "");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 rounded-md border border-[var(--border)] px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-sm", children: s.display_name || s.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-foreground-subtle", children: [
        s.platform,
        " · ",
        s.service_type
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", value: order, onChange: (e) => setOrder(e.target.value), onBlur: () => onUpdate(s.id, {
      display_order: order === "" ? null : Number(order)
    }), placeholder: "order", className: "w-20 rounded border border-[var(--border)] bg-transparent px-2 py-1 text-xs tabular" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: busy, onClick: () => onUpdate(s.id, {
      is_featured: !s.is_featured
    }), className: `inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs transition-colors ${s.is_featured ? "bg-amber-500/15 text-amber-300 hover:bg-amber-500/25" : "border border-[var(--border)] text-foreground-subtle hover:bg-[var(--surface)]"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-3 w-3 ${s.is_featured ? "fill-amber-300" : ""}` }),
      s.is_featured ? "Featured" : "Feature"
    ] })
  ] });
}
export {
  AdminPage as component
};
