import { j as jsxRuntimeExports, f as cn } from "./index-CpSJjNwR.js";
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base text-foreground shadow-xs",
        "placeholder:text-muted-foreground",
        "transition-colors duration-150 outline-none",
        "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        "field-sizing-content resize-none",
        "md:text-sm",
        className
      ),
      ...props
    }
  );
}
export {
  Textarea as T
};
