import { c as createLucideIcon, w as useParams, G as useClients, I as useJobsForClient, J as useJobs, x as useActivities, y as useFollowUps, K as useUpdateClient, q as useUpdateEntityStage, s as useCreateApprovalItem, M as useCreateJob, N as useUpdateJob, r as reactExports, j as jsxRuntimeExports, l as Building2, L as Link, e as Badge, m as Briefcase, g as Button, v as ue, A as useUpdateFollowUpStatus } from "./index-D6lnvgsb.js";
import { M as Mail, a as Phone, P as Pen, A as ActivityTimeline } from "./ActivityTimeline-nR32_m5d.js";
import { A as AppModal } from "./AppModal-C9PDHzha.js";
import { E as EmptyState } from "./EmptyState-DDLMxpLD.js";
import { H as HealthBadge } from "./HealthBadge-D0KKIMqO.js";
import { S as StageProgressBar } from "./StageProgressBar-CavUDJtK.js";
import { I as Input } from "./input-BYWIipv0.js";
import { L as Label } from "./label-A68ha9bT.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CLdJCGL1.js";
import { S as Skeleton } from "./skeleton-5QCXauyp.js";
import { T as Textarea } from "./textarea-C2iLMWF7.js";
import { f as formatRelativeTime, b as formatCurrency } from "./format-DSqct7Mw.js";
import { n as nextStage, s as stageRequiresApproval, C as CLIENT_STAGES } from "./pipeline-FfiY-Q7s.js";
import { A as ArrowLeft } from "./arrow-left-CmuWJ1PJ.js";
import { T as TrendingDown } from "./trending-down-BTs5u4NR.js";
import { P as Plus } from "./plus-CyBujmpg.js";
import { M as MessageSquare } from "./message-square-C-ZN7McA.js";
import { C as CircleCheckBig } from "./circle-check-big-BUYhFxlE.js";
import { C as CircleX } from "./circle-x-CsOD8mov.js";
import { S as Send } from "./send-7spUV6D8.js";
import { C as Clock } from "./clock-ufeUZnnC.js";
import "./index-r8censFK.js";
import "./index-DS3ypJTE.js";
import "./check-8IAEo_5Q.js";
import "./index-DZDsO-fL.js";
import "./chevron-down-C0JKR27X.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
];
const Link2 = createLucideIcon("link-2", __iconNode);
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
function JobCard({ job, onEdit, onMarkFilled, onMarkClosed }) {
  const rateDisplay = job.rateMin && job.rateMax ? `${formatCurrency(job.rateMin)} – ${formatCurrency(job.rateMax)}` : job.rateMin ? `From ${formatCurrency(job.rateMin)}` : "Rate TBD";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "entity-card space-y-2", "data-ocid": "job-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate", children: job.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: rateDisplay })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(JobStatusBadge, { status: job.status })
    ] }),
    job.requirements && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground line-clamp-2 leading-snug", children: job.requirements }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 pt-1 border-t border-border/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-6 px-2 text-[10px] gap-1",
          onClick: () => onEdit(job),
          "data-ocid": "job-edit-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-2.5 w-2.5" }),
            "Edit"
          ]
        }
      ),
      job.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "h-6 px-2 text-[10px] gap-1 text-[oklch(0.68_0.22_142)]",
            onClick: () => onMarkFilled(job),
            "data-ocid": "job-mark-filled-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-2.5 w-2.5" }),
              "Mark Filled"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "h-6 px-2 text-[10px] gap-1 text-muted-foreground",
            onClick: () => onMarkClosed(job),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "h-2.5 w-2.5" }),
              "Close"
            ]
          }
        )
      ] })
    ] })
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
      {
        onSuccess: () => ue.success(`Follow-up ${status}`)
      }
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
  const { data: jobs, isLoading: jobsLoading } = useJobsForClient(clientId);
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
  const [linkJobId, setLinkJobId] = reactExports.useState("");
  const [isLinking, setIsLinking] = reactExports.useState(false);
  const client = (clients ?? []).find((c) => c.id === clientId);
  const followUps = (allFollowUps ?? []).filter((f) => f.entityId === clientId);
  const pendingFollowUps = followUps.filter((f) => f.status === "pending");
  const linkedJobIds = new Set((jobs ?? []).map((j) => j.id));
  const linkableJobs = allJobs.filter(
    (j) => j.status === "open" && !linkedJobIds.has(j.id)
  );
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
  async function handleLinkJob() {
    if (!linkJobId) return;
    setIsLinking(true);
    updateJobMutation.mutate(
      { id: linkJobId, input: { clientId } },
      {
        onSuccess: () => {
          ue.success("Job linked to client");
          setLinkJobId("");
          setIsLinking(false);
        },
        onError: () => {
          ue.error("Failed to link job");
          setIsLinking(false);
        }
      }
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
  const openJobs = (jobs ?? []).filter((j) => j.status === "open");
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
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-xs font-semibold text-foreground font-display uppercase tracking-wide", children: [
              "Job Orders",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-muted-foreground font-normal", children: [
                "(",
                (jobs ?? []).length,
                " total · ",
                openJobs.length,
                " open)"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "h-6 px-2 text-[10px] gap-1",
                onClick: () => setJobModalOpen(true),
                "data-ocid": "add-job-btn",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                  "Add Job"
                ]
              }
            )
          ] }),
          linkableJobs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mb-3 flex items-center gap-2 p-2.5 rounded-md border border-border bg-muted/20",
              "data-ocid": "link-job-section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "h-3.5 w-3.5 text-muted-foreground flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: linkJobId, onValueChange: setLinkJobId, children: [
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
                    disabled: !linkJobId || isLinking || updateJobMutation.isPending,
                    onClick: handleLinkJob,
                    "data-ocid": "link-job-btn",
                    children: isLinking ? "Linking…" : "Link Job"
                  }
                )
              ]
            }
          ),
          jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
          ] }) : (jobs ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Briefcase,
              title: "No job orders yet",
              message: "Add a new job order or link an existing one to this client.",
              action: {
                label: "Add Job Order",
                onClick: () => setJobModalOpen(true)
              },
              className: "py-6"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "job-orders-list", children: (jobs ?? []).map((job) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            JobCard,
            {
              job,
              onEdit: (j) => setEditingJob(j),
              onMarkFilled: handleJobMarkFilled,
              onMarkClosed: handleJobMarkClosed
            },
            job.id
          )) })
        ] }),
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
