const VENDOR_STAGES = [
  "Discovery",
  "Onboarding",
  "Active",
  "Performance Review",
  "Optimization"
];
const CLIENT_STAGES = [
  "Prospect",
  "Qualified",
  "Active",
  "Negotiation",
  "Closed-Won",
  "Growth"
];
const RECRUITER_STAGES = [
  "Onboarding",
  "Active",
  "High-Performer",
  "Coaching",
  "Exit Risk"
];
const CANDIDATE_STAGES = [
  "Applied",
  "Screened",
  "Submitted",
  "Interview",
  "Offer",
  "Placed",
  "Retention"
];
const STAGES_MAP = {
  vendor: VENDOR_STAGES,
  client: CLIENT_STAGES,
  recruiter: RECRUITER_STAGES,
  candidate: CANDIDATE_STAGES
};
function getStagesForEntity(type) {
  return STAGES_MAP[type] ?? [];
}
const APPROVAL_STAGES = {
  vendor: ["Onboarding"],
  client: ["Negotiation", "Closed-Won"],
  recruiter: [],
  candidate: ["Offer", "Placed"]
};
function stageRequiresApproval(type, stage) {
  return (APPROVAL_STAGES[type] ?? []).includes(stage);
}
function nextStage(type, currentStage) {
  const stages = getStagesForEntity(type);
  const idx = stages.indexOf(currentStage);
  if (idx === -1 || idx >= stages.length - 1) return null;
  return stages[idx + 1];
}
export {
  CLIENT_STAGES as C,
  RECRUITER_STAGES as R,
  VENDOR_STAGES as V,
  CANDIDATE_STAGES as a,
  nextStage as n,
  stageRequiresApproval as s
};
