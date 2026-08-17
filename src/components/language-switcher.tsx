import { LOCALES, useI18n } from "@/lib/i18n";

/**
 * Two-locale segmented toggle. With exactly two options a dropdown would add a
 * click for no benefit, so both are always visible and one is always current.
 */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("lang.switch")}
      className={`inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-0.5 ${className}`}
    >
      {LOCALES.map((l) => {
        const active = l.code === locale;
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLocale(l.code)}
            aria-pressed={active}
            lang={l.code}
            className={[
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
              active
                ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            ].join(" ")}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
