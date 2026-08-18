import { createFileRoute } from "@tanstack/react-router";
import { BUSINESS } from "@/lib/business";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Boostan" },
      { name: "description", content: "The terms governing your use of Boostan." },
      { property: "og:title", content: "Terms of Service — Boostan" },
      { property: "og:description", content: "The terms governing your use of Boostan." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="May 11, 2026">
      <h2>1. Agreement to Terms</h2>
      <p>
        By accessing or using Boostan ("the Service"), operated by {BUSINESS.legalName} as a sole
        proprietor based in Ontario, Canada ("we", "us", "our"), you ("the User") agree to be bound
        by these Terms of Service. If you do not agree, do not use the Service.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Boostan provides social media engagement services for Instagram, TikTok, and YouTube,
        sourced from third-party upstream providers. Services include but are not limited to
        followers, likes, views, comments, and similar engagement metrics. The Service operates as a
        software platform connecting Users with these upstream providers.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least 18 years old to use the Service. By using Boostan, you represent and
        warrant that you meet this age requirement and have full legal capacity to enter into these
        Terms.
      </p>

      <h2>4. Account Registration</h2>
      <p>
        To purchase services, you must create an account with a valid email address. You are
        responsible for:
      </p>
      <ul>
        <li>Maintaining the confidentiality of your account credentials</li>
        <li>All activity that occurs under your account</li>
        <li>Notifying us immediately of any unauthorized access</li>
      </ul>
      <p>
        We reserve the right to suspend or terminate accounts that violate these Terms, engage in
        fraudulent activity, or attempt to abuse the Service.
      </p>

      <h2>5. Wallet and Deposits</h2>
      <p>
        Boostan operates on a prepaid wallet system. Users deposit funds in advance and use those
        funds to place orders.
      </p>
      <ul>
        <li>Minimum deposit: $5 USD or equivalent</li>
        <li>
          Accepted methods: Cryptocurrency (USDT-TRC20 and others via NOWPayments), Interac
          e-transfer (Canada)
        </li>
        <li>
          Deposits are credited as platform balance after on-chain confirmation or manual
          verification
        </li>
        <li>
          Platform balance is <strong>non-refundable to original payment method</strong> but may be
          used for any service available on the platform
        </li>
      </ul>

      <h2>6. Order Placement and Fulfillment</h2>
      <p>When you place an order:</p>
      <ul>
        <li>
          The order quantity is reserved from your wallet balance at the displayed marked-up rate
        </li>
        <li>Orders are forwarded to upstream providers for fulfillment</li>
        <li>Most orders begin processing within 60 seconds</li>
        <li>Estimated completion times vary by service and quantity</li>
      </ul>
      <p>You agree that:</p>
      <ul>
        <li>You are responsible for the accuracy of the target URL or username provided</li>
        <li>You have the authority to request engagement on the account/content provided</li>
        <li>
          Orders cannot be cancelled once they have started processing with the upstream provider
        </li>
      </ul>

      <h2>7. Service Limitations and Disclaimers</h2>
      <ul>
        <li>We do not guarantee specific outcomes (algorithm boosts, page rankings, etc.)</li>
        <li>Delivery speed and quality depend on upstream provider availability</li>
        <li>
          Social media platforms (Instagram, TikTok, YouTube) may at their discretion remove
          engagement, suspend accounts, or take other actions outside our control
        </li>
        <li>
          We are not affiliated with, endorsed by, or sponsored by Instagram, TikTok, YouTube, or
          their parent companies
        </li>
      </ul>

      <h2>8. Prohibited Uses</h2>
      <p>You agree NOT to use Boostan to:</p>
      <ul>
        <li>Target accounts or content depicting minors</li>
        <li>Target accounts engaged in illegal activity</li>
        <li>Engage in harassment, hate speech, or coordinated inauthentic behavior</li>
        <li>Violate the terms of service of Instagram, TikTok, YouTube, or any third party</li>
        <li>Resell or redistribute Boostan services without explicit written authorization</li>
        <li>Use the Service for any activity that violates applicable law in your jurisdiction</li>
      </ul>
      <p>
        We reserve the right to refuse service, refund deposits, and terminate accounts that violate
        these prohibitions.
      </p>

      <h2>9. Intellectual Property</h2>
      <p>
        All content on Boostan (excluding User-provided content like target URLs) is the property of
        {BUSINESS.legalName} or its licensors and protected under applicable intellectual property
        law. You may not copy, reproduce, or use Boostan branding, design, or content without
        permission.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, {BUSINESS.brand}, {BUSINESS.legalName}, and any
        affiliates are not liable for:
      </p>
      <ul>
        <li>Indirect, incidental, special, or consequential damages</li>
        <li>Loss of profits, data, or social media account standing</li>
        <li>Actions taken by Instagram, TikTok, YouTube, or other third parties</li>
        <li>
          Service interruptions caused by upstream provider issues, payment processor downtime, or
          force majeure events
        </li>
      </ul>
      <p>
        Total liability for any claim is limited to the amount the User has deposited in their
        wallet in the preceding 30 days, capped at $500 USD.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless {BUSINESS.brand}, {BUSINESS.legalName}, and
        affiliates from any claims, damages, or expenses arising from your use of the Service or
        violation of these Terms.
      </p>

      <h2>12. Changes to Terms</h2>
      <p>
        We may update these Terms periodically. The "Last updated" date will reflect changes.
        Continued use of the Service after changes constitutes acceptance of the updated Terms.
        Material changes will be communicated via the email address on file.
      </p>

      <h2>13. Governing Law and Dispute Resolution</h2>
      <p>
        These Terms are governed by the laws of the Province of Ontario, Canada. Any disputes shall
        be resolved through:
      </p>
      <ul>
        <li>Good-faith negotiation as the first step</li>
        <li>Mediation if negotiation fails</li>
        <li>Binding arbitration in Ontario, Canada, as the final resolution</li>
      </ul>
      <p>You waive the right to participate in class actions related to the Service.</p>

      <h2>14. Contact</h2>
      <p>
        Questions about these Terms: <a href="mailto:hello@boostan.co">hello@boostan.co</a>
      </p>
    </LegalLayout>
  );
}
