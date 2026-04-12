import { c as createLucideIcon, a as usePendingApprovals, aK as useApprovalHistory, j as jsxRuntimeExports, P as PageLoadingSpinner, g as Button, e as Badge, aL as ClipboardList, ah as FileText, S as SquareCheckBig, aM as useApproveItem, aN as useRejectItem, w as ue, r as reactExports, aO as useSnoozeItem } from "./index-CyRa7n7i.js";
import { P as PageHeader } from "./PageHeader-BiaDBCE5.js";
import { E as EmptyState } from "./EmptyState-tnItS6cR.js";
import { S as Skeleton } from "./skeleton-BpKAFoue.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-CVBjYSTU.js";
import { T as Textarea } from "./textarea-BAPxRJyG.js";
import { g as getEntityTypeIcon, a as getEntityTypeLabel, f as formatRelativeTime, c as formatDateTime } from "./format-BUD4J0jO.js";
import { R as RefreshCw } from "./refresh-cw-Bm-pXsUH.js";
import { C as CircleAlert } from "./circle-alert-DTsKyaUS.js";
import { C as CircleCheck } from "./circle-check-CNUkdnPW.js";
import { T as Trash2 } from "./trash-2-7WewT4Ki.js";
import { I as Info } from "./info-B7ty1t-V.js";
import { C as CircleX } from "./circle-x-DvuqCKQX.js";
import { C as Clock } from "./clock-Cq34Stte.js";
import "./index-311JCrE2.js";
import "./index-z1c89Qta.js";
import "./index-CyfbzPGF.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3", key: "1u773s" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const CircleHelp = createLucideIcon("circle-help", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
];
const PenLine = createLucideIcon("pen-line", __iconNode);
const PRIORITY_ORDER = {
  offer: 0,
  negotiation: 1,
  submission: 2,
  stage_change: 3,
  follow_up: 4,
  onboarding: 5
};
function prioritySort(a, b) {
  const pa = PRIORITY_ORDER[a.itemType] ?? 99;
  const pb = PRIORITY_ORDER[b.itemType] ?? 99;
  return pa !== pb ? pa - pb : b.createdAt - a.createdAt;
}
const TYPE_BADGE = {
  offer: {
    label: "Offer",
    class: "bg-[oklch(0.68_0.22_142)]/15 text-[oklch(0.68_0.22_142)] border-[oklch(0.68_0.22_142)]/30"
  },
  submission: {
    label: "Submission",
    class: "bg-primary/10 text-primary border-primary/30"
  },
  negotiation: {
    label: "Negotiation",
    class: "bg-[oklch(0.85_0.24_80)]/15 text-[oklch(0.85_0.24_80)] border-[oklch(0.85_0.24_80)]/30"
  },
  stage_change: {
    label: "Stage Change",
    class: "bg-secondary text-secondary-foreground border-border"
  },
  follow_up: {
    label: "Follow-Up",
    class: "bg-accent/10 text-accent border-accent/30"
  },
  onboarding: {
    label: "Onboarding",
    class: "bg-muted text-muted-foreground border-border"
  }
};
function ItemTypeBadge({ type }) {
  const cfg = TYPE_BADGE[type] ?? {
    label: type.replace(/_/g, " "),
    class: "bg-muted text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${cfg.class}`,
      children: cfg.label
    }
  );
}
function StatsBar({ items }) {
  const counts = items.reduce((acc, item) => {
    acc[item.itemType] = (acc[item.itemType] ?? 0) + 1;
    return acc;
  }, {});
  const stats = [
    {
      label: "Total Pending",
      value: items.length,
      icon: ClipboardList,
      accent: "text-foreground"
    },
    {
      label: "Submissions",
      value: counts.submission ?? 0,
      icon: FileText,
      accent: "text-primary"
    },
    {
      label: "Follow-Ups",
      value: counts.follow_up ?? 0,
      icon: RefreshCw,
      accent: "text-accent"
    },
    {
      label: "Stage Changes",
      value: counts.stage_change ?? 0,
      icon: CircleAlert,
      accent: "text-[oklch(0.85_0.24_80)]"
    },
    {
      label: "Offers",
      value: counts.offer ?? 0,
      icon: SquareCheckBig,
      accent: "text-[oklch(0.68_0.22_142)]"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 bg-card border-b border-border", children: stats.map((s) => {
    const Icon = s.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `w-3.5 h-3.5 flex-shrink-0 ${s.accent}` }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground truncate", children: [
        s.label,
        ":"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-sm font-semibold font-display ${s.accent}`, children: s.value })
    ] }, s.label);
  }) });
}
function RejectForm({
  onSubmit,
  onCancel,
  loading
}) {
  const [reason, setReason] = reactExports.useState("");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-3 rounded bg-[oklch(0.65_0.19_22)]/5 border border-[oklch(0.65_0.19_22)]/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Rejection reason (optional):" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Textarea,
      {
        value: reason,
        onChange: (e) => setReason(e.target.value),
        placeholder: "Enter reason...",
        className: "text-xs min-h-[56px] resize-none bg-background",
        "data-ocid": "reject-reason-input"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "destructive",
          onClick: () => onSubmit(reason),
          disabled: loading,
          className: "text-xs h-7 px-3",
          "data-ocid": "reject-confirm-btn",
          children: loading ? "Rejecting…" : "Confirm Reject"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          size: "sm",
          variant: "ghost",
          onClick: onCancel,
          className: "text-xs h-7 px-3",
          children: "Cancel"
        }
      )
    ] })
  ] });
}
function ApprovalCard({ item }) {
  const [showReject, setShowReject] = reactExports.useState(false);
  const [editingMsg, setEditingMsg] = reactExports.useState(false);
  const [editedMsg, setEditedMsg] = reactExports.useState(item.details ?? "");
  const approve = useApproveItem();
  const reject = useRejectItem();
  const snooze = useSnoozeItem();
  const EntityIcon = item.entityType ? getEntityTypeIcon(item.entityType) : Info;
  const isFollowUp = item.itemType === "follow_up";
  function handleApprove() {
    approve.mutate(
      { id: item.id, approvedBy: "manager" },
      {
        onSuccess: () => ue.success(`Approved: ${item.entityName ?? "item"}`),
        onError: () => ue.error("Failed to approve")
      }
    );
  }
  function handleReject(reason) {
    reject.mutate(
      { id: item.id, rejectedBy: "manager", notes: reason },
      {
        onSuccess: () => {
          ue.success("Item rejected");
          setShowReject(false);
        },
        onError: () => ue.error("Failed to reject")
      }
    );
  }
  function handleSnooze() {
    snooze.mutate(
      { id: item.id, snoozedUntil: Date.now() + 864e5 },
      {
        onSuccess: () => ue.info("Snoozed for 24 hours"),
        onError: () => ue.error("Failed to snooze")
      }
    );
  }
  const busy = approve.isPending || reject.isPending || snooze.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "entity-card flex flex-col gap-2.5",
      "data-ocid": `approval-card-${item.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-7 h-7 rounded bg-secondary flex items-center justify-center mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EntityIcon, { className: "w-3.5 h-3.5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground font-display truncate", children: item.entityName ?? "Unknown Entity" }),
              item.entityType && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: getEntityTypeLabel(item.entityType) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ItemTypeBadge, { type: item.itemType })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground leading-snug", children: item.description }),
            item.details && !isFollowUp && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 leading-snug", children: item.details })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: formatRelativeTime(item.createdAt) }),
            item.requestedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
              "by ",
              item.requestedBy
            ] })
          ] })
        ] }),
        isFollowUp && item.details && !editingMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { className: "relative pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r py-2 pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/80 leading-relaxed italic", children: [
          "“",
          item.details,
          "”"
        ] }) }),
        editingMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: editedMsg,
              onChange: (e) => setEditedMsg(e.target.value),
              className: "text-xs min-h-[72px] resize-none bg-background",
              "data-ocid": "edit-message-textarea"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "outline",
                className: "text-xs h-7 px-3",
                onClick: () => setEditingMsg(false),
                children: "Done"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "text-xs h-7 px-3",
                onClick: () => {
                  setEditedMsg(item.details ?? "");
                  setEditingMsg(false);
                },
                children: "Reset"
              }
            )
          ] })
        ] }),
        showReject && /* @__PURE__ */ jsxRuntimeExports.jsx(
          RejectForm,
          {
            onSubmit: handleReject,
            onCancel: () => setShowReject(false),
            loading: reject.isPending
          }
        ),
        !showReject && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "h-7 px-3 text-xs bg-[oklch(0.68_0.22_142)]/90 hover:bg-[oklch(0.68_0.22_142)] text-foreground border-0",
              onClick: handleApprove,
              disabled: busy,
              "data-ocid": `approve-btn-${item.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                "Approve"
              ]
            }
          ),
          isFollowUp && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-3 text-xs",
              onClick: () => setEditingMsg(!editingMsg),
              disabled: busy,
              "data-ocid": `edit-btn-${item.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "w-3 h-3 mr-1" }),
                "Edit"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-3 text-xs text-[oklch(0.65_0.19_22)] border-[oklch(0.65_0.19_22)]/30 hover:bg-[oklch(0.65_0.19_22)]/10",
              onClick: () => setShowReject(true),
              disabled: busy,
              "data-ocid": `reject-btn-${item.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 mr-1" }),
                "Reject"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-3 text-xs text-[oklch(0.85_0.24_80)] border-[oklch(0.85_0.24_80)]/30 hover:bg-[oklch(0.85_0.24_80)]/10",
              onClick: handleSnooze,
              disabled: busy,
              "data-ocid": `snooze-btn-${item.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                "Snooze 24h"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "ghost",
              className: "h-7 px-3 text-xs text-muted-foreground",
              disabled: busy,
              onClick: () => ue.info("Info requested — check pending activities"),
              "data-ocid": `request-info-btn-${item.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleHelp, { className: "w-3 h-3 mr-1" }),
                "Request Info"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function HistoryRow({ item }) {
  const EntityIcon = item.entityType ? getEntityTypeIcon(item.entityType) : Info;
  const statusCfg = {
    approved: {
      label: "Approved",
      cls: "bg-[oklch(0.68_0.22_142)]/15 text-[oklch(0.68_0.22_142)]"
    },
    rejected: {
      label: "Rejected",
      cls: "bg-[oklch(0.65_0.19_22)]/15 text-[oklch(0.65_0.19_22)]"
    },
    snoozed: { label: "Snoozed", cls: "bg-muted text-muted-foreground" },
    sent: { label: "Sent", cls: "bg-primary/10 text-primary" }
  };
  const sc = statusCfg[item.status] ?? {
    label: item.status,
    cls: "bg-muted text-muted-foreground"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-2.5 border-b border-border/50 hover:bg-secondary/30 transition-colors", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(EntityIcon, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-xs font-medium text-foreground truncate min-w-0", children: item.entityName ?? "Unknown" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ItemTypeBadge, { type: item.itemType }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: `px-2 py-0.5 rounded text-[10px] font-semibold ${sc.cls}`,
        children: sc.label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground w-20 text-right flex-shrink-0", children: item.approvedBy ?? item.rejectedBy ?? "—" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground w-28 text-right flex-shrink-0", children: item.approvedAt ? formatDateTime(item.approvedAt) : item.rejectedAt ? formatDateTime(item.rejectedAt) : "—" })
  ] });
}
function PendingTab({
  items,
  loading
}) {
  const approve = useApproveItem();
  const reject = useRejectItem();
  function bulkApproveFollowUps() {
    const targets = items.filter((i) => i.itemType === "follow_up");
    if (!targets.length) {
      ue.info("No follow-up items to approve");
      return;
    }
    Promise.all(
      targets.map(
        (i) => approve.mutateAsync({ id: i.id, approvedBy: "manager" })
      )
    ).then(() => ue.success(`Approved ${targets.length} follow-up(s)`)).catch(() => ue.error("Some approvals failed"));
  }
  function bulkRejectStale() {
    const now = Date.now();
    const staleCutoff = 72 * 60 * 60 * 1e3;
    const targets = items.filter((i) => now - i.createdAt > staleCutoff);
    if (!targets.length) {
      ue.info("No stale items to reject");
      return;
    }
    Promise.all(
      targets.map(
        (i) => reject.mutateAsync({
          id: i.id,
          rejectedBy: "manager",
          notes: "Auto-rejected as stale"
        })
      )
    ).then(() => ue.success(`Rejected ${targets.length} stale item(s)`)).catch(() => ue.error("Some rejections failed"));
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-sm" }, i)) });
  }
  if (!items.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: CircleCheck,
        title: "You're all caught up!",
        message: "No pending approvals at the moment.",
        "data-ocid": "approvals-empty-state"
      }
    );
  }
  const sorted = [...items].sort(prioritySort);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-2 bg-secondary/40 border-b border-border",
        "data-ocid": "bulk-actions-bar",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground font-medium mr-1", children: "Bulk:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-3 text-xs",
              onClick: bulkApproveFollowUps,
              disabled: approve.isPending,
              "data-ocid": "bulk-approve-followups-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1 text-[oklch(0.68_0.22_142)]" }),
                "Approve All Follow-Ups"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-3 text-xs",
              onClick: bulkRejectStale,
              disabled: reject.isPending,
              "data-ocid": "bulk-reject-stale-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3 h-3 mr-1 text-[oklch(0.65_0.19_22)]" }),
                "Reject All Stale"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: sorted.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(ApprovalCard, { item }, item.id)) })
  ] });
}
function HistoryTab({
  items,
  loading
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full rounded-sm" }, i)) });
  }
  if (!items.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      EmptyState,
      {
        icon: FileText,
        title: "No history yet",
        message: "Approved and rejected items will appear here."
      }
    );
  }
  const sorted = [...items].sort((a, b) => {
    const aTime = a.approvedAt ?? a.rejectedAt ?? a.createdAt;
    const bTime = b.approvedAt ?? b.rejectedAt ?? b.createdAt;
    return bTime - aTime;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 px-4 py-2 bg-secondary/40 border-b border-border", children: ["Entity", "Type", "Status", "Action By", "Date"].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider first:flex-1 last:w-28 last:text-right",
        children: h
      },
      h
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: sorted.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryRow, { item }, item.id)) })
  ] });
}
function ApprovalsPage() {
  const pending = usePendingApprovals();
  const history = useApprovalHistory();
  const pendingItems = pending.data ?? [];
  const historyItems = history.data ?? [];
  if (pending.isLoading && !pending.data) return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoadingSpinner, {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full bg-background",
      "data-ocid": "approvals-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PageHeader,
          {
            title: "Approval Queue",
            subtitle: "Review and action all pending approvals",
            actions: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                className: "h-7 px-2 text-xs text-muted-foreground",
                onClick: () => {
                  pending.refetch();
                  history.refetch();
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" })
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Tabs,
          {
            defaultValue: "pending",
            className: "flex flex-col flex-1 overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "h-9 bg-transparent gap-0 p-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  TabsTrigger,
                  {
                    value: "pending",
                    className: "text-xs h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent",
                    "data-ocid": "tab-pending",
                    children: [
                      "Pending",
                      pendingItems.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1.5 h-4 px-1.5 text-[10px] bg-primary/20 text-primary border-0", children: pendingItems.length })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TabsTrigger,
                  {
                    value: "history",
                    className: "text-xs h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent",
                    "data-ocid": "tab-history",
                    children: "History"
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsContent,
                {
                  value: "pending",
                  className: "flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(StatsBar, { items: pendingItems }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PendingTab, { items: pendingItems, loading: pending.isLoading })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                TabsContent,
                {
                  value: "history",
                  className: "flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(HistoryTab, { items: historyItems, loading: history.isLoading })
                }
              )
            ]
          }
        )
      ]
    }
  );
}
export {
  ApprovalsPage as default
};
