import { c as createLucideIcon, j as jsxRuntimeExports, f as cn } from "./index-MOBRw3I1.js";
import { T as TrendingUp } from "./trending-up-Fd9OcFRM.js";
import { T as TrendingDown } from "./trending-down-C_req-kV.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["path", { d: "M5 12h14", key: "1ays0h" }]];
const Minus = createLucideIcon("minus", __iconNode);
function StatCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  iconColor,
  className,
  onClick
}) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-[#22c55e]" : trend === "down" ? "text-[#ef4444]" : "text-muted-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onClick,
      onKeyDown: onClick ? (e) => e.key === "Enter" && onClick() : void 0,
      className: cn(
        "bg-card border border-border rounded-sm p-3 flex flex-col gap-2 transition-smooth",
        onClick && "cursor-pointer hover:border-primary/40",
        className
      ),
      "data-ocid": "stat-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium", children: label }),
          Icon && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Icon,
            {
              className: cn("h-4 w-4", iconColor ?? "text-muted-foreground")
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-bold text-foreground font-display leading-none", children: value }),
          trend && trendValue && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "flex items-center gap-0.5 text-xs font-medium mb-0.5",
                trendColor
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendIcon, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: trendValue })
              ]
            }
          )
        ] })
      ]
    }
  );
}
export {
  StatCard as S
};
