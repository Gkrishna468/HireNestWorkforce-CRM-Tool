import Common "common";

module {
  public type EntityId = Common.EntityId;
  public type Timestamp = Common.Timestamp;
  public type EntityType = Common.EntityType;

  // ── Vendors ───────────────────────────────────────────────────────────────
  public type Vendor = {
    id : EntityId;
    name : Text;
    company : Text;
    contactName : Text;
    email : Text;
    phone : Text;
    specialty : Text;
    rateMin : Float;
    rateMax : Float;
    status : Text;
    healthScore : Nat;
    pipelineStage : Text;
    submissions : Nat;
    submissionsAccepted : Nat;
    responseTimeHours : Float;
    qualityScore : Float;
    lastActivityAt : Timestamp;
    createdAt : Timestamp;
    notes : Text;
  };

  // ── Clients ───────────────────────────────────────────────────────────────
  public type Client = {
    id : EntityId;
    name : Text;
    company : Text;
    hiringManager : Text;
    email : Text;
    phone : Text;
    budget : Float;
    timeline : Text;
    pipelineStage : Text;
    healthScore : Nat;
    churnRisk : Text;
    lastActivityAt : Timestamp;
    createdAt : Timestamp;
    notes : Text;
  };

  // ── Recruiters ────────────────────────────────────────────────────────────
  public type Recruiter = {
    id : EntityId;
    name : Text;
    email : Text;
    phone : Text;
    pipelineStage : Text;
    healthScore : Nat;
    productivityScore : Nat;
    callsToday : Nat;
    emailsToday : Nat;
    submissionsToday : Nat;
    interviewsScheduled : Nat;
    tasksCompleted : Nat;
    lastActivityAt : Timestamp;
    createdAt : Timestamp;
  };

  // ── Candidates ────────────────────────────────────────────────────────────
  public type Candidate = {
    id : EntityId;
    name : Text;
    email : Text;
    phone : Text;
    skills : Text;
    experience : Text;
    source : Text;
    salaryExpectation : Float;
    availability : Text;
    pipelineStage : Text;
    healthScore : Nat;
    placementProbability : Nat;
    daysInStage : Nat;
    lastContact : Timestamp;
    lastActivityAt : Timestamp;
    createdAt : Timestamp;
  };

  // ── Activity Log ──────────────────────────────────────────────────────────
  public type Activity = {
    id : EntityId;
    entityId : EntityId;
    entityType : EntityType;
    activityType : Text; // call/email/meeting/submission/interview/note/stage_change
    direction : Text;    // inbound/outbound/internal
    notes : Text;
    createdBy : Text;
    createdAt : Timestamp;
    requiresApproval : Bool;
    approvedBy : ?Text;
    approvedAt : ?Timestamp;
  };

  // ── Follow-Up Queue ───────────────────────────────────────────────────────
  public type FollowUp = {
    id : EntityId;
    entityId : EntityId;
    entityType : EntityType;
    triggerReason : Text; // inactivity_48h/no_feedback_24h/stale_3d/low_recruiter_activity/placement_30d
    suggestedAction : Text;
    suggestedMessage : Text;
    status : Text;        // pending/approved/rejected/sent/snoozed
    approvedBy : ?Text;
    approvedAt : ?Timestamp;
    sentAt : ?Timestamp;
    snoozedUntil : ?Timestamp;
    createdAt : Timestamp;
  };

  // ── Jobs ──────────────────────────────────────────────────────────────────
  public type Job = {
    id : EntityId;
    clientId : EntityId;
    title : Text;
    requirements : Text;
    rateMin : Float;
    rateMax : Float;
    status : Text; // open/filled/closed/on_hold
    createdAt : Timestamp;
    filledAt : ?Timestamp;
  };

  // ── Submissions ───────────────────────────────────────────────────────────
  public type Submission = {
    id : EntityId;
    candidateId : EntityId;
    jobId : EntityId;
    vendorId : ?EntityId;
    submittedBy : Text;
    rateProposed : Float;
    status : Text; // pending/approved/rejected/interview/offer/placed
    submittedAt : Timestamp;
    approvedBy : ?Text;
    approvedAt : ?Timestamp;
  };

  // ── Bench List ────────────────────────────────────────────────────────────
  public type BenchRecord = {
    id : Nat;
    vendorName : Text;
    candidateName : Text;
    role : Text;
    experience : Text;
    skill : Text;
    rate : Float;
    importedAt : Timestamp;
  };

  // Input type for bulk upload (no id/importedAt — assigned server-side)
  public type BenchRecordInput = {
    vendorName : Text;
    candidateName : Text;
    role : Text;
    experience : Text;
    skill : Text;
    rate : Float;
  };

  // Bench record enriched with job-match score
  public type BenchMatch = {
    id : Nat;
    vendorName : Text;
    candidateName : Text;
    role : Text;
    experience : Text;
    skill : Text;
    rate : Float;
    importedAt : Timestamp;
    matchScore : Float;
  };

  // ── Pipeline Stage ────────────────────────────────────────────────────────
  public type PipelineStage = {
    entityType : EntityType;
    stageName : Text;
    stageOrder : Nat;
    requiresApproval : Bool;
    slaHours : Nat;
  };

  // ── Recruiter Daily Metrics ───────────────────────────────────────────────
  public type RecruiterMetrics = {
    id : EntityId;
    recruiterId : EntityId;
    date : Text;          // ISO date string
    callsMade : Nat;
    emailsSent : Nat;
    submissions : Nat;
    interviewsScheduled : Nat;
    tasksCompleted : Nat;
    productivityScore : Nat;
    notes : Text;
  };

  // ── Vendor Daily Metrics ──────────────────────────────────────────────────
  public type VendorMetrics = {
    id : EntityId;
    vendorId : EntityId;
    date : Text;          // ISO date string
    submissions : Nat;
    submissionsAccepted : Nat;
    interviewsScheduled : Nat;
    placements : Nat;
    responseTimeHours : Float;
    qualityScore : Float;
  };

  // ── Approval Queue Item ───────────────────────────────────────────────────
  public type ApprovalItem = {
    id : EntityId;
    itemType : Text;   // submission/stage_change/follow_up/offer/negotiation/onboarding
    entityId : EntityId;
    entityType : EntityType;
    entityName : Text;
    description : Text;
    details : Text;
    requestedBy : Text;
    requestedAt : Timestamp;
    status : Text;     // pending/approved/rejected/snoozed/info_requested
    approvedBy : ?Text;
    approvedAt : ?Timestamp;
    notes : ?Text;
    snoozedUntil : ?Timestamp;
  };

  // ── Dashboard types ───────────────────────────────────────────────────────
  public type PulseRow = {
    entityId : EntityId;
    entityType : EntityType;
    entityName : Text;
    pipelineStage : Text;
    healthScore : Nat;
    healthStatus : Common.HealthStatus;
    lastActivityAt : Timestamp;
    actionNeeded : Text;
  };

  public type PulseDashboard = {
    rows : [PulseRow];
    generatedAt : Timestamp;
  };

  public type MorningBriefing = {
    date : Text;
    vendorFollowUps : Nat;
    clientInterviewsToday : Nat;
    pendingOfferApprovals : Nat;
    staleCandidates : Nat;
    pendingApprovals : Nat;
    recruiterSummaries : [RecruiterSummary];
    aiSuggestions : [Text];
    generatedAt : Timestamp;
  };

  public type RecruiterSummary = {
    recruiterId : EntityId;
    name : Text;
    callsToday : Nat;
    submissionsToday : Nat;
    productivityScore : Nat;
    flagged : Bool;
  };
};
