import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { f as CodeXml, r as Copy } from "../_libs/lucide-react.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
function ApiKeysPage() {
  const apiKey = "bstn_live_demo_3h81f0sjzkzx8w";
  const endpoint = "https://api.boostan.io/v2";
  const copy = (s) => {
    navigator.clipboard.writeText(s);
    toast.success("Copied to clipboard");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-[0.2em] text-foreground-subtle", children: "Developers" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-1 text-3xl md:text-4xl", children: [
        "API ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "gradient-text", children: "access" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground-muted", children: "Automate your reseller pipeline with our v2 REST API." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wider text-foreground-subtle", children: "Your API key" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-lg bg-[var(--surface)] px-4 py-3 font-mono text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CodeXml, { className: "h-4 w-4 text-foreground-muted" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate", children: apiKey }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copy(apiKey), className: "text-foreground-muted hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-foreground-subtle", children: "Test key — production keys appear after KYC." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm uppercase tracking-wider text-foreground-subtle", children: "Endpoint" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 rounded-lg bg-[var(--surface)] px-4 py-3 font-mono text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1", children: endpoint }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => copy(endpoint), className: "text-foreground-muted hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass overflow-hidden rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-[var(--border)] px-6 py-4 text-sm uppercase tracking-wider text-foreground-subtle", children: "Quick example" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "overflow-x-auto bg-[var(--surface)] p-6 text-xs leading-relaxed text-foreground-muted", children: `curl -X POST ${endpoint}/order \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "service": 1,
    "link": "https://instagram.com/yourhandle",
    "quantity": 1000
  }'` })
    ] })
  ] });
}
export {
  ApiKeysPage as component
};
