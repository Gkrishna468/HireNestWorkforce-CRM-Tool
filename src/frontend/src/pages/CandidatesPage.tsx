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
} from "@/hooks/use-crm";
import { getSupabaseCreds } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { getRelativeTime } from "@/lib/utils/health";
import { CANDIDATE_STAGES, stageRequiresApproval } from "@/lib/utils/pipeline";
import type { Vendor } from "@/types/crm";
import type { Candidate } from "@/types/crm";
import type { CandidateFormInput } from "@/types/forms";
import { Link } from "@tanstack/react-router";
import { AlertCircle, GripVertical, Lock, Plus, UserIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
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
  onDragStart: (
    e: React.DragEvent,
    candidateId: string,
    fromStage: string,
  ) => void;
}

function KanbanCard({ candidate, vendorName, onDragStart }: KanbanCardProps) {
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
            ? undefined
            : vendorMap.get(c.assignedRecruiter ?? "")?.name;
          return (
            <KanbanCard
              key={c.id}
              candidate={c}
              vendorName={vendorName}
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

function AddCandidateModal({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormInput>();
  const createCandidate = useCreateCandidate();
  const { data: vendors = [] } = useVendors();

  async function onSubmit(data: CandidateFormInput) {
    try {
      await createCandidate.mutateAsync({
        ...data,
        salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
        salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
      });
      toast.success("Candidate added");
      reset();
      onClose();
    } catch {
      toast.error("Failed to add candidate");
    }
  }

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
              {...register("name", { required: true })}
              placeholder="Full name"
              className={cn("h-8 text-xs", errors.name && "border-destructive")}
              data-ocid="candidate-name-input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Email *</Label>
            <Input
              {...register("email", { required: true })}
              type="email"
              placeholder="email@domain.com"
              className={cn(
                "h-8 text-xs",
                errors.email && "border-destructive",
              )}
              data-ocid="candidate-email-input"
            />
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
            <Select onValueChange={(v) => setValue("assignedRecruiter", v)}>
              <SelectTrigger
                className="h-8 text-xs"
                data-ocid="candidate-source-select"
              >
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="referral">Referral</SelectItem>
                <SelectItem value="job board">Job Board</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Salary Min ($)</Label>
            <Input
              {...register("salaryMin", { valueAsNumber: true })}
              type="number"
              placeholder="80000"
              className="h-8 text-xs"
              data-ocid="candidate-salary-min-input"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Salary Max ($)</Label>
            <Input
              {...register("salaryMax", { valueAsNumber: true })}
              type="number"
              placeholder="120000"
              className="h-8 text-xs"
              data-ocid="candidate-salary-max-input"
            />
          </div>
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
            disabled={isSubmitting}
            className="h-7 text-xs"
            data-ocid="add-candidate-submit"
          >
            {isSubmitting ? "Adding..." : "Add Candidate"}
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
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);

  // Build vendor lookup map for kanban cards
  const vendorMap = useMemo(
    () => new Map(vendors.map((v) => [v.id, v])),
    [vendors],
  );

  const filtered = candidates.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      (c.skills ?? "").toLowerCase().includes(filter.toLowerCase()) ||
      (c.title ?? "").toLowerCase().includes(filter.toLowerCase()),
  );

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

      <div className="px-4 py-2 border-b border-border bg-card">
        <Input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter by name or skills..."
          className="h-7 text-xs max-w-xs"
          data-ocid="candidates-filter"
        />
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
