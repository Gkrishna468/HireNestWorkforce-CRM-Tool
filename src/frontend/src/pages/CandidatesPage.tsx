import { PageHeader } from "@/components/layout/PageHeader";
import { AppModal } from "@/components/ui/AppModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { PageLoadingSpinner } from "@/components/ui/LoadingSpinner";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useCandidates,
  useCreateApprovalItem,
  useCreateCandidate,
  useUpdateEntityStage,
  useVendors,
  useJobs,
} from "@/hooks/use-crm";
import { getSupabaseCreds } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { getRelativeTime } from "@/lib/utils/health";
import { CANDIDATE_STAGES, stageRequiresApproval } from "@/lib/utils/pipeline";
import type { Vendor } from "@/types/crm";
import type { Candidate } from "@/types/crm";
import type { Job } from "@/types/crm";
import type { CandidateFormInput } from "@/types/forms";
import { Link } from "@tanstack/react-router";
import { AlertCircle, GripVertical, Lock, Plus, UserIcon, Briefcase } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

// ── Placement probability logic ──────────────────────────────────────────────

function computePlacementProb(candidate: Candidate): number {
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
  return Math.min(100, Math.max(0, base + healthBonus));
}

function getDaysInStageSince(updatedAt: number): number {
  return Math.floor((Date.now() - updatedAt) / (1000 * 60 * 60 * 24));
}

function probColor(prob: number): string {
  return prob >= 70
    ? "text-[#22c55e]"
    : prob >= 40
      ? "text-[#eab308]"
      : "text-[#ef4444]";
}

// ── Kanban card ───────────────────────────────────────────────────────────────

interface KanbanCardProps {
  candidate: Candidate;
  vendorName?: string;
  jobTitle?: string;
  onDragStart: (
    e: React.DragEvent,
    candidateId: string,
    fromStage: string,
  ) => void;
}

function KanbanCard({ candidate, vendorName, jobTitle, onDragStart }: KanbanCardProps) {
  const prob = computePlacementProb(candidate);
  const days = getDaysInStageSince(candidate.updatedAt);
  const skillLabel = candidate.skills?.slice(0, 20) ?? candidate.title ?? "—";

  return (
    <Link
      to="/candidates/$candidateId"
      params={{ candidateId: candidate.id }}
      className="block"
      data-ocid="candidate-kanban-card"
    >
      <div
        draggable
        onDragStart={(e) =>
          onDragStart(e, candidate.id, candidate.currentStage)
        }
        className="entity-card cursor-grab active:cursor-grabbing group"
      >
        <div className="flex items-start justify-between gap-1 mb-1.5">
          <span className="text-xs font-semibold text-foreground truncate flex-1 min-w-0 leading-tight">
            {candidate.name}
          </span>
          <HealthBadge score={candidate.healthScore} size="sm" />
        </div>
        <p className="text-[11px] text-muted-foreground truncate mb-1.5">
          {skillLabel}
        </p>
        {jobTitle && (
          <p className="text-[10px] text-blue-600/70 truncate mb-1 flex items-center gap-1">
            <Briefcase className="w-3 h-3 flex-shrink-0" />
            {jobTitle}
          </p>
        )}
        {vendorName && (
          <p className="text-[10px] text-primary/70 truncate mb-1.5 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
            {vendorName}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] text-muted-foreground">
            {days}d in stage
          </span>
          <span className={cn("text-[10px] font-semibold", probColor(prob))}>
            {prob}% placed
          </span>
        </div>
        {candidate.updatedAt > 0 && (
          <p className="text-[10px] text-muted-foreground/60 mt-1 truncate">
            {getRelativeTime(candidate.updatedAt)}
          </p>
        )}
      </div>
    </Link>
  );
}

// ── Kanban column ─────────────────────────────────────────────────────────────

interface KanbanColProps {
  stage: string;
  candidates: Candidate[];
  vendorMap: Map<string, Vendor>;
  jobMap: Map<string, Job>;
  onDragStart: (e: React.DragEvent, id: string, from: string) => void;
  onDrop: (e: React.DragEvent, toStage: string) => void;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
}

function KanbanCol({
  stage,
  candidates,
  vendorMap,
  jobMap,
  onDragStart,
  onDrop,
  isDragOver,
  onDragOver,
  onDragLeave,
}: KanbanColProps) {
  const needsApproval = stageRequiresApproval("candidate", stage);
  return (
    <div
      className={cn(
        "flex flex-col min-w-[200px] w-48 flex-shrink-0",
        isDragOver && "opacity-80",
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, stage)}
      onDragLeave={onDragLeave}
      data-ocid="kanban-column"
    >
      <div
        className={cn(
          "flex items-center justify-between px-2 py-1.5 rounded-t-sm border border-b-0 border-border",
          isDragOver ? "bg-primary/10 border-primary/40" : "bg-muted",
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {needsApproval && (
            <Lock className="w-2.5 h-2.5 text-[#eab308] flex-shrink-0" />
          )}
          <span className="text-[11px] font-semibold text-foreground truncate">
            {stage}
          </span>
        </div>
        <Badge
          variant="secondary"
          className="text-[10px] h-4 px-1 flex-shrink-0"
        >
          {candidates.length}
        </Badge>
      </div>
      <div
        className={cn(
          "flex-1 rounded-b-sm border border-border p-1.5 space-y-1.5 min-h-[300px] transition-smooth",
          isDragOver && "bg-primary/5 border-primary/30",
        )}
      >
        {candidates.map((c) => {
          const vendorName = c.assignedRecruiter
            ? vendorMap.get(c.assignedRecruiter)?.name
            : undefined;
          const jobTitle = c.jobId ? jobMap.get(c.jobId)?.title : undefined;
          return (
            <KanbanCard
              key={c.id}
              candidate={c}
              vendorName={vendorName}
              jobTitle={jobTitle}
              onDragStart={onDragStart}
            />
          );
        })}
        {candidates.length === 0 && (
          <div className="flex items-center justify-center h-16 rounded-sm border border-dashed border-border/40">
            <span className="text-[10px] text-muted-foreground/50">
              Drop here
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Add Candidate form ────────────────────────────────────────────────────────

interface AddCandidateFormData {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  skills?: string;
  notes?: string;
  assignedRecruiter?: string;
  source?: string;
  jobId?: string;
  salaryType: "lpm" | "lpa";
  salaryAmount: string;
  linkedinUrl?: string;
}

function AddCandidateModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddCandidateFormData>({
    defaultValues: {
      salaryType: "lpa",
      salaryAmount: "",
    },
  });
  
  const createCandidate = useCreateCandidate();
  const { data: vendors = [] } = useVendors();
  const { data: jobs = [] } = useJobs();

  // Watch values for auto-population
  const salaryType = watch("salaryType");
  const selectedJobId = watch("jobId");

  // Auto-populate budget when job is selected
  useEffect(() => {
    if (selectedJobId && selectedJobId !== "__none__") {
      const selectedJob = jobs.find(j => j.id === selectedJobId);
      if (selectedJob) {
        // Auto-populate salary from job budget if available
        if (selectedJob.budget) {
          setValue("salaryAmount", selectedJob.budget.toString());
        }
        // Auto-populate title from job title if empty
        const currentTitle = watch("title");
        if (!currentTitle && selectedJob.title) {
          setValue("title", selectedJob.title);
        }
        // Auto-populate skills from job requirements if empty
        const currentSkills = watch("skills");
        if (!currentSkills && selectedJob.requirements) {
          setValue("skills", selectedJob.requirements);
        }
      }
    }
  }, [selectedJobId, jobs, setValue, watch]);

  async function onSubmit(data: AddCandidateFormData) {
    try {
      // Calculate salary based on type
      const amount = data.salaryAmount ? Number(data.salaryAmount) : undefined;
      let salaryMin: number | undefined;
      let salaryMax: number | undefined;
      
      if (amount) {
        if (data.salaryType === "lpm") {
          salaryMin = amount;
          salaryMax = amount;
        } else {
          salaryMin = amount;
          salaryMax = amount;
        }
      }

      // Build the payload with correct snake_case column names for Supabase
      // Only include fields that exist in your database schema
      const payload: Record<string, unknown> = {
        name: data.name,
        email: data.email,
        current_stage: "Applied", // Default stage
        health_score: 50, // Default health score
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Optional fields - only add if they have values
      if (data.phone) payload.phone = data.phone;
      if (data.title) payload.title = data.title;
      if (data.skills) payload.skills = data.skills;
      if (data.notes) payload.notes = data.notes;
      if (data.linkedinUrl) payload.linkedin_url = data.linkedinUrl;
      if (salaryMin !== undefined) payload.salary_min = salaryMin;
      if (salaryMax !== undefined) payload.salary_max = salaryMax;
      
      // Handle source - map to assigned_recruiter if it's a source value
      if (data.source && data.source !== "__none__") {
        payload.assigned_recruiter = data.source;
      }
      
      // Handle vendor selection - use assigned_recruiter for vendor too
      // or you might have a separate vendor_id column
      // Check your schema to see which column name to use
      if (data.assignedRecruiter && data.assignedRecruiter !== "__none__") {
        payload.assigned_recruiter = data.assignedRecruiter;
      }

      // Handle job selection
      if (data.jobId && data.jobId !== "__none__") {
        payload.job_id = data.jobId;
      }

      console.log("Submitting payload:", payload);

      await createCandidate.mutateAsync(payload as CandidateFormInput);
      toast.success("Candidate added successfully");
      reset();
      onClose();
    } catch (error) {
      console.error("Error adding candidate:", error);
      toast.error("Failed to add candidate. Check console for details.");
    }
  }

  // Get selected job details for budget display
  const selectedJob = selectedJobId && selectedJobId !== "__none__" 
    ? jobs.find(j => j.id === selectedJobId) 
    : null;

  return (
    <AppModal
      open={open}
      onOpenChange={onClose}
      title="Add Candidate"
      size="lg"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-3"
        data-ocid="add-candidate-form"
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Name *</Label>
            <Input
              {...register("name", { required: "Name is required" })}
              placeholder="Full name"
              className={cn("h-8 text-xs", errors.name && "border-destructive")}
              data-ocid="candidate-name-input"
            />
            {errors.name && (
              <span className="text-[10px] text-destructive">{errors.name.message}</span>
            )}
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Email *</Label>
            <Input
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              type="email"
              placeholder="email@domain.com"
              className={cn(
                "h-8 text-xs",
                errors.email && "border-destructive",
              )}
              data-ocid="candidate-email-input"
            />
            {errors.email && (
              <span className="text-[10px] text-destructive">{errors.email.message}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Phone</Label>
            <Input
              {...register("phone")}
              placeholder="+1 555 000 0000"
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Title / Role</Label>
            <Input
              {...register("title")}
              placeholder="e.g. Senior React Developer"
              className="h-8 text-xs"
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Skills</Label>
          <Textarea
            {...register("skills")}
            placeholder="React, TypeScript, Node.js, AWS..."
            className="text-xs resize-none h-16"
            data-ocid="candidate-skills-input"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Experience</Label>
            <Input
              {...register("notes")}
              placeholder="5 years, Senior level..."
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Source</Label>
            <Controller
              name="source"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger
                    className="h-8 text-xs"
                    data-ocid="candidate-source-select"
                  >
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— None —</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                    <SelectItem value="job board">Job Board</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="agency">Agency</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        {/* Job Selection with Budget */}
        <div className="space-y-1">
          <Label className="text-xs">
            Job Position{" "}
            <span className="text-muted-foreground font-normal">
              (link to existing job post)
            </span>
          </Label>
          <Controller
            name="jobId"
            control={control}
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                value={field.value || "__none__"}
              >
                <SelectTrigger
                  className="h-8 text-xs"
                  data-ocid="candidate-job-select"
                >
                  <SelectValue placeholder="Select job position (optional)…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                      {job.budget ? ` · Budget: ${job.budget} LPA` : ""}
                      {job.location ? ` · ${job.location}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {selectedJob && selectedJob.budget && (
            <div className="flex items-center gap-2 mt-1 p-1.5 bg-blue-50/50 rounded border border-blue-100">
              <Briefcase className="w-3 h-3 text-blue-500" />
              <span className="text-[10px] text-blue-700">
                Job Budget: <strong>{selectedJob.budget} LPA</strong>
                {selectedJob.budgetType && ` (${selectedJob.budgetType})`}
              </span>
            </div>
          )}
        </div>

        {/* Vendor Selection - Maps to assigned_recruiter */}
        <div className="space-y-1">
          <Label className="text-xs">
            Vendor / Recruiter{" "}
            <span className="text-muted-foreground font-normal">
              (who is processing this profile)
            </span>
          </Label>
          <Controller
            name="assignedRecruiter"
            control={control}
            render={({ field }) => (
              <Select 
                onValueChange={field.onChange} 
                value={field.value || "__none__"}
              >
                <SelectTrigger
                  className="h-8 text-xs"
                  data-ocid="candidate-vendor-select"
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
            )}
          />
        </div>
        
        {/* Updated Salary Section - LPM/LPA with Amount */}
        <div className="space-y-1">
          <Label className="text-xs">Expected Salary</Label>
          <div className="grid grid-cols-3 gap-2">
            <Controller
              name="salaryType"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="h-8 text-xs" data-ocid="candidate-salary-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lpm">LPM</SelectItem>
                    <SelectItem value="lpa">LPA</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <div className="col-span-2">
              <Input
                {...register("salaryAmount", { 
                  valueAsNumber: false,
                  validate: (value) => {
                    if (!value) return true;
                    return !isNaN(Number(value)) || "Please enter a valid number";
                  }
                })}
                type="number"
                step="0.1"
                placeholder={`Enter amount in ${salaryType === "lpm" ? "Lakhs per month" : "Lakhs per annum"}`}
                className="h-8 text-xs"
                data-ocid="candidate-salary-amount-input"
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {salaryType === "lpm" ? "Lakhs per month" : "Lakhs per annum"}
            {selectedJob?.budget && " · Auto-populated from job budget"}
          </p>
        </div>
        
        <div className="space-y-1">
          <Label className="text-xs">Availability</Label>
          <Input
            {...register("linkedinUrl")}
            placeholder="Immediate / 2 weeks / 1 month..."
            className="h-8 text-xs"
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
            disabled={isSubmitting || createCandidate.isPending}
            className="h-7 text-xs"
            data-ocid="add-candidate-submit"
          >
            {isSubmitting || createCandidate.isPending ? "Adding..." : "Add Candidate"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function CandidatesPage() {
  const { data: candidates = [], isLoading } = useCandidates();
  const { data: vendors = [] } = useVendors();
  const { data: jobs = [] } = useJobs();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [jobFilter, setJobFilter] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Build lookup maps
  const vendorMap = useMemo(
    () => new Map(vendors.map((v) => [v.id, v])),
    [vendors],
  );
  
  const jobMap = useMemo(
    () => new Map(jobs.map((j) => [j.id, j])),
    [jobs],
  );

  const filtered = candidates.filter((c) => {
    const matchText =
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      (c.skills ?? "").toLowerCase().includes(filter.toLowerCase()) ||
      (c.title ?? "").toLowerCase().includes(filter.toLowerCase());
    const matchVendor =
      !vendorFilter ||
      c.assignedRecruiter === vendorFilter;
    const matchJob =
      !jobFilter ||
      c.jobId === jobFilter;
    return matchText && matchVendor && matchJob;
  });

  const byStage: Record<string, Candidate[]> = {};
  for (const stage of CANDIDATE_STAGES) byStage[stage] = [];
  for (const c of filtered) {
    const s = c.currentStage;
    if (byStage[s]) byStage[s].push(c);
  }

  const interviewCount = byStage.Interview?.length ?? 0;
  const offerCount = byStage.Offer?.length ?? 0;

  function handleDragStart(e: React.DragEvent, id: string, from: string) {
    setIsDragging(true);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("candidateId", id);
    e.dataTransfer.setData("fromStage", from);
  }

  async function handleDrop(e: React.DragEvent, toStage: string) {
    e.preventDefault();
    setDragOver(null);
    setIsDragging(false);
    const id = e.dataTransfer.getData("candidateId");
    const fromStage = e.dataTransfer.getData("fromStage");
    if (!id || fromStage === toStage) return;
    const candidate = candidates.find((c) => c.id === id);
    if (!candidate) return;

    if (stageRequiresApproval("candidate", toStage)) {
      try {
        await createApproval.mutateAsync({
          entityId: id,
          entityType: "candidate",
          itemType: "stage_change",
          description: `Stage change: ${candidate.name} → ${toStage}`,
          details: `Moving from ${fromStage} to ${toStage}. Requires manager approval.`,
          requestedBy: "system",
        });
        toast.info(`Approval requested: ${candidate.name} → ${toStage}`);
      } catch {
        toast.error("Failed to create approval request");
      }
    } else {
      try {
        await updateStage.mutateAsync({
          entityId: id,
          entityType: "candidate",
          newStage: toStage,
        });
        toast.success(`${candidate.name} moved to ${toStage}`);
      } catch {
        toast.error("Failed to update stage");
      }
    }
  }

  if (isLoading) return <PageLoadingSpinner />;

  return (
    <div className="flex flex-col h-full" data-ocid="candidates-page">
      {/* No Supabase banner */}
      {!getSupabaseCreds() && (
        <div
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500/10 border-b border-amber-500/30 flex-shrink-0"
          data-ocid="candidates-no-supabase-banner"
        >
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-300/90">
            Supabase not connected —{" "}
            <Link
              to="/settings"
              className="underline underline-offset-2 font-medium"
            >
              Settings → Integrations
            </Link>{" "}
            to add credentials before saving data.
          </p>
        </div>
      )}
      <PageHeader
        title="Candidates"
        subtitle={`${candidates.length} total · ${interviewCount} interviewing · ${offerCount} offers`}
        actions={
          <Button
            size="sm"
            className="h-7 text-xs gap-1"
            onClick={() => setShowAdd(true)}
            data-ocid="add-candidate-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Candidate
          </Button>
        }
      />

      <div className="px-4 py-2 border-b border-border bg-card flex flex-wrap items-center gap-2">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or skills..."
          className="h-7 text-xs max-w-xs"
          data-ocid="candidates-filter"
        />
        <Select
          value={vendorFilter || "__all__"}
          onValueChange={(v) => setVendorFilter(v === "__all__" ? "" : v)}
        >
          <SelectTrigger
            className="h-7 text-xs w-44"
            data-ocid="candidates-vendor-filter"
          >
            <SelectValue placeholder="All Vendors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Vendors</SelectItem>
            {vendors.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
                {v.company ? ` · ${v.company}` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={jobFilter || "__all__"}
          onValueChange={(v) => setJobFilter(v === "__all__" ? "" : v)}
        >
          <SelectTrigger
            className="h-7 text-xs w-44"
            data-ocid="candidates-job-filter"
          >
            <SelectValue placeholder="All Jobs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All Jobs</SelectItem>
            {jobs.map((j) => (
              <SelectItem key={j.id} value={j.id}>
                {j.title}
                {j.budget ? ` · ${j.budget} LPA` : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs
        defaultValue="kanban"
        className="flex-1 flex flex-col overflow-hidden"
      >
        <div className="px-4 py-1.5 border-b border-border bg-card">
          <TabsList className="h-7 gap-0.5" data-ocid="candidates-tabs">
            <TabsTrigger value="kanban" className="text-xs h-6 px-3">
              Kanban View
            </TabsTrigger>
            <TabsTrigger value="list" className="text-xs h-6 px-3">
              List View
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Kanban */}
        <TabsContent value="kanban" className="flex-1 overflow-auto m-0">
          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={UserIcon}
                title="No candidates yet"
                message="Add your first candidate to get started"
                action={{
                  label: "Add Candidate",
                  onClick: () => setShowAdd(true),
                }}
              />
            </div>
          ) : (
            <div className="flex gap-3 p-4 min-h-full">
              {CANDIDATE_STAGES.map((stage) => (
                <KanbanCol
                  key={stage}
                  stage={stage}
                  candidates={byStage[stage] ?? []}
                  vendorMap={vendorMap}
                  jobMap={jobMap}
                  onDragStart={handleDragStart}
                  onDrop={handleDrop}
                  isDragOver={dragOver === stage}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(stage);
                  }}
                  onDragLeave={() => setDragOver(null)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* List view */}
        <TabsContent value="list" className="flex-1 overflow-auto m-0">
          {filtered.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={UserIcon}
                title="No candidates found"
                message="Try adjusting your filter or add a new candidate"
              />
            </div>
          ) : (
            <Table data-ocid="candidates-list-table">
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-[11px] h-8 w-6" />
                  <TableHead className="text-[11px] h-8">Name</TableHead>
                  <TableHead className="text-[11px] h-8 hidden md:table-cell">
                    Skills
                  </TableHead>
                  <TableHead className="text-[11px] h-8">Stage</TableHead>
                  <TableHead className="text-[11px] h-8 hidden lg:table-cell">
                    Job
                  </TableHead>
                  <TableHead className="text-[11px] h-8 hidden lg:table-cell">
                    Vendor
                  </TableHead>
                  <TableHead className="text-[11px] h-8 text-center">
                    Health
                  </TableHead>
                  <TableHead className="text-[11px] h-8 text-right hidden sm:table-cell">
                    Days
                  </TableHead>
                  <TableHead className="text-[11px] h-8 text-right hidden lg:table-cell">
                    Placement %
                  </TableHead>
                  <TableHead className="text-[11px] h-8 hidden md:table-cell">
                    Last Contact
                  </TableHead>
                  <TableHead className="text-[11px] h-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => {
                  const prob = computePlacementProb(c);
                  const days = getDaysInStageSince(c.updatedAt);
                  const needsApproval = stageRequiresApproval(
                    "candidate",
                    c.currentStage,
                  );
                  const vendorName = vendorMap.get(
                    c.assignedRecruiter ?? "",
                  )?.name;
                  const job = jobMap.get(c.jobId ?? "");
                  return (
                    <TableRow
                      key={c.id}
                      className="border-border hover:bg-muted/30 cursor-pointer"
                      data-ocid="candidate-list-row"
                    >
                      <TableCell className="w-6 py-2">
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40" />
                      </TableCell>
                      <TableCell className="py-2">
                        <Link
                          to="/candidates/$candidateId"
                          params={{ candidateId: c.id }}
                        >
                          <p className="text-xs font-medium text-foreground hover:text-primary transition-colors">
                            {c.name}
                          </p>
                          {c.title && (
                            <p className="text-[10px] text-muted-foreground">
                              {c.title}
                            </p>
                          )}
                        </Link>
                      </TableCell>
                      <TableCell className="py-2 hidden md:table-cell">
                        <p className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                          {c.skills?.slice(0, 40) ?? "—"}
                        </p>
                      </TableCell>
                      <TableCell className="py-2">
                        <div className="flex items-center gap-1">
                          {needsApproval && (
                            <Lock className="w-3 h-3 text-[#eab308]" />
                          )}
                          <Badge
                            variant="secondary"
                            className="text-[10px] h-5 px-1.5"
                          >
                            {c.currentStage}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="py-2 hidden lg:table-cell">
                        <span className="text-[11px] text-muted-foreground">
                          {job?.title ?? "—"}
                          {job?.budget && (
                            <span className="text-[10px] text-blue-600 ml-1">
                              ({job.budget} LPA)
                            </span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 hidden lg:table-cell">
                        <span className="text-[11px] text-muted-foreground">
                          {vendorName ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-center">
                        <HealthBadge
                          score={c.healthScore}
                          showScore
                          size="sm"
                        />
                      </TableCell>
                      <TableCell className="py-2 text-right hidden sm:table-cell">
                        <span
                          className={cn(
                            "text-xs",
                            days > 7
                              ? "text-[#ef4444]"
                              : "text-muted-foreground",
                          )}
                        >
                          {days}d
                        </span>
                      </TableCell>
                      <TableCell className="py-2 text-right hidden lg:table-cell">
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            probColor(prob),
                          )}
                        >
                          {prob}%
                        </span>
                      </TableCell>
                      <TableCell className="py-2 hidden md:table-cell">
                        <span className="text-[11px] text-muted-foreground">
                          {getRelativeTime(c.updatedAt)}
                        </span>
                      </TableCell>
                      <TableCell className="py-2">
                        <Link
                          to="/candidates/$candidateId"
                          params={{ candidateId: c.id }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] px-2"
                          >
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>

      {isDragging && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-card border border-primary/40 rounded-sm px-3 py-1.5 text-xs text-primary flex items-center gap-2 shadow-lg z-50">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Offer &amp; Placed stages require manager approval</span>
        </div>
      )}

      <AddCandidateModal open={showAdd} onClose={() => setShowAdd(false)} />
    </div>
  );
}
