import { j as jsxRuntimeExports, g as Button, f as cn } from "./index-MOBRw3I1.js";
function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      ),
      "data-ocid": "empty-state",
      children: [
        Icon && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-6 w-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground mb-1 font-display", children: title }),
        message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs leading-relaxed mb-4", children: message }),
        action && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: action.onClick, "data-ocid": "empty-state-cta", children: action.label })
      ]
    }
  );
}
export {
  EmptyState as E
};
