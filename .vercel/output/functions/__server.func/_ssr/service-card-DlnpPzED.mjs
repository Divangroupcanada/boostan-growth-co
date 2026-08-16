import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { c as FaXTwitter, b as FaYoutube, a as FaTiktok, F as FaInstagram } from "../_libs/react-icons.mjs";
import { h as hasRefill, b as hasDripFeed, t as tierLabel, c as tierPillClasses, S as SERVICE_TYPE_LABEL } from "./service-tier-Br2B6ZKx.mjs";
import { a as useAuth } from "./router-Db83cYJW.mjs";
import { b as Star, a as Check, A as ArrowRight } from "../_libs/lucide-react.mjs";
const PLATFORM_ICON = {
  Instagram: FaInstagram,
  TikTok: FaTiktok,
  YouTube: FaYoutube,
  "Twitter / X": FaXTwitter
};
function ServiceCard({ s }) {
  const Icon = PLATFORM_ICON[s.platform] ?? FaInstagram;
  const rate = Number(s.marked_up_rate ?? s.rate_per_1000);
  const stype = s.service_type || "other";
  const typeLabel = SERVICE_TYPE_LABEL[stype] ?? "Service";
  const refills = hasRefill(s.name, s.description);
  const drips = hasDripFeed(s.name, s.service_type, s.description);
  const isFollowers = stype === "followers";
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleOrder = (e) => {
    if (!user) {
      e.preventDefault();
      const redirect = `/new-order?service=${s.id}`;
      navigate({ to: "/signup", search: { redirect } });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group relative flex h-full flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 transition-colors hover:border-[var(--border-default)] hover:bg-[var(--bg-surface-2)]", children: [
    s.is_featured && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-amber-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 fill-amber-300" }),
      " Featured"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-md bg-[var(--bg-surface-2)] text-[var(--text-primary)] group-hover:bg-[var(--bg-surface-3)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }) }),
      s.tier && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: `rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${tierPillClasses(s.tier)}`,
          children: tierLabel(s.tier)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 line-clamp-2 min-h-[44px] text-sm font-medium text-[var(--text-primary)]", children: s.display_name || s.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-[var(--text-tertiary)]", children: [
      s.platform,
      " · ",
      typeLabel
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-[var(--text-tertiary)]", children: "per 1,000" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabular text-2xl text-[var(--text-primary)]", children: [
        "$",
        rate.toFixed(2)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-[var(--text-tertiary)]", children: [
        s.min_quantity.toLocaleString(),
        " – ",
        s.max_quantity.toLocaleString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-5 space-y-2 border-t border-[var(--border-subtle)] pt-4 text-xs text-[var(--text-secondary)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-[var(--success)]" }),
        "Starts in <30 seconds"
      ] }),
      isFollowers && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "flex items-center gap-2", children: refills ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-[var(--success)]" }),
        "30-day refill on drops"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-tertiary)]", children: "Refill: case-by-case" }) }),
      drips && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-3.5 w-3.5 text-[var(--success)]" }),
        "Drip-feed delivery available"
      ] })
    ] }),
    s.order_count != null && s.order_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-[11px] text-[var(--text-tertiary)]", children: [
      "Ordered ",
      s.order_count.toLocaleString(),
      " ",
      s.order_count === 1 ? "time" : "times"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/new-order",
        search: { service: s.id },
        onClick: handleOrder,
        className: "inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-default)] bg-transparent px-4 py-2 text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent)] hover:border-[var(--accent)] hover:text-white",
        children: [
          "Order ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3.5 w-3.5" })
        ]
      }
    )
  ] });
}
export {
  ServiceCard as S
};
