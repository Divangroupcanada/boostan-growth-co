import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { b as Route$2, o as oauthApi } from "./_ssr/router-Db83cYJW.mjs";
import "./_libs/sonner.mjs";
import "./_libs/lovable.dev__mcp-js.mjs";
import "./_libs/modelcontextprotocol__sdk.mjs";
import "./_libs/zod-to-json-schema.mjs";
import "./_libs/ajv-formats.mjs";
import { S as Sprout } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/tanstack__react-router.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "./_libs/isbot.mjs";
import "./_ssr/client.server-j8IJ-cKj.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/nowpayments.server-D_G7i1Kn.mjs";
import "./_libs/zod.mjs";
import "./_libs/jose.mjs";
import "./_libs/ajv.mjs";
import "./_libs/fast-deep-equal.mjs";
import "./_libs/json-schema-traverse.mjs";
import "./_libs/fast-uri.mjs";
function Consent() {
  const details = Route$2.useLoaderData();
  const {
    authorization_id
  } = Route$2.useSearch();
  const [busy, setBusy] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  async function decide(approve) {
    setBusy(true);
    setError(null);
    const api = oauthApi();
    const {
      data,
      error: error2
    } = approve ? await api.approveAuthorization(authorization_id) : await api.denyAuthorization(authorization_id);
    if (error2) {
      setBusy(false);
      setError(error2.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }
  const clientName = details?.client?.name ?? "an app";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "grid min-h-screen place-items-center bg-background px-6 text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-4 w-4 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base font-medium", children: "Boostan" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-2xl", children: [
      "Connect ",
      clientName,
      " to your account"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-foreground-muted", children: [
      clientName,
      " will be able to read your Boostan service catalog, wallet balance and orders as you."
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { role: "alert", className: "mt-4 text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => decide(true), className: "flex-1 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm text-white disabled:opacity-60", children: busy ? "Working…" : "Approve" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: busy, onClick: () => decide(false), className: "flex-1 rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-foreground-muted hover:text-foreground disabled:opacity-60", children: "Deny" })
    ] })
  ] }) });
}
export {
  Consent as component
};
