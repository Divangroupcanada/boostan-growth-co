import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Boostan" },
      { name: "description", content: "Boostan is a premium social media engagement platform built in Toronto." },
      { property: "og:title", content: "About — Boostan" },
      { property: "og:description", content: "Boostan is a premium social media engagement platform built in Toronto." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <LegalLayout title="About Boostan">
      <p style={{ fontSize: 20, color: "var(--text-primary)", marginTop: 0 }}>
        Where social presence grows.
      </p>
      <p>
        Boostan is a premium social media engagement platform built for serious creators, agencies,
        and businesses who care about quality.
      </p>

      <h2>Why we exist</h2>
      <p>
        The social media engagement industry is full of low-cost, low-quality providers. Cheap
        panels deliver bot traffic, disappear when accounts get flagged, and treat customer support
        as an afterthought.
      </p>
      <p>
        We saw a different opportunity: a platform that prioritizes premium upstream providers,
        transparent pricing, and customer experience that actually feels professional.
      </p>

      <h2>What we do</h2>
      <p>
        We provide curated engagement services across Instagram, TikTok, and YouTube — currently
        143 services across followers, likes, views, comments, and more. Each service is
        hand-selected from premium upstream providers for quality and reliability.
      </p>
      <p>
        We mark up wholesale rates by 50% plus a flat $1 per 1,000 to cover platform costs, payment
        processing, and ongoing operations. That's it. No hidden fees, no surprise charges.
      </p>

      <h2>Who we are</h2>
      <p>
        Boostan is founded and operated by Shahab Balamchi, a Toronto-based marketing professional
        with experience running social media for clinics, restaurants, real estate offices, and
        creative brands across Toronto, Montreal, Dubai, and Los Angeles.
      </p>
      <p>
        The platform was built in-house using modern infrastructure (Supabase, Vercel,
        NOWPayments) with an emphasis on security, transparency, and reliability.
      </p>

      <h2>What we're not</h2>
      <ul>
        <li>We're not Instagram, TikTok, or YouTube — we're not affiliated with these platforms</li>
        <li>We're not a bot farm — engagement comes from upstream providers using real-looking accounts and ethical delivery patterns</li>
        <li>We're not the cheapest option — we choose quality over rock-bottom pricing</li>
        <li>We're not a get-rich-quick scheme — buying engagement is one tool among many, not a substitute for great content</li>
      </ul>

      <h2>Trust signals</h2>
      <p>
        We're new (launched in 2026), and we know that means earning your trust takes time. We
        commit to:
      </p>
      <ul>
        <li>Transparent pricing on every service</li>
        <li>Clear, honest refund policies</li>
        <li>
          Responsive customer support via{" "}
          <a href="mailto:hello@boostan.co">hello@boostan.co</a>
        </li>
        <li>Continuously improving service quality and platform reliability</li>
      </ul>

      <h2>Get in touch</h2>
      <p>
        For questions, support, or partnership inquiries:{" "}
        <a href="mailto:hello@boostan.co">hello@boostan.co</a>
      </p>

      <p style={{ marginTop: 32, color: "var(--text-tertiary)", fontSize: 14 }}>
        Made in Toronto · بوستان · 2026
      </p>
    </LegalLayout>
  );
}
