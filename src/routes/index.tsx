import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Boostan — Grow your social at the speed of light" },
      {
        name: "description",
        content:
          "The premium SMM panel for serious resellers. Real engagement, instant delivery, automated API. Trusted by agencies worldwide.",
      },
      { property: "og:title", content: "Boostan — Premium SMM Panel" },
      {
        property: "og:description",
        content:
          "Live prices, automatic refunds on undelivered orders. Top up from $5 and start growing.",
      },
    ],
  }),
  component: Landing,
});
