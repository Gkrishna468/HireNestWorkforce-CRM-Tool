export type EntityType = "vendor" | "client" | "recruiter" | "candidate";
export type HealthStatus = "green" | "yellow" | "red";
export type ActivityType =
  | "call"
  | "email"
  | "meeting"
  | "submission"
  | "interview"
  | "note"
  | "stage_change";
export type ActivityDirection = "inbound" | "outbound";
export type FollowUpStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "sent"
  | "snoozed";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "snoozed";
export type JobStatus = "open" | "filled" | "closed" | "on_hold";
export type RateType = "LPM" | "LPA" | "PerHour";
export type SubmissionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "interview"
  | "offer"
  | "placed";

// ── 10-Stage Submission Pipeline ─────────────────────────────────────────────

/** String union of all valid submission pipeline stage keys. */
export type SubmissionPipelineStage =
  | "resume_sent"
  | "internal_screening"
  | "submitted_to_client"
  | "client_screening"
  | "client_interview"
  | "offer_extended"
  | "offer_accepted"
  | "placed"
  | "onboarding"
  | "rejected";

export const PIPELINE_STAGES = [
  "resume_sent",
  "internal_screening",
  "submitted_to_client",
  "client_screening",
  "client_interview",
  "offer_extended",
  "offer_accepted",
  "placed",
  "onboarding",
  "rejected",
] as const satisfies readonly SubmissionPipelineStage[];

export const PIPELINE_STAGE_LABELS: Record<SubmissionPipelineStage, string> = {
  resume_sent: "Resume Sent",
  internal_screening: "Internal Screening",
  submitted_to_client: "Submitted to Client",
  client_screening: "Client Screening",
  client_interview: "Client Interview",
  offer_extended: "Offer Extended",
  offer_accepted: "Offer Accepted",
  placed: "Placed",
  onboarding: "Onboarding",
  rejected: "Rejected",
};

export const PIPELINE_STAGE_COLORS: Record<SubmissionPipelineStage, string> = {
  resume_sent: "#6366f1",
  internal_screening: "#8b5cf6",
  submitted_to_client: "#3b82f6",
  client_screening: "#06b6d4",
  client_interview: "#f59e0b",
  offer_extended: "#f97316",
  offer_accepted: "#10b981",
  placed: "#059669",
  onboarding: "#84cc16",
  rejected: "#ef4444",
};

/** Valid next stages for each pipeline stage. No skipping forward; rejected can return. */
export const ALLOWED_STAGE_TRANSITIONS: Record<
  SubmissionPipelineStage,
  SubmissionPipelineStage[]
> = {
  resume_sent: ["internal_screening", "rejected"],
  internal_screening: ["submitted_to_client", "rejected"],
  submitted_to_client: ["client_screening", "rejected"],
  client_screening: ["client_interview", "rejected"],
  client_interview: ["offer_extended", "rejected"],
  offer_extended: ["offer_accepted", "rejected"],
  offer_accepted: ["placed", "rejected"],
  placed: ["onboarding"],
  onboarding: [],
  rejected: [
    "resume_sent",
    "internal_screening",
    "submitted_to_client",
    "client_screening",
    "client_interview",
  ],
};

// ── Submission History ────────────────────────────────────────────────────────

export interface SubmissionHistory {
  id: string;
  submissionId: string;
  fromStage: SubmissionPipelineStage | undefined;
  toStage: SubmissionPipelineStage;
  changedAt: string;
  changedBy: string | undefined;
  rejectionReason: string | undefined;
  notes: string | undefined;
}

// ── Entities ──────────────────────────────────────────────────────────────────

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  linkedinUrl?: string;
  currentStage: string;
  healthScore: number;
  status: string;
  specialty?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  linkedinUrl?: string;
  currentStage: string;
  healthScore: number;
  status: string;
  industry?: string;
  website?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Recruiter {
  id: string;
  name: string;
  email: string;
  phone?: string;
  currentStage: string;
  healthScore: number;
  status: string;
  title?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  currentStage: string;
  healthScore: number;
  status: string;
  title?: string;
  skills?: string;
  salaryMin?: number;
  salaryMax?: number;
  notes?: string;
  assignedRecruiter?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Activity {
  id: string;
  entityId: string;
  activityType: ActivityType;
  direction?: ActivityDirection;
  notes?: string;
  createdBy?: string;
  createdAt: number;
}

export interface FollowUp {
  id: string;
  entityId: string;
  entityName?: string;
  entityType?: EntityType;
  triggerReason: string;
  suggestedAction: string;
  suggestedMessage?: string;
  aiConfidence?: number;
  status: FollowUpStatus;
  approvedBy?: string;
  approvedAt?: number;
  sentAt?: number;
  snoozedUntil?: number;
  createdAt: number;
}

export interface Job {
  id: string;
  clientId: string;
  clientName?: string;
  title: string;
  requirements?: string;
  rateMin?: number;
  rateMax?: number;
  location?: string;
  status: JobStatus;
  createdAt: number;
  filledAt?: number;
  // New structured fields
  roleSummary?: string;
  responsibilities?: string;
  requiredSkills?: string;
  experience?: string;
  rateType?: RateType;
  rateAmount?: string;
  rateCurrency?: string;
}

export interface Submission {
  id: string;
  candidateId: string;
  candidateName: string | undefined;
  jobId: string;
  jobTitle: string | undefined;
  clientName: string | undefined;
  vendorId: string | undefined;
  /** ID of the resume this submission is based on */
  resumeId: string | undefined;
  submittedBy?: string;
  rateProposed?: number;
  /** @deprecated Use pipelineStage instead */
  status: SubmissionStatus;
  submittedAt: number;
  approvedBy?: string;
  /** Current pipeline stage key — this is the source of truth */
  pipelineStage: SubmissionPipelineStage;
  /** History of all stage transitions */
  pipelineHistory: SubmissionHistory[];
  rejectionReason: string | undefined;
  notes: string | undefined;
  deletedAt: string | undefined;
  lastStageChangeAt: string | undefined;
  /** Computed: days since last stage change (or since creation) */
  daysInStage: number;
}

// ── Pipeline Stage (entity pipeline config, not submission stage) ─────────────
// NOTE: This interface represents a configurable pipeline stage definition
// for entity types (vendor/client/recruiter/candidate). It is distinct from
// SubmissionPipelineStage which is the 10-stage submission string union.

export interface PipelineStage {
  id: string;
  entityType: EntityType;
  stageName: string;
  stageOrder: number;
  requiresApproval: boolean;
  autoTriggerFollowup: boolean;
}

export interface RecruiterMetrics {
  id: string;
  recruiterId: string;
  date: string;
  screenTimeActive: number;
  screenTimeIdle: number;
  callsMade: number;
  emailsSent: number;
  submissions: number;
  interviewsScheduled: number;
  tasksCompleted: number;
  aiProductivityScore: number;
}

export interface VendorMetrics {
  id: string;
  vendorId: string;
  date: string;
  submissions: number;
  submissionsAccepted: number;
  interviewsScheduled: number;
  placements: number;
  responseTimeHours?: number;
  qualityScore?: number;
}

export interface ApprovalItem {
  id: string;
  entityId: string;
  entityName?: string;
  entityType?: EntityType;
  itemType: string;
  description: string;
  details?: string;
  requestedBy?: string;
  status: ApprovalStatus;
  approvedBy?: string;
  approvedAt?: number;
  rejectedBy?: string;
  rejectedAt?: number;
  rejectionNotes?: string;
  snoozedUntil?: number;
  createdAt: number;
}

export interface PulseEntry {
  entityId: string;
  entityType: EntityType;
  name: string;
  company?: string;
  currentStage: string;
  healthScore: number;
  healthStatus: HealthStatus;
  lastActivityAt?: number;
  actionsNeeded: string[];
}

export interface PulseDashboard {
  entries: PulseEntry[];
  totalVendors: number;
  totalClients: number;
  totalRecruiters: number;
  totalCandidates: number;
  pendingApprovals: number;
  pendingFollowUps: number;
  lastUpdated: number;
}

export interface MorningBriefingItem {
  category: string;
  message: string;
  count?: number;
  entityIds?: string[];
}

export interface MorningBriefing {
  date: string;
  priorities: MorningBriefingItem[];
  recruiterActivity: MorningBriefingItem[];
  aiSuggestions: MorningBriefingItem[];
  generatedAt: number;
}

// ── Bench ──────────────────────────────────────────────────────────────────────

export interface BenchRecord {
  id: number;
  vendorName: string;
  candidateName: string;
  role: string;
  experience: string;
  skill: string;
  rate: number;
  importedAt: number;
}

export interface BenchRecordInput {
  vendorName: string;
  candidateName: string;
  role: string;
  experience: string;
  skill: string;
  rate: number;
}

export interface BenchMatch extends BenchRecord {
  matchScore: number;
}

// ── Pipeline History Entry ─────────────────────────────────────────────────────

export interface PipelineHistoryEntry {
  fromStage: SubmissionPipelineStage;
  toStage: SubmissionPipelineStage;
  changedAt: number;
  changedBy: string;
}

// ── Resumes ────────────────────────────────────────────────────────────────────

export interface Resume {
  id: string;
  fileName: string;
  fileUrl: string | undefined;
  candidateName: string;
  email: string | undefined;
  phone: string | undefined;
  /** Skills as an array of strings */
  extractedSkills: string[];
  extractedExperience: string;
  extractedRole: string;
  rawText: string;
  createdAt: string;
  /** ID of existing resume if this is a duplicate */
  duplicateOf: string | undefined;
  status: "pending" | "active" | "duplicate" | "archived";
  availability:
    | "immediate"
    | "two_weeks"
    | "one_month"
    | "unavailable"
    | undefined;
  /** Years of experience parsed from resume */
  yearsExperience: number | undefined;
  /** Location extracted from resume */
  location: string | undefined;
  /** Vendor who sourced / provided this resume */
  sourceVendorId: string | undefined;
}

export interface ResumeMatch {
  jobId: string;
  jobTitle: string;
  clientName: string;
  totalScore: number;
  skillsScore: number;
  expScore: number;
  rateScore: number;
  availScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

// ── Client Job Link ───────────────────────────────────────────────────────────

export interface ClientJobLink {
  jobId: string;
  linkedAt: string;
}

// ── Fuzzy Duplicate Match ─────────────────────────────────────────────────────

/**
 * Returned by the `find_similar_candidates` Supabase RPC.
 * similarityScore is 0–100, matchReasons contains fired signal labels.
 */
export interface FuzzyDuplicateMatch {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  extractedSkills: string[];
  extractedRole: string;
  /** Composite score 0–100 (name 40 + phone 35 + skills 25) */
  similarityScore: number;
  /** e.g. ["Name match", "Phone match", "Skills overlap"] */
  matchReasons: string[];
}
