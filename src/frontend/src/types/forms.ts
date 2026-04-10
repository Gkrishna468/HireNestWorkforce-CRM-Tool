export interface VendorFormInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  linkedinUrl?: string;
  specialty?: string;
  notes?: string;
}

export interface ClientFormInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  linkedinUrl?: string;
  industry?: string;
  website?: string;
  notes?: string;
}

export interface RecruiterFormInput {
  name: string;
  email: string;
  phone?: string;
  title?: string;
  notes?: string;
}

export interface CandidateFormInput {
  name: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  title?: string;
  skills?: string;
  salaryMin?: number;
  salaryMax?: number;
  notes?: string;
  assignedRecruiter?: string;
}

export interface ActivityFormInput {
  entityId: string;
  activityType:
    | "call"
    | "email"
    | "meeting"
    | "submission"
    | "interview"
    | "note"
    | "stage_change";
  direction?: "inbound" | "outbound";
  notes?: string;
  createdBy?: string;
}

export interface JobFormInput {
  clientId: string;
  title: string;
  requirements?: string;
  rateMin?: number;
  rateMax?: number;
  location?: string;
}

export interface SubmissionFormInput {
  candidateId: string;
  jobId: string;
  vendorId?: string;
  submittedBy?: string;
  rateProposed?: number;
}

export interface FollowUpFormInput {
  entityId: string;
  entityType: string;
  triggerReason: string;
  suggestedAction: string;
  suggestedMessage?: string;
}

export interface ApprovalFormInput {
  entityId: string;
  entityType: string;
  itemType: string;
  description: string;
  details?: string;
  requestedBy?: string;
}

export interface RecruiterMetricsFormInput {
  recruiterId: string;
  date?: string;
  callsMade?: number;
  emailsSent?: number;
  submissions?: number;
  interviewsScheduled?: number;
  tasksCompleted?: number;
  screenTimeActive?: number;
  screenTimeIdle?: number;
}

export interface VendorMetricsFormInput {
  vendorId: string;
  date?: string;
  submissions?: number;
  submissionsAccepted?: number;
  interviewsScheduled?: number;
  placements?: number;
  responseTimeHours?: number;
  qualityScore?: number;
}
