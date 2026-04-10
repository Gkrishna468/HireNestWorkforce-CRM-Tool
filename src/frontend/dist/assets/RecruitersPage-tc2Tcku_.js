import { K as useRecruiters, r as reactExports, j as jsxRuntimeExports, t as getSupabaseCreds, L as Link, g as Button, U as Users, e as Badge, M as useCreateRecruiter, v as ue } from "./index-FQ24AoYk.js";
import { A as AppModal } from "./AppModal-DTemiPon.js";
import { E as EmptyState } from "./EmptyState-Dm90ZIod.js";
import { c as computeHealthStatus, H as HealthBadge } from "./HealthBadge-ajJQBTZJ.js";
import { S as StageProgressBar } from "./StageProgressBar-C-5as2uR.js";
import { I as Input } from "./input-S6aDFC4y.js";
import { L as Label } from "./label-BZ8WgIdB.js";
import { S as Skeleton } from "./skeleton-DAIgTDa6.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-jteK0lm6.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CyNKelcV.js";
import { R as RECRUITER_STAGES } from "./pipeline-FfiY-Q7s.js";
import { C as CircleAlert } from "./circle-alert-CEe_PZu-.js";
import { L as LayoutGrid, a as List } from "./list-CmCpUNFZ.js";
import { P as Plus } from "./plus-XDKycyBP.js";
import "./index-XS6LeCno.js";
import "./index-BIX9gIuu.js";
import "./check-DrKYa13V.js";
import "./index-2NCsxXlq.js";
function RecruiterKanbanCard({ recruiter }) {
  const healthStatus = computeHealthStatus(recruiter.healthScore);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/recruiters/$recruiterId",
      params: { recruiterId: recruiter.id },
      className: "block",
      "data-ocid": "recruiter-kanban-card",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "entity-card cursor-pointer group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors", children: recruiter.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { status: healthStatus, size: "sm" })
        ] }),
        recruiter.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate mb-2", children: recruiter.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-sm font-bold ${recruiter.healthScore >= 70 ? "text-[#22c55e]" : recruiter.healthScore >= 40 ? "text-[#eab308]" : "text-[#ef4444]"}`,
                children: recruiter.healthScore
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "score" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "calls" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground", children: "subs" })
          ] })
        ] })
      ] })
    }
  );
}
const KANBAN_STAGES = [
  "Daily Start",
  "Activity Tracking",
  "Check-ins",
  "Performance",
  "Coaching"
];
function KanbanView({ recruiters }) {
  const stageMap = {
    Onboarding: "Daily Start",
    Active: "Activity Tracking",
    "High-Performer": "Performance",
    Coaching: "Coaching",
    "Exit Risk": "Coaching"
  };
  const grouped = KANBAN_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = [];
      return acc;
    },
    {}
  );
  for (const r of recruiters) {
    const displayStage = stageMap[r.currentStage] ?? "Activity Tracking";
    grouped[displayStage].push(r);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "flex gap-3 overflow-x-auto pb-4 pt-1 px-4",
      "data-ocid": "recruiter-kanban",
      children: KANBAN_STAGES.map((stage) => {
        const cols = grouped[stage] ?? [];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 w-52", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 px-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wide", children: stage }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-[10px] h-4 px-1.5 min-w-[20px] flex items-center justify-center",
                children: cols.length
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 min-h-[120px]", children: [
            cols.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RecruiterKanbanCard, { recruiter: r }, r.id)),
            cols.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-sm border border-dashed border-border h-16 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground/50", children: "Empty" }) })
          ] })
        ] }, stage);
      })
    }
  );
}
function ListView({ recruiters }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-2", "data-ocid": "recruiter-list", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border hover:bg-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8", children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8", children: "Stage" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8", children: "Health" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8 text-right", children: "Score" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8 text-right", children: "Calls" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8 text-right", children: "Emails" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8 text-right", children: "Subs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-[11px] font-semibold text-muted-foreground h-8" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: recruiters.map((r) => {
      const healthStatus = computeHealthStatus(r.healthScore);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          className: "border-border hover:bg-muted/30 cursor-pointer",
          "data-ocid": "recruiter-list-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Link,
              {
                to: "/recruiters/$recruiterId",
                params: { recruiterId: r.id },
                className: "block",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground hover:text-primary transition-colors", children: r.name }),
                  r.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate max-w-[160px]", children: r.title })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-28", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                StageProgressBar,
                {
                  stages: RECRUITER_STAGES,
                  currentStage: r.currentStage,
                  compact: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground mt-0.5 block truncate", children: r.currentStage })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { status: healthStatus, size: "sm", showLabel: true }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-semibold tabular-nums ${r.healthScore >= 70 ? "text-[#22c55e]" : r.healthScore >= 40 ? "text-[#eab308]" : "text-[#ef4444]"}`,
                children: r.healthScore
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 text-right text-xs text-muted-foreground tabular-nums", children: "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 text-right text-xs text-muted-foreground tabular-nums", children: "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2 text-right text-xs text-muted-foreground tabular-nums", children: "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/recruiters/$recruiterId",
                params: { recruiterId: r.id },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground",
                    children: "View"
                  }
                )
              }
            ) })
          ]
        },
        r.id
      );
    }) })
  ] }) });
}
function AddRecruiterModal({
  open,
  onOpenChange
}) {
  const createRecruiter = useCreateRecruiter();
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    phone: ""
  });
  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      await createRecruiter.mutateAsync(form);
      ue.success("Recruiter added");
      onOpenChange(false);
      setForm({ name: "", email: "", phone: "" });
    } catch {
      ue.error("Failed to add recruiter");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    AppModal,
    {
      open,
      onOpenChange,
      title: "Add Recruiter",
      description: "Create a new recruiter profile",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Name *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.name,
              onChange: (e) => handleChange("name", e.target.value),
              placeholder: "Full name",
              className: "h-8 text-xs bg-background",
              required: true,
              "data-ocid": "recruiter-name-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Email *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "email",
              value: form.email,
              onChange: (e) => handleChange("email", e.target.value),
              placeholder: "work@email.com",
              className: "h-8 text-xs bg-background",
              required: true,
              "data-ocid": "recruiter-email-input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-muted-foreground", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: form.phone ?? "",
              onChange: (e) => handleChange("phone", e.target.value),
              placeholder: "+1 (555) 000-0000",
              className: "h-8 text-xs bg-background",
              "data-ocid": "recruiter-phone-input"
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
              disabled: createRecruiter.isPending || !form.name.trim() || !form.email.trim(),
              "data-ocid": "recruiter-submit-btn",
              children: createRecruiter.isPending ? "Adding…" : "Add Recruiter"
            }
          )
        ] })
      ] })
    }
  );
}
function KanbanSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto px-4 pt-1 pb-4", children: KANBAN_STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 w-52 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-24" }),
    [1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-sm" }, i))
  ] }, s)) });
}
function RecruitersPage() {
  const { data: recruiters, isLoading } = useRecruiters();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [view, setView] = reactExports.useState("kanban");
  const list = recruiters ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", children: [
    !getSupabaseCreds() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/30 flex-shrink-0",
        "data-ocid": "recruiters-no-supabase-banner",
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
            "to add credentials."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground font-display", children: [
          "Recruiters",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-xs font-normal text-muted-foreground", children: [
            list.length,
            " total"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground hidden sm:block", children: "Team productivity and performance pipeline" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 bg-muted rounded-sm p-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: `h-6 w-6 rounded-sm transition-smooth ${view === "kanban" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              onClick: () => setView("kanban"),
              "aria-label": "Kanban view",
              "data-ocid": "view-kanban-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: `h-6 w-6 rounded-sm transition-smooth ${view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
              onClick: () => setView("list"),
              "aria-label": "List view",
              "data-ocid": "view-list-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3 w-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "h-7 text-xs gap-1.5",
            onClick: () => setModalOpen(true),
            "data-ocid": "add-recruiter-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }),
              "Add Recruiter"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Tabs,
      {
        value: view,
        onValueChange: (v) => setView(v),
        className: "h-full",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-3 border-b border-border bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-7 text-xs bg-muted gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "kanban",
                className: "h-6 text-xs px-3",
                "data-ocid": "tab-kanban",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3 w-3 mr-1.5" }),
                  "Kanban View"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              TabsTrigger,
              {
                value: "list",
                className: "h-6 text-xs px-3",
                "data-ocid": "tab-list",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3 w-3 mr-1.5" }),
                  "List View"
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "kanban", className: "mt-0 py-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(KanbanSkeleton, {}) : list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Users,
              title: "No recruiters yet",
              message: "Add your first recruiter to start tracking team performance.",
              action: {
                label: "Add Recruiter",
                onClick: () => setModalOpen(true)
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(KanbanView, { recruiters: list }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "list", className: "mt-0 py-2", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pt-2 space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, i)) }) : list.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Users,
              title: "No recruiters yet",
              message: "Add your first recruiter to start tracking team performance.",
              action: {
                label: "Add Recruiter",
                onClick: () => setModalOpen(true)
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ListView, { recruiters: list }) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AddRecruiterModal, { open: modalOpen, onOpenChange: setModalOpen })
  ] });
}
export {
  RecruitersPage as default
};
