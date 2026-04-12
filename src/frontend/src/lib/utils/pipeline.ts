import type { EntityType, SubmissionPipelineStage } from "../../types/crm";
import {
  ALLOWED_STAGE_TRANSITIONS,
  PIPELINE_STAGE_COLORS,
  PIPELINE_STAGE_LABELS,
} from "../../types/crm";

export { PIPELINE_STAGE_LABELS, PIPELINE_STAGE_COLORS };

// ── Entity Pipeline Stages ────────────────────────────────────────────────────

export const VENDOR_STAGES = [
  "Discovery",
  "Onboarding",
  "Active",
  "Performance Review",
  "Optimization",
];

export const CLIENT_STAGES = [
  "Prospect",
  "Qualified",
  "Active",
  "Negotiation",
  "Closed-Won",
  "Growth",
];

export const RECRUITER_STAGES = [
  "Onboarding",
  "Active",
  "High-Performer",
  "Coaching",
  "Exit Risk",
];

export const CANDIDATE_STAGES = [
  "Applied",
  "Screened",
  "Submitted",
  "Interview",
  "Offer",
  "Placed",
  "Retention",
];

const STAGES_MAP: Record<EntityType, string[]> = {
  vendor: VENDOR_STAGES,
  client: CLIENT_STAGES,
  recruiter: RECRUITER_STAGES,
  candidate: CANDIDATE_STAGES,
};

export function getStagesForEntity(type: EntityType): string[] {
  return STAGES_MAP[type] ?? [];
}

const APPROVAL_STAGES: Record<EntityType, string[]> = {
  vendor: ["Onboarding"],
  client: ["Negotiation", "Closed-Won"],
  recruiter: [],
  candidate: ["Offer", "Placed"],
};

export function stageRequiresApproval(
  type: EntityType,
  stage: string,
): boolean {
  return (APPROVAL_STAGES[type] ?? []).includes(stage);
}

export function nextStage(
  type: EntityType,
  currentStage: string,
): string | null {
  const stages = getStagesForEntity(type);
  const idx = stages.indexOf(currentStage);
  if (idx === -1 || idx >= stages.length - 1) return null;
  return stages[idx + 1];
}

export function stageIndex(type: EntityType, stage: string): number {
  return getStagesForEntity(type).indexOf(stage);
}

export function stageProgress(type: EntityType, stage: string): number {
  const stages = getStagesForEntity(type);
  const idx = stages.indexOf(stage);
  if (idx === -1) return 0;
  return Math.round(((idx + 1) / stages.length) * 100);
}

// ── Submission Pipeline (10 stages) ──────────────────────────────────────────

/** Ordered list of submission pipeline stages for kanban column ordering. */
export const STAGE_ORDER: SubmissionPipelineStage[] = [
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
];

/** Stage transitions derived from ALLOWED_STAGE_TRANSITIONS in types/crm.ts */
export const STAGE_TRANSITIONS = ALLOWED_STAGE_TRANSITIONS;

/**
 * Returns true if transitioning from `from` to `to` is a valid move.
 */
export function isValidTransition(
  from: SubmissionPipelineStage,
  to: SubmissionPipelineStage,
): boolean {
  const allowed = ALLOWED_STAGE_TRANSITIONS[from];
  return allowed?.includes(to) ?? false;
}

/**
 * Returns the hex color for a given pipeline stage.
 */
export function getStageColor(stage: SubmissionPipelineStage): string {
  return PIPELINE_STAGE_COLORS[stage] ?? "#6b7280";
}

/**
 * Returns the human-readable label for a given pipeline stage.
 */
export function getStageLabel(stage: SubmissionPipelineStage): string {
  return PIPELINE_STAGE_LABELS[stage] ?? stage;
}

/**
 * Computes the number of whole days since the last stage change.
 * Falls back to createdAt if lastStageChangeAt is undefined.
 */
export function getDaysInStage(
  lastStageChangeAt: string | undefined,
  createdAt: string,
): number {
  const ref = lastStageChangeAt ?? createdAt;
  if (!ref) return 0;
  const refMs = new Date(ref).getTime();
  if (Number.isNaN(refMs)) return 0;
  const diffMs = Date.now() - refMs;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}
