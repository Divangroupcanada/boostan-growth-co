import { RefreshCw, Scale, KeyRound, Timer } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/**
 * Guarantees.
 *
 * Every promise here maps to something the system actually does:
 *   - refund_order()          -> full refund when an order fails
 *   - refund_order_partial()  -> refunds the undelivered share
 *   - /api/cron/sync-orders   -> polls the provider every 15 minutes
 *   - the order form only ever asks for a public link, never a password
 *
 * Nothing gets added to this list that isn't enforced in code. Vague promises
 * ("100% real", "instant delivery") are what customers quote back during a
 * chargeback, and they're the reason most panels lose disputes.
 */

const ITEMS = [
  {
    Icon: RefreshCw,
    key: "undelivered",
    en: {
      title: "Undelivered means refunded",
      body: "If the provider rejects or cancels an order, your balance is credited back automatically — not after you email us and wait.",
    },
    fa: {
      title: "تحویل نشد، پول برمی‌گردد",
      body: "اگر سفارش رد یا لغو شود، موجودی شما به‌صورت خودکار برمی‌گردد — نه بعد از ایمیل زدن و منتظر ماندن.",
    },
  },
  {
    Icon: Scale,
    key: "partial",
    en: {
      title: "Partial delivery, partial charge",
      body: "Ordered 1,000 and 400 arrived? You're refunded for the 600 that didn't. We check and settle it ourselves.",
    },
    fa: {
      title: "تحویل ناقص، پرداخت ناقص",
      body: "۱۰۰۰ سفارش دادید و ۴۰۰ رسید؟ پول آن ۶۰۰ تای باقی‌مانده برمی‌گردد. خودمان بررسی و تسویه می‌کنیم.",
    },
  },
  {
    Icon: Timer,
    key: "tracking",
    en: {
      title: "Checked every 15 minutes",
      body: "Order status is polled from the provider automatically, so what you see on your dashboard is current — you never have to chase an update.",
    },
    fa: {
      title: "هر ۱۵ دقیقه بررسی می‌شود",
      body: "وضعیت سفارش به‌صورت خودکار از تامین‌کننده گرفته می‌شود، پس چیزی که در داشبورد می‌بینید به‌روز است.",
    },
  },
  {
    Icon: KeyRound,
    key: "password",
    en: {
      title: "We never ask for your password",
      body: "A public link or username is all we need. Any service that asks you to log in to your social account is one to walk away from.",
    },
    fa: {
      title: "هرگز رمز عبور نمی‌خواهیم",
      body: "فقط لینک عمومی یا نام کاربری لازم است. هر سرویسی که رمز اکانت شما را بخواهد، باید از آن دور شوید.",
    },
  },
] as const;

export function Guarantees() {
  const { locale } = useI18n();
  const L = locale === "fa" ? "fa" : "en";

  return (
    <section id="guarantees" className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
      <div className="mb-3 text-xs tracking-[0.25em] text-[var(--accent)] uppercase">
        {L === "fa" ? "تضمین‌ها" : "Our guarantees"}
      </div>
      <div className="mb-12 max-w-2xl">
        <h2 className="text-3xl tracking-tight md:text-4xl">
          {L === "fa" ? "قول‌هایی که واقعاً اجرا می‌شوند." : "Promises the system actually keeps."}
        </h2>
        <p className="mt-3 text-[var(--text-secondary)]">
          {L === "fa"
            ? "هر مورد زیر در کد پیاده‌سازی شده — نه یک شعار تبلیغاتی."
            : "Each of these is enforced in code, not a marketing line. We'd rather promise less and mean it."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {ITEMS.map(({ Icon, key, en, fa }) => {
          const copy = L === "fa" ? fa : en;
          return (
            <div
              key={key}
              className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-medium text-[var(--text-primary)]">{copy.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {copy.body}
              </p>
            </div>
          );
        })}
      </div>

      {/* Honesty beats a bigger claim: say what we can't control. */}
      <p className="mt-8 max-w-2xl text-sm text-[var(--text-tertiary)]">
        {L === "fa"
          ? "چیزی که تضمین نمی‌کنیم: زمان دقیق شروع. تامین‌کننده بسته به سرویس بین ۱ تا ۷۲ ساعت اعلام می‌کند و ما عدد بهتری وعده نمی‌دهیم."
          : "What we don't promise: an exact start time. Our provider states 1–72 hours depending on the service, and we won't quote you a better number than the one we're actually given."}
      </p>
    </section>
  );
}
