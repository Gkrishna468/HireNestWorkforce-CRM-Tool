import { j as jsxRuntimeExports, f as cn } from "./index-BcyE0PSW.js";
function PageHeader({
  title,
  subtitle,
  actions,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-start justify-between gap-4 px-4 py-4 border-b border-border bg-card",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground font-display leading-tight", children: title }),
          subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-snug", children: subtitle })
        ] }),
        actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 flex-shrink-0", children: actions })
      ]
    }
  );
}
export {
  PageHeader as P
};
