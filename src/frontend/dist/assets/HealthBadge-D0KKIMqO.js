import { j as jsxRuntimeExports, f as cn } from "./index-D6lnvgsb.js";
function computeHealthStatus(score) {
  if (score >= 70) return "green";
  if (score >= 40) return "yellow";
  return "red";
}
function getHealthColor(status) {
  switch (status) {
    case "green":
      return "text-[#22c55e]";
    case "yellow":
      return "text-[#eab308]";
    case "red":
      return "text-[#ef4444]";
  }
}
function getHealthBgColor(status) {
  switch (status) {
    case "green":
      return "bg-[#22c55e]";
    case "yellow":
      return "bg-[#eab308]";
    case "red":
      return "bg-[#ef4444]";
  }
}
function getHealthLabel(score) {
  if (score >= 70) return "Healthy";
  if (score >= 40) return "At Risk";
  return "Critical";
}
function getRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1e3);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
function HealthBadge({
  status,
  score,
  showLabel = false,
  showScore = false,
  size = "md",
  className
}) {
  const resolvedStatus = status ?? (score != null ? computeHealthStatus(score) : "green");
  const dotSize = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" }[size];
  const textSize = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" }[size];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("inline-flex items-center gap-1.5", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "rounded-full flex-shrink-0",
          dotSize,
          getHealthBgColor(resolvedStatus)
        )
      }
    ),
    (showLabel || showScore) && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: cn(
          "font-medium",
          textSize,
          getHealthColor(resolvedStatus)
        ),
        children: showScore && score != null ? score : getHealthLabel(score ?? 0)
      }
    )
  ] });
}
export {
  HealthBadge as H,
  getRelativeTime as a,
  computeHealthStatus as c,
  getHealthColor as g
};
