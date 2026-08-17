import { createFileRoute } from "@tanstack/react-router";
import { Code2, Copy } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/api-keys")({
  component: ApiKeysPage,
  head: () => ({ meta: [{ title: "API — Boostan" }] }),
});

function ApiKeysPage() {
  const apiKey = "bstn_live_demo_3h81f0sjzkzx8w";
  const endpoint = "https://api.boostan.io/v2";

  const copy = (s: string) => {
    navigator.clipboard.writeText(s);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.2em] text-foreground-subtle">Developers</p>
        <h1 className="mt-1 text-3xl md:text-4xl">
          API <span className="gradient-text">access</span>
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          Automate your reseller pipeline with our v2 REST API.
        </p>
      </header>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm uppercase tracking-wider text-foreground-subtle">Your API key</h2>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--surface)] px-4 py-3 font-mono text-sm">
          <Code2 className="h-4 w-4 text-foreground-muted" />
          <span className="flex-1 truncate">{apiKey}</span>
          <button
            onClick={() => copy(apiKey)}
            className="text-foreground-muted hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-xs text-foreground-subtle">
          Test key — production keys appear after KYC.
        </p>
      </div>

      <div className="glass rounded-2xl p-6">
        <h2 className="text-sm uppercase tracking-wider text-foreground-subtle">Endpoint</h2>
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--surface)] px-4 py-3 font-mono text-sm">
          <span className="flex-1">{endpoint}</span>
          <button
            onClick={() => copy(endpoint)}
            className="text-foreground-muted hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <div className="border-b border-[var(--border)] px-6 py-4 text-sm uppercase tracking-wider text-foreground-subtle">
          Quick example
        </div>
        <pre className="overflow-x-auto bg-[var(--surface)] p-6 text-xs leading-relaxed text-foreground-muted">
          {`curl -X POST ${endpoint}/order \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": 1,
    "link": "https://instagram.com/yourhandle",
    "quantity": 1000
  }'`}
        </pre>
      </div>
    </div>
  );
}
