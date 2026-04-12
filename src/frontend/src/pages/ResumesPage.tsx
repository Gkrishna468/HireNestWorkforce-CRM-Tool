import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useBenchRecords,
  useCreateResume,
  useDeleteResume,
  useResumeJobMatches,
  useResumes,
} from "@/hooks/use-crm";
import {
  extractTextFromDocx,
  extractTextFromPdf,
  parseResumeText,
  scoreJobMatch,
} from "@/lib/resumeParser";
import { getSupabaseCreds } from "@/lib/supabase";
import type { Resume } from "@/types/crm";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  FileText,
  Search,
  Trash2,
  Upload,
  User,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ── Score badge ───────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number }) {
  if (score >= 70)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
        {score}%
      </span>
    );
  if (score >= 40)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25">
        {score}%
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
      {score}%
    </span>
  );
}

// ── Rate display helper ───────────────────────────────────────────────────────

function formatRate(
  rateType?: string,
  rateAmount?: string,
  rateCurrency?: string,
): string {
  if (!rateType || !rateAmount) return "";
  const cur = rateCurrency ?? "INR";
  return `${rateAmount} ${cur} ${rateType}`;
}

// ── Upload Modal ──────────────────────────────────────────────────────────────

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploaded: (resume: Resume) => void;
}

function UploadModal({ open, onOpenChange, onUploaded }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [nameOverride, setNameOverride] = useState("");
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createResume = useCreateResume();

  function reset() {
    setFile(null);
    setNameOverride("");
    setError(null);
    setParsing(false);
  }

  function handleClose() {
    reset();
    onOpenChange(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setError(null);
    setParsing(true);

    try {
      const ab = await file.arrayBuffer();
      const name = file.name.toLowerCase();
      let rawText = "";

      if (name.endsWith(".docx") || name.endsWith(".doc")) {
        rawText = extractTextFromDocx(ab);
      } else if (name.endsWith(".pdf")) {
        rawText = extractTextFromPdf(ab);
      } else {
        rawText = await file.text();
      }

      if (!rawText.trim()) {
        setError(
          "Could not extract text from this file. Try a different PDF or Word document.",
        );
        setParsing(false);
        return;
      }

      const parsed = parseResumeText(rawText);
      const candidateName =
        nameOverride.trim() ||
        parsed.candidateName ||
        file.name.replace(/\.[^.]+$/, "");

      const resume = await createResume.mutateAsync({
        fileName: file.name,
        candidateName,
        extractedSkills: parsed.extractedSkills,
        extractedExperience: parsed.extractedExperience,
        extractedRole: parsed.extractedRole,
        rawText: rawText.substring(0, 5000),
      });

      toast.success("Resume uploaded and parsed successfully");
      reset();
      onOpenChange(false);
      onUploaded(resume);
    } catch (err) {
      setError((err as Error).message ?? "Failed to upload resume.");
    } finally {
      setParsing(false);
    }
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <div className="flex items-center justify-between mb-5">
            <div>
              <RadixDialog.Title className="text-base font-semibold text-foreground font-display">
                Upload Resume
              </RadixDialog.Title>
              <RadixDialog.Description className="text-xs text-muted-foreground mt-0.5">
                Upload a PDF or Word document — skills and role will be
                auto-extracted.
              </RadixDialog.Description>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            data-ocid="resume-upload-form"
          >
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Resume File <span className="text-destructive">*</span>
              </Label>
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background"
                aria-label="Choose resume file"
              >
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span
                  className={`text-sm flex-1 truncate ${file ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {file ? file.name : "Click to choose PDF or Word file…"}
                </span>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Remove file"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors whitespace-nowrap"
                >
                  Browse
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
              <p className="text-[11px] text-muted-foreground">
                Supports PDF and Word (.docx, .doc)
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Candidate Name Override{" "}
                <span className="text-muted-foreground/60">
                  (optional — auto-detected if blank)
                </span>
              </Label>
              <Input
                value={nameOverride}
                onChange={(e) => setNameOverride(e.target.value)}
                placeholder="e.g. Priya Sharma"
                className="h-8 text-sm"
                data-ocid="resume-name-override"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={parsing || createResume.isPending}
                data-ocid="resume-parse-upload-btn"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                {parsing || createResume.isPending
                  ? "Parsing…"
                  : "Parse & Upload"}
              </Button>
            </div>
          </form>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

// ── Bench match mini-cards ────────────────────────────────────────────────────

function BenchMatchSection({ resume }: { resume: Resume }) {
  const { data: benchRecords = [] } = useBenchRecords();
  const topBench = benchRecords
    .map((b) => {
      const { score } = scoreJobMatch(
        resume.extractedSkills,
        resume.extractedRole,
        resume.extractedExperience,
        { requiredSkills: b.skill, title: b.role },
      );
      return { ...b, score };
    })
    .filter((b) => b.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (topBench.length === 0) {
    return (
      <p className="text-xs text-muted-foreground italic">
        No bench candidates match this resume (threshold: 30% skill overlap).
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {topBench.map((b) => (
        <div
          key={b.id}
          className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
              {b.candidateName}
            </span>
            <ScoreBadge score={b.score} />
          </div>
          <span className="text-[11px] text-muted-foreground truncate">
            {b.vendorName || "—"}
          </span>
          {b.role && (
            <Badge
              variant="secondary"
              className="text-[10px] w-fit font-normal"
            >
              {b.role}
            </Badge>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Matching view ─────────────────────────────────────────────────────────────

function MatchingView({
  resume,
  onBack,
}: {
  resume: Resume;
  onBack: () => void;
}) {
  const { data: matches = [], isLoading } = useResumeJobMatches(resume);

  const skills = resume.extractedSkills
    ? resume.extractedSkills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start"
        data-ocid="resume-back-btn"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to All Resumes
      </button>

      {/* Resume summary card */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-foreground font-display">
              {resume.candidateName || resume.fileName}
            </h2>
            {resume.extractedRole && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {resume.extractedRole}
              </p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {resume.extractedExperience && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {resume.extractedExperience} experience
                </span>
              )}
              {skills.slice(0, 8).map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                >
                  {skill}
                </span>
              ))}
              {skills.length > 8 && (
                <span className="text-xs text-muted-foreground">
                  +{skills.length - 8} more
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bench matches */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              B
            </span>
          </span>
          Bench Candidates Match
        </h3>
        <BenchMatchSection resume={resume} />
      </div>

      {/* Job matches */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Matching Open Jobs
          {!isLoading && (
            <span className="text-xs font-normal text-muted-foreground ml-1">
              ({matches.length} found)
            </span>
          )}
        </h3>

        {isLoading ? (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div
            className="flex flex-col items-center gap-2 py-10 text-center"
            data-ocid="resume-no-matches-state"
          >
            <Briefcase className="h-8 w-8 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No open jobs found.</p>
            <p className="text-xs text-muted-foreground max-w-xs">
              Add open jobs in the Jobs section to start matching.
            </p>
            <Link to="/jobs">
              <Button variant="outline" size="sm" className="mt-2">
                Go to Jobs
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3" data-ocid="resume-matches-list">
            {matches.map(({ job, matchScore, matchedKeywords }) => (
              <div
                key={job.id}
                className="flex flex-col gap-2 p-4 rounded-lg bg-muted/20 border border-border hover:bg-muted/40 transition-colors"
                data-ocid={`resume-match-${job.id}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <ScoreBadge score={matchScore} />
                      <h4 className="text-sm font-semibold text-foreground truncate">
                        {job.title}
                      </h4>
                    </div>
                    {job.clientName && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {job.clientName}
                      </p>
                    )}
                  </div>
                  <Link to="/jobs">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs flex-shrink-0"
                      data-ocid={`resume-view-job-${job.id}`}
                    >
                      View Job
                    </Button>
                  </Link>
                </div>

                {(job.rateType ?? job.rateAmount) && (
                  <p className="text-xs text-muted-foreground">
                    {formatRate(job.rateType, job.rateAmount, job.rateCurrency)}
                  </p>
                )}

                {matchedKeywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 items-center">
                    <span className="text-[11px] text-muted-foreground mr-0.5">
                      Matched:
                    </span>
                    {matchedKeywords.slice(0, 5).map((kw) => (
                      <span
                        key={kw}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        {kw}
                      </span>
                    ))}
                    {matchedKeywords.length > 5 && (
                      <span className="text-[11px] text-muted-foreground">
                        +{matchedKeywords.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                {job.responsibilities && (
                  <p className="text-[11px] text-muted-foreground line-clamp-2">
                    {job.responsibilities.substring(0, 120)}
                    {job.responsibilities.length > 120 ? "…" : ""}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────────

const SKELETON_ROWS = Array.from({ length: 4 }, (_, i) => i);

function ListView({
  resumes,
  isLoading,
  onFindMatches,
}: {
  resumes: Resume[];
  isLoading: boolean;
  onFindMatches: (resume: Resume) => void;
}) {
  const deleteResume = useDeleteResume();

  if (!isLoading && resumes.length === 0) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-20 text-center"
        data-ocid="resume-empty-state"
      >
        <FileText className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm font-medium text-muted-foreground">
          No resumes uploaded yet
        </p>
        <p className="text-xs text-muted-foreground max-w-xs">
          Upload PDF or Word resumes to automatically find matching jobs.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead>Candidate Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Key Skills</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? SKELETON_ROWS.map((i) => (
                <TableRow key={i}>
                  {[0, 1, 2, 3, 4].map((j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : resumes.map((r) => {
                const skillsDisplay = r.extractedSkills
                  ? r.extractedSkills.length > 60
                    ? `${r.extractedSkills.substring(0, 60)}…`
                    : r.extractedSkills
                  : "—";
                const uploadedDate = r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString()
                  : "—";

                return (
                  <TableRow
                    key={r.id}
                    className="group hover:bg-muted/20"
                    data-ocid={`resume-row-${r.id}`}
                  >
                    <TableCell className="font-medium text-foreground max-w-[180px]">
                      <span className="truncate block">
                        {r.candidateName || r.fileName}
                      </span>
                    </TableCell>
                    <TableCell>
                      {r.extractedRole ? (
                        <Badge
                          variant="secondary"
                          className="text-xs font-normal"
                        >
                          {r.extractedRole.substring(0, 30)}
                          {r.extractedRole.length > 30 ? "…" : ""}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground/40 text-xs">
                          —
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px]">
                      <span className="truncate block">{skillsDisplay}</span>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {uploadedDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => onFindMatches(r)}
                          data-ocid={`resume-find-matches-${r.id}`}
                        >
                          <Search className="h-3 w-3 mr-1" />
                          Find Matches
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                          onClick={() =>
                            deleteResume.mutate(r.id, {
                              onSuccess: () => toast.success("Resume deleted"),
                              onError: () =>
                                toast.error("Failed to delete resume"),
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
              })}
        </TableBody>
      </Table>
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
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-foreground">
              One-time setup: Create the resumes table in Supabase
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Run this SQL in your{" "}
              <Link to="/sql-editor" className="underline underline-offset-2">
                SQL Editor
              </Link>{" "}
              once to enable resume saving:
            </p>
            <pre className="mt-2 text-[11px] bg-card border border-border rounded-lg p-3 overflow-x-auto text-foreground font-mono leading-relaxed">
              {
                "CREATE TABLE IF NOT EXISTS resumes (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  file_name TEXT NOT NULL,\n  file_url TEXT,\n  candidate_name TEXT,\n  extracted_skills TEXT,\n  extracted_experience TEXT,\n  extracted_role TEXT,\n  raw_text TEXT,\n  created_at TIMESTAMPTZ DEFAULT now()\n);"
              }
            </pre>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
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
  const [showUpload, setShowUpload] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const { data: resumes = [], isLoading } = useResumes();

  return (
    <div className="flex flex-col gap-5 p-6 max-w-full">
      {!getSupabaseCreds() && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30"
          data-ocid="resumes-no-supabase-banner"
        >
          <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-300/90 flex-1">
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

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground leading-none">
              Resumes
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload candidate resumes and find matching jobs automatically
            </p>
          </div>
        </div>
        {!selectedResume && (
          <Button
            size="sm"
            onClick={() => setShowUpload(true)}
            data-ocid="resumes-upload-btn"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Upload Resume
          </Button>
        )}
      </div>

      <SqlSetupNote />

      {!selectedResume && !isLoading && resumes.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {resumes.length} resume{resumes.length !== 1 ? "s" : ""} uploaded
        </p>
      )}

      {selectedResume ? (
        <MatchingView
          resume={selectedResume}
          onBack={() => setSelectedResume(null)}
        />
      ) : (
        <ListView
          resumes={resumes}
          isLoading={isLoading}
          onFindMatches={setSelectedResume}
        />
      )}

      <UploadModal
        open={showUpload}
        onOpenChange={setShowUpload}
        onUploaded={(r) => setSelectedResume(r)}
      />
    </div>
  );
}
