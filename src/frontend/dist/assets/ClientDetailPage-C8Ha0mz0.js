import { c as createLucideIcon, x as useParams, K as useClients, O as useJobs, y as useActivities, z as useFollowUps, Q as useUpdateClient, q as useUpdateEntityStage, s as useCreateApprovalItem, R as useCreateJob, T as useUpdateJob, r as reactExports, W as nextStage, j as jsxRuntimeExports, l as Building2, L as Link, e as Badge, m as Briefcase, g as Button, v as stageRequiresApproval, N as CLIENT_STAGES, w as ue, Y as useClientJobLinks, Z as useJobsForClient, _ as useCreateClientJobLink, U as Users, E as useUpdateFollowUpStatus, $ as useSoftDeleteClientJobLink, a0 as useSubmissionsForJob, I as PIPELINE_STAGE_LABELS } from "./index-BcyE0PSW.js";
import { M as Mail, P as Pen, A as ActivityTimeline } from "./ActivityTimeline-TD1pD5VH.js";
import { A as AppModal } from "./AppModal-DBZBVRt9.js";
import { E as EmptyState } from "./EmptyState-dLSsOzeq.js";
import { H as HealthBadge } from "./HealthBadge-CogtsHcZ.js";
import { S as StageProgressBar } from "./StageProgressBar-CacvpA2u.js";
import { I as Input } from "./input-DzfYOqkc.js";
import { L as Label } from "./label-DZ9EmIig.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DROn7602.js";
import { S as Skeleton } from "./skeleton-BGlwOHT4.js";
import { T as Textarea } from "./textarea-CIhE1djp.js";
import { f as formatRelativeTime, b as formatCurrency } from "./format-BFjGi2TM.js";
import { A as ArrowLeft, P as Phone } from "./phone-BIe1qUif.js";
import { T as TrendingDown } from "./trending-down-DQgjxPLx.js";
import { M as MessageSquare } from "./message-square-BylTCGCu.js";
import { P as Plus } from "./plus-DDS9tgrJ.js";
import { C as CircleCheckBig } from "./circle-check-big-C33PvWGy.js";
import { S as Send } from "./send-BdE30fCY.js";
import { C as Clock } from "./clock-_n0r6f0R.js";
import { C as CircleX } from "./circle-x-9QR2p1f9.js";
import { E as ExternalLink } from "./external-link-BC9UVUvE.js";
import "./calendar-check-DMgdPMnx.js";
import "./index-BMwOffDd.js";
import "./index-Cm52jBe7.js";
import "./index-BYnJqRhy.js";
import "./index-PsHIiSsr.js";
import "./check-BtfY299Q.js";
import "./index-CZ3obOQC.js";
import "./chevron-down-CBCoMYGr.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71",
      key: "yqzxt4"
    }
  ],
  [
    "path",
    {
      d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71",
      key: "4qinb0"
    }
  ],
  ["line", { x1: "8", x2: "8", y1: "2", y2: "5", key: "1041cp" }],
  ["line", { x1: "2", x2: "5", y1: "8", y2: "8", key: "14m1p5" }],
  ["line", { x1: "16", x2: "16", y1: "19", y2: "22", key: "rzdirn" }],
  ["line", { x1: "19", x2: "22", y1: "16", y2: "16", key: "ox905f" }]
];
const Unlink = createLucideIcon("unlink", __iconNode);
const JOB_STATUS_CONFIG = {
  open: {
    label: "Open",
    className: "border-[oklch(0.68_0.22_142)]/30 text-[oklch(0.68_0.22_142)] bg-[oklch(0.68_0.22_142)]/10"
  },
  filled: {
    label: "Filled",
    className: "border-[oklch(0.5_0.18_207)]/30 text-[oklch(0.5_0.18_207)] bg-[oklch(0.5_0.18_207)]/10"
  },
  closed: { label: "Closed", className: "border-border text-muted-foreground" },
  on_hold: {
    label: "On Hold",
    className: "border-[oklch(0.85_0.24_80)]/30 text-[oklch(0.85_0.24_80)] bg-[oklch(0.85_0.24_80)]/10"
  }
};
function JobStatusBadge({ status }) {
  const { label, className } = JOB_STATUS_CONFIG[status] ?? JOB_STATUS_CONFIG.open;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `text-[10px] py-0 h-5 ${className}`, children: label });
}
function formatJobRate(job) {
  if (job.rateType && job.rateAmount) {
    const symbol = job.rateCurrency === "INR" ? "₹" : job.rateCurrency === "USD" ? "$" : "";
    const label = job.rateType === "LPM" ? "LPM" : job.rateType === "LPA" ? "LPA" : "Per Hour";
    return `${symbol}${job.rateAmount} ${label}`;
  }
  if (job.rateMin && job.rateMax) {
    return `${formatCurrency(job.rateMin)} – ${formatCurrency(job.rateMax)}`;
  }
  if (job.rateMin) return `From ${formatCurrency(job.rateMin)}`;
  return "Rate TBD";
}
function PipelinePreview({ jobId }) {
  const { data: submissions = [] } = useSubmissionsForJob(jobId);
  const stageCounts = submissions.reduce((acc, sub) => {
    const stage = sub.pipelineStage;
    if (!stage) return acc;
    acc[stage] = (acc[stage] ?? 0) + 1;
    return acc;
  }, {});
  const topStages = Object.entries(stageCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (topStages.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "No submissions" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 flex-wrap", children: topStages.map(([stage, count], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
    i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 text-[9px]", children: "→" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
      PIPELINE_STAGE_LABELS[stage] ?? stage,
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
        "(",
        count,
        ")"
      ] })
    ] })
  ] }, stage)) });
}
function PlacedCount({ jobId }) {
  const { data: submissions = [] } = useSubmissionsForJob(jobId);
  const placed = submissions.filter(
    (s) => s.pipelineStage === "placed"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground", children: placed > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-[oklch(0.68_0.22_142)]", children: [
    placed,
    " placed"
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "—" }) });
}
function LinkedJobRow({
  job,
  link,
  clientId,
  onEdit,
  onMarkFilled,
  onMarkClosed
}) {
  const softDelete = useSoftDeleteClientJobLink();
  const [confirmUnlink, setConfirmUnlink] = reactExports.useState(false);
  function handleUnlink() {
    softDelete.mutate(
      { clientId, jobId: job.id },
      {
        onSuccess: () => ue.success("Job unlinked"),
        onError: () => ue.error("Failed to unlink job")
      }
    );
    setConfirmUnlink(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-3 gap-y-1 px-3 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors items-start",
      "data-ocid": "linked-job-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => onEdit(job),
                className: "text-xs font-semibold text-foreground hover:text-primary transition-colors truncate max-w-[200px] text-left flex items-center gap-1",
                "data-ocid": "linked-job-title",
                children: [
                  job.title,
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-2.5 w-2.5 text-muted-foreground flex-shrink-0" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(JobStatusBadge, { status: job.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PipelinePreview, { jobId: job.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Rate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground whitespace-nowrap", children: formatJobRate(job) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Placed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PlacedCount, { jobId: job.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "Linked" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: new Date(link.linkedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric"
          }) })
        ] }),
        job.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 items-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onMarkFilled(job),
              className: "text-[10px] text-[oklch(0.68_0.22_142)] hover:underline whitespace-nowrap",
              "data-ocid": "linked-job-mark-filled",
              children: "Mark Filled"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onMarkClosed(job),
              className: "text-[10px] text-muted-foreground hover:underline whitespace-nowrap",
              children: "Close"
            }
          )
        ] }),
        job.status !== "open" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: confirmUnlink ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleUnlink,
              className: "text-[10px] text-[oklch(0.65_0.19_22)] hover:underline",
              "data-ocid": "linked-job-confirm-unlink",
              children: "Confirm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => setConfirmUnlink(false),
              className: "text-[10px] text-muted-foreground hover:underline",
              children: "Cancel"
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "h-6 w-6 p-0 text-muted-foreground hover:text-[oklch(0.65_0.19_22)]",
            onClick: () => setConfirmUnlink(true),
            disabled: softDelete.isPending,
            "aria-label": "Unlink job",
            "data-ocid": "linked-job-unlink-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Unlink, { className: "h-3 w-3" })
          }
        ) })
      ]
    }
  );
}
function JobOrdersSection({
  clientId,
  allJobs,
  onEditJob,
  onMarkFilled,
  onMarkClosed,
  onAddJob
}) {
  const { data: links = [], isLoading: linksLoading } = useClientJobLinks(clientId);
  const { data: submissionsAll = [] } = useJobsForClient(clientId);
  const createLink = useCreateClientJobLink();
  const [selectedJobId, setSelectedJobId] = reactExports.useState("");
  const { data: _poll } = useClientJobLinks(clientId);
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
    }, 5e3);
    return () => clearInterval(interval);
  }, []);
  const linkedJobIds = new Set(links.map((l) => l.jobId));
  const linkableJobs = allJobs.filter(
    (j) => j.status === "open" && !linkedJobIds.has(j.id)
  );
  const linkedJobs = allJobs.filter((j) => linkedJobIds.has(j.id));
  const totalCandidates = submissionsAll.length;
  const placedCount = linkedJobs.filter((j) => j.status === "filled").length;
  function handleLink() {
    if (!selectedJobId) return;
    createLink.mutate(
      { clientId, jobId: selectedJobId },
      {
        onSuccess: () => {
          ue.success("Job linked to client");
          setSelectedJobId("");
        },
        onError: () => ue.error("Failed to link job")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", "data-ocid": "job-orders-section", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-foreground font-display uppercase tracking-wide", children: "Job Orders" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          variant: "outline",
          className: "h-6 px-2 text-[10px] gap-1",
          onClick: onAddJob,
          "data-ocid": "add-job-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
            "New Job"
          ]
        }
      )
    ] }),
    links.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-3 mb-3 text-[10px] text-muted-foreground",
        "data-ocid": "job-orders-stats",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: links.length }),
            " linked"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: totalCandidates }),
            " in pipeline"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3 text-[oklch(0.68_0.22_142)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-[oklch(0.68_0.22_142)]", children: placedCount }),
            " ",
            "placed"
          ] })
        ]
      }
    ),
    linkableJobs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-3 flex items-center gap-2 p-2.5 rounded-md border border-border bg-muted/20",
        "data-ocid": "link-job-section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5 text-muted-foreground flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedJobId, onValueChange: setSelectedJobId, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-7 text-xs flex-1 min-w-0",
                "data-ocid": "link-job-select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Link existing open job…" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: linkableJobs.map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: j.id, className: "text-xs", children: j.title }, j.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "h-7 px-2.5 text-xs shrink-0",
              disabled: !selectedJobId || createLink.isPending,
              onClick: handleLink,
              "data-ocid": "link-job-btn",
              children: createLink.isPending ? "Linking…" : "Link Job"
            }
          )
        ]
      }
    ),
    linksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full" })
    ] }) : links.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-md border border-dashed border-border bg-muted/10 px-4 py-5 text-center",
        "data-ocid": "job-orders-empty",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5 text-muted-foreground mx-auto mb-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mb-0.5", children: "No jobs linked yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Use the dropdown above to link an existing job, or create a new one." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-md border border-border overflow-hidden",
        "data-ocid": "linked-jobs-table",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-3 px-3 py-1.5 bg-muted/30 border-b border-border", children: ["Job / Pipeline", "Rate", "Placed", "Linked", "Actions", ""].map(
            (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
                children: h
              },
              h
            )
          ) }),
          linkedJobs.map((job) => {
            const link = links.find((l) => l.jobId === job.id);
            if (!link) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              LinkedJobRow,
              {
                job,
                link,
                clientId,
                onEdit: onEditJob,
                onMarkFilled,
                onMarkClosed
              },
              job.id
            );
          })
        ]
      }
    )
  ] });
}
function JobForm({
  clientId,
  initial,
  onSubmit,
  loading,
  submitLabel = "Create Job"
}) {
  const [form, setForm] = reactExports.useState({
    clientId,
    title: (initial == null ? void 0 : initial.title) ?? "",
    requirements: (initial == null ? void 0 : initial.requirements) ?? "",
    rateType: (initial == null ? void 0 : initial.rateType) ?? "",
    rateAmount: (initial == null ? void 0 : initial.rateAmount) ?? "",
    rateCurrency: (initial == null ? void 0 : initial.rateCurrency) ?? "INR",
    rateMin: initial == null ? void 0 : initial.rateMin,
    rateMax: initial == null ? void 0 : initial.rateMax,
    location: (initial == null ? void 0 : initial.location) ?? ""
  });
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", "data-ocid": "job-form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Job Title *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: form.title,
          onChange: (e) => set("title", e.target.value),
          placeholder: "Senior Software Engineer",
          className: "h-8 text-sm bg-background",
          required: true,
          "data-ocid": "job-form-title"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Requirements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          value: form.requirements ?? "",
          onChange: (e) => set("requirements", e.target.value),
          placeholder: "5+ years experience, React, Node.js...",
          className: "text-sm bg-background resize-none",
          rows: 3
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Rate Min ($/hr)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            value: form.rateMin ?? "",
            onChange: (e) => set(
              "rateMin",
              e.target.value ? Number(e.target.value) : void 0
            ),
            placeholder: "80",
            className: "h-8 text-sm bg-background",
            "data-ocid": "job-form-rate-min"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Rate Max ($/hr)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            value: form.rateMax ?? "",
            onChange: (e) => set(
              "rateMax",
              e.target.value ? Number(e.target.value) : void 0
            ),
            placeholder: "120",
            className: "h-8 text-sm bg-background",
            "data-ocid": "job-form-rate-max"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          value: form.location ?? "",
          onChange: (e) => set("location", e.target.value),
          placeholder: "Remote / New York, NY",
          className: "h-8 text-sm bg-background"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-1 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        size: "sm",
        disabled: loading || !form.title.trim(),
        "data-ocid": "job-form-submit",
        children: loading ? "Saving…" : submitLabel
      }
    ) })
  ] });
}
function EditClientForm({ client, onSubmit, loading }) {
  const [form, setForm] = reactExports.useState({
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    industry: client.industry,
    notes: client.notes
  });
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-3",
      "data-ocid": "edit-client-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Company Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.company ?? "",
                onChange: (e) => set("company", e.target.value),
                className: "h-8 text-sm bg-background"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Hiring Manager" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.name ?? "",
                onChange: (e) => set("name", e.target.value),
                className: "h-8 text-sm bg-background",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.email ?? "",
                onChange: (e) => set("email", e.target.value),
                type: "email",
                className: "h-8 text-sm bg-background",
                required: true
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.phone ?? "",
                onChange: (e) => set("phone", e.target.value),
                className: "h-8 text-sm bg-background"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Industry" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.industry ?? "",
                onChange: (e) => set("industry", e.target.value),
                className: "h-8 text-sm bg-background"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: form.notes ?? "",
                onChange: (e) => set("notes", e.target.value),
                className: "text-sm bg-background resize-none",
                rows: 3
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-1 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            disabled: loading,
            "data-ocid": "edit-client-submit",
            children: loading ? "Saving…" : "Save Changes"
          }
        ) })
      ]
    }
  );
}
function FollowUpItem({ followUp }) {
  const updateStatus = useUpdateFollowUpStatus();
  const handleAction = (status) => {
    updateStatus.mutate(
      { id: followUp.id, status, approvedBy: "Manager" },
      { onSuccess: () => ue.success(`Follow-up ${status}`) }
    );
  };
  const isPending = followUp.status === "pending";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "entity-card space-y-2", "data-ocid": "followup-item", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground", children: followUp.suggestedAction }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: followUp.triggerReason })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: `text-[10px] py-0 h-5 flex-shrink-0 ${followUp.status === "pending" ? "border-[oklch(0.85_0.24_80)]/40 text-[oklch(0.85_0.24_80)]" : followUp.status === "approved" ? "border-[oklch(0.68_0.22_142)]/40 text-[oklch(0.68_0.22_142)]" : "border-border text-muted-foreground"}`,
          children: followUp.status
        }
      )
    ] }),
    followUp.suggestedMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground italic bg-muted/40 rounded px-2 py-1.5 line-clamp-2", children: [
      '"',
      followUp.suggestedMessage,
      '"'
    ] }),
    isPending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-1 border-t border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "h-6 px-2 text-[10px] gap-1 bg-[oklch(0.68_0.22_142)] hover:bg-[oklch(0.68_0.22_142)]/90 text-foreground",
          onClick: () => handleAction("approved"),
          disabled: updateStatus.isPending,
          "data-ocid": "followup-approve",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-2.5 w-2.5" }),
            "Approve"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-6 px-2 text-[10px] gap-1",
          onClick: () => handleAction("snoozed"),
          disabled: updateStatus.isPending,
          "data-ocid": "followup-snooze",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5" }),
            "Snooze"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-6 px-2 text-[10px] gap-1 text-[oklch(0.65_0.19_22)]",
          onClick: () => handleAction("rejected"),
          disabled: updateStatus.isPending,
          "data-ocid": "followup-reject",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-2.5 w-2.5" }),
            "Reject"
          ]
        }
      )
    ] })
  ] });
}
function ClientDetailPage() {
  const { clientId } = useParams({ from: "/clients/$clientId" });
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: allJobs = [] } = useJobs();
  const { data: activities, isLoading: activitiesLoading } = useActivities(clientId);
  const { data: allFollowUps } = useFollowUps();
  const updateClient = useUpdateClient();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const createJob = useCreateJob();
  const updateJobMutation = useUpdateJob();
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const [jobModalOpen, setJobModalOpen] = reactExports.useState(false);
  const [editingJob, setEditingJob] = reactExports.useState(null);
  const client = (clients ?? []).find((c) => c.id === clientId);
  const followUps = (allFollowUps ?? []).filter((f) => f.entityId === clientId);
  const pendingFollowUps = followUps.filter((f) => f.status === "pending");
  const next = client ? nextStage("client", client.currentStage) : null;
  function handleAdvanceStage() {
    if (!client || !next) return;
    if (stageRequiresApproval("client", next)) {
      createApproval.mutate(
        {
          entityId: clientId,
          entityType: "client",
          itemType: "stage_change",
          description: `Advance ${client.company ?? client.name} → ${next}`,
          details: `Stage change from "${client.currentStage}" to "${next}" requires manager approval.`,
          requestedBy: "Manager"
        },
        { onSuccess: () => ue.success(`Approval requested for "${next}"`) }
      );
    } else {
      updateStage.mutate(
        { entityId: clientId, entityType: "client", newStage: next },
        { onSuccess: () => ue.success(`Advanced to "${next}"`) }
      );
    }
  }
  function handleEditClient(input) {
    updateClient.mutate(
      { id: clientId, input },
      {
        onSuccess: () => {
          setEditOpen(false);
          ue.success("Client updated");
        },
        onError: () => ue.error("Failed to update client")
      }
    );
  }
  function handleCreateJob(input) {
    createJob.mutate(input, {
      onSuccess: () => {
        setJobModalOpen(false);
        ue.success("Job order created");
      },
      onError: () => ue.error("Failed to create job")
    });
  }
  function handleJobMarkFilled(job) {
    updateJobMutation.mutate(
      { id: job.id, input: { status: "filled" } },
      { onSuccess: () => ue.success("Job marked as filled") }
    );
  }
  function handleJobMarkClosed(job) {
    updateJobMutation.mutate(
      { id: job.id, input: { status: "closed" } },
      { onSuccess: () => ue.success("Job closed") }
    );
  }
  if (clientsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40" })
      ] })
    ] });
  }
  if (!client) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Building2,
        title: "Client not found",
        message: "This client may have been deleted or you may have an incorrect link.",
        action: {
          label: "Back to Clients",
          onClick: () => window.history.back()
        }
      }
    ) });
  }
  const isAtRisk = client.healthScore < 40;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "client-detail-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 pb-1 flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/clients",
        className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-smooth",
        "data-ocid": "back-to-clients",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3 w-3" }),
          "Clients"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-3 border-b border-border bg-card flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground font-display truncate", children: client.company ?? client.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                HealthBadge,
                {
                  score: client.healthScore,
                  showScore: true,
                  showLabel: true,
                  size: "sm"
                }
              ),
              isAtRisk && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Badge,
                {
                  variant: "outline",
                  className: "text-[10px] py-0 h-5 border-[oklch(0.65_0.19_22)]/40 text-[oklch(0.65_0.19_22)] gap-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-2.5 w-2.5" }),
                    "Churn Risk"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              client.name,
              " · ",
              client.currentStage
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-1.5 flex-wrap", children: [
              client.email && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `mailto:${client.email}`,
                  className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-smooth",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-2.5 w-2.5" }),
                    client.email
                  ]
                }
              ),
              client.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: `tel:${client.phone}`,
                  className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-smooth",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-2.5 w-2.5" }),
                    client.phone
                  ]
                }
              ),
              client.industry && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-2.5 w-2.5" }),
                client.industry
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "h-7 text-xs gap-1",
              onClick: () => setEditOpen(true),
              "data-ocid": "edit-client-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
                "Edit"
              ]
            }
          ),
          next && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "h-7 text-xs gap-1",
              onClick: handleAdvanceStage,
              disabled: updateStage.isPending || createApproval.isPending,
              "data-ocid": "advance-stage-btn",
              children: stageRequiresApproval("client", next) ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Request Approval" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "h-3 w-3" }),
                next
              ] })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        StageProgressBar,
        {
          stages: CLIENT_STAGES,
          currentStage: client.currentStage,
          compact: false
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0 divide-y divide-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-foreground font-display mb-3 uppercase tracking-wide", children: "Client Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
            { label: "Company", value: client.company },
            { label: "Hiring Manager", value: client.name },
            { label: "Email", value: client.email },
            { label: "Phone", value: client.phone },
            { label: "Industry", value: client.industry },
            { label: "Health Score", value: `${client.healthScore}/100` },
            { label: "Current Stage", value: client.currentStage },
            {
              label: "Last Updated",
              value: formatRelativeTime(client.updatedAt)
            }
          ].map(
            ({ label, value }) => value ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground truncate", children: value })
            ] }, label) : null
          ) }),
          client.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 p-2.5 bg-muted/40 rounded-sm border border-border/50", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-1", children: "Notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: client.notes })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          JobOrdersSection,
          {
            clientId,
            allJobs,
            onEditJob: (j) => setEditingJob(j),
            onMarkFilled: handleJobMarkFilled,
            onMarkClosed: handleJobMarkClosed,
            onAddJob: () => setJobModalOpen(true)
          }
        ),
        pendingFollowUps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-semibold text-foreground font-display uppercase tracking-wide mb-3", children: [
            "Pending Follow-Ups",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[oklch(0.85_0.24_80)]/20 text-[oklch(0.85_0.24_80)] text-[9px]", children: pendingFollowUps.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "followup-list", children: pendingFollowUps.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FollowUpItem, { followUp: f }, f.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4 lg:min-h-0 lg:overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xs font-semibold text-foreground font-display uppercase tracking-wide mb-3 sticky top-0 bg-background pb-2 border-b border-border/50", children: "Activity Timeline" }),
        activitiesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: ["a1", "a2", "a3", "a4"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-6 rounded-sm flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-full" })
          ] })
        ] }, k)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActivityTimeline,
          {
            activities: activities ?? [],
            emptyMessage: "No activities recorded yet. Activity will appear here as you interact with this client."
          }
        ),
        followUps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-3 border-t border-border/50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3 w-3" }),
            "All Follow-Ups (",
            followUps.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: followUps.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-2 py-1 border-b border-border/30 last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: f.suggestedAction }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-[9px] py-0 h-4 flex-shrink-0 ${f.status === "approved" ? "border-[oklch(0.68_0.22_142)]/30 text-[oklch(0.68_0.22_142)]" : f.status === "rejected" ? "border-[oklch(0.65_0.19_22)]/30 text-[oklch(0.65_0.19_22)]" : "border-border text-muted-foreground"}`,
                    children: f.status
                  }
                )
              ]
            },
            f.id
          )) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: editOpen,
        onOpenChange: setEditOpen,
        title: "Edit Client",
        size: "md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditClientForm,
          {
            client,
            onSubmit: handleEditClient,
            loading: updateClient.isPending
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: jobModalOpen,
        onOpenChange: setJobModalOpen,
        title: "Add Job Order",
        description: `Create a new job order for ${client.company ?? client.name}`,
        size: "md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          JobForm,
          {
            clientId,
            onSubmit: handleCreateJob,
            loading: createJob.isPending
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: !!editingJob,
        onOpenChange: (open) => !open && setEditingJob(null),
        title: "Edit Job Order",
        size: "md",
        children: editingJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
          JobForm,
          {
            clientId,
            initial: editingJob,
            onSubmit: (input) => {
              updateJobMutation.mutate(
                { id: editingJob.id, input },
                {
                  onSuccess: () => {
                    setEditingJob(null);
                    ue.success("Job updated");
                  }
                }
              );
            },
            loading: updateJobMutation.isPending,
            submitLabel: "Save Changes"
          }
        )
      }
    )
  ] });
}
export {
  ClientDetailPage as default
};
