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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  useCheckDuplicateResume,
  useCreateResume,
  useCreateSubmission,
  useDeleteResume,
  useFindSimilarCandidates,
  useJobs,
  useListSubmissionsForResume,
  useResumes,
  useVendors,
} from "@/hooks/use-crm";
import {
  extractNameFromFilename,
  extractTextFromDocx,
  extractTextFromPdf,
  parseResumeText,
  scoreJobMatch,
} from "@/lib/resumeParser";
import { getSupabaseCreds } from "@/lib/supabase";
import type { FuzzyDuplicateMatch, Resume, ResumeMatch } from "@/types/crm";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  MapPin,
  Phone,
  Search,
  Send,
  Square,
  SquareCheck,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

type SortField = "createdAt" | "candidateName";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "active" | "duplicate" | "archived";
type AvailabilityOption =
  | "immediate"
  | "two_weeks"
  | "one_month"
  | "unavailable"
  | "";

// ── Score badge ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  if (score >= 70)
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tabular-nums">
        {score}%
      </span>
    );
  if (score >= 40)
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 tabular-nums">
        {score}%
      </span>
    );
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border tabular-nums">
      {score}%
    </span>
  );
}

function StatusBadge({ status }: { status: Resume["status"] }) {
  if (status === "active")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Active
      </span>
    );
  if (status === "duplicate")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        Duplicate
      </span>
    );
  if (status === "archived")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        Archived
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      Pending
    </span>
  );
}

// ── Fuzzy duplicate match panel ───────────────────────────────────────────────

interface FuzzyMatchesPanelProps {
  matches: FuzzyDuplicateMatch[];
  isChecking: boolean;
  onMarkSamePersonAndSave: (matchId: string) => void;
  isSaving: boolean;
}

function similarityLabel(score: number): {
  label: string;
  bg: string;
  text: string;
  border: string;
  panelBg: string;
  panelBorder: string;
} {
  if (score >= 80)
    return {
      label: "High risk",
      bg: "bg-red-500/15",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-500/25",
      panelBg: "bg-red-50 dark:bg-red-900/20",
      panelBorder: "border-red-500/30",
    };
  if (score >= 50)
    return {
      label: "Possible match",
      bg: "bg-amber-500/15",
      text: "text-amber-700 dark:text-amber-300",
      border: "border-amber-500/25",
      panelBg: "bg-amber-50 dark:bg-amber-900/20",
      panelBorder: "border-amber-500/30",
    };
  return {
    label: "Low match",
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    panelBg: "bg-muted/30",
    panelBorder: "border-border",
  };
}

function FuzzyMatchesPanel({
  matches,
  isChecking,
  onMarkSamePersonAndSave,
  isSaving,
}: FuzzyMatchesPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isChecking && matches.length === 0) return null;

  return (
    <div className="space-y-2" data-ocid="fuzzy-matches-panel">
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground">
          Possible matches
        </span>
        {isChecking && (
          <span className="text-[10px] text-muted-foreground animate-pulse">
            Checking for matches…
          </span>
        )}
        {!isChecking && matches.length > 0 && (
          <span className="text-[10px] text-muted-foreground">
            {matches.length} candidate{matches.length !== 1 ? "s" : ""} found
          </span>
        )}
      </div>

      {!isChecking && (
        <div className="space-y-2 max-h-56 overflow-y-auto pr-0.5">
          {matches.slice(0, 3).map((m) => {
            const style = similarityLabel(m.similarityScore);
            const isExpanded = expandedId === m.id;
            return (
              <div
                key={m.id}
                className={`rounded-lg border p-3 ${style.panelBg} ${style.panelBorder}`}
                data-ocid={`fuzzy-match-${m.id}`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-semibold text-foreground truncate">
                        {m.candidateName || "Unknown"}
                      </span>
                      {m.extractedRole && (
                        <span className="text-[10px] text-muted-foreground truncate">
                          · {m.extractedRole}
                        </span>
                      )}
                    </div>
                    {/* Match reason chips */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {m.matchReasons.map((reason) => (
                        <span
                          key={reason}
                          className="text-[10px] px-1.5 py-0.5 rounded-full bg-card border border-border text-muted-foreground"
                        >
                          {reason}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* Score badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${style.bg} ${style.text} ${style.border}`}
                  >
                    {m.similarityScore}%
                    <span className="font-normal">{style.label}</span>
                  </span>
                </div>

                {/* Expand / view profile */}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : m.id)}
                    className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                    data-ocid={`fuzzy-view-profile-${m.id}`}
                  >
                    <Eye className="h-2.5 w-2.5" />
                    {isExpanded ? "Hide profile" : "View profile"}
                  </button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className={`h-6 text-[10px] px-2 border-current ${style.text}`}
                    onClick={() => onMarkSamePersonAndSave(m.id)}
                    disabled={isSaving}
                    data-ocid={`fuzzy-same-person-${m.id}`}
                  >
                    This is the same person
                  </Button>
                </div>

                {/* Expanded profile popover */}
                {isExpanded && (
                  <div className="mt-2.5 rounded-lg bg-card border border-border p-2.5 space-y-1.5 text-[10px]">
                    {m.email && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Email:
                        </span>
                        {m.email}
                      </div>
                    )}
                    {m.phone && (
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <span className="font-medium text-foreground">
                          Phone:
                        </span>
                        {m.phone}
                      </div>
                    )}
                    {m.extractedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span className="font-medium text-foreground mr-1">
                          Skills:
                        </span>
                        {m.extractedSkills.slice(0, 5).map((s) => (
                          <span
                            key={s}
                            className="px-1 py-0.5 rounded bg-muted border border-border text-muted-foreground"
                          >
                            {s}
                          </span>
                        ))}
                        {m.extractedSkills.length > 5 && (
                          <span className="text-muted-foreground">
                            +{m.extractedSkills.length - 5}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Drag-drop upload zone ─────────────────────────────────────────────────────

interface DropZoneProps {
  onFileSelected: (file: File) => void;
}

function DropZone({ onFileSelected }: DropZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const name = file.name.toLowerCase();
      const valid =
        name.endsWith(".pdf") ||
        name.endsWith(".docx") ||
        name.endsWith(".doc");
      if (!valid) {
        toast.error("Unsupported file type", {
          description: "Please upload a PDF or Word (.docx) document.",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Maximum file size is 10MB.",
        });
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected],
  );

  return (
    <label
      onDragOver={(e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      aria-label="Upload resume — click or drag and drop"
      data-ocid="resume-dropzone"
      className={`
        relative flex flex-col items-center justify-center gap-4 py-14 px-6
        rounded-xl border-2 border-dashed cursor-pointer select-none
        transition-all duration-200 text-center group
        ${isDragging ? "border-primary bg-primary/8 scale-[1.01]" : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"}
      `}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${isDragging ? "bg-primary/20 scale-110" : "bg-primary/10 group-hover:bg-primary/15"}`}
      >
        <Upload
          className={`h-6 w-6 transition-colors duration-200 ${isDragging ? "text-primary" : "text-primary/70 group-hover:text-primary"}`}
        />
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Drop PDF or DOCX resume here, or{" "}
          <span className="text-primary underline underline-offset-2">
            click to browse
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-1.5">
          Supports PDF and Word (.docx, .doc) · Max 10MB
        </p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="sr-only"
        tabIndex={0}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const name = file.name.toLowerCase();
          const valid =
            name.endsWith(".pdf") ||
            name.endsWith(".docx") ||
            name.endsWith(".doc");
          if (!valid) {
            toast.error("Unsupported file type", {
              description: "Please upload a PDF or Word (.docx) document.",
            });
            e.target.value = "";
            return;
          }
          if (file.size > 10 * 1024 * 1024) {
            toast.error("File too large", {
              description: "Maximum file size is 10MB.",
            });
            e.target.value = "";
            return;
          }
          onFileSelected(file);
          e.target.value = "";
        }}
      />
    </label>
  );
}

// ── Submit to Job modal ───────────────────────────────────────────────────────

interface SubmitJobModalProps {
  resume: Resume;
  onClose: () => void;
  onSubmitted: (count: number) => void;
}

function SubmitJobModal({ resume, onClose, onSubmitted }: SubmitJobModalProps) {
  const { data: allJobs = [], isLoading: jobsLoading } = useJobs();
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();
  const createSubmission = useCreateSubmission();

  const [selectedJobIds, setSelectedJobIds] = useState<Set<string>>(new Set());
  const [selectedVendorId, setSelectedVendorId] = useState(
    resume.sourceVendorId ?? "",
  );
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Case-insensitive filter — fall back to ALL jobs if none are open/active
  // so the dropdown is never empty even if statuses are stored differently.
  const openJobs = (() => {
    const filtered = allJobs.filter((j) => {
      const s = (j.status ?? "").toLowerCase().trim();
      return (
        s === "open" ||
        s === "active" ||
        s === "open - active" ||
        s === "open-active"
      );
    });
    // Fallback: show all jobs rather than an empty dropdown
    return filtered.length > 0 ? filtered : allJobs;
  })();

  function toggleJob(jobId: string) {
    setSelectedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) next.delete(jobId);
      else next.add(jobId);
      return next;
    });
  }

  function toggleAll() {
    if (selectedJobIds.size === openJobs.length) {
      setSelectedJobIds(new Set());
    } else {
      setSelectedJobIds(new Set(openJobs.map((j) => j.id)));
    }
  }

  async function handleSubmit() {
    if (selectedJobIds.size === 0) {
      toast.error("Please select at least one job to submit to.");
      return;
    }
    setIsSubmitting(true);
    let successCount = 0;
    const jobIds = Array.from(selectedJobIds);
    try {
      for (const jobId of jobIds) {
        try {
          await createSubmission.mutateAsync({
            candidateId: resume.id,
            resumeId: resume.id,
            jobId,
            vendorId: selectedVendorId || undefined,
            pipelineStage: "resume_sent",
            notes: notes.trim() || undefined,
            submittedBy: resume.candidateName,
          });
          successCount++;
        } catch {
          // individual failures handled by mutation toast; continue with rest
        }
      }
      if (successCount > 0) {
        onSubmitted(successCount);
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const allSelected =
    openJobs.length > 0 && selectedJobIds.size === openJobs.length;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-ocid="submit-job-modal"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-border flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground font-display">
              Submit to Job
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
              {resume.candidateName || resume.fileName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">
          {/* Step 1 — Jobs (multi-select checkboxes) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-foreground">
                Select Job(s) <span className="text-destructive">*</span>
              </Label>
              {openJobs.length > 1 && (
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-[10px] text-primary hover:underline"
                  data-ocid="submit-select-all-jobs"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>
            {jobsLoading ? (
              <div className="space-y-1.5">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
              </div>
            ) : openJobs.length === 0 ? (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">
                  No jobs found.{" "}
                  <Link to="/jobs" className="underline text-primary">
                    Add a job
                  </Link>{" "}
                  first.
                </p>
              </div>
            ) : (
              <div
                className="rounded-lg border border-border divide-y divide-border max-h-52 overflow-y-auto"
                data-ocid="submit-jobs-list"
              >
                {openJobs.map((job) => {
                  const checked = selectedJobIds.has(job.id);
                  return (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => toggleJob(job.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-muted/40 ${checked ? "bg-primary/5" : ""}`}
                      data-ocid={`submit-job-option-${job.id}`}
                    >
                      <span className="flex-shrink-0 text-primary">
                        {checked ? (
                          <SquareCheck className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4 text-muted-foreground" />
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="text-xs font-medium text-foreground block truncate">
                          {job.title}
                        </span>
                        {(job.clientName || job.rateAmount) && (
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {[
                              job.clientName,
                              job.rateAmount &&
                                `${job.rateAmount} ${job.rateType ?? ""}`.trim(),
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </span>
                        )}
                      </span>
                      {job.status && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex-shrink-0 capitalize">
                          {job.status}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {selectedJobIds.size > 0 && (
              <p className="text-[10px] text-primary font-medium">
                {selectedJobIds.size} job{selectedJobIds.size > 1 ? "s" : ""}{" "}
                selected
                {selectedJobIds.size > 1 &&
                  " — will create one submission per job"}
              </p>
            )}
          </div>

          {/* Step 2 — Vendor */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Source Vendor{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            {vendorsLoading ? (
              <Skeleton className="h-9 w-full rounded-md" />
            ) : (
              <Select
                value={selectedVendorId}
                onValueChange={setSelectedVendorId}
              >
                <SelectTrigger
                  className="h-9 text-sm"
                  data-ocid="submit-vendor-select"
                >
                  <SelectValue placeholder="Select vendor…" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— None —</SelectItem>
                  {vendors.length === 0 ? (
                    <div className="px-3 py-2 text-xs text-muted-foreground">
                      No vendors found. Add vendors in the Vendors section.
                    </div>
                  ) : (
                    vendors.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.name}
                        {v.company && (
                          <span className="ml-1.5 text-muted-foreground text-xs">
                            · {v.company}
                          </span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Notes{" "}
              <span className="text-muted-foreground font-normal">
                (optional)
              </span>
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this submission…"
              className="text-sm min-h-[64px] resize-none"
              data-ocid="submit-notes"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-border flex-shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSubmitting || selectedJobIds.size === 0}
            data-ocid="submit-job-confirm-btn"
          >
            {isSubmitting ? (
              <>
                <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-1.5" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                {selectedJobIds.size > 1
                  ? `Submit to ${selectedJobIds.size} Jobs`
                  : "Submit Profile"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Extraction review form ─────────────────────────────────────────────────────

interface ExtractionFormProps {
  file: File;
  onClose: () => void;
  onSaved: (resume: Resume) => void;
}

function ExtractionReviewForm({ file, onClose, onSaved }: ExtractionFormProps) {
  const [isExtracting, setIsExtracting] = useState(true);
  const [rawText, setRawText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [skillsInput, setSkillsInput] = useState(""); // comma-separated for editing
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [yearsExperience, setYearsExperience] = useState<number | undefined>(
    undefined,
  );
  const [availability, setAvailability] = useState<AvailabilityOption>("");
  const [sourceVendorId, setSourceVendorId] = useState("");
  const [nameError, setNameError] = useState("");
  const [vendorError, setVendorError] = useState("");
  const [duplicateInfo, setDuplicateInfo] = useState<{
    id: string;
    name: string;
    date: string;
  } | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [extractProgress, setExtractProgress] = useState(0);
  const [fuzzyMatches, setFuzzyMatches] = useState<FuzzyDuplicateMatch[]>([]);
  const fuzzyDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const createResume = useCreateResume();
  const checkDuplicate = useCheckDuplicateResume();
  const findSimilar = useFindSimilarCandidates();
  const { data: vendors = [], isLoading: vendorsLoading } = useVendors();

  // Trigger fuzzy search after field changes (debounced 800ms)
  // Only runs once name is filled — name is the primary signal.
  function scheduleFuzzySearch(name: string, ph: string, skills: string) {
    if (fuzzyDebounceRef.current) clearTimeout(fuzzyDebounceRef.current);
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFuzzyMatches([]);
      return;
    }
    fuzzyDebounceRef.current = setTimeout(async () => {
      const skillsArr = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      try {
        const results = await findSimilar.mutateAsync({
          inputName: trimmedName,
          inputPhone: ph.trim() || null,
          inputSkills: skillsArr,
        });
        setFuzzyMatches(results.filter((m) => m.similarityScore >= 30));
      } catch {
        // non-fatal
      }
    }, 800);
  }

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (fuzzyDebounceRef.current) clearTimeout(fuzzyDebounceRef.current);
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scheduleFuzzySearch is stable per render; only re-run when file changes
  useEffect(() => {
    let progressTimer: ReturnType<typeof setTimeout> | null = null;

    async function runExtraction() {
      setExtractProgress(0);
      let pct = 0;
      progressTimer = setInterval(() => {
        pct = Math.min(pct + Math.random() * 12 + 4, 90);
        setExtractProgress(Math.round(pct));
      }, 200);

      try {
        const ab = await file.arrayBuffer();
        const name = file.name.toLowerCase();
        let text = "";
        if (name.endsWith(".docx") || name.endsWith(".doc")) {
          text = extractTextFromDocx(ab);
        } else if (name.endsWith(".pdf")) {
          text = extractTextFromPdf(ab);
        } else {
          text = await file.text();
        }

        if (!text.trim()) {
          setExtractError(
            "Could not extract text from this file. Try a different PDF or Word document.",
          );
          return;
        }

        const parsed = parseResumeText(text);
        setRawText(text.substring(0, 8000));

        // Pre-fill full name: use extracted name or fall back to filename
        const extractedName = parsed.candidateName || "";
        const finalName =
          extractedName && extractedName !== "--"
            ? extractedName
            : extractNameFromFilename(file.name);

        setCandidateName(finalName);
        setEmail(parsed.email || "");
        setPhone(parsed.phone || "");
        setLocation(parsed.location || "");
        setRole(parsed.extractedRole || "");
        setExperience(parsed.extractedExperience || "");
        setYearsExperience(parsed.yearsExperience);
        setSkillsInput(parsed.skills.join(", "));

        // Auto-trigger fuzzy search after initial parse
        scheduleFuzzySearch(
          finalName,
          parsed.phone || "",
          parsed.skills.join(", "),
        );
      } catch (err) {
        setExtractError((err as Error).message ?? "Extraction failed.");
      } finally {
        if (progressTimer) clearInterval(progressTimer);
        setExtractProgress(100);
        setTimeout(() => setIsExtracting(false), 300);
      }
    }

    runExtraction();
    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  async function handleEmailBlur() {
    if (!email.trim()) {
      setDuplicateInfo(null);
      return;
    }
    try {
      const result = await checkDuplicate.mutateAsync(email.trim());
      if (result) {
        setDuplicateInfo({
          id: result.id,
          name: result.candidateName || "Unknown",
          date: result.createdAt
            ? new Date(result.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })
            : "",
        });
      } else {
        setDuplicateInfo(null);
      }
    } catch {
      // ignore check errors
    }
  }

  function parseSkillsArray(): string[] {
    return skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function saveResume(asDuplicate: boolean, duplicateOfId?: string) {
    const trimmedName = candidateName.trim();
    if (!trimmedName) {
      setNameError("Full name is required.");
      return;
    }
    if (!sourceVendorId) {
      setVendorError("Source vendor is required.");
      return;
    }
    setNameError("");
    setVendorError("");
    try {
      const resume = await createResume.mutateAsync({
        fileName: file.name,
        candidateName: trimmedName,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        extractedSkills: parseSkillsArray(),
        extractedExperience: experience.trim(),
        extractedRole: role.trim(),
        rawText,
        status: asDuplicate ? "duplicate" : "active",
        availability: availability || undefined,
        duplicateOf:
          duplicateOfId ??
          (asDuplicate && duplicateInfo ? duplicateInfo.id : undefined),
        yearsExperience,
        location: location.trim() || undefined,
        sourceVendorId,
      });
      toast.success("Resume saved successfully", {
        description: `${trimmedName}'s profile has been added.`,
      });
      onSaved(resume);
    } catch (err) {
      const e = err as Record<string, unknown>;
      const msg = String(e?.message ?? "Failed to save resume");
      console.error(
        "Supabase resume save error:",
        e?.message,
        "| details:",
        e?.details,
        "| hint:",
        e?.hint,
        "| code:",
        e?.code,
      );
      toast.error("Save failed", {
        description: msg,
        duration: 8000,
      });
    }
  }

  const skillTags = skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const canSave = candidateName.trim().length > 0 && sourceVendorId.length > 0;
  const hasFuzzyMatches = fuzzyMatches.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      data-ocid="resume-review-modal"
    >
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-start justify-between gap-3 rounded-t-2xl">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground font-display leading-tight">
              Review Extracted Data
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
              {file.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0 mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {isExtracting && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground text-center">
                Extracting text from {file.name}…
              </p>
              <div
                className="w-full rounded-full bg-muted overflow-hidden h-2"
                data-ocid="extract-progress-track"
              >
                <div
                  className="h-full bg-primary rounded-full transition-all duration-200 ease-out"
                  style={{ width: `${extractProgress}%` }}
                  role="progressbar"
                  aria-valuenow={extractProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Extraction progress"
                  tabIndex={-1}
                  data-ocid="extract-progress-bar"
                />
              </div>
              <p className="text-xs text-muted-foreground tabular-nums">
                {extractProgress}%
              </p>
            </div>
          )}

          {!isExtracting && extractError && (
            <div className="flex items-start gap-2 px-3 py-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{extractError}</p>
            </div>
          )}

          {!isExtracting && !extractError && (
            <>
              {/* Full Name * */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={candidateName}
                  onChange={(e) => {
                    setCandidateName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                    scheduleFuzzySearch(e.target.value, phone, skillsInput);
                  }}
                  placeholder="Full name"
                  className="h-9 text-sm"
                  data-ocid="review-candidate-name"
                  aria-required="true"
                />
                {nameError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {nameError}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="email@example.com"
                  className="h-9 text-sm"
                  data-ocid="review-email"
                />
                {duplicateInfo && (
                  <div
                    className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30"
                    data-ocid="duplicate-warning"
                  >
                    <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                        Possible duplicate: {duplicateInfo.name}
                      </p>
                      {duplicateInfo.date && (
                        <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                          Uploaded on {duplicateInfo.date}. Save anyway?
                        </p>
                      )}
                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10"
                          onClick={() => saveResume(true)}
                          disabled={createResume.isPending}
                          data-ocid="duplicate-link-btn"
                        >
                          Save Anyway
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-muted-foreground"
                          onClick={() => setDuplicateInfo(null)}
                          disabled={createResume.isPending}
                          data-ocid="duplicate-cancel-btn"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone + Location row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Phone
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      scheduleFuzzySearch(
                        candidateName,
                        e.target.value,
                        skillsInput,
                      );
                    }}
                    placeholder="+91 9876543210"
                    className="h-9 text-sm"
                    data-ocid="review-phone"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Location
                  </Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="h-9 text-sm"
                    data-ocid="review-location"
                  />
                </div>
              </div>

              {/* Role + Experience + Years row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Current Role / Title
                  </Label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Developer"
                    className="h-9 text-sm"
                    data-ocid="review-role"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-foreground">
                    Years Exp
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    max={50}
                    value={yearsExperience ?? ""}
                    onChange={(e) => {
                      const v = e.target.value;
                      setYearsExperience(v === "" ? undefined : Number(v));
                    }}
                    placeholder="5"
                    className="h-9 text-sm"
                    data-ocid="review-years-exp"
                  />
                </div>
              </div>

              {/* Experience string */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Experience Summary
                </Label>
                <Input
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 5 years"
                  className="h-9 text-sm"
                  data-ocid="review-experience"
                />
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Skills <span className="text-destructive">*</span>{" "}
                  <span className="text-muted-foreground font-normal">
                    (comma-separated)
                  </span>
                </Label>
                <Input
                  value={skillsInput}
                  onChange={(e) => {
                    setSkillsInput(e.target.value);
                    scheduleFuzzySearch(candidateName, phone, e.target.value);
                  }}
                  placeholder="React, TypeScript, Node.js, Salesforce…"
                  className="h-9 text-sm"
                  data-ocid="review-skills"
                />
                {skillTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {skillTags.slice(0, 12).map((s) => (
                      <span
                        key={s}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        {s}
                      </span>
                    ))}
                    {skillTags.length > 12 && (
                      <span className="text-[10px] text-muted-foreground pt-0.5">
                        +{skillTags.length - 12} more
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Source Vendor * */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Source Vendor <span className="text-destructive">*</span>
                </Label>
                {vendorsLoading ? (
                  <Skeleton className="h-9 w-full rounded-md" />
                ) : (
                  <Select
                    value={sourceVendorId}
                    onValueChange={(v) => {
                      setSourceVendorId(v);
                      if (v) setVendorError("");
                    }}
                  >
                    <SelectTrigger
                      className="h-9 text-sm"
                      data-ocid="review-source-vendor"
                    >
                      <SelectValue placeholder="Select source vendor…" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.length === 0 ? (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          No vendors found. Add a vendor first.
                        </div>
                      ) : (
                        vendors.map((v) => (
                          <SelectItem key={v.id} value={v.id}>
                            {v.name}
                            {v.company && (
                              <span className="ml-1.5 text-muted-foreground text-xs">
                                · {v.company}
                              </span>
                            )}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                )}
                {vendorError && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {vendorError}
                  </p>
                )}
              </div>

              {/* Availability */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-foreground">
                  Availability
                </Label>
                <Select
                  value={availability}
                  onValueChange={(v) =>
                    setAvailability(v as AvailabilityOption)
                  }
                >
                  <SelectTrigger
                    className="h-9 text-sm"
                    data-ocid="review-availability"
                  >
                    <SelectValue placeholder="Select availability…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="two_weeks">2 Weeks Notice</SelectItem>
                    <SelectItem value="one_month">1 Month Notice</SelectItem>
                    <SelectItem value="unavailable">
                      Currently Unavailable
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Fuzzy duplicate matches — shown above save button */}
              <FuzzyMatchesPanel
                matches={fuzzyMatches}
                isChecking={findSimilar.isPending}
                onMarkSamePersonAndSave={(matchId) => saveResume(true, matchId)}
                isSaving={createResume.isPending}
              />
            </>
          )}
        </div>

        {/* Footer */}
        {!isExtracting && !extractError && (
          <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4 flex items-center justify-between gap-2 rounded-b-2xl">
            <p className="text-[10px] text-muted-foreground leading-snug">
              <span className="text-destructive">*</span> Full Name &amp; Source
              Vendor are required
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              {!duplicateInfo && (
                <Button
                  size="sm"
                  onClick={() => saveResume(false)}
                  disabled={createResume.isPending || !canSave}
                  data-ocid="review-save-btn"
                  title={
                    !canSave
                      ? "Full Name and Source Vendor are required"
                      : undefined
                  }
                >
                  {createResume.isPending ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-1.5" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                      {hasFuzzyMatches
                        ? "Save as New (not a duplicate)"
                        : "Save Resume"}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Job match card ─────────────────────────────────────────────────────────────

interface MatchCardProps {
  match: ResumeMatch;
  resume: Resume;
  onSubmitted: () => void;
}

function MatchCard({ match, resume, onSubmitted }: MatchCardProps) {
  const [expanded, setExpanded] = useState(false);
  const createSubmission = useCreateSubmission();

  async function handleSubmit() {
    try {
      await createSubmission.mutateAsync({
        candidateId: resume.id,
        resumeId: resume.id,
        jobId: match.jobId,
        pipelineStage: "resume_sent",
        submittedBy: resume.candidateName,
      });
      toast.success("Submitted to job!", {
        description: `${resume.candidateName} → ${match.jobTitle}`,
        action: { label: "Undo", onClick: () => {} },
      });
      onSubmitted();
    } catch {
      // handled by mutation
    }
  }

  return (
    <div
      className="rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200"
      data-ocid={`resume-match-card-${match.jobId}`}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">
          <ScoreBadge score={match.totalScore} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground leading-tight truncate">
            {match.jobTitle}
          </h4>
          {match.clientName && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {match.clientName}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              { label: "Skills", val: match.skillsScore },
              { label: "Exp", val: match.expScore },
              { label: "Rate", val: match.rateScore },
              { label: "Avail", val: match.availScore },
            ].map(({ label, val }) => (
              <span
                key={label}
                className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border"
              >
                {label}{" "}
                <span className="font-semibold text-foreground">{val}%</span>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={createSubmission.isPending}
            className="h-8 text-xs"
            data-ocid={`resume-submit-job-${match.jobId}`}
          >
            <Send className="h-3 w-3 mr-1" />
            Submit
          </Button>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse" : "Expand skills"}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-2 border-t border-border/50 pt-3">
          {match.matchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1 items-start">
              <span className="text-[10px] text-muted-foreground pt-0.5 mr-0.5 flex-shrink-0">
                Matched:
              </span>
              {match.matchedSkills.slice(0, 8).map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  {s}
                </span>
              ))}
              {match.matchedSkills.length > 8 && (
                <span className="text-[10px] text-muted-foreground pt-0.5">
                  +{match.matchedSkills.length - 8}
                </span>
              )}
            </div>
          )}
          {match.missingSkills.length > 0 && (
            <div className="flex flex-wrap gap-1 items-start">
              <span className="text-[10px] text-muted-foreground pt-0.5 mr-0.5 flex-shrink-0">
                Missing:
              </span>
              {match.missingSkills.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Matching slide-out panel ───────────────────────────────────────────────────

interface MatchPanelProps {
  resume: Resume;
  onClose: () => void;
}

function MatchPanel({ resume, onClose }: MatchPanelProps) {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());

  const skillsStr = Array.isArray(resume.extractedSkills)
    ? resume.extractedSkills.join(", ")
    : (resume.extractedSkills as string);

  const matches: ResumeMatch[] = jobs
    .filter((j) => j.status === "open")
    .map((job) => {
      const { score, matchedKeywords } = scoreJobMatch(
        resume.extractedSkills,
        resume.extractedRole,
        resume.extractedExperience,
        job,
      );
      const availMap: Record<string, number> = {
        immediate: 100,
        two_weeks: 75,
        one_month: 50,
        unavailable: 0,
      };
      const availScore = resume.availability
        ? (availMap[resume.availability] ?? 50)
        : 50;

      const resumeYears =
        resume.yearsExperience ??
        (Number.parseInt(resume.extractedExperience ?? "0", 10) || 0);
      const jobYears = Number.parseInt(job.experience ?? "0", 10) || 0;
      const expScore =
        jobYears === 0
          ? 50
          : resumeYears >= jobYears
            ? 100
            : Math.round((resumeYears / jobYears) * 100);

      const jobSkillTokens = (job.requiredSkills ?? job.experience ?? "")
        .split(/[,\s]+/)
        .filter(Boolean);
      const skillsScore =
        jobSkillTokens.length === 0
          ? score
          : Math.round(
              (matchedKeywords.length / Math.max(jobSkillTokens.length, 1)) *
                100,
            );

      const rateScore = 50;
      const totalScore = Math.min(
        100,
        Math.round(
          skillsScore * 0.6 +
            expScore * 0.2 +
            rateScore * 0.15 +
            availScore * 0.05,
        ),
      );

      return {
        jobId: job.id,
        jobTitle: job.title,
        clientName: job.clientName ?? "",
        totalScore,
        skillsScore: Math.min(100, skillsScore),
        expScore: Math.min(100, expScore),
        rateScore,
        availScore,
        matchedSkills: matchedKeywords,
        missingSkills: [],
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);

  const skills = Array.isArray(resume.extractedSkills)
    ? resume.extractedSkills
    : skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        aria-hidden="true"
      />
      <div
        className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col"
        data-ocid="resume-match-panel"
        aria-modal="true"
        aria-label={`Job matches for ${resume.candidateName}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-foreground font-display">
              Best Job Matches
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              for {resume.candidateName || resume.fileName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close matches panel"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Resume summary */}
        <div className="px-5 py-4 bg-muted/30 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="h-3.5 w-3.5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              {resume.extractedRole && (
                <p className="text-xs text-muted-foreground truncate">
                  {resume.extractedRole}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-1">
                {resume.yearsExperience !== undefined && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block">
                    {resume.yearsExperience} yrs exp
                  </span>
                )}
                {resume.location && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border inline-flex items-center gap-0.5">
                    <MapPin className="h-2.5 w-2.5" />
                    {resume.location}
                  </span>
                )}
              </div>
            </div>
          </div>
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {skills.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border"
                >
                  {s}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="text-[10px] text-muted-foreground pt-0.5">
                  +{skills.length - 6} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Matches list */}
        <div
          className="flex-1 overflow-y-auto px-5 py-4 space-y-3"
          data-ocid="match-panel-list"
        >
          {jobsLoading ? (
            <>
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </>
          ) : matches.length === 0 ? (
            <div
              className="flex flex-col items-center gap-3 py-12 text-center"
              data-ocid="match-panel-empty"
            >
              <Briefcase className="h-10 w-10 text-muted-foreground/25" />
              <p className="text-sm font-medium text-muted-foreground">
                No open jobs to match
              </p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Add open jobs in the Jobs section to see match scores here.
              </p>
              <Link to="/jobs">
                <Button variant="outline" size="sm" className="mt-1">
                  Go to Jobs
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {matches.length} open jobs scored · sorted by best match
              </p>
              {matches.map((m) => (
                <MatchCard
                  key={m.jobId}
                  match={m}
                  resume={resume}
                  onSubmitted={() =>
                    setSubmitted((prev) => new Set([...prev, m.jobId]))
                  }
                />
              ))}
              {submitted.size > 0 && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">
                    {submitted.size} submission{submitted.size > 1 ? "s" : ""}{" "}
                    created for this resume.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Resume row with submit badge ──────────────────────────────────────────────

interface ResumeRowProps {
  r: Resume;
  onFindMatches: (r: Resume) => void;
  onSubmitToJob: (r: Resume) => void;
}

function ResumeRow({ r, onFindMatches, onSubmitToJob }: ResumeRowProps) {
  const deleteResume = useDeleteResume();
  const { data: submissions = [] } = useListSubmissionsForResume(r.id);

  const skillsList = Array.isArray(r.extractedSkills)
    ? r.extractedSkills.slice(0, 3)
    : (r.extractedSkills as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3);

  const uploadedDate = r.createdAt
    ? new Date(r.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      })
    : "—";

  const activeSubmissions = submissions.filter((s) => !s.deletedAt);

  return (
    <TableRow
      className="group hover:bg-muted/20"
      data-ocid={`resume-row-${r.id}`}
    >
      <TableCell className="font-medium text-foreground min-w-[140px]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="h-3 w-3 text-primary" />
          </div>
          <div className="min-w-0">
            <span className="truncate max-w-[130px] block">
              {r.candidateName || r.fileName}
            </span>
            {r.location && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                <MapPin className="h-2.5 w-2.5" />
                {r.location}
              </span>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell text-xs text-muted-foreground max-w-[150px]">
        <div className="space-y-0.5">
          <span className="truncate block">{r.email || "—"}</span>
          {r.phone && (
            <span className="text-[10px] flex items-center gap-0.5 text-muted-foreground/70">
              <Phone className="h-2.5 w-2.5" />
              {r.phone}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell">
        {r.extractedRole ? (
          <Badge
            variant="secondary"
            className="text-xs font-normal max-w-[120px] truncate"
          >
            {r.extractedRole.substring(0, 28)}
            {r.extractedRole.length > 28 ? "…" : ""}
          </Badge>
        ) : (
          <span className="text-muted-foreground/40 text-xs">—</span>
        )}
        {r.yearsExperience !== undefined && (
          <div className="mt-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/8 text-primary/80 border border-primary/15">
              {r.yearsExperience} yrs
            </span>
          </div>
        )}
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1 max-w-[180px]">
          {skillsList.length > 0 ? (
            skillsList.map((s) => (
              <span
                key={s}
                className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border whitespace-nowrap"
              >
                {s}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground/40 text-xs">—</span>
          )}
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap">
        {uploadedDate}
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <StatusBadge status={r.status} />
          {activeSubmissions.length > 0 && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
              <CheckCircle2 className="h-2.5 w-2.5" />
              {activeSubmissions.length} submitted
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-end gap-1 min-w-[140px]">
          <Button
            variant="default"
            size="sm"
            className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onSubmitToJob(r)}
            data-ocid={`resume-submit-btn-${r.id}`}
          >
            <Send className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Submit</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onFindMatches(r)}
            data-ocid={`resume-find-matches-${r.id}`}
          >
            <Search className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Matches</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
            onClick={() =>
              deleteResume.mutate(r.id, {
                onSuccess: () => toast.success("Resume deleted"),
                onError: () => toast.error("Failed to delete resume"),
              })
            }
            aria-label="Delete resume"
            data-ocid={`resume-delete-${r.id}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────

const SKELETON_ROWS = Array.from({ length: 5 }, (_, i) => i);

interface ListViewProps {
  resumes: Resume[];
  isLoading: boolean;
  onFindMatches: (resume: Resume) => void;
  onSubmitToJob: (resume: Resume) => void;
}

function ListView({
  resumes,
  isLoading,
  onFindMatches,
  onSubmitToJob,
}: ListViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const deferredSearch = useDeferredValue(search);

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const filtered = resumes
    .filter((r) => {
      const q = deferredSearch.toLowerCase();
      const matchSearch =
        !q ||
        (r.candidateName ?? "").toLowerCase().includes(q) ||
        (r.email ?? "").toLowerCase().includes(q) ||
        (r.extractedRole ?? "").toLowerCase().includes(q) ||
        (r.location ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortField === "candidateName") {
        const cmp = (a.candidateName ?? "").localeCompare(
          b.candidateName ?? "",
        );
        return sortDir === "asc" ? cmp : -cmp;
      }
      const ta = new Date(a.createdAt ?? 0).getTime();
      const tb = new Date(b.createdAt ?? 0).getTime();
      return sortDir === "asc" ? ta - tb : tb - ta;
    });

  if (!isLoading && resumes.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-20 text-center bg-card rounded-xl border border-border"
        data-ocid="resume-empty-state"
      >
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
          <FileText className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            No resumes uploaded yet
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-xs">
            Upload PDF or Word resumes above to automatically find matching
            jobs.
          </p>
        </div>
      </div>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) =>
    sortField === field ? (
      sortDir === "asc" ? (
        <ChevronUp className="h-3 w-3 ml-0.5 inline" />
      ) : (
        <ChevronDown className="h-3 w-3 ml-0.5 inline" />
      )
    ) : null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by name, email, role, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
            data-ocid="resume-search"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger
            className="h-8 text-xs w-36"
            data-ocid="resume-status-filter"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="duplicate">Duplicate</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground ml-auto whitespace-nowrap">
          {filtered.length} of {resumes.length} resume
          {resumes.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap"
                onClick={() => toggleSort("candidateName")}
              >
                Candidate <SortIcon field="candidateName" />
              </TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead className="hidden lg:table-cell">Skills</TableHead>
              <TableHead
                className="cursor-pointer select-none whitespace-nowrap hidden sm:table-cell"
                onClick={() => toggleSort("createdAt")}
              >
                Added <SortIcon field="createdAt" />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              SKELETON_ROWS.map((i) => (
                <TableRow key={i}>
                  {[0, 1, 2, 3, 4, 5, 6].map((j) => (
                    <TableCell
                      key={j}
                      className={j > 1 ? "hidden md:table-cell" : ""}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-12 text-center text-sm text-muted-foreground"
                >
                  No resumes match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <ResumeRow
                  key={r.id}
                  r={r}
                  onFindMatches={onFindMatches}
                  onSubmitToJob={onSubmitToJob}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ── SQL setup note ────────────────────────────────────────────────────────────

function SqlSetupNote() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">
              One-time setup: Update the resumes table schema + enable fuzzy
              duplicate detection
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Run this SQL in your{" "}
              <Link
                to="/sql-editor"
                className="underline underline-offset-2 text-primary"
              >
                SQL Editor
              </Link>{" "}
              to enable all fields and the fuzzy candidate matching function:
            </p>
            <pre className="mt-2 text-[10px] bg-card border border-border rounded-lg p-3 overflow-x-auto text-foreground font-mono leading-relaxed whitespace-pre">
              {`-- Schema columns
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS years_experience INT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS source_vendor_id UUID REFERENCES vendors(id);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS duplicate_of UUID;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resumes(id);

-- Fuzzy duplicate detection (requires pg_trgm)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- See full function SQL in src/frontend/src/lib/api.ts (top of file)`}
            </pre>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-0.5"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResumesPage() {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [matchingResume, setMatchingResume] = useState<Resume | null>(null);
  const [submitResume, setSubmitResume] = useState<Resume | null>(null);
  const { data: resumes = [], isLoading } = useResumes();

  function handleFileSaved(resume: Resume) {
    setPendingFile(null);
    setMatchingResume(resume);
  }

  return (
    <div className="flex flex-col gap-5 p-4 sm:p-6 max-w-full min-h-0">
      {/* No Supabase banner */}
      {!getSupabaseCreds() && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
          data-ocid="resumes-no-supabase-banner"
        >
          <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-300 flex-1">
            Supabase not connected — go to{" "}
            <Link
              to="/settings"
              className="underline underline-offset-2 font-medium"
            >
              Settings → Integrations
            </Link>{" "}
            to add your credentials.
          </p>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          {matchingResume && (
            <button
              type="button"
              onClick={() => setMatchingResume(null)}
              aria-label="Back to all resumes"
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              data-ocid="resumes-back-btn"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground leading-none">
              {matchingResume
                ? `Matches — ${matchingResume.candidateName || "Resume"}`
                : "Resumes"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {matchingResume
                ? "Scored against all open jobs"
                : "Upload candidate resumes and find matching jobs automatically"}
            </p>
          </div>
        </div>
        {!matchingResume && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {!isLoading && resumes.length > 0 && (
              <span>
                {resumes.length} resume{resumes.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        )}
      </div>

      <SqlSetupNote />

      {/* Upload zone — only show on list view */}
      {!matchingResume && <DropZone onFileSelected={setPendingFile} />}

      {/* Main content */}
      {matchingResume ? (
        <MatchPanel
          resume={matchingResume}
          onClose={() => setMatchingResume(null)}
        />
      ) : (
        <ListView
          resumes={resumes}
          isLoading={isLoading}
          onFindMatches={setMatchingResume}
          onSubmitToJob={setSubmitResume}
        />
      )}

      {/* Extraction review modal */}
      {pendingFile && (
        <ExtractionReviewForm
          file={pendingFile}
          onClose={() => setPendingFile(null)}
          onSaved={handleFileSaved}
        />
      )}

      {/* Submit to job modal */}
      {submitResume && (
        <SubmitJobModal
          resume={submitResume}
          onClose={() => setSubmitResume(null)}
          onSubmitted={(count) => {
            toast.success(
              count > 1
                ? `Submitted to ${count} jobs successfully`
                : "Submitted successfully!",
              {
                description: submitResume.candidateName
                  ? `${submitResume.candidateName}'s profile has been submitted.`
                  : undefined,
              },
            );
          }}
        />
      )}
    </div>
  );
}
