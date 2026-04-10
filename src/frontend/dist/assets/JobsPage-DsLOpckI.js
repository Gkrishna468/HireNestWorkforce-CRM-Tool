import { c as createLucideIcon, Z as useJobs, F as useClients, J as useCreateJob, a0 as useUpdateJob, r as reactExports, j as jsxRuntimeExports, g as Button, m as Briefcase, v as ue, e as Badge, C as ChevronRight, X, a1 as useBenchRecords, a2 as useMatchBench, U as Users, L as Link } from "./index-CnVd8MW_.js";
import { P as PageHeader } from "./PageHeader-BKk5gvYn.js";
import { A as AppModal } from "./AppModal-BrM4mpg_.js";
import { E as EmptyState } from "./EmptyState-CmNTLU16.js";
import { I as Input } from "./input-DXv9OmJk.js";
import { L as Label } from "./label-CxOQDsIN.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CTpFQGlD.js";
import { S as Skeleton } from "./skeleton-Ch7lRtvp.js";
import { T as Textarea } from "./textarea-BJE7beoA.js";
import { P as Plus } from "./plus-BCvyaH4R.js";
import { M as MapPin, D as DollarSign } from "./map-pin-CM5yg54y.js";
import { C as ChevronDown } from "./chevron-down-aSpajVZm.js";
import { R as RefreshCw } from "./refresh-cw-sEDUj3WV.js";
import "./index-B6_QE_l0.js";
import "./index-CjF3KYlN.js";
import "./index-BP5bQcNQ.js";
import "./check-C6LbQk28.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f"
    }
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }]
];
const Linkedin = createLucideIcon("linkedin", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function formatRate(min, max) {
  if (!min && !max) return "—";
  if (min && max) return `$${min}/hr – $${max}/hr`;
  if (min) return `$${min}/hr+`;
  return `Up to $${max}/hr`;
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function getStatusVariant(status) {
  if (status === "open") return "default";
  if (status === "filled") return "secondary";
  return "outline";
}
function getStatusLabel(status) {
  const labels = {
    open: "Open",
    filled: "Filled",
    closed: "Closed",
    on_hold: "On Hold"
  };
  return labels[status] ?? status;
}
function getMatchColor(score) {
  if (score >= 0.7)
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (score >= 0.4) return "bg-amber-500/15 text-amber-400 border-amber-500/30";
  return "bg-red-500/15 text-red-400 border-red-500/30";
}
function buildShareMessage(job) {
  const reqPreview = job.requirements ? job.requirements.slice(0, 200) + (job.requirements.length > 200 ? "…" : "") : "See full details on our website";
  const location = job.location || "Remote/Flexible";
  const rate = job.rateMin && job.rateMax ? `$${job.rateMin}-$${job.rateMax}/hr` : job.rateMin ? `$${job.rateMin}/hr+` : job.rateMax ? `Up to $${job.rateMax}/hr` : "Competitive";
  return `🚀 Job Opening: ${job.title}
📍 Location: ${location}
💼 Requirements: ${reqPreview}
💰 Rate: ${rate}

Interested? Contact us at HireNest Workforce
🌐 app.hirenestworkforce.com`;
}
function WhatsAppIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" })
    }
  );
}
function ShareJobModal({
  job,
  open,
  onClose
}) {
  const message = buildShareMessage(job);
  const jobsUrl = "https://app.hirenestworkforce.com/jobs";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobsUrl)}&title=${encodeURIComponent(job.title)}&summary=${encodeURIComponent(message)}`;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      ue.success("Copied to clipboard!");
    } catch {
      ue.error("Failed to copy. Please copy manually.");
    }
  }
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      open: true,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-transparent p-0 m-0 max-w-none w-full h-full",
      "aria-label": "Share Job Opening",
      "data-ocid": "share-job-modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default",
            "aria-hidden": "true",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display", children: "Share Job Opening" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                "aria-label": "Close modal",
                "data-ocid": "share-modal-close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Sharing" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: job.title })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Message Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "bg-muted/30 border border-border rounded-md px-3 py-2.5 text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed font-mono max-h-40 overflow-y-auto",
                  "data-ocid": "share-message-preview",
                  children: message
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Share Via" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: whatsappUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-[#25D366]/10 border border-[#25D366]/25 text-[#25D366] hover:bg-[#25D366]/20 hover:border-[#25D366]/40 transition-colors",
                    "data-ocid": "share-whatsapp-btn",
                    "aria-label": "Share on WhatsApp",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "WhatsApp" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: linkedinUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-[#0A66C2]/10 border border-[#0A66C2]/25 text-[#0A66C2] hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/40 transition-colors",
                    "data-ocid": "share-linkedin-btn",
                    "aria-label": "Share on LinkedIn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "LinkedIn" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleCopy,
                    className: "flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-muted/40 border border-border text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors",
                    "data-ocid": "share-copy-btn",
                    "aria-label": "Copy message to clipboard",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "Copy" })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function BenchMatchesPanel({ job }) {
  const { data: allBench = [], isLoading: benchLoading } = useBenchRecords();
  const {
    data: matches = [],
    isLoading: matchLoading,
    refetch,
    isFetching
  } = useMatchBench(job.id);
  const isLoading = matchLoading || benchLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-t border-border mt-4 pt-4",
      "data-ocid": "bench-matches-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-foreground uppercase tracking-wider", children: "Bench Matches" }),
            !isLoading && matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "h-4 text-[10px] px-1.5", children: matches.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-6 w-6 p-0",
              onClick: () => refetch(),
              disabled: isFetching,
              "aria-label": "Reload bench matches",
              "data-ocid": "bench-reload-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `h-3 w-3 ${isFetching ? "animate-spin" : ""}`
                }
              )
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded" }, i)) }) : !benchLoading && allBench.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-md border border-border bg-muted/20 px-3 py-4 text-center",
            "data-ocid": "bench-empty-upload",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Upload your vendor bench list to see matching candidates here." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bench", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-7 text-xs", children: "Go to Bench" }) })
            ]
          }
        ) : matches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-md border border-border bg-muted/20 px-3 py-4 text-center",
            "data-ocid": "bench-no-matches",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "No bench matches found for this job. Upload vendor bench candidates in the",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bench", className: "text-primary hover:underline", children: "Bench" }),
              " ",
              "section."
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[56px_1fr_100px_100px_1fr_70px] gap-2 px-3 py-1.5 bg-muted/30 border-b border-border", children: ["Match %", "Candidate", "Vendor", "Role", "Skills", "Rate"].map(
            (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate",
                children: h
              },
              h
            )
          ) }),
          matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(BenchMatchRow, { match: m }, m.id))
        ] })
      ]
    }
  );
}
function BenchMatchRow({ match }) {
  const pct = Math.round(match.matchScore * 100);
  const colorClass = getMatchColor(match.matchScore);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-[56px_1fr_100px_100px_1fr_70px] gap-2 px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition-colors text-xs items-center",
      "data-ocid": "bench-match-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `inline-flex items-center justify-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${colorClass}`,
            children: [
              pct,
              "%"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: match.candidateName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: match.vendorName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: match.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: match.skill }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "$",
          match.rate,
          "/hr"
        ] })
      ]
    }
  );
}
function JobDetailPanel({
  job,
  clients,
  onEdit,
  onClose
}) {
  var _a;
  const [shareOpen, setShareOpen] = reactExports.useState(false);
  const clientName = job.clientName || ((_a = clients.find((c) => c.id === job.clientId)) == null ? void 0 : _a.name) || "Unknown Client";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col h-full overflow-hidden bg-card border-l border-border w-full max-w-[480px]",
        "data-ocid": "job-detail-panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground font-display truncate", children: job.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: clientName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 ml-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 gap-1 text-xs",
                  onClick: () => setShareOpen(true),
                  "data-ocid": "job-detail-share-btn",
                  "aria-label": "Share job opening",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3 w-3" }),
                    "Share"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-xs",
                  onClick: () => onEdit(job),
                  "data-ocid": "job-edit-btn",
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "h-7 w-7 p-0",
                  onClick: onClose,
                  "aria-label": "Close panel",
                  children: "✕"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: getStatusVariant(job.status),
                  className: "text-[10px]",
                  children: getStatusLabel(job.status)
                }
              ),
              job.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                job.location
              ] }),
              (job.rateMin || job.rateMax) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-3 w-3" }),
                formatRate(job.rateMin, job.rateMax)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Client" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: clientName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Created" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: formatDate(job.createdAt) })
              ] }),
              job.requirements && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Requirements" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 whitespace-pre-wrap leading-relaxed", children: job.requirements })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BenchMatchesPanel, { job })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareJobModal,
      {
        job,
        open: shareOpen,
        onClose: () => setShareOpen(false)
      }
    )
  ] });
}
function JobForm({
  initial,
  clients,
  onSubmit,
  isLoading
}) {
  const [form, setForm] = reactExports.useState({
    clientId: (initial == null ? void 0 : initial.clientId) ?? "",
    title: (initial == null ? void 0 : initial.title) ?? "",
    requirements: (initial == null ? void 0 : initial.requirements) ?? "",
    rateMin: (initial == null ? void 0 : initial.rateMin) ?? void 0,
    rateMax: (initial == null ? void 0 : initial.rateMax) ?? void 0,
    location: (initial == null ? void 0 : initial.location) ?? ""
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleNumberChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value === "" ? void 0 : Number(value)
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.clientId || !form.title.trim()) {
      ue.error("Client and title are required.");
      return;
    }
    onSubmit(form);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", "data-ocid": "job-form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Client *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: form.clientId,
          onValueChange: (v) => setForm((p) => ({ ...p, clientId: v })),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-xs", "data-ocid": "job-form-client", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select client…" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, className: "text-xs", children: c.company ? `${c.company} (${c.name})` : c.name }, c.id)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Job Title *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          name: "title",
          value: form.title,
          onChange: handleChange,
          placeholder: "e.g. Senior React Developer",
          className: "h-8 text-xs",
          required: true,
          "data-ocid": "job-form-title"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          name: "location",
          value: form.location ?? "",
          onChange: handleChange,
          placeholder: "e.g. Remote, Austin TX",
          className: "h-8 text-xs",
          "data-ocid": "job-form-location"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Rate Min ($/hr)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            name: "rateMin",
            type: "number",
            min: 0,
            value: form.rateMin ?? "",
            onChange: handleNumberChange,
            placeholder: "45",
            className: "h-8 text-xs",
            "data-ocid": "job-form-rate-min"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Rate Max ($/hr)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            name: "rateMax",
            type: "number",
            min: 0,
            value: form.rateMax ?? "",
            onChange: handleNumberChange,
            placeholder: "85",
            className: "h-8 text-xs",
            "data-ocid": "job-form-rate-max"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Requirements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          name: "requirements",
          value: form.requirements ?? "",
          onChange: handleChange,
          placeholder: "Skills, experience, qualifications…",
          className: "text-xs min-h-[80px] resize-none",
          "data-ocid": "job-form-requirements"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        size: "sm",
        disabled: isLoading,
        "data-ocid": "job-form-submit",
        children: isLoading ? "Saving…" : (initial == null ? void 0 : initial.title) ? "Save Changes" : "Add Job"
      }
    ) })
  ] });
}
function JobRow({
  job,
  clientName,
  isSelected,
  onClick,
  onShare
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: [
        "w-full text-left grid grid-cols-[1fr_120px_120px_140px_80px_52px_28px] gap-2 px-3 py-2 text-xs border-b border-border/50 transition-colors cursor-pointer items-center",
        isSelected ? "bg-primary/8 border-l-2 border-l-primary" : "hover:bg-muted/30"
      ].join(" "),
      "data-ocid": "job-list-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: job.title }),
          job.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground truncate flex items-center gap-0.5 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5 flex-shrink-0" }),
            job.location
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: clientName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: formatRate(job.rateMin, job.rateMax) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: formatDate(job.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: getStatusVariant(job.status),
            className: "text-[10px] h-4 px-1.5",
            children: getStatusLabel(job.status)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onShare,
            className: "h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors",
            "aria-label": `Share ${job.title}`,
            "data-ocid": "job-row-share-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3 w-3" })
          }
        ) }),
        isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-muted-foreground" })
      ]
    }
  );
}
const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Filled", value: "filled" },
  { label: "Closed", value: "closed" }
];
function JobsPage() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: clients = [] } = useClients();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedJobId, setSelectedJobId] = reactExports.useState(null);
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [editingJob, setEditingJob] = reactExports.useState(null);
  const [sharingJob, setSharingJob] = reactExports.useState(null);
  const filteredJobs = statusFilter === "all" ? jobs : jobs.filter((j) => j.status === statusFilter);
  const openCount = jobs.filter((j) => j.status === "open").length;
  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;
  function handleRowClick(jobId) {
    setSelectedJobId((prev) => prev === jobId ? null : jobId);
  }
  function handleAddJob(data) {
    createJob.mutate(data, {
      onSuccess: () => {
        setShowAddModal(false);
        ue.success("Job added");
      },
      onError: () => ue.error("Failed to add job")
    });
  }
  function handleEditJob(data) {
    if (!editingJob) return;
    updateJob.mutate(
      { id: editingJob.id, input: data },
      {
        onSuccess: () => {
          setEditingJob(null);
          ue.success("Job updated");
        },
        onError: () => ue.error("Failed to update job")
      }
    );
  }
  function getClientName(job) {
    var _a;
    return job.clientName || ((_a = clients.find((c) => c.id === job.clientId)) == null ? void 0 : _a.name) || "Unknown Client";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "jobs-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: `Jobs (${openCount} open)`,
        subtitle: "Track open roles, match bench candidates, and manage submissions",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setShowAddModal(true),
            className: "h-7 gap-1 text-xs",
            "data-ocid": "add-job-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
              "Add Job"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-0 px-4 pt-3 pb-0 border-b border-border bg-card",
        "data-ocid": "job-status-tabs",
        children: STATUS_TABS.map((tab) => {
          const count = tab.value === "all" ? jobs.length : jobs.filter((j) => j.status === tab.value).length;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setStatusFilter(tab.value),
              className: [
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                statusFilter === tab.value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              ].join(" "),
              "data-ocid": `job-tab-${tab.value}`,
              children: [
                tab.label,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: [
                      "text-[10px] px-1 rounded-sm",
                      statusFilter === tab.value ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    ].join(" "),
                    children: count
                  }
                )
              ]
            },
            tab.value
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex-1 overflow-y-auto bg-background ${selectedJob ? "border-r border-border" : ""}`,
          children: jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded" }, i)) }) : filteredJobs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Briefcase,
              title: statusFilter === "all" ? "No jobs yet" : `No ${statusFilter} jobs`,
              message: statusFilter === "all" ? "Add your first job order to start matching bench candidates." : `There are no jobs with status "${statusFilter}" right now.`,
              action: statusFilter === "all" ? { label: "Add Job", onClick: () => setShowAddModal(true) } : void 0
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_120px_120px_140px_80px_52px_28px] gap-2 px-3 py-1.5 bg-muted/20 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Title / Location" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Client" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Rate Range" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center", children: "Share" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
            ] }),
            filteredJobs.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              JobRow,
              {
                job,
                clientName: getClientName(job),
                isSelected: selectedJobId === job.id,
                onClick: () => handleRowClick(job.id),
                onShare: (e) => {
                  e.stopPropagation();
                  setSharingJob(job);
                }
              },
              job.id
            ))
          ] })
        }
      ),
      selectedJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
        JobDetailPanel,
        {
          job: selectedJob,
          clients,
          onEdit: (job) => setEditingJob(job),
          onClose: () => setSelectedJobId(null)
        }
      )
    ] }),
    sharingJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareJobModal,
      {
        job: sharingJob,
        open: !!sharingJob,
        onClose: () => setSharingJob(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: showAddModal,
        onOpenChange: setShowAddModal,
        title: "Add Job",
        description: "Create a new job order for a client.",
        size: "md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          JobForm,
          {
            clients,
            onSubmit: handleAddJob,
            isLoading: createJob.isPending
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: !!editingJob,
        onOpenChange: (open) => !open && setEditingJob(null),
        title: "Edit Job",
        description: "Update job order details.",
        size: "md",
        children: editingJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
          JobForm,
          {
            initial: {
              clientId: editingJob.clientId,
              title: editingJob.title,
              requirements: editingJob.requirements,
              rateMin: editingJob.rateMin,
              rateMax: editingJob.rateMax,
              location: editingJob.location
            },
            clients,
            onSubmit: handleEditJob,
            isLoading: updateJob.isPending
          }
        )
      }
    )
  ] });
}
export {
  JobsPage as default
};
