import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { V as redirect } from "../_libs/tanstack__router-core.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as supabase, s as supabaseAdmin } from "./client.server-j8IJ-cKj.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { c as createTanStackInvokeToolHandler, a as createTanStackOAuthProtectedResourceMetadataHandler, b as createTanStackListToolsHandler, d as createTanStackMcpHandler, e as defineTool, f as defineMcp, g as auth } from "../_libs/lovable.dev__mcp-js.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import { v as verifyIpnSignature } from "./nowpayments.server-D_G7i1Kn.mjs";
import { n as number, d as string } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/jose.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
import "../_libs/ajv-formats.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-BuF-nD2m.css";
const ThemeContext = reactExports.createContext(null);
const STORAGE_KEY = "boostan-theme";
function applyTheme(t) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(t);
  root.style.colorScheme = t;
}
function ThemeProvider({ children }) {
  const [theme, setThemeState] = reactExports.useState("dark");
  const [resolved, setResolved] = reactExports.useState("dark");
  reactExports.useEffect(() => {
    applyTheme("dark");
    setResolved("dark");
    setThemeState("dark");
  }, []);
  const setTheme = (t) => {
    localStorage.setItem(STORAGE_KEY, t);
    setThemeState(t);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeContext.Provider, { value: { theme, resolved, setTheme }, children });
}
function useTheme() {
  const ctx = reactExports.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
const Ctx = reactExports.createContext(null);
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  const value = {
    session,
    user: session?.user ?? null,
    loading,
    signIn: async (email, password) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    signUp: async (email, password, displayName) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: { display_name: displayName }
        }
      });
      return { error: error?.message ?? null };
    },
    signOut: async () => {
      await supabase.auth.signOut();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value, children });
}
function useAuth() {
  const c = reactExports.useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$l = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Boostan" },
      { name: "description", content: "Boostan is a premium SMM reseller panel for buying social media engagement services." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Boostan" },
      { property: "og:description", content: "Boostan is a premium SMM reseller panel for buying social media engagement services." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "Boostan" },
      { name: "twitter:description", content: "Boostan is a premium SMM reseller panel for buying social media engagement services." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ab4645e3-0cf8-415c-8e7b-d8558ed3d243/id-preview-bf57c253--72d95eff-0bb4-44bf-ba53-b73e576a3caf.lovable.app-1778374639681.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/ab4645e3-0cf8-415c-8e7b-d8558ed3d243/id-preview-bf57c253--72d95eff-0bb4-44bf-ba53-b73e576a3caf.lovable.app-1778374639681.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$l.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) }) });
}
const $$splitComponentImporter$f = () => import("./index-DxAxnYoH.mjs");
const Route$k = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Boostan — Grow your social at the speed of light"
    }, {
      name: "description",
      content: "The premium SMM panel for serious resellers. Real engagement, instant delivery, automated API. Trusted by agencies worldwide."
    }, {
      property: "og:title",
      content: "Boostan — Premium SMM Panel"
    }, {
      property: "og:description",
      content: "Instant delivery, refill guarantee, clean API. Top up $25 and start growing."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./route-CHP2Y2V8.mjs");
const Route$j = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./about-qDx8CDjc.mjs");
const Route$i = createFileRoute()({
  head: () => ({
    meta: [{
      title: "About — Boostan"
    }, {
      name: "description",
      content: "Boostan is a premium social media engagement platform built in Toronto."
    }, {
      property: "og:title",
      content: "About — Boostan"
    }, {
      property: "og:description",
      content: "Boostan is a premium social media engagement platform built in Toronto."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./login-Wd9vHVeo.mjs");
const Route$h = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
  head: () => ({
    meta: [{
      title: "Sign in — Boostan"
    }]
  })
});
function runtimeEnv(name) {
  const runtime = globalThis;
  return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}
function configuredEnv(names) {
  for (const name of names) {
    const value = runtimeEnv(name)?.trim();
    if (value) return value;
  }
  return void 0;
}
function supabaseProjectUrl() {
  const url = configuredEnv(["SUPABASE_URL", "VITE_SUPABASE_URL"]);
  if (!url) throw new Error("SUPABASE_URL (or VITE_SUPABASE_URL) is required");
  return url;
}
function supabasePublishableKey() {
  const direct = configuredEnv([
    "SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY"
  ]);
  if (direct) return direct;
  const keyset = runtimeEnv("SUPABASE_PUBLISHABLE_KEYS");
  if (keyset) {
    try {
      const parsed = JSON.parse(keyset);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        const keys = parsed;
        const key = [keys.default, ...Object.values(keys)].find((v) => typeof v === "string" && v.trim().startsWith("sb_publishable_"))?.trim();
        if (key) return key;
      }
    } catch {
    }
  }
  const legacy = configuredEnv(["SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY"]);
  if (legacy) return legacy;
  throw new Error("SUPABASE_PUBLISHABLE_KEY, SUPABASE_PUBLISHABLE_KEYS, or SUPABASE_ANON_KEY is required");
}
function supabaseForUser(ctx) {
  const token = ctx.getToken();
  if (!token) throw new Error("supabaseForUser requires a verified OAuth token");
  return createClient(supabaseProjectUrl(), supabasePublishableKey(), {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false }
  });
}
const searchServices = defineTool({
  name: "search_services",
  title: "Search services",
  description: "Search the Boostan catalog of social growth services (Instagram, TikTok, YouTube) with pricing, tier and quantity limits.",
  inputSchema: {
    query: string().trim().optional().describe("Text to match against the service name."),
    platform: string().trim().optional().describe("Platform filter, e.g. instagram, tiktok, youtube."),
    service_type: string().trim().optional().describe("Service type filter, e.g. followers, likes, views."),
    limit: number().int().min(1).max(50).default(10).describe("Max results to return.")
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, platform, service_type, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase2 = supabaseForUser(ctx);
    let q = supabase2.from("services").select("id,name,platform,service_type,tier,rate_per_1000,min_quantity,max_quantity,is_featured").eq("active", true).order("is_featured", { ascending: false }).order("rate_per_1000", { ascending: true }).limit(limit ?? 10);
    if (query) q = q.ilike("name", `%${query}%`);
    if (platform) q = q.ilike("platform", platform);
    if (service_type) q = q.ilike("service_type", service_type);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { services: data ?? [] }
    };
  }
});
const getWalletBalance = defineTool({
  name: "get_wallet_balance",
  title: "Get wallet balance",
  description: "Return the signed-in Boostan user's wallet balance in USD.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase2 = supabaseForUser(ctx);
    const { data, error } = await supabase2.from("profiles").select("balance,display_name").eq("user_id", ctx.getUserId()).maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const balance = Number(data?.balance ?? 0);
    return {
      content: [{ type: "text", text: `Wallet balance: $${balance.toFixed(2)} USD` }],
      structuredContent: { balance, currency: "USD" }
    };
  }
});
const listOrders = defineTool({
  name: "list_orders",
  title: "List orders",
  description: "List the signed-in Boostan user's recent orders with status, quantity and price.",
  inputSchema: {
    status: string().trim().optional().describe("Optional status filter, e.g. pending, processing, completed."),
    limit: number().int().min(1).max(50).default(10).describe("Max orders to return.")
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ status, limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase2 = supabaseForUser(ctx);
    let q = supabase2.from("orders").select("id,status,quantity,price,link,is_test_order,created_at,remains,start_count,services(name,platform)").order("created_at", { ascending: false }).limit(limit ?? 10);
    if (status) q = q.eq("status", status);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { orders: data ?? [] }
    };
  }
});
const getOrder = defineTool({
  name: "get_order",
  title: "Get order",
  description: "Fetch one of the signed-in Boostan user's orders by its id.",
  inputSchema: { order_id: string().uuid().describe("The order id (uuid).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ order_id }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase2 = supabaseForUser(ctx);
    const { data, error } = await supabase2.from("orders").select("id,status,quantity,price,link,is_test_order,created_at,updated_at,remains,start_count,services(name,platform,service_type)").eq("id", order_id).maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    if (!data) return { content: [{ type: "text", text: "Order not found" }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data) }],
      structuredContent: { order: data }
    };
  }
});
const projectRef = "jadxjqzuzgeqkyfabfyo";
const mcp = defineMcp({
  name: "boostan",
  title: "Boostan",
  version: "0.1.0",
  instructions: "Tools for Boostan, a social growth panel. Search the service catalog, check the signed-in user's wallet balance, and review their orders.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated"
  }),
  tools: [searchServices, getWalletBalance, listOrders, getOrder]
});
const Route$g = createFileRoute()({
  server: {
    handlers: {
      ANY: createTanStackMcpHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
const $$splitComponentImporter$b = () => import("./privacy-BIZKCRrE.mjs");
const Route$f = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Privacy Policy — Boostan"
    }, {
      name: "description",
      content: "How Boostan collects, uses, and protects your information."
    }, {
      property: "og:title",
      content: "Privacy Policy — Boostan"
    }, {
      property: "og:description",
      content: "How Boostan collects, uses, and protects your information."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./refund-BdugnCU6.mjs");
const Route$e = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Refund Policy — Boostan"
    }, {
      name: "description",
      content: "When and how Boostan issues refunds."
    }, {
      property: "og:title",
      content: "Refund Policy — Boostan"
    }, {
      property: "og:description",
      content: "When and how Boostan issues refunds."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./services-Q0_j6ad0.mjs");
const Route$d = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
  head: () => ({
    meta: [{
      title: "All services — Boostan"
    }, {
      name: "description",
      content: "143 premium services across Instagram, TikTok, and YouTube. Click any to order."
    }]
  })
});
const $$splitComponentImporter$8 = () => import("./signup-d0Eq4GZQ.mjs");
const Route$c = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
  head: () => ({
    meta: [{
      title: "Create account — Boostan"
    }]
  })
});
const $$splitComponentImporter$7 = () => import("./terms-B44PrbEi.mjs");
const Route$b = createFileRoute()({
  head: () => ({
    meta: [{
      title: "Terms of Service — Boostan"
    }, {
      name: "description",
      content: "The terms governing your use of Boostan."
    }, {
      property: "og:title",
      content: "Terms of Service — Boostan"
    }, {
      property: "og:description",
      content: "The terms governing your use of Boostan."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const Route$a = createFileRoute()({
  server: {
    handlers: {
      // ANY: TanStack returns SPA HTML for methods not in `handlers`; the SDK 405s instead.
      ANY: createTanStackListToolsHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
const Route$9 = createFileRoute()({
  server: {
    handlers: {
      ANY: createTanStackOAuthProtectedResourceMetadataHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
const $$splitComponentImporter$6 = () => import("./admin-D-z4vj9w.mjs");
const Route$8 = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
  head: () => ({
    meta: [{
      title: "Admin — Boostan"
    }]
  })
});
const $$splitComponentImporter$5 = () => import("./api-keys-BbQJxomb.mjs");
const Route$7 = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
  head: () => ({
    meta: [{
      title: "API — Boostan"
    }]
  })
});
const $$splitComponentImporter$4 = () => import("./dashboard-BIhc2gzX.mjs");
const Route$6 = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
  head: () => ({
    meta: [{
      title: "Dashboard — Boostan"
    }]
  })
});
const $$splitComponentImporter$3 = () => import("./new-order-oTe6GexW.mjs");
const Route$5 = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
  head: () => ({
    meta: [{
      title: "New order — Boostan"
    }]
  }),
  validateSearch: (s) => ({
    service: typeof s.service === "string" ? s.service : void 0,
    platform: typeof s.platform === "string" ? s.platform : void 0,
    category: typeof s.category === "string" ? s.category : void 0,
    qty: typeof s.qty === "number" ? s.qty : typeof s.qty === "string" ? Number(s.qty) : void 0,
    tier: typeof s.tier === "string" ? s.tier : void 0
  })
});
const $$splitComponentImporter$2 = () => import("./orders-D88eyibk.mjs");
const Route$4 = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
  head: () => ({
    meta: [{
      title: "Orders — Boostan"
    }]
  })
});
const $$splitComponentImporter$1 = () => import("./wallet-Bzzb-NxD.mjs");
const Route$3 = createFileRoute()({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
  head: () => ({
    meta: [{
      title: "Wallet — Boostan"
    }]
  }),
  validateSearch: (s) => ({
    status: typeof s.status === "string" ? s.status : void 0
  })
});
function oauthApi() {
  return supabase.auth.oauth;
}
const $$splitErrorComponentImporter = () => import("../_._lovable.oauth.consent-dN0EvuH3.mjs");
const $$splitComponentImporter = () => import("../_._lovable.oauth.consent-enu_ZS29.mjs");
const Route$2 = createFileRoute()({
  ssr: false,
  validateSearch: (s) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : ""
  }),
  beforeLoad: async ({
    search,
    location
  }) => {
    if (!search.authorization_id) throw new Error("Missing authorization_id");
    const {
      data
    } = await supabase.auth.getSession();
    const next = location.pathname + location.searchStr;
    if (!data.session) throw redirect({
      to: "/login",
      search: {
        redirect: next
      }
    });
  },
  loader: async ({
    location
  }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id");
    const {
      data,
      error
    } = await oauthApi().getAuthorizationDetails(authorizationId);
    if (error) throw error;
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) throw redirect({
      href: immediate
    });
    return data;
  },
  component: lazyRouteComponent($$splitComponentImporter, "component"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent")
});
const Route$1 = createFileRoute()({
  server: {
    handlers: {
      // ANY: TanStack returns SPA HTML for methods not in `handlers`; the SDK 405s instead.
      ANY: createTanStackInvokeToolHandler(mcp, { resourcePath: "/mcp", metadataPath: "/.well-known/oauth-protected-resource", trustForwardedHost: true })
    }
  }
});
const SENSITIVE_HEADER_KEYS = /* @__PURE__ */ new Set([
  "authorization",
  "cookie",
  "x-nowpayments-sig",
  "x-api-key"
]);
function maskHeaders(h) {
  const out = {};
  h.forEach((value, key) => {
    if (SENSITIVE_HEADER_KEYS.has(key.toLowerCase())) {
      out[key] = value.length <= 8 ? "***" : `${value.slice(0, 6)}…(${value.length})`;
    } else {
      out[key] = value;
    }
  });
  return out;
}
async function persistLog(entry) {
  try {
    await supabaseAdmin.from("webhook_logs").insert(entry);
  } catch (e) {
    console.error(`[nowpayments-webhook] failed to persist log: ${e?.message}`);
  }
}
async function processNowpaymentsWebhook(raw, sig, meta) {
  const log = {
    source: "nowpayments",
    method: meta.method,
    headers: maskHeaders(meta.headers),
    raw_body: raw,
    parsed_payload: null,
    signature_valid: null,
    signature_reason: null,
    payment_id: null,
    payment_status: null,
    tx_lookup_found: null,
    tx_id: null,
    action: null,
    amount_credited: null,
    response_status: 200,
    error: null,
    is_test: meta.isTest
  };
  console.log(
    `[nowpayments-webhook] received sig=${sig?.slice(0, 16) ?? "null"}… body_len=${raw.length} test=${meta.isTest}`
  );
  const sigValid = verifyIpnSignature(raw, sig);
  log.signature_valid = sigValid;
  if (!sigValid) {
    log.signature_reason = sig ? "HMAC mismatch" : "missing x-nowpayments-sig header";
    log.action = "rejected_invalid_signature";
    log.response_status = 401;
    log.error = log.signature_reason;
    console.error(`[nowpayments-webhook] INVALID SIGNATURE — ${log.signature_reason}`);
    await persistLog(log);
    return { status: 401, body: "Invalid signature", log };
  }
  log.signature_reason = "ok";
  let body;
  try {
    body = JSON.parse(raw);
    log.parsed_payload = body;
  } catch (e) {
    log.action = "bad_json";
    log.error = e?.message ?? "JSON parse error";
    log.response_status = 400;
    await persistLog(log);
    return { status: 400, body: "Bad JSON", log };
  }
  const paymentId = String(body.payment_id);
  const status = String(body.payment_status ?? "").toLowerCase();
  log.payment_id = paymentId;
  log.payment_status = status;
  console.log(`[nowpayments-webhook] payment_id=${paymentId} status=${status}`);
  const { data: pending, error: pErr } = await supabaseAdmin.from("transactions").select("id, user_id, type, payment_status").eq("payment_id", paymentId).eq("type", "deposit_pending").maybeSingle();
  if (pErr) {
    log.action = "db_error";
    log.error = pErr.message;
    log.response_status = 500;
    console.error(`[nowpayments-webhook] db error: ${pErr.message}`);
    await persistLog(log);
    return { status: 500, body: "DB error", log };
  }
  log.tx_lookup_found = !!pending;
  if (!pending) {
    log.action = "no_pending_tx_ignored";
    console.warn(`[nowpayments-webhook] no pending tx for payment_id=${paymentId} — ignoring`);
    await persistLog(log);
    return { status: 200, body: "ok", log };
  }
  log.tx_id = pending.id;
  const isCredit = status === "finished" || status === "confirmed";
  const isFailed = status === "failed" || status === "expired" || status === "refunded";
  const isPartial = status === "partially_paid";
  await supabaseAdmin.from("transactions").update({
    payment_status: status,
    ipn_payload: body,
    pay_address: body.pay_address ?? null,
    pay_amount: body.pay_amount ?? null,
    pay_currency: body.pay_currency ?? null
  }).eq("id", pending.id);
  if (isCredit) {
    const amountUsd = Number(body.price_amount);
    if (!Number.isFinite(amountUsd) || amountUsd <= 0) {
      log.action = "invalid_amount";
      log.error = `invalid price_amount: ${body.price_amount}`;
      console.error(`[nowpayments-webhook] ${log.error}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }
    const { data: profile, error: prErr } = await supabaseAdmin.from("profiles").select("balance").eq("user_id", pending.user_id).single();
    if (prErr) {
      log.action = "profile_lookup_failed";
      log.error = prErr.message;
      console.error(`[nowpayments-webhook] profile lookup failed: ${prErr.message}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }
    const newBalance = Number(profile.balance) + amountUsd;
    const { error: insErr } = await supabaseAdmin.from("transactions").insert({
      user_id: pending.user_id,
      type: "deposit",
      amount: amountUsd,
      status: "completed",
      description: meta.isTest ? "TEST webhook — simulated credit (no real funds)" : "Crypto deposit confirmed via NOWPayments",
      balance_after: newBalance,
      payment_id: paymentId,
      payment_status: status,
      ipn_payload: body
    });
    if (insErr) {
      if (insErr.code === "23505") {
        log.action = "already_credited_idempotent";
        console.log(`[nowpayments-webhook] already credited payment_id=${paymentId}`);
        await persistLog(log);
        return { status: 200, body: "ok", log };
      }
      log.action = "insert_deposit_failed";
      log.error = insErr.message;
      console.error(`[nowpayments-webhook] insert deposit failed: ${insErr.message}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }
    const { error: balErr } = await supabaseAdmin.from("profiles").update({ balance: newBalance, updated_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("user_id", pending.user_id);
    if (balErr) {
      log.action = "balance_update_failed";
      log.error = balErr.message;
      console.error(`[nowpayments-webhook] balance update failed: ${balErr.message}`);
      await persistLog(log);
      return { status: 200, body: "ok", log };
    }
    log.action = "credited";
    log.amount_credited = amountUsd;
    console.log(`[nowpayments-webhook] credited $${amountUsd} to user ${pending.user_id}, new balance $${newBalance}`);
  } else if (isPartial) {
    await supabaseAdmin.from("transactions").update({
      description: `⚠ Partial payment — admin review needed (paid: ${body.actually_paid} ${body.pay_currency})`
    }).eq("id", pending.id);
    log.action = "partial_flagged";
    console.warn(`[nowpayments-webhook] partial payment for ${paymentId}`);
  } else if (isFailed) {
    log.action = `marked_${status}`;
    console.log(`[nowpayments-webhook] payment ${paymentId} ${status}`);
  } else {
    log.action = `intermediate_${status}`;
    console.log(`[nowpayments-webhook] intermediate status ${status} for ${paymentId}`);
  }
  await persistLog(log);
  return { status: 200, body: "ok", log };
}
const Route = createFileRoute()({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const raw = await request.text();
        const sig = request.headers.get("x-nowpayments-sig");
        const result = await processNowpaymentsWebhook(raw, sig, {
          method: "POST",
          headers: request.headers,
          isTest: request.headers.get("x-boostan-test") === "1"
        });
        return new Response(result.body, { status: result.status });
      }
    }
  }
});
const IndexRoute = Route$k.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$l
});
const AuthenticatedRouteRoute = Route$j.update({
  id: "/_authenticated",
  getParentRoute: () => Route$l
});
const AboutRoute = Route$i.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$l
});
const LoginRoute = Route$h.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$l
});
const McpRoute = Route$g.update({
  id: "/mcp",
  path: "/mcp",
  getParentRoute: () => Route$l
});
const PrivacyRoute = Route$f.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$l
});
const RefundRoute = Route$e.update({
  id: "/refund",
  path: "/refund",
  getParentRoute: () => Route$l
});
const ServicesRoute = Route$d.update({
  id: "/services",
  path: "/services",
  getParentRoute: () => Route$l
});
const SignupRoute = Route$c.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$l
});
const TermsRoute = Route$b.update({
  id: "/terms",
  path: "/terms",
  getParentRoute: () => Route$l
});
const Char91DotmcpChar93ListToolsRoute = Route$a.update({
  id: "/.mcp/list-tools",
  path: "/.mcp/list-tools",
  getParentRoute: () => Route$l
});
const Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$9.update({
  id: "/.well-known/oauth-protected-resource",
  path: "/.well-known/oauth-protected-resource",
  getParentRoute: () => Route$l
});
const AuthenticatedAdminRoute = Route$8.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedApiKeysRoute = Route$7.update({
  id: "/api-keys",
  path: "/api-keys",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedDashboardRoute = Route$6.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedNewOrderRoute = Route$5.update({
  id: "/new-order",
  path: "/new-order",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedOrdersRoute = Route$4.update({
  id: "/orders",
  path: "/orders",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedWalletRoute = Route$3.update({
  id: "/wallet",
  path: "/wallet",
  getParentRoute: () => AuthenticatedRouteRoute
});
const DotlovableOauthConsentRoute = Route$2.update({
  id: "/.lovable/oauth/consent",
  path: "/.lovable/oauth/consent",
  getParentRoute: () => Route$l
});
const Char91DotmcpChar93InvokeToolToolRoute = Route$1.update({
  id: "/.mcp/invoke-tool/$tool",
  path: "/.mcp/invoke-tool/$tool",
  getParentRoute: () => Route$l
});
const ApiPublicNowpaymentsWebhookRoute = Route.update({
  id: "/api/public/nowpayments-webhook",
  path: "/api/public/nowpayments-webhook",
  getParentRoute: () => Route$l
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRoute,
  AuthenticatedApiKeysRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedNewOrderRoute,
  AuthenticatedOrdersRoute,
  AuthenticatedWalletRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AboutRoute,
  LoginRoute,
  McpRoute,
  PrivacyRoute,
  RefundRoute,
  ServicesRoute,
  SignupRoute,
  TermsRoute,
  Char91DotmcpChar93ListToolsRoute,
  Char91DotwellKnownChar93OauthProtectedResourceRoute,
  DotlovableOauthConsentRoute,
  Char91DotmcpChar93InvokeToolToolRoute,
  ApiPublicNowpaymentsWebhookRoute
};
const routeTree = Route$l._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$5 as R,
  useAuth as a,
  Route$2 as b,
  oauthApi as o,
  router as r,
  useTheme as u
};
