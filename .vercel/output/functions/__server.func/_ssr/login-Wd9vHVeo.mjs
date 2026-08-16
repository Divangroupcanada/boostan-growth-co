import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useAuth } from "./router-Db83cYJW.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/lovable.dev__mcp-js.mjs";
import "../_libs/modelcontextprotocol__sdk.mjs";
import "../_libs/zod-to-json-schema.mjs";
import "../_libs/ajv-formats.mjs";
import { S as Sprout, A as ArrowRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "async_hooks";
import "stream";
import "crypto";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client.server-j8IJ-cKj.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./nowpayments.server-D_G7i1Kn.mjs";
import "../_libs/zod.mjs";
import "../_libs/jose.mjs";
import "../_libs/ajv.mjs";
import "../_libs/fast-deep-equal.mjs";
import "../_libs/json-schema-traverse.mjs";
import "../_libs/fast-uri.mjs";
function LoginPage() {
  const {
    signIn
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const {
      error
    } = await signIn(email, password);
    setLoading(false);
    if (error) return toast.error(error);
    toast.success("Welcome back");
    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const redirect = params.get("redirect");
    if (redirect && redirect.startsWith("/")) {
      window.location.href = redirect;
    } else {
      navigate({
        to: "/dashboard"
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-orb animate-float-slow", style: {
      top: -160,
      left: -120,
      background: "var(--primary)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glow-orb animate-float-med", style: {
      bottom: -160,
      right: -120,
      background: "var(--primary-glow)",
      opacity: 0.35
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "mb-10 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "grid h-9 w-9 place-items-center rounded-lg gradient-bg shadow-glow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sprout, { className: "h-4 w-4 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-medium", children: "Boostan" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass w-full rounded-2xl p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "Welcome back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-foreground-muted", children: "Sign in to your panel." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "mt-7 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", type: "email", value: email, onChange: setEmail, placeholder: "you@email.com" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Password", type: "password", value: password, onChange: setPassword, placeholder: "••••••••" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "btn-gradient mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm disabled:opacity-60", children: loading ? "Signing in…" : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            "Sign in ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-4 w-4" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-foreground-muted", children: [
          "New to Boostan?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/signup", className: "text-foreground hover:underline", children: "Create account" })
        ] })
      ] })
    ] })
  ] });
}
function Field({
  label,
  type,
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mb-1.5 block text-xs text-foreground-muted", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type, value, onChange: (e) => onChange(e.target.value), placeholder, className: "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm outline-none transition focus:border-[var(--border-strong)] focus:ring-2 focus:ring-[var(--primary-glow)]/30" })
  ] });
}
export {
  LoginPage as component
};
