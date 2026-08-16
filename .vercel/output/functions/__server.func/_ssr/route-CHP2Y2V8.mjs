import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useRouterState, N as Navigate, L as Link, O as Outlet } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as useAuth, u as useTheme } from "./router-Db83cYJW.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import "../_libs/sonner.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { S as Sprout, L as LayoutDashboard, c as Sparkles, d as ShoppingBag, e as ListOrdered, W as Wallet, f as CodeXml, g as Shield, h as LogOut, M as Moon, i as Sun, j as Monitor } from "../_libs/lucide-react.mjs";
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
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: () => setTheme(next),
      className: "glass inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground-muted transition-colors hover:text-foreground",
      "aria-label": `Theme: ${theme}. Switch to ${next}.`,
      title: `Theme: ${theme}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" })
    }
  );
}
const NAV = [{
  to: "/dashboard",
  label: "Dashboard",
  icon: LayoutDashboard
}, {
  to: "/services",
  label: "Services",
  icon: Sparkles
}, {
  to: "/new-order",
  label: "New order",
  icon: ShoppingBag
}, {
  to: "/orders",
  label: "Orders",
  icon: ListOrdered
}, {
  to: "/wallet",
  label: "Wallet",
  icon: Wallet
}, {
  to: "/api-keys",
  label: "API",
  icon: CodeXml
}];
function AuthenticatedLayout() {
  const {
    session,
    loading,
    signOut,
    user
  } = useAuth();
  const path = useRouterState({
    select: (s) => s.location.pathname
  });
  const {
    data: isAdmin
  } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      return !!data;
    },
    enabled: !!user
  });
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-foreground-muted", children: "Loading…" }) });
  }
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-orb", style: {
      top: -260,
      left: -200,
      background: "var(--primary)",
      opacity: 0.3
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-orb", style: {
      top: 600,
      right: -240,
      background: "var(--secondary)",
      opacity: 0.22
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 mx-auto flex min-h-screen max-w-[1400px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-[var(--border)] px-4 py-6 lg:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "mb-10 flex items-center gap-2 px-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 place-items-center rounded-lg gradient-bg shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-4 w-4 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium", children: "Boostan" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "flex flex-col gap-1", children: [
          NAV.map((n) => {
            const active = path === n.to || n.to !== "/dashboard" && path.startsWith(n.to);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: n.to, className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-[var(--surface-strong)] text-foreground" : "text-foreground-muted hover:bg-[var(--surface)] hover:text-foreground"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(n.icon, { className: "h-4 w-4" }),
              n.label
            ] }, n.to);
          }),
          isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/admin", className: `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${path.startsWith("/admin") ? "bg-[var(--surface-strong)] text-foreground" : "text-foreground-muted hover:bg-[var(--surface)] hover:text-foreground"}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-4 w-4" }),
            "Admin"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto flex flex-col gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground-subtle", children: "Signed in" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate text-foreground", children: user?.email })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeToggle, {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-foreground-muted hover:bg-[var(--surface)] hover:text-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-3.5 w-3.5" }),
              " Sign out"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-[var(--border)] bg-background/80 px-4 py-3 backdrop-blur lg:hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/dashboard", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 place-items-center rounded-lg gradient-bg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-3.5 w-3.5 text-white" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Boostan" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: signOut, className: "text-xs text-foreground-muted", children: "Sign out" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 px-5 pb-20 pt-20 lg:px-10 lg:pt-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
export {
  AuthenticatedLayout as component
};
