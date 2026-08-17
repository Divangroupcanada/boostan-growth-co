import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/legal-layout";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — Boostan" },
      { name: "description", content: "When and how Boostan issues refunds." },
      { property: "og:title", content: "Refund Policy — Boostan" },
      { property: "og:description", content: "When and how Boostan issues refunds." },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalLayout title="Refund Policy" updated="May 11, 2026">
      <h2>Overview</h2>
      <p>
        Boostan operates as a prepaid platform. Wallet deposits are converted to platform balance,
        which is used to place orders with upstream providers. This policy explains when refunds are
        issued.
      </p>

      <h2>Wallet Deposits</h2>
      <p>
        <strong>Wallet deposits are non-refundable to the original payment method.</strong> This
        applies to:
      </p>
      <ul>
        <li>Cryptocurrency deposits (USDT, BTC, ETH, etc.)</li>
        <li>Interac e-transfer deposits</li>
        <li>Any other deposit method</li>
      </ul>
      <p>
        Once funds are credited to your platform balance, they are usable for any service on Boostan
        but cannot be converted back to your original payment method.
      </p>

      <h2>Orders That Cannot Be Refunded</h2>
      <p>
        The following situations do <strong>not</strong> qualify for refunds:
      </p>
      <ul>
        <li>Orders that completed successfully as ordered</li>
        <li>Orders that delivered 80% or more of the requested quantity</li>
        <li>
          Orders affected by third-party platform actions (Instagram, TikTok, YouTube removing
          engagement)
        </li>
        <li>Orders where the User provided an incorrect target URL or username</li>
        <li>Orders where the target account was private, deleted, or unreachable</li>
        <li>Orders for services that are time-bound (e.g., live stream views)</li>
      </ul>

      <h2>Orders That Qualify for Refunds (as wallet credit)</h2>
      <p>
        The following situations qualify for <strong>wallet credit refunds</strong> (not original
        payment method):
      </p>
      <ul>
        <li>Orders that failed entirely (0% delivered)</li>
        <li>
          Orders that delivered less than 80% of the requested quantity, refunded proportionally
        </li>
        <li>Duplicate orders accidentally placed within 5 minutes</li>
        <li>Service unavailable after order placement (rare, but possible)</li>
      </ul>
      <p>
        Refunds are processed within 48 hours of verification and credited to your platform wallet.
      </p>

      <h2>How to Request a Refund</h2>
      <p>
        Email <a href="mailto:hello@boostan.co">hello@boostan.co</a> within 14 days of the order
        with:
      </p>
      <ul>
        <li>Your account email</li>
        <li>The order ID</li>
        <li>A description of the issue</li>
        <li>Screenshots if available (e.g., delivery shortfall on the target page)</li>
      </ul>
      <p>
        We review each request individually. Approved refunds are credited as wallet balance. We may
        request additional verification.
      </p>

      <h2>Refunds for Service Errors</h2>
      <p>
        If we determine that an error originated on our side (e.g., billing mistake, duplicate
        charge from our system), we will:
      </p>
      <ul>
        <li>Refund the affected amount as wallet credit, AND</li>
        <li>
          If the User specifically requests it within 7 days, refund to original payment method
          (where the payment processor supports refunds)
        </li>
      </ul>

      <h2>Chargebacks</h2>
      <p>
        Filing a chargeback or dispute without first contacting us at{" "}
        <a href="mailto:hello@boostan.co">hello@boostan.co</a> will result in:
      </p>
      <ul>
        <li>Immediate account suspension</li>
        <li>Forfeiture of any remaining wallet balance</li>
        <li>Permanent ban from the Service</li>
      </ul>
      <p>Please reach out to us first — we resolve nearly all issues amicably.</p>

      <h2>Contact</h2>
      <p>
        Refund requests: <a href="mailto:hello@boostan.co">hello@boostan.co</a>
      </p>
    </LegalLayout>
  );
}
