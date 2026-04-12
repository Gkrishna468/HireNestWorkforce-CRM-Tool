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
  candidateName?: string;
  jobId: string;
  jobTitle?: string;
  vendorId?: string;
  submittedBy?: string;
  rateProposed?: number;
  status: SubmissionStatus;
  submittedAt: number;
  approvedBy?: string;
  pipelineStage?: string;
}

export const PIPELINE_STAGES = [
  "Resume Sent",
  "Screening Round",
  "Selected",
  "Client Round",
  "Final Onboarding",
] as const;

export type PipelineStageValue = (typeof PIPELINE_STAGES)[number];

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

// ── Resumes ────────────────────────────────────────────────────────────────────

export interface Resume {
  id: string;
  fileName: string;
  fileUrl?: string;
  candidateName: string;
  extractedSkills: string;
  extractedExperience: string;
  extractedRole: string;
  rawText: string;
  createdAt: string;
}

export interface ResumeMatch {
  job: Job;
  matchScore: number;
  matchedKeywords: string[];
  benchMatchName?: string;
}
