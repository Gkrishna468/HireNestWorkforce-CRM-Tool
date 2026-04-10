import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { PageLoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useFollowUps,
  usePendingFollowUps,
  useRunFollowUpEngine,
  useUpdateFollowUpStatus,
} from "@/hooks/use-crm";
import {
  followUpStatusColor,
  getTriggerIcon,
  triggerLabel,
} from "@/lib/utils/followup";
import {
  formatDateTime,
  formatRelativeTime,
  getEntityTypeIcon,
  getEntityTypeLabel,
  truncate,
} from "@/lib/utils/format";
import type { EntityType, FollowUp } from "@/types/crm";
import {
  CheckCircle2,
  Clock,
  Filter,
  History,
  MessageSquare,
  Play,
  RefreshCw,
  Send,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Filter state type ─────────────────────────────────────────────────────────
interface Filters {
  entityType: EntityType | "all";
  triggerReason: string;
}

// ── Follow-up card ────────────────────────────────────────────────────────────
function FollowUpCard({
  item,
  showActions,
}: {
  item: FollowUp;
  showActions: boolean;
}) {
  const [editingMsg, setEditingMsg] = useState(false);
  const [editedMsg, setEditedMsg] = useState(item.suggestedMessage ?? "");

  const update = useUpdateFollowUpStatus();
  const busy = update.isPending;

  const EntityIcon = item.entityType
    ? getEntityTypeIcon(item.entityType as EntityType)
    : MessageSquare;
  const TriggerIcon = getTriggerIcon(item.triggerReason);
  const msgPreview = item.suggestedMessage
    ? truncate(item.suggestedMessage, 120)
    : null;

  function handleApprove() {
    update.mutate(
      { id: item.id, status: "approved", approvedBy: "manager" },
      {
        onSuccess: () =>
          toast.success(
            `Approved follow-up for ${item.entityName ?? "entity"}`,
          ),
        onError: () => toast.error("Failed to approve"),
      },
    );
  }

  function handleReject() {
    update.mutate(
      { id: item.id, status: "rejected" },
      {
        onSuccess: () => toast.info("Follow-up rejected"),
        onError: () => toast.error("Failed to reject"),
      },
    );
  }

  function handleSnooze() {
    update.mutate(
      { id: item.id, status: "snoozed", snoozedUntil: Date.now() + 86_400_000 },
      {
        onSuccess: () => toast.info("Snoozed for 24 hours"),
        onError: () => toast.error("Failed to snooze"),
      },
    );
  }

  const statusCls = followUpStatusColor(item.status);

  return (
    <div
      className="entity-card flex flex-col gap-2.5"
      data-ocid={`followup-card-${item.id}`}
    >
      {/* Header */}
      <div className="flex items-start gap-2.5 min-w-0">
        {/* Entity icon */}
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
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${statusCls}`}
            >
              {item.status}
            </span>
          </div>

          {/* Trigger label */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TriggerIcon className="w-3 h-3 flex-shrink-0" />
            <span>{triggerLabel(item.triggerReason)}</span>
          </div>
        </div>

        <div className="flex-shrink-0 text-right">
          <p className="text-[10px] text-muted-foreground whitespace-nowrap">
            {formatRelativeTime(item.createdAt)}
          </p>
          {item.snoozedUntil && item.status === "snoozed" && (
            <p className="text-[10px] text-[oklch(0.85_0.24_80)]">
              until {formatDateTime(item.snoozedUntil)}
            </p>
          )}
          {item.sentAt && (
            <p className="text-[10px] text-[oklch(0.68_0.22_142)]">
              sent {formatRelativeTime(item.sentAt)}
            </p>
          )}
        </div>
      </div>

      {/* Suggested action */}
      <p className="text-xs text-foreground/80 leading-snug pl-9">
        {item.suggestedAction}
      </p>

      {/* Message preview / edit */}
      {msgPreview && !editingMsg && (
        <div className="pl-9">
          <blockquote className="pl-3 border-l-2 border-primary/40 bg-primary/5 rounded-r py-1.5 pr-2">
            <p className="text-[11px] text-foreground/70 italic leading-relaxed">
              &ldquo;{msgPreview}&rdquo;
            </p>
          </blockquote>
        </div>
      )}

      {editingMsg && (
        <div className="pl-9">
          <Textarea
            value={editedMsg}
            onChange={(e) => setEditedMsg(e.target.value)}
            className="text-xs min-h-[72px] resize-none bg-background"
            data-ocid="followup-edit-textarea"
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
                setEditedMsg(item.suggestedMessage ?? "");
                setEditingMsg(false);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {showActions && (
        <div className="flex flex-wrap items-center gap-1.5 pl-9">
          <Button
            size="sm"
            className="h-7 px-3 text-xs bg-[oklch(0.68_0.22_142)]/90 hover:bg-[oklch(0.68_0.22_142)] text-foreground border-0"
            onClick={handleApprove}
            disabled={busy}
            data-ocid={`followup-approve-btn-${item.id}`}
          >
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approve
          </Button>

          {item.suggestedMessage && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs"
              onClick={() => setEditingMsg(!editingMsg)}
              disabled={busy}
              data-ocid={`followup-edit-btn-${item.id}`}
            >
              Edit
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            className="h-7 px-3 text-xs text-[oklch(0.65_0.19_22)] border-[oklch(0.65_0.19_22)]/30 hover:bg-[oklch(0.65_0.19_22)]/10"
            onClick={handleReject}
            disabled={busy}
            data-ocid={`followup-reject-btn-${item.id}`}
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
            data-ocid={`followup-snooze-btn-${item.id}`}
          >
            <Clock className="w-3 h-3 mr-1" />
            Snooze 24h
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Filtered list ──────────────────────────────────────────────────────────────
function FollowUpList({
  items,
  showActions,
  loading,
  emptyTitle,
  emptyMsg,
}: {
  items: FollowUp[];
  showActions: boolean;
  loading: boolean;
  emptyTitle: string;
  emptyMsg: string;
}) {
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
      <EmptyState icon={MessageSquare} title={emptyTitle} message={emptyMsg} />
    );
  }

  return (
    <div className="p-4 space-y-3">
      {items.map((item) => (
        <FollowUpCard key={item.id} item={item} showActions={showActions} />
      ))}
    </div>
  );
}

// ── Filter bar ────────────────────────────────────────────────────────────────
const ENTITY_TYPE_OPTIONS: { value: EntityType | "all"; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "vendor", label: "Vendors" },
  { value: "client", label: "Clients" },
  { value: "recruiter", label: "Recruiters" },
  { value: "candidate", label: "Candidates" },
];

const TRIGGER_OPTIONS = [
  { value: "", label: "All Triggers" },
  { value: "inactivity_48h", label: "Inactive 48h" },
  { value: "inactivity_72h", label: "Inactive 72h" },
  { value: "no_feedback_24h", label: "No Feedback 24h" },
  { value: "stale_3_days", label: "Stale 3+ Days" },
  { value: "low_productivity", label: "Low Productivity" },
  { value: "placement_30_days", label: "30-Day Check-In" },
  { value: "ai_suggestion", label: "AI Suggestion" },
];

function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/40 border-b border-border overflow-x-auto">
      <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <select
        value={filters.entityType}
        onChange={(e) =>
          onChange({
            ...filters,
            entityType: e.target.value as EntityType | "all",
          })
        }
        className="text-xs bg-card border border-border rounded px-2 h-7 text-foreground cursor-pointer"
        data-ocid="filter-entity-type"
      >
        {ENTITY_TYPE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <select
        value={filters.triggerReason}
        onChange={(e) =>
          onChange({ ...filters, triggerReason: e.target.value })
        }
        className="text-xs bg-card border border-border rounded px-2 h-7 text-foreground cursor-pointer"
        data-ocid="filter-trigger-reason"
      >
        {TRIGGER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function applyFilters(items: FollowUp[], filters: Filters): FollowUp[] {
  return items.filter((item) => {
    if (filters.entityType !== "all" && item.entityType !== filters.entityType)
      return false;
    if (filters.triggerReason && item.triggerReason !== filters.triggerReason)
      return false;
    return true;
  });
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function FollowUpsPage() {
  const [filters, setFilters] = useState<Filters>({
    entityType: "all",
    triggerReason: "",
  });

  const pendingQuery = usePendingFollowUps();
  const allQuery = useFollowUps();
  const runEngine = useRunFollowUpEngine();

  const pending: FollowUp[] = pendingQuery.data ?? [];
  const all: FollowUp[] = allQuery.data ?? [];

  const snoozed = all.filter((f) => f.status === "snoozed");
  const sent = all.filter((f) => f.status === "sent");
  const rejected = all.filter((f) => f.status === "rejected");

  const filteredPending = applyFilters(pending, filters);
  const filteredSnoozed = applyFilters(snoozed, filters);
  const filteredSent = applyFilters(sent, filters);
  const filteredRejected = applyFilters(rejected, filters);

  if (pendingQuery.isLoading && !pendingQuery.data)
    return <PageLoadingSpinner />;

  function handleRunEngine() {
    runEngine.mutate(undefined, {
      onSuccess: (count) => {
        const n = typeof count === "number" ? count : 0;
        toast.success(
          n > 0
            ? `Generated ${n} new follow-up(s)`
            : "No new follow-ups generated",
        );
      },
      onError: () => toast.error("Failed to run follow-up engine"),
    });
  }

  return (
    <div
      className="flex flex-col h-full bg-background"
      data-ocid="followups-page"
    >
      <PageHeader
        title="Follow-Up Queue"
        subtitle="Manage AI-suggested follow-ups before they're sent"
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={() => {
                pendingQuery.refetch();
                allQuery.refetch();
              }}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs"
              onClick={handleRunEngine}
              disabled={runEngine.isPending}
              data-ocid="run-engine-btn"
            >
              <Play className="w-3 h-3 mr-1" />
              {runEngine.isPending ? "Running…" : "Run Follow-Up Engine"}
            </Button>
          </div>
        }
      />

      <Tabs
        defaultValue="pending"
        className="flex flex-col flex-1 overflow-hidden"
      >
        <div className="border-b border-border bg-card px-4">
          <TabsList className="h-9 bg-transparent gap-0 p-0">
            {[
              {
                value: "pending",
                label: "Pending",
                count: pending.length,
                icon: MessageSquare,
              },
              {
                value: "snoozed",
                label: "Snoozed",
                count: snoozed.length,
                icon: Clock,
              },
              { value: "sent", label: "Sent", count: sent.length, icon: Send },
              {
                value: "rejected",
                label: "Rejected",
                count: rejected.length,
                icon: History,
              },
            ].map(({ value, label, count, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="text-xs h-9 px-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary bg-transparent"
                data-ocid={`tab-${value}`}
              >
                <Icon className="w-3 h-3 mr-1" />
                {label}
                {count > 0 && (
                  <Badge className="ml-1.5 h-4 px-1.5 text-[10px] bg-primary/20 text-primary border-0">
                    {count}
                  </Badge>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Pending */}
        <TabsContent
          value="pending"
          className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden"
        >
          <FilterBar filters={filters} onChange={setFilters} />
          <FollowUpList
            items={filteredPending}
            showActions
            loading={pendingQuery.isLoading}
            emptyTitle="No pending follow-ups"
            emptyMsg="All caught up! Run the engine to generate new follow-ups."
          />
        </TabsContent>

        {/* Snoozed */}
        <TabsContent
          value="snoozed"
          className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden"
        >
          <FilterBar filters={filters} onChange={setFilters} />
          <FollowUpList
            items={filteredSnoozed}
            showActions={false}
            loading={allQuery.isLoading}
            emptyTitle="No snoozed items"
            emptyMsg="Snoozed follow-ups will reappear here."
          />
        </TabsContent>

        {/* Sent */}
        <TabsContent
          value="sent"
          className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden"
        >
          <FilterBar filters={filters} onChange={setFilters} />
          <FollowUpList
            items={filteredSent}
            showActions={false}
            loading={allQuery.isLoading}
            emptyTitle="No sent follow-ups yet"
            emptyMsg="Approved follow-ups that have been dispatched appear here."
          />
        </TabsContent>

        {/* Rejected */}
        <TabsContent
          value="rejected"
          className="flex-1 overflow-y-auto mt-0 data-[state=inactive]:hidden"
        >
          <FilterBar filters={filters} onChange={setFilters} />
          <FollowUpList
            items={filteredRejected}
            showActions={false}
            loading={allQuery.isLoading}
            emptyTitle="No rejected follow-ups"
            emptyMsg="Follow-ups you reject will be archived here."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
