import { A as useClients, D as useCreateClient, q as useUpdateEntityStage, s as useCreateApprovalItem, r as reactExports, j as jsxRuntimeExports, g as Button, m as Briefcase, L as Link, e as Badge } from "./index-BRtzpxp9.js";
import { A as AppModal } from "./AppModal-CISv63Yp.js";
import { E as EmptyState } from "./EmptyState-AIPXLxMi.js";
import { H as HealthBadge } from "./HealthBadge-CAnSYs2o.js";
import { I as Input } from "./input-DIlMf6lJ.js";
import { L as Label } from "./label-CVV2OU_K.js";
import { S as Skeleton } from "./skeleton-B4oKBcVK.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-DhE4Ersr.js";
import { T as Textarea } from "./textarea-8PJzTRZQ.js";
import { f as formatRelativeTime } from "./format-DOHug6mb.js";
import { C as CLIENT_STAGES, s as stageRequiresApproval } from "./pipeline-FfiY-Q7s.js";
import { u as ue } from "./index-C6rRzwLO.js";
import { P as Plus } from "./plus-BgibRaI8.js";
import { L as LayoutGrid, a as List } from "./list-BMMuxN0l.js";
import { T as TrendingDown } from "./trending-down-CQrTWctm.js";
import { G as GripVertical } from "./grip-vertical-fEtPyHrT.js";
import { T as TrendingUp } from "./trending-up-CLuy_2_j.js";
import "./index-DhyvhHdf.js";
import "./index-DXDbfKP4.js";
import "./index-lox1SDd0.js";
const STAGE_COLORS = {
  Prospect: "border-l-[oklch(0.65_0.21_200)]",
  Qualified: "border-l-[oklch(0.68_0.22_142)]",
  Active: "border-l-[oklch(0.5_0.18_207)]",
  Negotiation: "border-l-[oklch(0.85_0.24_80)]",
  "Closed-Won": "border-l-[oklch(0.68_0.22_142)]",
  Growth: "border-l-[oklch(0.5_0.18_207)]"
};
function getDaysInStage(updatedAt) {
  return Math.floor((Date.now() - updatedAt) / (1e3 * 60 * 60 * 24));
}
function ClientForm({ onSubmit, loading }) {
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: ""
  });
  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSubmit(form);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", "data-ocid": "client-form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Company Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: form.company ?? "",
            onChange: (e) => set("company", e.target.value),
            placeholder: "Acme Technologies",
            className: "h-8 text-sm bg-background",
            "data-ocid": "client-form-company"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Hiring Manager *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: form.name,
            onChange: (e) => set("name", e.target.value),
            placeholder: "Jane Smith",
            className: "h-8 text-sm bg-background",
            required: true,
            "data-ocid": "client-form-name"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Email *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: form.email,
            onChange: (e) => set("email", e.target.value),
            type: "email",
            placeholder: "jane@acme.com",
            className: "h-8 text-sm bg-background",
            required: true,
            "data-ocid": "client-form-email"
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
            placeholder: "+1 555 0100",
            className: "h-8 text-sm bg-background",
            "data-ocid": "client-form-phone"
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
            placeholder: "Technology",
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
            placeholder: "Key details about this client...",
            className: "text-sm bg-background resize-none",
            rows: 3,
            "data-ocid": "client-form-notes"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-1 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        size: "sm",
        disabled: loading || !form.name.trim() || !form.email.trim(),
        "data-ocid": "client-form-submit",
        children: loading ? "Creating…" : "Create Client"
      }
    ) })
  ] });
}
function KanbanCard({ client, onDragStart }) {
  const days = getDaysInStage(client.updatedAt);
  const stageColor = STAGE_COLORS[client.currentStage] ?? "border-l-border";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/clients/$clientId", params: { clientId: client.id }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      draggable: true,
      onDragStart: (e) => onDragStart(e, client.id),
      className: `entity-card border-l-2 ${stageColor} cursor-grab active:cursor-grabbing group`,
      "data-ocid": "client-kanban-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-1.5 mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate leading-snug", children: client.company ?? client.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: client.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-smooth" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { score: client.healthScore, size: "sm" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            days,
            "d in stage"
          ] }),
          client.healthScore < 40 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-[oklch(0.65_0.19_22)]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-2.5 w-2.5" }),
            "Churn risk"
          ] }),
          client.healthScore >= 70 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex items-center gap-0.5 text-[oklch(0.68_0.22_142)] ml-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "h-2.5 w-2.5" }) })
        ] })
      ]
    }
  ) });
}
function KanbanColumn({
  stage,
  clients,
  onDragStart,
  onDrop
}) {
  const [dragOver, setDragOver] = reactExports.useState(false);
  const requiresApproval = stageRequiresApproval("client", stage);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-[200px] w-[200px] flex-shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2 px-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-foreground font-display truncate", children: stage }),
        requiresApproval && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] px-1 py-0.5 rounded bg-[oklch(0.85_0.24_80)]/20 text-[oklch(0.85_0.24_80)] border border-[oklch(0.85_0.24_80)]/30", children: "gate" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5", children: clients.length })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `flex-1 min-h-[120px] rounded-sm border border-dashed transition-smooth p-1.5 space-y-1.5 ${dragOver ? "border-primary/60 bg-primary/5" : "border-border/50"}`,
        onDragOver: (e) => {
          e.preventDefault();
          setDragOver(true);
        },
        onDragLeave: () => setDragOver(false),
        onDrop: (e) => {
          setDragOver(false);
          onDrop(e, stage);
        },
        "data-ocid": `kanban-column-${stage.toLowerCase().replace(/\s+/g, "-")}`,
        children: [
          clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(KanbanCard, { client: c, onDragStart }, c.id)),
          clients.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-16 text-[10px] text-muted-foreground/40", children: "No clients" })
        ]
      }
    )
  ] });
}
function ListView({ clients }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", "data-ocid": "clients-list-view", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/30", children: [
      "Company",
      "Hiring Manager",
      "Stage",
      "Health",
      "Last Activity",
      "Churn Risk",
      "Actions"
    ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: "px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap",
        children: h
      },
      h
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: clients.map((client) => {
      const isAtRisk = client.healthScore < 40;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border hover:bg-muted/20 transition-smooth",
          "data-ocid": "client-list-row",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/clients/$clientId",
                params: { clientId: client.id },
                className: "hover:text-primary transition-smooth",
                children: client.company ?? client.name
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: client.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-[10px] py-0 h-5", children: client.currentStage }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { score: client.healthScore, showScore: true, size: "sm" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground whitespace-nowrap", children: formatRelativeTime(client.updatedAt) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: isAtRisk ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[oklch(0.65_0.19_22)]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "h-3 w-3" }),
              "High"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50", children: "Low" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/clients/$clientId",
                params: { clientId: client.id },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    className: "h-6 px-2 text-[10px]",
                    children: "View"
                  }
                )
              }
            ) })
          ]
        },
        client.id
      );
    }) })
  ] }) });
}
function ClientsPage() {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const dragId = reactExports.useRef(null);
  const [search, setSearch] = reactExports.useState("");
  const filtered = (clients ?? []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.company ?? "").toLowerCase().includes(q) || c.currentStage.toLowerCase().includes(q);
  });
  const byStage = CLIENT_STAGES.reduce(
    (acc, stage) => {
      acc[stage] = filtered.filter((c) => c.currentStage === stage);
      return acc;
    },
    {}
  );
  function handleDragStart(e, clientId) {
    dragId.current = clientId;
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDrop(e, targetStage) {
    e.preventDefault();
    const id = dragId.current;
    if (!id) return;
    dragId.current = null;
    const client = (clients ?? []).find((c) => c.id === id);
    if (!client || client.currentStage === targetStage) return;
    if (stageRequiresApproval("client", targetStage)) {
      createApproval.mutate(
        {
          entityId: id,
          entityType: "client",
          itemType: "stage_change",
          description: `Move ${client.company ?? client.name} → ${targetStage}`,
          details: `Requested stage change from "${client.currentStage}" to "${targetStage}". Negotiation stage requires manager approval.`,
          requestedBy: "Manager"
        },
        {
          onSuccess: () => ue.success(
            `Approval request created for moving to "${targetStage}"`
          )
        }
      );
    } else {
      updateStage.mutate(
        { entityId: id, entityType: "client", newStage: targetStage },
        {
          onSuccess: () => ue.success(`Moved to "${targetStage}"`)
        }
      );
    }
  }
  function handleCreate(input) {
    createClient.mutate(input, {
      onSuccess: () => {
        setModalOpen(false);
        ue.success("Client created");
      },
      onError: () => ue.error("Failed to create client")
    });
  }
  const totalActive = (clients ?? []).filter(
    (c) => c.currentStage === "Active"
  ).length;
  const atRisk = (clients ?? []).filter((c) => c.healthScore < 40).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "clients-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display", children: "Clients" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground", children: [
          (clients == null ? void 0 : clients.length) ?? 0,
          " total · ",
          totalActive,
          " active",
          atRisk > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[oklch(0.65_0.19_22)] ml-1", children: [
            "· ",
            atRisk,
            " at risk"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search clients…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "h-7 text-xs w-36 sm:w-48 bg-background",
            "data-ocid": "clients-search"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "h-7 gap-1.5 text-xs",
            onClick: () => setModalOpen(true),
            "data-ocid": "add-client-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
              "Add Client"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "kanban", className: "flex flex-col h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 border-b border-border bg-card flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-7 bg-muted/60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "kanban",
              className: "h-6 text-[11px] gap-1",
              "data-ocid": "clients-tab-kanban",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3 w-3" }),
                "Kanban"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            TabsTrigger,
            {
              value: "list",
              className: "h-6 text-[11px] gap-1",
              "data-ocid": "clients-tab-list",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3 w-3" }),
                "List"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground ml-auto hidden sm:block", children: "Drag cards between stages · Negotiation requires approval" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsContent,
        {
          value: "kanban",
          className: "flex-1 overflow-auto p-4 mt-0",
          "data-ocid": "kanban-board",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3", children: CLIENT_STAGES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-[200px] flex-shrink-0 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 w-full" })
          ] }, s)) }) : ((clients == null ? void 0 : clients.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Briefcase,
              title: "No clients yet",
              message: "Add your first client to start tracking the pipeline.",
              action: {
                label: "Add Client",
                onClick: () => setModalOpen(true)
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 min-w-max pb-2", children: CLIENT_STAGES.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            KanbanColumn,
            {
              stage,
              clients: byStage[stage] ?? [],
              onDragStart: handleDragStart,
              onDrop: handleDrop
            },
            stage
          )) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TabsContent,
        {
          value: "list",
          className: "flex-1 overflow-auto mt-0",
          "data-ocid": "list-view",
          children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: ["skel1", "skel2", "skel3", "skel4", "skel5"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full" }, k)) }) : ((clients == null ? void 0 : clients.length) ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Briefcase,
              title: "No clients yet",
              message: "Add your first client to start tracking the pipeline.",
              action: {
                label: "Add Client",
                onClick: () => setModalOpen(true)
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ListView, { clients: filtered })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: modalOpen,
        onOpenChange: setModalOpen,
        title: "Add New Client",
        description: "Create a new client account in the pipeline.",
        size: "md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClientForm, { onSubmit: handleCreate, loading: createClient.isPending })
      }
    )
  ] });
}
export {
  ClientsPage as default
};
