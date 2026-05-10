import { useState } from "react";
import {
  ArrowRight, Play, Instagram, Youtube, Zap, ShieldCheck, Code2,
  ChevronDown, Sparkles, TrendingUp, Music2, Twitter, Sprout,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";

export function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* ambient orbs */}
      <div className="glow-orb animate-float-slow" style={{ top: -160, left: -120, background: "#6B1E5C", opacity: 0.55 }} />
      <div className="glow-orb animate-float-med" style={{ top: 320, right: -180, background: "#0B6B8C", opacity: 0.5 }} />
      <div className="glow-orb animate-float-slow" style={{ top: 1100, left: "30%", background: "#B83E94", opacity: 0.45 }} />

      <div className="relative z-10">
        <SiteNav />

        <main className="mx-auto max-w-[1200px] px-5">
          <Hero />
          <Stats />
          <PopularServices />
          <Features />
          <Testimonials />
          <PricingTeaser />
          <FAQ />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="pt-20 pb-24 text-center md:pt-28 md:pb-32">
      <div className="glass mx-auto inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-foreground-muted">
        <span className="pulse-dot" />
        <span className="tabular">2,847 orders processing right now</span>
      </div>

      <h1 className="mx-auto mt-8 max-w-4xl text-5xl leading-[1.05] tracking-tight md:text-7xl">
        Grow your social
        <br />
        at the <span className="gradient-text">speed of light.</span>
      </h1>

      <p className="mx-auto mt-6 max-w-2xl text-base text-foreground-muted md:text-lg">
        The premium SMM panel for serious resellers. Real engagement, instant
        delivery, automated API. Trusted by agencies worldwide.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <a href="#" className="btn-gradient inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm">
          Get started — $25 minimum <ArrowRight className="h-4 w-4" />
        </a>
        <a href="#" className="glass inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm text-foreground-muted hover:text-foreground">
          <Play className="h-4 w-4" /> Watch demo
        </a>
      </div>
    </section>
  );
}

const STATS = [
  { v: "2.4M+", l: "Orders done" },
  { v: "200+", l: "Services" },
  { v: "99.8%", l: "Uptime" },
  { v: "<30s", l: "Avg start" },
];

function Stats() {
  return (
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {STATS.map((s) => (
        <div key={s.l} className="glass rounded-2xl p-6">
          <div className="tabular gradient-text text-3xl md:text-4xl">{s.v}</div>
          <div className="mt-1 text-sm text-foreground-muted">{s.l}</div>
        </div>
      ))}
    </section>
  );
}

const SERVICES = [
  { icon: Instagram, name: "Instagram Followers", meta: "Real • 30-day refill", price: "0.89" },
  { icon: Music2, name: "TikTok Views", meta: "HQ • Instant", price: "0.04" },
  { icon: Youtube, name: "YouTube Subscribers", meta: "Non-drop", price: "3.20" },
  { icon: Twitter, name: "Twitter Likes", meta: "Real accounts", price: "0.55" },
];

function PopularServices() {
  return (
    <section id="services" className="mt-32">
      <SectionHead eyebrow="Catalog" title="Popular services" sub="Hand-picked from 200+ active services across every major platform." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map(({ icon: Icon, name, meta, price }) => (
          <div key={name} className="glass group rounded-2xl p-5 transition-all hover:border-strong hover:-translate-y-0.5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-brand-soft)] text-foreground">
                <Icon className="h-5 w-5" />
              </span>
              <div className="text-sm font-medium">{name}</div>
            </div>
            <div className="mt-4 text-xs text-foreground-subtle">{meta}</div>
            <div className="mt-6 flex items-end justify-between">
              <div>
                <div className="text-xs text-foreground-subtle">per 1,000</div>
                <div className="tabular text-2xl">${price}</div>
              </div>
              <button className="rounded-lg px-3 py-1.5 text-xs text-foreground-muted hover:bg-[var(--surface-strong)] hover:text-foreground">
                Order →
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const FEATURES = [
  { icon: Zap, t: "Instant delivery", d: "Most orders start within 30 seconds. Drip-feed and scheduling included for serious campaigns." },
  { icon: ShieldCheck, t: "Refill guarantee", d: "30-day refill on every retention service. If it drops, we replace it. No questions, no tickets." },
  { icon: Code2, t: "API access", d: "Clean v2 REST API. Place orders, sync services, check balance — automate your entire reseller pipeline." },
];

function Features() {
  return (
    <section id="api" className="mt-32">
      <SectionHead eyebrow="Why Boostan" title="Built for resellers who don't have time to babysit." />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, t, d }) => (
          <div key={t} className="glass rounded-2xl p-7">
            <span className="grid h-10 w-10 place-items-center rounded-xl gradient-bg text-white">
              <Icon className="h-5 w-5" />
            </span>
            <div className="mt-5 text-lg">{t}</div>
            <p className="mt-2 text-sm text-foreground-muted">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const QUOTES = [
  { q: "Switched 4 panels to Boostan. API uptime is unreal — haven't had a failed cron in 3 months.", a: "Marcus L.", r: "Agency owner, 12k orders/mo" },
  { q: "Cheapest IG followers I've found that actually stick. Refills auto-process overnight.", a: "Priya S.", r: "Reseller since 2023" },
  { q: "Dashboard is the only one that doesn't make me feel like I'm using software from 2014.", a: "Diego R.", r: "Growth consultant" },
];

function Testimonials() {
  const [i, setI] = useState(0);
  return (
    <section className="mt-32">
      <SectionHead eyebrow="Trusted" title="Resellers don't switch back." />
      <div className="glass mt-10 rounded-3xl p-10 md:p-14">
        <Sparkles className="h-6 w-6 text-[var(--accent)]" />
        <p className="mt-6 max-w-3xl text-2xl leading-relaxed md:text-3xl">"{QUOTES[i].q}"</p>
        <div className="mt-8 flex items-center justify-between">
          <div>
            <div className="text-sm">{QUOTES[i].a}</div>
            <div className="text-xs text-foreground-subtle">{QUOTES[i].r}</div>
          </div>
          <div className="flex gap-1.5">
            {QUOTES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setI(idx)}
                aria-label={`Quote ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 gradient-bg" : "w-4 bg-[var(--border-strong)]"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PricingTeaser() {
  return (
    <section id="pricing" className="mt-32">
      <div className="glass relative overflow-hidden rounded-3xl p-10 md:p-16 text-center">
        <div className="glow-orb" style={{ top: -200, left: "20%", background: "#6B1E5C", opacity: .35 }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-foreground-muted">
            <TrendingUp className="h-3.5 w-3.5" /> Wholesale rates
          </div>
          <h3 className="mt-5 text-4xl md:text-5xl">
            Most affordable rates <span className="gradient-text">in the industry.</span>
          </h3>
          <p className="mx-auto mt-5 max-w-xl text-foreground-muted">
            Pay-as-you-go. No subscriptions. Top up $25 and start ordering.
          </p>
          <a href="#" className="btn-gradient mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm">
            See full price list <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "How fast do orders start?", a: "Median start time is 18 seconds. 99% of orders begin within 5 minutes — you'll see the live counter tick up in your dashboard." },
  { q: "What if engagement drops?", a: "All retention services include a 30-day automatic refill. We monitor every order and re-fill drops without you opening a ticket." },
  { q: "Do you have an API?", a: "Yes — a clean v2 REST API mirroring industry standard endpoints. Place orders, sync services, check status, manage balance." },
  { q: "What payment methods do you accept?", a: "Crypto (BTC, ETH, USDT, and 40+ more via NOWPayments), credit cards via Stripe, and PayPal. Crypto deposits are instant." },
  { q: "Can I get a refund?", a: "Unstarted orders are fully refundable to your panel balance. Partial orders are refunded proportionally for the undelivered amount." },
  { q: "Is there a minimum deposit?", a: "$25. Low enough to test the panel, high enough to keep tire-kickers out." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="mt-32">
      <SectionHead eyebrow="FAQ" title="Questions, answered." />
      <div className="mt-10 space-y-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="glass rounded-2xl">
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-sm md:text-base">{f.q}</span>
                <ChevronDown className={`h-4 w-4 shrink-0 text-foreground-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-6 pb-6 text-sm text-foreground-muted">{f.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="my-32">
      <div className="glass relative overflow-hidden rounded-3xl p-12 text-center md:p-20">
        <div className="glow-orb animate-float-med" style={{ top: -200, right: -100, background: "#B83E94", opacity: .4 }} />
        <div className="glow-orb animate-float-slow" style={{ bottom: -200, left: -100, background: "#0B6B8C", opacity: .35 }} />
        <div className="relative">
          <h3 className="text-5xl tracking-tight md:text-6xl">
            Ready to <span className="gradient-text">grow?</span>
          </h3>
          <p className="mx-auto mt-5 max-w-lg text-foreground-muted">
            Create an account, deposit $25, and place your first order in under 60 seconds.
          </p>
          <a href="#" className="btn-gradient mt-8 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm">
            Get started — it's free <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">{eyebrow}</div>
      <h2 className="mt-3 text-4xl tracking-tight md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-foreground-muted">{sub}</p>}
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-[var(--border)] mt-12">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-between gap-6 px-5 py-10 sm:flex-row">
        <div className="flex items-center gap-2 text-sm text-foreground-muted">
          <span className="grid h-6 w-6 place-items-center rounded-md gradient-bg"><Sprout className="h-3.5 w-3.5 text-white" /></span>
          Boostan © 2026
        </div>
        <div className="flex items-center gap-6 text-xs text-foreground-muted">
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
          <a href="#" className="hover:text-foreground">Status</a>
          <a href="#" className="hover:text-foreground">Contact</a>
        </div>
      </div>
    </footer>
  );
}
