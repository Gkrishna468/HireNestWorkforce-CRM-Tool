/**
 * API layer — all entity CRUD goes to Supabase REST API.
 * Non-entity calls (pipeline stages, follow-ups, metrics, pulse dashboard, etc.)
 * still use the Motoko actor as a fallback/stub.
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
import {
  supabaseBatchInsert,
  supabaseDelete,
  supabaseInsert,
  supabaseSelect,
  supabaseUpdate,
} from "./supabase";

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

// ── Row → domain mappers ─────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapVendorRow(r: any): Vendor {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: r.phone ?? undefined,
    company: r.company ?? undefined,
    linkedinUrl: r.linkedin_url ?? r.linkedinUrl ?? undefined,
    currentStage: safeString(
      r.stage ?? r.current_stage ?? r.currentStage ?? "Discovery",
    ),
    healthScore: safeNumber(r.health_score ?? r.healthScore ?? 50),
    status: safeString(r.status ?? "active"),
    specialty: r.specialty ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    updatedAt: r.updated_at ? new Date(r.updated_at).getTime() : Date.now(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClientRow(r: any): Client {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: r.phone ?? undefined,
    company: r.company ?? undefined,
    linkedinUrl: r.linkedin_url ?? r.linkedinUrl ?? undefined,
    currentStage: safeString(
      r.stage ?? r.current_stage ?? r.currentStage ?? "Prospect",
    ),
    healthScore: safeNumber(r.health_score ?? r.healthScore ?? 50),
    status: safeString(r.status ?? "active"),
    industry: r.industry ?? undefined,
    website: r.website ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    updatedAt: r.updated_at ? new Date(r.updated_at).getTime() : Date.now(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRecruiterRow(r: any): Recruiter {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: r.phone ?? undefined,
    currentStage: safeString(
      r.stage ?? r.current_stage ?? r.currentStage ?? "Active",
    ),
    healthScore: safeNumber(r.health_score ?? r.healthScore ?? 50),
    status: safeString(r.status ?? "active"),
    title: r.title ?? undefined,
    notes: r.notes ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    updatedAt: r.updated_at ? new Date(r.updated_at).getTime() : Date.now(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapCandidateRow(r: any): Candidate {
  return {
    id: safeString(r.id),
    name: safeString(r.name),
    email: safeString(r.email),
    phone: r.phone ?? undefined,
    linkedinUrl: r.linkedin_url ?? r.linkedinUrl ?? undefined,
    currentStage: safeString(
      r.stage ?? r.current_stage ?? r.currentStage ?? "Applied",
    ),
    healthScore: safeNumber(r.health_score ?? r.healthScore ?? 50),
    status: safeString(r.status ?? "active"),
    title: r.role ?? r.title ?? undefined,
    skills: r.skills ?? undefined,
    salaryMin: r.salary_min != null ? safeNumber(r.salary_min) : undefined,
    salaryMax: r.salary_max != null ? safeNumber(r.salary_max) : undefined,
    notes: r.notes ?? r.experience ?? undefined,
    assignedRecruiter: r.assigned_recruiter ?? r.assignedRecruiter ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    updatedAt: r.updated_at ? new Date(r.updated_at).getTime() : Date.now(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapBenchRow(r: any, index: number): BenchRecord {
  const uuid = safeString(r.id);
  const numericId = index + 1;
  _benchUUIDMap.set(numericId, uuid);
  return {
    id: numericId,
    vendorName: safeString(r.vendor_name ?? r.vendorName),
    candidateName: safeString(r.candidate_name ?? r.candidateName),
    role: safeString(r.role),
    experience: safeString(r.experience),
    skill: safeString(r.skills ?? r.skill),
    rate: Number(r.rate ?? 0),
    importedAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapActivityRow(r: any): Activity {
  return {
    id: safeString(r.id),
    entityId: safeString(r.entity_id ?? r.entityId),
    activityType: (r.activity_type ??
      r.activityType ??
      "note") as Activity["activityType"],
    direction: r.direction ?? undefined,
    notes: r.description ?? r.notes ?? undefined,
    createdBy: r.created_by ?? r.createdBy ?? undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApprovalRow(r: any): ApprovalItem {
  return {
    id: safeString(r.id),
    entityId: safeString(r.entity_id ?? r.entityId),
    entityName: r.entity_name ?? r.entityName ?? undefined,
    entityType: r.entity_type ?? r.entityType ?? undefined,
    itemType: safeString(r.action ?? r.item_type ?? r.itemType ?? ""),
    description: safeString(r.notes ?? r.description ?? ""),
    details: r.details ?? undefined,
    requestedBy: r.requested_by ?? r.requestedBy ?? undefined,
    status: (r.status ?? "pending") as ApprovalStatus,
    approvedBy: r.reviewed_by ?? r.approved_by ?? r.approvedBy ?? undefined,
    approvedAt:
      r.updated_at && r.status === "approved"
        ? new Date(r.updated_at).getTime()
        : undefined,
    rejectedBy:
      r.status === "rejected" ? (r.reviewed_by ?? undefined) : undefined,
    rejectedAt:
      r.updated_at && r.status === "rejected"
        ? new Date(r.updated_at).getTime()
        : undefined,
    rejectionNotes: undefined,
    snoozedUntil: undefined,
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapJobRow(r: any): Job {
  // Parse required_skills: stored as comma-separated string, returned as string[]
  let requiredSkills: string | undefined = undefined;
  const rawSkills = r.required_skills ?? r.requiredSkills;
  if (rawSkills) {
    if (Array.isArray(rawSkills)) {
      requiredSkills = rawSkills.join(", ");
    } else {
      requiredSkills = safeString(rawSkills);
    }
  }

  return {
    id: safeString(r.id),
    clientId: safeString(r.client_id ?? r.clientId ?? ""),
    clientName: r.client_name ?? r.clientName ?? undefined,
    title: safeString(r.title),
    requirements: r.description ?? r.requirements ?? undefined,
    rateMin: r.rate_min != null ? safeNumber(r.rate_min) : undefined,
    rateMax: r.rate_max != null ? safeNumber(r.rate_max) : undefined,
    location: r.location ?? undefined,
    status: (r.status ?? "open") as Job["status"],
    createdAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    filledAt: r.filled_at ? new Date(r.filled_at).getTime() : undefined,
    // Structured JD fields
    roleSummary: r.role_summary ?? r.roleSummary ?? undefined,
    responsibilities: r.responsibilities ?? undefined,
    requiredSkills,
    experience: r.experience ?? undefined,
    rateType: r.rate_type ?? r.rateType ?? undefined,
    rateAmount: r.rate_amount != null ? safeString(r.rate_amount) : undefined,
    rateCurrency: r.rate_currency ?? r.rateCurrency ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSubmissionRow(r: any): Submission {
  return {
    id: safeString(r.id),
    candidateId: safeString(r.candidate_id ?? r.candidateId ?? ""),
    candidateName: r.candidate_name ?? r.candidateName ?? undefined,
    jobId: safeString(r.job_id ?? r.jobId ?? ""),
    jobTitle: r.job_title ?? r.jobTitle ?? undefined,
    vendorId: r.vendor_id ?? r.vendorId ?? undefined,
    submittedBy: r.submitted_by ?? r.submittedBy ?? undefined,
    rateProposed:
      r.rate_proposed != null ? safeNumber(r.rate_proposed) : undefined,
    status: (r.status ?? "pending") as SubmissionStatus,
    submittedAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    approvedBy: r.approved_by ?? r.approvedBy ?? undefined,
  };
}

// ── Vendors ──────────────────────────────────────────────────────────────────

export async function getVendors(_actor: Actor): Promise<Vendor[]> {
  const rows = await supabaseSelect("vendors", undefined, {
    order: "created_at.desc",
  });
  return rows.map(mapVendorRow);
}

export async function getVendor(
  _actor: Actor,
  id: string,
): Promise<Vendor | null> {
  const rows = await supabaseSelect("vendors", { id });
  if (!rows.length) return null;
  return mapVendorRow(rows[0]);
}

export async function createVendor(
  _actor: Actor,
  input: VendorFormInput,
): Promise<Vendor> {
  const row = await supabaseInsert<Record<string, unknown>>("vendors", {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    company: input.company ?? null,
    notes: input.notes ?? null,
    specialty: input.specialty ?? null,
    status: "active",
    stage: "Discovery",
    health_score: 50,
  });
  return mapVendorRow(row);
}

export async function updateVendor(
  _actor: Actor,
  id: string,
  input: Partial<VendorFormInput>,
): Promise<Vendor> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.company !== undefined) data.company = input.company;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.specialty !== undefined) data.specialty = input.specialty;
  const row = await supabaseUpdate<Record<string, unknown>>(
    "vendors",
    id,
    data,
  );
  return mapVendorRow(row);
}

export async function deleteVendor(_actor: Actor, id: string): Promise<void> {
  await supabaseDelete("vendors", id);
}

// ── Clients ───────────────────────────────────────────────────────────────────

export async function getClients(_actor: Actor): Promise<Client[]> {
  const rows = await supabaseSelect("clients", undefined, {
    order: "created_at.desc",
  });
  return rows.map(mapClientRow);
}

export async function getClient(
  _actor: Actor,
  id: string,
): Promise<Client | null> {
  const rows = await supabaseSelect("clients", { id });
  if (!rows.length) return null;
  return mapClientRow(rows[0]);
}

export async function createClient(
  _actor: Actor,
  input: ClientFormInput,
): Promise<Client> {
  const row = await supabaseInsert<Record<string, unknown>>("clients", {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    company: input.company ?? null,
    notes: input.notes ?? null,
    industry: input.industry ?? null,
    status: "active",
    stage: "Prospect",
    health_score: 50,
  });
  return mapClientRow(row);
}

export async function updateClient(
  _actor: Actor,
  id: string,
  input: Partial<ClientFormInput>,
): Promise<Client> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.company !== undefined) data.company = input.company;
  if (input.notes !== undefined) data.notes = input.notes;
  if (input.industry !== undefined) data.industry = input.industry;
  const row = await supabaseUpdate<Record<string, unknown>>(
    "clients",
    id,
    data,
  );
  return mapClientRow(row);
}

export async function deleteClient(_actor: Actor, id: string): Promise<void> {
  await supabaseDelete("clients", id);
}

// ── Recruiters ────────────────────────────────────────────────────────────────

export async function getRecruiters(_actor: Actor): Promise<Recruiter[]> {
  const rows = await supabaseSelect("recruiters", undefined, {
    order: "created_at.desc",
  });
  return rows.map(mapRecruiterRow);
}

export async function getRecruiter(
  _actor: Actor,
  id: string,
): Promise<Recruiter | null> {
  const rows = await supabaseSelect("recruiters", { id });
  if (!rows.length) return null;
  return mapRecruiterRow(rows[0]);
}

export async function createRecruiter(
  _actor: Actor,
  input: RecruiterFormInput,
): Promise<Recruiter> {
  const row = await supabaseInsert<Record<string, unknown>>("recruiters", {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    notes: input.notes ?? null,
    status: "active",
    stage: "Active",
    health_score: 50,
  });
  return mapRecruiterRow(row);
}

export async function updateRecruiter(
  _actor: Actor,
  id: string,
  input: Partial<RecruiterFormInput>,
): Promise<Recruiter> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.notes !== undefined) data.notes = input.notes;
  const row = await supabaseUpdate<Record<string, unknown>>(
    "recruiters",
    id,
    data,
  );
  return mapRecruiterRow(row);
}

export async function deleteRecruiter(
  _actor: Actor,
  id: string,
): Promise<void> {
  await supabaseDelete("recruiters", id);
}

// ── Candidates ────────────────────────────────────────────────────────────────

export async function getCandidates(_actor: Actor): Promise<Candidate[]> {
  const rows = await supabaseSelect("candidates", undefined, {
    order: "created_at.desc",
  });
  return rows.map(mapCandidateRow);
}

export async function getCandidate(
  _actor: Actor,
  id: string,
): Promise<Candidate | null> {
  const rows = await supabaseSelect("candidates", { id });
  if (!rows.length) return null;
  return mapCandidateRow(rows[0]);
}

export async function createCandidate(
  _actor: Actor,
  input: CandidateFormInput,
): Promise<Candidate> {
  const row = await supabaseInsert<Record<string, unknown>>("candidates", {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    role: input.title ?? null,
    skills: input.skills ?? null,
    experience: input.notes ?? null,
    notes: input.notes ?? null,
    status: "active",
    stage: "Applied",
    health_score: 50,
  });
  return mapCandidateRow(row);
}

export async function updateCandidate(
  _actor: Actor,
  id: string,
  input: Partial<CandidateFormInput>,
): Promise<Candidate> {
  const data: Record<string, unknown> = {};
  if (input.name !== undefined) data.name = input.name;
  if (input.email !== undefined) data.email = input.email;
  if (input.phone !== undefined) data.phone = input.phone;
  if (input.title !== undefined) data.role = input.title;
  if (input.skills !== undefined) data.skills = input.skills;
  if (input.notes !== undefined) data.notes = input.notes;
  const row = await supabaseUpdate<Record<string, unknown>>(
    "candidates",
    id,
    data,
  );
  return mapCandidateRow(row);
}

export async function deleteCandidate(
  _actor: Actor,
  id: string,
): Promise<void> {
  await supabaseDelete("candidates", id);
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

export async function getPipelineStages(
  _actor: Actor,
): Promise<PipelineStage[]> {
  return [];
}

export async function updateEntityStage(
  _actor: Actor,
  entityId: string,
  entityType: string,
  newStage: string,
): Promise<void> {
  const tableMap: Record<string, string> = {
    vendor: "vendors",
    client: "clients",
    recruiter: "recruiters",
    candidate: "candidates",
  };
  const table = tableMap[entityType];
  if (!table) return;
  await supabaseUpdate(table, entityId, { stage: newStage });
}

// ── Activities ────────────────────────────────────────────────────────────────

export async function listActivities(
  _actor: Actor,
  entityId: string,
): Promise<Activity[]> {
  const rows = await supabaseSelect(
    "activities",
    { entity_id: entityId },
    {
      order: "created_at.desc",
      limit: 50,
    },
  );
  return rows.map(mapActivityRow);
}

export async function getAllActivities(_actor: Actor): Promise<Activity[]> {
  const rows = await supabaseSelect("activities", undefined, {
    order: "created_at.desc",
    limit: 100,
  });
  return rows.map(mapActivityRow);
}

export async function logActivity(
  _actor: Actor,
  input: ActivityFormInput,
): Promise<Activity> {
  const row = await supabaseInsert<Record<string, unknown>>("activities", {
    entity_id: input.entityId,
    action: input.activityType ?? "note",
    description: input.notes ?? null,
    created_by: input.createdBy ?? null,
  });
  return mapActivityRow(row);
}

// ── Follow-Ups ────────────────────────────────────────────────────────────────

export async function listFollowUps(_actor: Actor): Promise<FollowUp[]> {
  return [];
}

export async function listPendingFollowUps(_actor: Actor): Promise<FollowUp[]> {
  return [];
}

export async function updateFollowUpStatus(
  _actor: Actor,
  _id: string,
  _status: FollowUpStatus,
  _approvedBy?: string,
  _snoozedUntil?: number,
): Promise<void> {}

export async function createFollowUp(
  _actor: Actor,
  _input: FollowUpFormInput,
): Promise<FollowUp> {
  return {
    id: crypto.randomUUID(),
    entityId: _input.entityId ?? "",
    triggerReason: "",
    suggestedAction: "",
    status: "pending",
    createdAt: Date.now(),
  };
}

export async function runFollowUpEngine(_actor: Actor): Promise<void> {}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export async function getJobs(_actor: Actor): Promise<Job[]> {
  const rows = await supabaseSelect("jobs", undefined, {
    order: "created_at.desc",
  });
  return rows.map(mapJobRow);
}

export async function getJobsForClient(
  _actor: Actor,
  clientId: string,
): Promise<Job[]> {
  const rows = await supabaseSelect(
    "jobs",
    { client_id: clientId },
    {
      order: "created_at.desc",
    },
  );
  return rows.map(mapJobRow);
}

export async function createJob(
  _actor: Actor,
  input: JobFormInput,
): Promise<Job> {
  // Normalize requiredSkills: always store as comma-separated string
  const requiredSkills = Array.isArray(input.requiredSkills)
    ? (input.requiredSkills as string[]).join(", ")
    : (input.requiredSkills ?? null);

  const row = await supabaseInsert<Record<string, unknown>>("jobs", {
    title: input.title,
    client_id: input.clientId ?? null,
    description: input.requirements ?? null,
    rate: input.rateMax ?? null,
    location: input.location ?? null,
    status: "open",
    // Structured JD fields
    role_summary: input.roleSummary ?? null,
    responsibilities: input.responsibilities ?? null,
    required_skills: requiredSkills,
    experience: input.experience ?? null,
    rate_type: input.rateType ?? null,
    rate_amount: input.rateAmount ?? null,
    rate_currency: input.rateCurrency ?? null,
  });
  return mapJobRow(row);
}

export async function updateJob(
  _actor: Actor,
  id: string,
  input: Partial<JobFormInput>,
): Promise<Job> {
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.clientId !== undefined) data.client_id = input.clientId;
  if (input.requirements !== undefined) data.description = input.requirements;
  if (input.rateMax !== undefined) data.rate = input.rateMax;
  if (input.location !== undefined) data.location = input.location;
  // Structured JD fields
  if (input.roleSummary !== undefined) data.role_summary = input.roleSummary;
  if (input.responsibilities !== undefined)
    data.responsibilities = input.responsibilities;
  if (input.requiredSkills !== undefined) {
    data.required_skills = Array.isArray(input.requiredSkills)
      ? (input.requiredSkills as string[]).join(", ")
      : input.requiredSkills;
  }
  if (input.experience !== undefined) data.experience = input.experience;
  if (input.rateType !== undefined) data.rate_type = input.rateType;
  if (input.rateAmount !== undefined) data.rate_amount = input.rateAmount;
  if (input.rateCurrency !== undefined) data.rate_currency = input.rateCurrency;
  const row = await supabaseUpdate<Record<string, unknown>>("jobs", id, data);
  return mapJobRow(row);
}

export async function deleteJob(_actor: Actor, id: string): Promise<void> {
  await supabaseDelete("jobs", id);
}

export async function updateJobStatus(
  _actor: Actor,
  id: string,
  status: "open" | "filled" | "closed" | "on_hold",
): Promise<Job> {
  const row = await supabaseUpdate<Record<string, unknown>>("jobs", id, {
    status,
  });
  return mapJobRow(row);
}

// ── Submissions ───────────────────────────────────────────────────────────────

export async function getSubmissions(_actor: Actor): Promise<Submission[]> {
  const rows = await supabaseSelect("submissions", undefined, {
    order: "created_at.desc",
  });
  return rows.map(mapSubmissionRow);
}

export async function getSubmissionsForCandidate(
  _actor: Actor,
  candidateId: string,
): Promise<Submission[]> {
  const rows = await supabaseSelect("submissions", {
    candidate_id: candidateId,
  });
  return rows.map(mapSubmissionRow);
}

export async function getSubmissionsForJob(
  _actor: Actor,
  jobId: string,
): Promise<Submission[]> {
  const rows = await supabaseSelect("submissions", { job_id: jobId });
  return rows.map(mapSubmissionRow);
}

export async function createSubmission(
  _actor: Actor,
  input: SubmissionFormInput,
): Promise<Submission> {
  const row = await supabaseInsert<Record<string, unknown>>("submissions", {
    job_id: input.jobId ?? null,
    candidate_id: input.candidateId ?? null,
    status: "submitted",
  });
  return mapSubmissionRow(row);
}

export async function updateSubmission(
  _actor: Actor,
  id: string,
  status: SubmissionStatus,
): Promise<Submission> {
  const row = await supabaseUpdate<Record<string, unknown>>("submissions", id, {
    status,
  });
  return mapSubmissionRow(row);
}

// ── Approvals ─────────────────────────────────────────────────────────────────

export async function listPendingApprovals(
  _actor: Actor,
): Promise<ApprovalItem[]> {
  const rows = await supabaseSelect(
    "approvals",
    { status: "pending" },
    {
      order: "created_at.desc",
    },
  );
  return rows.map(mapApprovalRow);
}

export async function listApprovalHistory(
  _actor: Actor,
): Promise<ApprovalItem[]> {
  const rows = await supabaseSelect("approvals", undefined, {
    order: "created_at.desc",
    limit: 100,
  });
  return rows.map(mapApprovalRow);
}

export async function approveItem(
  _actor: Actor,
  id: string,
  approvedBy: string,
): Promise<void> {
  await supabaseUpdate("approvals", id, {
    status: "approved",
    reviewed_by: approvedBy,
  });
}

export async function rejectItem(
  _actor: Actor,
  id: string,
  rejectedBy: string,
  notes?: string,
): Promise<void> {
  await supabaseUpdate("approvals", id, {
    status: "rejected",
    reviewed_by: rejectedBy,
    notes: notes ?? null,
  });
}

export async function snoozeItem(
  _actor: Actor,
  id: string,
  _snoozedUntil: number,
): Promise<void> {
  await supabaseUpdate("approvals", id, { status: "snoozed" });
}

export async function createApprovalItem(
  _actor: Actor,
  input: ApprovalFormInput,
): Promise<ApprovalItem> {
  const row = await supabaseInsert<Record<string, unknown>>("approvals", {
    entity_id: input.entityId ?? null,
    entity_type: input.entityType ?? null,
    action: input.itemType ?? input.description ?? "approval",
    notes: input.details ?? input.description ?? null,
    requested_by: input.requestedBy ?? null,
    status: "pending",
  });
  return mapApprovalRow(row);
}

export async function updateApprovalItem(
  _actor: Actor,
  id: string,
  status: ApprovalStatus,
): Promise<ApprovalItem> {
  const row = await supabaseUpdate<Record<string, unknown>>("approvals", id, {
    status,
  });
  return mapApprovalRow(row);
}

// ── Recruiter Metrics ─────────────────────────────────────────────────────────

export async function logRecruiterMetrics(
  _actor: Actor,
  _input: RecruiterMetricsFormInput,
): Promise<void> {}

export async function getRecruiterMetrics(
  _actor: Actor,
  _recruiterId: string,
  _date: string,
): Promise<RecruiterMetrics | null> {
  return null;
}

export async function getRecruiterMetricsHistory(
  _actor: Actor,
  _recruiterId: string,
): Promise<RecruiterMetrics[]> {
  return [];
}

// ── Vendor Metrics ────────────────────────────────────────────────────────────

export async function logVendorMetrics(
  _actor: Actor,
  _input: VendorMetricsFormInput,
): Promise<void> {}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function getPulseDashboard(
  _actor: Actor,
): Promise<PulseDashboard> {
  try {
    const [vendors, clients, recruiters, candidates, approvals] =
      await Promise.allSettled([
        supabaseSelect("vendors", undefined, { limit: 200 }),
        supabaseSelect("clients", undefined, { limit: 200 }),
        supabaseSelect("recruiters", undefined, { limit: 200 }),
        supabaseSelect("candidates", undefined, { limit: 200 }),
        supabaseSelect("approvals", { status: "pending" }, { limit: 50 }),
      ]);

    const vs =
      vendors.status === "fulfilled" ? vendors.value.map(mapVendorRow) : [];
    const cs =
      clients.status === "fulfilled" ? clients.value.map(mapClientRow) : [];
    const rs =
      recruiters.status === "fulfilled"
        ? recruiters.value.map(mapRecruiterRow)
        : [];
    const cds =
      candidates.status === "fulfilled"
        ? candidates.value.map(mapCandidateRow)
        : [];
    const aps = approvals.status === "fulfilled" ? approvals.value : [];

    const entries = [
      ...vs.map((v) => ({
        entityId: v.id,
        entityType: "vendor" as const,
        name: v.name,
        company: v.company,
        currentStage: v.currentStage,
        healthScore: v.healthScore,
        healthStatus: (v.healthScore >= 70
          ? "green"
          : v.healthScore >= 40
            ? "yellow"
            : "red") as "green" | "yellow" | "red",
        lastActivityAt: v.updatedAt,
        actionsNeeded: [],
      })),
      ...cs.map((c) => ({
        entityId: c.id,
        entityType: "client" as const,
        name: c.name,
        company: c.company,
        currentStage: c.currentStage,
        healthScore: c.healthScore,
        healthStatus: (c.healthScore >= 70
          ? "green"
          : c.healthScore >= 40
            ? "yellow"
            : "red") as "green" | "yellow" | "red",
        lastActivityAt: c.updatedAt,
        actionsNeeded: [],
      })),
    ];

    return {
      entries,
      totalVendors: vs.length,
      totalClients: cs.length,
      totalRecruiters: rs.length,
      totalCandidates: cds.length,
      pendingApprovals: aps.length,
      pendingFollowUps: 0,
      lastUpdated: Date.now(),
    };
  } catch {
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
}

export async function getMorningBriefing(
  _actor: Actor,
): Promise<MorningBriefing> {
  return {
    date: new Date().toDateString(),
    priorities: [],
    recruiterActivity: [],
    aiSuggestions: [],
    generatedAt: Date.now(),
  };
}

export async function seedSampleData(_actor: Actor): Promise<void> {}

// ── Bench ──────────────────────────────────────────────────────────────────────

/** Maps a Supabase bench_records row. Uses numeric index for .id (type compat)
 *  but stores the UUID in a side-channel map for deletes. */
const _benchUUIDMap = new Map<number, string>();

export function getBenchUUID(numericId: number): string | undefined {
  return _benchUUIDMap.get(numericId);
}

export async function getBenchRecords(
  _actor: Actor,
  filters?: { vendor?: string; role?: string; skill?: string },
): Promise<BenchRecord[]> {
  const rows = await supabaseSelect("bench_records", undefined, {
    order: "created_at.desc",
    limit: 500,
  });
  let results = rows.map((r, i) => mapBenchRow(r, i));

  if (filters?.vendor) {
    results = results.filter((r) =>
      r.vendorName.toLowerCase().includes(filters.vendor!.toLowerCase()),
    );
  }
  if (filters?.role) {
    results = results.filter((r) =>
      r.role.toLowerCase().includes(filters.role!.toLowerCase()),
    );
  }
  if (filters?.skill) {
    results = results.filter((r) =>
      r.skill.toLowerCase().includes(filters.skill!.toLowerCase()),
    );
  }
  return results;
}

export async function uploadBenchRecords(
  _actor: Actor,
  records: BenchRecordInput[],
): Promise<number> {
  const rows = records.map((r) => ({
    vendor_name: r.vendorName ?? null,
    candidate_name: r.candidateName,
    role: r.role ?? null,
    experience: r.experience ?? null,
    skills: r.skill ?? null,
    rate: r.rate ?? null,
    status: "available",
  }));
  const inserted = await supabaseBatchInsert("bench_records", rows);
  return inserted.length;
}

export async function matchBench(
  _actor: Actor,
  _jobId: string,
): Promise<BenchMatch[]> {
  return [];
}

export async function deleteBenchRecord(
  _actor: Actor,
  id: number,
): Promise<boolean> {
  const uuid = getBenchUUID(id);
  if (!uuid) {
    throw new Error(
      "Could not find bench record UUID for deletion. Please refresh the page and try again.",
    );
  }
  await supabaseDelete("bench_records", uuid);
  _benchUUIDMap.delete(id);
  return true;
}
