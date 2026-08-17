import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronDown, Sprout, Check } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, localizeDigits } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Guarantees } from "@/components/guarantees";
import { TryItNow } from "@/components/try-it-now";
import { ServiceCard, type ServiceCardData } from "@/components/service-card";
import type { Tier } from "@/lib/service-tier";

const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&q=80&auto=format&fit=crop",
  "/assets/trust/creator-1.jpg":
    "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80&auto=format&fit=crop",
  "/assets/trust/creator-2.jpg":
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80&auto=format&fit=crop",
  "/assets/trust/agency-1.jpg":
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop",
} as const;

type SvcRow = ServiceCardData;

const PLATFORMS = [
  { key: "Instagram", label: "Instagram", count: 129, Icon: FaInstagram },
  { key: "TikTok", label: "TikTok", count: 57, Icon: FaTiktok },
  { key: "YouTube", label: "YouTube", count: 69, Icon: FaYoutube },
] as const;

export function Landing() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <TryItNow />
        <Guarantees />
        <ServicesPreview />
        <HowItWorks />
        <HowWereDifferent />
        <WhoItsFor />
        <PricingTransparency />
        <FAQSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        solid
          ? "bg-[var(--bg-base)]/95 backdrop-blur border-b border-[var(--border-subtle)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-base font-medium tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-white">
            <Sprout className="h-4 w-4" />
          </span>
          <span>
            B<span className="text-[var(--accent)]">o</span>ostan
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[var(--text-secondary)] md:flex">
          <Link
            to="/buy/$slug"
            params={{ slug: "instagram-followers" }}
            className="transition-colors hover:text-[var(--text-primary)]"
          >
            Services
          </Link>
          <a href="#pricing" className="hover:text-[var(--text-primary)] transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-[var(--text-primary)] transition-colors">
            FAQ
          </a>
          <a href="#about" className="hover:text-[var(--text-primary)] transition-colors">
            About
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:inline-block"
          >
            Sign in
          </Link>
          <LanguageSwitcher />
          <Link
            to="/signup"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
/** Headline in each script; the inactive one appears as a quiet echo. */
const EN_TITLE = "Growth, tended.";
const FA_TITLE = "رشد، با حوصله.";

/**
 * Live per-platform service counts. Shared by the hero and the catalog so the
 * page never advertises a number the database can't back up.
 */
function useServiceCounts() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [from, setFrom] = useState<Record<string, number>>({});
  useEffect(() => {
    let alive = true;
    (async () => {
      const tally: Record<string, number> = {};
      const cheapest: Record<string, number> = {};
      for (const p of PLATFORMS) {
        const { count } = await supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("active", true)
          .eq("platform", p.key);
        tally[p.key] = count ?? 0;

        const { data } = await supabase
          .from("services")
          .select("marked_up_rate")
          .eq("active", true)
          .eq("platform", p.key)
          .order("marked_up_rate", { ascending: true })
          .limit(1);
        const rate = data?.[0]?.marked_up_rate;
        if (rate != null) cheapest[p.key] = Number(rate);
      }
      if (alive) {
        setCounts(tally);
        setFrom(cheapest);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  return { counts, from };
}

function Hero() {
  const { t, locale } = useI18n();
  const { counts, from } = useServiceCounts();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  // The other script, shown small above the headline. A bilingual brand should
  // look bilingual before you touch the language switch.
  const echo = locale === "fa" ? EN_TITLE : FA_TITLE;
  // Lowest live rate across platforms — the price anchor competitors lead with.
  const rates = Object.values(from);
  const cheapest = rates.length ? Math.min(...rates) : null;

  return (
    <section className="relative -mt-[68px] flex min-h-[92vh] items-center overflow-hidden">
      {/* Chahar bagh: the four-quadrant Persian garden plan, drawn as a quiet
          lattice rather than a stock photo. Pure SVG — nothing to load. */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[var(--bg-base)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.16]" aria-hidden="true">
          <defs>
            <pattern id="khatam" width="88" height="88" patternUnits="userSpaceOnUse">
              {/* eight-point star, the khatam motif from Persian tilework */}
              <g fill="none" stroke="var(--accent)" strokeWidth="0.9">
                <rect x="22" y="22" width="44" height="44" />
                <rect x="22" y="22" width="44" height="44" transform="rotate(45 44 44)" />
                <circle cx="44" cy="44" r="3.5" stroke="var(--saffron)" />
              </g>
            </pattern>
            <radialGradient id="bloom" cx="28%" cy="34%" r="62%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.30" />
              <stop offset="55%" stopColor="var(--saffron)" stopOpacity="0.07" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#khatam)" />
          <rect width="100%" height="100%" fill="url(#bloom)" />
        </svg>
        {/* settle the pattern into the page rather than cutting it off */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-base)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 pt-32 pb-20">
        <div className="max-w-[760px]">
          <p className="anim-stagger anim-1 text-xs uppercase tracking-[0.25em] text-[var(--accent)]">
            {t("hero.eyebrow")}
          </p>

          <p
            aria-hidden="true"
            className="anim-stagger anim-2 mt-6 text-lg text-[var(--text-tertiary)]"
            lang={locale === "fa" ? "en" : "fa"}
          >
            {echo}
          </p>
          <h1 className="anim-stagger anim-2 mt-1 text-[44px] leading-[1.03] font-semibold tracking-[-0.03em] text-[var(--text-primary)] sm:text-[62px] md:text-[76px]">
            {t("hero.title")}
          </h1>

          <p className="anim-stagger anim-3 mt-6 max-w-[600px] text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            {t("hero.lede")}
          </p>

          <div className="anim-stagger anim-4 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-default)] px-6 py-3.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-1)]"
            >
              {t("hero.cta.secondary")}
            </a>
          </div>

          <p className="anim-stagger anim-5 mt-5 text-xs text-[var(--text-tertiary)]">
            {t("hero.note")}
          </p>

          {/* Real figures only. The previous "99.9% uptime" style counters were
              invented, which is a liability on a site that takes payments. */}
          <dl className="anim-stagger anim-5 mt-12 grid max-w-[560px] grid-cols-2 gap-x-8 gap-y-6 border-t border-[var(--border-subtle)] pt-8 sm:grid-cols-3">
            <div>
              <dt className="text-2xl font-semibold text-[var(--text-primary)]">
                {total ? localizeDigits(total, locale) : "—"}
              </dt>
              <dd className="mt-0.5 text-xs text-[var(--text-tertiary)]">{t("stat.services")}</dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold text-[var(--text-primary)]">
                {localizeDigits(3, locale)}
              </dt>
              <dd className="mt-0.5 text-xs text-[var(--text-tertiary)]">{t("stat.platforms")}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-2xl font-semibold text-[var(--text-primary)]">
                {cheapest !== null ? `$${cheapest.toFixed(2)}` : "—"}
              </dt>
              <dd className="mt-0.5 text-xs text-[var(--text-tertiary)]">
                {locale === "fa" ? "شروع از، هر ۱۰۰۰" : "from, per 1,000"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar() {
  return (
    <section id="trust" className="border-y border-[var(--border-subtle)] bg-[var(--bg-base)] py-6">
      <div className="mx-auto max-w-[1200px] px-6 text-center text-sm text-[var(--text-secondary)]">
        Independent panel · Toronto, Canada · Crypto and Interac e-transfer
      </div>
    </section>
  );
}

function useInView<T extends Element>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.unobserve(el);
        }
      },
      { threshold: 0.2, ...opts },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(to);
      return;
    }
    const dur = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular">
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </span>
  );
}

function ServicesPreview() {
  const [activeP, setActiveP] = useState<(typeof PLATFORMS)[number]["key"]>("Instagram");
  const [data, setData] = useState<Record<string, SvcRow[]>>({});
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const out: Record<string, SvcRow[]> = {};
      const tally: Record<string, number> = {};
      for (const p of PLATFORMS) {
        // head+count: row count only, no payload transferred.
        const { count } = await supabase
          .from("services")
          .select("id", { count: "exact", head: true })
          .eq("active", true)
          .eq("platform", p.key);
        tally[p.key] = count ?? 0;
        const { data } = await supabase
          .from("services")
          .select(
            "id, platform, display_name, name, description, service_type, marked_up_rate, rate_per_1000, min_quantity, max_quantity, tier",
          )
          .eq("active", true)
          .eq("platform", p.key)
          .order("marked_up_rate", { ascending: true })
          .limit(3);
        out[p.key] = (data || []).map((s: any): SvcRow => ({
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
          tier: (s.tier ?? null) as Tier | null,
        }));
      }
      if (alive) {
        setData(out);
        setCounts(tally);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const active = PLATFORMS.find((p) => p.key === activeP)!;
  const rows = data[activeP] || [];
  // Live counts once loaded; fall back to the static figure for the first paint
  // and for SSR, so the copy never reads "0 services".
  const activeCount = counts[activeP] ?? active.count;
  const totalCount = Object.keys(counts).length
    ? Object.values(counts).reduce((a, b) => a + b, 0)
    : PLATFORMS.reduce((a, p) => a + p.count, 0);

  return (
    <Section id="services">
      <Eyebrow>Catalog</Eyebrow>
      <SectionHead
        title="Services that actually work"
        sub={`${totalCount} services across Instagram, TikTok and YouTube. Live pricing, straight from the catalog.`}
      />
      <div className="mt-10 flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)] pb-4">
        {PLATFORMS.map((p) => {
          const isActive = p.key === activeP;
          return (
            <button
              key={p.key}
              onClick={() => setActiveP(p.key)}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--bg-surface-2)] text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-1)] hover:text-[var(--text-primary)]"
              }`}
            >
              <p.Icon className="h-4 w-4" />
              {p.label}
              <span className="text-xs text-[var(--text-tertiary)]">{p.count}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {rows.length
          ? rows.map((s) => <ServiceCard key={s.id} s={s} />)
          : Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[280px] animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]"
              />
            ))}
      </div>

      <div className="mt-6 text-right text-sm">
        <Link to="/signup" className="text-[var(--accent)] hover:underline">
          View all {activeCount} {active.label} services →
        </Link>
      </div>
    </Section>
  );
}

/* ---------------- HOW WE'RE DIFFERENT ---------------- */
const DIFFERENTIATORS = [
  "Premium upstream provider — not the cheapest, but reliable",
  "Real engagement, drip-feed delivery available",
  "Undelivered or partial orders refunded automatically",
  "Crypto + e-transfer accepted, no card processing risks",
];

function HowWereDifferent() {
  return (
    <Section>
      <Eyebrow>How we're different</Eyebrow>
      <SectionHead title="Not the cheapest. Reliable." />
      <ul className="divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {DIFFERENTIATORS.map((d) => (
          <li key={d} className="flex items-start gap-3 py-5 text-base text-[var(--text-primary)]">
            <Check className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const STEPS = [
  {
    n: "01",
    t: "Sign up & deposit",
    d: "Create your free account and add funds via crypto or e-transfer. $5 minimum.",
  },
  {
    n: "02",
    t: "Pick your service",
    d: "Browse our full catalog across Instagram, TikTok, and YouTube. Filter by quality tier and price.",
  },
  {
    n: "03",
    t: "Watch it grow",
    d: "Status is refreshed every 15 minutes. Start times are set by the provider (1–72 hours depending on the service).",
  },
];

function HowItWorks() {
  return (
    <Section>
      <Eyebrow>How it works</Eyebrow>
      <SectionHead title="From signup to first order in under 60 seconds." />
      <Divider />
      <div className="grid gap-8 md:grid-cols-3">
        {STEPS.map((s) => (
          <div key={s.n}>
            <div className="text-sm tabular text-[var(--accent)]">{s.n}</div>
            <div className="mt-3 text-xl font-medium tracking-tight">{s.t}</div>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{s.d}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- WHO IT'S FOR ---------------- */
const AUDIENCE = [
  {
    img: "/assets/trust/agency-1.jpg",
    title: "Agencies",
    desc: "Manage growth for multiple clients. API access, bulk orders, white-label invoices.",
  },
  {
    img: "/assets/trust/creator-1.jpg",
    title: "Creators",
    desc: "Boost reach without burning hours. Real engagement on real content.",
  },
  {
    img: "/assets/trust/creator-2.jpg",
    title: "Businesses",
    desc: "Build social proof for restaurants, salons and e-commerce storefronts.",
  },
];

function WhoItsFor() {
  return (
    <Section id="about">
      <Eyebrow>Who it's for</Eyebrow>
      <SectionHead title="Built for the people who take growth seriously." />
      <div className="grid gap-4 md:grid-cols-3">
        {AUDIENCE.map((a) => (
          <AudienceCard key={a.title} {...a} />
        ))}
      </div>
    </Section>
  );
}

function AudienceCard({ img, title, desc }: { img: string; title: string; desc: string }) {
  const fallback = (UNSPLASH as Record<string, string>)[img];
  const [src, setSrc] = useState(img);
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
      <div className="aspect-[4/3] w-full overflow-hidden bg-[var(--bg-surface-2)]">
        <img
          src={src}
          alt={title}
          className="h-full w-full object-cover"
          onError={() => {
            if (fallback && src !== fallback) setSrc(fallback);
          }}
        />
      </div>
      <div className="p-6">
        <div className="text-lg font-medium">{title}</div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{desc}</p>
        <a
          href="#services"
          className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline"
        >
          Learn more →
        </a>
      </div>
    </div>
  );
}

/* ---------------- PRICING ---------------- */
function PricingTransparency() {
  return (
    <Section id="pricing">
      <Eyebrow>Pricing</Eyebrow>
      <SectionHead
        title="Honest, simple pricing"
        sub="We mark up wholesale rates by 50% + $1 per 1,000 orders. That's it. No hidden fees, no surprise charges."
      />
      <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8">
        <div className="text-sm text-[var(--text-tertiary)]">Example · Instagram Followers</div>
        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
              Wholesale
            </div>
            <div className="tabular mt-1 text-2xl text-[var(--text-secondary)]">
              $1.20<span className="text-sm">/1k</span>
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
              You pay
            </div>
            <div className="tabular mt-1 text-2xl text-[var(--text-primary)]">
              $2.80<span className="text-sm">/1k</span>
            </div>
          </div>
        </div>
        <ul className="mt-6 space-y-2 border-t border-[var(--border-subtle)] pt-6 text-sm text-[var(--text-secondary)]">
          {["No subscription", "No hidden fees", "Automatic refund if undelivered"].map((t) => (
            <li key={t} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-[var(--success)]" /> {t}
            </li>
          ))}
        </ul>
        <Link
          to="/signup"
          className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline"
        >
          View full service pricing →
        </Link>
      </div>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  {
    q: "Where does the engagement actually come from?",
    a: "We're a reseller: orders are fulfilled by an upstream provider (smmflw), and we mark their wholesale rate up by a fixed amount. We don't run the delivery network ourselves, so we won't claim to know exactly how every account is sourced. What we will tell you is which provider we use and what we're charged.",
  },
  {
    q: "How fast do orders start?",
    a: "The provider quotes 1–72 hours depending on the service, and the estimate is shown on each service in the catalog. Many start much sooner, but we'd rather give you their number than a marketing one.",
  },
  {
    q: "What payment methods do you accept?",
    a: "Cryptocurrency via NOWPayments (USDT-TRC20 and others) and Interac e-transfer in Canada. No cards yet, so we never store card details.",
  },
  {
    q: "What happens if my order doesn't deliver?",
    a: "Your balance is credited back automatically. If an order is rejected or cancelled you get a full refund; if it delivers partially you're refunded for the undelivered share. You don't need to open a ticket for either.",
  },
  {
    q: "Do you offer refill or drip-feed?",
    a: "Not yet. Some upstream services support them and we're building both into the order form — until they're live we don't advertise them as features you can buy.",
  },
  {
    q: "Do you offer API access?",
    a: "Not yet. It's on the roadmap for resellers, and the page in your dashboard is a preview of what's coming rather than a working key.",
  },
  {
    q: "Is this safe for my account?",
    a: "We never ask for your password — a public link or username is all that's needed. Beyond that, buying engagement is against the terms of service of every major platform, and no provider can honestly guarantee an account will never be actioned. Order sizes that are modest relative to your existing audience carry less risk than large sudden spikes.",
  },
] as const;

function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <Eyebrow>FAQ</Eyebrow>
      <SectionHead title="Questions, answered." />
      <div className="mx-auto max-w-3xl divide-y divide-[var(--border-subtle)] border-y border-[var(--border-subtle)]">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-base font-medium text-[var(--text-primary)]">{f.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && <div className="pb-5 text-sm text-[var(--text-secondary)]">{f.a}</div>}
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA() {
  return (
    <Section>
      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-12 text-center md:p-20">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(/assets/decorative/pattern-persian.svg)" }}
          aria-hidden
        />
        <div className="relative">
          <h2 className="text-4xl tracking-tight md:text-5xl">Ready to start growing?</h2>
          <p className="mx-auto mt-4 max-w-md text-[var(--text-secondary)]">
            Top up from $5. No subscription, no minimum commitment.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Get started — from $5 <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <Link to="/" className="flex items-center gap-2 text-base font-medium tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[var(--accent)] text-white">
              <Sprout className="h-4 w-4" />
            </span>
            B<span className="text-[var(--accent)]">o</span>ostan
          </Link>
          <p className="mt-4 max-w-xs text-sm text-[var(--text-secondary)]">
            بوستان · The garden where social grows.
          </p>
          <p className="mt-2 text-xs text-[var(--text-tertiary)]">Made in Toronto</p>
        </div>
        <div className="grid grid-cols-3 gap-6 text-sm">
          <FooterCol
            title="Product"
            links={[
              ["Services", "#services"],
              ["Pricing", "#pricing"],
              ["API Docs", "/signup"],
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              ["About", "/about"],
              ["Contact", "mailto:hello@boostan.co"],
              ["Support", "mailto:hello@boostan.co"],
            ]}
          />
          <FooterCol
            title="Legal"
            links={[
              ["Terms", "/terms"],
              ["Privacy", "/privacy"],
              ["Refund Policy", "/refund"],
            ]}
          />
        </div>
      </div>
      <div className="border-t border-[var(--border-subtle)]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 text-xs text-[var(--text-tertiary)]">
          <div>© {new Date().getFullYear()} Boostan</div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="X" className="hover:text-[var(--text-primary)]">
              <FaXTwitter className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-[var(--text-primary)]">
              <FaInstagram className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-3 text-xs uppercase tracking-wider text-[var(--text-tertiary)]">
        {title}
      </div>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- helpers ---------------- */
function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.08 });
  return (
    <section
      id={id}
      ref={ref}
      className={`mx-auto max-w-[1200px] px-6 py-24 transition-all duration-700 md:py-32 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]">
      {children}
    </div>
  );
}

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-10 max-w-2xl">
      <h2 className="text-3xl tracking-tight md:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-[var(--text-secondary)]">{sub}</p>}
    </div>
  );
}

function Divider() {
  return (
    <div className="my-8 flex justify-center" aria-hidden>
      <svg width="60" height="20" viewBox="0 0 60 20" fill="none" className="text-[var(--accent)]">
        <path
          d="M2 10 C 15 2, 30 18, 45 10 S 58 10, 58 10"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="30" cy="10" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
