import { a8 as useCandidates, o as useVendors, q as useUpdateEntityStage, s as useCreateApprovalItem, r as reactExports, a9 as CANDIDATE_STAGES, j as jsxRuntimeExports, P as PageLoadingSpinner, t as getSupabaseCreds, L as Link, g as Button, v as stageRequiresApproval, e as Badge, f as cn, w as ue, aa as useCreateCandidate } from "./index-CVrXVggm.js";
import { P as PageHeader } from "./PageHeader-DurV_BC8.js";
import { A as AppModal } from "./AppModal-DB2XrA2j.js";
import { E as EmptyState } from "./EmptyState-BhIJ_mPb.js";
import { H as HealthBadge, a as getRelativeTime } from "./HealthBadge-CTf0viRp.js";
import { I as Input } from "./input-CtY2I0WB.js";
import { L as Label } from "./label-CXefdVvP.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-CPUkY5Q1.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-5RwQJK9m.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-h1HvQ4fQ.js";
import { T as Textarea } from "./textarea-CB9iVoFm.js";
import { L as Lock, u as useForm } from "./index.esm-DX9aKwmP.js";
import { C as CircleAlert } from "./circle-alert-TRETUhER.js";
import { P as Plus } from "./plus-DUyPr4Co.js";
import { U as User } from "./user-BqdkeCcF.js";
import { G as GripVertical } from "./grip-vertical-BTVoY6qT.js";
import "./index-DaPATmdx.js";
import "./index-D1LQJLIT.js";
import "./index-utZipmPj.js";
import "./index-Bn_Ax8FW.js";
import "./index-yp4MgtST.js";
import "./chevron-down-BqvIrjg8.js";
import "./check-4AzK3djf.js";
function computePlacementProb(candidate) {
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
  return Math.min(100, Math.max(0, base + healthBonus));
}
function getDaysInStageSince(updatedAt) {
  return Math.floor((Date.now() - updatedAt) / (1e3 * 60 * 60 * 24));
}
function probColor(prob) {
  return prob >= 70 ? "text-[#22c55e]" : prob >= 40 ? "text-[#eab308]" : "text-[#ef4444]";
}
function KanbanCard({ candidate, vendorName, onDragStart }) {
  var _a;
  const prob = computePlacementProb(candidate);
  const days = getDaysInStageSince(candidate.updatedAt);
  const skillLabel = ((_a = candidate.skills) == null ? void 0 : _a.slice(0, 20)) ?? candidate.title ?? "—";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/candidates/$candidateId",
      params: { candidateId: candidate.id },
      className: "block",
      "data-ocid": "candidate-kanban-card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          draggable: true,
          onDragStart: (e) => onDragStart(e, candidate.id, candidate.currentStage),
          className: "entity-card cursor-grab active:cursor-grabbing group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-1 mb-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground truncate flex-1 min-w-0 leading-tight", children: candidate.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { score: candidate.healthScore, size: "sm" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate mb-1.5", children: skillLabel }),
            vendorName && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-primary/70 truncate mb-1.5 flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" }),
              vendorName
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground", children: [
                days,
                "d in stage"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("text-[10px] font-semibold", probColor(prob)), children: [
                prob,
                "% placed"
              ] })
            ] }),
            candidate.updatedAt > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/60 mt-1 truncate", children: getRelativeTime(candidate.updatedAt) })
          ]
        }
      )
    }
  );
}
function KanbanCol({
  stage,
  candidates,
  vendorMap,
  onDragStart,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave
}) {
  const needsApproval = stageRequiresApproval("candidate", stage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex flex-col min-w-[200px] w-48 flex-shrink-0",
        isDragOver && "opacity-80"
      ),
      onDragOver,
      onDrop: (e) => onDrop(e, stage),
      onDragLeave,
      "data-ocid": "kanban-column",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex items-center justify-between px-2 py-1.5 rounded-t-sm border border-b-0 border-border",
              isDragOver ? "bg-primary/10 border-primary/40" : "bg-muted"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 min-w-0", children: [
                needsApproval && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-2.5 h-2.5 text-[#eab308] flex-shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-foreground truncate", children: stage })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "secondary",
                  className: "text-[10px] h-4 px-1 flex-shrink-0",
                  children: candidates.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex-1 rounded-b-sm border border-border p-1.5 space-y-1.5 min-h-[300px] transition-smooth",
              isDragOver && "bg-primary/5 border-primary/30"
            ),
            children: [
              candidates.map((c) => {
                var _a;
                const vendorName = c.assignedRecruiter ? void 0 : (_a = vendorMap.get(c.assignedRecruiter ?? "")) == null ? void 0 : _a.name;
                return /* @__PURE__ */ jsxRuntimeExports.jsx(
                  KanbanCard,
                  {
                    candidate: c,
                    vendorName,
                    onDragStart
                  },
                  c.id
                );
              }),
              candidates.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-16 rounded-sm border border-dashed border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50", children: "Drop here" }) })
            ]
          }
        )
      ]
    }
  );
}
function AddCandidateModal({
  open,
  onClose
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm();
  const createCandidate = useCreateCandidate();
  const { data: vendors = [] } = useVendors();
  async function onSubmit(data) {
    try {
      await createCandidate.mutateAsync({
        ...data,
        salaryMin: data.salaryMin ? Number(data.salaryMin) : void 0,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : void 0
      });
      ue.success("Candidate added");
      reset();
      onClose();
    } catch {
      ue.error("Failed to add candidate");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AppModal,
    {
      open,
      onOpenChange: onClose,
      title: "Add Candidate",
      size: "lg",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSubmit(onSubmit),
          className: "space-y-3",
          "data-ocid": "add-candidate-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Name *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("name", { required: true }),
                    placeholder: "Full name",
                    className: cn("h-8 text-xs", errors.name && "border-destructive"),
                    "data-ocid": "candidate-name-input"
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
                    placeholder: "email@domain.com",
                    className: cn(
                      "h-8 text-xs",
                      errors.email && "border-destructive"
                    ),
                    "data-ocid": "candidate-email-input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("phone"),
                    placeholder: "+1 555 000 0000",
                    className: "h-8 text-xs"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Title / Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("title"),
                    placeholder: "e.g. Senior React Developer",
                    className: "h-8 text-xs"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Skills" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  ...register("skills"),
                  placeholder: "React, TypeScript, Node.js, AWS...",
                  className: "text-xs resize-none h-16",
                  "data-ocid": "candidate-skills-input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Experience" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    ...register("notes"),
                    placeholder: "5 years, Senior level...",
                    className: "h-8 text-xs"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Source" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (v) => setValue("assignedRecruiter", v), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-8 text-xs",
                      "data-ocid": "candidate-source-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select source" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "referral", children: "Referral" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "job board", children: "Job Board" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "linkedin", children: "LinkedIn" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "agency", children: "Agency" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "direct", children: "Direct" })
                  ] })
                ] })
              ] })
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
                        "data-ocid": "candidate-vendor-select",
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
                    placeholder: "80000",
                    className: "h-8 text-xs",
                    "data-ocid": "candidate-salary-min-input"
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
                    placeholder: "120000",
                    className: "h-8 text-xs",
                    "data-ocid": "candidate-salary-max-input"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Availability" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  ...register("linkedinUrl"),
                  placeholder: "Immediate / 2 weeks / 1 month...",
                  className: "h-8 text-xs"
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
                  "data-ocid": "add-candidate-submit",
                  children: isSubmitting ? "Adding..." : "Add Candidate"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function CandidatesPage() {
  var _a, _b;
  const { data: candidates = [], isLoading } = useCandidates();
  const { data: vendors = [] } = useVendors();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [filter, setFilter] = reactExports.useState("");
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const [dragOver, setDragOver] = reactExports.useState(null);
  const vendorMap = reactExports.useMemo(
    () => new Map(vendors.map((v) => [v.id, v])),
    [vendors]
  );
  const filtered = candidates.filter(
    (c) => c.name.toLowerCase().includes(filter.toLowerCase()) || (c.skills ?? "").toLowerCase().includes(filter.toLowerCase()) || (c.title ?? "").toLowerCase().includes(filter.toLowerCase())
  );
  const byStage = {};
  for (const stage of CANDIDATE_STAGES) byStage[stage] = [];
  for (const c of filtered) {
    const s = c.currentStage;
    if (byStage[s]) byStage[s].push(c);
  }
  const interviewCount = ((_a = byStage.Interview) == null ? void 0 : _a.length) ?? 0;
  const offerCount = ((_b = byStage.Offer) == null ? void 0 : _b.length) ?? 0;
  function handleDragStart(e, id, from) {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("candidateId", id);
    e.dataTransfer.setData("fromStage", from);
  }
  async function handleDrop(e, toStage) {
    e.preventDefault();
    setDragOver(null);
    setIsDragging(false);
    const id = e.dataTransfer.getData("candidateId");
    const fromStage = e.dataTransfer.getData("fromStage");
    if (!id || fromStage === toStage) return;
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;
    if (stageRequiresApproval("candidate", toStage)) {
      try {
        await createApproval.mutateAsync({
          entityId: id,
          entityType: "candidate",
          itemType: "stage_change",
          description: `Stage change: ${candidate.name} → ${toStage}`,
          details: `Moving from ${fromStage} to ${toStage}. Requires manager approval.`,
          requestedBy: "system"
        });
        ue.info(`Approval requested: ${candidate.name} → ${toStage}`);
      } catch {
        ue.error("Failed to create approval request");
      }
    } else {
      try {
        await updateStage.mutateAsync({
          entityId: id,
          entityType: "candidate",
          newStage: toStage
        });
        ue.success(`${candidate.name} moved to ${toStage}`);
      } catch {
        ue.error("Failed to update stage");
      }
    }
  }
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "candidates-page", children: [
    !getSupabaseCreds() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/30 flex-shrink-0",
        "data-ocid": "candidates-no-supabase-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 text-amber-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-300/90", children: [
            "Supabase not connected —",
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
            "to add credentials before saving data."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Candidates",
        subtitle: `${candidates.length} total · ${interviewCount} interviewing · ${offerCount} offers`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "h-7 text-xs gap-1",
            onClick: () => setShowAdd(true),
            "data-ocid": "add-candidate-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
              "Add Candidate"
            ]
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-2 border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Input,
      {
        value: filter,
        onChange: (e) => setFilter(e.target.value),
        placeholder: "Filter by name or skills...",
        className: "h-7 text-xs max-w-xs",
        "data-ocid": "candidates-filter"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        defaultValue: "kanban",
        className: "flex-1 flex flex-col overflow-hidden",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-1.5 border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-7 gap-0.5", "data-ocid": "candidates-tabs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "kanban", className: "text-xs h-6 px-3", children: "Kanban View" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "list", className: "text-xs h-6 px-3", children: "List View" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "kanban", className: "flex-1 overflow-auto m-0", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: User,
              title: "No candidates yet",
              message: "Add your first candidate to get started",
              action: {
                label: "Add Candidate",
                onClick: () => setShowAdd(true)
              }
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 p-4 min-h-full", children: CANDIDATE_STAGES.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            KanbanCol,
            {
              stage,
              candidates: byStage[stage] ?? [],
              vendorMap,
              onDragStart: handleDragStart,
              onDrop: handleDrop,
              isDragOver: dragOver === stage,
              onDragOver: (e) => {
                e.preventDefault();
                setDragOver(stage);
              },
              onDragLeave: () => setDragOver(null)
            },
            stage
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "list", className: "flex-1 overflow-auto m-0", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: User,
              title: "No candidates found",
              message: "Try adjusting your filter or add a new candidate"
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "candidates-list-table", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border hover:bg-transparent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8 w-6" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8 hidden md:table-cell", children: "Skills" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8", children: "Stage" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8 hidden lg:table-cell", children: "Vendor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8 text-center", children: "Health" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8 text-right hidden sm:table-cell", children: "Days" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8 text-right hidden lg:table-cell", children: "Placement %" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8 hidden md:table-cell", children: "Last Contact" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] h-8" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filtered.map((c) => {
              var _a2, _b2;
              const prob = computePlacementProb(c);
              const days = getDaysInStageSince(c.updatedAt);
              const needsApproval = stageRequiresApproval(
                "candidate",
                c.currentStage
              );
              const vendorName = (_a2 = vendorMap.get(
                c.assignedRecruiter ?? ""
              )) == null ? void 0 : _a2.name;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TableRow,
                {
                  className: "border-border hover:bg-muted/30 cursor-pointer",
                  "data-ocid": "candidate-list-row",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "w-6 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-3.5 h-3.5 text-muted-foreground/40" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Link,
                      {
                        to: "/candidates/$candidateId",
                        params: { candidateId: c.id },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground hover:text-primary transition-colors", children: c.name }),
                          c.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: c.title })
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground truncate max-w-[160px]", children: ((_b2 = c.skills) == null ? void 0 : _b2.slice(0, 40)) ?? "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      needsApproval && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-3 h-3 text-[#eab308]" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Badge,
                        {
                          variant: "secondary",
                          className: "text-[10px] h-5 px-1.5",
                          children: c.currentStage
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: vendorName ?? "—" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      HealthBadge,
                      {
                        score: c.healthScore,
                        showScore: true,
                        size: "sm"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 text-right hidden sm:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: cn(
                          "text-xs",
                          days > 7 ? "text-[#ef4444]" : "text-muted-foreground"
                        ),
                        children: [
                          days,
                          "d"
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 text-right hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: cn(
                          "text-xs font-semibold",
                          probColor(prob)
                        ),
                        children: [
                          prob,
                          "%"
                        ]
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 hidden md:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground", children: getRelativeTime(c.updatedAt) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Link,
                      {
                        to: "/candidates/$candidateId",
                        params: { candidateId: c.id },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            variant: "ghost",
                            size: "sm",
                            className: "h-6 text-[10px] px-2",
                            children: "View"
                          }
                        )
                      }
                    ) })
                  ]
                },
                c.id
              );
            }) })
          ] }) })
        ]
      }
    ),
    isDragging && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-primary/40 rounded-sm px-3 py-1.5 text-xs text-primary flex items-center gap-2 shadow-lg z-50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Offer & Placed stages require manager approval" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddCandidateModal, { open: showAdd, onClose: () => setShowAdd(false) })
  ] });
}
export {
  CandidatesPage as default
};
