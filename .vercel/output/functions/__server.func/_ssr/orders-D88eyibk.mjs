import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-CdhWFolZ.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import { c as checkOrderStatus } from "./smmflw.functions-CQqGXrXR.mjs";
import { a as useAuth } from "./router-Db83cYJW.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { R as RefreshCw } from "../_libs/lucide-react.mjs";
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
import "./nowpayments.server-D_G7i1Kn.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
const STATUS_STYLES = {
  pending: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)]",
  processing: "text-[var(--secondary)] bg-[color-mix(in_oklab,var(--secondary)_15%,transparent)]",
  in_progress: "text-[var(--secondary)] bg-[color-mix(in_oklab,var(--secondary)_15%,transparent)]",
  completed: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_15%,transparent)]",
  partial: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)]",
  canceled: "text-[var(--foreground-muted)] bg-[var(--surface)]",
  failed: "text-[var(--danger)] bg-[color-mix(in_oklab,var(--danger)_15%,transparent)]"
};
const ACTIVE = /* @__PURE__ */ new Set(["pending", "processing", "in_progress"]);
function OrdersPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const check = useServerFn(checkOrderStatus);
  const [refreshing, setRefreshing] = reactExports.useState(null);
  const {
    data: orders
  } = useQuery({
    queryKey: ["orders-all", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("orders").select("*, services(name, platform)").order("created_at", {
        ascending: false
      });
      return data ?? [];
    },
    enabled: !!user
  });
  reactExports.useEffect(() => {
    if (!orders?.length) return;
    const active = orders.filter((o) => ACTIVE.has(o.status));
    if (!active.length) return;
    const t = setInterval(() => {
      active.forEach(async (o) => {
        try {
          await check({
            data: {
              orderId: o.id
            }
          });
        } catch {
        }
      });
      qc.invalidateQueries({
        queryKey: ["orders-all", user?.id]
      });
    }, 3e4);
    return () => clearInterval(t);
  }, [orders, check, qc, user?.id]);
  const refresh = async (id) => {
    setRefreshing(id);
    try {
      const res = await check({
        data: {
          orderId: id
        }
      });
      toast.success(`Status: ${res.status}${res.remains != null ? ` · remains ${res.remains}` : ""}`);
      qc.invalidateQueries({
        queryKey: ["orders-all", user?.id]
      });
    } catch (e) {
      toast.error(e?.message ?? "Refresh failed");
    } finally {
      setRefreshing(null);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-foreground-subtle", children: "History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl md:text-4xl", children: "Orders" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "glass overflow-hidden rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Service" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Link" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Qty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { children: [
        (orders ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { colSpan: 8, className: "px-6 py-16 text-center text-sm text-foreground-muted", children: [
          "No orders yet. Head to ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: "New order" }),
          " to create your first one."
        ] }) }),
        (orders ?? []).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4 font-mono text-xs text-foreground-subtle", children: [
            o.id.slice(0, 8),
            o.is_test_order && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 rounded bg-[var(--surface)] px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-foreground-muted", children: "test" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: o.services?.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-subtle", children: o.services?.platform })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[220px] truncate px-6 py-4 text-foreground-muted", children: o.link }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "tabular px-6 py-4", children: Number(o.quantity).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "tabular px-6 py-4", children: [
            "$",
            Number(o.price).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block rounded-md px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status] ?? ""}`, children: String(o.status).replace("_", " ") }),
            o.remains != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] text-foreground-subtle", children: [
              "remains ",
              o.remains
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4 text-xs text-foreground-muted", children: new Date(o.created_at).toLocaleDateString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => refresh(o.id), disabled: refreshing === o.id, className: "inline-flex items-center gap-1 rounded-md border border-[var(--border)] px-2 py-1 text-xs hover:bg-[var(--surface-strong)] disabled:opacity-40", title: "Refresh status", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-3 w-3 ${refreshing === o.id ? "animate-spin" : ""}` }),
            "Refresh"
          ] }) })
        ] }, o.id))
      ] })
    ] }) }) })
  ] });
}
export {
  OrdersPage as component
};
