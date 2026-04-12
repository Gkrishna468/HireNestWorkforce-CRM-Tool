import { ActivityTimeline } from "@/components/ui/ActivityTimeline";
import { AppModal } from "@/components/ui/AppModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { StageProgressBar } from "@/components/ui/StageProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { VENDOR_STAGES, stageRequiresApproval } from "@/lib/utils/pipeline";
import type { Submission, Vendor } from "@/types/crm";
import { PIPELINE_STAGES } from "@/types/crm";
import type { ActivityFormInput, VendorFormInput } from "@/types/forms";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle,
  Clock,
  Edit2,
  Mail,
  Phone,
  Plus,
  Timer,
  Users,
  XCircle,
} from "lucide-react";
import { useState } from "react";
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

// ── Stage Colors ──────────────────────────────────────────────────────────────

const STAGE_COLOR_MAP: Record<string, string> = {
  "Resume Sent":
    "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  "Screening Round":
    "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  Selected:
    "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
  "Client Round":
    "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
  "Final Onboarding":
    "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
};

function StageBadge({ stage }: { stage?: string }) {
  if (!stage)
    return <span className="text-[10px] text-muted-foreground">—</span>;
  const cls =
    STAGE_COLOR_MAP[stage] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[10px] font-medium ${cls}`}
    >
      {stage}
    </span>
  );
}

// ── Shared Profiles Section ───────────────────────────────────────────────────

function SharedProfilesSection({ vendorId }: { vendorId: string }) {
  const { data: submissions = [], isLoading } =
    useSubmissionsForVendor(vendorId);

  return (
    <div
      className="p-4 border-b border-border"
      data-ocid="shared-profiles-section"
    >
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-3.5 w-3.5 text-muted-foreground" />
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold">
          Shared Profiles
        </p>
        {submissions.length > 0 && (
          <Badge variant="secondary" className="text-[9px] px-1.5 h-4">
            {submissions.length}
          </Badge>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      ) : submissions.length === 0 ? (
        <div
          className="rounded-md border border-border bg-muted/20 px-3 py-4 text-center"
          data-ocid="shared-profiles-empty"
        >
          <p className="text-xs text-muted-foreground">
            No profiles shared yet
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr_80px] gap-2 px-3 py-1.5 bg-muted/30 border-b border-border">
            {["Candidate", "Job", "Stage", "Date"].map((h) => (
              <span
                key={h}
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
              >
                {h}
              </span>
            ))}
          </div>
          {submissions.map((sub: Submission) => (
            <div
              key={sub.id}
              className="grid grid-cols-[1fr_1fr_1fr_80px] gap-2 px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors duration-150 text-xs items-center"
              data-ocid="shared-profile-row"
            >
              <span className="font-medium text-foreground truncate">
                {sub.candidateName || "—"}
              </span>
              <span className="text-muted-foreground truncate">
                {sub.jobTitle || "—"}
              </span>
              <StageBadge stage={sub.pipelineStage} />
              <span className="text-muted-foreground text-[10px]">
                {new Date(sub.submittedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
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
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
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
}: {
  entityId: string;
  onDone: () => void;
}) {
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

function StageSelector({
  vendor,
}: {
  vendor: Vendor;
}) {
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
        {
          onSuccess: () => toast.success(`Stage updated to ${newStage}`),
        },
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
          <span className="text-xs text-muted-foreground">/</span>
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

        {/* Stage progress */}
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
          <div className="border-r border-border flex flex-col gap-0">
            {/* Vendor info */}
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
              <div className="p-4 space-y-2" data-ocid="vendor-follow-ups">
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

            {/* Shared Profiles */}
            <SharedProfilesSection vendorId={vendorId} />
          </div>

          {/* Right column — Activity Timeline */}
          <div className="flex flex-col">
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
