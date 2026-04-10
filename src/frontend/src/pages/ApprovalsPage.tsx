import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageLoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useApprovalHistory,
  useApproveItem,
  usePendingApprovals,
  useRejectItem,
  useSnoozeItem,
} from "@/hooks/use-crm";
import {
  formatDateTime,
  formatRelativeTime,
  getEntityTypeIcon,
  getEntityTypeLabel,
} from "@/lib/utils/format";
import type { ApprovalItem, EntityType } from "@/types/crm";
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  ClipboardList,
  Clock,
  Edit3,
  FileText,
  HelpCircle,
  Info,
  RefreshCw,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Priority ordering ─────────────────────────────────────────────────────────
const PRIORITY_ORDER: Record<string, number> = {
  offer: 0,
  negotiation: 1,
  submission: 2,
  stage_change: 3,
  follow_up: 4,
  onboarding: 5,
};

function prioritySort(a: ApprovalItem, b: ApprovalItem): number {
  const pa = PRIORITY_ORDER[a.itemType] ?? 99;
  const pb = PRIORITY_ORDER[b.itemType] ?? 99;
  return pa !== pb ? pa - pb : b.createdAt - a.createdAt;
}

// ── Item type badge config ────────────────────────────────────────────────────
const TYPE_BADGE: Record<string, { label: string; class: string }> = {
  offer: {
    label: "Offer",
    class:
      "bg-[oklch(0.68_0.22_142)]/15 text-[oklch(0.68_0.22_142)] border-[oklch(0.68_0.22_142)]/30",
  },
  submission: {
    label: "Submission",
    class: "bg-primary/10 text-primary border-primary/30",
  },
  negotiation: {
    label: "Negotiation",
    class:
      "bg-[oklch(0.85_0.24_80)]/15 text-[oklch(0.85_0.24_80)] border-[oklch(0.85_0.24_80)]/30",
  },
  stage_change: {
    label: "Stage Change",
    class: "bg-secondary text-secondary-foreground border-border",
  },
  follow_up: {
    label: "Follow-Up",
    class: "bg-accent/10 text-accent border-accent/30",
  },
  onboarding: {
    label: "Onboarding",
    class: "bg-muted text-muted-foreground border-border",
  },
};

function ItemTypeBadge({ type }: { type: string }) {
  const cfg = TYPE_BADGE[type] ?? {
    label: type.replace(/_/g, " "),
    class: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${cfg.class}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar({ items }: { items: ApprovalItem[] }) {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.itemType] = (acc[item.itemType] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    {
      label: "Total Pending",
      value: items.length,
      icon: ClipboardList,
      accent: "text-foreground",
    },
    {
      label: "Submissions",
      value: counts.submission ?? 0,
      icon: FileText,
      accent: "text-primary",
    },
    {
      label: "Follow-Ups",
      value: counts.follow_up ?? 0,
      icon: RefreshCw,
      accent: "text-accent",
    },
    {
      label: "Stage Changes",
      value: counts.stage_change ?? 0,
      icon: AlertCircle,
      accent: "text-[oklch(0.85_0.24_80)]",
    },
    {
      label: "Offers",
      value: counts.offer ?? 0,
      icon: CheckSquare,
      accent: "text-[oklch(0.68_0.22_142)]",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 bg-card border-b border-border">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="flex items-center gap-2 min-w-0">
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${s.accent}`} />
            <span className="text-xs text-muted-foreground truncate">
              {s.label}:
            </span>
            <span className={`text-sm font-semibold font-display ${s.accent}`}>
              {s.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Reject inline form ────────────────────────────────────────────────────────
function RejectForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (reason: string) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="mt-2 p-3 rounded bg-[oklch(0.65_0.19_22)]/5 border border-[oklch(0.65_0.19_22)]/20">
      <p className="text-xs text-muted-foreground mb-2">
        Rejection reason (optional):
      </p>
      <Textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Enter reason..."
        className="text-xs min-h-[56px] resize-none bg-background"
        data-ocid="reject-reason-input"
      />
      <div className="flex gap-2 mt-2">
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onSubmit(reason)}
          disabled={loading}
          className="text-xs h-7 px-3"
          data-ocid="reject-confirm-btn"
        >
          {loading ? "Rejecting…" : "Confirm Reject"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          className="text-xs h-7 px-3"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ── Approval card ─────────────────────────────────────────────────────────────
function ApprovalCard({ item }: { item: ApprovalItem }) {
  const [showReject, setShowReject] = useState(false);
  const [editingMsg, setEditingMsg] = useState(false);
  const [editedMsg, setEditedMsg] = useState(item.details ?? "");

  const approve = useApproveItem();
  const reject = useRejectItem();
  const snooze = useSnoozeItem();

  const EntityIcon = item.entityType
    ? getEntityTypeIcon(item.entityType as EntityType)
    : Info;

  const isFollowUp = item.itemType === "follow_up";

  function handleApprove() {
    approve.mutate(
      { id: item.id, approvedBy: "manager" },
      {
        onSuccess: () =>
          toast.success(`Approved: ${item.entityName ?? "item"}`),
        onError: () => toast.error("Failed to approve"),
      },
    );
  }

  function handleReject(reason: string) {
    reject.mutate(
      { id: item.id, rejectedBy: "manager", notes: reason },
      {
        onSuccess: () => {
          toast.success("Item rejected");
          setShowReject(false);
        },
        onError: () => toast.error("Failed to reject"),
      },
    );
  }

  function handleSnooze() {
    snooze.mutate(
      { id: item.id, snoozedUntil: Date.now() + 86_400_000 },
      {
        onSuccess: () => toast.info("Snoozed for 24 hours"),
        onError: () => toast.error("Failed to snooze"),
      },
    );
  }

  const busy = approve.isPending || reject.isPending || snooze.isPending;

  return (
    <div
      className="entity-card flex flex-col gap-2.5"
      data-ocid={`approval-card-${item.id}`}
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5 min-w-0">
        <div className="flex-shrink-0 w-7 h-7 rounded bg-secondary flex items-center justify-center mt-0.5">
          <EntityIcon className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold text-foreground font-display truncate">
              {item.entityName ?? "Unknown Entity"}
            </span>
            {item.entityType && (
              <span className="text-[10px] text-muted-foreground">
                {getEntityTypeLabel(item.entityType as EntityType)}
              </span>
            )}
            <ItemTypeBadge type={item.itemType} />
          </div>
          <p className="text-xs text-foreground leading-snug">
            {item.description}
          </p>
          {item.details && !isFollowUp && (
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              {item.details}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          <p className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(item.createdAt)}
          </p>
          {item.requestedBy && (
            <p className="text-[10px] text-muted-foreground">
              by {item.requestedBy}
            </p>
          )}
        </div>
      </div>

      {/* Follow-up message quote block */}
      {isFollowUp && item.details && !editingMsg && (
        <blockquote className="relative pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r py-2 pr-2">
          <p className="text-xs text-foreground/80 leading-relaxed italic">
            &ldquo;{item.details}&rdquo;
          </p>
        </blockquote>
      )}

      {/* Inline edit textarea */}
      {editingMsg && (
        <div>
          <Textarea
            value={editedMsg}
            onChange={(e) => setEditedMsg(e.target.value)}
            className="text-xs min-h-[72px] resize-none bg-background"
            data-ocid="edit-message-textarea"
          />
          <div className="flex gap-2 mt-1.5">
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-7 px-3"
              onClick={() => setEditingMsg(false)}
            >
              Done
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-7 px-3"
              onClick={() => {
                setEditedMsg(item.details ?? "");
                setEditingMsg(false);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Reject form */}
      {showReject && (
        <RejectForm
          onSubmit={handleReject}
          onCancel={() => setShowReject(false)}
          loading={reject.isPending}
        />
      )}

      {/* Action buttons */}
      {!showReject && (
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            className="h-7 px-3 text-xs bg-[oklch(0.68_0.22_142)]/90 hover:bg-[oklch(0.68_0.22_142)] text-foreground border-0"
            onClick={handleApprove}
            disabled={busy}
            data-ocid={`approve-btn-${item.id}`}
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approve
          </Button>

          {isFollowUp && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs"
              onClick={() => setEditingMsg(!editingMsg)}
              disabled={busy}
              data-ocid={`edit-btn-${item.id}`}
            >
              <Edit3 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs text-[oklch(0.65_0.19_22)] border-[oklch(0.65_0.19_22)]/30 hover:bg-[oklch(0.65_0.19_22)]/10"
            onClick={() => setShowReject(true)}
            disabled={busy}
            data-ocid={`reject-btn-${item.id}`}
          >
            <XCircle className="w-3 h-3 mr-1" />
            Reject
          </Button>

          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs text-[oklch(0.85_0.24_80)] border-[oklch(0.85_0.24_80)]/30 hover:bg-[oklch(0.85_0.24_80)]/10"
            onClick={handleSnooze}
            disabled={busy}
            data-ocid={`snooze-btn-${item.id}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            Snooze 24h
          </Button>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 px-3 text-xs text-muted-foreground"
            disabled={busy}
            onClick={() =>
              toast.info("Info requested — check pending activities")
            }
            data-ocid={`request-info-btn-${item.id}`}
          >
            <HelpCircle className="w-3 h-3 mr-1" />
            Request Info
          </Button>
        </div>
      )}
    </div>
  );
}

// ── History row ────────────────────────────────────────────────────────────────
function HistoryRow({ item }: { item: ApprovalItem }) {
  const EntityIcon = item.entityType
    ? getEntityTypeIcon(item.entityType as EntityType)
    : Info;

  const statusCfg: Record<string, { label: string; cls: string }> = {
    approved: {
      label: "Approved",
      cls: "bg-[oklch(0.68_0.22_142)]/15 text-[oklch(0.68_0.22_142)]",
    },
    rejected: {
      label: "Rejected",
      cls: "bg-[oklch(0.65_0.19_22)]/15 text-[oklch(0.65_0.19_22)]",
    },
    snoozed: { label: "Snoozed", cls: "bg-muted text-muted-foreground" },
    sent: { label: "Sent", cls: "bg-primary/10 text-primary" },
  };
  const sc = statusCfg[item.status] ?? {
    label: item.status,
    cls: "bg-muted text-muted-foreground",
  };

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 border-b border-border/50 hover:bg-secondary/30 transition-colors">
      <EntityIcon className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <span className="flex-1 text-xs font-medium text-foreground truncate min-w-0">
        {item.entityName ?? "Unknown"}
      </span>
      <ItemTypeBadge type={item.itemType} />
      <span
        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${sc.cls}`}
      >
        {sc.label}
      </span>
      <span className="text-[10px] text-muted-foreground w-20 text-right flex-shrink-0">
        {item.approvedBy ?? item.rejectedBy ?? "—"}
      </span>
      <span className="text-[10px] text-muted-foreground w-28 text-right flex-shrink-0">
        {item.approvedAt
          ? formatDateTime(item.approvedAt)
          : item.rejectedAt
            ? formatDateTime(item.rejectedAt)
            : "—"}
      </span>
    </div>
  );
}

// ── Pending tab ────────────────────────────────────────────────────────────────
function PendingTab({
  items,
  loading,
}: { items: ApprovalItem[]; loading: boolean }) {
  const approve = useApproveItem();
  const reject = useRejectItem();

  function bulkApproveFollowUps() {
    const targets = items.filter((i) => i.itemType === "follow_up");
    if (!targets.length) {
      toast.info("No follow-up items to approve");
      return;
    }
    Promise.all(
      targets.map((i) =>
        approve.mutateAsync({ id: i.id, approvedBy: "manager" }),
      ),
    )
      .then(() => toast.success(`Approved ${targets.length} follow-up(s)`))
      .catch(() => toast.error("Some approvals failed"));
  }

  function bulkRejectStale() {
    const now = Date.now();
    const staleCutoff = 72 * 60 * 60 * 1000;
    const targets = items.filter((i) => now - i.createdAt > staleCutoff);
    if (!targets.length) {
      toast.info("No stale items to reject");
      return;
    }
    Promise.all(
      targets.map((i) =>
        reject.mutateAsync({
          id: i.id,
          rejectedBy: "manager",
          notes: "Auto-rejected as stale",
        }),
      ),
    )
      .then(() => toast.success(`Rejected ${targets.length} stale item(s)`))
      .catch(() => toast.error("Some rejections failed"));
  }

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24 w-full rounded-sm" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={CheckCircle2}
        title="You're all caught up!"
        message="No pending approvals at the moment."
        data-ocid="approvals-empty-state"
      />
    );
  }

  const sorted = [...items].sort(prioritySort);

  return (
    <div>
      {/* Bulk actions */}
      <div
        className="flex items-center gap-2 px-4 py-2 bg-secondary/40 border-b border-border"
        data-ocid="bulk-actions-bar"
      >
        <span className="text-xs text-muted-foreground font-medium mr-1">
          Bulk:
        </span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-3 text-xs"
          onClick={bulkApproveFollowUps}
          disabled={approve.isPending}
          data-ocid="bulk-approve-followups-btn"
        >
          <CheckCircle2 className="w-3 h-3 mr-1 text-[oklch(0.68_0.22_142)]" />
          Approve All Follow-Ups
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 px-3 text-xs"
          onClick={bulkRejectStale}
          disabled={reject.isPending}
          data-ocid="bulk-reject-stale-btn"
        >
          <Trash2 className="w-3 h-3 mr-1 text-[oklch(0.65_0.19_22)]" />
          Reject All Stale
        </Button>
      </div>

      <div className="p-4 space-y-3">
        {sorted.map((item) => (
          <ApprovalCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── History tab ────────────────────────────────────────────────────────────────
function HistoryTab({
  items,
  loading,
}: { items: ApprovalItem[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-10 w-full rounded-sm" />
        ))}
      </div>
    );
  }

  if (!items.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No history yet"
        message="Approved and rejected items will appear here."
      />
    );
  }

  const sorted = [...items].sort((a, b) => {
    const aTime = a.approvedAt ?? a.rejectedAt ?? a.createdAt;
    const bTime = b.approvedAt ?? b.rejectedAt ?? b.createdAt;
    return bTime - aTime;
  });

  return (
    <div>
      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-2 bg-secondary/40 border-b border-border">
        {["Entity", "Type", "Status", "Action By", "Date"].map((h) => (
          <span
            key={h}
            className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider first:flex-1 last:w-28 last:text-right"
          >
            {h}
          </span>
        ))}
      </div>
      <div>
        {sorted.map((item) => (
          <HistoryRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ApprovalsPage() {
  const pending = usePendingApprovals();
  const history = useApprovalHistory();

  const pendingItems: ApprovalItem[] = pending.data ?? [];
  const historyItems: ApprovalItem[] = history.data ?? [];

  if (pending.isLoading && !pending.data) return <PageLoadingSpinner />;

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="approvals-page"
    >
      <PageHeader
        title="Approval Queue"
        subtitle="Review and action all pending approvals"
        actions={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-muted-foreground"
            onClick={() => {
              pending.refetch();
              history.refetch();
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </Button>
        }
      />

      <Tabs
        defaultValue="pending"
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="border-b border-border bg-card px-4">
          <TabsList className="h-9 bg-transparent gap-0 p-0">
            <TabsTrigger
              value="pending"
              className="text-xs h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent"
              data-ocid="tab-pending"
            >
              Pending
              {pendingItems.length > 0 && (
                <Badge className="ml-1.5 h-4 px-1.5 text-[10px] bg-primary/20 text-primary border-0">
                  {pendingItems.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="text-xs h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent"
              data-ocid="tab-history"
            >
              History
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="pending"
          className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden"
        >
          <StatsBar items={pendingItems} />
          <PendingTab items={pendingItems} loading={pending.isLoading} />
        </TabsContent>

        <TabsContent
          value="history"
          className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden"
        >
          <HistoryTab items={historyItems} loading={history.isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
