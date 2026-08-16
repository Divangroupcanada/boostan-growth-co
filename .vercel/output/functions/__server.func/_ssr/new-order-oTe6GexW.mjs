import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { u as useServerFn } from "./createSsrRpc-CdhWFolZ.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import { p as placeOrder } from "./smmflw.functions-CQqGXrXR.mjs";
import { R as Route$5, a as useAuth } from "./router-Db83cYJW.mjs";
import { F as FaInstagram, a as FaTiktok, b as FaYoutube } from "../_libs/react-icons.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as inferCategory, C as CATEGORIES, t as tierLabel, Q as QTY_PRESETS, f as formatQty, s as snapQuantity, T as TIER_DESCRIPTIONS } from "./service-tier-Br2B6ZKx.mjs";
import "../_libs/seroval.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { k as ArrowLeft, A as ArrowRight, I as Info, F as FlaskConical, c as Sparkles } from "../_libs/lucide-react.mjs";
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
import "./auth-client-middleware-B9dl4-ow.mjs";
import "../_libs/zod.mjs";
import "./nowpayments.server-D_G7i1Kn.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
const PLATFORMS = [{
  key: "Instagram",
  count: 75,
  Icon: FaInstagram
}, {
  key: "TikTok",
  count: 21,
  Icon: FaTiktok
}, {
  key: "YouTube",
  count: 47,
  Icon: FaYoutube
}];
function NewOrderWizard() {
  const search = Route$5.useSearch();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const place = useServerFn(placeOrder);
  const {
    data: services
  } = useQuery({
    queryKey: ["services-all"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("services").select("*").eq("active", true).order("marked_up_rate");
      return data ?? [];
    }
  });
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
    enabled: !!user
  });
  const [step, setStep] = reactExports.useState(1);
  const [platform, setPlatform] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("");
  const [qty, setQty] = reactExports.useState(1e3);
  const [tier, setTier] = reactExports.useState("");
  const [link, setLink] = reactExports.useState("");
  const [testMode, setTestMode] = reactExports.useState(true);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const preselectedService = reactExports.useMemo(() => {
    if (!search.service || !services) return null;
    return services.find((s) => s.id === search.service) ?? null;
  }, [search.service, services]);
  reactExports.useEffect(() => {
    if (preselectedService) {
      const ps = preselectedService;
      setPlatform(ps.platform);
      const c2 = inferCategory(ps.display_name || ps.name);
      if (c2) setCategory(c2);
      if (ps.tier) setTier(ps.tier);
      const minQ = ps.min_quantity ?? 1e3;
      setQty((q2) => q2 >= ps.min_quantity && q2 <= ps.max_quantity ? q2 : Math.max(1e3, minQ));
      setStep(3);
      return;
    }
    let prefill = {};
    try {
      const stored = sessionStorage.getItem("boostan:order-prefill");
      if (stored) prefill = JSON.parse(stored);
    } catch {
    }
    const p = search.platform || prefill.platform;
    const c = search.category || prefill.category;
    const q = search.qty || prefill.qty;
    const t = search.tier || prefill.tier;
    if (p && PLATFORMS.find((x) => x.key === p)) setPlatform(p);
    if (c && CATEGORIES.includes(c)) setCategory(c);
    if (q && Number(q) > 0) setQty(Number(q));
    if (t && ["basic", "premium", "vip"].includes(t)) setTier(t);
    if (p && c && q && t) setStep(5);
    try {
      sessionStorage.removeItem("boostan:order-prefill");
    } catch {
    }
  }, [preselectedService]);
  const availableCategories = reactExports.useMemo(() => {
    if (!platform) return [];
    const set = /* @__PURE__ */ new Set();
    for (const s of services ?? []) {
      if (s.platform === platform) {
        const c = inferCategory(s.display_name || s.name);
        if (c) set.add(c);
      }
    }
    return CATEGORIES.filter((c) => set.has(c));
  }, [services, platform]);
  const match = reactExports.useMemo(() => {
    if (preselectedService) {
      if (qty >= preselectedService.min_quantity && qty <= preselectedService.max_quantity) return preselectedService;
      return null;
    }
    if (!platform || !category || !tier) return null;
    const candidates = (services ?? []).filter((s) => {
      if (s.platform !== platform) return false;
      if (s.tier !== tier) return false;
      const c = inferCategory(s.display_name || s.name);
      return c === category;
    });
    const inRange = candidates.filter((s) => qty >= s.min_quantity && qty <= s.max_quantity);
    if (!inRange.length) return null;
    return inRange.reduce((a, b) => Number(a.marked_up_rate) <= Number(b.marked_up_rate) ? a : b);
  }, [services, platform, category, tier, qty, preselectedService]);
  const sliderBounds = reactExports.useMemo(() => {
    if (!platform || !category) return {
      min: 100,
      max: 25e3
    };
    const c = (services ?? []).filter((s) => s.platform === platform && inferCategory(s.display_name || s.name) === category);
    if (!c.length) return {
      min: 100,
      max: 25e3
    };
    return {
      min: Math.min(...c.map((s) => s.min_quantity)),
      max: Math.max(...c.map((s) => s.max_quantity))
    };
  }, [services, platform, category]);
  const rate = match ? Number(match.marked_up_rate) : 0;
  const price = match ? rate * qty / 1e3 : 0;
  const balance = Number(profile?.balance ?? 0);
  const canPay = !!match && balance >= price;
  const submit = async () => {
    if (!match || !user) return;
    if (!link) return toast.error("Add a link or username");
    if (!canPay) return toast.error("Insufficient balance");
    setSubmitting(true);
    try {
      const res = await place({
        data: {
          serviceId: match.id,
          link,
          quantity: qty,
          testMode
        }
      });
      qc.invalidateQueries({
        queryKey: ["profile", user.id]
      });
      qc.invalidateQueries({
        queryKey: ["orders", user.id]
      });
      qc.invalidateQueries({
        queryKey: ["orders-all", user.id]
      });
      toast.success(testMode ? `Test order placed (${res.providerOrderId})` : "Order placed");
      navigate({
        to: "/orders"
      });
    } catch (e) {
      toast.error(e?.message ?? "Order failed");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-foreground-subtle", children: "New order" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl md:text-4xl", children: "Place an order" }),
      !preselectedService && /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { step, total: 6 })
    ] }),
    preselectedService && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs uppercase tracking-wider text-[var(--text-tertiary)]", children: [
          preselectedService.platform,
          " · ",
          tierLabel(preselectedService.tier ?? null)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-sm font-medium text-[var(--text-primary)]", children: preselectedService.display_name || preselectedService.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-[var(--text-tertiary)] tabular", children: [
          "$",
          Number(preselectedService.marked_up_rate ?? preselectedService.rate_per_1000).toFixed(2),
          " / 1,000 ·",
          " ",
          preselectedService.min_quantity.toLocaleString(),
          "–",
          preselectedService.max_quantity.toLocaleString()
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/services", className: "text-xs text-[var(--accent)] hover:underline whitespace-nowrap", children: "Change service" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 md:p-8", children: [
      step > 1 && (!preselectedService || step > 3) && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        const back = step - 1;
        setStep(preselectedService && back === 4 ? 3 : back);
      }, className: "mb-5 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" }),
        " Back"
      ] }),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepBlock, { title: "Pick a platform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
        setPlatform(p.key);
        setCategory("");
        setStep(2);
      }, className: `flex flex-col items-start gap-3 rounded-lg border p-5 text-left transition-colors duration-200 ${platform === p.key ? "border-[var(--accent)] bg-[var(--accent-subtle)]" : "border-[var(--border-default)] hover:bg-[var(--bg-surface-2)]"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(p.Icon, { className: `h-6 w-6 ${platform === p.key ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-[var(--text-primary)]", children: p.key }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[var(--text-tertiary)]", children: [
            p.count,
            " services"
          ] })
        ] })
      ] }, p.key)) }) }),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepBlock, { title: "Choose a category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: availableCategories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: c === category, onClick: () => {
        setCategory(c);
        setStep(3);
      }, children: c }, c)) }) }),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(StepBlock, { title: "How many?", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: QTY_PRESETS.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: q === qty, onClick: () => setQty(q), children: formatQty(q) }, q)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "range", min: sliderBounds.min, max: sliderBounds.max, step: 100, value: Math.min(Math.max(qty, sliderBounds.min), sliderBounds.max), onChange: (e) => setQty(snapQuantity(Number(e.target.value))), className: "w-full accent-[var(--accent)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between text-xs text-[var(--text-tertiary)] tabular", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatQty(sliderBounds.min) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-primary)]", children: qty.toLocaleString() }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatQty(sliderBounds.max) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setStep(preselectedService ? 5 : 4), className: "mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)]", children: [
          "Continue ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      step === 4 && /* @__PURE__ */ jsxRuntimeExports.jsxs(StepBlock, { title: "Quality tier", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex rounded-lg border border-[var(--border-default)] p-1", children: ["basic", "premium", "vip"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
          setTier(t);
          setStep(5);
        }, title: TIER_DESCRIPTIONS[t], className: `flex items-center gap-1.5 rounded-md px-5 py-2 text-sm transition-colors duration-200 ${t === tier ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`, children: [
          tierLabel(t),
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3 opacity-60" })
        ] }, t)) }),
        tier && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-[var(--text-tertiary)]", children: TIER_DESCRIPTIONS[tier] })
      ] }),
      step === 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs(StepBlock, { title: "Where should we deliver?", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { value: link, onChange: (e) => setLink(e.target.value), placeholder: "https://instagram.com/yourpost", className: "w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface-2)] px-3.5 py-2.5 text-sm outline-none focus:border-[var(--accent)]" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-[var(--text-tertiary)]", children: "Paste the URL of the post or profile you want to grow." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => link.trim() && setStep(6), disabled: !link.trim(), className: "mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-40", children: [
          "Review order ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] })
      ] }),
      step === 6 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepBlock, { title: "Review your order", children: !match ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-[var(--warning)]", children: [
        "No service matches this combination. ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStep(3), className: "underline", children: "Adjust quantity" }),
        "."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Service", value: match.display_name || match.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Platform", value: platform }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Category", value: category }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Quantity", value: qty.toLocaleString() }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Tier", value: tierLabel(tier) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Link", value: link, mono: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-[var(--border-subtle)] pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Rate", value: `$${rate.toFixed(2)} / 1,000` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Wallet balance", value: `$${balance.toFixed(2)}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-secondary)]", children: "Total" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular text-2xl text-[var(--text-primary)]", children: [
                "$",
                price.toFixed(2)
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-2)] p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: testMode, onChange: (e) => setTestMode(e.target.checked), className: "mt-0.5 h-4 w-4 accent-[var(--accent)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FlaskConical, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Test mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[var(--accent)]", children: "default" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-foreground-muted", children: "Wallet is debited and the order is recorded, but the SMMFLW provider is not called." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: !canPay || submitting, onClick: submit, className: "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-40", children: submitting ? "Placing order…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4" }),
          " Place ",
          testMode ? "test " : "",
          "order ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
        ] }) }),
        !canPay && match && balance < price && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-center text-xs text-[var(--warning)]", children: [
          "Top up your wallet to continue. ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/wallet", className: "underline", children: "Add funds" }),
          "."
        ] })
      ] }) })
    ] })
  ] });
}
function ProgressBar({
  step,
  total
}) {
  const pct = step / total * 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between text-xs text-[var(--text-tertiary)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Step ",
        step,
        " of ",
        total
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular", children: [
        Math.round(pct),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-full overflow-hidden rounded-full bg-[var(--bg-surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-[var(--accent)] transition-all duration-300", style: {
      width: `${pct}%`
    } }) })
  ] });
}
function StepBlock({
  title,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-medium text-[var(--text-primary)]", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children })
  ] });
}
function Row({
  label,
  value,
  mono
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4 py-1 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-tertiary)]", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[var(--text-primary)] ${mono ? "font-mono text-xs" : ""} truncate`, children: value })
  ] });
}
function Chip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: `rounded-md border px-3.5 py-1.5 text-sm transition-colors duration-200 ${active ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"}`, children });
}
export {
  NewOrderWizard as component
};
