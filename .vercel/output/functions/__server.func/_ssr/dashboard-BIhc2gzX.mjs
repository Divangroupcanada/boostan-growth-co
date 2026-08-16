import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import { a as useAuth } from "./router-Db83cYJW.mjs";
import "../_libs/sonner.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { W as Wallet, d as ShoppingBag, T as TrendingUp, m as Activity, P as Plus, s as ArrowUpRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
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
const STATUS_STYLES = {
  pending: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)]",
  processing: "text-[var(--secondary)] bg-[color-mix(in_oklab,var(--secondary)_15%,transparent)]",
  in_progress: "text-[var(--secondary)] bg-[color-mix(in_oklab,var(--secondary)_15%,transparent)]",
  completed: "text-[var(--success)] bg-[color-mix(in_oklab,var(--success)_15%,transparent)]",
  partial: "text-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_15%,transparent)]",
  canceled: "text-[var(--foreground-muted)] bg-[var(--surface)]",
  failed: "text-[var(--danger)] bg-[color-mix(in_oklab,var(--danger)_15%,transparent)]"
};
function DashboardPage() {
  const {
    user
  } = useAuth();
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
      return data;
    },
    enabled: !!user
  });
  const {
    data: orders
  } = useQuery({
    queryKey: ["orders", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("orders").select("*, services(name, platform)").order("created_at", {
        ascending: false
      }).limit(8);
      return data ?? [];
    },
    enabled: !!user
  });
  const balance = profile?.balance ?? 0;
  const totalOrders = orders?.length ?? 0;
  const completed = orders?.filter((o) => o.status === "completed").length ?? 0;
  const spent = orders?.reduce((s, o) => s + Number(o.price), 0) ?? 0;
  const stats = [{
    label: "Wallet balance",
    value: `$${Number(balance).toFixed(2)}`,
    icon: Wallet,
    accent: "var(--primary-glow)"
  }, {
    label: "Total orders",
    value: totalOrders.toString(),
    icon: ShoppingBag,
    accent: "var(--secondary)"
  }, {
    label: "Completed",
    value: completed.toString(),
    icon: TrendingUp,
    accent: "var(--success)"
  }, {
    label: "Spent (recent)",
    value: `$${spent.toFixed(2)}`,
    icon: Activity,
    accent: "var(--accent)"
  }];
  const sample = MOCK_ORDERS;
  const showOrders = orders && orders.length > 0 ? orders : sample;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-foreground-subtle", children: "Welcome back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 text-3xl md:text-4xl", children: [
          profile?.display_name ?? user?.email?.split("@")[0],
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "·" }),
          " ready to grow."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/wallet", className: "glass inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm", children: [
          "Top up ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/new-order", className: "btn-gradient inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm", children: [
          "New order ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-4 w-4" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass relative overflow-hidden rounded-2xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl", style: {
        background: s.accent
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex items-start justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-muted", children: s.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tabular mt-2 text-2xl", children: s.value })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl bg-[var(--surface-strong)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(s.icon, { className: "h-4 w-4 text-foreground" }) })
      ] })
    ] }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "glass rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg", children: "Recent orders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground-muted", children: "Last 8 orders across your account." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/orders", className: "text-xs text-foreground-muted hover:text-foreground", children: "View all →" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-y border-[var(--border)] text-left text-xs uppercase tracking-wider text-foreground-subtle", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Service" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Link" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Quantity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Price" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-6 py-3 font-normal", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: showOrders.map((o, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-6 py-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: o.services?.name ?? o.service }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-foreground-subtle", children: o.services?.platform ?? o.platform })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "max-w-[200px] truncate px-6 py-4 text-foreground-muted", children: o.link }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "tabular px-6 py-4", children: Number(o.quantity).toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "tabular px-6 py-4", children: [
            "$",
            Number(o.price).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-block rounded-md px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[o.status] ?? ""}`, children: String(o.status).replace("_", " ") }) })
        ] }, o.id ?? i)) })
      ] }) })
    ] })
  ] });
}
const MOCK_ORDERS = [{
  id: "m1",
  services: {
    name: "Instagram Followers - HQ",
    platform: "Instagram"
  },
  link: "instagram.com/marcus.l",
  quantity: 5e3,
  price: 12,
  status: "in_progress"
}, {
  id: "m2",
  services: {
    name: "TikTok Views",
    platform: "TikTok"
  },
  link: "tiktok.com/@priya/video/9821",
  quantity: 5e4,
  price: 5,
  status: "completed"
}, {
  id: "m3",
  services: {
    name: "YouTube Subscribers",
    platform: "YouTube"
  },
  link: "youtube.com/@diegor",
  quantity: 200,
  price: 2.4,
  status: "processing"
}, {
  id: "m4",
  services: {
    name: "Twitter Likes",
    platform: "Twitter / X"
  },
  link: "x.com/marcusl/status/884",
  quantity: 1e3,
  price: 1.4,
  status: "completed"
}, {
  id: "m5",
  services: {
    name: "Telegram Members",
    platform: "Telegram"
  },
  link: "t.me/boostangrowth",
  quantity: 2500,
  price: 7,
  status: "pending"
}];
export {
  DashboardPage as component
};
