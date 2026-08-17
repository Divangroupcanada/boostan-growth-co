import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Boostan" },
      {
        name: "description",
        content: "How Boostan collects, uses, and protects your information.",
      },
      { property: "og:title", content: "Privacy Policy — Boostan" },
      {
        property: "og:description",
        content: "How Boostan collects, uses, and protects your information.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" updated="May 11, 2026">
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy describes how Boostan ("we", "us", "our"), operated by Shahab Balamchi
        in Ontario, Canada, collects, uses, and protects information when you use the Service.
      </p>

      <h2>2. Information We Collect</h2>
      <h3>Account Information</h3>
      <ul>
        <li>Email address (required for account creation)</li>
        <li>Encrypted password (hashed via Supabase Auth, never stored in plain text)</li>
        <li>Account balance and transaction history</li>
      </ul>

      <h3>Order Information</h3>
      <ul>
        <li>Target URLs or usernames you provide for each order</li>
        <li>Order quantities and services selected</li>
        <li>Order status and history</li>
      </ul>

      <h3>Payment Information</h3>
      <ul>
        <li>
          Cryptocurrency wallet addresses used for deposits (visible on public blockchains, not
          personally identifying)
        </li>
        <li>E-transfer transaction references (when applicable)</li>
        <li>Payment timestamps and amounts</li>
        <li>
          <strong>We do not store credit card numbers</strong> — payments are processed through
          NOWPayments and other third parties
        </li>
      </ul>

      <h3>Technical Information</h3>
      <ul>
        <li>IP addresses (for security and fraud prevention)</li>
        <li>Browser and device information</li>
        <li>Cookies and similar technologies for authentication and analytics</li>
      </ul>

      <h2>3. How We Use Your Information</h2>
      <p>We use collected information to:</p>
      <ul>
        <li>Provide and improve the Service</li>
        <li>Process orders and forward them to upstream providers</li>
        <li>Communicate with you about your account, orders, or service updates</li>
        <li>Detect and prevent fraud or abuse</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>4. Information Sharing</h2>
      <p>We share information with:</p>
      <ul>
        <li>
          <strong>Upstream service providers</strong> — we forward target URLs/usernames to fulfill
          orders. Names like SMMFLW handle the actual engagement delivery.
        </li>
        <li>
          <strong>Payment processors</strong> — NOWPayments and similar providers receive necessary
          transaction details
        </li>
        <li>
          <strong>Cloud infrastructure providers</strong> — Supabase, Vercel, and similar platforms
          host the Service and may access data as part of their services
        </li>
        <li>
          <strong>Legal authorities</strong> — when required by valid legal process
        </li>
      </ul>
      <p>We do NOT:</p>
      <ul>
        <li>Sell your personal information</li>
        <li>Share data with advertisers</li>
        <li>Use your data for purposes outside service delivery</li>
      </ul>

      <h2>5. Data Retention</h2>
      <ul>
        <li>
          Account and order data: retained for the life of the account plus 7 years for tax and
          audit purposes
        </li>
        <li>Webhook logs and security events: retained for 90 days</li>
        <li>Inactive accounts (no activity for 24 months) may be archived or deleted</li>
      </ul>
      <p>
        You may request account deletion by emailing{" "}
        <a href="mailto:hello@boostan.co">hello@boostan.co</a>. Some information may be retained for
        legal compliance.
      </p>

      <h2>6. Security</h2>
      <p>We implement industry-standard security:</p>
      <ul>
        <li>HTTPS encryption for all connections</li>
        <li>Encrypted password storage</li>
        <li>Role-based access control to internal systems</li>
        <li>HMAC signature verification on webhook callbacks</li>
        <li>Regular security audits</li>
      </ul>
      <p>
        No system is 100% secure. You agree to use the Service with awareness of inherent online
        risks.
      </p>

      <h2>7. Your Rights</h2>
      <p>Depending on your jurisdiction, you may have the right to:</p>
      <ul>
        <li>Access the personal information we hold about you</li>
        <li>Request correction of inaccurate information</li>
        <li>Request deletion of your data (subject to retention requirements)</li>
        <li>Withdraw consent for non-essential processing</li>
        <li>File a complaint with your local data protection authority</li>
      </ul>
      <p>
        To exercise these rights, contact <a href="mailto:hello@boostan.co">hello@boostan.co</a>.
      </p>

      <h2>8. Cookies</h2>
      <p>We use cookies for:</p>
      <ul>
        <li>Authentication (keeping you logged in)</li>
        <li>Security (CSRF protection)</li>
        <li>Optional analytics (only if you consent)</li>
      </ul>
      <p>
        You can disable cookies in your browser, but the Service may not function correctly without
        them.
      </p>

      <h2>9. International Data Transfers</h2>
      <p>
        Boostan operates from Ontario, Canada. By using the Service, you consent to your data being
        transferred to and processed in Canada and other jurisdictions where our infrastructure
        providers operate.
      </p>

      <h2>10. Children</h2>
      <p>
        Boostan is not intended for users under 18. We do not knowingly collect information from
        minors. If you believe a minor has used the Service, contact{" "}
        <a href="mailto:hello@boostan.co">hello@boostan.co</a> for immediate account removal.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy. Material changes will be communicated to active users via
        the registered email address.
      </p>

      <h2>12. Contact</h2>
      <p>
        Privacy questions: <a href="mailto:hello@boostan.co">hello@boostan.co</a>
      </p>
    </LegalLayout>
  );
}
