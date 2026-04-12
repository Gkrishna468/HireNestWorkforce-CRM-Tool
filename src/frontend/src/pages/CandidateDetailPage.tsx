import { PageHeader } from "@/components/layout/PageHeader";
import { ActivityTimeline } from "@/components/ui/ActivityTimeline";
import { AppModal } from "@/components/ui/AppModal";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { PageLoadingSpinner } from "@/components/ui/LoadingSpinner";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useActivities,
  useCandidates,
  useClients,
  useCreateApprovalItem,
  useCreateSubmission,
  useFollowUps,
  useJobs,
  useLogActivity,
  useSubmissionsForCandidate,
  useSubmissionsForResume,
  useUpdateCandidate,
  useUpdateEntityStage,
  useUpdateFollowUpStatus,
  useUpdateSubmissionStage,
  useVendors,
} from "@/hooks/use-crm";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils/format";
import { getRelativeTime } from "@/lib/utils/health";
import { CANDIDATE_STAGES, stageRequiresApproval } from "@/lib/utils/pipeline";
import {
  ALLOWED_STAGE_TRANSITIONS,
  type Candidate,
  PIPELINE_STAGE_COLORS,
  PIPELINE_STAGE_LABELS,
  type Submission,
  type SubmissionPipelineStage,
} from "@/types/crm";
import type { CandidateFormInput, SubmissionFormInput } from "@/types/forms";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarCheck,
  ChevronRight,
  Clock,
  DollarSign,
  Edit2,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Send,
  UserIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// ── Placement probability reasoning ──────────────────────────────────────────

function getPlacementReasoning(
  candidate: Candidate,
  interviewCount: number,
): { prob: number; reason: string } {
  const stageWeights: Record<string, number> = {
    Applied: 10,
    Screened: 20,
    Submitted: 35,
    Interview: 55,
    Offer: 80,
    Placed: 100,
    Retention: 100,
  };
  const base = stageWeights[candidate.currentStage] ?? 10;
  const healthBonus =
    candidate.healthScore >= 70 ? 5 : candidate.healthScore >= 40 ? 0 : -10;
  const interviewBonus =
    interviewCount > 0 ? Math.min(10, interviewCount * 3) : 0;
  const prob = Math.min(100, Math.max(0, base + healthBonus + interviewBonus));

  const reasons: string[] = [];
  reasons.push(`Stage: ${candidate.currentStage} (base ${base}%)`);
  if (healthBonus > 0) reasons.push("Strong health score (+5%)");
  if (healthBonus < 0) reasons.push("Low health score (-10%)");
  if (interviewBonus > 0)
    reasons.push(`${interviewCount} interview(s) logged (+${interviewBonus}%)`);
  if (
    candidate.currentStage === "Offer" ||
    candidate.currentStage === "Placed"
  ) {
    reasons.push("Offer/placement in progress");
  }

  return { prob, reason: reasons.join(" · ") };
}

function probColor(prob: number): string {
  return prob >= 70
    ? "text-[#22c55e]"
    : prob >= 40
      ? "text-[#eab308]"
      : "text-[#ef4444]";
}

function getDaysInStageSince(updatedAt: number): number {
  return Math.floor((Date.now() - updatedAt) / (1000 * 60 * 60 * 24));
}

// ── Pipeline stage badge ──────────────────────────────────────────────────────

function PipelineStageBadge({
  stage,
}: { stage: SubmissionPipelineStage | undefined }) {
  if (!stage)
    return <span className="text-[10px] text-muted-foreground">—</span>;
  const color = PIPELINE_STAGE_COLORS[stage] ?? "#6b7280";
  const label = PIPELINE_STAGE_LABELS[stage] ?? stage;
  return (
    <span
      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border"
      style={{
        color,
        borderColor: `${color}40`,
        backgroundColor: `${color}15`,
      }}
    >
      {label}
    </span>
  );
}

// ── Rejection reason modal ────────────────────────────────────────────────────

interface RejectionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

function RejectionModal({ open, onClose, onConfirm }: RejectionModalProps) {
  const [reason, setReason] = useState("");
  const REASONS = [
    "Not a skill fit",
    "Overqualified",
    "Salary expectation mismatch",
    "Client declined",
    "Candidate withdrew",
    "Position closed",
    "Failed background check",
    "Other",
  ];

  function handleConfirm() {
    if (!reason.trim()) {
      toast.error("Please select or enter a rejection reason");
      return;
    }
    onConfirm(reason);
    setReason("");
    onClose();
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onClose}
      title="Rejection Reason"
      size="sm"
    >
      <div className="space-y-3" data-ocid="rejection-modal">
        <div className="space-y-1">
          <Label className="text-xs">Reason *</Label>
          <Select onValueChange={setReason} value={reason}>
            <SelectTrigger
              className="h-8 text-xs"
              data-ocid="rejection-reason-select"
            >
              <SelectValue placeholder="Select a reason..." />
            </SelectTrigger>
            <SelectContent>
              {REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Additional notes (optional)</Label>
          <Textarea
            value={
              reason.startsWith("Other")
                ? reason.replace("Other", "").trim()
                : ""
            }
            onChange={(e) => setReason(`Other: ${e.target.value}`)}
            placeholder="Explain further..."
            className="text-xs resize-none h-16"
            data-ocid="rejection-notes-input"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7 text-xs"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            className="h-7 text-xs bg-[#ef4444] hover:bg-[#dc2626] text-white"
            onClick={handleConfirm}
            data-ocid="rejection-confirm-btn"
          >
            Confirm Rejection
          </Button>
        </div>
      </div>
    </AppModal>
  );
}

// ── Active Submissions table ──────────────────────────────────────────────────

interface ActiveSubmissionsProps {
  candidateId: string;
  resumeId?: string;
}

function ActiveSubmissionsSection({
  candidateId,
  resumeId,
}: ActiveSubmissionsProps) {
  const { data: submissionsByCandidate = [], isLoading: loadingByCandidate } =
    useSubmissionsForCandidate(candidateId);
  const { data: submissionsByResume = [], isLoading: loadingByResume } =
    useSubmissionsForResume(resumeId ?? "");
  const { data: jobs = [] } = useJobs();
  const { data: clients = [] } = useClients();
  const { data: vendors = [] } = useVendors();
  const updateStage = useUpdateSubmissionStage();

  const [showSubmit, setShowSubmit] = useState(false);
  const [rejectionTarget, setRejectionTarget] = useState<{
    submissionId: string;
    nextStage: SubmissionPipelineStage;
  } | null>(null);

  const isLoading = loadingByCandidate || (!!resumeId && loadingByResume);

  // Deduplicate merged submissions by id
  const submissions = useMemo(() => {
    const seen = new Set<string>();
    const merged = [...submissionsByCandidate, ...submissionsByResume];
    return merged.filter((s) => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    });
  }, [submissionsByCandidate, submissionsByResume]);

  // Build lookup maps for joined display
  const jobMap = useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);
  const clientMap = useMemo(
    () => new Map(clients.map((c) => [c.id, c])),
    [clients],
  );
  const vendorMap = useMemo(
    () => new Map(vendors.map((v) => [v.id, v])),
    [vendors],
  );

  async function handleStageChange(
    sub: Submission,
    nextStage: SubmissionPipelineStage,
  ) {
    if (nextStage === "rejected") {
      setRejectionTarget({ submissionId: sub.id, nextStage });
      return;
    }
    try {
      await updateStage.mutateAsync({
        id: sub.id,
        update: { stage: nextStage },
      });
      toast.success(`Stage updated to ${PIPELINE_STAGE_LABELS[nextStage]}`);
    } catch {
      toast.error("Failed to update stage");
    }
  }

  async function handleRejectionConfirm(reason: string) {
    if (!rejectionTarget) return;
    try {
      await updateStage.mutateAsync({
        id: rejectionTarget.submissionId,
        update: { stage: "rejected", rejectionReason: reason },
      });
      toast.success("Submission rejected");
    } catch {
      toast.error("Failed to reject submission");
    }
    setRejectionTarget(null);
  }

  return (
    <>
      <div className="p-4 space-y-3" data-ocid="submissions-section">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-muted-foreground" />
            Active Submissions
            <Badge variant="secondary" className="text-[10px] h-4 px-1">
              {submissions.length}
            </Badge>
          </p>
          <Button
            size="sm"
            className="h-6 text-[10px] gap-1 px-2"
            onClick={() => setShowSubmit(true)}
            data-ocid="submit-to-job-btn"
          >
            <Plus className="w-3 h-3" />
            Submit to Job
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : submissions.length === 0 ? (
          <div
            className="rounded-sm border border-dashed border-border/60 p-4 text-center"
            data-ocid="submissions-empty-state"
          >
            <Send className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              No active submissions for this candidate.
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">
              Use "Submit to Job" on the Resumes page to get started.
            </p>
          </div>
        ) : (
          <div className="rounded-sm border border-border overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_110px_60px_100px_110px] gap-0 bg-muted/50 border-b border-border px-3 py-1.5">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Job Title
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Client
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Stage
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Days
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Vendor
              </span>
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Action
              </span>
            </div>
            {/* Rows */}
            {submissions.map((sub) => {
              const job = jobMap.get(sub.jobId);
              const client = job ? clientMap.get(job.clientId) : undefined;
              const vendor = sub.vendorId
                ? vendorMap.get(sub.vendorId)
                : undefined;
              const currentStage = sub.pipelineStage;
              const nextStages: SubmissionPipelineStage[] = currentStage
                ? (ALLOWED_STAGE_TRANSITIONS[currentStage] ?? [])
                : [];

              const clientName =
                client?.name ?? sub.clientName ?? job?.clientName ?? "—";
              const vendorName = vendor?.name ?? "—";
              const jobTitle = job?.title ?? sub.jobTitle ?? "Unknown Job";

              return (
                <div
                  key={sub.id}
                  className="grid grid-cols-[1fr_100px_110px_60px_100px_110px] gap-0 px-3 py-2 border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors"
                  data-ocid="submission-row"
                >
                  {/* Job Title */}
                  <div className="min-w-0 pr-2 flex items-center">
                    {job ? (
                      <Link
                        to="/jobs"
                        className="text-xs font-medium text-primary hover:underline truncate block"
                      >
                        {jobTitle}
                      </Link>
                    ) : (
                      <span className="text-xs text-foreground truncate">
                        {jobTitle}
                      </span>
                    )}
                  </div>

                  {/* Client */}
                  <div className="min-w-0 flex items-center">
                    <span className="text-[11px] text-muted-foreground truncate">
                      {clientName}
                    </span>
                  </div>

                  {/* Stage badge */}
                  <div className="flex items-center">
                    <PipelineStageBadge stage={currentStage} />
                  </div>

                  {/* Days in stage */}
                  <div className="flex items-center justify-end">
                    <span
                      className={cn(
                        "text-[11px] font-medium",
                        sub.daysInStage > 7
                          ? "text-[#ef4444]"
                          : "text-muted-foreground",
                      )}
                    >
                      {sub.daysInStage}d
                    </span>
                  </div>

                  {/* Source Vendor */}
                  <div className="min-w-0 flex items-center">
                    <span className="text-[11px] text-muted-foreground truncate">
                      {vendorName}
                    </span>
                  </div>

                  {/* Action dropdown */}
                  <div className="flex items-center">
                    {nextStages.length > 0 ? (
                      <Select
                        onValueChange={(v) =>
                          handleStageChange(sub, v as SubmissionPipelineStage)
                        }
                        value=""
                      >
                        <SelectTrigger
                          className="h-6 text-[10px] w-[100px]"
                          data-ocid="stage-action-select"
                        >
                          <SelectValue placeholder="Move to…" />
                        </SelectTrigger>
                        <SelectContent>
                          {nextStages.map((s) => (
                            <SelectItem key={s} value={s}>
                              <span
                                className="flex items-center gap-1.5"
                                style={{ color: PIPELINE_STAGE_COLORS[s] }}
                              >
                                {s === "rejected" ? "✕ " : "→ "}
                                {PIPELINE_STAGE_LABELS[s]}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-[10px] text-muted-foreground/50 italic">
                        {currentStage === "onboarding"
                          ? "Final stage"
                          : "No actions"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <RejectionModal
        open={!!rejectionTarget}
        onClose={() => setRejectionTarget(null)}
        onConfirm={handleRejectionConfirm}
      />

      <SubmitJobModal
        open={showSubmit}
        onClose={() => setShowSubmit(false)}
        candidateId={candidateId}
        candidateName=""
      />
    </>
  );
}

// ── Submit to Job modal ───────────────────────────────────────────────────────

const RATE_APPROVAL_THRESHOLD = 150;

interface SubmitJobModalProps {
  open: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
}

function SubmitJobModal({
  open,
  onClose,
  candidateId,
  candidateName,
}: SubmitJobModalProps) {
  const { data: jobs = [] } = useJobs();
  const createSubmission = useCreateSubmission();
  const createApproval = useCreateApprovalItem();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm<SubmissionFormInput & { jobId: string; rateProposed: number }>();

  const openJobs = jobs.filter((j) => j.status === "open");

  async function onSubmit(
    data: SubmissionFormInput & { rateProposed: number },
  ) {
    try {
      await createSubmission.mutateAsync({
        candidateId,
        jobId: data.jobId,
        rateProposed: data.rateProposed ? Number(data.rateProposed) : undefined,
      });

      if (
        data.rateProposed &&
        Number(data.rateProposed) > RATE_APPROVAL_THRESHOLD
      ) {
        await createApproval.mutateAsync({
          entityId: candidateId,
          entityType: "candidate",
          itemType: "submission_rate",
          description: `High-rate submission: ${candidateName} at $${data.rateProposed}/hr`,
          details: `Rate $${data.rateProposed}/hr exceeds threshold of $${RATE_APPROVAL_THRESHOLD}/hr. Manager approval required.`,
          requestedBy: "system",
        });
        toast.warning(
          `Approval required: rate $${data.rateProposed}/hr exceeds threshold`,
        );
      } else {
        toast.success("Submitted to job successfully");
      }
      reset();
      onClose();
    } catch {
      toast.error("Failed to submit candidate");
    }
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onClose}
      title="Submit to Job"
      size="md"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        data-ocid="submit-job-form"
      >
        <div className="space-y-1">
          <Label className="text-xs">Job *</Label>
          <Select onValueChange={(v) => setValue("jobId", v)} required>
            <SelectTrigger
              className="h-8 text-xs"
              data-ocid="submit-job-select"
            >
              <SelectValue placeholder="Select a job..." />
            </SelectTrigger>
            <SelectContent>
              {openJobs.length === 0 ? (
                <SelectItem value="none" disabled>
                  No open jobs
                </SelectItem>
              ) : (
                openJobs.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.title} {j.clientName ? `· ${j.clientName}` : ""}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">
            Rate Proposed ($/hr){" "}
            <span className="text-muted-foreground">
              (over ${RATE_APPROVAL_THRESHOLD} requires approval)
            </span>
          </Label>
          <Input
            {...register("rateProposed", { valueAsNumber: true })}
            type="number"
            placeholder="e.g. 85"
            className="h-8 text-xs"
            data-ocid="submit-rate-input"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="h-7 text-xs"
            data-ocid="submit-job-btn"
          >
            {isSubmitting ? "Submitting..." : "Submit Candidate"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

// ── Edit Candidate modal ──────────────────────────────────────────────────────

function EditCandidateModal({
  open,
  onClose,
  candidate,
}: { open: boolean; onClose: () => void; candidate: Candidate }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CandidateFormInput>({
    defaultValues: {
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      title: candidate.title,
      skills: candidate.skills,
      salaryMin: candidate.salaryMin,
      salaryMax: candidate.salaryMax,
      notes: candidate.notes,
    },
  });
  const updateCandidate = useUpdateCandidate();
  const { data: vendors = [] } = useVendors();

  async function onSubmit(data: CandidateFormInput) {
    try {
      await updateCandidate.mutateAsync({ id: candidate.id, input: data });
      toast.success("Candidate updated");
      onClose();
    } catch {
      toast.error("Failed to update candidate");
    }
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onClose}
      title="Edit Candidate"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        data-ocid="edit-candidate-form"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Name *</Label>
            <Input
              {...register("name", { required: true })}
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Email *</Label>
            <Input
              {...register("email", { required: true })}
              type="email"
              className="h-8 text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Phone</Label>
            <Input {...register("phone")} className="h-8 text-xs" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Title</Label>
            <Input {...register("title")} className="h-8 text-xs" />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Skills</Label>
          <Textarea
            {...register("skills")}
            className="text-xs resize-none h-16"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">
            Vendor{" "}
            <span className="text-muted-foreground font-normal">
              (which vendor is processing this profile)
            </span>
          </Label>
          <Select
            onValueChange={(v) =>
              setValue("vendorId", v === "__none__" ? undefined : v)
            }
          >
            <SelectTrigger
              className="h-8 text-xs"
              data-ocid="edit-vendor-select"
            >
              <SelectValue placeholder="Select vendor (optional)…" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">— None —</SelectItem>
              {vendors.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                  {v.company ? ` · ${v.company}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Salary Min ($)</Label>
            <Input
              {...register("salaryMin", { valueAsNumber: true })}
              type="number"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Salary Max ($)</Label>
            <Input
              {...register("salaryMax", { valueAsNumber: true })}
              type="number"
              className="h-8 text-xs"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Notes</Label>
          <Textarea
            {...register("notes")}
            className="text-xs resize-none h-16"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-7 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="h-7 text-xs"
            data-ocid="edit-candidate-submit"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

// ── Stage change button row ───────────────────────────────────────────────────

function StageActions({ candidate }: { candidate: Candidate }) {
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const logActivity = useLogActivity();
  const currentIdx = CANDIDATE_STAGES.indexOf(candidate.currentStage);
  const nextStage =
    currentIdx < CANDIDATE_STAGES.length - 1
      ? CANDIDATE_STAGES[currentIdx + 1]
      : null;

  async function moveTo(stage: string) {
    if (stageRequiresApproval("candidate", stage)) {
      try {
        await createApproval.mutateAsync({
          entityId: candidate.id,
          entityType: "candidate",
          itemType: "stage_change",
          description: `Stage change: ${candidate.name} → ${stage}`,
          details: `Moving from ${candidate.currentStage} to ${stage}. Requires manager approval.`,
          requestedBy: "system",
        });
        toast.info(`Approval requested to move to ${stage}`);
      } catch {
        toast.error("Failed to request approval");
      }
    } else {
      try {
        await updateStage.mutateAsync({
          entityId: candidate.id,
          entityType: "candidate",
          newStage: stage,
        });
        await logActivity.mutateAsync({
          entityId: candidate.id,
          activityType: "stage_change",
          notes: `Stage changed from ${candidate.currentStage} to ${stage}`,
        });
        toast.success(`Moved to ${stage}`);
      } catch {
        toast.error("Failed to update stage");
      }
    }
  }

  if (!nextStage) return null;

  const requiresApproval = stageRequiresApproval("candidate", nextStage);
  return (
    <Button
      size="sm"
      variant="outline"
      className="h-7 text-xs gap-1"
      onClick={() => moveTo(nextStage)}
      data-ocid="move-stage-btn"
    >
      {requiresApproval && <Lock className="w-3 h-3 text-[#eab308]" />}
      Move to {nextStage}
      <ChevronRight className="w-3 h-3" />
    </Button>
  );
}

// ── Log activity quick panel ──────────────────────────────────────────────────

function LogActivityPanel({ candidateId }: { candidateId: string }) {
  const [note, setNote] = useState("");
  const [type, setType] = useState<"call" | "email" | "note" | "meeting">(
    "note",
  );
  const logActivity = useLogActivity();

  async function handleLog() {
    if (!note.trim()) return;
    try {
      await logActivity.mutateAsync({
        entityId: candidateId,
        activityType: type,
        notes: note,
      });
      setNote("");
      toast.success("Activity logged");
    } catch {
      toast.error("Failed to log activity");
    }
  }

  return (
    <div className="space-y-2" data-ocid="log-activity-panel">
      <div className="flex gap-2">
        <Select value={type} onValueChange={(v) => setType(v as typeof type)}>
          <SelectTrigger
            className="h-7 text-xs w-28 flex-shrink-0"
            data-ocid="activity-type-select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="call">Call</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
          </SelectContent>
        </Select>
        <Input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          className="h-7 text-xs flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleLog()}
          data-ocid="activity-note-input"
        />
        <Button
          size="sm"
          className="h-7 text-xs px-2"
          onClick={handleLog}
          data-ocid="log-activity-submit"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CandidateDetailPage() {
  const { candidateId } = useParams({ from: "/candidates/$candidateId" });
  const { data: candidates = [], isLoading } = useCandidates();
  const { data: activities = [], isLoading: loadingActivities } =
    useActivities(candidateId);
  const { data: followUps = [] } = useFollowUps();
  const updateFollowUp = useUpdateFollowUpStatus();

  const [showEdit, setShowEdit] = useState(false);

  const candidate = candidates.find((c) => c.id === candidateId);

  if (isLoading) return <PageLoadingSpinner />;
  if (!candidate) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <UserIcon className="w-12 h-12 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Candidate not found</p>
        <Link to="/candidates">
          <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Candidates
          </Button>
        </Link>
      </div>
    );
  }

  const interviewActivities = activities.filter(
    (a) => a.activityType === "interview",
  );
  const { prob, reason } = getPlacementReasoning(
    candidate,
    interviewActivities.length,
  );
  const days = getDaysInStageSince(candidate.updatedAt);
  const candidateFollowUps = followUps.filter(
    (f) => f.entityId === candidateId && f.status === "pending",
  );

  return (
    <div className="flex flex-col h-full" data-ocid="candidate-detail-page">
      <PageHeader
        title={candidate.name}
        subtitle={candidate.title ?? "Candidate"}
        actions={
          <div className="flex items-center gap-2">
            <StageActions candidate={candidate} />
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1"
              onClick={() => setShowEdit(true)}
              data-ocid="edit-candidate-btn"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </Button>
            <Link to="/candidates">
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </Button>
            </Link>
          </div>
        }
      />

      {/* Stage progress */}
      <div className="px-4 py-3 border-b border-border bg-card">
        <StageProgressBar
          stages={CANDIDATE_STAGES}
          currentStage={candidate.currentStage}
        />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* Left column — info */}
          <div className="lg:col-span-1 p-4 space-y-4 bg-card/30">
            {/* Status strip */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <HealthBadge
                  score={candidate.healthScore}
                  showLabel
                  showScore
                  size="md"
                />
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {days}d in stage
                </span>
              </div>
            </div>

            {/* Placement prob */}
            <div
              className="rounded-sm border border-border p-3 bg-card space-y-1"
              data-ocid="placement-probability"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Placement Probability
                </span>
                <span
                  className={cn(
                    "text-lg font-bold font-display",
                    probColor(prob),
                  )}
                >
                  {prob}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed">
                {reason}
              </p>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className={cn(
                    "h-full rounded-full transition-smooth",
                    prob >= 70
                      ? "bg-[#22c55e]"
                      : prob >= 40
                        ? "bg-[#eab308]"
                        : "bg-[#ef4444]",
                  )}
                  style={{ width: `${prob}%` }}
                />
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Contact
              </p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <Mail className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  <a
                    href={`mailto:${candidate.email}`}
                    className="text-primary hover:underline truncate"
                  >
                    {candidate.email}
                  </a>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{candidate.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Skills */}
            {candidate.skills && (
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1">
                  {candidate.skills
                    .split(/[,\n]/)
                    .filter(Boolean)
                    .map((s) => (
                      <Badge
                        key={s.trim()}
                        variant="secondary"
                        className="text-[10px] h-5 px-1.5"
                      >
                        {s.trim()}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            {/* Salary */}
            {(candidate.salaryMin || candidate.salaryMax) && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Salary Expectation
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <DollarSign className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground">
                    {candidate.salaryMin && candidate.salaryMax
                      ? `${formatCurrency(candidate.salaryMin)} – ${formatCurrency(candidate.salaryMax)}`
                      : candidate.salaryMin
                        ? `From ${formatCurrency(candidate.salaryMin)}`
                        : `Up to ${formatCurrency(candidate.salaryMax ?? 0)}`}
                  </span>
                </div>
              </div>
            )}

            {/* Notes (used as experience/availability) */}
            {candidate.notes && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Experience / Availability
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {candidate.notes}
                </p>
              </div>
            )}

            {/* Source */}
            {candidate.assignedRecruiter && (
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Source
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  <span className="text-foreground capitalize">
                    {candidate.assignedRecruiter}
                  </span>
                </div>
              </div>
            )}

            <Separator />

            {/* Meta */}
            <div className="space-y-1 text-[10px] text-muted-foreground">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{getRelativeTime(candidate.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span>Last updated</span>
                <span>{getRelativeTime(candidate.updatedAt)}</span>
              </div>
            </div>
          </div>

          {/* Right column — submissions + activity */}
          <div className="lg:col-span-2 flex flex-col divide-y divide-border">
            {/* Active Submissions section */}
            <ActiveSubmissionsSection candidateId={candidateId} />

            {/* Interviews section */}
            <div className="p-4 space-y-3" data-ocid="interviews-section">
              <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 text-muted-foreground" />
                Interviews
                <Badge variant="secondary" className="text-[10px] h-4 px-1">
                  {interviewActivities.length}
                </Badge>
              </p>
              {interviewActivities.length === 0 ? (
                <p className="text-xs text-muted-foreground py-1">
                  No interviews logged yet.
                </p>
              ) : (
                <div className="space-y-2">
                  {interviewActivities.map((a) => (
                    <div key={a.id} className="flex items-start gap-2 text-xs">
                      <CalendarCheck className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-foreground leading-snug">
                          {a.notes ?? "Interview"}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {getRelativeTime(a.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Follow-ups for this candidate */}
            {candidateFollowUps.length > 0 && (
              <div className="p-4 space-y-3" data-ocid="followups-section">
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-muted-foreground" />
                  Pending Follow-ups
                  <Badge variant="secondary" className="text-[10px] h-4 px-1">
                    {candidateFollowUps.length}
                  </Badge>
                </p>
                <div className="space-y-2">
                  {candidateFollowUps.map((fu) => (
                    <div
                      key={fu.id}
                      className="rounded-sm border border-[#eab308]/30 bg-[#eab308]/5 p-2.5 space-y-2"
                      data-ocid="followup-item"
                    >
                      <p className="text-xs text-foreground">
                        {fu.suggestedAction}
                      </p>
                      {fu.suggestedMessage && (
                        <p className="text-[10px] text-muted-foreground italic">
                          "{fu.suggestedMessage}"
                        </p>
                      )}
                      <div className="flex gap-1.5">
                        <Button
                          size="sm"
                          className="h-6 text-[10px] px-2"
                          onClick={() => {
                            updateFollowUp.mutate({
                              id: fu.id,
                              status: "approved",
                              approvedBy: "manager",
                            });
                            toast.success("Follow-up approved");
                          }}
                          data-ocid="followup-approve-btn"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 text-[10px] px-2"
                          onClick={() => {
                            updateFollowUp.mutate({
                              id: fu.id,
                              status: "rejected",
                            });
                            toast.info("Follow-up rejected");
                          }}
                          data-ocid="followup-reject-btn"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 text-[10px] px-2"
                          onClick={() => {
                            updateFollowUp.mutate({
                              id: fu.id,
                              status: "snoozed",
                              snoozedUntil: Date.now() + 86400000,
                            });
                            toast.info("Snoozed 24h");
                          }}
                          data-ocid="followup-snooze-btn"
                        >
                          Snooze
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activity timeline */}
            <div className="p-4 space-y-3 flex-1" data-ocid="activity-section">
              <p className="text-xs font-semibold text-foreground">
                Activity Timeline
              </p>
              <LogActivityPanel candidateId={candidateId} />
              {loadingActivities ? (
                <div className="space-y-2 mt-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <ActivityTimeline
                  activities={activities}
                  emptyMessage="No activities yet. Log the first one above."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <EditCandidateModal
          open={showEdit}
          onClose={() => setShowEdit(false)}
          candidate={candidate}
        />
      )}
    </div>
  );
}
