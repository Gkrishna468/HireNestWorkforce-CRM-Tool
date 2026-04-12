import { c as createLucideIcon, x as useParams, a8 as useCandidates, y as useActivities, z as useFollowUps, E as useUpdateFollowUpStatus, r as reactExports, j as jsxRuntimeExports, P as PageLoadingSpinner, L as Link, g as Button, a9 as CANDIDATE_STAGES, f as cn, e as Badge, w as ue, q as useUpdateEntityStage, s as useCreateApprovalItem, H as useLogActivity, v as stageRequiresApproval, C as ChevronRight, ab as useSubmissionsForCandidate, ac as useSubmissionsForResume, O as useJobs, K as useClients, o as useVendors, ad as useUpdateSubmissionStage, ae as ALLOWED_STAGE_TRANSITIONS, I as PIPELINE_STAGE_LABELS, J as PIPELINE_STAGE_COLORS, af as useUpdateCandidate, ag as useCreateSubmission } from "./index-CJpsmfpK.js";
import { P as PageHeader } from "./PageHeader-CsXjutYr.js";
import { P as Pen, M as Mail, A as ActivityTimeline } from "./ActivityTimeline-DwVKOVv7.js";
import { A as AppModal } from "./AppModal-CMGlJVIa.js";
import { H as HealthBadge, a as getRelativeTime } from "./HealthBadge-b-RbYNDH.js";
import { S as StageProgressBar } from "./StageProgressBar-Cmrely4F.js";
import { I as Input } from "./input-CVTpUk17.js";
import { L as Label } from "./label-CqWHbwLo.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BpylCqla.js";
import { S as Separator } from "./separator-DM_e2R5w.js";
import { S as Skeleton } from "./skeleton-BFJlPyAO.js";
import { T as Textarea } from "./textarea-CvzG_4Xz.js";
import { b as formatCurrency } from "./format-CJbFH9ve.js";
import { L as Lock, u as useForm } from "./index.esm-DJWJX7Py.js";
import { U as User } from "./user-C2oeRYZs.js";
import { A as ArrowLeft, P as Phone } from "./phone-D7TIunYN.js";
import { C as Clock } from "./clock-C8EcWaCS.js";
import { M as MapPin } from "./map-pin-CDotiMm2.js";
import { C as CalendarCheck } from "./calendar-check-C7prNf68.js";
import { M as MessageSquare } from "./message-square-CBb1M5hD.js";
import { S as Send } from "./send-DH6yXayE.js";
import { P as Plus } from "./plus-IC8Sq5NJ.js";
import "./index-2-vS7hzN.js";
import "./index-n5rgdcR4.js";
import "./index-J1x_Esqe.js";
import "./index-iU0MTF0o.js";
import "./check-DXkir4aj.js";
import "./index-DIEZ0avb.js";
import "./chevron-down-B655r0WQ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }]
];
const DollarSign = createLucideIcon("dollar-sign", __iconNode);
function getPlacementReasoning(candidate, interviewCount) {
  const stageWeights = {
    Applied: 10,
    Screened: 20,
    Submitted: 35,
    Interview: 55,
    Offer: 80,
    Placed: 100,
    Retention: 100
  };
  const base = stageWeights[candidate.currentStage] ?? 10;
  const healthBonus = candidate.healthScore >= 70 ? 5 : candidate.healthScore >= 40 ? 0 : -10;
  const interviewBonus = interviewCount > 0 ? Math.min(10, interviewCount * 3) : 0;
  const prob = Math.min(100, Math.max(0, base + healthBonus + interviewBonus));
  const reasons = [];
  reasons.push(`Stage: ${candidate.currentStage} (base ${base}%)`);
  if (healthBonus > 0) reasons.push("Strong health score (+5%)");
  if (healthBonus < 0) reasons.push("Low health score (-10%)");
  if (interviewBonus > 0)
    reasons.push(`${interviewCount} interview(s) logged (+${interviewBonus}%)`);
  if (candidate.currentStage === "Offer" || candidate.currentStage === "Placed") {
    reasons.push("Offer/placement in progress");
  }
  return { prob, reason: reasons.join(" · ") };
}
function probColor(prob) {
  return prob >= 70 ? "text-[#22c55e]" : prob >= 40 ? "text-[#eab308]" : "text-[#ef4444]";
}
function getDaysInStageSince(updatedAt) {
  return Math.floor((Date.now() - updatedAt) / (1e3 * 60 * 60 * 24));
}
function PipelineStageBadge({
  stage
}) {
  if (!stage)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: "—" });
  const color = PIPELINE_STAGE_COLORS[stage] ?? "#6b7280";
  const label = PIPELINE_STAGE_LABELS[stage] ?? stage;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border",
      style: {
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}15`
      },
      children: label
    }
  );
}
function RejectionModal({ open, onClose, onConfirm }) {
  const [reason, setReason] = reactExports.useState("");
  const REASONS = [
    "Not a skill fit",
    "Overqualified",
    "Salary expectation mismatch",
    "Client declined",
    "Candidate withdrew",
    "Position closed",
    "Failed background check",
    "Other"
  ];
  function handleConfirm() {
    if (!reason.trim()) {
      ue.error("Please select or enter a rejection reason");
      return;
    }
    onConfirm(reason);
    setReason("");
    onClose();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AppModal,
    {
      open,
      onOpenChange: onClose,
      title: "Rejection Reason",
      size: "sm",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "rejection-modal", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Reason *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: setReason, value: reason, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 text-xs",
                "data-ocid": "rejection-reason-select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a reason..." })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: REASONS.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Additional notes (optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: reason.startsWith("Other") ? reason.replace("Other", "").trim() : "",
              onChange: (e) => setReason(`Other: ${e.target.value}`),
              placeholder: "Explain further...",
              className: "text-xs resize-none h-16",
              "data-ocid": "rejection-notes-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "outline",
              size: "sm",
              onClick: onClose,
              className: "h-7 text-xs",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              className: "h-7 text-xs bg-[#ef4444] hover:bg-[#dc2626] text-white",
              onClick: handleConfirm,
              "data-ocid": "rejection-confirm-btn",
              children: "Confirm Rejection"
            }
          )
        ] })
      ] })
    }
  );
}
function ActiveSubmissionsSection({
  candidateId,
  resumeId
}) {
  const { data: submissionsByCandidate = [], isLoading: loadingByCandidate } = useSubmissionsForCandidate(candidateId);
  const { data: submissionsByResume = [], isLoading: loadingByResume } = useSubmissionsForResume(resumeId ?? "");
  const { data: jobs = [] } = useJobs();
  const { data: clients = [] } = useClients();
  const { data: vendors = [] } = useVendors();
  const updateStage = useUpdateSubmissionStage();
  const [showSubmit, setShowSubmit] = reactExports.useState(false);
  const [rejectionTarget, setRejectionTarget] = reactExports.useState(null);
  const isLoading = loadingByCandidate || !!resumeId && loadingByResume;
  const submissions = reactExports.useMemo(() => {
    const seen = /* @__PURE__ */ new Set();
    const merged = [...submissionsByCandidate, ...submissionsByResume];
    return merged.filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [submissionsByCandidate, submissionsByResume]);
  const jobMap = reactExports.useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);
  const clientMap = reactExports.useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients]
  );
  const vendorMap = reactExports.useMemo(
    () => new Map(vendors.map((v) => [v.id, v])),
    [vendors]
  );
  async function handleStageChange(sub, nextStage) {
    if (nextStage === "rejected") {
      setRejectionTarget({ submissionId: sub.id, nextStage });
      return;
    }
    try {
      await updateStage.mutateAsync({
        id: sub.id,
        update: { stage: nextStage }
      });
      ue.success(`Stage updated to ${PIPELINE_STAGE_LABELS[nextStage]}`);
    } catch {
      ue.error("Failed to update stage");
    }
  }
  async function handleRejectionConfirm(reason) {
    if (!rejectionTarget) return;
    try {
      await updateStage.mutateAsync({
        id: rejectionTarget.submissionId,
        update: { stage: "rejected", rejectionReason: reason }
      });
      ue.success("Submission rejected");
    } catch {
      ue.error("Failed to reject submission");
    }
    setRejectionTarget(null);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", "data-ocid": "submissions-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5 text-muted-foreground" }),
          "Active Submissions",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1", children: submissions.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "h-6 text-[10px] gap-1 px-2",
            onClick: () => setShowSubmit(true),
            "data-ocid": "submit-to-job-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
              "Submit to Job"
            ]
          }
        )
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
      ] }) : submissions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded-sm border border-dashed border-border/60 p-4 text-center",
          "data-ocid": "submissions-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-6 h-6 text-muted-foreground/30 mx-auto mb-2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "No active submissions for this candidate." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-0.5", children: 'Use "Submit to Job" on the Resumes page to get started.' })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-sm border border-border overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_100px_110px_60px_100px_110px] gap-0 bg-muted/50 border-b border-border px-3 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Job Title" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Client" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Stage" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right", children: "Days" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Vendor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Action" })
        ] }),
        submissions.map((sub) => {
          const job = jobMap.get(sub.jobId);
          const client = job ? clientMap.get(job.clientId) : void 0;
          const vendor = sub.vendorId ? vendorMap.get(sub.vendorId) : void 0;
          const currentStage = sub.pipelineStage;
          const nextStages = currentStage ? ALLOWED_STAGE_TRANSITIONS[currentStage] ?? [] : [];
          const clientName = (client == null ? void 0 : client.name) ?? sub.clientName ?? (job == null ? void 0 : job.clientName) ?? "—";
          const vendorName = (vendor == null ? void 0 : vendor.name) ?? "—";
          const jobTitle = (job == null ? void 0 : job.title) ?? sub.jobTitle ?? "Unknown Job";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid grid-cols-[1fr_100px_110px_60px_100px_110px] gap-0 px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors",
              "data-ocid": "submission-row",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 pr-2 flex items-center", children: job ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Link,
                  {
                    to: "/jobs",
                    className: "text-xs font-medium text-primary hover:underline truncate block",
                    children: jobTitle
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-foreground truncate", children: jobTitle }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground truncate", children: clientName }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PipelineStageBadge, { stage: currentStage }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: cn(
                      "text-[11px] font-medium",
                      sub.daysInStage > 7 ? "text-[#ef4444]" : "text-muted-foreground"
                    ),
                    children: [
                      sub.daysInStage,
                      "d"
                    ]
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-w-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground truncate", children: vendorName }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: nextStages.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Select,
                  {
                    onValueChange: (v) => handleStageChange(sub, v),
                    value: "",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        SelectTrigger,
                        {
                          className: "h-6 text-[10px] w-[100px]",
                          "data-ocid": "stage-action-select",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Move to…" })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: nextStages.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "flex items-center gap-1.5",
                          style: { color: PIPELINE_STAGE_COLORS[s] },
                          children: [
                            s === "rejected" ? "✕ " : "→ ",
                            PIPELINE_STAGE_LABELS[s]
                          ]
                        }
                      ) }, s)) })
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50 italic", children: currentStage === "onboarding" ? "Final stage" : "No actions" }) })
              ]
            },
            sub.id
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RejectionModal,
      {
        open: !!rejectionTarget,
        onClose: () => setRejectionTarget(null),
        onConfirm: handleRejectionConfirm
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubmitJobModal,
      {
        open: showSubmit,
        onClose: () => setShowSubmit(false),
        candidateId,
        candidateName: ""
      }
    )
  ] });
}
const RATE_APPROVAL_THRESHOLD = 150;
function SubmitJobModal({
  open,
  onClose,
  candidateId,
  candidateName
}) {
  const { data: jobs = [] } = useJobs();
  const createSubmission = useCreateSubmission();
  const createApproval = useCreateApprovalItem();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting }
  } = useForm();
  const openJobs = jobs.filter((j) => j.status === "open");
  async function onSubmit(data) {
    try {
      await createSubmission.mutateAsync({
        candidateId,
        jobId: data.jobId,
        rateProposed: data.rateProposed ? Number(data.rateProposed) : void 0
      });
      if (data.rateProposed && Number(data.rateProposed) > RATE_APPROVAL_THRESHOLD) {
        await createApproval.mutateAsync({
          entityId: candidateId,
          entityType: "candidate",
          itemType: "submission_rate",
          description: `High-rate submission: ${candidateName} at $${data.rateProposed}/hr`,
          details: `Rate $${data.rateProposed}/hr exceeds threshold of $${RATE_APPROVAL_THRESHOLD}/hr. Manager approval required.`,
          requestedBy: "system"
        });
        ue.warning(
          `Approval required: rate $${data.rateProposed}/hr exceeds threshold`
        );
      } else {
        ue.success("Submitted to job successfully");
      }
      reset();
      onClose();
    } catch {
      ue.error("Failed to submit candidate");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AppModal,
    {
      open,
      onOpenChange: onClose,
      title: "Submit to Job",
      size: "md",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSubmit(onSubmit),
          className: "space-y-3",
          "data-ocid": "submit-job-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Job *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (v) => setValue("jobId", v), required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "h-8 text-xs",
                    "data-ocid": "submit-job-select",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a job..." })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: openJobs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "none", disabled: true, children: "No open jobs" }) : openJobs.map((j) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: j.id, children: [
                  j.title,
                  " ",
                  j.clientName ? `· ${j.clientName}` : ""
                ] }, j.id)) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                "Rate Proposed ($/hr)",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  "(over $",
                  RATE_APPROVAL_THRESHOLD,
                  " requires approval)"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ...register("rateProposed", { valueAsNumber: true }),
                  type: "number",
                  placeholder: "e.g. 85",
                  className: "h-8 text-xs",
                  "data-ocid": "submit-rate-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: onClose,
                  className: "h-7 text-xs",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  disabled: isSubmitting,
                  className: "h-7 text-xs",
                  "data-ocid": "submit-job-btn",
                  children: isSubmitting ? "Submitting..." : "Submit Candidate"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function EditCandidateModal({
  open,
  onClose,
  candidate
}) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      title: candidate.title,
      skills: candidate.skills,
      salaryMin: candidate.salaryMin,
      salaryMax: candidate.salaryMax,
      notes: candidate.notes
    }
  });
  const updateCandidate = useUpdateCandidate();
  const { data: vendors = [] } = useVendors();
  async function onSubmit(data) {
    try {
      await updateCandidate.mutateAsync({ id: candidate.id, input: data });
      ue.success("Candidate updated");
      onClose();
    } catch {
      ue.error("Failed to update candidate");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AppModal,
    {
      open,
      onOpenChange: onClose,
      title: "Edit Candidate",
      size: "lg",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSubmit(onSubmit),
          className: "space-y-3",
          "data-ocid": "edit-candidate-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("name", { required: true }),
                    className: "h-8 text-xs"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("email", { required: true }),
                    type: "email",
                    className: "h-8 text-xs"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...register("phone"), className: "h-8 text-xs" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { ...register("title"), className: "h-8 text-xs" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Skills" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  ...register("skills"),
                  className: "text-xs resize-none h-16"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
                "Vendor",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(which vendor is processing this profile)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  onValueChange: (v) => setValue("vendorId", v === "__none__" ? void 0 : v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-8 text-xs",
                        "data-ocid": "edit-vendor-select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select vendor (optional)…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", children: "— None —" }),
                      vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: v.id, children: [
                        v.name,
                        v.company ? ` · ${v.company}` : ""
                      ] }, v.id))
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Salary Min ($)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("salaryMin", { valueAsNumber: true }),
                    type: "number",
                    className: "h-8 text-xs"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Salary Max ($)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("salaryMax", { valueAsNumber: true }),
                    type: "number",
                    className: "h-8 text-xs"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Notes" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  ...register("notes"),
                  className: "text-xs resize-none h-16"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "outline",
                  size: "sm",
                  onClick: onClose,
                  className: "h-7 text-xs",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  disabled: isSubmitting,
                  className: "h-7 text-xs",
                  "data-ocid": "edit-candidate-submit",
                  children: isSubmitting ? "Saving..." : "Save Changes"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function StageActions({ candidate }) {
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const logActivity = useLogActivity();
  const currentIdx = CANDIDATE_STAGES.indexOf(candidate.currentStage);
  const nextStage = currentIdx < CANDIDATE_STAGES.length - 1 ? CANDIDATE_STAGES[currentIdx + 1] : null;
  async function moveTo(stage) {
    if (stageRequiresApproval("candidate", stage)) {
      try {
        await createApproval.mutateAsync({
          entityId: candidate.id,
          entityType: "candidate",
          itemType: "stage_change",
          description: `Stage change: ${candidate.name} → ${stage}`,
          details: `Moving from ${candidate.currentStage} to ${stage}. Requires manager approval.`,
          requestedBy: "system"
        });
        ue.info(`Approval requested to move to ${stage}`);
      } catch {
        ue.error("Failed to request approval");
      }
    } else {
      try {
        await updateStage.mutateAsync({
          entityId: candidate.id,
          entityType: "candidate",
          newStage: stage
        });
        await logActivity.mutateAsync({
          entityId: candidate.id,
          activityType: "stage_change",
          notes: `Stage changed from ${candidate.currentStage} to ${stage}`
        });
        ue.success(`Moved to ${stage}`);
      } catch {
        ue.error("Failed to update stage");
      }
    }
  }
  if (!nextStage) return null;
  const requiresApproval = stageRequiresApproval("candidate", nextStage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      size: "sm",
      variant: "outline",
      className: "h-7 text-xs gap-1",
      onClick: () => moveTo(nextStage),
      "data-ocid": "move-stage-btn",
      children: [
        requiresApproval && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 text-[#eab308]" }),
        "Move to ",
        nextStage,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
      ]
    }
  );
}
function LogActivityPanel({ candidateId }) {
  const [note, setNote] = reactExports.useState("");
  const [type, setType] = reactExports.useState(
    "note"
  );
  const logActivity = useLogActivity();
  async function handleLog() {
    if (!note.trim()) return;
    try {
      await logActivity.mutateAsync({
        entityId: candidateId,
        activityType: type,
        notes: note
      });
      setNote("");
      ue.success("Activity logged");
    } catch {
      ue.error("Failed to log activity");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "log-activity-panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: (v) => setType(v), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectTrigger,
        {
          className: "h-7 text-xs w-28 flex-shrink-0",
          "data-ocid": "activity-type-select",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "note", children: "Note" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "call", children: "Call" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "email", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "meeting", children: "Meeting" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        value: note,
        onChange: (e) => setNote(e.target.value),
        placeholder: "Add a note...",
        className: "h-7 text-xs flex-1",
        onKeyDown: (e) => e.key === "Enter" && handleLog(),
        "data-ocid": "activity-note-input"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        size: "sm",
        className: "h-7 text-xs px-2",
        onClick: handleLog,
        "data-ocid": "log-activity-submit",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" })
      }
    )
  ] }) });
}
function CandidateDetailPage() {
  const { candidateId } = useParams({ from: "/candidates/$candidateId" });
  const { data: candidates = [], isLoading } = useCandidates();
  const { data: activities = [], isLoading: loadingActivities } = useActivities(candidateId);
  const { data: followUps = [] } = useFollowUps();
  const updateFollowUp = useUpdateFollowUpStatus();
  const [showEdit, setShowEdit] = reactExports.useState(false);
  const candidate = candidates.find((c) => c.id === candidateId);
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoadingSpinner, {});
  if (!candidate) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-12 h-12 text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Candidate not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/candidates", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "h-7 text-xs gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
        "Back to Candidates"
      ] }) })
    ] });
  }
  const interviewActivities = activities.filter(
    (a) => a.activityType === "interview"
  );
  const { prob, reason } = getPlacementReasoning(
    candidate,
    interviewActivities.length
  );
  const days = getDaysInStageSince(candidate.updatedAt);
  const candidateFollowUps = followUps.filter(
    (f) => f.entityId === candidateId && f.status === "pending"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "candidate-detail-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: candidate.name,
        subtitle: candidate.title ?? "Candidate",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StageActions, { candidate }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 text-xs gap-1",
              onClick: () => setShowEdit(true),
              "data-ocid": "edit-candidate-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3 h-3" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/candidates", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", size: "sm", className: "h-7 text-xs gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-3.5 h-3.5" }),
            "Back"
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      StageProgressBar,
      {
        stages: CANDIDATE_STAGES,
        currentStage: candidate.currentStage
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-1 p-4 space-y-4 bg-card/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            HealthBadge,
            {
              score: candidate.healthScore,
              showLabel: true,
              showScore: true,
              size: "md"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3" }),
            days,
            "d in stage"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-sm border border-border p-3 bg-card space-y-1",
            "data-ocid": "placement-probability",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Placement Probability" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "span",
                  {
                    className: cn(
                      "text-lg font-bold font-display",
                      probColor(prob)
                    ),
                    children: [
                      prob,
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground leading-relaxed", children: reason }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 bg-muted rounded-full overflow-hidden mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "h-full rounded-full transition-smooth",
                    prob >= 70 ? "bg-[#22c55e]" : prob >= 40 ? "bg-[#eab308]" : "bg-[#ef4444]"
                  ),
                  style: { width: `${prob}%` }
                }
              ) })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: `mailto:${candidate.email}`,
                  className: "text-primary hover:underline truncate",
                  children: candidate.email
                }
              )
            ] }),
            candidate.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3 h-3 text-muted-foreground flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: candidate.phone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        candidate.skills && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Skills" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: candidate.skills.split(/[,\n]/).filter(Boolean).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "text-[10px] h-5 px-1.5",
              children: s.trim()
            },
            s.trim()
          )) })
        ] }),
        (candidate.salaryMin || candidate.salaryMax) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Salary Expectation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-3 h-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: candidate.salaryMin && candidate.salaryMax ? `${formatCurrency(candidate.salaryMin)} – ${formatCurrency(candidate.salaryMax)}` : candidate.salaryMin ? `From ${formatCurrency(candidate.salaryMin)}` : `Up to ${formatCurrency(candidate.salaryMax ?? 0)}` })
          ] })
        ] }),
        candidate.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Experience / Availability" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-relaxed", children: candidate.notes })
        ] }),
        candidate.assignedRecruiter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3 h-3 text-muted-foreground" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground capitalize", children: candidate.assignedRecruiter })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Created" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getRelativeTime(candidate.createdAt) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Last updated" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: getRelativeTime(candidate.updatedAt) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 flex flex-col divide-y divide-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActiveSubmissionsSection, { candidateId }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", "data-ocid": "interviews-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-3.5 h-3.5 text-muted-foreground" }),
            "Interviews",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1", children: interviewActivities.length })
          ] }),
          interviewActivities.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground py-1", children: "No interviews logged yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: interviewActivities.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, { className: "w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground leading-snug", children: a.notes ?? "Interview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: getRelativeTime(a.createdAt) })
            ] })
          ] }, a.id)) })
        ] }),
        candidateFollowUps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3", "data-ocid": "followups-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-foreground flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3.5 h-3.5 text-muted-foreground" }),
            "Pending Follow-ups",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[10px] h-4 px-1", children: candidateFollowUps.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: candidateFollowUps.map((fu) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "rounded-sm border border-[#eab308]/30 bg-[#eab308]/5 p-2.5 space-y-2",
              "data-ocid": "followup-item",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground", children: fu.suggestedAction }),
                fu.suggestedMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground italic", children: [
                  '"',
                  fu.suggestedMessage,
                  '"'
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      className: "h-6 text-[10px] px-2",
                      onClick: () => {
                        updateFollowUp.mutate({
                          id: fu.id,
                          status: "approved",
                          approvedBy: "manager"
                        });
                        ue.success("Follow-up approved");
                      },
                      "data-ocid": "followup-approve-btn",
                      children: "Approve"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "outline",
                      className: "h-6 text-[10px] px-2",
                      onClick: () => {
                        updateFollowUp.mutate({
                          id: fu.id,
                          status: "rejected"
                        });
                        ue.info("Follow-up rejected");
                      },
                      "data-ocid": "followup-reject-btn",
                      children: "Reject"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      size: "sm",
                      variant: "ghost",
                      className: "h-6 text-[10px] px-2",
                      onClick: () => {
                        updateFollowUp.mutate({
                          id: fu.id,
                          status: "snoozed",
                          snoozedUntil: Date.now() + 864e5
                        });
                        ue.info("Snoozed 24h");
                      },
                      "data-ocid": "followup-snooze-btn",
                      children: "Snooze"
                    }
                  )
                ] })
              ]
            },
            fu.id
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-3 flex-1", "data-ocid": "activity-section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Activity Timeline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogActivityPanel, { candidateId }),
          loadingActivities ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            ActivityTimeline,
            {
              activities,
              emptyMessage: "No activities yet. Log the first one above."
            }
          )
        ] })
      ] })
    ] }) }),
    showEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditCandidateModal,
      {
        open: showEdit,
        onClose: () => setShowEdit(false),
        candidate
      }
    )
  ] });
}
export {
  CandidateDetailPage as default
};
