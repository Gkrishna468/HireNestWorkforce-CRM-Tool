import { o as useVendors, p as useCreateVendor, q as useUpdateEntityStage, s as useCreateApprovalItem, r as reactExports, V as VENDOR_STAGES, j as jsxRuntimeExports, t as getSupabaseCreds, L as Link, g as Button, l as Building2, v as stageRequiresApproval, w as ue, e as Badge } from "./index-CJpsmfpK.js";
import { P as PageHeader } from "./PageHeader-CsXjutYr.js";
import { A as AppModal } from "./AppModal-CMGlJVIa.js";
import { E as EmptyState } from "./EmptyState-Cxfw8bbw.js";
import { c as computeHealthStatus, H as HealthBadge } from "./HealthBadge-b-RbYNDH.js";
import { I as Input } from "./input-CVTpUk17.js";
import { L as Label } from "./label-CqWHbwLo.js";
import { S as Skeleton } from "./skeleton-BFJlPyAO.js";
import { T as Textarea } from "./textarea-CvzG_4Xz.js";
import { C as CircleAlert } from "./circle-alert-CscMpHiw.js";
import { L as LayoutGrid, a as List } from "./list-DmgXmeeb.js";
import { P as Plus } from "./plus-IC8Sq5NJ.js";
import { T as Timer } from "./timer-DJKEXQrs.js";
import { C as Clock } from "./clock-C8EcWaCS.js";
import "./index-2-vS7hzN.js";
import "./index-n5rgdcR4.js";
import "./index-J1x_Esqe.js";
import "./index-iU0MTF0o.js";
function getDaysInStage(vendor) {
  const msPerDay = 1e3 * 60 * 60 * 24;
  return Math.floor((Date.now() - vendor.updatedAt) / msPerDay);
}
function getLastActivity(vendor) {
  const diff = Date.now() - vendor.updatedAt;
  const h = Math.floor(diff / 36e5);
  const d = Math.floor(diff / 864e5);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}
function VendorKanbanCard({
  vendor,
  onDragStart
}) {
  const status = computeHealthStatus(vendor.healthScore);
  const days = getDaysInStage(vendor);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vendors/$vendorId", params: { vendorId: vendor.id }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      draggable: true,
      onDragStart: (e) => onDragStart(e, vendor.id),
      className: "bg-card border border-border rounded-md p-2.5 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors group",
      "data-ocid": "vendor-kanban-card",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-1.5 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground truncate leading-tight group-hover:text-primary transition-colors", children: vendor.name }),
            vendor.company && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate leading-tight mt-0.5", children: vendor.company })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { score: vendor.healthScore, status })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-[10px] text-muted-foreground flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Timer, { className: "h-2.5 w-2.5 flex-shrink-0" }),
            days,
            "d in stage"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-2.5 w-2.5 flex-shrink-0" }),
            getLastActivity(vendor)
          ] })
        ] })
      ]
    }
  ) });
}
function KanbanColumn({
  stage,
  vendors,
  onDrop,
  onDragStart
}) {
  const [isDragOver, setIsDragOver] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: [
        "flex flex-col gap-2 min-h-[200px] rounded-md p-2 border transition-colors",
        isDragOver ? "border-primary/50 bg-primary/5" : "border-border bg-muted/20"
      ].join(" "),
      onDragOver: (e) => {
        e.preventDefault();
        setIsDragOver(true);
      },
      onDragLeave: () => setIsDragOver(false),
      onDrop: (e) => {
        setIsDragOver(false);
        onDrop(e, stage);
      },
      "data-ocid": `kanban-col-${stage.toLowerCase().replace(/\s+/g, "-")}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-0.5 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold text-foreground uppercase tracking-wider", children: stage }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "secondary",
              className: "h-4 text-[10px] px-1.5 leading-none",
              children: vendors.length
            }
          )
        ] }),
        vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/50 text-center", children: "Drop here" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1.5", children: vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(VendorKanbanCard, { vendor: v, onDragStart }, v.id)) })
      ]
    }
  );
}
function VendorListRow({ vendor }) {
  const status = computeHealthStatus(vendor.healthScore);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/vendors/$vendorId", params: { vendorId: vendor.id }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-[1fr_100px_80px_90px_80px_80px_60px_60px] gap-2 px-3 py-2 text-xs border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer items-center",
      "data-ocid": "vendor-list-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: vendor.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground truncate", children: vendor.company ?? "—" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: vendor.currentStage }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(HealthBadge, { score: vendor.healthScore, status, showScore: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: getLastActivity(vendor) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-center", children: "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-center", children: "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-center", children: "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "h-6 px-2 text-[10px]", children: "View" })
      ]
    }
  ) });
}
function VendorForm({
  onSubmit,
  isLoading
}) {
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    specialty: "",
    notes: ""
  });
  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      ue.error("Name and email are required.");
      return;
    }
    onSubmit(form);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-3", "data-ocid": "vendor-form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Company Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            name: "company",
            value: form.company ?? "",
            onChange: handleChange,
            placeholder: "Acme Staffing",
            className: "h-8 text-xs",
            "data-ocid": "vendor-form-company"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Contact Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            name: "name",
            value: form.name,
            onChange: handleChange,
            placeholder: "Jane Smith",
            className: "h-8 text-xs",
            required: true,
            "data-ocid": "vendor-form-name"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Email *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            name: "email",
            type: "email",
            value: form.email,
            onChange: handleChange,
            placeholder: "jane@acme.com",
            className: "h-8 text-xs",
            required: true,
            "data-ocid": "vendor-form-email"
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
            placeholder: "+1 555 000 0000",
            className: "h-8 text-xs",
            "data-ocid": "vendor-form-phone"
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
          placeholder: "e.g. IT Staffing, Finance, Healthcare",
          className: "h-8 text-xs",
          "data-ocid": "vendor-form-specialty"
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
          placeholder: "Any relevant notes...",
          className: "text-xs min-h-[60px] resize-none",
          "data-ocid": "vendor-form-notes"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        size: "sm",
        disabled: isLoading || !form.name.trim() || !form.email.trim(),
        "data-ocid": "vendor-form-submit",
        children: isLoading ? "Adding…" : "Add Vendor"
      }
    ) })
  ] });
}
function VendorsPage() {
  var _a;
  const { data: vendors = [], isLoading } = useVendors();
  const createVendor = useCreateVendor();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const [view, setView] = reactExports.useState("kanban");
  const [showModal, setShowModal] = reactExports.useState(false);
  const [dragId, setDragId] = reactExports.useState(null);
  const byStage = {};
  for (const s of VENDOR_STAGES) byStage[s] = [];
  for (const v of vendors) {
    const stage = v.currentStage ?? "Discovery";
    if (byStage[stage]) byStage[stage].push(v);
    else (_a = byStage.Discovery) == null ? void 0 : _a.push(v);
  }
  function handleDragStart(e, id) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }
  function handleDrop(e, newStage) {
    e.preventDefault();
    if (!dragId) return;
    const vendor = vendors.find((v) => v.id === dragId);
    if (!vendor || vendor.currentStage === newStage) return;
    if (stageRequiresApproval("vendor", newStage)) {
      createApproval.mutate(
        {
          entityId: vendor.id,
          entityType: "vendor",
          itemType: "stage_change",
          description: `Move ${vendor.name} to ${newStage}`,
          details: `Requested stage transition: ${vendor.currentStage} → ${newStage}`
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
          onSuccess: () => ue.success(`Moved to ${newStage}`, {
            description: vendor.name
          })
        }
      );
    }
    setDragId(null);
  }
  function handleAddVendor(data) {
    createVendor.mutate(data, {
      onSuccess: () => {
        setShowModal(false);
        ue.success("Vendor added");
      },
      onError: () => ue.error("Failed to add vendor")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "vendors-page", children: [
    !getSupabaseCreds() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/30 flex-shrink-0",
        "data-ocid": "vendors-no-supabase-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5 text-amber-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-300/90", children: [
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
            "to add your credentials before saving data."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: "Vendors",
        subtitle: `${vendors.length} vendor${vendors.length !== 1 ? "s" : ""} · Discovery → Optimization pipeline`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border border-border rounded-md overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setView("kanban"),
                className: [
                  "flex items-center gap-1 px-2 py-1 text-[11px] transition-colors",
                  view === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                ].join(" "),
                "data-ocid": "view-kanban",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3 w-3" }),
                  "Kanban"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => setView("list"),
                className: [
                  "flex items-center gap-1 px-2 py-1 text-[11px] transition-colors",
                  view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                ].join(" "),
                "data-ocid": "view-list",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3 w-3" }),
                  "List"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setShowModal(true),
              className: "h-7 gap-1 text-xs",
              "data-ocid": "add-vendor-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                "Add Vendor"
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-auto bg-background", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-md" }, i)) }) : vendors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: Building2,
        title: "No vendors yet",
        message: "Add your first vendor to start managing the pipeline.",
        action: { label: "Add Vendor", onClick: () => setShowModal(true) }
      }
    ) : view === "kanban" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid gap-3 min-w-[900px]",
        style: {
          gridTemplateColumns: `repeat(${VENDOR_STAGES.length}, minmax(160px, 1fr))`
        },
        children: VENDOR_STAGES.map((stage) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          KanbanColumn,
          {
            stage,
            vendors: byStage[stage] ?? [],
            onDrop: handleDrop,
            onDragStart: handleDragStart
          },
          stage
        ))
      }
    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_100px_80px_90px_80px_80px_60px_60px] gap-2 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Name / Company" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Stage" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Health" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Last Activity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center", children: "Submissions" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center", children: "Resp. Time" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center", children: "Quality" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
      ] }),
      vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(VendorListRow, { vendor: v }, v.id))
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: showModal,
        onOpenChange: setShowModal,
        title: "Add Vendor",
        description: "Enter vendor contact and company details.",
        size: "md",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          VendorForm,
          {
            onSubmit: handleAddVendor,
            isLoading: createVendor.isPending
          }
        )
      }
    )
  ] });
}
export {
  VendorsPage as default
};
