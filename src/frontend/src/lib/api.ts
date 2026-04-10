/**
 * API layer wrapping the backend actor calls.
 * Since bindgen hasn't populated the actor yet, we use a mock-safe approach
 * that will work once the backend methods are deployed.
 */
import type {
  Activity,
  ApprovalItem,
  ApprovalStatus,
  BenchMatch,
  BenchRecord,
  BenchRecordInput,
  Candidate,
  Client,
  FollowUp,
  FollowUpStatus,
  Job,
  MorningBriefing,
  PipelineStage,
  PulseDashboard,
  Recruiter,
  RecruiterMetrics,
  Submission,
  SubmissionStatus,
  Vendor,
  VendorMetrics,
} from "../types/crm";
import type {
  ActivityFormInput,
  ApprovalFormInput,
  CandidateFormInput,
  ClientFormInput,
  FollowUpFormInput,
  JobFormInput,
  RecruiterFormInput,
  RecruiterMetricsFormInput,
  SubmissionFormInput,
  VendorFormInput,
  VendorMetricsFormInput,
} from "../types/forms";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Actor = any;

function safeNumber(val: unknown): number {
  if (typeof val === "bigint") return Number(val);
  if (typeof val === "number") return val;
  return 0;
}

function safeString(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val);
}

function optVal<T>(opt: [T] | [] | null | undefined): T | undefined {
  if (Array.isArray(opt) && opt.length > 0) return opt[0];
  return undefined;
}

// ── Vendors ──────────────────────────────────────────────────────────────────

export async function getVendors(actor: Actor): Promise<Vendor[]> {
  const result = await actor.listVendors();
  return (result || []).map(mapVendor);
}

export async function getVendor(
  actor: Actor,
  id: string,
): Promise<Vendor | null> {
  const result = await actor.getVendor(id);
  if (!result || (Array.isArray(result) && result.length === 0)) return null;
  const val = Array.isArray(result) ? result[0] : result;
  return mapVendor(val);
}

export async function createVendor(
  actor: Actor,
  input: VendorFormInput,
): Promise<Vendor> {
  // Backend: createVendor(name, company, contactName, email, phone, specialty, rateMin, rateMax, notes)
  // Form: input.name = contact person name, input.company = company/vendor name
  const vendorName = input.company?.trim() || input.name;
  const result = await actor.createVendor(
    vendorName,
    input.company ?? "",
    input.name,
    input.email,
    input.phone ?? "",
    input.specialty ?? "",
    0,
    0,
    input.notes ?? "",
  );
  return mapVendor(result);
}

export async function updateVendor(
  actor: Actor,
  id: string,
  input: Partial<VendorFormInput>,
): Promise<Vendor> {
  const result = await actor.updateVendor(id, input);
  return mapVendor(result);
}

export async function deleteVendor(actor: Actor, id: string): Promise<void> {
  await actor.deleteVendor(id);
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function getClients(actor: Actor): Promise<Client[]> {
  const result = await actor.listClients();
  return (result || []).map(mapClient);
}

export async function getClient(
  actor: Actor,
  id: string,
): Promise<Client | null> {
  const result = await actor.getClient(id);
  if (!result || (Array.isArray(result) && result.length === 0)) return null;
  const val = Array.isArray(result) ? result[0] : result;
  return mapClient(val);
}

export async function createClient(
  actor: Actor,
  input: ClientFormInput,
): Promise<Client> {
  // Backend: createClient(name, company, hiringManager, email, phone, budget, timeline, notes)
  // Form: input.name = hiring manager name, input.company = company name
  const clientName = input.company?.trim() || input.name;
  const result = await actor.createClient(
    clientName,
    input.company ?? "",
    input.name,
    input.email,
    input.phone ?? "",
    0,
    "",
    input.notes ?? "",
  );
  return mapClient(result);
}

export async function updateClient(
  actor: Actor,
  id: string,
  input: Partial<ClientFormInput>,
): Promise<Client> {
  const result = await actor.updateClient(id, input);
  return mapClient(result);
}

export async function deleteClient(actor: Actor, id: string): Promise<void> {
  await actor.deleteClient(id);
}

// ── Recruiters ────────────────────────────────────────────────────────────────

export async function getRecruiters(actor: Actor): Promise<Recruiter[]> {
  const result = await actor.listRecruiters();
  return (result || []).map(mapRecruiter);
}

export async function getRecruiter(
  actor: Actor,
  id: string,
): Promise<Recruiter | null> {
  const result = await actor.getRecruiter(id);
  if (!result || (Array.isArray(result) && result.length === 0)) return null;
  const val = Array.isArray(result) ? result[0] : result;
  return mapRecruiter(val);
}

export async function createRecruiter(
  actor: Actor,
  input: RecruiterFormInput,
): Promise<Recruiter> {
  const result = await actor.createRecruiter(
    input.name,
    input.email,
    input.phone ?? "",
  );
  return mapRecruiter(result);
}

export async function updateRecruiter(
  actor: Actor,
  id: string,
  input: Partial<RecruiterFormInput>,
): Promise<Recruiter> {
  const result = await actor.updateRecruiter(id, input);
  return mapRecruiter(result);
}

export async function deleteRecruiter(actor: Actor, id: string): Promise<void> {
  await actor.deleteRecruiter(id);
}

// ── Candidates ────────────────────────────────────────────────────────────────

export async function getCandidates(actor: Actor): Promise<Candidate[]> {
  const result = await actor.listCandidates();
  return (result || []).map(mapCandidate);
}

export async function getCandidate(
  actor: Actor,
  id: string,
): Promise<Candidate | null> {
  const result = await actor.getCandidate(id);
  if (!result || (Array.isArray(result) && result.length === 0)) return null;
  const val = Array.isArray(result) ? result[0] : result;
  return mapCandidate(val);
}

export async function createCandidate(
  actor: Actor,
  input: CandidateFormInput,
): Promise<Candidate> {
  const result = await actor.createCandidate(input);
  return mapCandidate(result);
}

export async function updateCandidate(
  actor: Actor,
  id: string,
  input: Partial<CandidateFormInput>,
): Promise<Candidate> {
  const result = await actor.updateCandidate(id, input);
  return mapCandidate(result);
}

export async function deleteCandidate(actor: Actor, id: string): Promise<void> {
  await actor.deleteCandidate(id);
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

export async function getPipelineStages(
  actor: Actor,
): Promise<PipelineStage[]> {
  const result = await actor.getPipelineStages();
  return (result || []).map(mapPipelineStage);
}

export async function updateEntityStage(
  actor: Actor,
  entityId: string,
  entityType: string,
  newStage: string,
): Promise<void> {
  await actor.updateEntityStage(entityId, entityType, newStage);
}

// ── Activities ────────────────────────────────────────────────────────────────

export async function listActivities(
  actor: Actor,
  entityId: string,
): Promise<Activity[]> {
  const result = await actor.getActivitiesForEntity(entityId);
  return (result || []).map(mapActivity);
}

export async function getAllActivities(actor: Actor): Promise<Activity[]> {
  const result = await actor.getAllActivities();
  return (result || []).map(mapActivity);
}

export async function logActivity(
  actor: Actor,
  input: ActivityFormInput,
): Promise<Activity> {
  const result = await actor.logActivity(input);
  return mapActivity(result);
}

// ── Follow-Ups ────────────────────────────────────────────────────────────────

export async function listFollowUps(actor: Actor): Promise<FollowUp[]> {
  const result = await actor.listFollowUps();
  return (result || []).map(mapFollowUp);
}

export async function listPendingFollowUps(actor: Actor): Promise<FollowUp[]> {
  const result = await actor.listPendingFollowUps();
  return (result || []).map(mapFollowUp);
}

export async function updateFollowUpStatus(
  actor: Actor,
  id: string,
  status: FollowUpStatus,
  approvedBy?: string,
  snoozedUntil?: number,
): Promise<void> {
  await actor.updateFollowUpStatus(
    id,
    status,
    approvedBy ? [approvedBy] : [],
    snoozedUntil ? [BigInt(snoozedUntil)] : [],
  );
}

export async function createFollowUp(
  actor: Actor,
  input: FollowUpFormInput,
): Promise<FollowUp> {
  const result = await actor.createFollowUp(input);
  return mapFollowUp(result);
}

export async function runFollowUpEngine(actor: Actor): Promise<void> {
  await actor.runFollowUpEngine();
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export async function getJobs(actor: Actor): Promise<Job[]> {
  const result = await actor.listJobs();
  return (result || []).map(mapJob);
}

export async function getJobsForClient(
  actor: Actor,
  clientId: string,
): Promise<Job[]> {
  const result = await actor.listJobsForClient(clientId);
  return (result || []).map(mapJob);
}

export async function createJob(
  actor: Actor,
  input: JobFormInput,
): Promise<Job> {
  const result = await actor.createJob(input);
  return mapJob(result);
}

export async function updateJob(
  actor: Actor,
  id: string,
  input: Partial<JobFormInput>,
): Promise<Job> {
  const result = await actor.updateJob(id, input);
  return mapJob(result);
}

// ── Submissions ───────────────────────────────────────────────────────────────

export async function getSubmissions(actor: Actor): Promise<Submission[]> {
  const result = await actor.listSubmissions();
  return (result || []).map(mapSubmission);
}

export async function getSubmissionsForCandidate(
  actor: Actor,
  candidateId: string,
): Promise<Submission[]> {
  const result = await actor.listSubmissionsForCandidate(candidateId);
  return (result || []).map(mapSubmission);
}

export async function getSubmissionsForJob(
  actor: Actor,
  jobId: string,
): Promise<Submission[]> {
  const result = await actor.listSubmissionsForJob(jobId);
  return (result || []).map(mapSubmission);
}

export async function createSubmission(
  actor: Actor,
  input: SubmissionFormInput,
): Promise<Submission> {
  const result = await actor.createSubmission(input);
  return mapSubmission(result);
}

export async function updateSubmission(
  actor: Actor,
  id: string,
  status: SubmissionStatus,
): Promise<Submission> {
  const result = await actor.updateSubmission(id, { status });
  return mapSubmission(result);
}

// ── Approvals ─────────────────────────────────────────────────────────────────

export async function listPendingApprovals(
  actor: Actor,
): Promise<ApprovalItem[]> {
  const result = await actor.listPendingApprovals();
  return (result || []).map(mapApprovalItem);
}

export async function listApprovalHistory(
  actor: Actor,
): Promise<ApprovalItem[]> {
  const result = await actor.listApprovalHistory();
  return (result || []).map(mapApprovalItem);
}

export async function approveItem(
  actor: Actor,
  id: string,
  approvedBy: string,
): Promise<void> {
  await actor.approveItem(id, approvedBy);
}

export async function rejectItem(
  actor: Actor,
  id: string,
  rejectedBy: string,
  notes?: string,
): Promise<void> {
  await actor.rejectItem(id, rejectedBy, notes ? [notes] : []);
}

export async function snoozeItem(
  actor: Actor,
  id: string,
  snoozedUntil: number,
): Promise<void> {
  await actor.snoozeItem(id, BigInt(snoozedUntil));
}

export async function createApprovalItem(
  actor: Actor,
  input: ApprovalFormInput,
): Promise<ApprovalItem> {
  const result = await actor.createApprovalItem(input);
  return mapApprovalItem(result);
}

export async function updateApprovalItem(
  actor: Actor,
  id: string,
  status: ApprovalStatus,
): Promise<ApprovalItem> {
  const result = await actor.updateApprovalItem(id, { status });
  return mapApprovalItem(result);
}

// ── Recruiter Metrics ─────────────────────────────────────────────────────────

export async function logRecruiterMetrics(
  actor: Actor,
  input: RecruiterMetricsFormInput,
): Promise<void> {
  await actor.logRecruiterMetrics(input);
}

export async function getRecruiterMetrics(
  actor: Actor,
  recruiterId: string,
  date: string,
): Promise<RecruiterMetrics | null> {
  const result = await actor.getRecruiterMetrics(recruiterId, date);
  if (!result || (Array.isArray(result) && result.length === 0)) return null;
  const val = Array.isArray(result) ? result[0] : result;
  return mapRecruiterMetrics(val);
}

export async function getRecruiterMetricsHistory(
  actor: Actor,
  recruiterId: string,
): Promise<RecruiterMetrics[]> {
  const result = await actor.getRecruiterMetricsHistory(recruiterId);
  return (result || []).map(mapRecruiterMetrics);
}

// ── Vendor Metrics ────────────────────────────────────────────────────────────

export async function logVendorMetrics(
  actor: Actor,
  input: VendorMetricsFormInput,
): Promise<void> {
  await actor.logVendorMetrics(input);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getPulseDashboard(actor: Actor): Promise<PulseDashboard> {
  const result = await actor.getPulseDashboard();
  return mapPulseDashboard(result);
}

export async function getMorningBriefing(
  actor: Actor,
): Promise<MorningBriefing> {
  const result = await actor.getMorningBriefing();
  return mapMorningBriefing(result);
}

export async function seedSampleData(actor: Actor): Promise<void> {
  await actor.seedSampleData();
}

// ── Bench ──────────────────────────────────────────────────────────────────────

export async function getBenchRecords(
  actor: Actor,
  filters?: { vendor?: string; role?: string; skill?: string },
): Promise<BenchRecord[]> {
  const result = await actor.listBench(
    filters?.vendor ?? null,
    filters?.role ?? null,
    filters?.skill ?? null,
  );
  return (result || []).map(mapBenchRecord);
}

export async function uploadBenchRecords(
  actor: Actor,
  records: BenchRecordInput[],
): Promise<number> {
  const result = await actor.uploadBenchRecords(records);
  if (result.__kind__ === "ok") return Number(result.ok);
  throw new Error(result.err);
}

export async function matchBench(
  actor: Actor,
  jobId: string,
): Promise<BenchMatch[]> {
  const result = await actor.matchBench(jobId);
  return (result || []).map(mapBenchMatch);
}

export async function deleteBenchRecord(
  actor: Actor,
  id: number,
): Promise<boolean> {
  const result = await actor.deleteBenchRecord(BigInt(id));
  if (result.__kind__ === "ok") return result.ok;
  throw new Error(result.err);
}

// ── Mappers ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVendor(r: any): Vendor {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: optVal(r.phone),
    company: optVal(r.company),
    linkedinUrl: optVal(r.linkedinUrl ?? r.linkedin_url),
    currentStage: safeString(r.currentStage ?? r.current_stage ?? "Discovery"),
    healthScore: safeNumber(r.healthScore ?? r.health_score ?? 80),
    status: safeString(r.status ?? "active"),
    specialty: optVal(r.specialty),
    notes: optVal(r.notes),
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
    updatedAt: safeNumber(r.updatedAt ?? r.updated_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClient(r: any): Client {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: optVal(r.phone),
    company: optVal(r.company),
    linkedinUrl: optVal(r.linkedinUrl ?? r.linkedin_url),
    currentStage: safeString(r.currentStage ?? r.current_stage ?? "Prospect"),
    healthScore: safeNumber(r.healthScore ?? r.health_score ?? 80),
    status: safeString(r.status ?? "active"),
    industry: optVal(r.industry),
    website: optVal(r.website),
    notes: optVal(r.notes),
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
    updatedAt: safeNumber(r.updatedAt ?? r.updated_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRecruiter(r: any): Recruiter {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: optVal(r.phone),
    currentStage: safeString(r.currentStage ?? r.current_stage ?? "Active"),
    healthScore: safeNumber(r.healthScore ?? r.health_score ?? 80),
    status: safeString(r.status ?? "active"),
    title: optVal(r.title),
    notes: optVal(r.notes),
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
    updatedAt: safeNumber(r.updatedAt ?? r.updated_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCandidate(r: any): Candidate {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: optVal(r.phone),
    linkedinUrl: optVal(r.linkedinUrl ?? r.linkedin_url),
    currentStage: safeString(r.currentStage ?? r.current_stage ?? "Applied"),
    healthScore: safeNumber(r.healthScore ?? r.health_score ?? 80),
    status: safeString(r.status ?? "active"),
    title: optVal(r.title),
    skills: optVal(r.skills),
    salaryMin: r.salaryMin != null ? safeNumber(r.salaryMin) : undefined,
    salaryMax: r.salaryMax != null ? safeNumber(r.salaryMax) : undefined,
    notes: optVal(r.notes),
    assignedRecruiter: optVal(r.assignedRecruiter ?? r.assigned_recruiter),
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
    updatedAt: safeNumber(r.updatedAt ?? r.updated_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapActivity(r: any): Activity {
  return {
    id: safeString(r.id),
    entityId: safeString(r.entityId ?? r.entity_id),
    activityType: (r.activityType ??
      r.activity_type ??
      "note") as Activity["activityType"],
    direction: optVal(r.direction),
    notes: optVal(r.notes),
    createdBy: optVal(r.createdBy ?? r.created_by),
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapFollowUp(r: any): FollowUp {
  return {
    id: safeString(r.id),
    entityId: safeString(r.entityId ?? r.entity_id),
    entityName: optVal(r.entityName ?? r.entity_name),
    entityType: optVal(r.entityType ?? r.entity_type),
    triggerReason: safeString(r.triggerReason ?? r.trigger_reason ?? ""),
    suggestedAction: safeString(r.suggestedAction ?? r.suggested_action ?? ""),
    suggestedMessage: optVal(r.suggestedMessage ?? r.suggested_message),
    aiConfidence:
      r.aiConfidence != null ? safeNumber(r.aiConfidence) : undefined,
    status: (r.status ?? "pending") as FollowUpStatus,
    approvedBy: optVal(r.approvedBy ?? r.approved_by),
    approvedAt: r.approvedAt ? safeNumber(r.approvedAt) : undefined,
    sentAt: r.sentAt ? safeNumber(r.sentAt) : undefined,
    snoozedUntil: r.snoozedUntil ? safeNumber(r.snoozedUntil) : undefined,
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapJob(r: any): Job {
  return {
    id: safeString(r.id),
    clientId: safeString(r.clientId ?? r.client_id),
    clientName: optVal(r.clientName ?? r.client_name),
    title: safeString(r.title),
    requirements: optVal(r.requirements),
    rateMin: r.rateMin != null ? safeNumber(r.rateMin) : undefined,
    rateMax: r.rateMax != null ? safeNumber(r.rateMax) : undefined,
    location: optVal(r.location),
    status: (r.status ?? "open") as Job["status"],
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
    filledAt: r.filledAt ? safeNumber(r.filledAt) : undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSubmission(r: any): Submission {
  return {
    id: safeString(r.id),
    candidateId: safeString(r.candidateId ?? r.candidate_id),
    candidateName: optVal(r.candidateName ?? r.candidate_name),
    jobId: safeString(r.jobId ?? r.job_id),
    jobTitle: optVal(r.jobTitle ?? r.job_title),
    vendorId: optVal(r.vendorId ?? r.vendor_id),
    submittedBy: optVal(r.submittedBy ?? r.submitted_by),
    rateProposed:
      r.rateProposed != null ? safeNumber(r.rateProposed) : undefined,
    status: (r.status ?? "pending") as SubmissionStatus,
    submittedAt: safeNumber(r.submittedAt ?? r.submitted_at ?? Date.now()),
    approvedBy: optVal(r.approvedBy ?? r.approved_by),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPipelineStage(r: any): PipelineStage {
  return {
    id: safeString(r.id),
    entityType: (r.entityType ??
      r.entity_type ??
      "vendor") as PipelineStage["entityType"],
    stageName: safeString(r.stageName ?? r.stage_name),
    stageOrder: safeNumber(r.stageOrder ?? r.stage_order ?? 0),
    requiresApproval: Boolean(
      r.requiresApproval ?? r.requires_approval ?? false,
    ),
    autoTriggerFollowup: Boolean(
      r.autoTriggerFollowup ?? r.auto_trigger_followup ?? false,
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRecruiterMetrics(r: any): RecruiterMetrics {
  return {
    id: safeString(r.id),
    recruiterId: safeString(r.recruiterId ?? r.recruiter_id),
    date: safeString(r.date),
    screenTimeActive: safeNumber(
      r.screenTimeActive ?? r.screen_time_active ?? 0,
    ),
    screenTimeIdle: safeNumber(r.screenTimeIdle ?? r.screen_time_idle ?? 0),
    callsMade: safeNumber(r.callsMade ?? r.calls_made ?? 0),
    emailsSent: safeNumber(r.emailsSent ?? r.emails_sent ?? 0),
    submissions: safeNumber(r.submissions ?? 0),
    interviewsScheduled: safeNumber(
      r.interviewsScheduled ?? r.interviews_scheduled ?? 0,
    ),
    tasksCompleted: safeNumber(r.tasksCompleted ?? r.tasks_completed ?? 0),
    aiProductivityScore: safeNumber(
      r.aiProductivityScore ?? r.ai_productivity_score ?? 0,
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApprovalItem(r: any): ApprovalItem {
  return {
    id: safeString(r.id),
    entityId: safeString(r.entityId ?? r.entity_id),
    entityName: optVal(r.entityName ?? r.entity_name),
    entityType: optVal(r.entityType ?? r.entity_type),
    itemType: safeString(r.itemType ?? r.item_type ?? ""),
    description: safeString(r.description ?? ""),
    details: optVal(r.details),
    requestedBy: optVal(r.requestedBy ?? r.requested_by),
    status: (r.status ?? "pending") as ApprovalStatus,
    approvedBy: optVal(r.approvedBy ?? r.approved_by),
    approvedAt: r.approvedAt ? safeNumber(r.approvedAt) : undefined,
    rejectedBy: optVal(r.rejectedBy ?? r.rejected_by),
    rejectedAt: r.rejectedAt ? safeNumber(r.rejectedAt) : undefined,
    rejectionNotes: optVal(r.rejectionNotes ?? r.rejection_notes),
    snoozedUntil: r.snoozedUntil ? safeNumber(r.snoozedUntil) : undefined,
    createdAt: safeNumber(r.createdAt ?? r.created_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPulseDashboard(r: any): PulseDashboard {
  if (!r) {
    return {
      entries: [],
      totalVendors: 0,
      totalClients: 0,
      totalRecruiters: 0,
      totalCandidates: 0,
      pendingApprovals: 0,
      pendingFollowUps: 0,
      lastUpdated: Date.now(),
    };
  }
  return {
    entries: (r.entries || []).map(mapPulseEntry),
    totalVendors: safeNumber(r.totalVendors ?? r.total_vendors ?? 0),
    totalClients: safeNumber(r.totalClients ?? r.total_clients ?? 0),
    totalRecruiters: safeNumber(r.totalRecruiters ?? r.total_recruiters ?? 0),
    totalCandidates: safeNumber(r.totalCandidates ?? r.total_candidates ?? 0),
    pendingApprovals: safeNumber(
      r.pendingApprovals ?? r.pending_approvals ?? 0,
    ),
    pendingFollowUps: safeNumber(
      r.pendingFollowUps ?? r.pending_follow_ups ?? 0,
    ),
    lastUpdated: safeNumber(r.lastUpdated ?? r.last_updated ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPulseEntry(r: any) {
  return {
    entityId: safeString(r.entityId ?? r.entity_id),
    entityType: (r.entityType ?? r.entity_type ?? "vendor") as
      | "vendor"
      | "client"
      | "recruiter"
      | "candidate",
    name: safeString(r.name),
    company: optVal(r.company),
    currentStage: safeString(r.currentStage ?? r.current_stage ?? ""),
    healthScore: safeNumber(r.healthScore ?? r.health_score ?? 80),
    healthStatus: (r.healthStatus ?? r.health_status ?? "green") as
      | "green"
      | "yellow"
      | "red",
    lastActivityAt: r.lastActivityAt ? safeNumber(r.lastActivityAt) : undefined,
    actionsNeeded: r.actionsNeeded ?? r.actions_needed ?? [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMorningBriefing(r: any): MorningBriefing {
  if (!r) {
    return {
      date: new Date().toDateString(),
      priorities: [],
      recruiterActivity: [],
      aiSuggestions: [],
      generatedAt: Date.now(),
    };
  }
  return {
    date: safeString(r.date),
    priorities: r.priorities || [],
    recruiterActivity: r.recruiterActivity ?? r.recruiter_activity ?? [],
    aiSuggestions: r.aiSuggestions ?? r.ai_suggestions ?? [],
    generatedAt: safeNumber(r.generatedAt ?? r.generated_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBenchRecord(r: any): BenchRecord {
  return {
    id: Number(r.id ?? 0),
    vendorName: safeString(r.vendorName ?? r.vendor_name),
    candidateName: safeString(r.candidateName ?? r.candidate_name),
    role: safeString(r.role),
    experience: safeString(r.experience),
    skill: safeString(r.skill),
    rate: typeof r.rate === "number" ? r.rate : Number(r.rate ?? 0),
    importedAt: safeNumber(r.importedAt ?? r.imported_at ?? Date.now()),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBenchMatch(r: any): BenchMatch {
  return {
    ...mapBenchRecord(r),
    matchScore:
      typeof r.matchScore === "number"
        ? r.matchScore
        : Number(r.matchScore ?? 0),
  };
}
