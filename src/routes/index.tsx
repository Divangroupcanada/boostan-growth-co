import { createFileRoute } from "@tanstack/react-router";
import { Landing } from "@/components/landing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Boostan — Grow your social at the speed of light" },
      { name: "description", content: "The fastest, most reliable SMM panel of 2026. Real engagement, instant delivery, automated API. Trusted by 2,400+ resellers." },
      { property: "og:title", content: "Boostan — Premium SMM Panel" },
      { property: "og:description", content: "Instant delivery, refill guarantee, clean API. Top up $5 and start growing." },
    ],
  }),
  component: Landing,
});
