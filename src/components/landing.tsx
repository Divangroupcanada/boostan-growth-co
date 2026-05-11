import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight, ChevronDown, Sprout, Check,
} from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube, FaXTwitter } from "react-icons/fa6";
import { supabase } from "@/integrations/supabase/client";
import { TryItNow } from "@/components/try-it-now";
import { ServiceCard, type ServiceCardData } from "@/components/service-card";
import type { Tier } from "@/lib/service-tier";

const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1920&q=80&auto=format&fit=crop",
  "/assets/trust/creator-1.jpg": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80&auto=format&fit=crop",
  "/assets/trust/creator-2.jpg": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80&auto=format&fit=crop",
  "/assets/trust/agency-1.jpg":  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop",
} as const;

type SvcRow = ServiceCardData;

const PLATFORMS = [
  { key: "Instagram", label: "Instagram", count: 75, Icon: FaInstagram },
  { key: "TikTok",    label: "TikTok",    count: 21, Icon: FaTiktok },
  { key: "YouTube",   label: "YouTube",   count: 47, Icon: FaYoutube },
] as const;

export function Landing() {
  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <Stats />
        <TryItNow />
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
          <a href="#services" className="hover:text-[var(--text-primary)] transition-colors">Services</a>
          <a href="#pricing"  className="hover:text-[var(--text-primary)] transition-colors">Pricing</a>
          <a href="#faq"      className="hover:text-[var(--text-primary)] transition-colors">FAQ</a>
          <a href="#about"    className="hover:text-[var(--text-primary)] transition-colors">About</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="hidden rounded-md px-3 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] sm:inline-block"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  const [videoOk, setVideoOk] = useState(true);

  return (
    <section className="relative -mt-[68px] flex min-h-screen items-center overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        {videoOk ? (
          <video
            className="h-full w-full object-cover"
            autoPlay muted loop playsInline
            poster={UNSPLASH.hero}
            aria-hidden="true"
            onError={() => setVideoOk(false)}
          >
            <source src="/assets/hero/hero-video.mp4" type="video/mp4" />
          </video>
        ) : (
          <img
            src={UNSPLASH.hero}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        )}
        {/* dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-base)]/40 via-[var(--bg-base)]/40 to-[var(--bg-base)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 pt-32 pb-24">
        <div className="max-w-[720px] space-y-6">
          <div className="anim-stagger anim-1 text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]">
            بوستان · Boostan
          </div>
          <h1 className="anim-stagger anim-2 text-[40px] leading-[1.05] tracking-[-0.03em] sm:text-[56px] md:text-[68px] lg:text-[72px]">
            Your social presence,<br />
            <span className="text-[var(--text-primary)]">growing.</span>
          </h1>
          <p className="anim-stagger anim-3 max-w-[560px] text-base text-[var(--text-secondary)] sm:text-lg">
            The premium SMM panel for serious creators, agencies, and businesses.
            Real engagement, instant delivery, automated API.
          </p>
          <div className="anim-stagger anim-4 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              Get started — $25 minimum <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-[var(--border-default)] bg-transparent px-5 py-3 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-1)]"
            >
              Browse services
            </a>
          </div>
          <div className="anim-stagger anim-5 text-xs text-[var(--text-tertiary)]">
            No commitments · Cancel anytime · Crypto + e-transfer accepted
          </div>
        </div>
      </div>

      <a
        href="#trust"
        aria-label="Scroll"
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-[var(--text-tertiary)] anim-bounce"
      >
        <ChevronDown className="h-5 w-5" />
      </a>
    </section>
  );
}

/* ---------------- TRUST BAR ---------------- */
function TrustBar() {
  return (
    <section id="trust" className="border-y border-[var(--border-subtle)] bg-[var(--bg-base)] py-6">
      <div className="mx-auto max-w-[1200px] px-6 text-center text-sm text-[var(--text-secondary)]">
        Trusted by 200+ agencies and creators across Toronto, Dubai, NYC, LA
      </div>
    </section>
  );
}

/* ---------------- STATS ---------------- */
const STATS = [
  { value: 143,  suffix: "",    label: "Premium services" },
  { value: 99.8, suffix: "%",   label: "Uptime guarantee", decimals: 1 },
  { value: 30,   suffix: "s",   label: "Average start time", prefix: "<" },
  { value: 24,   suffix: "/7",  label: "Automated delivery" },
] as const;

function useInView<T extends Element>(opts?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); io.unobserve(el); } },
      { threshold: 0.2, ...opts },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, inView };
}

function CountUp({ to, decimals = 0, prefix = "", suffix = "" }: { to: number; decimals?: number; prefix?: string; suffix?: string }) {
  const { ref, inView } = useInView<HTMLSpanElement>();
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(to); return; }
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
  return <span ref={ref} className="tabular">{prefix}{n.toFixed(decimals)}{suffix}</span>;
}

function Stats() {
  return (
    <Section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-8">
            <div className="text-4xl font-medium tracking-tight text-[var(--text-primary)] md:text-5xl">
              <CountUp to={s.value} decimals={(s as any).decimals ?? 0} prefix={(s as any).prefix ?? ""} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm text-[var(--text-secondary)]">{s.label}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- SERVICES PREVIEW ---------------- */
function ServicesPreview() {
  const [activeP, setActiveP] = useState<typeof PLATFORMS[number]["key"]>("Instagram");
  const [data, setData] = useState<Record<string, SvcRow[]>>({});

  useEffect(() => {
    let alive = true;
    (async () => {
      const out: Record<string, SvcRow[]> = {};
      for (const p of PLATFORMS) {
        const { data } = await supabase
          .from("services")
          .select("id, platform, display_name, name, description, service_type, marked_up_rate, rate_per_1000, min_quantity, max_quantity, tier")
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
      if (alive) setData(out);
    })();
    return () => { alive = false; };
  }, []);

  const active = PLATFORMS.find(p => p.key === activeP)!;
  const rows = data[activeP] || [];

  return (
    <Section id="services">
      <Eyebrow>Catalog</Eyebrow>
      <SectionHead
        title="Services that actually work"
        sub="143 hand-curated services across Instagram, TikTok, and YouTube. Real engagement, never bots."
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
          View all {active.count} {active.label} services →
        </Link>
      </div>
    </Section>
  );
}

/* ---------------- HOW WE'RE DIFFERENT ---------------- */
const DIFFERENTIATORS = [
  "Premium upstream provider — not the cheapest, but reliable",
  "Real engagement, drip-feed delivery available",
  "30-day auto-refill on follower drops",
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
  { n: "01", t: "Sign up & deposit", d: "Create your free account and add funds via crypto or e-transfer. $25 minimum." },
  { n: "02", t: "Pick your service", d: "Browse 143 services across Instagram, TikTok, and YouTube. Filter by quality tier and price." },
  { n: "03", t: "Watch it grow",     d: "Orders start within 30 seconds. Track progress in real-time. Get refilled if anything drops." },
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
  { img: "/assets/trust/agency-1.jpg",  title: "Agencies",   desc: "Manage growth for multiple clients. API access, bulk orders, white-label invoices." },
  { img: "/assets/trust/creator-1.jpg", title: "Creators",   desc: "Boost reach without burning hours. Real engagement on real content." },
  { img: "/assets/trust/creator-2.jpg", title: "Businesses", desc: "Build social proof for restaurants, salons, e-commerce. Trusted by 200+ Toronto businesses." },
];

function WhoItsFor() {
  return (
    <Section id="about">
      <Eyebrow>Who it's for</Eyebrow>
      <SectionHead title="Built for the people who take growth seriously." />
      <div className="grid gap-4 md:grid-cols-3">
        {AUDIENCE.map((a) => <AudienceCard key={a.title} {...a} />)}
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
          onError={() => { if (fallback && src !== fallback) setSrc(fallback); }}
        />
      </div>
      <div className="p-6">
        <div className="text-lg font-medium">{title}</div>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{desc}</p>
        <a href="#services" className="mt-4 inline-block text-sm text-[var(--accent)] hover:underline">Learn more →</a>
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
            <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">Wholesale</div>
            <div className="tabular mt-1 text-2xl text-[var(--text-secondary)]">$1.20<span className="text-sm">/1k</span></div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[var(--text-tertiary)]">You pay</div>
            <div className="tabular mt-1 text-2xl text-[var(--text-primary)]">$2.80<span className="text-sm">/1k</span></div>
          </div>
        </div>
        <ul className="mt-6 space-y-2 border-t border-[var(--border-subtle)] pt-6 text-sm text-[var(--text-secondary)]">
          {["No subscription", "No hidden fees", "Refill on drops included"].map((t) => (
            <li key={t} className="flex items-center gap-2"><Check className="h-4 w-4 text-[var(--success)]" /> {t}</li>
          ))}
        </ul>
        <Link to="/signup" className="mt-6 inline-block text-sm text-[var(--accent)] hover:underline">
          View full service pricing →
        </Link>
      </div>
    </Section>
  );
}

/* ---------------- FAQ ---------------- */
const FAQS = [
  { q: "Are these real followers/likes/views?", a: "Yes — we use trusted upstream providers serving real engagement. We never use bot networks." },
  { q: "How fast do orders start?",             a: "Most orders start within 30 seconds. Some niche services may take 1–3 minutes." },
  { q: "What payment methods do you accept?",   a: "Crypto (USDT-TRC20, BTC, ETH) and Canadian Interac e-transfer. No credit cards yet — coming soon." },
  { q: "Can I get a refund?",                   a: "Yes — we refill drops automatically and refund unfulfilled orders." },
  { q: "Do you offer API access?",              a: "Yes — every account gets free API access for automation. Documentation in your dashboard." },
  { q: "Is this safe for my Instagram/TikTok account?", a: "Yes — we comply with platform best practices. Slow drip-feed available for organic-looking growth." },
];

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
                <ChevronDown className={`h-4 w-4 shrink-0 text-[var(--text-tertiary)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
            Join 200+ agencies and creators using Boostan.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)]"
          >
            Get started — $25 minimum <ArrowRight className="h-4 w-4" />
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
          <FooterCol title="Product" links={[["Services","#services"],["Pricing","#pricing"],["API Docs","/signup"]]} />
          <FooterCol title="Company" links={[["About","/about"],["Contact","mailto:hello@boostan.co"],["Support","mailto:hello@boostan.co"]]} />
          <FooterCol title="Legal"   links={[["Terms","/terms"],["Privacy","/privacy"],["Refund Policy","/refund"]]} />
        </div>
      </div>
      <div className="border-t border-[var(--border-subtle)]">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-6 text-xs text-[var(--text-tertiary)]">
          <div>© {new Date().getFullYear()} Boostan</div>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="X" className="hover:text-[var(--text-primary)]"><FaXTwitter className="h-4 w-4" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-[var(--text-primary)]"><FaInstagram className="h-4 w-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="mb-3 text-xs uppercase tracking-wider text-[var(--text-tertiary)]">{title}</div>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a href={href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">{label}</a>
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
  return <div className="mb-3 text-xs uppercase tracking-[0.25em] text-[var(--text-tertiary)]">{children}</div>;
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
        <path d="M2 10 C 15 2, 30 18, 45 10 S 58 10, 58 10" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <circle cx="30" cy="10" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
