import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { F as FaInstagram, a as FaTiktok, b as FaYoutube, c as FaXTwitter } from "../_libs/react-icons.mjs";
import { a as supabase } from "./client.server-j8IJ-cKj.mjs";
import { a as inferCategory, C as CATEGORIES, Q as QTY_PRESETS, f as formatQty, s as snapQuantity, T as TIER_DESCRIPTIONS, t as tierLabel } from "./service-tier-Br2B6ZKx.mjs";
import { S as ServiceCard } from "./service-card-DlnpPzED.mjs";
import "../_libs/sonner.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { S as Sprout, A as ArrowRight, C as ChevronDown, I as Info, a as Check } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./router-Db83cYJW.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./nowpayments.server-D_G7i1Kn.mjs";
import "../_libs/zod.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
const PLATFORMS$1 = [
  { key: "Instagram", count: 75, Icon: FaInstagram },
  { key: "TikTok", count: 21, Icon: FaTiktok },
  { key: "YouTube", count: 47, Icon: FaYoutube }
];
function TryItNow() {
  const [all, setAll] = reactExports.useState([]);
  const [platform, setPlatform] = reactExports.useState("Instagram");
  const [category, setCategory] = reactExports.useState("Followers");
  const [qty, setQty] = reactExports.useState(1e3);
  const [tier, setTier] = reactExports.useState("premium");
  reactExports.useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.from("services").select("id, platform, name, display_name, marked_up_rate, min_quantity, max_quantity, tier, smmflw_id").eq("active", true);
      if (!alive || !data) return;
      const mapped = data.map((s) => ({
        id: s.id,
        platform: s.platform,
        name: s.name,
        display_name: s.display_name,
        marked_up_rate: Number(s.marked_up_rate ?? 0),
        min_quantity: s.min_quantity,
        max_quantity: s.max_quantity,
        tier: s.tier,
        smmflw_id: s.smmflw_id,
        category: inferCategory(s.display_name || s.name)
      }));
      setAll(mapped);
    })();
    return () => {
      alive = false;
    };
  }, []);
  const availableCategories = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const s of all) {
      if (s.platform === platform && s.category) set.add(s.category);
    }
    return CATEGORIES.filter((c) => set.has(c));
  }, [all, platform]);
  reactExports.useEffect(() => {
    if (availableCategories.length && !availableCategories.includes(category)) {
      setCategory(availableCategories[0]);
    }
  }, [availableCategories, category]);
  const match = reactExports.useMemo(() => {
    const candidates = all.filter(
      (s) => s.platform === platform && s.category === category && s.tier === tier
    );
    const inRange = candidates.filter((s) => qty >= s.min_quantity && qty <= s.max_quantity);
    if (inRange.length === 0) return null;
    return inRange.reduce((a, b) => a.marked_up_rate <= b.marked_up_rate ? a : b);
  }, [all, platform, category, tier, qty]);
  const price = match ? match.marked_up_rate * qty / 1e3 : null;
  const sliderBounds = reactExports.useMemo(() => {
    const c = all.filter((s) => s.platform === platform && s.category === category);
    if (!c.length) return { min: 100, max: 25e3 };
    return {
      min: Math.min(...c.map((s) => s.min_quantity)),
      max: Math.max(...c.map((s) => s.max_quantity))
    };
  }, [all, platform, category]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-[1200px] px-6 py-24 md:py-32", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]", children: "Try it now" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 max-w-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl tracking-tight md:text-4xl", children: "See instant pricing." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[var(--text-secondary)]", children: "Configure an order across our 143 services. No sign-up required to browse." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-[1fr_380px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: 1, label: "Pick a platform", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: PLATFORMS$1.map((p) => {
          const active = p.key === platform;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setPlatform(p.key),
              className: `flex items-center gap-3 rounded-lg border p-4 transition-colors duration-200 ${active ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--text-primary)]" : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)]"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(p.Icon, { className: `h-5 w-5 ${active ? "text-[var(--accent)]" : ""}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-[var(--text-primary)]", children: p.key }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-[var(--text-tertiary)]", children: [
                    p.count,
                    " services"
                  ] })
                ] })
              ]
            },
            p.key
          );
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Step, { n: 2, label: "Choose a category", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: availableCategories.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: c === category, onClick: () => setCategory(c), children: c }, c)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Step, { n: 3, label: "How many?", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: QTY_PRESETS.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(Chip, { active: q === qty, onClick: () => setQty(q), children: formatQty(q) }, q)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                min: sliderBounds.min,
                max: sliderBounds.max,
                step: 100,
                value: Math.min(Math.max(qty, sliderBounds.min), sliderBounds.max),
                onChange: (e) => setQty(snapQuantity(Number(e.target.value))),
                className: "w-full accent-[var(--accent)]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between text-xs text-[var(--text-tertiary)] tabular", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatQty(sliderBounds.min) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-primary)]", children: qty.toLocaleString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: formatQty(sliderBounds.max) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Step, { n: 4, label: "Quality tier", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex rounded-lg border border-[var(--border-default)] p-1", children: ["basic", "premium", "vip"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setTier(t),
              title: TIER_DESCRIPTIONS[t],
              className: `flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm transition-colors duration-200 ${t === tier ? "bg-[var(--accent)] text-white" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`,
              children: [
                tierLabel(t),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3 w-3 opacity-60" })
              ]
            },
            t
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-[var(--text-tertiary)]", children: TIER_DESCRIPTIONS[tier] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 lg:sticky lg:top-24 lg:self-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-[var(--text-tertiary)]", children: "Estimate" }),
        match && price !== null ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 line-clamp-2 text-sm font-medium text-[var(--text-primary)]", children: match.display_name || match.name }),
          match.smmflw_id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-mono text-[10px] text-[var(--text-tertiary)]", children: [
            "ref · ",
            match.smmflw_id
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 tabular text-5xl font-medium tracking-tight text-[var(--text-primary)]", children: [
            "$",
            price.toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-xs text-[var(--text-tertiary)]", children: [
            qty.toLocaleString(),
            " × $",
            match.marked_up_rate.toFixed(2),
            " / 1,000"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-6 space-y-2 border-t border-[var(--border-subtle)] pt-5 text-sm text-[var(--text-secondary)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[var(--success)]" }),
              " Starts in <30 seconds"
            ] }),
            category === "Followers" && /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[var(--success)]" }),
              " 30-day auto-refill"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[var(--success)]" }),
              " No subscription"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/signup",
              search: { platform, category, qty, tier },
              onClick: () => {
                try {
                  sessionStorage.setItem(
                    "boostan:order-prefill",
                    JSON.stringify({ platform, category, qty, tier, serviceId: match.id })
                  );
                } catch {
                }
              },
              className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]",
              children: [
                "Sign up & order — $25 minimum ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
              ]
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-2xl text-[var(--text-secondary)]", children: "No match" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-[var(--text-tertiary)]", children: [
            "Adjust quantity to fit available service ranges (try ",
            sliderBounds.min.toLocaleString(),
            " – ",
            sliderBounds.max.toLocaleString(),
            "), or pick another tier."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              disabled: true,
              className: "mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-[var(--bg-surface-2)] px-5 py-3 text-sm font-medium text-[var(--text-disabled)]",
              children: "Adjust to continue"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function Step({ n, label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-5 w-5 place-items-center rounded-full bg-[var(--bg-surface-2)] text-[10px] tabular text-[var(--text-tertiary)]", children: n }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-[var(--text-primary)]", children: label })
    ] }),
    children
  ] });
}
function Chip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      className: `rounded-md border px-3.5 py-1.5 text-sm transition-colors duration-200 ${active ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-[var(--border-default)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-surface-2)] hover:text-[var(--text-primary)]"}`,
      children
    }
  );
}
const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&q=80&auto=format&fit=crop",
  "/assets/trust/creator-1.jpg": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80&auto=format&fit=crop",
  "/assets/trust/creator-2.jpg": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80&auto=format&fit=crop",
  "/assets/trust/agency-1.jpg": "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop"
};
const PLATFORMS = [
  { key: "Instagram", label: "Instagram", count: 75, Icon: FaInstagram },
  { key: "TikTok", label: "TikTok", count: 21, Icon: FaTiktok },
  { key: "YouTube", label: "YouTube", count: 47, Icon: FaYoutube }
];
function Landing() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrustBar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stats, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TryItNow, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ServicesPreview, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HowItWorks, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HowWereDifferent, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(WhoItsFor, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PricingTransparency, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FAQSection, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(FinalCTA, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
function Nav() {
  const [solid, setSolid] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "header",
    {
      className: `sticky top-0 z-50 transition-colors duration-300 ${solid ? "bg-[var(--bg-base)]/95 backdrop-blur border-b border-[var(--border-subtle)]" : "bg-transparent border-b border-transparent"}`,
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 text-base font-medium tracking-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "B",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent)]", children: "o" }),
            "ostan"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#services", className: "hover:text-[var(--text-primary)] transition-colors", children: "Services" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#pricing", className: "hover:text-[var(--text-primary)] transition-colors", children: "Pricing" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#faq", className: "hover:text-[var(--text-primary)] transition-colors", children: "FAQ" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#about", className: "hover:text-[var(--text-primary)] transition-colors", children: "About" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/login",
              className: "hidden rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:inline-block",
              children: "Sign in"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/signup",
              className: "rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]",
              children: "Get started"
            }
          )
        ] })
      ] })
    }
  );
}
function Hero() {
  const [videoOk, setVideoOk] = reactExports.useState(true);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative -mt-[68px] flex min-h-screen items-center overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0", children: [
      videoOk ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "video",
        {
          className: "h-full w-full object-cover",
          autoPlay: true,
          muted: true,
          loop: true,
          playsInline: true,
          poster: UNSPLASH.hero,
          "aria-hidden": "true",
          onError: () => setVideoOk(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("source", { src: "/assets/hero/hero-video.mp4", type: "video/mp4" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: UNSPLASH.hero,
          alt: "",
          "aria-hidden": "true",
          className: "h-full w-full object-cover"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-[var(--bg-base)]/40 via-[var(--bg-base)]/40 to-[var(--bg-base)]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 mx-auto w-full max-w-[1200px] px-6 pt-32 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[720px] space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "anim-stagger anim-1 text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]", children: "بوستان · Boostan" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "anim-stagger anim-2 text-[40px] leading-[1.05] tracking-[-0.03em] sm:text-[56px] md:text-[68px] lg:text-[72px]", children: [
        "Your social presence,",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--text-primary)]", children: "growing." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "anim-stagger anim-3 max-w-[560px] text-base text-[var(--text-secondary)] sm:text-lg", children: "The premium SMM panel for serious creators, agencies, and businesses. Real engagement, instant delivery, automated API." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "anim-stagger anim-4 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/signup",
            className: "inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]",
            children: [
              "Get started — $25 minimum ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "a",
          {
            href: "#services",
            className: "inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-default)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-1)]",
            children: "Browse services"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "anim-stagger anim-5 text-xs text-[var(--text-tertiary)]", children: "No commitments · Cancel anytime · Crypto + e-transfer accepted" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "#trust",
        "aria-label": "Scroll",
        className: "absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[var(--text-tertiary)] anim-bounce",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-5 w-5" })
      }
    )
  ] });
}
function TrustBar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "trust", className: "border-y border-[var(--border-subtle)] bg-[var(--bg-base)] py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-[1200px] px-6 text-center text-sm text-[var(--text-secondary)]", children: "Trusted by 200+ agencies and creators across Toronto, Dubai, NYC, LA" }) });
}
const STATS = [
  { value: 143, suffix: "", label: "Premium services" },
  { value: 99.8, suffix: "%", label: "Uptime guarantee", decimals: 1 },
  { value: 30, suffix: "s", label: "Average start time", prefix: "<" },
  { value: 24, suffix: "/7", label: "Automated delivery" }
];
function useInView(opts) {
  const ref = reactExports.useRef(null);
  const [inView, setInView] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.2, ...opts }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}
function CountUp({ to, decimals = 0, prefix = "", suffix = "" }) {
  const { ref, inView } = useInView();
  const [n, setN] = reactExports.useState(0);
  reactExports.useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { ref, className: "tabular", children: [
    prefix,
    n.toFixed(decimals),
    suffix
  ] });
}
function Stats() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: STATS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CountUp, { to: s.value, decimals: s.decimals ?? 0, prefix: s.prefix ?? "", suffix: s.suffix }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-[var(--text-secondary)]", children: s.label })
  ] }, s.label)) }) });
}
function ServicesPreview() {
  const [activeP, setActiveP] = reactExports.useState("Instagram");
  const [data, setData] = reactExports.useState({});
  reactExports.useEffect(() => {
    let alive = true;
    (async () => {
      const out = {};
      for (const p of PLATFORMS) {
        const { data: data2 } = await supabase.from("services").select("id, platform, display_name, name, description, service_type, marked_up_rate, rate_per_1000, min_quantity, max_quantity, tier").eq("active", true).eq("platform", p.key).order("marked_up_rate", { ascending: true }).limit(3);
        out[p.key] = (data2 || []).map((s) => ({
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
          tier: s.tier ?? null
        }));
      }
      if (alive) setData(out);
    })();
    return () => {
      alive = false;
    };
  }, []);
  const active = PLATFORMS.find((p) => p.key === activeP);
  const rows = data[activeP] || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "services", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Catalog" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHead,
      {
        title: "Services that actually work",
        sub: "143 hand-curated services across Instagram, TikTok, and YouTube. Real engagement, never bots."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-4", children: PLATFORMS.map((p) => {
      const isActive = p.key === activeP;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setActiveP(p.key),
          className: `inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${isActive ? "bg-[var(--bg-surface-2)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-1)] hover:text-[var(--text-primary)]"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(p.Icon, { className: "h-4 w-4" }),
            p.label,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-[var(--text-tertiary)]", children: p.count })
          ]
        },
        p.key
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid gap-4 md:grid-cols-3", children: rows.length ? rows.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(ServiceCard, { s }, s.id)) : Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-[280px] animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]"
      },
      i
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 text-right text-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/signup", className: "text-[var(--accent)] hover:underline", children: [
      "View all ",
      active.count,
      " ",
      active.label,
      " services →"
    ] }) })
  ] });
}
const DIFFERENTIATORS = [
  "Premium upstream provider — not the cheapest, but reliable",
  "Real engagement, drip-feed delivery available",
  "30-day auto-refill on follower drops",
  "Crypto + e-transfer accepted, no card processing risks"
];
function HowWereDifferent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "How we're different" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { title: "Not the cheapest. Reliable." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]", children: DIFFERENTIATORS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-3 py-5 text-base text-[var(--text-primary)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: d })
    ] }, d)) })
  ] });
}
const STEPS = [
  { n: "01", t: "Sign up & deposit", d: "Create your free account and add funds via crypto or e-transfer. $25 minimum." },
  { n: "02", t: "Pick your service", d: "Browse 143 services across Instagram, TikTok, and YouTube. Filter by quality tier and price." },
  { n: "03", t: "Watch it grow", d: "Orders start within 30 seconds. Track progress in real-time. Get refilled if anything drops." }
];
function HowItWorks() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "How it works" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { title: "From signup to first order in under 60 seconds." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Divider, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-8 md:grid-cols-3", children: STEPS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm tabular text-[var(--accent)]", children: s.n }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 text-xl font-medium tracking-tight", children: s.t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm leading-relaxed text-[var(--text-secondary)]", children: s.d })
    ] }, s.n)) })
  ] });
}
const AUDIENCE = [
  { img: "/assets/trust/agency-1.jpg", title: "Agencies", desc: "Manage growth for multiple clients. API access, bulk orders, white-label invoices." },
  { img: "/assets/trust/creator-1.jpg", title: "Creators", desc: "Boost reach without burning hours. Real engagement on real content." },
  { img: "/assets/trust/creator-2.jpg", title: "Businesses", desc: "Build social proof for restaurants, salons, e-commerce. Trusted by 200+ Toronto businesses." }
];
function WhoItsFor() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "about", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Who it's for" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { title: "Built for the people who take growth seriously." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4 md:grid-cols-3", children: AUDIENCE.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AudienceCard, { ...a }, a.title)) })
  ] });
}
function AudienceCard({ img, title, desc }) {
  const fallback = UNSPLASH[img];
  const [src, setSrc] = reactExports.useState(img);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface-2)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src,
        alt: title,
        className: "h-full w-full object-cover",
        onError: () => {
          if (fallback && src !== fallback) setSrc(fallback);
        }
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-medium", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-[var(--text-secondary)]", children: desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#services", className: "mt-4 inline-block text-sm text-[var(--accent)] hover:underline", children: "Learn more →" })
    ] })
  ] });
}
function PricingTransparency() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "pricing", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "Pricing" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionHead,
      {
        title: "Honest, simple pricing",
        sub: "We mark up wholesale rates by 50% + $1 per 1,000 orders. That's it. No hidden fees, no surprise charges."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto mt-10 max-w-2xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-[var(--text-tertiary)]", children: "Example · Instagram Followers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid grid-cols-2 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-[var(--text-tertiary)]", children: "Wholesale" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabular mt-1 text-2xl text-[var(--text-secondary)]", children: [
            "$1.20",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "/1k" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-[var(--text-tertiary)]", children: "You pay" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tabular mt-1 text-2xl text-[var(--text-primary)]", children: [
            "$2.80",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "/1k" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-2 border-t border-[var(--border-subtle)] pt-6 text-sm text-[var(--text-secondary)]", children: ["No subscription", "No hidden fees", "Refill on drops included"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[var(--success)]" }),
        " ",
        t
      ] }, t)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "mt-6 inline-block text-sm text-[var(--accent)] hover:underline", children: "View full service pricing →" })
    ] })
  ] });
}
const FAQS = [
  { q: "Are these real followers/likes/views?", a: "Yes — we use trusted upstream providers serving real engagement. We never use bot networks." },
  { q: "How fast do orders start?", a: "Most orders start within 30 seconds. Some niche services may take 1–3 minutes." },
  { q: "What payment methods do you accept?", a: "Crypto (USDT-TRC20, BTC, ETH) and Canadian Interac e-transfer. No credit cards yet — coming soon." },
  { q: "Can I get a refund?", a: "Yes — we refill drops automatically and refund unfulfilled orders." },
  { q: "Do you offer API access?", a: "Yes — every account gets free API access for automation. Documentation in your dashboard." },
  { q: "Is this safe for my Instagram/TikTok account?", a: "Yes — we comply with platform best practices. Slow drip-feed available for organic-looking growth." }
];
function FAQSection() {
  const [open, setOpen] = reactExports.useState(0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { id: "faq", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Eyebrow, { children: "FAQ" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHead, { title: "Questions, answered." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]", children: FAQS.map((f, i) => {
      const isOpen = open === i;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setOpen(isOpen ? null : i),
            "aria-expanded": isOpen,
            className: "flex w-full items-center justify-between gap-4 py-5 text-left",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium text-[var(--text-primary)]", children: f.q }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: `h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform ${isOpen ? "rotate-180" : ""}` })
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pb-5 text-sm text-[var(--text-secondary)]", children: f.a })
      ] }, f.q);
    }) })
  ] });
}
function FinalCTA() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center md:p-20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "pointer-events-none absolute inset-0 opacity-[0.04]",
        style: { backgroundImage: "url(/assets/decorative/pattern-persian.svg)" },
        "aria-hidden": true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-4xl tracking-tight md:text-5xl", children: "Ready to start growing?" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mx-auto mt-4 max-w-md text-[var(--text-secondary)]", children: "Join 200+ agencies and creators using Boostan." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/signup",
          className: "mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]",
          children: [
            "Get started — $25 minimum ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ]
        }
      )
    ] })
  ] }) });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "border-t border-[var(--border-subtle)] bg-[var(--bg-base)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2 text-base font-medium tracking-tight", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-4 w-4" }) }),
          "B",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[var(--accent)]", children: "o" }),
          "ostan"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-xs text-sm text-[var(--text-secondary)]", children: "بوستان · The garden where social grows." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-[var(--text-tertiary)]", children: "Made in Toronto" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-6 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Product", links: [["Services", "#services"], ["Pricing", "#pricing"], ["API Docs", "/signup"]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Company", links: [["About", "/about"], ["Contact", "mailto:hello@boostan.co"], ["Support", "mailto:hello@boostan.co"]] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FooterCol, { title: "Legal", links: [["Terms", "/terms"], ["Privacy", "/privacy"], ["Refund Policy", "/refund"]] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-[var(--border-subtle)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 text-xs text-[var(--text-tertiary)]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        "© ",
        (/* @__PURE__ */ new Date()).getFullYear(),
        " Boostan"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", "aria-label": "X", className: "hover:text-[var(--text-primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaXTwitter, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "#", "aria-label": "Instagram", className: "hover:text-[var(--text-primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FaInstagram, { className: "h-4 w-4" }) })
      ] })
    ] }) })
  ] });
}
function FooterCol({ title, links }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-xs uppercase tracking-wider text-[var(--text-tertiary)]", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: links.map(([label, href]) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href, className: "text-[var(--text-secondary)] hover:text-[var(--text-primary)]", children: label }) }, label)) })
  ] });
}
function Section({ id, children }) {
  const { ref, inView } = useInView({ threshold: 0.08 });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id,
      ref,
      className: `mx-auto max-w-[1200px] px-6 py-24 transition-all duration-700 md:py-32 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`,
      children
    }
  );
}
function Eyebrow({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]", children });
}
function SectionHead({ title, sub }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-10 max-w-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl tracking-tight md:text-4xl", children: title }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[var(--text-secondary)]", children: sub })
  ] });
}
function Divider() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-8 flex justify-center", "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "60", height: "20", viewBox: "0 0 60 20", fill: "none", className: "text-[var(--accent)]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 10 C 15 2, 30 18, 45 10 S 58 10, 58 10", stroke: "currentColor", strokeWidth: "1.2", fill: "none", strokeLinecap: "round" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "30", cy: "10", r: "1.5", fill: "currentColor" })
  ] }) });
}
const SplitComponent = Landing;
export {
  SplitComponent as component
};
