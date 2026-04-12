import { r as reactExports, aj as useResumes, j as jsxRuntimeExports, t as getSupabaseCreds, L as Link, ah as FileText, w as ue, X, O as useJobs, ax as scoreJobMatch, m as Briefcase, g as Button, ay as Search, az as useCreateResume, aA as useCheckDuplicateResume, aB as useFindSimilarCandidates, o as useVendors, ag as useCreateSubmission, aC as useDeleteResume, aD as useListSubmissionsForResume, e as Badge, aE as extractTextFromDocx, aF as extractTextFromPdf, aG as parseResumeText, aH as extractNameFromFilename } from "./index-CpSJjNwR.js";
import { I as Input } from "./input-DWH0TVGo.js";
import { L as Label } from "./label-C4HuO0xA.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as ChevronUp } from "./select-C0mXFfcL.js";
import { S as Skeleton } from "./skeleton-8fLA04qm.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BMDAeCxj.js";
import { T as Textarea } from "./textarea-DM7sxUck.js";
import { C as CircleAlert } from "./circle-alert-CAUsXTKV.js";
import { A as ArrowLeft, P as Phone } from "./phone-DsMbC_hQ.js";
import { U as Upload } from "./upload-D_CjJ-E-.js";
import { U as User } from "./user-CGyvvuzB.js";
import { M as MapPin } from "./map-pin-CxInD-aE.js";
import { C as CircleCheck } from "./circle-check-DsIiVnDX.js";
import { S as Send } from "./send-DSJOK1_e.js";
import { C as ChevronDown } from "./chevron-down-Bg2uxFH2.js";
import { T as Trash2 } from "./trash-2-DSNo5HlO.js";
import { E as Eye } from "./eye-6Uj1OtpN.js";
import "./index-DNU70FME.js";
import "./index-GZ4sKuuH.js";
import "./index-sScdA8mR.js";
import "./check-DHkMFMvm.js";
function ScoreBadge({ score }) {
  if (score >= 70)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tabular-nums", children: [
      score,
      "%"
    ] });
  if (score >= 40)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 tabular-nums", children: [
      score,
      "%"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border tabular-nums", children: [
    score,
    "%"
  ] });
}
function StatusBadge({ status }) {
  if (status === "active")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
      "Active"
    ] });
  if (status === "duplicate")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }),
      "Duplicate"
    ] });
  if (status === "archived")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-muted-foreground/50" }),
      "Archived"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
    "Pending"
  ] });
}
function similarityLabel(score) {
  if (score >= 80)
    return {
      label: "High risk",
      bg: "bg-red-500/15",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/25",
      panelBg: "bg-red-50 dark:bg-red-900/20",
      panelBorder: "border-red-500/30"
    };
  if (score >= 50)
    return {
      label: "Possible match",
      bg: "bg-amber-500/15",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-500/25",
      panelBg: "bg-amber-50 dark:bg-amber-900/20",
      panelBorder: "border-amber-500/30"
    };
  return {
    label: "Low match",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    panelBg: "bg-muted/30",
    panelBorder: "border-border"
  };
}
function FuzzyMatchesPanel({
  matches,
  isChecking,
  onMarkSamePersonAndSave,
  isSaving
}) {
  const [expandedId, setExpandedId] = reactExports.useState(null);
  if (!isChecking && matches.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "fuzzy-matches-panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground", children: "Possible matches" }),
      isChecking && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground animate-pulse", children: "Checking for matches…" }),
      !isChecking && matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
        matches.length,
        " candidate",
        matches.length !== 1 ? "s" : "",
        " found"
      ] })
    ] }),
    !isChecking && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-56 overflow-y-auto pr-0.5", children: matches.slice(0, 3).map((m) => {
      const style = similarityLabel(m.similarityScore);
      const isExpanded = expandedId === m.id;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: `rounded-lg border p-3 ${style.panelBg} ${style.panelBorder}`,
          "data-ocid": `fuzzy-match-${m.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground truncate", children: m.candidateName || "Unknown" }),
                  m.extractedRole && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground truncate", children: [
                    "· ",
                    m.extractedRole
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 mt-1.5", children: m.matchReasons.map((reason) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded-full bg-card border border-border text-muted-foreground",
                    children: reason
                  },
                  reason
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${style.bg} ${style.text} ${style.border}`,
                  children: [
                    m.similarityScore,
                    "%",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-normal", children: style.label })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => setExpandedId(isExpanded ? null : m.id),
                  className: "inline-flex items-center gap-1 text-[10px] text-primary hover:underline",
                  "data-ocid": `fuzzy-view-profile-${m.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-2.5 w-2.5" }),
                    isExpanded ? "Hide profile" : "View profile"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  size: "sm",
                  variant: "outline",
                  className: `h-6 text-[10px] px-2 border-current ${style.text}`,
                  onClick: () => onMarkSamePersonAndSave(m.id),
                  disabled: isSaving,
                  "data-ocid": `fuzzy-same-person-${m.id}`,
                  children: "This is the same person"
                }
              )
            ] }),
            isExpanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 rounded-lg bg-card border border-border p-2.5 space-y-1.5 text-[10px]", children: [
              m.email && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Email:" }),
                m.email
              ] }),
              m.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground", children: "Phone:" }),
                m.phone
              ] }),
              m.extractedSkills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 pt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground mr-1", children: "Skills:" }),
                m.extractedSkills.slice(0, 5).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "px-1 py-0.5 rounded bg-muted border border-border text-muted-foreground",
                    children: s
                  },
                  s
                )),
                m.extractedSkills.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  "+",
                  m.extractedSkills.length - 5
                ] })
              ] })
            ] })
          ]
        },
        m.id
      );
    }) })
  ] });
}
function DropZone({ onFileSelected }) {
  const fileInputRef = reactExports.useRef(null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const name = file.name.toLowerCase();
      const valid = name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".doc");
      if (!valid) {
        ue.error("Unsupported file type", {
          description: "Please upload a PDF or Word (.docx) document."
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        ue.error("File too large", {
          description: "Maximum file size is 10MB."
        });
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "label",
    {
      onDragOver: (e) => {
        e.preventDefault();
        setIsDragging(true);
      },
      onDragLeave: () => setIsDragging(false),
      onDrop: handleDrop,
      "aria-label": "Upload resume — click or drag and drop",
      "data-ocid": "resume-dropzone",
      className: `
        relative flex flex-col items-center justify-center gap-4 py-14 px-6
        rounded-xl border-2 border-dashed cursor-pointer select-none
        transition-all duration-200 text-center group
        ${isDragging ? "border-primary bg-primary/8 scale-[1.01]" : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"}
      `,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${isDragging ? "bg-primary/20 scale-110" : "bg-primary/10 group-hover:bg-primary/15"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Upload,
              {
                className: `h-6 w-6 transition-colors duration-200 ${isDragging ? "text-primary" : "text-primary/70 group-hover:text-primary"}`
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            "Drop PDF or DOCX resume here, or",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary underline underline-offset-2", children: "click to browse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: "Supports PDF and Word (.docx, .doc) · Max 10MB" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: ".pdf,.doc,.docx",
            className: "sr-only",
            tabIndex: 0,
            onChange: (e) => {
              var _a;
              const file = (_a = e.target.files) == null ? void 0 : _a[0];
              if (!file) return;
              const name = file.name.toLowerCase();
              const valid = name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".doc");
              if (!valid) {
                ue.error("Unsupported file type", {
                  description: "Please upload a PDF or Word (.docx) document."
                });
                e.target.value = "";
                return;
              }
              if (file.size > 10 * 1024 * 1024) {
                ue.error("File too large", {
                  description: "Maximum file size is 10MB."
                });
                e.target.value = "";
                return;
              }
              onFileSelected(file);
              e.target.value = "";
            }
          }
        )
      ]
    }
  );
}
function SubmitJobModal({ resume, onClose, onSubmitted }) {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: vendors = [] } = useVendors();
  const createSubmission = useCreateSubmission();
  const [selectedJobId, setSelectedJobId] = reactExports.useState("");
  const [selectedVendorId, setSelectedVendorId] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const openJobs = jobs.filter((j) => j.status === "open");
  async function handleSubmit() {
    if (!selectedJobId) {
      ue.error("Please select a job to submit to.");
      return;
    }
    const job = openJobs.find((j) => j.id === selectedJobId);
    try {
      await createSubmission.mutateAsync({
        candidateId: resume.id,
        resumeId: resume.id,
        jobId: selectedJobId,
        vendorId: selectedVendorId || void 0,
        pipelineStage: "resume_sent",
        notes: notes.trim() || void 0,
        submittedBy: resume.candidateName
      });
      onSubmitted((job == null ? void 0 : job.title) ?? "Job");
      onClose();
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
      "data-ocid": "submit-job-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 px-6 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display", children: "Submit to Job" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate max-w-xs", children: resume.candidateName || resume.fileName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Close",
              className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
              "Job ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-md" }) : openJobs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "No open jobs.",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", className: "underline text-primary", children: "Add a job" }),
                " ",
                "first."
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedJobId, onValueChange: setSelectedJobId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-9 text-sm",
                  "data-ocid": "submit-job-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select open job…" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: openJobs.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: job.id, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: job.title }),
                job.clientName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground text-xs", children: [
                  "· ",
                  job.clientName
                ] }),
                job.rateAmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground text-xs", children: [
                  "· ",
                  job.rateAmount,
                  " ",
                  job.rateType
                ] })
              ] }, job.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
              "Source Vendor",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedVendorId,
                onValueChange: setSelectedVendorId,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-9 text-sm",
                      "data-ocid": "submit-vendor-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select vendor…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: v.id, children: [
                    v.name,
                    v.company && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground text-xs", children: [
                      "· ",
                      v.company
                    ] })
                  ] }, v.id)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
              "Notes",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "Any notes about this submission…",
                className: "text-sm min-h-[72px] resize-none",
                "data-ocid": "submit-notes"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: handleSubmit,
              disabled: createSubmission.isPending || !selectedJobId,
              "data-ocid": "submit-job-confirm-btn",
              children: createSubmission.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-1.5" }),
                "Submitting…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5 mr-1.5" }),
                "Submit Profile"
              ] })
            }
          )
        ] })
      ] })
    }
  );
}
function ExtractionReviewForm({ file, onClose, onSaved }) {
  const [isExtracting, setIsExtracting] = reactExports.useState(true);
  const [rawText, setRawText] = reactExports.useState("");
  const [candidateName, setCandidateName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [skillsInput, setSkillsInput] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("");
  const [experience, setExperience] = reactExports.useState("");
  const [yearsExperience, setYearsExperience] = reactExports.useState(
    void 0
  );
  const [availability, setAvailability] = reactExports.useState("");
  const [sourceVendorId, setSourceVendorId] = reactExports.useState("");
  const [nameError, setNameError] = reactExports.useState("");
  const [vendorError, setVendorError] = reactExports.useState("");
  const [duplicateInfo, setDuplicateInfo] = reactExports.useState(null);
  const [extractError, setExtractError] = reactExports.useState(null);
  const [extractProgress, setExtractProgress] = reactExports.useState(0);
  const [fuzzyMatches, setFuzzyMatches] = reactExports.useState([]);
  const fuzzyDebounceRef = reactExports.useRef(null);
  const createResume = useCreateResume();
  const checkDuplicate = useCheckDuplicateResume();
  const findSimilar = useFindSimilarCandidates();
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  function scheduleFuzzySearch(name, ph, skills) {
    if (fuzzyDebounceRef.current) clearTimeout(fuzzyDebounceRef.current);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFuzzyMatches([]);
      return;
    }
    fuzzyDebounceRef.current = setTimeout(async () => {
      const skillsArr = skills.split(",").map((s) => s.trim()).filter(Boolean);
      try {
        const results = await findSimilar.mutateAsync({
          inputName: trimmedName,
          inputPhone: ph.trim() || null,
          inputSkills: skillsArr
        });
        setFuzzyMatches(results.filter((m) => m.similarityScore >= 30));
      } catch {
      }
    }, 800);
  }
  reactExports.useEffect(() => {
    return () => {
      if (fuzzyDebounceRef.current) clearTimeout(fuzzyDebounceRef.current);
    };
  }, []);
  reactExports.useEffect(() => {
    let progressTimer = null;
    async function runExtraction() {
      setExtractProgress(0);
      let pct = 0;
      progressTimer = setInterval(() => {
        pct = Math.min(pct + Math.random() * 12 + 4, 90);
        setExtractProgress(Math.round(pct));
      }, 200);
      try {
        const ab = await file.arrayBuffer();
        const name = file.name.toLowerCase();
        let text = "";
        if (name.endsWith(".docx") || name.endsWith(".doc")) {
          text = extractTextFromDocx(ab);
        } else if (name.endsWith(".pdf")) {
          text = extractTextFromPdf(ab);
        } else {
          text = await file.text();
        }
        if (!text.trim()) {
          setExtractError(
            "Could not extract text from this file. Try a different PDF or Word document."
          );
          return;
        }
        const parsed = parseResumeText(text);
        setRawText(text.substring(0, 8e3));
        const extractedName = parsed.candidateName || "";
        const finalName = extractedName && extractedName !== "--" ? extractedName : extractNameFromFilename(file.name);
        setCandidateName(finalName);
        setEmail(parsed.email || "");
        setPhone(parsed.phone || "");
        setLocation(parsed.location || "");
        setRole(parsed.extractedRole || "");
        setExperience(parsed.extractedExperience || "");
        setYearsExperience(parsed.yearsExperience);
        setSkillsInput(parsed.skills.join(", "));
        scheduleFuzzySearch(
          finalName,
          parsed.phone || "",
          parsed.skills.join(", ")
        );
      } catch (err) {
        setExtractError(err.message ?? "Extraction failed.");
      } finally {
        if (progressTimer) clearInterval(progressTimer);
        setExtractProgress(100);
        setTimeout(() => setIsExtracting(false), 300);
      }
    }
    runExtraction();
    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [file]);
  async function handleEmailBlur() {
    if (!email.trim()) {
      setDuplicateInfo(null);
      return;
    }
    try {
      const result = await checkDuplicate.mutateAsync(email.trim());
      if (result) {
        setDuplicateInfo({
          id: result.id,
          name: result.candidateName || "Unknown",
          date: result.createdAt ? new Date(result.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "2-digit"
          }) : ""
        });
      } else {
        setDuplicateInfo(null);
      }
    } catch {
    }
  }
  function parseSkillsArray() {
    return skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
  }
  async function saveResume(asDuplicate, duplicateOfId) {
    const trimmedName = candidateName.trim();
    if (!trimmedName) {
      setNameError("Full name is required.");
      return;
    }
    if (!sourceVendorId) {
      setVendorError("Source vendor is required.");
      return;
    }
    setNameError("");
    setVendorError("");
    try {
      const resume = await createResume.mutateAsync({
        fileName: file.name,
        candidateName: trimmedName,
        email: email.trim() || void 0,
        phone: phone.trim() || void 0,
        extractedSkills: parseSkillsArray(),
        extractedExperience: experience.trim(),
        extractedRole: role.trim(),
        rawText,
        status: asDuplicate ? "duplicate" : "active",
        availability: availability || void 0,
        duplicateOf: duplicateOfId ?? (asDuplicate && duplicateInfo ? duplicateInfo.id : void 0),
        yearsExperience,
        location: location.trim() || void 0,
        sourceVendorId
      });
      ue.success("Resume saved successfully", {
        description: `${trimmedName}'s profile has been added.`
      });
      onSaved(resume);
    } catch (err) {
      const e = err;
      const msg = String((e == null ? void 0 : e.message) ?? "Failed to save resume");
      console.error(
        "Supabase resume save error:",
        e == null ? void 0 : e.message,
        "| details:",
        e == null ? void 0 : e.details,
        "| hint:",
        e == null ? void 0 : e.hint,
        "| code:",
        e == null ? void 0 : e.code
      );
      ue.error("Save failed", {
        description: msg,
        duration: 8e3
      });
    }
  }
  const skillTags = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
  const canSave = candidateName.trim().length > 0 && sourceVendorId.length > 0;
  const hasFuzzyMatches = fuzzyMatches.length > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
      "data-ocid": "resume-review-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 bg-card border-b border-border px-6 py-4 flex items-start justify-between gap-3 rounded-t-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display leading-tight", children: "Review Extracted Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate max-w-xs", children: file.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Close",
              className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0 mt-0.5",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-5", children: [
          isExtracting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground text-center", children: [
              "Extracting text from ",
              file.name,
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-full rounded-full bg-muted overflow-hidden h-2",
                "data-ocid": "extract-progress-track",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-primary rounded-full transition-all duration-200 ease-out",
                    style: { width: `${extractProgress}%` },
                    role: "progressbar",
                    "aria-valuenow": extractProgress,
                    "aria-valuemin": 0,
                    "aria-valuemax": 100,
                    "aria-label": "Extraction progress",
                    tabIndex: -1,
                    "data-ocid": "extract-progress-bar"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground tabular-nums", children: [
              extractProgress,
              "%"
            ] })
          ] }),
          !isExtracting && extractError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-3 py-3 rounded-lg bg-destructive/10 border border-destructive/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: extractError })
          ] }),
          !isExtracting && !extractError && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
                "Full Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: candidateName,
                  onChange: (e) => {
                    setCandidateName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                    scheduleFuzzySearch(e.target.value, phone, skillsInput);
                  },
                  placeholder: "Full name",
                  className: "h-9 text-sm",
                  "data-ocid": "review-candidate-name",
                  "aria-required": "true"
                }
              ),
              nameError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
                nameError
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
                "Email ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  onBlur: handleEmailBlur,
                  placeholder: "email@example.com",
                  className: "h-9 text-sm",
                  "data-ocid": "review-email"
                }
              ),
              duplicateInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30",
                  "data-ocid": "duplicate-warning",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-400 font-medium", children: [
                        "Possible duplicate: ",
                        duplicateInfo.name
                      ] }),
                      duplicateInfo.date && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5", children: [
                        "Uploaded on ",
                        duplicateInfo.date,
                        ". Save anyway?"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 text-xs border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10",
                            onClick: () => saveResume(true),
                            disabled: createResume.isPending,
                            "data-ocid": "duplicate-link-btn",
                            children: "Save Anyway"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            className: "h-7 text-xs text-muted-foreground",
                            onClick: () => setDuplicateInfo(null),
                            disabled: createResume.isPending,
                            "data-ocid": "duplicate-cancel-btn",
                            children: "Cancel"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "tel",
                    value: phone,
                    onChange: (e) => {
                      setPhone(e.target.value);
                      scheduleFuzzySearch(
                        candidateName,
                        e.target.value,
                        skillsInput
                      );
                    },
                    placeholder: "+91 9876543210",
                    className: "h-9 text-sm",
                    "data-ocid": "review-phone"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Location" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: location,
                    onChange: (e) => setLocation(e.target.value),
                    placeholder: "e.g. Mumbai, India",
                    className: "h-9 text-sm",
                    "data-ocid": "review-location"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Current Role / Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: role,
                    onChange: (e) => setRole(e.target.value),
                    placeholder: "e.g. Senior Developer",
                    className: "h-9 text-sm",
                    "data-ocid": "review-role"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Years Exp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 0,
                    max: 50,
                    value: yearsExperience ?? "",
                    onChange: (e) => {
                      const v = e.target.value;
                      setYearsExperience(v === "" ? void 0 : Number(v));
                    },
                    placeholder: "5",
                    className: "h-9 text-sm",
                    "data-ocid": "review-years-exp"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Experience Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: experience,
                  onChange: (e) => setExperience(e.target.value),
                  placeholder: "e.g. 5 years",
                  className: "h-9 text-sm",
                  "data-ocid": "review-experience"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
                "Skills ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" }),
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(comma-separated)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: skillsInput,
                  onChange: (e) => {
                    setSkillsInput(e.target.value);
                    scheduleFuzzySearch(candidateName, phone, e.target.value);
                  },
                  placeholder: "React, TypeScript, Node.js, Salesforce…",
                  className: "h-9 text-sm",
                  "data-ocid": "review-skills"
                }
              ),
              skillTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 pt-1", children: [
                skillTags.slice(0, 12).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20",
                    children: s
                  },
                  s
                )),
                skillTags.length > 12 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground pt-0.5", children: [
                  "+",
                  skillTags.length - 12,
                  " more"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
                "Source Vendor ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              vendorsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: sourceVendorId,
                  onValueChange: (v) => {
                    setSourceVendorId(v);
                    if (v) setVendorError("");
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-9 text-sm",
                        "data-ocid": "review-source-vendor",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select source vendor…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 text-xs text-muted-foreground", children: "No vendors found. Add a vendor first." }) : vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: v.id, children: [
                      v.name,
                      v.company && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground text-xs", children: [
                        "· ",
                        v.company
                      ] })
                    ] }, v.id)) })
                  ]
                }
              ),
              vendorError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
                vendorError
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Availability" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: availability,
                  onValueChange: (v) => setAvailability(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-9 text-sm",
                        "data-ocid": "review-availability",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select availability…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "immediate", children: "Immediate" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "two_weeks", children: "2 Weeks Notice" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "one_month", children: "1 Month Notice" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unavailable", children: "Currently Unavailable" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FuzzyMatchesPanel,
              {
                matches: fuzzyMatches,
                isChecking: findSimilar.isPending,
                onMarkSamePersonAndSave: (matchId) => saveResume(true, matchId),
                isSaving: createResume.isPending
              }
            )
          ] })
        ] }),
        !isExtracting && !extractError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-between gap-2 rounded-b-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground leading-snug", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" }),
            " Full Name & Source Vendor are required"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: onClose, children: "Cancel" }),
            !duplicateInfo && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                onClick: () => saveResume(false),
                disabled: createResume.isPending || !canSave,
                "data-ocid": "review-save-btn",
                title: !canSave ? "Full Name and Source Vendor are required" : void 0,
                children: createResume.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-1.5" }),
                  "Saving…"
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1.5" }),
                  hasFuzzyMatches ? "Save as New (not a duplicate)" : "Save Resume"
                ] })
              }
            )
          ] })
        ] })
      ] })
    }
  );
}
function MatchCard({ match, resume, onSubmitted }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const createSubmission = useCreateSubmission();
  async function handleSubmit() {
    try {
      await createSubmission.mutateAsync({
        candidateId: resume.id,
        resumeId: resume.id,
        jobId: match.jobId,
        pipelineStage: "resume_sent",
        submittedBy: resume.candidateName
      });
      ue.success("Submitted to job!", {
        description: `${resume.candidateName} → ${match.jobTitle}`,
        action: { label: "Undo", onClick: () => {
        } }
      });
      onSubmitted();
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200",
      "data-ocid": `resume-match-card-${match.jobId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBadge, { score: match.totalScore }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground leading-tight truncate", children: match.jobTitle }),
            match.clientName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: match.clientName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: [
              { label: "Skills", val: match.skillsScore },
              { label: "Exp", val: match.expScore },
              { label: "Rate", val: match.rateScore },
              { label: "Avail", val: match.availScore }
            ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border",
                children: [
                  label,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                    val,
                    "%"
                  ] })
                ]
              },
              label
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: handleSubmit,
                disabled: createSubmission.isPending,
                className: "h-8 text-xs",
                "data-ocid": `resume-submit-job-${match.jobId}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3 mr-1" }),
                  "Submit"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setExpanded(!expanded),
                "aria-label": expanded ? "Collapse" : "Expand skills",
                className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 space-y-2 border-t border-border/50 pt-3", children: [
          match.matchedSkills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground pt-0.5 mr-0.5 flex-shrink-0", children: "Matched:" }),
            match.matchedSkills.slice(0, 8).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                children: s
              },
              s
            )),
            match.matchedSkills.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground pt-0.5", children: [
              "+",
              match.matchedSkills.length - 8
            ] })
          ] }),
          match.missingSkills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground pt-0.5 mr-0.5 flex-shrink-0", children: "Missing:" }),
            match.missingSkills.slice(0, 6).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border",
                children: s
              },
              s
            ))
          ] })
        ] })
      ]
    }
  );
}
function MatchPanel({ resume, onClose }) {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const [submitted, setSubmitted] = reactExports.useState(/* @__PURE__ */ new Set());
  const skillsStr = Array.isArray(resume.extractedSkills) ? resume.extractedSkills.join(", ") : resume.extractedSkills;
  const matches = jobs.filter((j) => j.status === "open").map((job) => {
    const { score, matchedKeywords } = scoreJobMatch(
      resume.extractedSkills,
      resume.extractedRole,
      resume.extractedExperience,
      job
    );
    const availMap = {
      immediate: 100,
      two_weeks: 75,
      one_month: 50,
      unavailable: 0
    };
    const availScore = resume.availability ? availMap[resume.availability] ?? 50 : 50;
    const resumeYears = resume.yearsExperience ?? (Number.parseInt(resume.extractedExperience ?? "0", 10) || 0);
    const jobYears = Number.parseInt(job.experience ?? "0", 10) || 0;
    const expScore = jobYears === 0 ? 50 : resumeYears >= jobYears ? 100 : Math.round(resumeYears / jobYears * 100);
    const jobSkillTokens = (job.requiredSkills ?? job.experience ?? "").split(/[,\s]+/).filter(Boolean);
    const skillsScore = jobSkillTokens.length === 0 ? score : Math.round(
      matchedKeywords.length / Math.max(jobSkillTokens.length, 1) * 100
    );
    const rateScore = 50;
    const totalScore = Math.min(
      100,
      Math.round(
        skillsScore * 0.6 + expScore * 0.2 + rateScore * 0.15 + availScore * 0.05
      )
    );
    return {
      jobId: job.id,
      jobTitle: job.title,
      clientName: job.clientName ?? "",
      totalScore,
      skillsScore: Math.min(100, skillsScore),
      expScore: Math.min(100, expScore),
      rateScore,
      availScore,
      matchedSkills: matchedKeywords,
      missingSkills: []
    };
  }).sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
  const skills = Array.isArray(resume.extractedSkills) ? resume.extractedSkills : skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",
        onClick: onClose,
        onKeyDown: (e) => {
          if (e.key === "Escape") onClose();
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed right-0 top-0 h-full z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col",
        "data-ocid": "resume-match-panel",
        "aria-modal": "true",
        "aria-label": `Job matches for ${resume.candidateName}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground font-display", children: "Best Job Matches" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: [
                "for ",
                resume.candidateName || resume.fileName
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Close matches panel",
                className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 bg-muted/30 border-b border-border flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                resume.extractedRole && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: resume.extractedRole }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-1", children: [
                  resume.yearsExperience !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block", children: [
                    resume.yearsExperience,
                    " yrs exp"
                  ] }),
                  resume.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border inline-flex items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5" }),
                    resume.location
                  ] })
                ] })
              ] })
            ] }),
            skills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
              skills.slice(0, 6).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border",
                  children: s
                },
                s
              )),
              skills.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground pt-0.5", children: [
                "+",
                skills.length - 6,
                " more"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 overflow-y-auto px-5 py-4 space-y-3",
              "data-ocid": "match-panel-list",
              children: jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) }) : matches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center gap-3 py-12 text-center",
                  "data-ocid": "match-panel-empty",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-10 w-10 text-muted-foreground/25" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No open jobs to match" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Add open jobs in the Jobs section to see match scores here." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "mt-1", children: "Go to Jobs" }) })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  matches.length,
                  " open jobs scored · sorted by best match"
                ] }),
                matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MatchCard,
                  {
                    match: m,
                    resume,
                    onSubmitted: () => setSubmitted((prev) => /* @__PURE__ */ new Set([...prev, m.jobId]))
                  },
                  m.jobId
                )),
                submitted.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600 dark:text-emerald-400", children: [
                    submitted.size,
                    " submission",
                    submitted.size > 1 ? "s" : "",
                    " ",
                    "created for this resume."
                  ] })
                ] })
              ] })
            }
          )
        ]
      }
    )
  ] });
}
function ResumeRow({ r, onFindMatches, onSubmitToJob }) {
  const deleteResume = useDeleteResume();
  const { data: submissions = [] } = useListSubmissionsForResume(r.id);
  const skillsList = Array.isArray(r.extractedSkills) ? r.extractedSkills.slice(0, 3) : r.extractedSkills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const uploadedDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit"
  }) : "—";
  const activeSubmissions = submissions.filter((s) => !s.deletedAt);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    TableRow,
    {
      className: "group hover:bg-muted/20",
      "data-ocid": `resume-row-${r.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground min-w-[140px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[130px] block", children: r.candidateName || r.fileName }),
            r.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5" }),
              r.location
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-xs text-muted-foreground max-w-[150px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: r.email || "—" }),
          r.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] flex items-center gap-0.5 text-muted-foreground/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-2.5 w-2.5" }),
            r.phone
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "hidden sm:table-cell", children: [
          r.extractedRole ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs font-normal max-w-[120px] truncate",
              children: [
                r.extractedRole.substring(0, 28),
                r.extractedRole.length > 28 ? "…" : ""
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }),
          r.yearsExperience !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-primary/8 text-primary/80 border border-primary/15", children: [
            r.yearsExperience,
            " yrs"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 max-w-[180px]", children: skillsList.length > 0 ? skillsList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border whitespace-nowrap",
            children: s
          },
          s
        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap", children: uploadedDate }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status }),
          activeSubmissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5" }),
            activeSubmissions.length,
            " submitted"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1 min-w-[140px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              className: "h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
              onClick: () => onSubmitToJob(r),
              "data-ocid": `resume-submit-btn-${r.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Submit" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
              onClick: () => onFindMatches(r),
              "data-ocid": `resume-find-matches-${r.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Matches" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
              onClick: () => deleteResume.mutate(r.id, {
                onSuccess: () => ue.success("Resume deleted"),
                onError: () => ue.error("Failed to delete resume")
              }),
              "aria-label": "Delete resume",
              "data-ocid": `resume-delete-${r.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }) })
      ]
    }
  );
}
const SKELETON_ROWS = Array.from({ length: 5 }, (_, i) => i);
function ListView({
  resumes,
  isLoading,
  onFindMatches,
  onSubmitToJob
}) {
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [sortField, setSortField] = reactExports.useState("createdAt");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const deferredSearch = reactExports.useDeferredValue(search);
  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("desc");
    }
  }
  const filtered = resumes.filter((r) => {
    const q = deferredSearch.toLowerCase();
    const matchSearch = !q || (r.candidateName ?? "").toLowerCase().includes(q) || (r.email ?? "").toLowerCase().includes(q) || (r.extractedRole ?? "").toLowerCase().includes(q) || (r.location ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sortField === "candidateName") {
      const cmp = (a.candidateName ?? "").localeCompare(
        b.candidateName ?? ""
      );
      return sortDir === "asc" ? cmp : -cmp;
    }
    const ta = new Date(a.createdAt ?? 0).getTime();
    const tb = new Date(b.createdAt ?? 0).getTime();
    return sortDir === "asc" ? ta - tb : tb - ta;
  });
  if (!isLoading && resumes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3 py-20 text-center bg-card rounded-xl border border-border",
        "data-ocid": "resume-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-muted-foreground/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No resumes uploaded yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: "Upload PDF or Word resumes above to automatically find matching jobs." })
          ] })
        ]
      }
    );
  }
  const SortIcon = ({ field }) => sortField === field ? sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 ml-0.5 inline" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 ml-0.5 inline" }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 items-start sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name, email, role, location…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "h-8 pl-8 text-xs",
            "data-ocid": "resume-search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: statusFilter,
          onValueChange: (v) => setStatusFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 text-xs w-36",
                "data-ocid": "resume-status-filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "duplicate", children: "Duplicate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "archived", children: "Archived" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto whitespace-nowrap", children: [
        filtered.length,
        " of ",
        resumes.length,
        " resume",
        resumes.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none whitespace-nowrap",
            onClick: () => toggleSort("candidateName"),
            children: [
              "Candidate ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { field: "candidateName" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Skills" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none whitespace-nowrap hidden sm:table-cell",
            onClick: () => toggleSort("createdAt"),
            children: [
              "Added ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { field: "createdAt" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? SKELETON_ROWS.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: [0, 1, 2, 3, 4, 5, 6].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          className: j > 1 ? "hidden md:table-cell" : "",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" })
        },
        j
      )) }, i)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: 7,
          className: "py-12 text-center text-sm text-muted-foreground",
          children: "No resumes match your search."
        }
      ) }) : filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResumeRow,
        {
          r,
          onFindMatches,
          onSubmitToJob
        },
        r.id
      )) })
    ] }) })
  ] });
}
function SqlSetupNote() {
  const [visible, setVisible] = reactExports.useState(true);
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-500/30 bg-amber-500/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "One-time setup: Update the resumes table schema + enable fuzzy duplicate detection" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Run this SQL in your",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/sql-editor",
              className: "underline underline-offset-2 text-primary",
              children: "SQL Editor"
            }
          ),
          " ",
          "to enable all fields and the fuzzy candidate matching function:"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 text-[10px] bg-card border border-border rounded-lg p-3 overflow-x-auto text-foreground font-mono leading-relaxed whitespace-pre", children: `-- Schema columns
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS years_experience INT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS source_vendor_id UUID REFERENCES vendors(id);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS duplicate_of UUID;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resumes(id);

-- Fuzzy duplicate detection (requires pg_trgm)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- See full function SQL in src/frontend/src/lib/api.ts (top of file)` })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setVisible(false),
        className: "text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-0.5",
        "aria-label": "Dismiss",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
      }
    )
  ] }) });
}
function ResumesPage() {
  const [pendingFile, setPendingFile] = reactExports.useState(null);
  const [matchingResume, setMatchingResume] = reactExports.useState(null);
  const [submitResume, setSubmitResume] = reactExports.useState(null);
  const { data: resumes = [], isLoading } = useResumes();
  function handleFileSaved(resume) {
    setPendingFile(null);
    setMatchingResume(resume);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-4 sm:p-6 max-w-full min-h-0", children: [
    !getSupabaseCreds() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30",
        "data-ocid": "resumes-no-supabase-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 flex-1", children: [
            "Supabase not connected — go to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/settings",
                className: "underline underline-offset-2 font-medium",
                children: "Settings → Integrations"
              }
            ),
            " ",
            "to add your credentials."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        matchingResume && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMatchingResume(null),
            "aria-label": "Back to all resumes",
            className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "data-ocid": "resumes-back-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground leading-none", children: matchingResume ? `Matches — ${matchingResume.candidateName || "Resume"}` : "Resumes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: matchingResume ? "Scored against all open jobs" : "Upload candidate resumes and find matching jobs automatically" })
        ] })
      ] }),
      !matchingResume && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: !isLoading && resumes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        resumes.length,
        " resume",
        resumes.length !== 1 ? "s" : ""
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SqlSetupNote, {}),
    !matchingResume && /* @__PURE__ */ jsxRuntimeExports.jsx(DropZone, { onFileSelected: setPendingFile }),
    matchingResume ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      MatchPanel,
      {
        resume: matchingResume,
        onClose: () => setMatchingResume(null)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListView,
      {
        resumes,
        isLoading,
        onFindMatches: setMatchingResume,
        onSubmitToJob: setSubmitResume
      }
    ),
    pendingFile && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExtractionReviewForm,
      {
        file: pendingFile,
        onClose: () => setPendingFile(null),
        onSaved: handleFileSaved
      }
    ),
    submitResume && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubmitJobModal,
      {
        resume: submitResume,
        onClose: () => setSubmitResume(null),
        onSubmitted: (jobTitle) => {
          ue.success("Submitted!", {
            description: `${submitResume.candidateName} → ${jobTitle}`
          });
        }
      }
    )
  ] });
}
export {
  ResumesPage as default
};
