import { PageHeader } from "@/components/layout/PageHeader";
import { AppModal } from "@/components/ui/AppModal";
import { EmptyState } from "@/components/ui/EmptyState";
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
  useBenchRecords,
  useClients,
  useCreateClient,
  useCreateJob,
  useJobs,
  useMatchBench,
  useUpdateJob,
} from "@/hooks/use-crm";
import type { BenchMatch, Client, Job, JobStatus } from "@/types/crm";
import type { JobFormInput } from "@/types/forms";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Copy,
  IndianRupee,
  Linkedin,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Share2,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

type RateType = "LPM" | "LPA" | "PerHour";

interface ParsedJobFields {
  title: string;
  companyName: string;
  roleSummary: string;
  responsibilities: string;
  requiredSkills: string;
  experience: string;
  location: string;
  rateType: RateType | "";
  rateAmount: string;
  rateCurrency: string;
}

// ── parseJobRequirementText ───────────────────────────────────────────────────

export function parseJobRequirementText(text: string): ParsedJobFields {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  function extract(patterns: RegExp[]): string {
    for (const pat of patterns) {
      for (const line of lines) {
        const m = line.match(pat);
        if (m?.[1]) return m[1].trim();
      }
    }
    return "";
  }

  // Title: look for "Hiring:", "Position:", "Role:", "Job Title:", or first "bold" line
  let title = extract([
    /^(?:hiring[:\-\s*]*|position[:\-\s*]*|role[:\-\s*]*|job\s*title[:\-\s*]*|opening[:\-\s*]*|vacancy[:\-\s*]*)(.+)$/i,
    /^[*_]{1,2}([^*_\n]+)[*_]{1,2}$/,
  ]);
  // Fallback: grab first non-label line as title if short enough
  if (!title) {
    for (const line of lines) {
      if (
        line.length < 80 &&
        !/^(hi|hello|dear|greetings|fw:|fwd:)/i.test(line)
      ) {
        title = line
          .replace(/^[*_]{1,2}/, "")
          .replace(/[*_]{1,2}$/, "")
          .trim();
        break;
      }
    }
  }

  // Company
  const companyName = extract([
    /^(?:company[:\-\s*]*|client[:\-\s*]*|organization[:\-\s*]*|org[:\-\s*]*|firm[:\-\s*]*)(.+)$/i,
  ]);

  // Skills
  const requiredSkills = extract([
    /^(?:skills?[:\-\s*]*|required\s*skills?[:\-\s*]*|tech\s*stack[:\-\s*]*|technologies[:\-\s*]*|key\s*skills?[:\-\s*]*)(.+)$/i,
  ]);

  // Experience
  const experience = extract([
    /^(?:exp(?:erience)?[:\-\s*]*|years?[:\-\s*]*)(.+)$/i,
    /(\d+\+?\s*(?:to|-|\–)?\s*\d*\+?\s*years?)/i,
    /(\d+\+?\s*years?)/i,
  ]);

  // Rate / Compensation
  let rateType: RateType | "" = "";
  let rateAmount = "";
  let rateCurrency = "INR";

  // Detect currency symbol
  if (/\$/.test(text)) rateCurrency = "USD";
  else if (/£/.test(text)) rateCurrency = "GBP";
  else if (/€/.test(text)) rateCurrency = "EUR";
  else rateCurrency = "INR";

  // Try to find rate line
  const rateLine = lines.find(
    (l) =>
      /(?:ctc|salary|compensation|rate|budget|package|pay)[:\-\s*]/i.test(l) ||
      /(?:lpm|lpa|per\s*hour|\/hr|\/month|\/year)/i.test(l) ||
      /[₹$€£]\s*\d/.test(l),
  );

  if (rateLine) {
    if (/lpm|per\s*month|\/month/i.test(rateLine)) {
      rateType = "LPM";
      const m = rateLine.match(
        /[₹$€£]?\s*(\d+(?:\.\d+)?)\s*(?:lpm|l\s*pm|per\s*month)/i,
      );
      if (m) rateAmount = m[1];
    } else if (/lpa|per\s*annum|\/year|\/annum/i.test(rateLine)) {
      rateType = "LPA";
      const m = rateLine.match(
        /[₹$€£]?\s*(\d+(?:\.\d+)?)\s*(?:lpa|l\s*pa|per\s*annum|per\s*year)/i,
      );
      if (m) rateAmount = m[1];
    } else if (/per\s*hour|\/hr|\/hour|hourly/i.test(rateLine)) {
      rateType = "PerHour";
      const m = rateLine.match(
        /[₹$€£]?\s*(\d+(?:\.\d+)?)\s*(?:per\s*hour|\/hr|\/hour)/i,
      );
      if (m) rateAmount = m[1];
    }

    // Fallback: grab first number from rate line
    if (!rateAmount) {
      const m = rateLine.match(/[₹$€£]?\s*(\d+(?:\.\d+)?)/);
      if (m) rateAmount = m[1];
    }
  }

  // Location
  const location = extract([
    /^(?:location[:\-\s*]*|place[:\-\s*]*|city[:\-\s*]*|work\s*location[:\-\s*]*)(.+)$/i,
  ]);

  // Responsibilities: grab text after "Responsibilities:" label
  let responsibilities = "";
  let inResponsibilities = false;
  const respLines: string[] = [];
  for (const line of lines) {
    if (
      /^(?:responsibilities|key\s*responsibilities|job\s*responsibilities|duties|key\s*duties)[:\-\s*]/i.test(
        line,
      )
    ) {
      inResponsibilities = true;
      // grab inline content after the label
      const after = line.replace(/^[^:]+:\s*/, "").trim();
      if (after) respLines.push(after);
      continue;
    }
    if (inResponsibilities) {
      // stop at next label
      if (
        /^(?:skills?|experience|location|company|client|salary|rate|ctc|compensation|education|qualification)[:\-\s*]/i.test(
          line,
        )
      ) {
        break;
      }
      respLines.push(line);
    }
  }
  if (respLines.length) {
    responsibilities = respLines.join("\n");
  }

  // Role summary: first short descriptive line not a label (after title)
  let roleSummary = extract([
    /^(?:summary[:\-\s*]*|role\s*summary[:\-\s*]*|about\s*(?:the\s*)?role[:\-\s*]*)(.+)$/i,
  ]);
  if (!roleSummary && responsibilities) {
    // First sentence of responsibilities
    roleSummary = responsibilities.split(/[.\n]/)[0].trim().slice(0, 200);
  }

  return {
    title,
    companyName,
    roleSummary,
    responsibilities,
    requiredSkills,
    experience,
    location,
    rateType,
    rateAmount,
    rateCurrency,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatRateDisplay(job: Job): string {
  if (job.rateType && job.rateAmount) {
    const currency = job.rateCurrency ?? "INR";
    const symbol =
      currency === "INR"
        ? "₹"
        : currency === "USD"
          ? "$"
          : currency === "EUR"
            ? "€"
            : currency === "GBP"
              ? "£"
              : currency;
    const label =
      job.rateType === "LPM" ? "LPM" : job.rateType === "LPA" ? "LPA" : "/hr";
    return `${symbol}${job.rateAmount} ${label}`;
  }
  if (job.rateMin && job.rateMax) return `$${job.rateMin}–$${job.rateMax}/hr`;
  if (job.rateMin) return `$${job.rateMin}/hr+`;
  if (job.rateMax) return `Up to $${job.rateMax}/hr`;
  return "—";
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusVariant(
  status: JobStatus,
): "default" | "secondary" | "destructive" | "outline" {
  if (status === "open") return "default";
  if (status === "filled") return "secondary";
  if (status === "closed") return "destructive";
  return "outline";
}

function getStatusLabel(status: JobStatus): string {
  const labels: Record<JobStatus, string> = {
    open: "Open",
    filled: "Filled",
    closed: "Closed",
    on_hold: "On Hold",
  };
  return labels[status] ?? status;
}

function getMatchColor(score: number): string {
  if (score >= 0.7)
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
  if (score >= 0.4)
    return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
  return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
}

function buildShareMessage(job: Job): string {
  const location = job.location || "Remote / Flexible";
  const rate = formatRateDisplay(job);
  const summary = job.roleSummary
    ? job.roleSummary.slice(0, 180) + (job.roleSummary.length > 180 ? "…" : "")
    : job.responsibilities
      ? job.responsibilities.slice(0, 180) +
        (job.responsibilities.length > 180 ? "…" : "")
      : "See full details on our website";
  const skills = job.requiredSkills ? `\n🛠 Skills: ${job.requiredSkills}` : "";

  return `🚀 Hiring: ${job.title}
📍 Location: ${location}
💰 Compensation: ${rate}${skills}

${summary}

📩 Interested? Reach us at HireNest Workforce
🌐 app.hirenestworkforce.com`;
}

// ── WhatsApp SVG Icon ─────────────────────────────────────────────────────────

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

// ── WhatsApp Job Import Modal ─────────────────────────────────────────────────

function WhatsAppJobImportModal({
  open,
  onClose,
  clients,
}: {
  open: boolean;
  onClose: () => void;
  clients: Client[];
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [rawText, setRawText] = useState("");
  const [parsed, setParsed] = useState<ParsedJobFields | null>(null);
  const [form, setForm] = useState<JobFormInput & { _companyName: string }>({
    clientId: "",
    title: "",
    roleSummary: "",
    responsibilities: "",
    requiredSkills: "",
    experience: "",
    location: "",
    rateType: "",
    rateAmount: "",
    rateCurrency: "INR",
    _companyName: "",
  });
  const [matchedClient, setMatchedClient] = useState<Client | null>(null);
  const [isNewClient, setIsNewClient] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const createClient = useCreateClient();
  const createJob = useCreateJob();
  const qc = useQueryClient();

  function handleParse() {
    if (!rawText.trim()) {
      toast.error("Please paste some WhatsApp text first.");
      return;
    }
    const fields = parseJobRequirementText(rawText);
    setParsed(fields);

    // Fuzzy client match — case-insensitive substring
    let found: Client | null = null;
    if (fields.companyName) {
      const needle = fields.companyName.toLowerCase();
      found =
        clients.find(
          (c) =>
            c.name.toLowerCase().includes(needle) ||
            needle.includes(c.name.toLowerCase()) ||
            c.company?.toLowerCase().includes(needle) ||
            (c.company !== undefined &&
              needle.includes(c.company.toLowerCase())),
        ) ?? null;
    }

    setMatchedClient(found);
    setIsNewClient(!found && !!fields.companyName);

    setForm({
      clientId: found?.id ?? "",
      title: fields.title,
      roleSummary: fields.roleSummary,
      responsibilities: fields.responsibilities,
      requiredSkills: fields.requiredSkills,
      experience: fields.experience,
      location: fields.location,
      rateType: fields.rateType,
      rateAmount: fields.rateAmount,
      rateCurrency: fields.rateCurrency,
      _companyName: fields.companyName,
    });

    setStep(2);
  }

  function handleFieldChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    if (!form.title.trim()) {
      toast.error("Job title is required.");
      return;
    }
    if (!form.rateType) {
      toast.error("Please select a rate structure.");
      return;
    }

    setIsSaving(true);
    try {
      let clientId = form.clientId;

      // Auto-create client if new
      if (isNewClient && form._companyName) {
        const newClient = await createClient.mutateAsync({
          name: form._companyName,
          email: "",
          company: form._companyName,
        });
        clientId = newClient.id;
      }

      if (!clientId) {
        toast.error("Please select or ensure a client is linked.");
        setIsSaving(false);
        return;
      }

      const { _companyName: _ignored, ...jobInput } = form;
      await createJob.mutateAsync({ ...jobInput, clientId });

      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });

      toast.success(
        isNewClient
          ? `Job created and new client "${form._companyName}" added`
          : "Job created successfully",
      );

      handleClose();
    } catch {
      // errors are shown by the hooks themselves
    } finally {
      setIsSaving(false);
    }
  }

  function handleClose() {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setStep(1);
      setRawText("");
      setParsed(null);
      setMatchedClient(null);
      setIsNewClient(false);
    }, 200);
  }

  if (!open) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-0 m-0 max-w-none w-full h-full"
      aria-label="Import job from WhatsApp"
      data-ocid="whatsapp-import-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm cursor-default"
        aria-hidden="true"
        onClick={handleClose}
        onKeyDown={(e) => e.key === "Escape" && handleClose()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-xl mx-4 bg-card border border-border rounded-lg shadow-elevated flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20">
              <WhatsAppIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-card-foreground font-display">
                Parse from WhatsApp
              </h2>
              <p className="text-[10px] text-muted-foreground">
                Step {step} of 2 —{" "}
                {step === 1
                  ? "Paste requirement text"
                  : "Review & confirm job details"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
            aria-label="Close modal"
            data-ocid="wa-import-close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-0 px-4 pt-3 pb-0 shrink-0">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-1.5 mr-4">
              <span
                className={[
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                  step === s
                    ? "bg-primary text-primary-foreground border-primary"
                    : step > s
                      ? "bg-primary/20 text-primary border-primary/40"
                      : "bg-muted text-muted-foreground border-border",
                ].join(" ")}
              >
                {s}
              </span>
              <span
                className={`text-xs font-medium ${step === s ? "text-foreground" : "text-muted-foreground"}`}
              >
                {s === 1 ? "Paste Text" : "Review & Save"}
              </span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {step === 1 ? (
            <>
              <div className="rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 px-3 py-2.5">
                <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  <span className="font-semibold">How it works:</span> Paste the
                  job requirement message you received on WhatsApp. The parser
                  will extract title, company, skills, experience, rate (LPM /
                  LPA / Per Hour), location, and responsibilities automatically.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">
                  WhatsApp Message Text
                </Label>
                <Textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={
                    "Paste the job requirement message here…\n\nExample:\nHiring: Senior React Developer\nCompany: TechCorp India\nLocation: Pune / Remote\nSkills: React, TypeScript, Node.js\nExperience: 5+ years\nCTC: 2.5 LPM\n\nResponsibilities:\n- Lead frontend development\n- Mentor junior developers"
                  }
                  className="text-xs min-h-[280px] font-mono resize-none"
                  data-ocid="wa-import-textarea"
                  autoFocus
                />
                <p className="text-[10px] text-muted-foreground">
                  Supports structured and conversational formats. Only company
                  name and title are needed for auto-detection.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Client badge */}
              <div className="flex items-center gap-2">
                {isNewClient ? (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-400 font-medium"
                    data-ocid="wa-new-client-badge"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    New client will be created:{" "}
                    <span className="font-bold">{form._companyName}</span>
                  </div>
                ) : matchedClient ? (
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-400 font-medium"
                    data-ocid="wa-linked-client-badge"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    Linked to existing client:{" "}
                    <span className="font-bold">{matchedClient.name}</span>
                  </div>
                ) : (
                  <div className="space-y-1 w-full">
                    <Label className="text-xs">Client *</Label>
                    <Select
                      value={form.clientId}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, clientId: v }))
                      }
                    >
                      <SelectTrigger
                        className="h-8 text-xs"
                        data-ocid="wa-client-select"
                      >
                        <SelectValue placeholder="Select client…" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem
                            key={c.id}
                            value={c.id}
                            className="text-xs"
                          >
                            {c.company ? `${c.company} (${c.name})` : c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Parsed fields — editable */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs">Job Title *</Label>
                  <Input
                    name="title"
                    value={form.title}
                    onChange={handleFieldChange}
                    placeholder="e.g. Senior React Developer"
                    className="h-8 text-xs"
                    data-ocid="wa-form-title"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Role Summary</Label>
                  <Input
                    name="roleSummary"
                    value={form.roleSummary ?? ""}
                    onChange={handleFieldChange}
                    placeholder="One-line description"
                    className="h-8 text-xs"
                    data-ocid="wa-form-role-summary"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Responsibilities</Label>
                  <Textarea
                    name="responsibilities"
                    value={form.responsibilities ?? ""}
                    onChange={handleFieldChange}
                    placeholder="Day-to-day responsibilities…"
                    className="text-xs min-h-[100px]"
                    data-ocid="wa-form-responsibilities"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Required Skills</Label>
                    <Input
                      name="requiredSkills"
                      value={form.requiredSkills ?? ""}
                      onChange={handleFieldChange}
                      placeholder="React, Node.js, …"
                      className="h-8 text-xs"
                      data-ocid="wa-form-skills"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Experience</Label>
                    <Input
                      name="experience"
                      value={form.experience ?? ""}
                      onChange={handleFieldChange}
                      placeholder="e.g. 5+ years"
                      className="h-8 text-xs"
                      data-ocid="wa-form-experience"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">Location</Label>
                  <Input
                    name="location"
                    value={form.location ?? ""}
                    onChange={handleFieldChange}
                    placeholder="e.g. Pune, Remote"
                    className="h-8 text-xs"
                    data-ocid="wa-form-location"
                  />
                </div>

                {/* Rate Structure */}
                <RateStructure
                  rateType={form.rateType as RateType | ""}
                  rateAmount={form.rateAmount ?? ""}
                  rateCurrency={form.rateCurrency ?? "INR"}
                  onRateTypeChange={(v) =>
                    setForm((p) => ({ ...p, rateType: v }))
                  }
                  onRateAmountChange={(v) =>
                    setForm((p) => ({ ...p, rateAmount: v }))
                  }
                  onRateCurrencyChange={(v) =>
                    setForm((p) => ({ ...p, rateCurrency: v }))
                  }
                />
              </div>

              {/* Parsed source hint */}
              {parsed && (
                <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-[10px] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    Parsed from text.
                  </span>{" "}
                  All fields are editable. Unrecognised fields were left blank.
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 shrink-0">
          {step === 2 ? (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => setStep(1)}
              disabled={isSaving}
              data-ocid="wa-back-btn"
            >
              ← Back
            </Button>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={handleClose}
              disabled={isSaving}
              data-ocid="wa-cancel-btn"
            >
              Cancel
            </Button>

            {step === 1 ? (
              <Button
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={handleParse}
                disabled={!rawText.trim()}
                data-ocid="wa-parse-btn"
              >
                <MessageSquare className="h-3 w-3" />
                Parse & Continue →
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-7 text-xs gap-1"
                onClick={handleSave}
                disabled={isSaving || !form.title.trim()}
                data-ocid="wa-save-btn"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    {isNewClient ? "Creating client & job…" : "Saving job…"}
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" />
                    {isNewClient ? "Create Client & Job" : "Save Job"}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
}

// ── Share Job Modal ───────────────────────────────────────────────────────────

function ShareJobModal({
  job,
  open,
  onClose,
}: {
  job: Job;
  open: boolean;
  onClose: () => void;
}) {
  const message = buildShareMessage(job);
  const jobsUrl = "https://app.hirenestworkforce.com/jobs";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobsUrl)}&title=${encodeURIComponent(job.title)}&summary=${encodeURIComponent(message)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy. Please copy manually.");
    }
  }

  if (!open) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent p-0 m-0 max-w-none w-full h-full"
      aria-label="Share Job Opening"
      data-ocid="share-job-modal"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/30 backdrop-blur-sm cursor-default"
        aria-hidden="true"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-elevated">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold text-card-foreground font-display">
              Share Job Opening
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150"
            aria-label="Close modal"
            data-ocid="share-modal-close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Job preview card */}
          <div
            className="rounded-md border border-border bg-slate-50 dark:bg-slate-800 p-3 space-y-2"
            data-ocid="share-preview-card"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-display">
                  {job.title}
                </p>
                {job.location && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </p>
                )}
              </div>
              <Badge variant="default" className="shrink-0 text-[10px]">
                {getStatusLabel(job.status)}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-800 dark:text-slate-200 font-medium">
              <IndianRupee className="h-3 w-3 text-primary" />
              {formatRateDisplay(job)}
            </div>
            {job.roleSummary && (
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                {job.roleSummary}
              </p>
            )}
            {job.requiredSkills && (
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills
                  .split(",")
                  .slice(0, 4)
                  .map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20"
                    >
                      {s.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Message preview */}
          <div>
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
              Message Preview
            </p>
            <div
              className="bg-muted border border-border rounded-md px-3 py-2.5 text-xs text-foreground whitespace-pre-wrap leading-relaxed font-mono max-h-36 overflow-y-auto"
              data-ocid="share-message-preview"
            >
              {message}
            </div>
          </div>

          {/* Share buttons */}
          <div className="space-y-2">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              Share Via
            </p>
            <div className="grid grid-cols-3 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors duration-150 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
                data-ocid="share-whatsapp-btn"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span className="text-[10px] font-semibold">WhatsApp</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors duration-150 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30"
                data-ocid="share-linkedin-btn"
                aria-label="Share on LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-[10px] font-semibold">LinkedIn</span>
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-secondary border border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150"
                data-ocid="share-copy-btn"
                aria-label="Copy message to clipboard"
              >
                <Copy className="h-5 w-5" />
                <span className="text-[10px] font-semibold">Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

// ── Bench Matches Panel ───────────────────────────────────────────────────────

function BenchMatchesPanel({ job }: { job: Job }) {
  const { data: allBench = [], isLoading: benchLoading } = useBenchRecords();
  const {
    data: matches = [],
    isLoading: matchLoading,
    refetch,
    isFetching,
  } = useMatchBench(job.id);

  const isLoading = matchLoading || benchLoading;

  return (
    <div
      className="border-t border-border mt-4 pt-4"
      data-ocid="bench-matches-panel"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-primary" />
          <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Bench Matches
          </h4>
          {!isLoading && matches.length > 0 && (
            <Badge variant="outline" className="h-4 text-[10px] px-1.5">
              {matches.length}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => refetch()}
          disabled={isFetching}
          aria-label="Reload bench matches"
          data-ocid="bench-reload-btn"
        >
          <RefreshCw
            className={`h-3 w-3 ${isFetching ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-1.5">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-full rounded" />
          ))}
        </div>
      ) : !benchLoading && allBench.length === 0 ? (
        <div
          className="rounded-md border border-border bg-muted/20 px-3 py-4 text-center"
          data-ocid="bench-empty-upload"
        >
          <p className="text-xs text-muted-foreground mb-2">
            Upload your vendor bench list to see matching candidates here.
          </p>
          <Link to="/bench">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Go to Bench
            </Button>
          </Link>
        </div>
      ) : matches.length === 0 ? (
        <div
          className="rounded-md border border-border bg-muted/20 px-3 py-4 text-center"
          data-ocid="bench-no-matches"
        >
          <p className="text-xs text-muted-foreground">
            No bench matches found.{" "}
            <Link to="/bench" className="text-primary hover:underline">
              Upload bench candidates
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="rounded-md border border-border overflow-hidden">
          <div className="grid grid-cols-[56px_1fr_100px_100px_1fr_70px] gap-2 px-3 py-1.5 bg-muted/30 border-b border-border">
            {["Match %", "Candidate", "Vendor", "Role", "Skills", "Rate"].map(
              (h) => (
                <span
                  key={h}
                  className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate"
                >
                  {h}
                </span>
              ),
            )}
          </div>
          {matches.map((m: BenchMatch) => (
            <BenchMatchRow key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function BenchMatchRow({ match }: { match: BenchMatch }) {
  const pct = Math.round(match.matchScore * 100);
  const colorClass = getMatchColor(match.matchScore);

  return (
    <div
      className="grid grid-cols-[56px_1fr_100px_100px_1fr_70px] gap-2 px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition-colors duration-150 text-xs items-center"
      data-ocid="bench-match-row"
    >
      <span
        className={`inline-flex items-center justify-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${colorClass}`}
      >
        {pct}%
      </span>
      <span className="font-medium text-foreground truncate">
        {match.candidateName}
      </span>
      <span className="text-muted-foreground truncate">{match.vendorName}</span>
      <span className="text-muted-foreground truncate">{match.role}</span>
      <span className="text-muted-foreground truncate">{match.skill}</span>
      <span className="text-muted-foreground">₹{match.rate}/hr</span>
    </div>
  );
}

// ── Job Detail Panel ──────────────────────────────────────────────────────────

function JobDetailPanel({
  job,
  clients,
  onEdit,
  onClose,
}: {
  job: Job;
  clients: Client[];
  onEdit: (job: Job) => void;
  onClose: () => void;
}) {
  const [shareOpen, setShareOpen] = useState(false);

  const clientName =
    job.clientName ||
    clients.find((c) => c.id === job.clientId)?.name ||
    "Unknown Client";

  return (
    <>
      <div
        className="flex flex-col h-full overflow-hidden bg-card border-l border-border w-full max-w-[480px]"
        data-ocid="job-detail-panel"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-card-foreground font-display truncate">
              {job.title}
            </h3>
            <p className="text-xs text-muted-foreground">{clientName}</p>
          </div>
          <div className="flex items-center gap-1.5 ml-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setShareOpen(true)}
              data-ocid="job-detail-share-btn"
              aria-label="Share job opening"
            >
              <Share2 className="h-3 w-3" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={() => onEdit(job)}
              data-ocid="job-edit-btn"
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={onClose}
              aria-label="Close panel"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Panel body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Meta row */}
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge
              variant={getStatusVariant(job.status)}
              className="text-[10px]"
            >
              {getStatusLabel(job.status)}
            </Badge>
            {job.location && (
              <span className="flex items-center gap-0.5 text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {job.location}
              </span>
            )}
            <span className="flex items-center gap-0.5 text-muted-foreground">
              <IndianRupee className="h-3 w-3" />
              {formatRateDisplay(job)}
            </span>
          </div>

          {/* Client + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Client
              </p>
              <p className="text-xs text-card-foreground">{clientName}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Created
              </p>
              <p className="text-xs text-card-foreground">
                {formatDate(job.createdAt)}
              </p>
            </div>
          </div>

          {/* Role Summary */}
          {job.roleSummary && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Role Summary
              </p>
              <p className="text-xs text-card-foreground leading-relaxed">
                {job.roleSummary}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Responsibilities
              </p>
              <p className="text-xs text-card-foreground whitespace-pre-wrap leading-relaxed">
                {job.responsibilities}
              </p>
            </div>
          )}

          {/* Legacy requirements */}
          {!job.responsibilities && job.requirements && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Requirements
              </p>
              <p className="text-xs text-card-foreground whitespace-pre-wrap leading-relaxed">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Required Skills */}
          {job.requiredSkills && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                Required Skills
              </p>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.split(",").map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary border border-primary/20 font-medium"
                  >
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {job.experience && (
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                Experience Required
              </p>
              <p className="text-xs text-card-foreground">{job.experience}</p>
            </div>
          )}

          {/* Bench Matches */}
          <BenchMatchesPanel job={job} />
        </div>
      </div>

      <ShareJobModal
        job={job}
        open={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </>
  );
}

// ── Rate Structure Component ──────────────────────────────────────────────────

const RATE_TYPES: { value: RateType; label: string; description: string }[] = [
  { value: "LPM", label: "LPM", description: "Lakh Per Month" },
  { value: "LPA", label: "LPA", description: "Lakh Per Annum" },
  { value: "PerHour", label: "Per Hour", description: "Hourly rate" },
];

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];

interface RateStructureProps {
  rateType: RateType | "";
  rateAmount: string;
  rateCurrency: string;
  onRateTypeChange: (v: RateType) => void;
  onRateAmountChange: (v: string) => void;
  onRateCurrencyChange: (v: string) => void;
}

function RateStructure({
  rateType,
  rateAmount,
  rateCurrency,
  onRateTypeChange,
  onRateAmountChange,
  onRateCurrencyChange,
}: RateStructureProps) {
  return (
    <div className="rounded-md border border-border bg-muted/20 p-3 space-y-3">
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Rate Structure *{" "}
          <span className="normal-case text-muted-foreground/70">
            (Choose one)
          </span>
        </p>
        <div className="space-y-2">
          {RATE_TYPES.map(({ value, label, description }) => (
            <label
              key={value}
              className={[
                "flex items-center gap-3 p-2.5 rounded-md border cursor-pointer transition-colors duration-150",
                rateType === value
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-background border-border hover:border-border/80 hover:bg-muted/40 text-foreground",
              ].join(" ")}
              data-ocid={`rate-type-${value.toLowerCase()}`}
            >
              <input
                type="radio"
                name="rateType"
                value={value}
                checked={rateType === value}
                onChange={() => onRateTypeChange(value)}
                className="sr-only"
              />
              <span
                className={[
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  rateType === value
                    ? "border-primary"
                    : "border-muted-foreground/40",
                ].join(" ")}
              >
                {rateType === value && (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                )}
              </span>
              <span className="text-xs">
                <span className="font-semibold">{label}</span>
                <span className="text-muted-foreground ml-1.5">
                  ({description})
                </span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {rateType && (
        <div className="flex gap-2 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">
              Amount
              {rateType === "LPM" && " (in Lakhs)"}
              {rateType === "LPA" && " (in Lakhs)"}
            </Label>
            <Input
              type="number"
              min={0}
              step="0.1"
              value={rateAmount}
              onChange={(e) => onRateAmountChange(e.target.value)}
              placeholder={rateType === "PerHour" ? "e.g. 50" : "e.g. 2.5"}
              className="h-8 text-xs"
              data-ocid="job-form-rate-amount"
            />
          </div>
          <div className="w-24 space-y-1">
            <Label className="text-xs">Currency</Label>
            <Select value={rateCurrency} onValueChange={onRateCurrencyChange}>
              <SelectTrigger
                className="h-8 text-xs"
                data-ocid="job-form-rate-currency"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c} className="text-xs">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {rateType && rateAmount && (
        <p className="text-[10px] text-muted-foreground">
          {rateType === "LPM" &&
            `Example: ${rateAmount} LPM = ₹${(Number.parseFloat(rateAmount) * 100000).toLocaleString("en-IN")}/month`}
          {rateType === "LPA" &&
            `Example: ${rateAmount} LPA = ₹${(Number.parseFloat(rateAmount) * 100000).toLocaleString("en-IN")}/year`}
          {rateType === "PerHour" &&
            `Example: ${rateAmount} ${rateCurrency}/hr`}
        </p>
      )}
    </div>
  );
}

// ── Job Form ──────────────────────────────────────────────────────────────────

function JobForm({
  initial,
  clients,
  onSubmit,
  isLoading,
}: {
  initial?: Partial<JobFormInput>;
  clients: Client[];
  onSubmit: (data: JobFormInput) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<JobFormInput>({
    clientId: initial?.clientId ?? "",
    title: initial?.title ?? "",
    roleSummary: initial?.roleSummary ?? "",
    responsibilities: initial?.responsibilities ?? "",
    requiredSkills: initial?.requiredSkills ?? "",
    experience: initial?.experience ?? "",
    requirements: initial?.requirements ?? "",
    rateType: (initial?.rateType as RateType | "") ?? "",
    rateAmount: initial?.rateAmount ?? "",
    rateCurrency: initial?.rateCurrency ?? "INR",
    location: initial?.location ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.clientId || !form.title.trim()) {
      toast.error("Client and job title are required.");
      return;
    }
    if (!form.rateType) {
      toast.error("Please select a rate structure (LPM, LPA, or Per Hour).");
      return;
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-ocid="job-form">
      {/* 1. Job Title */}
      <div className="space-y-1">
        <Label className="text-xs">Job Title *</Label>
        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Senior React Developer"
          className="h-8 text-xs"
          required
          data-ocid="job-form-title"
        />
      </div>

      {/* 2. Client */}
      <div className="space-y-1">
        <Label className="text-xs">Client *</Label>
        <Select
          value={form.clientId}
          onValueChange={(v) => setForm((p) => ({ ...p, clientId: v }))}
        >
          <SelectTrigger className="h-8 text-xs" data-ocid="job-form-client">
            <SelectValue placeholder="Select client…" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((c) => (
              <SelectItem key={c.id} value={c.id} className="text-xs">
                {c.company ? `${c.company} (${c.name})` : c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 3. Role Summary */}
      <div className="space-y-1">
        <Label className="text-xs">Role Summary</Label>
        <Input
          name="roleSummary"
          value={form.roleSummary ?? ""}
          onChange={handleChange}
          placeholder="One-line description of the role"
          className="h-8 text-xs"
          data-ocid="job-form-role-summary"
        />
      </div>

      {/* 4. Responsibilities */}
      <div className="space-y-1">
        <Label className="text-xs">Responsibilities</Label>
        <Textarea
          name="responsibilities"
          value={form.responsibilities ?? ""}
          onChange={handleChange}
          placeholder="Describe day-to-day responsibilities, key deliverables, team structure, reporting lines..."
          className="text-xs min-h-[120px]"
          data-ocid="job-form-responsibilities"
        />
      </div>

      {/* 5. Required Skills */}
      <div className="space-y-1">
        <Label className="text-xs">Required Skills</Label>
        <Input
          name="requiredSkills"
          value={form.requiredSkills ?? ""}
          onChange={handleChange}
          placeholder="e.g. React, TypeScript, Node.js (comma separated)"
          className="h-8 text-xs"
          data-ocid="job-form-skills"
        />
      </div>

      {/* 6. Experience */}
      <div className="space-y-1">
        <Label className="text-xs">Experience Required</Label>
        <Input
          name="experience"
          value={form.experience ?? ""}
          onChange={handleChange}
          placeholder="e.g. 3+ years, 5-8 years"
          className="h-8 text-xs"
          data-ocid="job-form-experience"
        />
      </div>

      {/* 7. Location */}
      <div className="space-y-1">
        <Label className="text-xs">Location</Label>
        <Input
          name="location"
          value={form.location ?? ""}
          onChange={handleChange}
          placeholder="e.g. Remote, Bangalore, Austin TX"
          className="h-8 text-xs"
          data-ocid="job-form-location"
        />
      </div>

      {/* 8. Rate Structure */}
      <RateStructure
        rateType={form.rateType as RateType | ""}
        rateAmount={form.rateAmount ?? ""}
        rateCurrency={form.rateCurrency ?? "INR"}
        onRateTypeChange={(v) => setForm((p) => ({ ...p, rateType: v }))}
        onRateAmountChange={(v) => setForm((p) => ({ ...p, rateAmount: v }))}
        onRateCurrencyChange={(v) =>
          setForm((p) => ({ ...p, rateCurrency: v }))
        }
      />

      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          data-ocid="job-form-submit"
        >
          {isLoading ? "Saving…" : initial?.title ? "Save Changes" : "Add Job"}
        </Button>
      </div>
    </form>
  );
}

// ── Job Row ───────────────────────────────────────────────────────────────────

function JobRow({
  job,
  clientName,
  isSelected,
  onClick,
  onShare,
}: {
  job: Job;
  clientName: string;
  isSelected: boolean;
  onClick: () => void;
  onShare: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full text-left grid grid-cols-[1fr_120px_130px_140px_80px_52px_28px] gap-2 px-3 py-2 text-xs border-b border-border/50 transition-colors duration-150 cursor-pointer items-center",
        isSelected
          ? "bg-primary/8 border-l-2 border-l-primary"
          : "hover:bg-muted/30",
      ].join(" ")}
      data-ocid="job-list-row"
    >
      <div className="min-w-0">
        <p className="font-medium text-foreground truncate">{job.title}</p>
        {job.location && (
          <p className="text-[10px] text-muted-foreground truncate flex items-center gap-0.5 mt-0.5">
            <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
            {job.location}
          </p>
        )}
      </div>
      <span className="text-muted-foreground truncate">{clientName}</span>
      <span className="text-muted-foreground truncate flex items-center gap-0.5">
        <IndianRupee className="h-3 w-3 flex-shrink-0" />
        {formatRateDisplay(job)}
      </span>
      <span className="text-muted-foreground truncate">
        {formatDate(job.createdAt)}
      </span>
      <div>
        <Badge
          variant={getStatusVariant(job.status)}
          className="text-[10px] h-4 px-1.5"
        >
          {getStatusLabel(job.status)}
        </Badge>
      </div>
      <div className="flex justify-center">
        <button
          type="button"
          onClick={onShare}
          className="h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-150"
          aria-label={`Share ${job.title}`}
          data-ocid="job-row-share-btn"
        >
          <Share2 className="h-3 w-3" />
        </button>
      </div>
      {isSelected ? (
        <ChevronDown className="h-3 w-3 text-primary" />
      ) : (
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
      )}
    </button>
  );
}

// ── Status Filter Tabs ────────────────────────────────────────────────────────

const STATUS_TABS: { label: string; value: "all" | JobStatus }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Filled", value: "filled" },
  { label: "Closed", value: "closed" },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: clients = [] } = useClients();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();

  const [statusFilter, setStatusFilter] = useState<"all" | JobStatus>("all");
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWAImport, setShowWAImport] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [sharingJob, setSharingJob] = useState<Job | null>(null);

  const filteredJobs =
    statusFilter === "all"
      ? jobs
      : jobs.filter((j) => j.status === statusFilter);
  const openCount = jobs.filter((j) => j.status === "open").length;
  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;

  function handleRowClick(jobId: string) {
    setSelectedJobId((prev) => (prev === jobId ? null : jobId));
  }

  function handleAddJob(data: JobFormInput) {
    createJob.mutate(data, {
      onSuccess: () => {
        setShowAddModal(false);
        toast.success("Job added successfully");
      },
      onError: () => toast.error("Failed to add job"),
    });
  }

  function handleEditJob(data: JobFormInput) {
    if (!editingJob) return;
    updateJob.mutate(
      { id: editingJob.id, input: data },
      {
        onSuccess: () => {
          setEditingJob(null);
          toast.success("Job updated");
        },
        onError: () => toast.error("Failed to update job"),
      },
    );
  }

  function getClientName(job: Job): string {
    return (
      job.clientName ||
      clients.find((c) => c.id === job.clientId)?.name ||
      "Unknown Client"
    );
  }

  return (
    <div className="flex flex-col h-full" data-ocid="jobs-page">
      <PageHeader
        title={`Jobs (${openCount} open)`}
        subtitle="Track open roles, match bench candidates, and manage submissions"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWAImport(true)}
              className="h-7 gap-1.5 text-xs border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30"
              data-ocid="wa-import-btn"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              Parse from WhatsApp
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddModal(true)}
              className="h-7 gap-1 text-xs"
              data-ocid="add-job-btn"
            >
              <Plus className="h-3 w-3" />
              Add Job
            </Button>
          </div>
        }
      />

      {/* Status filter tabs */}
      <div
        className="flex items-center gap-0 px-4 pt-3 pb-0 border-b border-border bg-card"
        data-ocid="job-status-tabs"
      >
        {STATUS_TABS.map((tab) => {
          const count =
            tab.value === "all"
              ? jobs.length
              : jobs.filter((j) => j.status === tab.value).length;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={[
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors duration-150",
                statusFilter === tab.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
              data-ocid={`job-tab-${tab.value}`}
            >
              {tab.label}
              <span
                className={[
                  "text-[10px] px-1 rounded-sm",
                  statusFilter === tab.value
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground",
                ].join(" ")}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main content: list + optional side panel */}
      <div className="flex-1 overflow-hidden flex">
        {/* Jobs list */}
        <div
          className={`flex-1 overflow-y-auto bg-background ${selectedJob ? "border-r border-border" : ""}`}
        >
          {jobsLoading ? (
            <div className="p-4 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-12 w-full rounded" />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title={
                statusFilter === "all"
                  ? "No jobs yet"
                  : `No ${statusFilter} jobs`
              }
              message={
                statusFilter === "all"
                  ? "Add your first job order to start matching bench candidates."
                  : `There are no jobs with status "${statusFilter}" right now.`
              }
              action={
                statusFilter === "all"
                  ? { label: "Add Job", onClick: () => setShowAddModal(true) }
                  : undefined
              }
            />
          ) : (
            <div>
              {/* Table header */}
              <div className="grid grid-cols-[1fr_120px_130px_140px_80px_52px_28px] gap-2 px-3 py-1.5 bg-muted/20 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 z-10">
                <span>Title / Location</span>
                <span>Client</span>
                <span>Compensation</span>
                <span>Created</span>
                <span>Status</span>
                <span className="text-center">Share</span>
                <span />
              </div>
              {filteredJobs.map((job) => (
                <JobRow
                  key={job.id}
                  job={job}
                  clientName={getClientName(job)}
                  isSelected={selectedJobId === job.id}
                  onClick={() => handleRowClick(job.id)}
                  onShare={(e) => {
                    e.stopPropagation();
                    setSharingJob(job);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Side panel */}
        {selectedJob && (
          <JobDetailPanel
            job={selectedJob}
            clients={clients}
            onEdit={(job) => setEditingJob(job)}
            onClose={() => setSelectedJobId(null)}
          />
        )}
      </div>

      {/* Share Job Modal (from list row) */}
      {sharingJob && (
        <ShareJobModal
          job={sharingJob}
          open={!!sharingJob}
          onClose={() => setSharingJob(null)}
        />
      )}

      {/* WhatsApp Import Modal */}
      <WhatsAppJobImportModal
        open={showWAImport}
        onClose={() => setShowWAImport(false)}
        clients={clients}
      />

      {/* Add Job Modal */}
      <AppModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Add Job"
        description="Create a new job order for a client."
        size="lg"
      >
        <JobForm
          clients={clients}
          onSubmit={handleAddJob}
          isLoading={createJob.isPending}
        />
      </AppModal>

      {/* Edit Job Modal */}
      <AppModal
        open={!!editingJob}
        onOpenChange={(open) => !open && setEditingJob(null)}
        title="Edit Job"
        description="Update job order details."
        size="lg"
      >
        {editingJob && (
          <JobForm
            initial={{
              clientId: editingJob.clientId,
              title: editingJob.title,
              requirements: editingJob.requirements,
              rateMin: editingJob.rateMin,
              rateMax: editingJob.rateMax,
              location: editingJob.location,
              roleSummary: editingJob.roleSummary,
              responsibilities: editingJob.responsibilities,
              requiredSkills: editingJob.requiredSkills,
              experience: editingJob.experience,
              rateType:
                (editingJob.rateType as "" | "LPM" | "LPA" | "PerHour") ?? "",
              rateAmount: editingJob.rateAmount,
              rateCurrency: editingJob.rateCurrency ?? "INR",
            }}
            clients={clients}
            onSubmit={handleEditJob}
            isLoading={updateJob.isPending}
          />
        )}
      </AppModal>
    </div>
  );
}
