import { c as createLucideIcon, x as useParams, o as useVendors, y as useActivities, z as useFollowUps, A as useUpdateVendor, r as reactExports, j as jsxRuntimeExports, l as Building2, L as Link, C as ChevronRight, g as Button, V as VENDOR_STAGES, e as Badge, w as ue, q as useUpdateEntityStage, s as useCreateApprovalItem, v as stageRequiresApproval, E as useUpdateFollowUpStatus, F as useSubmissionsForVendor, G as getDaysInStage, U as Users, H as useLogActivity, I as PIPELINE_STAGE_LABELS, J as PIPELINE_STAGE_COLORS } from "./index-DEcjbVqe.js";
import { P as Pen, M as Mail, A as ActivityTimeline } from "./ActivityTimeline-DOFdHDTe.js";
import { A as AppModal } from "./AppModal-BenB6Lgj.js";
import { E as EmptyState } from "./EmptyState-DvnNbz-v.js";
import { c as computeHealthStatus, H as HealthBadge } from "./HealthBadge-jmRxr-16.js";
import { S as StageProgressBar } from "./StageProgressBar-Do8Gjmw1.js";
import { I as Input } from "./input-ChaUVwiJ.js";
import { L as Label } from "./label-CD4QrJlL.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-KiGyENxA.js";
import { S as Skeleton } from "./skeleton-CutlsRL1.js";
import { T as Textarea } from "./textarea-CqHObr6m.js";
import { A as ArrowLeft, P as Phone } from "./phone-ZWIyI_A-.js";
import { T as Timer } from "./timer-C-HTWaVb.js";
import { P as Plus } from "./plus-BsNzPjDE.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "./BarChart-B-zPay0f.js";
import { C as CircleCheckBig } from "./circle-check-big-oO1J9mJL.js";
import { C as Clock } from "./clock-BOPjr0Pq.js";
import { C as CircleX } from "./circle-x-Cidu3-l-.js";
import { F as Funnel } from "./funnel-CzN499fl.js";
import { T as TriangleAlert } from "./triangle-alert-C55qEOSk.js";
import "./format-BHC1JPSL.js";
import "./calendar-check-ll_gNgC-.js";
import "./send-C77CZyMx.js";
import "./index-CQt9SKRH.js";
import "./index-0LXGdj5l.js";
import "./index-CqMCrgBb.js";
import "./index-BR-XLZeN.js";
import "./check-bOS3-8JR.js";
import "./index-DKFFFLHG.js";
import "./chevron-down-2VZ2NAdK.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 16-4 4-4-4", key: "f6ql7i" }],
  ["path", { d: "M17 20V4", key: "1ejh1v" }],
  ["path", { d: "m3 8 4-4 4 4", key: "11wl7u" }],
  ["path", { d: "M7 4v16", key: "1glfcx" }]
];
const ArrowUpDown = createLucideIcon("arrow-up-down", __iconNode);
function getOutcome(stage) {
  if (stage === "placed") return "Placed";
  if (stage === "rejected") return "Rejected";
  if (stage === "offer_extended" || stage === "offer_accepted")
    return "On Hold";
  return "Active";
}
const OUTCOME_CONFIG = {
  Active: {
    className: "border-[oklch(0.5_0.18_207)]/40 text-[oklch(0.5_0.18_207)] bg-[oklch(0.5_0.18_207)]/10"
  },
  Placed: {
    className: "border-[oklch(0.68_0.22_142)]/40 text-[oklch(0.68_0.22_142)] bg-[oklch(0.68_0.22_142)]/10"
  },
  Rejected: {
    className: "border-[oklch(0.65_0.19_22)]/40 text-[oklch(0.65_0.19_22)] bg-[oklch(0.65_0.19_22)]/10"
  },
  "On Hold": {
    className: "border-[oklch(0.85_0.24_80)]/40 text-[oklch(0.85_0.24_80)] bg-[oklch(0.85_0.24_80)]/10"
  }
};
function StageBadge({ stage }) {
  if (!stage)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "—" });
  const color = PIPELINE_STAGE_COLORS[stage] ?? "#6b7280";
  const label = PIPELINE_STAGE_LABELS[stage] ?? stage;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium",
      style: {
        borderColor: `${color}40`,
        color,
        backgroundColor: `${color}15`
      },
      children: label
    }
  );
}
function StatCard({
  label,
  value,
  sub,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "bg-muted/30 border border-border rounded-md px-3 py-2.5 space-y-0.5",
      "data-ocid": "stat-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xl font-bold font-display leading-none",
            style: accent ? { color: accent } : void 0,
            children: value
          }
        ),
        sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: sub })
      ]
    }
  );
}
function SharedProfilesSection({ vendorId }) {
  const { data: submissions = [], isLoading } = useSubmissionsForVendor(vendorId);
  const [sortKey, setSortKey] = reactExports.useState("date");
  const [sortAsc, setSortAsc] = reactExports.useState(false);
  const [outcomeFilter, setOutcomeFilter] = reactExports.useState("All");
  reactExports.useEffect(() => {
    const interval = setInterval(() => {
    }, 5e3);
    return () => clearInterval(interval);
  }, []);
  const total = submissions.length;
  const placed = submissions.filter(
    (s) => s.pipelineStage === "placed"
  ).length;
  const active = submissions.filter((s) => {
    const stage = s.pipelineStage;
    return stage && stage !== "placed" && stage !== "rejected";
  }).length;
  const conversionRate = total > 0 ? Math.round(placed / total * 100) : 0;
  const filtered = reactExports.useMemo(() => {
    let list = submissions;
    if (outcomeFilter !== "All") {
      list = list.filter((s) => getOutcome(s.pipelineStage) === outcomeFilter);
    }
    return [...list].sort((a, b) => {
      let diff = 0;
      if (sortKey === "date") {
        diff = a.submittedAt - b.submittedAt;
      } else if (sortKey === "stage") {
        const stageOrder = Object.keys(PIPELINE_STAGE_LABELS);
        diff = stageOrder.indexOf(a.pipelineStage ?? "") - stageOrder.indexOf(b.pipelineStage ?? "");
      } else if (sortKey === "days") {
        diff = getDaysInStage(a.lastStageChangeAt, String(a.submittedAt)) - getDaysInStage(b.lastStageChangeAt, String(b.submittedAt));
      }
      return sortAsc ? diff : -diff;
    });
  }, [submissions, sortKey, sortAsc, outcomeFilter]);
  function toggleSort(key) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  }
  function SortHeader({ label, sKey }) {
    const active2 = sortKey === sKey;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => toggleSort(sKey),
        className: `flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${active2 ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`,
        "data-ocid": `sort-${sKey}`,
        children: [
          label,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ArrowUpDown,
            {
              className: `h-2.5 w-2.5 ${active2 ? "opacity-100" : "opacity-40"}`
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 border-b border-border",
      "data-ocid": "shared-profiles-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground font-display uppercase tracking-wide", children: "Shared Profiles" }),
            total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[9px] px-1.5 h-4", children: total })
          ] }),
          total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-3 w-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: outcomeFilter,
                onValueChange: (v) => setOutcomeFilter(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-6 text-[10px] w-[100px]",
                      "data-ocid": "outcome-filter",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: [
                    "All",
                    "Active",
                    "Placed",
                    "Rejected",
                    "On Hold"
                  ].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o, className: "text-xs", children: o }, o)) })
                ]
              }
            )
          ] })
        ] }),
        total > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "grid grid-cols-2 gap-2 mb-3",
            "data-ocid": "vendor-stats-row",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatCard, { label: "Total Shared", value: total, sub: "candidates" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Active",
                  value: active,
                  sub: "in pipeline",
                  accent: "#6366f1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Placed",
                  value: placed,
                  sub: "successfully",
                  accent: "#059669"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StatCard,
                {
                  label: "Conversion",
                  value: `${conversionRate}%`,
                  sub: "placement rate",
                  accent: conversionRate >= 30 ? "#059669" : conversionRate >= 15 ? "#f59e0b" : "#ef4444"
                }
              )
            ]
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded" }, i)) }) : submissions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-md border border-dashed border-border bg-muted/10 px-3 py-5 text-center",
            "data-ocid": "shared-profiles-empty",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-5 w-5 text-muted-foreground mx-auto mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mb-0.5", children: "No candidates shared yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "No candidates have been shared by this vendor yet." })
            ]
          }
        ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/10 px-3 py-4 text-center text-xs text-muted-foreground", children: [
          'No submissions match the "',
          outcomeFilter,
          '" filter.'
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] gap-x-2 px-3 py-1.5 bg-muted/30 border-b border-border items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Date", sKey: "date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Candidate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Job" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Client" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Stage", sKey: "stage" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Days", sKey: "days" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Outcome" })
          ] }),
          filtered.map((sub) => {
            const days = getDaysInStage(
              sub.lastStageChangeAt,
              String(sub.submittedAt)
            );
            const outcome = getOutcome(sub.pipelineStage);
            const outcomeConfig = OUTCOME_CONFIG[outcome];
            const isStale = days > 7;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] gap-x-2 px-3 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors items-center",
                "data-ocid": "shared-profile-row",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: new Date(sub.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground truncate min-w-0", children: sub.candidateName || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground truncate min-w-0", children: sub.jobTitle || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground truncate max-w-[80px]", children: sub.clientName || "—" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StageBadge, { stage: sub.pipelineStage }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
                    isStale ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-2.5 w-2.5 text-[oklch(0.85_0.24_80)]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: `text-[10px] font-medium ${isStale ? "text-[oklch(0.85_0.24_80)]" : "text-muted-foreground"}`,
                        title: isStale ? "Stale — more than 7 days in this stage" : void 0,
                        children: [
                          days,
                          "d"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      variant: "outline",
                      className: `text-[10px] py-0 h-5 flex-shrink-0 ${outcomeConfig.className}`,
                      "data-ocid": "outcome-badge",
                      children: outcome
                    }
                  )
                ]
              },
              sub.id
            );
          })
        ] })
      ]
    }
  );
}
function MetricCard({
  label,
  value,
  sub
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 border border-border rounded-md px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-foreground font-display leading-none", children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: sub })
  ] });
}
function EditVendorForm({
  vendor,
  onSave,
  onCancel,
  isLoading
}) {
  const [form, setForm] = reactExports.useState({
    name: vendor.name,
    email: vendor.email,
    phone: vendor.phone ?? "",
    company: vendor.company ?? "",
    specialty: vendor.specialty ?? "",
    notes: vendor.notes ?? ""
  });
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: (e) => {
        e.preventDefault();
        onSave(form);
      },
      className: "space-y-3",
      "data-ocid": "edit-vendor-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Contact Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "name",
                value: form.name ?? "",
                onChange: handleChange,
                className: "h-8 text-xs",
                required: true,
                "data-ocid": "edit-vendor-name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Company" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "company",
                value: form.company ?? "",
                onChange: handleChange,
                className: "h-8 text-xs",
                "data-ocid": "edit-vendor-company"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "email",
                type: "email",
                value: form.email ?? "",
                onChange: handleChange,
                className: "h-8 text-xs",
                required: true,
                "data-ocid": "edit-vendor-email"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                name: "phone",
                value: form.phone ?? "",
                onChange: handleChange,
                className: "h-8 text-xs",
                "data-ocid": "edit-vendor-phone"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Specialty" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              name: "specialty",
              value: form.specialty ?? "",
              onChange: handleChange,
              className: "h-8 text-xs",
              "data-ocid": "edit-vendor-specialty"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              name: "notes",
              value: form.notes ?? "",
              onChange: handleChange,
              className: "text-xs min-h-[70px] resize-none",
              "data-ocid": "edit-vendor-notes"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onCancel,
              className: "h-7 text-xs",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: isLoading,
              className: "h-7 text-xs",
              "data-ocid": "edit-vendor-save",
              children: isLoading ? "Saving…" : "Save Changes"
            }
          )
        ] })
      ]
    }
  );
}
function LogActivityForm({
  entityId,
  onDone
}) {
  const logActivity = useLogActivity();
  const [form, setForm] = reactExports.useState({
    entityId,
    activityType: "note",
    direction: "outbound",
    notes: "",
    createdBy: "Manager"
  });
  function handleChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    logActivity.mutate(form, {
      onSuccess: () => {
        ue.success("Activity logged");
        onDone();
      },
      onError: () => ue.error("Failed to log activity")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-3",
      "data-ocid": "log-activity-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                name: "activityType",
                value: form.activityType,
                onChange: handleChange,
                className: "w-full h-8 text-xs bg-background border border-input rounded-md px-2 text-foreground",
                "data-ocid": "activity-type",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "call", children: "Call" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "email", children: "Email" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "meeting", children: "Meeting" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "submission", children: "Submission" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "note", children: "Note" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Direction" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                name: "direction",
                value: form.direction ?? "outbound",
                onChange: handleChange,
                className: "w-full h-8 text-xs bg-background border border-input rounded-md px-2 text-foreground",
                "data-ocid": "activity-direction",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "outbound", children: "Outbound" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "inbound", children: "Inbound" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              name: "notes",
              value: form.notes ?? "",
              onChange: handleChange,
              placeholder: "What happened?",
              className: "text-xs min-h-[60px] resize-none",
              "data-ocid": "activity-notes"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onDone,
              className: "h-7 text-xs",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              disabled: logActivity.isPending,
              className: "h-7 text-xs",
              "data-ocid": "activity-submit",
              children: logActivity.isPending ? "Logging…" : "Log Activity"
            }
          )
        ] })
      ]
    }
  );
}
function FollowUpRow({
  followUp
}) {
  const updateStatus = useUpdateFollowUpStatus();
  function act(status, snoozedUntil) {
    updateStatus.mutate(
      { id: followUp.id, status, snoozedUntil },
      {
        onSuccess: () => ue.success(
          status === "approved" ? "Follow-up approved" : status === "snoozed" ? "Snoozed 24h" : "Follow-up rejected"
        )
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border border-border rounded-md p-3 space-y-2 bg-card",
      "data-ocid": "follow-up-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wide", children: followUp.triggerReason }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground mt-0.5", children: followUp.suggestedAction }),
            followUp.suggestedMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-1 italic bg-muted/30 px-2 py-1 rounded border border-border", children: [
              '"',
              followUp.suggestedMessage,
              '"'
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "text-[9px] uppercase tracking-wide flex-shrink-0",
              children: followUp.status
            }
          )
        ] }),
        followUp.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1.5",
            "data-ocid": "follow-up-actions",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: () => act("approved"),
                  disabled: updateStatus.isPending,
                  className: "h-6 px-2 text-[10px] gap-1",
                  "data-ocid": "follow-up-approve",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
                    "Approve"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  onClick: () => act("snoozed", Date.now() + 864e5),
                  disabled: updateStatus.isPending,
                  className: "h-6 px-2 text-[10px] gap-1",
                  "data-ocid": "follow-up-snooze",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
                    "Snooze"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "ghost",
                  onClick: () => act("rejected"),
                  disabled: updateStatus.isPending,
                  className: "h-6 px-2 text-[10px] text-destructive hover:text-destructive gap-1",
                  "data-ocid": "follow-up-reject",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-3 w-3" }),
                    "Reject"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
const MOCK_CHART_DATA = [
  { day: "Mon", submissions: 2 },
  { day: "Tue", submissions: 4 },
  { day: "Wed", submissions: 1 },
  { day: "Thu", submissions: 3 },
  { day: "Fri", submissions: 5 },
  { day: "Sat", submissions: 0 },
  { day: "Sun", submissions: 2 }
];
function SubmissionsChart() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", "data-ocid": "submissions-chart", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mb-2 uppercase tracking-wide font-semibold", children: "Submissions — Last 7 days" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 120, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      BarChart,
      {
        data: MOCK_CHART_DATA,
        margin: { top: 4, right: 4, left: -20, bottom: 0 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "hsl(var(--border))" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            XAxis,
            {
              dataKey: "day",
              tick: { fill: "hsl(var(--muted-foreground))", fontSize: 9 },
              axisLine: false,
              tickLine: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            YAxis,
            {
              tick: { fill: "hsl(var(--muted-foreground))", fontSize: 9 },
              axisLine: false,
              tickLine: false
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Tooltip,
            {
              contentStyle: {
                background: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "4px",
                fontSize: "11px",
                color: "hsl(var(--foreground))"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Bar,
            {
              dataKey: "submissions",
              fill: "hsl(var(--primary))",
              radius: [2, 2, 0, 0]
            }
          )
        ]
      }
    ) })
  ] });
}
function StageSelector({ vendor }) {
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  function moveToStage(newStage) {
    if (newStage === vendor.currentStage) return;
    if (stageRequiresApproval("vendor", newStage)) {
      createApproval.mutate(
        {
          entityId: vendor.id,
          entityType: "vendor",
          itemType: "stage_change",
          description: `Move ${vendor.name} to ${newStage}`,
          details: `Stage transition: ${vendor.currentStage} → ${newStage}`
        },
        {
          onSuccess: () => ue.info("Stage change queued for approval", {
            description: `${vendor.name} → ${newStage}`
          })
        }
      );
    } else {
      updateStage.mutate(
        { entityId: vendor.id, entityType: "vendor", newStage },
        { onSuccess: () => ue.success(`Stage updated to ${newStage}`) }
      );
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex items-center gap-1 flex-wrap mt-1",
      "data-ocid": "stage-selector",
      children: VENDOR_STAGES.map((s) => {
        const isCurrent = s === vendor.currentStage;
        const requiresApproval = stageRequiresApproval("vendor", s);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => moveToStage(s),
            disabled: isCurrent,
            className: [
              "px-2 py-0.5 text-[10px] rounded border transition-colors",
              isCurrent ? "bg-primary text-primary-foreground border-primary cursor-default" : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground"
            ].join(" "),
            title: requiresApproval ? "Requires approval" : void 0,
            children: [
              s,
              requiresApproval && !isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-1 text-[9px] opacity-60", children: "*" })
            ]
          },
          s
        );
      })
    }
  );
}
function VendorDetailPage() {
  const { vendorId } = useParams({ from: "/vendors/$vendorId" });
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  const vendor = vendors.find((v) => v.id === vendorId) ?? null;
  const { data: activities = [], isLoading: activitiesLoading } = useActivities(
    vendorId ?? ""
  );
  const { data: followUps = [] } = useFollowUps();
  const vendorFollowUps = followUps.filter(
    (f) => f.entityId === vendorId && f.status === "pending"
  );
  const updateVendor = useUpdateVendor();
  const [isEditing, setIsEditing] = reactExports.useState(false);
  const [showActivityModal, setShowActivityModal] = reactExports.useState(false);
  if (vendorsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-48" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-32 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20" }, i)) })
    ] });
  }
  if (!vendor) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Building2,
        title: "Vendor not found",
        message: "This vendor doesn't exist or was removed.",
        action: {
          label: "Back to Vendors",
          onClick: () => window.history.back()
        }
      }
    );
  }
  const status = computeHealthStatus(vendor.healthScore);
  const daysInStage = Math.floor((Date.now() - vendor.updatedAt) / 864e5);
  function handleSave(data) {
    updateVendor.mutate(
      { id: vendor.id, input: data },
      {
        onSuccess: () => {
          setIsEditing(false);
          ue.success("Vendor updated");
        },
        onError: () => ue.error("Update failed")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "vendor-detail-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border-b border-border px-4 py-3 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/vendors",
            className: "text-muted-foreground hover:text-foreground transition-colors",
            "data-ocid": "back-to-vendors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Vendors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-muted-foreground/50" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground font-medium truncate", children: vendor.name })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-foreground font-display leading-tight", children: vendor.name }),
            vendor.company && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-muted-foreground", children: [
              "· ",
              vendor.company
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              HealthBadge,
              {
                score: vendor.healthScore,
                status,
                showLabel: true,
                showScore: true,
                size: "lg"
              }
            )
          ] }),
          vendor.specialty && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: vendor.specialty }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StageSelector, { vendor })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            size: "sm",
            variant: "outline",
            onClick: () => setIsEditing(true),
            className: "h-7 gap-1 text-xs flex-shrink-0",
            "data-ocid": "edit-vendor-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
              "Edit"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StageProgressBar,
        {
          stages: VENDOR_STAGES,
          currentStage: vendor.currentStage,
          compact: true
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-[300px_1fr] gap-0 h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-r border-border flex flex-col gap-0 overflow-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2", children: "Contact Info" }),
          vendor.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3 text-muted-foreground flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `mailto:${vendor.email}`,
                className: "hover:text-primary transition-colors truncate",
                "data-ocid": "vendor-email",
                children: vendor.email
              }
            )
          ] }),
          vendor.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-muted-foreground flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `tel:${vendor.phone}`,
                className: "hover:text-primary transition-colors",
                "data-ocid": "vendor-phone",
                children: vendor.phone
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-3 w-3 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              daysInStage,
              "d in ",
              vendor.currentStage
            ] })
          ] }),
          vendor.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1.5 mt-2 leading-relaxed", children: vendor.notes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-semibold", children: "Metrics" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Today", value: "—", sub: "submissions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Total", value: "—", sub: "submissions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Accepted", value: "—", sub: "accepted" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Accept Rate", value: "—", sub: "%" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Avg Resp.", value: "—", sub: "hours" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(MetricCard, { label: "Quality", value: "—", sub: "/ 100" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SubmissionsChart, {})
        ] }),
        vendorFollowUps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-4 space-y-2 border-b border-border",
            "data-ocid": "vendor-follow-ups",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-semibold", children: [
                "Pending Follow-Ups (",
                vendorFollowUps.length,
                ")"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: vendorFollowUps.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FollowUpRow, { followUp: f }, f.id)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col overflow-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SharedProfilesSection, { vendorId }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Activity Timeline" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[9px] px-1.5", children: activities.length })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                onClick: () => setShowActivityModal(true),
                className: "h-7 gap-1 text-xs",
                "data-ocid": "add-activity-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                  "Log Activity"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto p-4", children: activitiesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActivityTimeline,
            {
              activities,
              emptyMessage: "No activities yet. Log the first interaction."
            }
          ) })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: isEditing,
        onOpenChange: setIsEditing,
        title: `Edit Vendor · ${vendor.name}`,
        size: "md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          EditVendorForm,
          {
            vendor,
            onSave: handleSave,
            onCancel: () => setIsEditing(false),
            isLoading: updateVendor.isPending
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: showActivityModal,
        onOpenChange: setShowActivityModal,
        title: "Log Activity",
        description: `Recording activity for ${vendor.name}`,
        size: "md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          LogActivityForm,
          {
            entityId: vendor.id,
            onDone: () => setShowActivityModal(false)
          }
        )
      }
    )
  ] });
}
export {
  VendorDetailPage as default
};
