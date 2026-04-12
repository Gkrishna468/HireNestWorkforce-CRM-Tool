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
  useClientJobLinks,
  useClients,
  useCreateApprovalItem,
  useCreateClientJobLink,
  useCreateJob,
  useFollowUps,
  useJobs,
  useJobsForClient,
  useSoftDeleteClientJobLink,
  useSubmissionsForJob,
  useUpdateClient,
  useUpdateEntityStage,
  useUpdateFollowUpStatus,
  useUpdateJob,
} from "@/hooks/use-crm";
import { formatCurrency, formatRelativeTime } from "@/lib/utils/format";
import {
  CLIENT_STAGES,
  PIPELINE_STAGE_LABELS,
  nextStage,
  stageRequiresApproval,
} from "@/lib/utils/pipeline";
import type {
  Client,
  ClientJobLink,
  FollowUp,
  Job,
  Submission,
} from "@/types/crm";
import type { ClientFormInput, JobFormInput } from "@/types/forms";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle,
  Clock,
  Edit2,
  ExternalLink,
  Link2,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  TrendingDown,
  Unlink,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ── Job Status Badge ───────────────────────────────────────────────────────────

const JOB_STATUS_CONFIG = {
  open: {
    label: "Open",
    className:
      "border-[oklch(0.68_0.22_142)]/30 text-[oklch(0.68_0.22_142)] bg-[oklch(0.68_0.22_142)]/10",
  },
  filled: {
    label: "Filled",
    className:
      "border-[oklch(0.5_0.18_207)]/30 text-[oklch(0.5_0.18_207)] bg-[oklch(0.5_0.18_207)]/10",
  },
  closed: { label: "Closed", className: "border-border text-muted-foreground" },
  on_hold: {
    label: "On Hold",
    className:
      "border-[oklch(0.85_0.24_80)]/30 text-[oklch(0.85_0.24_80)] bg-[oklch(0.85_0.24_80)]/10",
  },
};

function JobStatusBadge({ status }: { status: Job["status"] }) {
  const { label, className } =
    JOB_STATUS_CONFIG[status] ?? JOB_STATUS_CONFIG.open;
  return (
    <Badge variant="outline" className={`text-[10px] py-0 h-5 ${className}`}>
      {label}
    </Badge>
  );
}

// ── Rate Display Helper ────────────────────────────────────────────────────────

function formatJobRate(job: Job): string {
  if (job.rateType && job.rateAmount) {
    const symbol =
      job.rateCurrency === "INR" ? "₹" : job.rateCurrency === "USD" ? "$" : "";
    const label =
      job.rateType === "LPM"
        ? "LPM"
        : job.rateType === "LPA"
          ? "LPA"
          : "Per Hour";
    return `${symbol}${job.rateAmount} ${label}`;
  }
  if (job.rateMin && job.rateMax) {
    return `${formatCurrency(job.rateMin)} – ${formatCurrency(job.rateMax)}`;
  }
  if (job.rateMin) return `From ${formatCurrency(job.rateMin)}`;
  return "Rate TBD";
}

// ── Pipeline Preview ───────────────────────────────────────────────────────────

function PipelinePreview({ jobId }: { jobId: string }) {
  const { data: submissions = [] } = useSubmissionsForJob(jobId);

  const stageCounts = submissions.reduce<Record<string, number>>((acc, sub) => {
    const stage = sub.pipelineStage;
    if (!stage) return acc;
    acc[stage] = (acc[stage] ?? 0) + 1;
    return acc;
  }, {});

  const topStages = Object.entries(stageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (topStages.length === 0) {
    return (
      <span className="text-[10px] text-muted-foreground">No submissions</span>
    );
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {topStages.map(([stage, count], i) => (
        <span key={stage} className="flex items-center gap-0.5">
          {i > 0 && (
            <span className="text-muted-foreground/50 text-[9px]">→</span>
          )}
          <span className="text-[10px] text-muted-foreground">
            {PIPELINE_STAGE_LABELS[
              stage as keyof typeof PIPELINE_STAGE_LABELS
            ] ?? stage}{" "}
            <span className="font-semibold text-foreground">({count})</span>
          </span>
        </span>
      ))}
    </div>
  );
}

// ── Placed Count ───────────────────────────────────────────────────────────────

function PlacedCount({ jobId }: { jobId: string }) {
  const { data: submissions = [] } = useSubmissionsForJob(jobId);
  const placed = submissions.filter(
    (s: Submission) => s.pipelineStage === "placed",
  ).length;
  return (
    <span className="text-xs text-foreground">
      {placed > 0 ? (
        <span className="font-semibold text-[oklch(0.68_0.22_142)]">
          {placed} placed
        </span>
      ) : (
        <span className="text-muted-foreground">—</span>
      )}
    </span>
  );
}

// ── Linked Job Row ─────────────────────────────────────────────────────────────

interface LinkedJobRowProps {
  job: Job;
  link: ClientJobLink;
  clientId: string;
  onEdit: (job: Job) => void;
  onMarkFilled: (job: Job) => void;
  onMarkClosed: (job: Job) => void;
}

function LinkedJobRow({
  job,
  link,
  clientId,
  onEdit,
  onMarkFilled,
  onMarkClosed,
}: LinkedJobRowProps) {
  const softDelete = useSoftDeleteClientJobLink();
  const [confirmUnlink, setConfirmUnlink] = useState(false);

  function handleUnlink() {
    softDelete.mutate(
      { clientId, jobId: job.id },
      {
        onSuccess: () => toast.success("Job unlinked"),
        onError: () => toast.error("Failed to unlink job"),
      },
    );
    setConfirmUnlink(false);
  }

  return (
    <div
      className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-3 gap-y-1 px-3 py-2.5 border-b border-border/40 last:border-0 hover:bg-muted/20 transition-colors items-start"
      data-ocid="linked-job-row"
    >
      {/* Title + Pipeline Preview stacked */}
      <div className="min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onEdit(job)}
            className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate max-w-[200px] text-left flex items-center gap-1"
            data-ocid="linked-job-title"
          >
            {job.title}
            <ExternalLink className="h-2.5 w-2.5 text-muted-foreground flex-shrink-0" />
          </button>
          <JobStatusBadge status={job.status} />
        </div>
        <PipelinePreview jobId={job.id} />
      </div>

      {/* Rate */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-muted-foreground">Rate</span>
        <span className="text-xs text-foreground whitespace-nowrap">
          {formatJobRate(job)}
        </span>
      </div>

      {/* Placed */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-muted-foreground">Placed</span>
        <PlacedCount jobId={job.id} />
      </div>

      {/* Linked date */}
      <div className="flex flex-col items-end gap-0.5">
        <span className="text-[10px] text-muted-foreground">Linked</span>
        <span className="text-[10px] text-muted-foreground">
          {new Date(link.linkedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Mark filled / closed */}
      {job.status === "open" && (
        <div className="flex flex-col gap-1 items-end">
          <button
            type="button"
            onClick={() => onMarkFilled(job)}
            className="text-[10px] text-[oklch(0.68_0.22_142)] hover:underline whitespace-nowrap"
            data-ocid="linked-job-mark-filled"
          >
            Mark Filled
          </button>
          <button
            type="button"
            onClick={() => onMarkClosed(job)}
            className="text-[10px] text-muted-foreground hover:underline whitespace-nowrap"
          >
            Close
          </button>
        </div>
      )}
      {job.status !== "open" && <div />}

      {/* Unlink */}
      <div className="flex items-center">
        {confirmUnlink ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleUnlink}
              className="text-[10px] text-[oklch(0.65_0.19_22)] hover:underline"
              data-ocid="linked-job-confirm-unlink"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setConfirmUnlink(false)}
              className="text-[10px] text-muted-foreground hover:underline"
            >
              Cancel
            </button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-[oklch(0.65_0.19_22)]"
            onClick={() => setConfirmUnlink(true)}
            disabled={softDelete.isPending}
            aria-label="Unlink job"
            data-ocid="linked-job-unlink-btn"
          >
            <Unlink className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Job Orders Section ─────────────────────────────────────────────────────────

interface JobOrdersSectionProps {
  clientId: string;
  allJobs: Job[];
  onEditJob: (job: Job) => void;
  onMarkFilled: (job: Job) => void;
  onMarkClosed: (job: Job) => void;
  onAddJob: () => void;
}

function JobOrdersSection({
  clientId,
  allJobs,
  onEditJob,
  onMarkFilled,
  onMarkClosed,
  onAddJob,
}: JobOrdersSectionProps) {
  const { data: links = [], isLoading: linksLoading } =
    useClientJobLinks(clientId);
  const { data: submissionsAll = [] } = useJobsForClient(clientId);
  const createLink = useCreateClientJobLink();
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // Poll every 5 seconds when tab is active
  const { data: _poll } = useClientJobLinks(clientId);
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        // react-query auto-refetches via invalidation; this is a lightweight visibility check placeholder
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const linkedJobIds = new Set(links.map((l: ClientJobLink) => l.jobId));
  const linkableJobs = allJobs.filter(
    (j) => j.status === "open" && !linkedJobIds.has(j.id),
  );
  const linkedJobs = allJobs.filter((j) => linkedJobIds.has(j.id));

  // Stats
  const totalCandidates = (submissionsAll as Job[]).length;
  const placedCount = linkedJobs.filter((j) => j.status === "filled").length;

  function handleLink() {
    if (!selectedJobId) return;
    createLink.mutate(
      { clientId, jobId: selectedJobId },
      {
        onSuccess: () => {
          toast.success("Job linked to client");
          setSelectedJobId("");
        },
        onError: () => toast.error("Failed to link job"),
      },
    );
  }

  return (
    <div className="px-4 py-4" data-ocid="job-orders-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground font-display uppercase tracking-wide">
          Job Orders
        </h3>
        <Button
          size="sm"
          variant="outline"
          className="h-6 px-2 text-[10px] gap-1"
          onClick={onAddJob}
          data-ocid="add-job-btn"
        >
          <Plus className="h-3 w-3" />
          New Job
        </Button>
      </div>

      {/* Stats Row */}
      {links.length > 0 && (
        <div
          className="flex items-center gap-3 mb-3 text-[10px] text-muted-foreground"
          data-ocid="job-orders-stats"
        >
          <span className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            <strong className="text-foreground">{links.length}</strong> linked
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <strong className="text-foreground">{totalCandidates}</strong> in
            pipeline
          </span>
          <span className="text-border">·</span>
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3 text-[oklch(0.68_0.22_142)]" />
            <strong className="text-[oklch(0.68_0.22_142)]">
              {placedCount}
            </strong>{" "}
            placed
          </span>
        </div>
      )}

      {/* Link existing job */}
      {linkableJobs.length > 0 && (
        <div
          className="mb-3 flex items-center gap-2 p-2.5 rounded-md border border-border bg-muted/20"
          data-ocid="link-job-section"
        >
          <Link2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
          <Select value={selectedJobId} onValueChange={setSelectedJobId}>
            <SelectTrigger
              className="h-7 text-xs flex-1 min-w-0"
              data-ocid="link-job-select"
            >
              <SelectValue placeholder="Link existing open job…" />
            </SelectTrigger>
            <SelectContent>
              {linkableJobs.map((j) => (
                <SelectItem key={j.id} value={j.id} className="text-xs">
                  {j.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="h-7 px-2.5 text-xs shrink-0"
            disabled={!selectedJobId || createLink.isPending}
            onClick={handleLink}
            data-ocid="link-job-btn"
          >
            {createLink.isPending ? "Linking…" : "Link Job"}
          </Button>
        </div>
      )}

      {/* Table */}
      {linksLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      ) : links.length === 0 ? (
        <div
          className="rounded-md border border-dashed border-border bg-muted/10 px-4 py-5 text-center"
          data-ocid="job-orders-empty"
        >
          <Briefcase className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
          <p className="text-xs font-medium text-foreground mb-0.5">
            No jobs linked yet
          </p>
          <p className="text-[10px] text-muted-foreground">
            Use the dropdown above to link an existing job, or create a new one.
          </p>
        </div>
      ) : (
        <div
          className="rounded-md border border-border overflow-hidden"
          data-ocid="linked-jobs-table"
        >
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-x-3 px-3 py-1.5 bg-muted/30 border-b border-border">
            {["Job / Pipeline", "Rate", "Placed", "Linked", "Actions", ""].map(
              (h) => (
                <span
                  key={h}
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </span>
              ),
            )}
          </div>
          {linkedJobs.map((job) => {
            const link = links.find((l: ClientJobLink) => l.jobId === job.id);
            if (!link) return null;
            return (
              <LinkedJobRow
                key={job.id}
                job={job}
                link={link}
                clientId={clientId}
                onEdit={onEditJob}
                onMarkFilled={onMarkFilled}
                onMarkClosed={onMarkClosed}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Job Form ───────────────────────────────────────────────────────────────────

interface JobFormProps {
  clientId: string;
  initial?: Partial<JobFormInput>;
  onSubmit: (input: JobFormInput) => void;
  loading: boolean;
  submitLabel?: string;
}

function JobForm({
  clientId,
  initial,
  onSubmit,
  loading,
  submitLabel = "Create Job",
}: JobFormProps) {
  const [form, setForm] = useState<JobFormInput>({
    clientId,
    title: initial?.title ?? "",
    requirements: initial?.requirements ?? "",
    rateType: initial?.rateType ?? "",
    rateAmount: initial?.rateAmount ?? "",
    rateCurrency: initial?.rateCurrency ?? "INR",
    rateMin: initial?.rateMin,
    rateMax: initial?.rateMax,
    location: initial?.location ?? "",
  });

  const set = <K extends keyof JobFormInput>(key: K, val: JobFormInput[K]) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-ocid="job-form">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Job Title *</Label>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Senior Software Engineer"
          className="h-8 text-sm bg-background"
          required
          data-ocid="job-form-title"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Requirements</Label>
        <Textarea
          value={form.requirements ?? ""}
          onChange={(e) => set("requirements", e.target.value)}
          placeholder="5+ years experience, React, Node.js..."
          className="text-sm bg-background resize-none"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Rate Min ($/hr)
          </Label>
          <Input
            type="number"
            value={form.rateMin ?? ""}
            onChange={(e) =>
              set(
                "rateMin",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            placeholder="80"
            className="h-8 text-sm bg-background"
            data-ocid="job-form-rate-min"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Rate Max ($/hr)
          </Label>
          <Input
            type="number"
            value={form.rateMax ?? ""}
            onChange={(e) =>
              set(
                "rateMax",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            placeholder="120"
            className="h-8 text-sm bg-background"
            data-ocid="job-form-rate-max"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Location</Label>
        <Input
          value={form.location ?? ""}
          onChange={(e) => set("location", e.target.value)}
          placeholder="Remote / New York, NY"
          className="h-8 text-sm bg-background"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1 border-t border-border">
        <Button
          type="submit"
          size="sm"
          disabled={loading || !form.title.trim()}
          data-ocid="job-form-submit"
        >
          {loading ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}

// ── Edit Client Form ───────────────────────────────────────────────────────────

interface EditClientFormProps {
  client: Client;
  onSubmit: (input: Partial<ClientFormInput>) => void;
  loading: boolean;
}

function EditClientForm({ client, onSubmit, loading }: EditClientFormProps) {
  const [form, setForm] = useState<Partial<ClientFormInput>>({
    name: client.name,
    email: client.email,
    phone: client.phone,
    company: client.company,
    industry: client.industry,
    notes: client.notes,
  });

  const set = (key: keyof ClientFormInput, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      data-ocid="edit-client-form"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label className="text-xs text-muted-foreground">Company Name</Label>
          <Input
            value={form.company ?? ""}
            onChange={(e) => set("company", e.target.value)}
            className="h-8 text-sm bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Hiring Manager
          </Label>
          <Input
            value={form.name ?? ""}
            onChange={(e) => set("name", e.target.value)}
            className="h-8 text-sm bg-background"
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Email</Label>
          <Input
            value={form.email ?? ""}
            onChange={(e) => set("email", e.target.value)}
            type="email"
            className="h-8 text-sm bg-background"
            required
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Phone</Label>
          <Input
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            className="h-8 text-sm bg-background"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Industry</Label>
          <Input
            value={form.industry ?? ""}
            onChange={(e) => set("industry", e.target.value)}
            className="h-8 text-sm bg-background"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs text-muted-foreground">Notes</Label>
          <Textarea
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            className="text-sm bg-background resize-none"
            rows={3}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1 border-t border-border">
        <Button
          type="submit"
          size="sm"
          disabled={loading}
          data-ocid="edit-client-submit"
        >
          {loading ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}

// ── Follow-Up Item ─────────────────────────────────────────────────────────────

function FollowUpItem({ followUp }: { followUp: FollowUp }) {
  const updateStatus = useUpdateFollowUpStatus();

  const handleAction = (status: FollowUp["status"]) => {
    updateStatus.mutate(
      { id: followUp.id, status, approvedBy: "Manager" },
      { onSuccess: () => toast.success(`Follow-up ${status}`) },
    );
  };

  const isPending = followUp.status === "pending";

  return (
    <div className="entity-card space-y-2" data-ocid="followup-item">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground">
            {followUp.suggestedAction}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {followUp.triggerReason}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`text-[10px] py-0 h-5 flex-shrink-0 ${
            followUp.status === "pending"
              ? "border-[oklch(0.85_0.24_80)]/40 text-[oklch(0.85_0.24_80)]"
              : followUp.status === "approved"
                ? "border-[oklch(0.68_0.22_142)]/40 text-[oklch(0.68_0.22_142)]"
                : "border-border text-muted-foreground"
          }`}
        >
          {followUp.status}
        </Badge>
      </div>
      {followUp.suggestedMessage && (
        <p className="text-[10px] text-muted-foreground italic bg-muted/40 rounded px-2 py-1.5 line-clamp-2">
          "{followUp.suggestedMessage}"
        </p>
      )}
      {isPending && (
        <div className="flex items-center gap-1.5 pt-1 border-t border-border/50">
          <Button
            size="sm"
            className="h-6 px-2 text-[10px] gap-1 bg-[oklch(0.68_0.22_142)] hover:bg-[oklch(0.68_0.22_142)]/90 text-foreground"
            onClick={() => handleAction("approved")}
            disabled={updateStatus.isPending}
            data-ocid="followup-approve"
          >
            <Send className="h-2.5 w-2.5" />
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] gap-1"
            onClick={() => handleAction("snoozed")}
            disabled={updateStatus.isPending}
            data-ocid="followup-snooze"
          >
            <Clock className="h-2.5 w-2.5" />
            Snooze
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] gap-1 text-[oklch(0.65_0.19_22)]"
            onClick={() => handleAction("rejected")}
            disabled={updateStatus.isPending}
            data-ocid="followup-reject"
          >
            <XCircle className="h-2.5 w-2.5" />
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const { clientId } = useParams({ from: "/clients/$clientId" });

  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: allJobs = [] } = useJobs();
  const { data: activities, isLoading: activitiesLoading } =
    useActivities(clientId);
  const { data: allFollowUps } = useFollowUps();

  const updateClient = useUpdateClient();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const createJob = useCreateJob();
  const updateJobMutation = useUpdateJob();

  const [editOpen, setEditOpen] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const client = (clients ?? []).find((c) => c.id === clientId);
  const followUps = (allFollowUps ?? []).filter((f) => f.entityId === clientId);
  const pendingFollowUps = followUps.filter((f) => f.status === "pending");

  const next = client ? nextStage("client", client.currentStage) : null;

  function handleAdvanceStage() {
    if (!client || !next) return;
    if (stageRequiresApproval("client", next)) {
      createApproval.mutate(
        {
          entityId: clientId,
          entityType: "client",
          itemType: "stage_change",
          description: `Advance ${client.company ?? client.name} → ${next}`,
          details: `Stage change from "${client.currentStage}" to "${next}" requires manager approval.`,
          requestedBy: "Manager",
        },
        { onSuccess: () => toast.success(`Approval requested for "${next}"`) },
      );
    } else {
      updateStage.mutate(
        { entityId: clientId, entityType: "client", newStage: next },
        { onSuccess: () => toast.success(`Advanced to "${next}"`) },
      );
    }
  }

  function handleEditClient(input: Partial<ClientFormInput>) {
    updateClient.mutate(
      { id: clientId, input },
      {
        onSuccess: () => {
          setEditOpen(false);
          toast.success("Client updated");
        },
        onError: () => toast.error("Failed to update client"),
      },
    );
  }

  function handleCreateJob(input: JobFormInput) {
    createJob.mutate(input, {
      onSuccess: () => {
        setJobModalOpen(false);
        toast.success("Job order created");
      },
      onError: () => toast.error("Failed to create job"),
    });
  }

  function handleJobMarkFilled(job: Job) {
    updateJobMutation.mutate(
      { id: job.id, input: { status: "filled" } as Partial<JobFormInput> },
      { onSuccess: () => toast.success("Job marked as filled") },
    );
  }

  function handleJobMarkClosed(job: Job) {
    updateJobMutation.mutate(
      { id: job.id, input: { status: "closed" } as Partial<JobFormInput> },
      { onSuccess: () => toast.success("Job closed") },
    );
  }

  if (clientsLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-4">
        <EmptyState
          icon={Building2}
          title="Client not found"
          message="This client may have been deleted or you may have an incorrect link."
          action={{
            label: "Back to Clients",
            onClick: () => window.history.back(),
          }}
        />
      </div>
    );
  }

  const isAtRisk = client.healthScore < 40;

  return (
    <div className="flex flex-col h-full" data-ocid="client-detail-page">
      {/* Back nav */}
      <div className="px-4 pt-3 pb-1 flex-shrink-0">
        <Link
          to="/clients"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-smooth"
          data-ocid="back-to-clients"
        >
          <ArrowLeft className="h-3 w-3" />
          Clients
        </Link>
      </div>

      {/* Client Header */}
      <div className="px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold text-foreground font-display truncate">
                  {client.company ?? client.name}
                </h2>
                <HealthBadge
                  score={client.healthScore}
                  showScore
                  showLabel
                  size="sm"
                />
                {isAtRisk && (
                  <Badge
                    variant="outline"
                    className="text-[10px] py-0 h-5 border-[oklch(0.65_0.19_22)]/40 text-[oklch(0.65_0.19_22)] gap-1"
                  >
                    <TrendingDown className="h-2.5 w-2.5" />
                    Churn Risk
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {client.name} · {client.currentStage}
              </p>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                {client.email && (
                  <a
                    href={`mailto:${client.email}`}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <Mail className="h-2.5 w-2.5" />
                    {client.email}
                  </a>
                )}
                {client.phone && (
                  <a
                    href={`tel:${client.phone}`}
                    className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-smooth"
                  >
                    <Phone className="h-2.5 w-2.5" />
                    {client.phone}
                  </a>
                )}
                {client.industry && (
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Briefcase className="h-2.5 w-2.5" />
                    {client.industry}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={() => setEditOpen(true)}
              data-ocid="edit-client-btn"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </Button>
            {next && (
              <Button
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={handleAdvanceStage}
                disabled={updateStage.isPending || createApproval.isPending}
                data-ocid="advance-stage-btn"
              >
                {stageRequiresApproval("client", next) ? (
                  <>Request Approval</>
                ) : (
                  <>
                    <ArrowRight className="h-3 w-3" />
                    {next}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Stage Progress */}
        <div className="mt-3">
          <StageProgressBar
            stages={CLIENT_STAGES}
            currentStage={client.currentStage}
            compact={false}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left column */}
          <div className="space-y-0 divide-y divide-border">
            {/* Client Info */}
            <div className="px-4 py-4">
              <h3 className="text-xs font-semibold text-foreground font-display mb-3 uppercase tracking-wide">
                Client Info
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: "Company", value: client.company },
                  { label: "Hiring Manager", value: client.name },
                  { label: "Email", value: client.email },
                  { label: "Phone", value: client.phone },
                  { label: "Industry", value: client.industry },
                  { label: "Health Score", value: `${client.healthScore}/100` },
                  { label: "Current Stage", value: client.currentStage },
                  {
                    label: "Last Updated",
                    value: formatRelativeTime(client.updatedAt),
                  },
                ].map(({ label, value }) =>
                  value ? (
                    <div key={label} className="space-y-0.5">
                      <p className="text-[10px] text-muted-foreground">
                        {label}
                      </p>
                      <p className="text-xs text-foreground truncate">
                        {value}
                      </p>
                    </div>
                  ) : null,
                )}
              </div>
              {client.notes && (
                <div className="mt-3 p-2.5 bg-muted/40 rounded-sm border border-border/50">
                  <p className="text-[10px] text-muted-foreground mb-1">
                    Notes
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Job Orders Section */}
            <JobOrdersSection
              clientId={clientId}
              allJobs={allJobs}
              onEditJob={(j) => setEditingJob(j)}
              onMarkFilled={handleJobMarkFilled}
              onMarkClosed={handleJobMarkClosed}
              onAddJob={() => setJobModalOpen(true)}
            />

            {/* Pending Follow-Ups */}
            {pendingFollowUps.length > 0 && (
              <div className="px-4 py-4">
                <h3 className="text-xs font-semibold text-foreground font-display uppercase tracking-wide mb-3">
                  Pending Follow-Ups
                  <span className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[oklch(0.85_0.24_80)]/20 text-[oklch(0.85_0.24_80)] text-[9px]">
                    {pendingFollowUps.length}
                  </span>
                </h3>
                <div className="space-y-2" data-ocid="followup-list">
                  {pendingFollowUps.map((f) => (
                    <FollowUpItem key={f.id} followUp={f} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column: Activity Timeline */}
          <div className="px-4 py-4 lg:min-h-0 lg:overflow-y-auto">
            <h3 className="text-xs font-semibold text-foreground font-display uppercase tracking-wide mb-3 sticky top-0 bg-background pb-2 border-b border-border/50">
              Activity Timeline
            </h3>
            {activitiesLoading ? (
              <div className="space-y-3">
                {["a1", "a2", "a3", "a4"].map((k) => (
                  <div key={k} className="flex gap-2.5">
                    <Skeleton className="h-6 w-6 rounded-sm flex-shrink-0" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <ActivityTimeline
                activities={activities ?? []}
                emptyMessage="No activities recorded yet. Activity will appear here as you interact with this client."
              />
            )}

            {/* All follow-ups history */}
            {followUps.length > 0 && (
              <div className="mt-4 pt-3 border-t border-border/50">
                <h4 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  All Follow-Ups ({followUps.length})
                </h4>
                <div className="space-y-1.5">
                  {followUps.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-center justify-between gap-2 py-1 border-b border-border/30 last:border-0"
                    >
                      <p className="text-[10px] text-muted-foreground truncate">
                        {f.suggestedAction}
                      </p>
                      <Badge
                        variant="outline"
                        className={`text-[9px] py-0 h-4 flex-shrink-0 ${
                          f.status === "approved"
                            ? "border-[oklch(0.68_0.22_142)]/30 text-[oklch(0.68_0.22_142)]"
                            : f.status === "rejected"
                              ? "border-[oklch(0.65_0.19_22)]/30 text-[oklch(0.65_0.19_22)]"
                              : "border-border text-muted-foreground"
                        }`}
                      >
                        {f.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Client Modal */}
      <AppModal
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Client"
        size="md"
      >
        <EditClientForm
          client={client}
          onSubmit={handleEditClient}
          loading={updateClient.isPending}
        />
      </AppModal>

      {/* Add Job Order Modal */}
      <AppModal
        open={jobModalOpen}
        onOpenChange={setJobModalOpen}
        title="Add Job Order"
        description={`Create a new job order for ${client.company ?? client.name}`}
        size="md"
      >
        <JobForm
          clientId={clientId}
          onSubmit={handleCreateJob}
          loading={createJob.isPending}
        />
      </AppModal>

      {/* Edit Job Modal */}
      <AppModal
        open={!!editingJob}
        onOpenChange={(open) => !open && setEditingJob(null)}
        title="Edit Job Order"
        size="md"
      >
        {editingJob && (
          <JobForm
            clientId={clientId}
            initial={editingJob}
            onSubmit={(input) => {
              updateJobMutation.mutate(
                { id: editingJob.id, input },
                {
                  onSuccess: () => {
                    setEditingJob(null);
                    toast.success("Job updated");
                  },
                },
              );
            }}
            loading={updateJobMutation.isPending}
            submitLabel="Save Changes"
          />
        )}
      </AppModal>
    </div>
  );
}
