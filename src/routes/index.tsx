import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Boostan — Grow your social at the speed of light" },
      { name: "description", content: "The premium SMM panel for serious resellers. Real engagement, instant delivery, automated API. Trusted by agencies worldwide." },
      { property: "og:title", content: "Boostan — Premium SMM Panel" },
      { property: "og:description", content: "Instant delivery, refill guarantee, clean API. Top up $25 and start growing." },
    ],
  }),
  component: Landing,
});
