/**
 * API layer — all entity CRUD goes to Supabase REST API.
 * Non-entity calls (pipeline stages, follow-ups, metrics, pulse dashboard, etc.)
 * still use the Motoko actor as a fallback/stub.
 */

/* RLS FIX — Run in Supabase SQL Editor if getting 401/403 on submissions:
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS allow_all_submissions ON submissions;
CREATE POLICY allow_all_submissions ON submissions FOR ALL USING (true) WITH CHECK (true);
*/

/* ============================================================
   SUPABASE SQL TO RUN — Fuzzy Duplicate Detection
   Copy and paste the block below into your Supabase SQL Editor
   and click "Run" before using the fuzzy duplicate feature.
   ============================================================

-- Enable trigram similarity extension (required for similarity() function):
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Name-primary matching (phone/skills kept for backward compat but weighted low).
-- Weights: name 60%, phone 30%, skills overlap 10%.
-- Filter: similarity_score >= 30.
-- Fixed: explicit ::TEXT[] casts to avoid array_length(text, integer) errors.
DROP FUNCTION IF EXISTS find_similar_candidates(TEXT, TEXT, TEXT[]);

CREATE OR REPLACE FUNCTION find_similar_candidates(
  input_name TEXT,
  input_phone TEXT,
  input_skills TEXT[]
)
RETURNS TABLE (
  id UUID,
  candidate_name TEXT,
  email TEXT,
  phone TEXT,
  extracted_skills TEXT[],
  extracted_role TEXT,
  similarity_score NUMERIC,
  match_reasons TEXT[]
)
LANGUAGE plpgsql
AS $$
DECLARE
  phone_clean TEXT := regexp_replace(COALESCE(input_phone, ''), '[^0-9]', '', 'g');
  name_lower  TEXT := lower(COALESCE(input_name, ''));
  skills_arr  TEXT[] := COALESCE(input_skills::TEXT[], ARRAY[]::TEXT[]);
BEGIN
  RETURN QUERY
  SELECT
    r.id,
    r.candidate_name,
    r.email,
    r.phone,
    r.extracted_skills,
    r.extracted_role,
    ROUND((
      -- Name similarity: 60 points
      (similarity(lower(COALESCE(r.candidate_name,'')), name_lower) * 60)
      -- Phone match: 30 points
      + CASE
          WHEN phone_clean <> ''
            AND regexp_replace(COALESCE(r.phone,''),'[^0-9]','','g') = phone_clean
          THEN 30
          ELSE 0
        END
      -- Skills overlap: 10 points
      + CASE
          WHEN array_length(skills_arr, 1) > 0
            AND array_length(COALESCE(r.extracted_skills::TEXT[], ARRAY[]::TEXT[]), 1) > 0
          THEN ROUND(
            (SELECT COUNT(*) FROM unnest(skills_arr) s
             WHERE lower(s) = ANY(
               SELECT lower(x) FROM unnest(COALESCE(r.extracted_skills::TEXT[], ARRAY[]::TEXT[])) x
             ))::NUMERIC
            / GREATEST(
                array_length(skills_arr, 1),
                array_length(COALESCE(r.extracted_skills::TEXT[], ARRAY[]::TEXT[]), 1)
              ) * 10
          )
          ELSE 0
        END
    )::NUMERIC, 0) AS similarity_score,
    ARRAY_REMOVE(ARRAY[
      CASE WHEN similarity(lower(COALESCE(r.candidate_name,'')), name_lower) > 0.3
           THEN 'Name match' ELSE NULL END,
      CASE WHEN phone_clean <> ''
             AND regexp_replace(COALESCE(r.phone,''),'[^0-9]','','g') = phone_clean
           THEN 'Phone match' ELSE NULL END,
      CASE WHEN array_length(skills_arr, 1) > 0
             AND (SELECT COUNT(*) FROM unnest(skills_arr) s
                  WHERE lower(s) = ANY(
                    SELECT lower(x) FROM unnest(COALESCE(r.extracted_skills::TEXT[], ARRAY[]::TEXT[])) x
                  )) > 0
           THEN 'Skills overlap' ELSE NULL END
    ], NULL) AS match_reasons
  FROM resumes r
  WHERE r.status <> 'archived'
    AND similarity(lower(COALESCE(r.candidate_name,'')), name_lower) > 0.3
  ORDER BY similarity_score DESC
  LIMIT 5;
END;
$$;

   ============================================================ */
import type {
  Activity,
  ApprovalItem,
  ApprovalStatus,
  BenchMatch,
  BenchRecord,
  BenchRecordInput,
  Candidate,
  Client,
  ClientJobLink,
  FollowUp,
  FollowUpStatus,
  FuzzyDuplicateMatch,
  Job,
  MorningBriefing,
  PipelineStage,
  PulseDashboard,
  Recruiter,
  RecruiterMetrics,
  Resume,
  Submission,
  SubmissionHistory,
  SubmissionPipelineStage,
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
  SubmissionUpdateInput,
  VendorFormInput,
  VendorMetricsFormInput,
} from "../types/forms";
import { sanitizeText } from "./resumeParser";
import {
  supabaseBatchInsert,
  supabaseDelete,
  supabaseInsert,
  supabaseRpc,
  supabaseSelect,
  supabaseUpdate,
} from "./supabase";
import { getDaysInStage } from "./utils/pipeline";

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
    jobId: r.job_id ?? r.jobId ?? undefined,
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
function mapSubmissionHistoryRow(r: any): SubmissionHistory {
  return {
    id: safeString(r.id),
    submissionId: safeString(r.submission_id ?? r.submissionId ?? ""),
    fromStage: (r.from_stage ?? r.fromStage ?? undefined) as
      | SubmissionPipelineStage
      | undefined,
    toStage: (r.to_stage ??
      r.toStage ??
      "resume_sent") as SubmissionPipelineStage,
    changedAt: safeString(r.changed_at ?? r.created_at ?? ""),
    changedBy: r.changed_by ?? r.changedBy ?? undefined,
    rejectionReason: r.rejection_reason ?? r.rejectionReason ?? undefined,
    notes: r.notes ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSubmissionRow(r: any): Submission {
  const createdAtStr = safeString(r.created_at ?? "");
  const lastStageChangeAt: string | undefined =
    r.last_stage_change_at ?? r.lastStageChangeAt ?? undefined;

  // Map pipeline_history — may be a JSON column or a nested array from a join
  let pipelineHistory: SubmissionHistory[] = [];
  const rawHistory = r.pipeline_history ?? r.pipelineHistory;
  if (Array.isArray(rawHistory)) {
    pipelineHistory = rawHistory.map(mapSubmissionHistoryRow);
  }

  return {
    id: safeString(r.id),
    candidateId: safeString(r.candidate_id ?? r.candidateId ?? ""),
    candidateName: r.candidate_name ?? r.candidateName ?? undefined,
    jobId: safeString(r.job_id ?? r.jobId ?? ""),
    jobTitle: r.job_title ?? r.jobTitle ?? undefined,
    clientName: r.client_name ?? r.clientName ?? undefined,
    vendorId: r.vendor_id ?? r.vendorId ?? undefined,
    resumeId: r.resume_id ?? r.resumeId ?? undefined,
    submittedBy: r.submitted_by ?? r.submittedBy ?? undefined,
    rateProposed:
      r.rate_proposed != null ? safeNumber(r.rate_proposed) : undefined,
    status: (r.status ?? "pending") as SubmissionStatus,
    submittedAt: r.created_at ? new Date(r.created_at).getTime() : Date.now(),
    approvedBy: r.approved_by ?? r.approvedBy ?? undefined,
    pipelineStage: (r.pipeline_stage ??
      r.current_stage ??
      r.pipelineStage ??
      "resume_sent") as SubmissionPipelineStage,
    pipelineHistory,
    rejectionReason: r.rejection_reason ?? r.rejectionReason ?? undefined,
    notes: r.notes ?? undefined,
    deletedAt: r.deleted_at ?? r.deletedAt ?? undefined,
    lastStageChangeAt,
    daysInStage: getDaysInStage(lastStageChangeAt, createdAtStr),
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
  // FIXED: Use assigned_recruiter instead of vendor_id
  // Use snake_case for all database column names
  const row = await supabaseInsert<Record<string, unknown>>("candidates", {
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    role: input.title ?? null,
    skills: input.skills ?? null,
    experience: input.notes ?? null,
    notes: input.notes ?? null,
    // CRITICAL FIX: Use assigned_recruiter NOT vendor_id
    assigned_recruiter: input.assignedRecruiter ?? null,
    // Add job_id if present
    job_id: input.jobId ?? null,
    // Add salary fields
    salary_min: input.salaryMin ?? null,
    salary_max: input.salaryMax ?? null,
    // Add linkedin_url
    linkedin_url: input.linkedinUrl ?? null,
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
  // FIXED: Use assigned_recruiter instead of vendor_id
  if (input.assignedRecruiter !== undefined) data.assigned_recruiter = input.assignedRecruiter;
  if (input.jobId !== undefined) data.job_id = input.jobId;
  if (input.salaryMin !== undefined) data.salary_min = input.salaryMin;
  if (input.salaryMax !== undefined) data.salary_max = input.salaryMax;
  if (input.linkedinUrl !== undefined) data.linkedin_url = input.linkedinUrl;
  if (input.currentStage !== undefined) data.stage = input.currentStage;
  if (input.healthScore !== undefined) data.health_score = input.healthScore;
  
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
  const rows = await supabaseSelect<Record<string, unknown>>(
    "submissions",
    undefined,
    { order: "created_at.desc" },
  );
  return rows.filter((r) => !r.deleted_at).map(mapSubmissionRow);
}

export async function getSubmissionsForCandidate(
  _actor: Actor,
  candidateId: string,
): Promise<Submission[]> {
  const rows = await supabaseSelect<Record<string, unknown>>("submissions", {
    candidate_id: candidateId,
  });
  return rows.filter((r) => !r.deleted_at).map(mapSubmissionRow);
}

export async function getSubmissionsForResume(
  _actor: Actor,
  resumeId: string,
): Promise<Submission[]> {
  const rows = await supabaseSelect<Record<string, unknown>>("submissions", {
    resume_id: resumeId,
  });
  return rows.filter((r) => !r.deleted_at).map(mapSubmissionRow);
}

export async function getSubmissionsForJob(
  _actor: Actor,
  jobId: string,
): Promise<Submission[]> {
  const rows = await supabaseSelect<Record<string, unknown>>("submissions", {
    job_id: jobId,
  });
  return rows.filter((r) => !r.deleted_at).map(mapSubmissionRow);
}

export async function getSubmissionsForVendor(
  _actor: Actor,
  vendorId: string,
): Promise<Submission[]> {
  const rows = await supabaseSelect<Record<string, unknown>>("submissions", {
    vendor_id: vendorId,
  });
  return rows.filter((r) => !r.deleted_at).map(mapSubmissionRow);
}

export async function listSubmissionsForResume(
  resumeId: string,
): Promise<Submission[]> {
  const rows = await supabaseSelect<Record<string, unknown>>("submissions", {
    resume_id: resumeId,
  });
  return rows.filter((r) => !r.deleted_at).map(mapSubmissionRow);
}

export async function createSubmission(
  _actor: Actor,
  input: SubmissionFormInput,
): Promise<Submission> {
  // STRICT: only columns that exist in the submissions table
  const submissionPayload = {
    resume_id: input.resumeId ?? null,
    job_id: input.jobId ?? null,
    source_vendor_id: input.vendorId ?? null,
    submitting_recruiter_id: null,
    current_stage: input.pipelineStage ?? "resume_sent",
  };

  console.log("Submission payload:", JSON.stringify(submissionPayload));

  const row = await supabaseInsert<Record<string, unknown>>(
    "submissions",
    submissionPayload,
  );
  if (
    (
      row as {
        error?: {
          message?: string;
          details?: string;
          hint?: string;
          code?: string;
        };
      }
    ).error
  ) {
    const e = (
      row as {
        error: {
          message?: string;
          details?: string;
          hint?: string;
          code?: string;
        };
      }
    ).error;
    console.error(
      "Supabase submission error:",
      e.message,
      e.details,
      e.hint,
      e.code,
    );
  }
  return mapSubmissionRow(row);
}

export async function updateSubmission(
  _actor: Actor,
  id: string,
  patch:
    | SubmissionStatus
    | { status?: SubmissionStatus; pipeline_stage?: string },
): Promise<Submission> {
  const data: Record<string, unknown> =
    typeof patch === "string" ? { status: patch } : { ...patch };
  const row = await supabaseUpdate<Record<string, unknown>>(
    "submissions",
    id,
    data,
  );
  return mapSubmissionRow(row);
}

/**
 * Updates the pipeline stage of a submission and inserts a history record.
 */
export async function updateSubmissionStage(
  id: string,
  update: SubmissionUpdateInput,
): Promise<Submission> {
  const now = new Date().toISOString();

  // Fetch existing submission to get current stage for history
  const existing = await supabaseSelect<Record<string, unknown>>(
    "submissions",
    { id },
    { limit: 1 },
  );
  const currentStage: string | undefined =
    (existing[0]?.pipeline_stage as string | undefined) ?? undefined;

  // Update the submission
  const row = await supabaseUpdate<Record<string, unknown>>("submissions", id, {
    pipeline_stage: update.stage,
    rejection_reason: update.rejectionReason ?? null,
    notes: update.notes ?? null,
    last_stage_change_at: now,
    // If placed, also update status
    ...(update.stage === "placed" ? { status: "placed" } : {}),
    ...(update.stage === "rejected" ? { status: "rejected" } : {}),
  });

  // Insert history record (best-effort, don't throw if table missing)
  try {
    await supabaseInsert<Record<string, unknown>>("submission_history", {
      submission_id: id,
      from_stage: currentStage ?? null,
      to_stage: update.stage,
      changed_at: now,
      rejection_reason: update.rejectionReason ?? null,
      notes: update.notes ?? null,
    });
  } catch {
    // Table may not exist yet — non-fatal
  }

  return mapSubmissionRow(row);
}

/**
 * Soft-deletes a submission by setting deleted_at.
 */
export async function softDeleteSubmission(id: string): Promise<void> {
  await supabaseUpdate("submissions", id, {
    deleted_at: new Date().toISOString(),
  });
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

// ── Resumes ───────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapResumeRow(row: any): Resume {
  // extractedSkills may be stored as TEXT (comma-separated) or TEXT[] (Postgres array)
  let skills: string[] = [];
  const rawSkills = row.extracted_skills ?? row.extractedSkills;
  if (Array.isArray(rawSkills)) {
    skills = rawSkills.map(String).filter(Boolean);
  } else if (typeof rawSkills === "string" && rawSkills.trim()) {
    skills = rawSkills
      .split(",")
      .map((s: string) => s.trim())
      .filter(Boolean);
  }

  return {
    id: String(row.id),
    fileName: safeString(row.file_name),
    fileUrl: row.file_url ? String(row.file_url) : undefined,
    candidateName: safeString(row.candidate_name),
    email: row.email ? String(row.email) : undefined,
    phone: row.phone ? String(row.phone) : undefined,
    extractedSkills: skills,
    extractedExperience: safeString(row.extracted_experience),
    extractedRole: safeString(row.extracted_role),
    rawText: safeString(row.raw_text),
    createdAt: safeString(row.created_at),
    duplicateOf: row.duplicate_of ? String(row.duplicate_of) : undefined,
    status: (row.status ?? "active") as Resume["status"],
    availability: row.availability
      ? (row.availability as Resume["availability"])
      : undefined,
    yearsExperience:
      row.years_experience != null ? Number(row.years_experience) : undefined,
    location: row.location ? String(row.location) : undefined,
    sourceVendorId: row.source_vendor_id
      ? String(row.source_vendor_id)
      : undefined,
  };
}

export async function getResumes(): Promise<Resume[]> {
  const rows = await supabaseSelect("resumes", undefined, {
    order: "created_at.desc",
  });
  return rows.map(mapResumeRow);
}

export async function createResume(input: {
  fileName: string;
  fileUrl?: string;
  candidateName: string;
  email?: string;
  phone?: string;
  /** Skills as array — sent as JSON array to Supabase (TEXT[] column) */
  extractedSkills: string[];
  extractedExperience: string;
  extractedRole: string;
  rawText: string;
  status?: "pending" | "active" | "duplicate" | "archived";
  availability?: string;
  duplicateOf?: string;
  yearsExperience?: number;
  location?: string;
  sourceVendorId?: string;
}): Promise<Resume> {
  // ── Sanitize helper (applied to every text field) ───────────────────────────
  function sanitizeForPostgres(val: unknown): string {
    if (!val || typeof val !== "string") return "";
    return sanitizeText(val);
  }

  // ── Fix 2: skills array guard — handles array, string, or object shapes ─────
  function toSkillsArray(skills: unknown): string[] {
    if (Array.isArray(skills))
      return skills.map((s) => String(s).trim()).filter(Boolean);
    if (typeof skills === "object" && skills !== null)
      return Object.values(skills as Record<string, unknown>)
        .map((s) => String(s).trim())
        .filter(Boolean);
    if (typeof skills === "string")
      return skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    return [];
  }

  const skillsArray = toSkillsArray(input.extractedSkills);

  // Debug: verify skills type before insert
  console.log(
    "Skills type check:",
    typeof input.extractedSkills,
    Array.isArray(input.extractedSkills),
    "result:",
    skillsArray,
  );

  const payload = {
    file_name: sanitizeForPostgres(input.fileName),
    file_url: input.fileUrl ?? null,
    candidate_name: sanitizeForPostgres(input.candidateName),
    email: input.email ? sanitizeForPostgres(input.email) : null,
    phone: input.phone ? sanitizeForPostgres(input.phone) : null,
    // Send as JSON array — Supabase REST parses TEXT[] from JSON array
    extracted_skills: skillsArray,
    extracted_experience: sanitizeForPostgres(input.extractedExperience),
    extracted_role: sanitizeForPostgres(input.extractedRole),
    raw_text: sanitizeForPostgres(input.rawText).slice(0, 50000),
    status: input.status ?? "active",
    availability: input.availability ?? null,
    duplicate_of: input.duplicateOf ?? null,
    years_experience: input.yearsExperience ?? null,
    location: input.location ? sanitizeForPostgres(input.location) : null,
    source_vendor_id: input.sourceVendorId ?? null,
  };

  // Debug log — verify skills is a proper array before insert (kept for compatibility)
  try {
    const result = await supabaseInsert<Record<string, unknown>>(
      "resumes",
      payload,
    );
    const resume = mapResumeRow(result);

    // ── Candidate sync: also insert a row into candidates table ──────────────
    // Non-blocking — if it fails (e.g. duplicate email), log but don't throw.
    try {
      const candidatePayload: Record<string, unknown> = {
        name: sanitizeForPostgres(input.candidateName),
        email: input.email ? sanitizeForPostgres(input.email) : null,
        phone: input.phone ? sanitizeForPostgres(input.phone) : null,
        role: sanitizeForPostgres(input.extractedRole),
        skills: skillsArray,
        experience: sanitizeForPostgres(input.extractedExperience),
        notes: sanitizeForPostgres(input.extractedExperience),
        location: input.location ? sanitizeForPostgres(input.location) : null,
        // FIXED: Use assigned_recruiter instead of vendor_id
        assigned_recruiter: input.sourceVendorId ?? null,
        status: "active",
        stage: "Applied",
        health_score: 50,
      };
      await supabaseInsert<Record<string, unknown>>(
        "candidates",
        candidatePayload,
      );
    } catch (syncErr) {
      // Non-fatal — candidate sync failure must not block resume save
      const se = syncErr as Record<string, unknown>;
      console.warn(
        "Candidate sync after resume save failed (non-fatal):",
        se?.message,
        "| code:",
        se?.code,
      );
    }

    return resume;
  } catch (err) {
    // Detailed error logging so the exact failing column is visible in the console
    const e = err as Record<string, unknown>;
    console.error(
      "Supabase resume save error:",
      e?.message,
      "| details:",
      e?.details,
      "| hint:",
      e?.hint,
      "| code:",
      e?.code,
      "| payload skills type:",
      typeof payload.extracted_skills,
      Array.isArray(payload.extracted_skills),
      "| sourceVendorId:",
      input.sourceVendorId ?? "(none)",
      "| failedPayload (truncated):",
      JSON.stringify(payload).slice(0, 500),
    );
    throw err;
  }
}

export async function deleteResume(id: string): Promise<void> {
  await supabaseDelete("resumes", id);
}

/**
 * Checks if a resume with the given email already exists.
 * Returns the existing resume, or null if no duplicate found.
 */
export async function checkDuplicateResume(
  email: string,
): Promise<Resume | null> {
  if (!email) return null;
  const rows = await supabaseSelect("resumes", { email }, { limit: 1 });
  if (!rows.length) return null;
  return mapResumeRow(rows[0]);
}

export async function getJobsForMatching(): Promise<Job[]> {
  const rows = await supabaseSelect(
    "jobs",
    { status: "open" },
    { order: "created_at.desc", limit: 200 },
  );
  return rows.map(mapJobRow);
}

// ── Client Job Links ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapClientJobLinkRow(r: any): ClientJobLink {
  return {
    jobId: safeString(r.job_id ?? r.jobId ?? ""),
    linkedAt: safeString(r.linked_at ?? r.created_at ?? ""),
  };
}

export async function getClientJobLinks(
  clientId: string,
): Promise<ClientJobLink[]> {
  const rows = await supabaseSelect<Record<string, unknown>>(
    "client_job_links",
    { client_id: clientId },
    { order: "created_at.desc" },
  );
  return rows.filter((r) => !r.deleted_at).map(mapClientJobLinkRow);
}

export async function createClientJobLink(
  clientId: string,
  jobId: string,
): Promise<void> {
  await supabaseInsert<Record<string, unknown>>("client_job_links", {
    client_id: clientId,
    job_id: jobId,
    linked_at: new Date().toISOString(),
  });
}

export async function softDeleteClientJobLink(
  clientId: string,
  jobId: string,
): Promise<void> {
  // Fetch the link row first to get its id
  const rows = await supabaseSelect<Record<string, unknown>>(
    "client_job_links",
    {
      client_id: clientId,
      job_id: jobId,
    },
  );
  if (!rows.length) return;
  await supabaseUpdate("client_job_links", safeString(rows[0].id), {
    deleted_at: new Date().toISOString(),
  });
}

// ── Fuzzy Duplicate Detection ─────────────────────────────────────────────────

/**
 * Calls the `find_similar_candidates` Supabase RPC to find resumes that are
 * potentially the same person as the incoming resume, scored 0–100 across
 * name similarity (40pts), phone match (35pts), and skills overlap (25pts).
 *
 * Requires the SQL in the comment block at the top of this file to be run
 * in your Supabase SQL Editor first.
 */
export async function findSimilarCandidates(params: {
  inputName: string;
  inputPhone: string | null;
  inputSkills: string[];
}): Promise<FuzzyDuplicateMatch[]> {
  try {
    const rows = await supabaseRpc<{
      id: string;
      candidate_name: string;
      email: string;
      phone: string;
      extracted_skills: string[];
      extracted_role: string;
      similarity_score: number;
      match_reasons: string[];
    }>("find_similar_candidates", {
      input_name: params.inputName,
      // Name-only matching per user preference — always pass empty string for phone/skills
      // to avoid null parameter type errors on the RPC
      input_phone: "",
      input_skills: [],
    });

    return (rows ?? []).map(
      (row): FuzzyDuplicateMatch => ({
        id: row.id,
        candidateName: row.candidate_name ?? "",
        email: row.email ?? "",
        phone: row.phone ?? "",
        extractedSkills: Array.isArray(row.extracted_skills)
          ? row.extracted_skills
          : [],
        extractedRole: row.extracted_role ?? "",
        similarityScore: Number(row.similarity_score),
        matchReasons: Array.isArray(row.match_reasons) ? row.match_reasons : [],
      }),
    );
  } catch (err) {
    // Non-fatal: RPC may not exist yet (function not created in Supabase)
    console.warn(
      "findSimilarCandidates: RPC not available — run the SQL setup.",
      (err as Error).message,
    );
    return [];
  }
}
