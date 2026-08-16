import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import { S as ServiceCard } from "./service-card-DlnpPzED.mjs";
import { S as SERVICE_TYPE_LABEL } from "./service-tier-Br2B6ZKx.mjs";
import "../_libs/sonner.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { A as ArrowRight, C as ChevronDown, a as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/react-icons.mjs";
import "./router-Db83cYJW.mjs";
import "./nowpayments.server-D_G7i1Kn.mjs";
import "../_libs/zod.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
const TIERS = [
  {
    key: "basic",
    label: "Standard",
    bullets: [
      "Real-looking accounts",
      "60-second start time",
      "7-day auto-refill (followers only)"
    ]
  },
  {
    key: "premium",
    label: "Premium",
    bullets: [
      "Active accounts with profile activity",
      "30-second start time",
      "30-day auto-refill",
      "Drip-feed delivery available"
    ]
  },
  {
    key: "vip",
    label: "Pro",
    bullets: [
      "Premium quality, longer retention",
      "Instant start",
      "Extended refill where supported",
      "Best for serious accounts"
    ]
  }
];
function TierComparison({
  startingFrom
}) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpen((v) => !v),
        className: "flex w-full items-center justify-between px-5 py-4 text-left",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-[var(--text-primary)]", children: "Choose your quality tier" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[var(--text-tertiary)]", children: open ? "Hide tier details" : "Learn about our tiers" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChevronDown,
            {
              className: `h-4 w-4 text-[var(--text-secondary)] transition-transform ${open ? "rotate-180" : ""}`
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 border-t border-[var(--border-subtle)] p-5 md:grid-cols-3", children: TIERS.map((t) => {
      const price = startingFrom[t.key];
      const isPro = t.key === "vip";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rounded-xl border p-6 ${isPro ? "border-[var(--accent)] bg-[var(--bg-surface-2)]" : "border-[var(--border-subtle)] bg-[var(--bg-surface-1)]"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-[var(--text-tertiary)]", children: t.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-xs text-[var(--text-secondary)]", children: [
              "Starting from",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--text-primary)] tabular", children: [
                "$",
                (price ?? defaultPrice(t.key)).toFixed(2)
              ] }),
              " ",
              "/ 1k"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-secondary)]", children: t.bullets.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: b })
            ] }, b)) })
          ]
        },
        t.key
      );
    }) })
  ] });
}
function defaultPrice(t) {
  return t === "basic" ? 1.5 : t === "premium" ? 3 : 7;
}
const PLATFORMS = ["Instagram", "TikTok", "YouTube"];
const TIER_RANK = {
  vip: 0,
  premium: 1,
  basic: 2
};
function ServicesPage() {
  const [platform, setPlatform] = reactExports.useState(null);
  const [stype, setStype] = reactExports.useState(null);
  reactExports.useEffect(() => {
    try {
      const saved = localStorage.getItem("boostan-services-platform");
      if (saved !== null) setPlatform(saved === "all" ? null : saved);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    try {
      const key = `boostan-services-type-${platform ?? "all"}`;
      const saved = localStorage.getItem(key);
      setStype(saved && saved !== "all" ? saved : null);
    } catch {
    }
  }, [platform]);
  const setPlatformPersist = (p) => {
    setPlatform(p);
    try {
      localStorage.setItem("boostan-services-platform", p ?? "all");
    } catch {
    }
  };
  const setStypePersist = (t) => {
    setStype(t);
    try {
      localStorage.setItem(`boostan-services-type-${platform ?? "all"}`, t ?? "all");
    } catch {
    }
  };
  const {
    data: services
  } = useQuery({
    queryKey: ["services-public"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("services").select("*").eq("active", true);
      return data ?? [];
    }
  });
  const all = services ?? [];
  const startingFrom = reactExports.useMemo(() => {
    const m = {};
    for (const s of all) {
      const t = s.tier ?? "basic";
      const r = Number(s.marked_up_rate ?? s.rate_per_1000);
      if (!Number.isFinite(r)) continue;
      if (m[t] == null || r < m[t]) m[t] = r;
    }
    return m;
  }, [all]);
  const platformCounts = reactExports.useMemo(() => {
    const m = {};
    for (const s of all) m[s.platform] = (m[s.platform] ?? 0) + 1;
    return m;
  }, [all]);
  const platformFiltered = platform ? all.filter((s) => s.platform === platform) : all;
  const typeCounts = reactExports.useMemo(() => {
    const m = {};
    for (const s of platformFiltered) {
      const t = s.service_type ?? "other";
      m[t] = (m[t] ?? 0) + 1;
    }
    return m;
  }, [platformFiltered]);
  const visibleTypes = reactExports.useMemo(() => Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]), [typeCounts]);
  const filtered = reactExports.useMemo(() => {
    let rows = platformFiltered;
    if (stype) rows = rows.filter((s) => (s.service_type ?? "other") === stype);
    return [...rows].sort((a, b) => {
      if (!!b.is_featured !== !!a.is_featured) return b.is_featured ? 1 : -1;
      if (a.is_featured && b.is_featured) {
        const ao = a.display_order ?? 9999;
        const bo = b.display_order ?? 9999;
        if (ao !== bo) return ao - bo;
      }
      if ((b.order_count ?? 0) !== (a.order_count ?? 0)) return (b.order_count ?? 0) - (a.order_count ?? 0);
      const at = TIER_RANK[a.tier ?? "basic"] ?? 3;
      const bt = TIER_RANK[b.tier ?? "basic"] ?? 3;
      if (at !== bt) return at - bt;
      return Number(a.marked_up_rate ?? a.rate_per_1000) - Number(b.marked_up_rate ?? b.rate_per_1000);
    });
  }, [platformFiltered, stype]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 pt-24 pb-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[40px] font-medium leading-tight tracking-[-0.02em] text-[var(--text-primary)]", children: "Services" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 max-w-2xl text-lg text-[var(--text-secondary)]", children: [
        all.length || 143,
        " premium services across Instagram, TikTok, and YouTube. Click to order."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TierComparison, { startingFrom }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-10 -mx-6 mb-6 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/85 px-6 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PlatformTab, { active: platform === null, onClick: () => setPlatformPersist(null), children: "All Platforms" }),
      PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(PlatformTab, { active: platform === p, onClick: () => setPlatformPersist(p), children: [
        p,
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[var(--text-tertiary)]", children: [
          "(",
          platformCounts[p] ?? 0,
          ")"
        ] })
      ] }, p))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 flex flex-nowrap gap-2 overflow-x-auto pb-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: stype === null, onClick: () => setStypePersist(null), children: "All Types" }),
      visibleTypes.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Chip, { active: stype === t, onClick: () => setStypePersist(t), children: [
        SERVICE_TYPE_LABEL[t],
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "opacity-70", children: [
          "(",
          typeCounts[t],
          ")"
        ] })
      ] }, t))
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[var(--text-secondary)]", children: "No services match this filter. Try a different type." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((s) => {
      const card = {
        id: s.id,
        platform: s.platform,
        name: s.name,
        display_name: s.display_name,
        description: s.description,
        service_type: s.service_type,
        marked_up_rate: s.marked_up_rate == null ? null : Number(s.marked_up_rate),
        rate_per_1000: Number(s.rate_per_1000),
        min_quantity: s.min_quantity,
        max_quantity: s.max_quantity,
        tier: s.tier ?? null,
        is_featured: s.is_featured,
        order_count: s.order_count
      };
      return /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceCard, { s: card }, s.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-20 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-10 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-medium text-[var(--text-primary)]", children: "Don't see what you need?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]", children: [
        "Email ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "mailto:hello@boostan.co", className: "text-[var(--accent)] hover:underline", children: "hello@boostan.co" }),
        " — we can often source specific services from our upstream catalog of 1,000+ options."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "mailto:hello@boostan.co", className: "mt-6 inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white", children: [
        "Contact us ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
      ] })
    ] })
  ] });
}
function PlatformTab({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick, className: `relative whitespace-nowrap px-4 py-3 text-sm transition-colors ${active ? "font-medium text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`, children: [
    children,
    active && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-x-3 -bottom-px h-0.5 bg-[var(--accent)]" })
  ] });
}
function Chip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `shrink-0 rounded-md border px-3.5 py-1.5 text-xs transition-colors ${active ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"}`, children });
}
export {
  ServicesPage as component
};
