import { j as jsxRuntimeExports, f as cn } from "./index-D6lnvgsb.js";
import { C as Check } from "./check-8IAEo_5Q.js";
function StageProgressBar({
  stages,
  currentStage,
  className,
  compact = false
}) {
  const currentIdx = stages.indexOf(currentStage);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-full", className), "data-ocid": "stage-progress", children: compact ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1", children: stages.map((stage, idx) => {
    const isDone = idx < currentIdx;
    const isCurrent = idx === currentIdx;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-1 flex-1 min-w-0",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-1.5 flex-1 rounded-full transition-smooth",
              isDone && "bg-primary",
              isCurrent && "bg-primary/60",
              !isDone && !isCurrent && "bg-muted"
            ),
            title: stage
          }
        )
      },
      stage
    );
  }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-start gap-0", children: stages.map((stage, idx) => {
    const isDone = idx < currentIdx;
    const isCurrent = idx === currentIdx;
    const isLast = idx === stages.length - 1;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center flex-1 min-w-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-smooth z-10",
                  isDone && "bg-primary border-primary",
                  isCurrent && "bg-primary/20 border-primary",
                  !isDone && !isCurrent && "bg-muted border-border"
                ),
                children: [
                  isDone && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-2.5 w-2.5 text-primary-foreground" }),
                  isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-primary" })
                ]
              }
            ),
            !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "flex-1 h-0.5 transition-smooth",
                  idx < currentIdx ? "bg-primary" : "bg-border"
                )
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: cn(
                "text-[9px] mt-1 text-center leading-tight px-0.5 truncate w-full",
                isCurrent && "text-primary font-semibold",
                isDone && "text-muted-foreground",
                !isDone && !isCurrent && "text-muted-foreground/50"
              ),
              children: stage
            }
          )
        ]
      },
      stage
    );
  }) }) });
}
export {
  StageProgressBar as S
};
