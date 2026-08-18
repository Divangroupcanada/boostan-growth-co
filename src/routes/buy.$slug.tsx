import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, ShieldCheck, Zap, Lock } from "lucide-react";
import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa6";
import { supabase } from "@/integrations/supabase/client";
import { useI18n, localizeDigits } from "@/lib/i18n";
import { orderPrice } from "@/lib/pricing";

/**
 * Per-service landing pages: /buy/instagram-followers, /buy/tiktok-views, ...
 *
 * These exist for search intent — people look for "buy instagram followers",
 * not for a panel. Each page is generated from the live catalog, so prices and
 * availability can never drift from what the order form will actually charge.
 */

type Offer = {
  slug: string;
  platform: "Instagram" | "TikTok" | "YouTube";
  serviceType: string;
  noun: { en: string; fa: string };
  /** Retail ladder. Filtered at render against the catalog's real min/max. */
  quantities: number[];
  why: { en: string; fa: string };
};

const OFFERS: Offer[] = [
  {
    slug: "instagram-followers",
    platform: "Instagram",
    serviceType: "followers",
    noun: { en: "Instagram followers", fa: "فالوور اینستاگرام" },
    quantities: [100, 250, 500, 1000, 2500, 5000],
    why: {
      en: "Follower count is the first number a visitor checks, and it decides whether they read your bio or scroll past. It also feeds the ranking signals that decide how often your posts surface.",
      fa: "تعداد فالوور اولین عددی است که بازدیدکننده می‌بیند و تعیین می‌کند بایو شما را بخواند یا رد شود. این عدد روی دیده‌شدن پست‌ها هم اثر دارد.",
    },
  },
  {
    slug: "instagram-likes",
    platform: "Instagram",
    serviceType: "likes",
    noun: { en: "Instagram likes", fa: "لایک اینستاگرام" },
    quantities: [50, 100, 250, 500, 1000, 2500],
    why: {
      en: "Likes are the cheapest way to make a post look worth stopping for. They land fastest of any service and work best on content that's already good.",
      fa: "لایک ارزان‌ترین راه برای این است که پست ارزش توقف داشته باشد. سریع‌تر از بقیه سرویس‌ها می‌رسد و روی محتوای خوب بهترین نتیجه را می‌دهد.",
    },
  },
  {
    slug: "instagram-views",
    platform: "Instagram",
    serviceType: "views",
    noun: { en: "Instagram views", fa: "بازدید اینستاگرام" },
    quantities: [500, 1000, 2500, 5000, 10000, 25000],
    why: {
      en: "View counts tell a scrolling stranger that other people already stopped. On Reels they're the number that decides whether your video gets a second life.",
      fa: "تعداد بازدید به بیننده می‌گوید که بقیه هم توقف کرده‌اند. روی ریلز، همین عدد تعیین می‌کند ویدیو دوباره دیده شود یا نه.",
    },
  },
  {
    slug: "instagram-comments",
    platform: "Instagram",
    serviceType: "comments",
    noun: { en: "Instagram comments", fa: "کامنت اینستاگرام" },
    quantities: [10, 25, 50, 100, 250],
    why: {
      en: "Comments are the hardest engagement to fake convincingly and the strongest signal when they land. Keep the count proportional to your likes.",
      fa: "کامنت سخت‌ترین تعامل برای جعل کردن و قوی‌ترین سیگنال است. تعداد آن را متناسب با لایک‌ها نگه دارید.",
    },
  },
  {
    slug: "tiktok-followers",
    platform: "TikTok",
    serviceType: "followers",
    noun: { en: "TikTok followers", fa: "فالوور تیک‌تاک" },
    quantities: [100, 250, 500, 1000, 2500, 5000],
    why: {
      en: "TikTok surfaces content to strangers far more than Instagram does, so a credible follower count converts more of those strangers into actual fans.",
      fa: "تیک‌تاک محتوا را بیشتر به غریبه‌ها نشان می‌دهد، پس تعداد فالوور معتبر، بیشتر آن‌ها را به دنبال‌کننده واقعی تبدیل می‌کند.",
    },
  },
  {
    slug: "tiktok-likes",
    platform: "TikTok",
    serviceType: "likes",
    noun: { en: "TikTok likes", fa: "لایک تیک‌تاک" },
    quantities: [100, 250, 500, 1000, 2500, 5000],
    why: {
      en: "Likes raise a video's engagement rate, which is the metric TikTok weighs most heavily when deciding whether to push it further.",
      fa: "لایک نرخ تعامل ویدیو را بالا می‌برد؛ همان معیاری که تیک‌تاک بیشترین وزن را به آن می‌دهد.",
    },
  },
  {
    slug: "tiktok-views",
    platform: "TikTok",
    serviceType: "views",
    noun: { en: "TikTok views", fa: "بازدید تیک‌تاک" },
    quantities: [1000, 2500, 5000, 10000, 25000, 50000],
    why: {
      en: "Views are the lowest-risk place to start: they attach to a single video rather than your account, and they're the cheapest per thousand of anything we sell.",
      fa: "بازدید کم‌ریسک‌ترین نقطه شروع است: به یک ویدیو وصل می‌شود نه به اکانت، و ارزان‌ترین سرویس ماست.",
    },
  },
  {
    slug: "youtube-views",
    platform: "YouTube",
    serviceType: "views",
    noun: { en: "YouTube views", fa: "بازدید یوتیوب" },
    quantities: [500, 1000, 2500, 5000, 10000, 25000],
    why: {
      en: "YouTube ranks partly on watch behaviour, and a video with visible traction gets clicked more often from search and suggested feeds.",
      fa: "یوتیوب تا حدی بر اساس رفتار تماشا رتبه می‌دهد، و ویدیویی که دیده شده بیشتر کلیک می‌خورد.",
    },
  },
  {
    slug: "youtube-subscribers",
    platform: "YouTube",
    serviceType: "subscribers",
    noun: { en: "YouTube subscribers", fa: "سابسکرایبر یوتیوب" },
    quantities: [50, 100, 250, 500, 1000],
    why: {
      en: "Subscriber count is what a first-time visitor uses to judge whether a channel is worth following. It's the slowest service to deliver, so order early.",
      fa: "تعداد سابسکرایبر معیار بازدیدکننده تازه‌وارد است. کندترین سرویس در تحویل است، پس زودتر سفارش دهید.",
    },
  },
  {
    slug: "youtube-likes",
    platform: "YouTube",
    serviceType: "likes",
    noun: { en: "YouTube likes", fa: "لایک یوتیوب" },
    quantities: [50, 100, 250, 500, 1000, 2500],
    why: {
      en: "Likes are YouTube's visible review score. A healthy ratio reassures a viewer deciding whether to give a long video their time.",
      fa: "لایک نمره‌ی قابل‌مشاهده یوتیوب است. نسبت خوب، بیننده را برای تماشای ویدیوی طولانی مطمئن می‌کند.",
    },
  },
];

const ICONS = { Instagram: FaInstagram, TikTok: FaTiktok, YouTube: FaYoutube };

export const Route = createFileRoute("/buy/$slug")({
  loader: ({ params }) => {
    const offer = OFFERS.find((o) => o.slug === params.slug);
    if (!offer) throw notFound();
    return { offer };
  },
  head: ({ loaderData }) => {
    const o = loaderData?.offer;
    if (!o) return {};
    const title = `Buy ${o.noun.en} — instant pricing, automatic refunds | Boostan`;
    return {
      meta: [
        { title },
        {
          name: "description",
          content: `Buy ${o.noun.en} with live catalog pricing. Undelivered orders are refunded automatically. Crypto and Interac e-transfer, from $5. No password ever required.`,
        },
        { property: "og:title", content: title },
      ],
      links: [{ rel: "canonical", href: `https://boostan.co/buy/${o.slug}` }],
    };
  },
  component: BuyPage,
});

type Row = { marked_up_rate: number; min_quantity: number; max_quantity: number };

function BuyPage() {
  const { offer } = Route.useLoaderData();
  const { locale } = useI18n();
  const L = locale === "fa" ? "fa" : "en";
  const [rows, setRows] = useState<Row[] | null>(null);
  const Icon = ICONS[offer.platform];

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from("services")
        .select("marked_up_rate, min_quantity, max_quantity")
        .eq("active", true)
        .eq("platform", offer.platform)
        .eq("service_type", offer.serviceType)
        .order("marked_up_rate", { ascending: true });
      if (alive) setRows((data as Row[]) ?? []);
    })();
    return () => {
      alive = false;
    };
  }, [offer.platform, offer.serviceType]);

  // Cheapest service that can actually take this quantity decides the price,
  // so a package can never quote a rate the order form won't honour.
  const priceFor = (qty: number): number | null => {
    if (!rows?.length) return null;
    const fit = rows.find((r) => qty >= r.min_quantity && qty <= r.max_quantity);
    if (!fit) return null;
    return orderPrice(Number(fit.marked_up_rate), qty);
  };

  const available = offer.quantities.filter((q) => priceFor(q) !== null);
  const packages = rows === null ? offer.quantities : available;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <section className="mx-auto max-w-[1200px] px-6 pt-16 pb-10">
        <Link
          to="/"
          className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
        >
          ← Boostan
        </Link>

        <div className="mt-8 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--accent-subtle)] text-[var(--accent)]">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-sm text-[var(--text-tertiary)]">{offer.platform}</span>
        </div>

        <h1 className="mt-4 max-w-3xl text-[38px] leading-[1.08] font-semibold tracking-[-0.02em] sm:text-[52px]">
          {L === "fa" ? `خرید ${offer.noun.fa}` : `Buy ${offer.noun.en}`}
        </h1>
        <p className="mt-4 max-w-xl text-base text-[var(--text-secondary)]">
          {L === "fa"
            ? "قیمت‌ها زنده از فهرست ما می‌آید. اگر تحویل نشود، پول خودکار برمی‌گردد."
            : "Prices come live from our catalog. If it doesn't deliver, you're refunded automatically."}
        </p>

        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-secondary)]">
          {[
            { Icon: ShieldCheck, en: "Automatic refund if undelivered", fa: "بازگشت خودکار وجه" },
            { Icon: Lock, en: "Never asks for your password", fa: "بدون نیاز به رمز عبور" },
            { Icon: Zap, en: "Crypto or e-transfer, from $5", fa: "ارز دیجیتال، از ۵ دلار" },
          ].map(({ Icon: I, en, fa }) => (
            <li key={en} className="flex items-center gap-2">
              <I className="h-4 w-4 text-[var(--accent)]" aria-hidden="true" />
              {L === "fa" ? fa : en}
            </li>
          ))}
        </ul>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-[1200px] px-6 pb-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((qty) => {
            const price = priceFor(qty);
            return (
              <div
                key={qty}
                className="flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6 transition-colors hover:border-[var(--accent)]"
              >
                <div className="text-2xl font-semibold">
                  {localizeDigits(qty.toLocaleString(), locale)}
                </div>
                <div className="mt-1 text-sm text-[var(--text-tertiary)]">
                  {L === "fa" ? offer.noun.fa : offer.noun.en}
                </div>
                <div className="mt-5 text-3xl font-semibold text-[var(--accent)]">
                  {rows === null ? (
                    <span className="text-[var(--text-tertiary)]">—</span>
                  ) : price === null ? (
                    <span className="text-base text-[var(--text-tertiary)]">
                      {L === "fa" ? "موجود نیست" : "Not available"}
                    </span>
                  ) : (
                    `$${price.toFixed(2)}`
                  )}
                </div>
                <Link
                  to="/signup"
                  className="mt-5 inline-flex items-center justify-center rounded-md bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
                >
                  {L === "fa" ? "سفارش" : "Order this"}
                </Link>
              </div>
            );
          })}
        </div>
        {rows !== null && available.length === 0 && (
          <p className="mt-6 text-sm text-[var(--text-tertiary)]">
            {L === "fa"
              ? "این سرویس فعلاً در فهرست موجود نیست."
              : "This service isn't currently in the catalog. Check the full service list."}
          </p>
        )}
      </section>

      {/* Why it matters — search intent, answered plainly */}
      <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface-1)]">
        <div className="mx-auto max-w-[760px] px-6 py-16">
          <h2 className="text-2xl font-medium tracking-tight">
            {L === "fa" ? `چرا ${offer.noun.fa} مهم است؟` : `Why ${offer.noun.en} matter`}
          </h2>
          <p className="mt-4 leading-relaxed text-[var(--text-secondary)]">
            {L === "fa" ? offer.why.fa : offer.why.en}
          </p>

          <h2 className="mt-12 text-2xl font-medium tracking-tight">
            {L === "fa" ? "قبل از خرید بدانید" : "Before you buy"}
          </h2>
          <dl className="mt-4 space-y-5">
            {[
              {
                q: { en: "How long does it take?", fa: "چقدر طول می‌کشد؟" },
                a: {
                  en: "Our provider quotes 1–72 hours to start, depending on the service. We show their number rather than a better-sounding one, and your dashboard refreshes the status every 15 minutes.",
                  fa: "تامین‌کننده ما بین ۱ تا ۷۲ ساعت برای شروع اعلام می‌کند. ما همان عدد را می‌گوییم و وضعیت هر ۱۵ دقیقه به‌روز می‌شود.",
                },
              },
              {
                q: { en: "What if it doesn't deliver?", fa: "اگر تحویل نشود چه؟" },
                a: {
                  en: "You're refunded automatically — in full if the order fails, or for the undelivered share if it only partly completes. No ticket required.",
                  fa: "پول خودکار برمی‌گردد — کامل اگر سفارش شکست بخورد، یا به نسبت اگر ناقص تحویل شود. نیازی به تیکت نیست.",
                },
              },
              {
                q: { en: "Is it safe for my account?", fa: "برای اکانتم امن است؟" },
                a: {
                  en: "We never ask for your password — just a public link. Be aware that buying engagement is against the terms of service of every major platform, and nobody can honestly guarantee an account will never be actioned. Orders modest relative to your existing audience carry less risk than large sudden spikes.",
                  fa: "هرگز رمز عبور نمی‌خواهیم — فقط لینک عمومی. توجه کنید خرید تعامل خلاف قوانین همه پلتفرم‌هاست و هیچ‌کس نمی‌تواند صادقانه تضمین دهد اکانت هرگز محدود نمی‌شود. سفارش‌های متناسب با اندازه فعلی صفحه، ریسک کمتری دارند.",
                },
              },
            ].map(({ q, a }) => (
              <div key={q.en}>
                <dt className="font-medium">{L === "fa" ? q.fa : q.en}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {L === "fa" ? a.fa : a.en}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Cross-links: the other pages, which is also how these rank */}
      <section className="mx-auto max-w-[1200px] px-6 py-16">
        <h2 className="text-sm tracking-[0.2em] text-[var(--text-tertiary)] uppercase">
          {L === "fa" ? "بقیه خدمات" : "Other services"}
        </h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {OFFERS.filter((o) => o.slug !== offer.slug).map((o) => (
            <Link
              key={o.slug}
              to="/buy/$slug"
              params={{ slug: o.slug }}
              className="rounded-md border border-[var(--border-subtle)] px-3.5 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--text-primary)]"
            >
              {L === "fa" ? o.noun.fa : o.noun.en}
            </Link>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-10 text-center">
          <h3 className="text-2xl font-medium tracking-tight">
            {L === "fa" ? "آماده شروع؟" : "Ready to order?"}
          </h3>
          <p className="mt-2 text-[var(--text-secondary)]">
            {L === "fa"
              ? "حساب بسازید، از ۵ دلار شارژ کنید، سفارش دهید."
              : "Create an account, top up from $5, place the order."}
          </p>
          <Link
            to="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-[var(--accent)] px-6 py-3 text-sm font-medium text-[var(--accent-foreground)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            <Check className="h-4 w-4" aria-hidden="true" />
            {L === "fa" ? "ساخت حساب" : "Create an account"}
          </Link>
        </div>
      </section>
    </div>
  );
}

export { OFFERS };
