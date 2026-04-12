import { r as reactExports, b as usePendingFollowUps, z as useFollowUps, k as useRunFollowUpEngine, j as jsxRuntimeExports, P as PageLoadingSpinner, g as Button, e as Badge, w as ue, E as useUpdateFollowUpStatus } from "./index-DFzRDTvK.js";
import { P as PageHeader } from "./PageHeader-BUeJ7cpa.js";
import { E as EmptyState } from "./EmptyState-DnezKUqa.js";
import { S as Skeleton } from "./skeleton-CTIvbLz2.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-mJpFtQX6.js";
import { T as Textarea } from "./textarea-CMLMyBn3.js";
import { M as MessageSquare } from "./message-square-DUzqIicu.js";
import { C as CalendarCheck } from "./calendar-check-CJ8mUq5p.js";
import { T as TrendingDown } from "./trending-down-B0IlSnDs.js";
import { T as TriangleAlert } from "./triangle-alert-uJtPWc31.js";
import { C as Clock } from "./clock-DiZK3mK1.js";
import { g as getEntityTypeIcon, t as truncate, a as getEntityTypeLabel, f as formatRelativeTime, c as formatDateTime } from "./format-CDF3Jxvi.js";
import { R as RefreshCw } from "./refresh-cw-D0Uh7Un4.js";
import { P as Play } from "./play-BKDhVkRm.js";
import { S as Send } from "./send-uZBf4ZDr.js";
import { H as History } from "./history-Ch257mde.js";
import { F as Funnel } from "./funnel-Cnw9VYvj.js";
import { C as CircleCheck } from "./circle-check-XaYjs7fQ.js";
import { C as CircleX } from "./circle-x-CwldiSxB.js";
import "./index-Duc1n9Yg.js";
import "./index-DU7Vnr2o.js";
import "./index-BSB7TwhW.js";
function triggerLabel(reason) {
  const labels = {
    inactivity_48h: "Inactive 48 hours",
    inactivity_72h: "Inactive 72 hours",
    no_feedback_24h: "No feedback (24h post-interview)",
    stale_3_days: "Stale 3+ days",
    low_productivity: "Low productivity detected",
    placement_30_days: "Approaching 30-day check-in",
    stage_change: "Stage change required",
    ai_suggestion: "AI-suggested action"
  };
  return labels[reason] ?? reason.replace(/_/g, " ");
}
function getTriggerIcon(reason) {
  const icons = {
    inactivity_48h: Clock,
    inactivity_72h: Clock,
    no_feedback_24h: MessageSquare,
    stale_3_days: TriangleAlert,
    low_productivity: TrendingDown,
    placement_30_days: CalendarCheck,
    stage_change: CalendarCheck,
    ai_suggestion: MessageSquare
  };
  return icons[reason] ?? TriangleAlert;
}
function followUpStatusColor(status) {
  switch (status) {
    case "pending":
      return "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20";
    case "approved":
      return "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20";
    case "rejected":
      return "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20";
    case "sent":
      return "text-primary bg-primary/10 border-primary/20";
    case "snoozed":
      return "text-muted-foreground bg-muted border-border";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
}
function FollowUpCard({
  item,
  showActions
}) {
  const [editingMsg, setEditingMsg] = reactExports.useState(false);
  const [editedMsg, setEditedMsg] = reactExports.useState(item.suggestedMessage ?? "");
  const update = useUpdateFollowUpStatus();
  const busy = update.isPending;
  const EntityIcon = item.entityType ? getEntityTypeIcon(item.entityType) : MessageSquare;
  const TriggerIcon = getTriggerIcon(item.triggerReason);
  const msgPreview = item.suggestedMessage ? truncate(item.suggestedMessage, 120) : null;
  function handleApprove() {
    update.mutate(
      { id: item.id, status: "approved", approvedBy: "manager" },
      {
        onSuccess: () => ue.success(
          `Approved follow-up for ${item.entityName ?? "entity"}`
        ),
        onError: () => ue.error("Failed to approve")
      }
    );
  }
  function handleReject() {
    update.mutate(
      { id: item.id, status: "rejected" },
      {
        onSuccess: () => ue.info("Follow-up rejected"),
        onError: () => ue.error("Failed to reject")
      }
    );
  }
  function handleSnooze() {
    update.mutate(
      { id: item.id, status: "snoozed", snoozedUntil: Date.now() + 864e5 },
      {
        onSuccess: () => ue.info("Snoozed for 24 hours"),
        onError: () => ue.error("Failed to snooze")
      }
    );
  }
  const statusCls = followUpStatusColor(item.status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "entity-card flex flex-col gap-2.5",
      "data-ocid": `followup-card-${item.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2.5 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 w-7 h-7 rounded bg-secondary flex items-center justify-center mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EntityIcon, { className: "w-3.5 h-3.5 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-foreground font-display truncate", children: item.entityName ?? "Unknown Entity" }),
              item.entityType && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: getEntityTypeLabel(item.entityType) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${statusCls}`,
                  children: item.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriggerIcon, { className: "w-3 h-3 flex-shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: triggerLabel(item.triggerReason) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-shrink-0 text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground whitespace-nowrap", children: formatRelativeTime(item.createdAt) }),
            item.snoozedUntil && item.status === "snoozed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-[oklch(0.85_0.24_80)]", children: [
              "until ",
              formatDateTime(item.snoozedUntil)
            ] }),
            item.sentAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-[oklch(0.68_0.22_142)]", children: [
              "sent ",
              formatRelativeTime(item.sentAt)
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-foreground/80 leading-snug pl-9", children: item.suggestedAction }),
        msgPreview && !editingMsg && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx("blockquote", { className: "pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r py-1.5 pr-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-foreground/70 italic leading-relaxed", children: [
          "“",
          msgPreview,
          "”"
        ] }) }) }),
        editingMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-9", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              value: editedMsg,
              onChange: (e) => setEditedMsg(e.target.value),
              className: "text-xs min-h-[72px] resize-none bg-background",
              "data-ocid": "followup-edit-textarea"
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
                  setEditedMsg(item.suggestedMessage ?? "");
                  setEditingMsg(false);
                },
                children: "Reset"
              }
            )
          ] })
        ] }),
        showActions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5 pl-9", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "h-7 px-3 text-xs bg-[oklch(0.68_0.22_142)]/90 hover:bg-[oklch(0.68_0.22_142)] text-foreground border-0",
              onClick: handleApprove,
              disabled: busy,
              "data-ocid": `followup-approve-btn-${item.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                "Approve"
              ]
            }
          ),
          item.suggestedMessage && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-3 text-xs",
              onClick: () => setEditingMsg(!editingMsg),
              disabled: busy,
              "data-ocid": `followup-edit-btn-${item.id}`,
              children: "Edit"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              variant: "outline",
              className: "h-7 px-3 text-xs text-[oklch(0.65_0.19_22)] border-[oklch(0.65_0.19_22)]/30 hover:bg-[oklch(0.65_0.19_22)]/10",
              onClick: handleReject,
              disabled: busy,
              "data-ocid": `followup-reject-btn-${item.id}`,
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
              "data-ocid": `followup-snooze-btn-${item.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                "Snooze 24h"
              ]
            }
          )
        ] })
      ]
    }
  );
}
function FollowUpList({
  items,
  showActions,
  loading,
  emptyTitle,
  emptyMsg
}) {
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 w-full rounded-sm" }, i)) });
  }
  if (!items.length) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: MessageSquare, title: emptyTitle, message: emptyMsg });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(FollowUpCard, { item, showActions }, item.id)) });
}
const ENTITY_TYPE_OPTIONS = [
  { value: "all", label: "All Types" },
  { value: "vendor", label: "Vendors" },
  { value: "client", label: "Clients" },
  { value: "recruiter", label: "Recruiters" },
  { value: "candidate", label: "Candidates" }
];
const TRIGGER_OPTIONS = [
  { value: "", label: "All Triggers" },
  { value: "inactivity_48h", label: "Inactive 48h" },
  { value: "inactivity_72h", label: "Inactive 72h" },
  { value: "no_feedback_24h", label: "No Feedback 24h" },
  { value: "stale_3_days", label: "Stale 3+ Days" },
  { value: "low_productivity", label: "Low Productivity" },
  { value: "placement_30_days", label: "30-Day Check-In" },
  { value: "ai_suggestion", label: "AI Suggestion" }
];
function FilterBar({
  filters,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2 bg-secondary/40 border-b border-border overflow-x-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 text-muted-foreground flex-shrink-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: filters.entityType,
        onChange: (e) => onChange({
          ...filters,
          entityType: e.target.value
        }),
        className: "text-xs bg-card border border-border rounded px-2 h-7 text-foreground cursor-pointer",
        "data-ocid": "filter-entity-type",
        children: ENTITY_TYPE_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "select",
      {
        value: filters.triggerReason,
        onChange: (e) => onChange({ ...filters, triggerReason: e.target.value }),
        className: "text-xs bg-card border border-border rounded px-2 h-7 text-foreground cursor-pointer",
        "data-ocid": "filter-trigger-reason",
        children: TRIGGER_OPTIONS.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
      }
    )
  ] });
}
function applyFilters(items, filters) {
  return items.filter((item) => {
    if (filters.entityType !== "all" && item.entityType !== filters.entityType)
      return false;
    if (filters.triggerReason && item.triggerReason !== filters.triggerReason)
      return false;
    return true;
  });
}
function FollowUpsPage() {
  const [filters, setFilters] = reactExports.useState({
    entityType: "all",
    triggerReason: ""
  });
  const pendingQuery = usePendingFollowUps();
  const allQuery = useFollowUps();
  const runEngine = useRunFollowUpEngine();
  const pending = pendingQuery.data ?? [];
  const all = allQuery.data ?? [];
  const snoozed = all.filter((f) => f.status === "snoozed");
  const sent = all.filter((f) => f.status === "sent");
  const rejected = all.filter((f) => f.status === "rejected");
  const filteredPending = applyFilters(pending, filters);
  const filteredSnoozed = applyFilters(snoozed, filters);
  const filteredSent = applyFilters(sent, filters);
  const filteredRejected = applyFilters(rejected, filters);
  if (pendingQuery.isLoading && !pendingQuery.data)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageLoadingSpinner, {});
  function handleRunEngine() {
    runEngine.mutate(void 0, {
      onSuccess: (count) => {
        const n = typeof count === "number" ? count : 0;
        ue.success(
          n > 0 ? `Generated ${n} new follow-up(s)` : "No new follow-ups generated"
        );
      },
      onError: () => ue.error("Failed to run follow-up engine")
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full bg-background",
      "data-ocid": "followups-page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          PageHeader,
          {
            title: "Follow-Up Queue",
            subtitle: "Manage AI-suggested follow-ups before they're sent",
            actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  className: "h-7 px-2 text-xs text-muted-foreground",
                  onClick: () => {
                    pendingQuery.refetch();
                    allQuery.refetch();
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  className: "h-7 px-3 text-xs",
                  onClick: handleRunEngine,
                  disabled: runEngine.isPending,
                  "data-ocid": "run-engine-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3 h-3 mr-1" }),
                    runEngine.isPending ? "Running…" : "Run Follow-Up Engine"
                  ]
                }
              )
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Tabs,
          {
            defaultValue: "pending",
            className: "flex flex-col flex-1 overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TabsList, { className: "h-9 bg-transparent gap-0 p-0", children: [
                {
                  value: "pending",
                  label: "Pending",
                  count: pending.length,
                  icon: MessageSquare
                },
                {
                  value: "snoozed",
                  label: "Snoozed",
                  count: snoozed.length,
                  icon: Clock
                },
                { value: "sent", label: "Sent", count: sent.length, icon: Send },
                {
                  value: "rejected",
                  label: "Rejected",
                  count: rejected.length,
                  icon: History
                }
              ].map(({ value, label, count, icon: Icon }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  value,
                  className: "text-xs h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent",
                  "data-ocid": `tab-${value}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-3 h-3 mr-1" }),
                    label,
                    count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-1.5 h-4 px-1.5 text-[10px] bg-primary/20 text-primary border-0", children: count })
                  ]
                },
                value
              )) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsContent,
                {
                  value: "pending",
                  className: "flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { filters, onChange: setFilters }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FollowUpList,
                      {
                        items: filteredPending,
                        showActions: true,
                        loading: pendingQuery.isLoading,
                        emptyTitle: "No pending follow-ups",
                        emptyMsg: "All caught up! Run the engine to generate new follow-ups."
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsContent,
                {
                  value: "snoozed",
                  className: "flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { filters, onChange: setFilters }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FollowUpList,
                      {
                        items: filteredSnoozed,
                        showActions: false,
                        loading: allQuery.isLoading,
                        emptyTitle: "No snoozed items",
                        emptyMsg: "Snoozed follow-ups will reappear here."
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsContent,
                {
                  value: "sent",
                  className: "flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { filters, onChange: setFilters }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FollowUpList,
                      {
                        items: filteredSent,
                        showActions: false,
                        loading: allQuery.isLoading,
                        emptyTitle: "No sent follow-ups yet",
                        emptyMsg: "Approved follow-ups that have been dispatched appear here."
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsContent,
                {
                  value: "rejected",
                  className: "flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FilterBar, { filters, onChange: setFilters }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      FollowUpList,
                      {
                        items: filteredRejected,
                        showActions: false,
                        loading: allQuery.isLoading,
                        emptyTitle: "No rejected follow-ups",
                        emptyMsg: "Follow-ups you reject will be archived here."
                      }
                    )
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
export {
  FollowUpsPage as default
};
