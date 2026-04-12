import { c as createLucideIcon, x as useParams, a1 as useRecruiters, y as useActivities, r as reactExports, j as jsxRuntimeExports, L as Link, g as Button, a4 as ChartColumn, q as useUpdateEntityStage, a2 as RECRUITER_STAGES, C as ChevronRight, a5 as useLogRecruiterMetrics, H as useLogActivity, a6 as useRecruiterMetrics, a7 as useUpdateRecruiter, w as ue } from "./index-DEcjbVqe.js";
import { P as Pen, M as Mail, A as ActivityTimeline } from "./ActivityTimeline-DOFdHDTe.js";
import { A as AppModal } from "./AppModal-BenB6Lgj.js";
import { c as computeHealthStatus, H as HealthBadge, g as getHealthColor } from "./HealthBadge-jmRxr-16.js";
import { S as StageProgressBar } from "./StageProgressBar-Do8Gjmw1.js";
import { I as Input } from "./input-ChaUVwiJ.js";
import { L as Label } from "./label-CD4QrJlL.js";
import { S as Separator } from "./separator-CTnccedG.js";
import { S as Skeleton } from "./skeleton-CutlsRL1.js";
import { T as Textarea } from "./textarea-CqHObr6m.js";
import { A as ArrowLeft, P as Phone } from "./phone-ZWIyI_A-.js";
import { T as TrendingUp } from "./trending-up-DUUT3LCD.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "./BarChart-B-zPay0f.js";
import "./format-BHC1JPSL.js";
import "./calendar-check-ll_gNgC-.js";
import "./send-C77CZyMx.js";
import "./index-CQt9SKRH.js";
import "./index-0LXGdj5l.js";
import "./index-CqMCrgBb.js";
import "./index-BR-XLZeN.js";
import "./check-bOS3-8JR.js";
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
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5",
      key: "1gvzjb"
    }
  ],
  ["path", { d: "M9 18h6", key: "x1upvd" }],
  ["path", { d: "M10 22h4", key: "ceow96" }]
];
const Lightbulb = createLucideIcon("lightbulb", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2", key: "1nfge6" }],
  ["path", { d: "m14.305 16.53.923-.382", key: "1itpsq" }],
  ["path", { d: "m15.228 13.852-.923-.383", key: "eplpkm" }],
  ["path", { d: "m16.852 12.228-.383-.923", key: "13v3q0" }],
  ["path", { d: "m16.852 17.772-.383.924", key: "1i8mnm" }],
  ["path", { d: "m19.148 12.228.383-.923", key: "1q8j1v" }],
  ["path", { d: "m19.53 18.696-.382-.924", key: "vk1qj3" }],
  ["path", { d: "m20.772 13.852.924-.383", key: "n880s0" }],
  ["path", { d: "m20.772 16.148.924.383", key: "1g6xey" }],
  ["circle", { cx: "18", cy: "15", r: "3", key: "gjjjvw" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCog = createLucideIcon("user-cog", __iconNode);
function EditRecruiterModal({
  recruiter,
  open,
  onOpenChange
}) {
  const updateRecruiter = useUpdateRecruiter();
  const [form, setForm] = reactExports.useState({
    name: recruiter.name,
    email: recruiter.email,
    phone: recruiter.phone ?? "",
    title: recruiter.title ?? "",
    notes: recruiter.notes ?? ""
  });
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await updateRecruiter.mutateAsync({ id: recruiter.id, input: form });
      ue.success("Recruiter updated");
      onOpenChange(false);
    } catch {
      ue.error("Failed to update recruiter");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AppModal,
    {
      open,
      onOpenChange,
      title: "Edit Recruiter",
      size: "md",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Name *" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.name,
                onChange: (e) => handleChange("name", e.target.value),
                className: "h-8 text-xs bg-background",
                required: true,
                "data-ocid": "edit-recruiter-name"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Title" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: form.title ?? "",
                onChange: (e) => handleChange("title", e.target.value),
                placeholder: "Senior Recruiter",
                className: "h-8 text-xs bg-background",
                "data-ocid": "edit-recruiter-title"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "email",
              value: form.email,
              onChange: (e) => handleChange("email", e.target.value),
              className: "h-8 text-xs bg-background",
              required: true,
              "data-ocid": "edit-recruiter-email"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.phone ?? "",
              onChange: (e) => handleChange("phone", e.target.value),
              className: "h-8 text-xs bg-background",
              "data-ocid": "edit-recruiter-phone"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: form.notes ?? "",
              onChange: (e) => handleChange("notes", e.target.value),
              rows: 3,
              className: "text-xs bg-background resize-none",
              "data-ocid": "edit-recruiter-notes"
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
              className: "h-7 text-xs",
              onClick: () => onOpenChange(false),
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "sm",
              className: "h-7 text-xs",
              disabled: updateRecruiter.isPending,
              "data-ocid": "edit-recruiter-submit",
              children: updateRecruiter.isPending ? "Saving…" : "Save Changes"
            }
          )
        ] })
      ] })
    }
  );
}
function DailyCheckInForm({ recruiterId }) {
  const logMetrics = useLogRecruiterMetrics();
  const logActivity = useLogActivity();
  const todayStr = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const [form, setForm] = reactExports.useState({
    recruiterId,
    date: todayStr,
    callsMade: 0,
    emailsSent: 0,
    submissions: 0,
    interviewsScheduled: 0,
    tasksCompleted: 0
  });
  const [notes, setNotes] = reactExports.useState("");
  function handleNumChange(field, raw) {
    const val = Number.parseInt(raw, 10);
    setForm((prev) => ({ ...prev, [field]: Number.isNaN(val) ? 0 : val }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await logMetrics.mutateAsync(form);
      await logActivity.mutateAsync({
        entityId: recruiterId,
        activityType: "note",
        notes: notes ? `Daily check-in: ${notes}` : `Daily check-in logged — Calls: ${form.callsMade}, Emails: ${form.emailsSent}, Submissions: ${form.submissions}`,
        createdBy: "Manager"
      });
      ue.success("Check-in logged");
      setForm({
        recruiterId,
        date: todayStr,
        callsMade: 0,
        emailsSent: 0,
        submissions: 0,
        interviewsScheduled: 0,
        tasksCompleted: 0
      });
      setNotes("");
    } catch {
      ue.error("Failed to log check-in");
    }
  }
  const METRICS_FIELDS = [
    { key: "callsMade", label: "Calls Made", ocid: "checkin-calls" },
    { key: "emailsSent", label: "Emails Sent", ocid: "checkin-emails" },
    { key: "submissions", label: "Submissions", ocid: "checkin-submissions" },
    {
      key: "interviewsScheduled",
      label: "Interviews Scheduled",
      ocid: "checkin-interviews"
    },
    {
      key: "tasksCompleted",
      label: "Tasks Completed",
      ocid: "checkin-tasks"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: handleSubmit,
      className: "space-y-3",
      "data-ocid": "daily-checkin-form",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: form.date ?? todayStr,
              onChange: (e) => setForm((p) => ({ ...p, date: e.target.value })),
              className: "h-8 text-xs bg-background",
              "data-ocid": "checkin-date"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: METRICS_FIELDS.map(({ key, label, ocid }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 0,
              value: form[key] ?? 0,
              onChange: (e) => handleNumChange(key, e.target.value),
              className: "h-7 text-xs bg-background tabular-nums",
              "data-ocid": ocid
            }
          )
        ] }, key)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Notes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: notes,
              onChange: (e) => setNotes(e.target.value),
              placeholder: "Any blockers, wins, or updates...",
              rows: 2,
              className: "text-xs bg-background resize-none",
              "data-ocid": "checkin-notes"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            size: "sm",
            className: "w-full h-7 text-xs",
            disabled: logMetrics.isPending || logActivity.isPending,
            "data-ocid": "checkin-submit-btn",
            children: logMetrics.isPending ? "Logging…" : "Submit Check-In"
          }
        )
      ]
    }
  );
}
function PerformanceChart({ recruiterId }) {
  const { data: metricsHistory, isLoading } = useRecruiterMetrics(recruiterId);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-40 w-full" });
  }
  const last7 = (metricsHistory ?? []).slice(-7).map((m) => ({
    date: m.date.slice(5),
    // MM-DD
    calls: m.callsMade,
    subs: m.submissions
  }));
  if (last7.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-32 text-xs text-muted-foreground", children: "No metrics logged yet. Submit your first daily check-in." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 140, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    BarChart,
    {
      data: last7,
      margin: { top: 4, right: 4, left: -24, bottom: 0 },
      barCategoryGap: "30%",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          CartesianGrid,
          {
            strokeDasharray: "3 3",
            stroke: "oklch(0.22 0 0)",
            vertical: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          XAxis,
          {
            dataKey: "date",
            tick: { fontSize: 9, fill: "oklch(0.58 0 0)" },
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          YAxis,
          {
            tick: { fontSize: 9, fill: "oklch(0.58 0 0)" },
            axisLine: false,
            tickLine: false
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            contentStyle: {
              background: "oklch(0.16 0 0)",
              border: "1px solid oklch(0.22 0 0)",
              borderRadius: "4px",
              fontSize: "11px",
              color: "oklch(0.98 0 0)"
            },
            cursor: { fill: "oklch(0.22 0 0)" }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            dataKey: "calls",
            name: "Calls",
            fill: "oklch(0.5 0.18 207)",
            radius: [2, 2, 0, 0]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Bar,
          {
            dataKey: "subs",
            name: "Submissions",
            fill: "oklch(0.68 0.22 142)",
            radius: [2, 2, 0, 0]
          }
        )
      ]
    }
  ) });
}
function CoachingSuggestions({ score }) {
  if (score >= 70) return null;
  const suggestions = score < 40 ? [
    "Schedule an immediate 1:1 to discuss performance blockers",
    "Review daily goal-setting process and adjust targets",
    "Consider a short-term improvement plan with daily check-ins"
  ] : [
    "Consider a 1:1 meeting to address current challenges",
    "Review daily goal-setting process",
    "Identify specific activity areas needing improvement"
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-sm border border-[#eab308]/30 bg-[#eab308]/5 p-3 space-y-2",
      "data-ocid": "coaching-suggestions",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lightbulb, { className: "h-3.5 w-3.5 text-[#eab308]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-[#eab308]", children: "Coaching Suggestions" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-[#eab308]/60 mt-0.5 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground leading-snug", children: s })
        ] }, s)) })
      ]
    }
  );
}
function StageSelector({
  recruiterId,
  currentStage
}) {
  const updateStage = useUpdateEntityStage();
  async function handleStageClick(stage) {
    if (stage === currentStage) return;
    try {
      await updateStage.mutateAsync({
        entityId: recruiterId,
        entityType: "recruiter",
        newStage: stage
      });
      ue.success(`Stage updated to ${stage}`);
    } catch {
      ue.error("Failed to update stage");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "stage-selector", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StageProgressBar, { stages: RECRUITER_STAGES, currentStage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: RECRUITER_STAGES.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => handleStageClick(stage),
        disabled: updateStage.isPending,
        className: `text-[10px] px-2 py-0.5 rounded-sm border transition-smooth ${stage === currentStage ? "bg-primary/20 border-primary text-primary font-semibold" : "bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`,
        "data-ocid": `stage-btn-${stage.toLowerCase().replace(/\s+/g, "-")}`,
        children: stage
      },
      stage
    )) })
  ] });
}
function RecruiterDetailPage() {
  const { recruiterId } = useParams({ from: "/recruiters/$recruiterId" });
  const { data: recruiters, isLoading } = useRecruiters();
  const { data: activities, isLoading: activitiesLoading } = useActivities(recruiterId);
  const [editOpen, setEditOpen] = reactExports.useState(false);
  const recruiter = recruiters == null ? void 0 : recruiters.find((r) => r.id === recruiterId);
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-6 w-40" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-48 w-full" })
    ] });
  }
  if (!recruiter) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-64 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserCog, { className: "h-10 w-10 text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Recruiter not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recruiters", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-7 text-xs", children: "Back to Recruiters" }) })
    ] });
  }
  const healthStatus = computeHealthStatus(recruiter.healthScore);
  const healthColorClass = getHealthColor(healthStatus);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/recruiters", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "icon",
          className: "h-7 w-7 text-muted-foreground hover:text-foreground",
          "aria-label": "Back to recruiters",
          "data-ocid": "back-btn",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-3.5 w-3.5" })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display truncate", children: recruiter.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { status: healthStatus, showLabel: true, size: "sm" })
        ] }),
        recruiter.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: recruiter.title })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center flex-shrink-0 mr-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `text-2xl font-bold tabular-nums font-display ${healthColorClass}`,
            children: recruiter.healthScore
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground uppercase tracking-wide", children: "score" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "h-7 text-xs gap-1.5 flex-shrink-0",
          onClick: () => setEditOpen(true),
          "data-ocid": "edit-recruiter-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-3 w-3" }),
            "Edit"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4 overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Contact Info" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            recruiter.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "h-3 w-3 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `mailto:${recruiter.email}`,
                  className: "text-xs text-foreground hover:text-primary transition-colors truncate",
                  children: recruiter.email
                }
              )
            ] }),
            recruiter.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3 w-3 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `tel:${recruiter.phone}`,
                  className: "text-xs text-foreground hover:text-primary transition-colors",
                  children: recruiter.phone
                }
              )
            ] })
          ] }),
          recruiter.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2 leading-relaxed border-l-2 border-border pl-2", children: recruiter.notes })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "Pipeline Stage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StageSelector,
            {
              recruiterId: recruiter.id,
              currentStage: recruiter.currentStage
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CoachingSuggestions, { score: recruiter.healthScore }),
          recruiter.healthScore >= 70 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-[#22c55e]/30 bg-[#22c55e]/5 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-[#22c55e]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-[#22c55e]", children: "On Track" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "This recruiter is performing well. Keep up the great work!" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "h-3.5 w-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide", children: "Daily Check-In" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DailyCheckInForm, { recruiterId: recruiter.id })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4 overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-3.5 w-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide", children: "7-Day Performance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 ml-auto", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[9px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-sm bg-primary inline-block" }),
                "Calls"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[9px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-sm bg-[#22c55e] inline-block" }),
                "Submissions"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PerformanceChart, { recruiterId: recruiter.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3", children: "Activity Timeline" }),
          activitiesLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActivityTimeline,
            {
              activities: activities ?? [],
              emptyMessage: "No activities recorded yet. Submit a daily check-in to start the timeline."
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditRecruiterModal,
      {
        recruiter,
        open: editOpen,
        onOpenChange: setEditOpen
      }
    )
  ] });
}
export {
  RecruiterDetailPage as default
};
