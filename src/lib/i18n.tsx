import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Bilingual layer (English / Farsi) with RTL.
 *
 * Deliberately dependency-free: the site has two locales and a few hundred
 * strings, so a full i18n library would cost more than it saves. Strings live
 * in one dictionary keyed by locale; `t()` falls back to English if a Farsi
 * string is missing so the page never renders a raw key.
 */

export type Locale = "en" | "fa";

export const LOCALES: { code: Locale; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "fa", label: "فارسی", dir: "rtl" },
];

const STORAGE_KEY = "boostan:locale";

type Dict = Record<string, string>;

// ---------------------------------------------------------------------------
// Strings. Farsi is written for a Persian-speaking buyer, not translated
// word-for-word from the English — the register and the objections differ.
// ---------------------------------------------------------------------------

const en: Dict = {
  "nav.services": "Services",
  "nav.pricing": "Pricing",
  "nav.how": "How it works",
  "nav.faq": "FAQ",
  "nav.signin": "Sign in",
  "nav.start": "Get started",
  "nav.dashboard": "Dashboard",

  "hero.eyebrow": "Instagram · TikTok · YouTube",
  "hero.title": "Growth, tended.",
  "hero.lede":
    "Boostan means orchard. We treat an account the way you'd treat one: steady delivery, honest pricing, and no dumping ten thousand followers overnight for the algorithm to notice.",
  "hero.cta": "Create an account",
  "hero.cta.secondary": "See prices",
  "hero.note": "Crypto or Interac e-transfer · Start from $5",

  "stat.services": "services",
  "stat.platforms": "platforms",
  "stat.start": "typical start",
  "stat.start.value": "under an hour",
  "stat.refund": "auto-refund",
  "stat.refund.value": "if undelivered",

  "trust.pricing": "Prices shown before you sign up",
  "trust.refund": "Undelivered orders refund automatically",
  "trust.crypto": "Crypto and e-transfer — no card details stored",

  "services.eyebrow": "Catalog",
  "services.title": "Pick a platform.",
  "services.sub":
    "Live prices, straight from the catalog. Rates are per 1,000 and already include our fee — what you see is what you're charged.",
  "services.viewall": "View all {n} {platform} services",
  "services.from": "from",
  "services.per": "per 1,000",

  "how.eyebrow": "Process",
  "how.title": "Four steps. No sales call.",
  "how.1.t": "Create an account",
  "how.1.d": "Email and a password. No verification queue, no documents.",
  "how.2.t": "Add funds",
  "how.2.d": "Crypto (USDT and others) or Interac e-transfer in Canada.",
  "how.3.t": "Place the order",
  "how.3.d": "Paste the link, choose a quantity, confirm the price shown.",
  "how.4.t": "Watch it run",
  "how.4.d": "Status updates every 15 minutes. Anything undelivered comes back to your balance.",

  "faq.eyebrow": "Questions",
  "faq.title": "The things people actually ask.",

  "footer.tagline": "Social growth, tended carefully.",
  "footer.legal": "Legal",
  "footer.product": "Product",
  "footer.rights": "All rights reserved.",

  "lang.switch": "Language",
};

const fa: Dict = {
  "nav.services": "خدمات",
  "nav.pricing": "قیمت‌ها",
  "nav.how": "چطور کار می‌کند",
  "nav.faq": "سوالات",
  "nav.signin": "ورود",
  "nav.start": "شروع کنید",
  "nav.dashboard": "داشبورد",

  "hero.eyebrow": "اینستاگرام · تیک‌تاک · یوتیوب",
  "hero.title": "رشد، با حوصله.",
  "hero.lede":
    "بوستان یعنی باغ. با پیج شما هم مثل باغ رفتار می‌کنیم: تحویل پیوسته، قیمت شفاف، و بدون ریختن ده‌هزار فالوور یک‌شبه که الگوریتم را حساس کند.",
  "hero.cta": "ساخت حساب کاربری",
  "hero.cta.secondary": "دیدن قیمت‌ها",
  "hero.note": "پرداخت با ارز دیجیتال · شروع از ۵ دلار",

  "stat.services": "سرویس",
  "stat.platforms": "پلتفرم",
  "stat.start": "شروع معمول",
  "stat.start.value": "کمتر از یک ساعت",
  "stat.refund": "بازگشت خودکار",
  "stat.refund.value": "در صورت عدم تحویل",

  "trust.pricing": "قیمت‌ها را قبل از ثبت‌نام می‌بینید",
  "trust.refund": "سفارش تحویل‌نشده خودکار برگشت می‌خورد",
  "trust.crypto": "ارز دیجیتال — بدون ذخیره اطلاعات کارت",

  "services.eyebrow": "فهرست خدمات",
  "services.title": "پلتفرم را انتخاب کنید.",
  "services.sub":
    "قیمت‌های زنده، مستقیم از فهرست. نرخ‌ها به ازای هر ۱۰۰۰ و شامل کارمزد ماست — همان چیزی که می‌بینید پرداخت می‌کنید.",
  "services.viewall": "دیدن همه {n} سرویس {platform}",
  "services.from": "از",
  "services.per": "هر ۱۰۰۰",

  "how.eyebrow": "مراحل",
  "how.title": "چهار قدم. بدون تماس فروش.",
  "how.1.t": "حساب بسازید",
  "how.1.d": "ایمیل و رمز عبور. بدون صف تایید، بدون مدرک.",
  "how.2.t": "شارژ کنید",
  "how.2.d": "ارز دیجیتال (USDT و بقیه) یا ای‌ترنسفر در کانادا.",
  "how.3.t": "سفارش بدهید",
  "how.3.d": "لینک را بگذارید، تعداد را انتخاب کنید، قیمت را تایید کنید.",
  "how.4.t": "دنبالش کنید",
  "how.4.d": "وضعیت هر ۱۵ دقیقه به‌روز می‌شود. هرچه تحویل نشود به موجودی شما برمی‌گردد.",

  "faq.eyebrow": "سوالات",
  "faq.title": "چیزهایی که واقعاً می‌پرسند.",

  "footer.tagline": "رشد شبکه‌های اجتماعی، با دقت.",
  "footer.legal": "قوانین",
  "footer.product": "محصول",
  "footer.rights": "تمام حقوق محفوظ است.",

  "lang.switch": "زبان",
};

const DICTS: Record<Locale, Dict> = { en, fa };

type I18nValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (l: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start at "en" so server and first client render agree; the stored
  // preference is applied in an effect to avoid a hydration mismatch.
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === "en" || saved === "fa") {
        setLocaleState(saved);
        return;
      }
      // No stored choice: offer Farsi to Persian-language browsers.
      if (navigator.language?.toLowerCase().startsWith("fa")) {
        setLocaleState("fa");
      }
    } catch {
      // storage unavailable (SSR / private mode) — keep the default
    }
  }, []);

  const dir = locale === "fa" ? "rtl" : "ltr";

  useEffect(() => {
    const el = document.documentElement;
    el.lang = locale;
    el.dir = dir;
    el.classList.toggle("font-fa", locale === "fa");
  }, [locale, dir]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // non-fatal: the choice just won't persist
    }
  };

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      dir,
      setLocale,
      t: (key, vars) => {
        const raw = DICTS[locale][key] ?? DICTS.en[key] ?? key;
        if (!vars) return raw;
        return Object.entries(vars).reduce(
          (out, [k, v]) => out.replace(new RegExp(`\\{${k}\\}`, "g"), String(v)),
          raw,
        );
      },
    }),
    [locale, dir],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Rendering outside the provider shouldn't crash a page — fall back to English.
    return {
      locale: "en",
      dir: "ltr",
      setLocale: () => {},
      t: (key: string) => en[key] ?? key,
    };
  }
  return ctx;
}

/** Persian digits, for prices and counts when the locale is Farsi. */
export function localizeDigits(input: string | number, locale: Locale): string {
  const s = String(input);
  if (locale !== "fa") return s;
  const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return s.replace(/\d/g, (d) => faDigits[Number(d)]);
}
