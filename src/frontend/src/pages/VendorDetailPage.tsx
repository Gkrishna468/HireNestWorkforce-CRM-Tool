import { ActivityTimeline } from "@/components/ui/ActivityTimeline";
import { AppModal } from "@/components/ui/AppModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { StageProgressBar } from "@/components/ui/StageProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useActivities,
  useCreateApprovalItem,
  useFollowUps,
  useLogActivity,
  useSubmissionsForVendor,
  useUpdateEntityStage,
  useUpdateFollowUpStatus,
  useUpdateVendor,
  useVendors,
} from "@/hooks/use-crm";
import { computeHealthStatus } from "@/lib/utils/health";
import {
  PIPELINE_STAGE_COLORS,
  PIPELINE_STAGE_LABELS,
  VENDOR_STAGES,
  getDaysInStage,
  stageRequiresApproval,
} from "@/lib/utils/pipeline";
import type { Submission, SubmissionPipelineStage, Vendor } from "@/types/crm";
import type { ActivityFormInput, VendorFormInput } from "@/types/forms";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpDown,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Edit2,
  ExternalLink,
  Filter,
  Mail,
  Phone,
  Plus,
  Timer,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ── Outcome Helpers ───────────────────────────────────────────────────────────

type Outcome = "Active" | "Placed" | "Rejected" | "On Hold";

function getOutcome(stage: SubmissionPipelineStage | undefined): Outcome {
  if (stage === "placed") return "Placed";
  if (stage === "rejected") return "Rejected";
  if (stage === "offer_extended" || stage === "offer_accepted")
    return "On Hold";
  return "Active";
}

const OUTCOME_CONFIG: Record<Outcome, { className: string }> = {
  Active: {
    className:
      "border-[oklch(0.5_0.18_207)]/40 text-[oklch(0.5_0.18_207)] bg-[oklch(0.5_0.18_207)]/10",
  },
  Placed: {
    className:
      "border-[oklch(0.68_0.22_142)]/40 text-[oklch(0.68_0.22_142)] bg-[oklch(0.68_0.22_142)]/10",
  },
  Rejected: {
    className:
      "border-[oklch(0.65_0.19_22)]/40 text-[oklch(0.65_0.19_22)] bg-[oklch(0.65_0.19_22)]/10",
  },
  "On Hold": {
    className:
      "border-[oklch(0.85_0.24_80)]/40 text-[oklch(0.85_0.24_80)] bg-[oklch(0.85_0.24_80)]/10",
  },
};

// ── Stage Badge ───────────────────────────────────────────────────────────────

function StageBadge({ stage }: { stage: SubmissionPipelineStage | undefined }) {
  if (!stage)
    return <span className="text-[10px] text-muted-foreground">—</span>;
  const color = PIPELINE_STAGE_COLORS[stage] ?? "#6b7280";
  const label = PIPELINE_STAGE_LABELS[stage] ?? stage;
  return (
    <span
      className="inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium"
      style={{
        borderColor: `${color}40`,
        color,
        backgroundColor: `${color}15`,
      }}
    >
      {label}
    </span>
  );
}

// ── Stats Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="bg-muted/30 border border-border rounded-md px-3 py-2.5 space-y-0.5"
      data-ocid="stat-card"
    >
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p
        className="text-xl font-bold font-display leading-none"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

// ── Enhanced Shared Profiles Section ─────────────────────────────────────────

type SortKey = "date" | "stage" | "days";
type OutcomeFilter = "All" | Outcome;

function SharedProfilesSection({ vendorId }: { vendorId: string }) {
  const { data: submissions = [], isLoading } =
    useSubmissionsForVendor(vendorId);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortAsc, setSortAsc] = useState(false);
  const [outcomeFilter, setOutcomeFilter] = useState<OutcomeFilter>("All");

  // Poll every 5s when tab active
  useEffect(() => {
    const interval = setInterval(() => {
      // visibility-gated polling; react-query handles actual refetch via staleTime
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const total = submissions.length;
  const placed = submissions.filter(
    (s: Submission) => s.pipelineStage === "placed",
  ).length;
  const active = submissions.filter((s: Submission) => {
    const stage = s.pipelineStage;
    return stage && stage !== "placed" && stage !== "rejected";
  }).length;
  const conversionRate = total > 0 ? Math.round((placed / total) * 100) : 0;

  // Filter + sort
  const filtered = useMemo(() => {
    let list = submissions as Submission[];
    if (outcomeFilter !== "All") {
      list = list.filter((s) => getOutcome(s.pipelineStage) === outcomeFilter);
    }
    return [...list].sort((a, b) => {
      let diff = 0;
      if (sortKey === "date") {
        diff = a.submittedAt - b.submittedAt;
      } else if (sortKey === "stage") {
        const stageOrder = Object.keys(PIPELINE_STAGE_LABELS);
        diff =
          stageOrder.indexOf(a.pipelineStage ?? "") -
          stageOrder.indexOf(b.pipelineStage ?? "");
      } else if (sortKey === "days") {
        diff =
          getDaysInStage(a.lastStageChangeAt, String(a.submittedAt)) -
          getDaysInStage(b.lastStageChangeAt, String(b.submittedAt));
      }
      return sortAsc ? diff : -diff;
    });
  }, [submissions, sortKey, sortAsc, outcomeFilter]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  function SortHeader({ label, sKey }: { label: string; sKey: SortKey }) {
    const active = sortKey === sKey;
    return (
      <button
        type="button"
        onClick={() => toggleSort(sKey)}
        className={`flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
          active
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
        data-ocid={`sort-${sKey}`}
      >
        {label}
        <ArrowUpDown
          className={`h-2.5 w-2.5 ${active ? "opacity-100" : "opacity-40"}`}
        />
      </button>
    );
  }

  return (
    <div
      className="p-4 border-b border-border"
      data-ocid="shared-profiles-section"
    >
      {/* Section title */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground font-display uppercase tracking-wide">
            Shared Profiles
          </p>
          {total > 0 && (
            <Badge variant="secondary" className="text-[9px] px-1.5 h-4">
              {total}
            </Badge>
          )}
        </div>

        {/* Outcome filter */}
        {total > 0 && (
          <div className="flex items-center gap-1.5">
            <Filter className="h-3 w-3 text-muted-foreground" />
            <Select
              value={outcomeFilter}
              onValueChange={(v) => setOutcomeFilter(v as OutcomeFilter)}
            >
              <SelectTrigger
                className="h-6 text-[10px] w-[100px]"
                data-ocid="outcome-filter"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    "All",
                    "Active",
                    "Placed",
                    "Rejected",
                    "On Hold",
                  ] as OutcomeFilter[]
                ).map((o) => (
                  <SelectItem key={o} value={o} className="text-xs">
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {total > 0 && (
        <div
          className="grid grid-cols-2 gap-2 mb-3"
          data-ocid="vendor-stats-row"
        >
          <StatCard label="Total Shared" value={total} sub="candidates" />
          <StatCard
            label="Active"
            value={active}
            sub="in pipeline"
            accent="#6366f1"
          />
          <StatCard
            label="Placed"
            value={placed}
            sub="successfully"
            accent="#059669"
          />
          <StatCard
            label="Conversion"
            value={`${conversionRate}%`}
            sub="placement rate"
            accent={
              conversionRate >= 30
                ? "#059669"
                : conversionRate >= 15
                  ? "#f59e0b"
                  : "#ef4444"
            }
          />
        </div>
      )}

      {/* Table */}
      {isLoading ? (
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full rounded" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div
          className="rounded-md border border-dashed border-border bg-muted/10 px-3 py-5 text-center"
          data-ocid="shared-profiles-empty"
        >
          <Users className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs font-medium text-foreground mb-0.5">
            No candidates shared yet
          </p>
          <p className="text-[10px] text-muted-foreground">
            No candidates have been shared by this vendor yet.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-md border border-border bg-muted/10 px-3 py-4 text-center text-xs text-muted-foreground">
          No submissions match the "{outcomeFilter}" filter.
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] gap-x-2 px-3 py-1.5 bg-muted/30 border-b border-border items-center">
            <SortHeader label="Date" sKey="date" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Candidate
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Job
            </span>
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Client
            </span>
            <SortHeader label="Stage" sKey="stage" />
            <SortHeader label="Days" sKey="days" />
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Outcome
            </span>
          </div>

          {filtered.map((sub: Submission) => {
            const days = getDaysInStage(
              sub.lastStageChangeAt,
              String(sub.submittedAt),
            );
            const outcome = getOutcome(sub.pipelineStage);
            const outcomeConfig = OUTCOME_CONFIG[outcome];
            const isStale = days > 7;

            return (
              <div
                key={sub.id}
                className="grid grid-cols-[auto_1fr_1fr_auto_auto_auto_auto] gap-x-2 px-3 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors items-center"
                data-ocid="shared-profile-row"
              >
                {/* Date */}
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                  {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>

                {/* Candidate */}
                <span className="text-xs font-medium text-foreground truncate min-w-0">
                  {sub.candidateName || "—"}
                </span>

                {/* Job */}
                <span className="text-xs text-muted-foreground truncate min-w-0">
                  {sub.jobTitle || "—"}
                </span>

                {/* Client */}
                <span className="text-[10px] text-muted-foreground truncate max-w-[80px]">
                  {sub.clientName || "—"}
                </span>

                {/* Stage */}
                <div className="flex-shrink-0">
                  <StageBadge stage={sub.pipelineStage} />
                </div>

                {/* Days in Stage */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {isStale ? (
                    <AlertTriangle className="h-2.5 w-2.5 text-[oklch(0.85_0.24_80)]" />
                  ) : (
                    <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                  )}
                  <span
                    className={`text-[10px] font-medium ${isStale ? "text-[oklch(0.85_0.24_80)]" : "text-muted-foreground"}`}
                    title={
                      isStale
                        ? "Stale — more than 7 days in this stage"
                        : undefined
                    }
                  >
                    {days}d
                  </span>
                </div>

                {/* Outcome */}
                <Badge
                  variant="outline"
                  className={`text-[10px] py-0 h-5 flex-shrink-0 ${outcomeConfig.className}`}
                  data-ocid="outcome-badge"
                >
                  {outcome}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Metric Card ───────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  sub,
}: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="bg-muted/30 border border-border rounded-md px-3 py-2">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-0.5">
        {label}
      </p>
      <p className="text-lg font-bold text-foreground font-display leading-none">
        {value}
      </p>
      {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  );
}

// ── Edit Vendor Form ──────────────────────────────────────────────────────────

function EditVendorForm({
  vendor,
  onSave,
  onCancel,
  isLoading,
}: {
  vendor: Vendor;
  onSave: (data: Partial<VendorFormInput>) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<Partial<VendorFormInput>>({
    name: vendor.name,
    email: vendor.email,
    phone: vendor.phone ?? "",
    company: vendor.company ?? "",
    specialty: vendor.specialty ?? "",
    notes: vendor.notes ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-3"
      data-ocid="edit-vendor-form"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Contact Name</Label>
          <Input
            name="name"
            value={form.name ?? ""}
            onChange={handleChange}
            className="h-8 text-xs"
            required
            data-ocid="edit-vendor-name"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Company</Label>
          <Input
            name="company"
            value={form.company ?? ""}
            onChange={handleChange}
            className="h-8 text-xs"
            data-ocid="edit-vendor-company"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Email</Label>
          <Input
            name="email"
            type="email"
            value={form.email ?? ""}
            onChange={handleChange}
            className="h-8 text-xs"
            required
            data-ocid="edit-vendor-email"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Phone</Label>
          <Input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            className="h-8 text-xs"
            data-ocid="edit-vendor-phone"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Specialty</Label>
        <Input
          name="specialty"
          value={form.specialty ?? ""}
          onChange={handleChange}
          className="h-8 text-xs"
          data-ocid="edit-vendor-specialty"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Notes</Label>
        <Textarea
          name="notes"
          value={form.notes ?? ""}
          onChange={handleChange}
          className="text-xs min-h-[70px] resize-none"
          data-ocid="edit-vendor-notes"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="h-7 text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          className="h-7 text-xs"
          data-ocid="edit-vendor-save"
        >
          {isLoading ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// ── Log Activity Form ─────────────────────────────────────────────────────────

function LogActivityForm({
  entityId,
  onDone,
}: { entityId: string; onDone: () => void }) {
  const logActivity = useLogActivity();
  const [form, setForm] = useState<ActivityFormInput>({
    entityId,
    activityType: "note",
    direction: "outbound",
    notes: "",
    createdBy: "Manager",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target
        .value as ActivityFormInput[keyof ActivityFormInput],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    logActivity.mutate(form, {
      onSuccess: () => {
        toast.success("Activity logged");
        onDone();
      },
      onError: () => toast.error("Failed to log activity"),
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      data-ocid="log-activity-form"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Type</Label>
          <select
            name="activityType"
            value={form.activityType}
            onChange={handleChange}
            className="w-full h-8 text-xs bg-background border border-input rounded-md px-2 text-foreground"
            data-ocid="activity-type"
          >
            <option value="call">Call</option>
            <option value="email">Email</option>
            <option value="meeting">Meeting</option>
            <option value="submission">Submission</option>
            <option value="note">Note</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Direction</Label>
          <select
            name="direction"
            value={form.direction ?? "outbound"}
            onChange={handleChange}
            className="w-full h-8 text-xs bg-background border border-input rounded-md px-2 text-foreground"
            data-ocid="activity-direction"
          >
            <option value="outbound">Outbound</option>
            <option value="inbound">Inbound</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Notes</Label>
        <Textarea
          name="notes"
          value={form.notes ?? ""}
          onChange={handleChange}
          placeholder="What happened?"
          className="text-xs min-h-[60px] resize-none"
          data-ocid="activity-notes"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDone}
          className="h-7 text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={logActivity.isPending}
          className="h-7 text-xs"
          data-ocid="activity-submit"
        >
          {logActivity.isPending ? "Logging…" : "Log Activity"}
        </Button>
      </div>
    </form>
  );
}

// ── Follow-Up Row ─────────────────────────────────────────────────────────────

function FollowUpRow({
  followUp,
}: {
  followUp: {
    id: string;
    triggerReason: string;
    suggestedAction: string;
    suggestedMessage?: string;
    status: string;
  };
}) {
  const updateStatus = useUpdateFollowUpStatus();

  function act(
    status: "approved" | "rejected" | "snoozed",
    snoozedUntil?: number,
  ) {
    updateStatus.mutate(
      { id: followUp.id, status, snoozedUntil },
      {
        onSuccess: () =>
          toast.success(
            status === "approved"
              ? "Follow-up approved"
              : status === "snoozed"
                ? "Snoozed 24h"
                : "Follow-up rejected",
          ),
      },
    );
  }

  return (
    <div
      className="border border-border rounded-md p-3 space-y-2 bg-card"
      data-ocid="follow-up-row"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
            {followUp.triggerReason}
          </p>
          <p className="text-xs text-foreground mt-0.5">
            {followUp.suggestedAction}
          </p>
          {followUp.suggestedMessage && (
            <p className="text-[11px] text-muted-foreground mt-1 italic bg-muted/30 px-2 py-1 rounded border border-border">
              "{followUp.suggestedMessage}"
            </p>
          )}
        </div>
        <Badge
          variant="secondary"
          className="text-[9px] uppercase tracking-wide flex-shrink-0"
        >
          {followUp.status}
        </Badge>
      </div>
      {followUp.status === "pending" && (
        <div
          className="flex items-center gap-1.5"
          data-ocid="follow-up-actions"
        >
          <Button
            type="button"
            size="sm"
            onClick={() => act("approved")}
            disabled={updateStatus.isPending}
            className="h-6 px-2 text-[10px] gap-1"
            data-ocid="follow-up-approve"
          >
            <CheckCircle className="h-3 w-3" />
            Approve
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => act("snoozed", Date.now() + 86400000)}
            disabled={updateStatus.isPending}
            className="h-6 px-2 text-[10px] gap-1"
            data-ocid="follow-up-snooze"
          >
            <Clock className="h-3 w-3" />
            Snooze
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => act("rejected")}
            disabled={updateStatus.isPending}
            className="h-6 px-2 text-[10px] text-destructive hover:text-destructive gap-1"
            data-ocid="follow-up-reject"
          >
            <XCircle className="h-3 w-3" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Submissions Chart ─────────────────────────────────────────────────────────

const MOCK_CHART_DATA = [
  { day: "Mon", submissions: 2 },
  { day: "Tue", submissions: 4 },
  { day: "Wed", submissions: 1 },
  { day: "Thu", submissions: 3 },
  { day: "Fri", submissions: 5 },
  { day: "Sat", submissions: 0 },
  { day: "Sun", submissions: 2 },
];

function SubmissionsChart() {
  return (
    <div className="mt-2" data-ocid="submissions-chart">
      <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wide font-semibold">
        Submissions — Last 7 days
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart
          data={MOCK_CHART_DATA}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="day"
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "4px",
              fontSize: "11px",
              color: "hsl(var(--foreground))",
            }}
          />
          <Bar
            dataKey="submissions"
            fill="hsl(var(--primary))"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Stage Selector ────────────────────────────────────────────────────────────

function StageSelector({ vendor }: { vendor: Vendor }) {
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();

  function moveToStage(newStage: string) {
    if (newStage === vendor.currentStage) return;
    if (stageRequiresApproval("vendor", newStage)) {
      createApproval.mutate(
        {
          entityId: vendor.id,
          entityType: "vendor",
          itemType: "stage_change",
          description: `Move ${vendor.name} to ${newStage}`,
          details: `Stage transition: ${vendor.currentStage} → ${newStage}`,
        },
        {
          onSuccess: () =>
            toast.info("Stage change queued for approval", {
              description: `${vendor.name} → ${newStage}`,
            }),
        },
      );
    } else {
      updateStage.mutate(
        { entityId: vendor.id, entityType: "vendor", newStage },
        { onSuccess: () => toast.success(`Stage updated to ${newStage}`) },
      );
    }
  }

  return (
    <div
      className="flex items-center gap-1 flex-wrap mt-1"
      data-ocid="stage-selector"
    >
      {VENDOR_STAGES.map((s) => {
        const isCurrent = s === vendor.currentStage;
        const requiresApproval = stageRequiresApproval("vendor", s);
        return (
          <button
            key={s}
            type="button"
            onClick={() => moveToStage(s)}
            disabled={isCurrent}
            className={[
              "px-2 py-0.5 text-[10px] rounded border transition-colors",
              isCurrent
                ? "bg-primary text-primary-foreground border-primary cursor-default"
                : "border-border text-muted-foreground hover:border-primary/60 hover:text-foreground",
            ].join(" ")}
            title={requiresApproval ? "Requires approval" : undefined}
          >
            {s}
            {requiresApproval && !isCurrent && (
              <span className="ml-1 text-[9px] opacity-60">*</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function VendorDetailPage() {
  const { vendorId } = useParams({ from: "/vendors/$vendorId" });
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  const vendor = vendors.find((v) => v.id === vendorId) ?? null;
  const { data: activities = [], isLoading: activitiesLoading } = useActivities(
    vendorId ?? "",
  );
  const { data: followUps = [] } = useFollowUps();
  const vendorFollowUps = followUps.filter(
    (f) => f.entityId === vendorId && f.status === "pending",
  );

  const updateVendor = useUpdateVendor();
  const [isEditing, setIsEditing] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);

  if (vendorsLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <EmptyState
        icon={Building2}
        title="Vendor not found"
        message="This vendor doesn't exist or was removed."
        action={{
          label: "Back to Vendors",
          onClick: () => window.history.back(),
        }}
      />
    );
  }

  const status = computeHealthStatus(vendor.healthScore);
  const daysInStage = Math.floor((Date.now() - vendor.updatedAt) / 86400000);

  function handleSave(data: Partial<VendorFormInput>) {
    updateVendor.mutate(
      { id: vendor!.id, input: data },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Vendor updated");
        },
        onError: () => toast.error("Update failed"),
      },
    );
  }

  return (
    <div className="flex flex-col h-full" data-ocid="vendor-detail-page">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 space-y-3">
        <div className="flex items-center gap-2">
          <Link
            to="/vendors"
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="back-to-vendors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="text-xs text-muted-foreground">Vendors</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
          <span className="text-xs text-foreground font-medium truncate">
            {vendor.name}
          </span>
        </div>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-foreground font-display leading-tight">
                {vendor.name}
              </h1>
              {vendor.company && (
                <span className="text-sm text-muted-foreground">
                  · {vendor.company}
                </span>
              )}
              <HealthBadge
                score={vendor.healthScore}
                status={status}
                showLabel
                showScore
                size="lg"
              />
            </div>
            {vendor.specialty && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {vendor.specialty}
              </p>
            )}
            <StageSelector vendor={vendor} />
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setIsEditing(true)}
            className="h-7 gap-1 text-xs flex-shrink-0"
            data-ocid="edit-vendor-btn"
          >
            <Edit2 className="h-3 w-3" />
            Edit
          </Button>
        </div>

        <StageProgressBar
          stages={VENDOR_STAGES}
          currentStage={vendor.currentStage}
          compact
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto bg-background">
        <div className="grid md:grid-cols-[300px_1fr] gap-0 h-full">
          {/* Left column */}
          <div className="border-r border-border flex flex-col gap-0 overflow-auto">
            {/* Contact Info */}
            <div className="p-4 space-y-2 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">
                Contact Info
              </p>
              {vendor.email && (
                <div className="flex items-center gap-1.5 text-xs text-foreground">
                  <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`mailto:${vendor.email}`}
                    className="hover:text-primary transition-colors truncate"
                    data-ocid="vendor-email"
                  >
                    {vendor.email}
                  </a>
                </div>
              )}
              {vendor.phone && (
                <div className="flex items-center gap-1.5 text-xs text-foreground">
                  <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`tel:${vendor.phone}`}
                    className="hover:text-primary transition-colors"
                    data-ocid="vendor-phone"
                  >
                    {vendor.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Timer className="h-3 w-3 flex-shrink-0" />
                <span>
                  {daysInStage}d in {vendor.currentStage}
                </span>
              </div>
              {vendor.notes && (
                <p className="text-xs text-muted-foreground bg-muted/30 rounded px-2 py-1.5 mt-2 leading-relaxed">
                  {vendor.notes}
                </p>
              )}
            </div>

            {/* Metrics */}
            <div className="p-4 space-y-2 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                Metrics
              </p>
              <div className="grid grid-cols-2 gap-2">
                <MetricCard label="Today" value="—" sub="submissions" />
                <MetricCard label="Total" value="—" sub="submissions" />
                <MetricCard label="Accepted" value="—" sub="accepted" />
                <MetricCard label="Accept Rate" value="—" sub="%" />
                <MetricCard label="Avg Resp." value="—" sub="hours" />
                <MetricCard label="Quality" value="—" sub="/ 100" />
              </div>
              <SubmissionsChart />
            </div>

            {/* Follow-ups */}
            {vendorFollowUps.length > 0 && (
              <div
                className="p-4 space-y-2 border-b border-border"
                data-ocid="vendor-follow-ups"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
                  Pending Follow-Ups ({vendorFollowUps.length})
                </p>
                <div className="space-y-2">
                  {vendorFollowUps.map((f) => (
                    <FollowUpRow key={f.id} followUp={f} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="flex flex-col overflow-auto">
            {/* Enhanced Shared Profiles */}
            <SharedProfilesSection vendorId={vendorId} />

            {/* Activity Timeline */}
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold text-foreground">
                    Activity Timeline
                  </p>
                  <Badge variant="secondary" className="text-[9px] px-1.5">
                    {activities.length}
                  </Badge>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowActivityModal(true)}
                  className="h-7 gap-1 text-xs"
                  data-ocid="add-activity-btn"
                >
                  <Plus className="h-3 w-3" />
                  Log Activity
                </Button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {activitiesLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <ActivityTimeline
                    activities={activities}
                    emptyMessage="No activities yet. Log the first interaction."
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <AppModal
        open={isEditing}
        onOpenChange={setIsEditing}
        title={`Edit Vendor · ${vendor.name}`}
        size="md"
      >
        <EditVendorForm
          vendor={vendor}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
          isLoading={updateVendor.isPending}
        />
      </AppModal>

      {/* Log Activity Modal */}
      <AppModal
        open={showActivityModal}
        onOpenChange={setShowActivityModal}
        title="Log Activity"
        description={`Recording activity for ${vendor.name}`}
        size="md"
      >
        <LogActivityForm
          entityId={vendor.id}
          onDone={() => setShowActivityModal(false)}
        />
      </AppModal>
    </div>
  );
}
