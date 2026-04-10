import type { EntityType } from "../../types/crm";

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
