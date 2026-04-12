import { w as useParams, o as useVendors, x as useActivities, y as useFollowUps, z as useUpdateVendor, r as reactExports, j as jsxRuntimeExports, l as Building2, L as Link, g as Button, e as Badge, v as ue, q as useUpdateEntityStage, s as useCreateApprovalItem, A as useUpdateFollowUpStatus, E as useSubmissionsForVendor, U as Users, F as useLogActivity } from "./index-D6lnvgsb.js";
import { P as Pen, M as Mail, a as Phone, A as ActivityTimeline } from "./ActivityTimeline-nR32_m5d.js";
import { A as AppModal } from "./AppModal-C9PDHzha.js";
import { E as EmptyState } from "./EmptyState-DDLMxpLD.js";
import { c as computeHealthStatus, H as HealthBadge } from "./HealthBadge-D0KKIMqO.js";
import { S as StageProgressBar } from "./StageProgressBar-CavUDJtK.js";
import { I as Input } from "./input-BYWIipv0.js";
import { L as Label } from "./label-A68ha9bT.js";
import { S as Skeleton } from "./skeleton-5QCXauyp.js";
import { T as Textarea } from "./textarea-C2iLMWF7.js";
import { V as VENDOR_STAGES, s as stageRequiresApproval } from "./pipeline-FfiY-Q7s.js";
import { A as ArrowLeft } from "./arrow-left-CmuWJ1PJ.js";
import { T as Timer } from "./timer-B_vQPCwZ.js";
import { P as Plus } from "./plus-CyBujmpg.js";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip, a as Bar } from "./BarChart-OKTB4p29.js";
import { C as CircleCheckBig } from "./circle-check-big-BUYhFxlE.js";
import { C as Clock } from "./clock-ufeUZnnC.js";
import { C as CircleX } from "./circle-x-CsOD8mov.js";
import "./format-DSqct7Mw.js";
import "./send-7spUV6D8.js";
import "./index-r8censFK.js";
import "./index-DS3ypJTE.js";
import "./check-8IAEo_5Q.js";
const STAGE_COLOR_MAP = {
  "Resume Sent": "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  "Screening Round": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  Selected: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  "Client Round": "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
  "Final Onboarding": "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800"
};
function StageBadge({ stage }) {
  if (!stage)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "—" });
  const cls = STAGE_COLOR_MAP[stage] ?? "bg-muted text-muted-foreground border-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${cls}`,
      children: stage
    }
  );
}
function SharedProfilesSection({ vendorId }) {
  const { data: submissions = [], isLoading } = useSubmissionsForVendor(vendorId);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-4 border-b border-border",
      "data-ocid": "shared-profiles-section",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-semibold", children: "Shared Profiles" }),
          submissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[9px] px-1.5 h-4", children: submissions.length })
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded" }, i)) }) : submissions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-md border border-border bg-muted/20 px-3 py-4 text-center",
            "data-ocid": "shared-profiles-empty",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No profiles shared yet" })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[1fr_1fr_1fr_80px] gap-2 px-3 py-1.5 bg-muted/30 border-b border-border", children: ["Candidate", "Job", "Stage", "Date"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider",
              children: h
            },
            h
          )) }),
          submissions.map((sub) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid grid-cols-[1fr_1fr_1fr_80px] gap-2 px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors duration-150 text-xs items-center",
              "data-ocid": "shared-profile-row",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: sub.candidateName || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: sub.jobTitle || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(StageBadge, { stage: sub.pipelineStage }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-[10px]", children: new Date(sub.submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric"
                }) })
              ]
            },
            sub.id
          ))
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
function StageSelector({
  vendor
}) {
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
        {
          onSuccess: () => ue.success(`Stage updated to ${newStage}`)
        }
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "/" }),
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-r border-border flex flex-col gap-0", children: [
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
        vendorFollowUps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", "data-ocid": "vendor-follow-ups", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wide font-semibold", children: [
            "Pending Follow-Ups (",
            vendorFollowUps.length,
            ")"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: vendorFollowUps.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FollowUpRow, { followUp: f }, f.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SharedProfilesSection, { vendorId })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
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
