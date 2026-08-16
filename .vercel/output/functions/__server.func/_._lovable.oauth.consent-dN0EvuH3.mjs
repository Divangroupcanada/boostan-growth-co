import { j as jsxRuntimeExports } from "./_libs/react.mjs";
const SplitErrorComponent = ({
  error
}) => /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "grid min-h-screen place-items-center bg-background px-6 text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-foreground-muted", children: [
  "Could not load this authorization request: ",
  String(error?.message ?? error)
] }) });
export {
  SplitErrorComponent as errorComponent
};
