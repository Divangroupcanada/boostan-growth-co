import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-[720px] px-6 pt-24 pb-16">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Boostan
        </Link>

        <h1 className="mt-10 text-[40px] font-medium leading-tight tracking-[-0.02em]">{title}</h1>
        {updated && (
          <p className="mt-3 text-sm italic text-[var(--text-tertiary)]">Last updated: {updated}</p>
        )}

        <div className="legal-prose mt-12">{children}</div>

        <div className="mt-16 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-1)] p-5 text-sm text-[var(--text-secondary)]">
          Have questions? Email{" "}
          <a href="mailto:hello@boostan.co" className="text-[var(--accent)] hover:underline">
            hello@boostan.co
          </a>
        </div>
      </div>

      <style>{`
        .legal-prose { color: var(--text-secondary); font-size: 16px; line-height: 1.6; }
        .legal-prose h2 { font-size: 24px; font-weight: 500; color: var(--text-primary); margin-top: 48px; margin-bottom: 16px; letter-spacing: -0.01em; }
        .legal-prose h3 { font-size: 18px; font-weight: 500; color: var(--text-primary); margin-top: 32px; margin-bottom: 12px; }
        .legal-prose p { margin-top: 16px; }
        .legal-prose ul { padding-left: 20px; margin-top: 12px; list-style: disc; }
        .legal-prose li { margin-top: 6px; }
        .legal-prose a { color: var(--accent); text-decoration: none; }
        .legal-prose a:hover { text-decoration: underline; }
        .legal-prose strong { color: var(--text-primary); font-weight: 500; }
      `}</style>
    </div>
  );
}
