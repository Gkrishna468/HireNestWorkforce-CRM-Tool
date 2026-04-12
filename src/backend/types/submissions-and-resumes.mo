import Common "common";

module {
  public type EntityId = Common.EntityId;
  public type Timestamp = Common.Timestamp;

  // ── 10-Stage Pipeline ──────────────────────────────────────────────────────
  // Valid values: resume_sent | internal_screening | submitted_to_client |
  //               client_screening | client_interview | offer_extended |
  //               offer_accepted | placed | onboarding | rejected
  public type SubmissionPipelineStage = Text;

  // ── Pipeline History Entry ─────────────────────────────────────────────────
  public type PipelineHistoryEntry = {
    fromStage : Text;
    toStage   : Text;
    changedAt : Int;
    changedBy : Text;
  };

  // ── Submission ─────────────────────────────────────────────────────────────
  // Junction table: source of truth for all candidate-job-vendor relationships.
  // status field (old pending/approved/rejected enum) is REMOVED.
  // pipelineStage drives the 10-stage pipeline.
  public type Submission = {
    id             : EntityId;
    candidateId    : EntityId;        // links to Candidate record (if present)
    resumeId       : ?EntityId;       // optional link to Resume record
    jobId          : EntityId;
    vendorId       : ?EntityId;
    submittedBy    : Text;
    rateProposed   : Float;
    pipelineStage  : SubmissionPipelineStage;
    pipelineHistory : [PipelineHistoryEntry];
    notes          : ?Text;
    submittedAt    : Timestamp;
    approvedBy     : ?Text;
    approvedAt     : ?Timestamp;
  };

  // Input type for creating a new submission
  public type SubmissionInput = {
    candidateId  : EntityId;
    resumeId     : ?EntityId;
    jobId        : EntityId;
    vendorId     : ?EntityId;
    submittedBy  : Text;
    rateProposed : Float;
    notes        : ?Text;
  };

  // ── Resume ─────────────────────────────────────────────────────────────────
  // Resume stays in Resumes table after upload — does NOT auto-create a Candidate.
  public type Resume = {
    id                  : EntityId;
    fileName            : Text;
    fileUrl             : Text;
    candidateName       : Text;
    email               : ?Text;
    phone               : ?Text;
    yearsExperience     : ?Int;
    location            : ?Text;
    extractedSkills     : [Text];      // array, not single Text
    extractedExperience : Text;
    extractedRole       : Text;
    rawText             : Text;        // Unicode-sanitized before storage
    sourceVendorId      : ?EntityId;
    createdAt           : Timestamp;
  };

  // Input type for creating/updating a resume
  public type ResumeInput = {
    fileName            : Text;
    fileUrl             : Text;
    candidateName       : Text;
    email               : ?Text;
    phone               : ?Text;
    yearsExperience     : ?Int;
    location            : ?Text;
    extractedSkills     : [Text];
    extractedExperience : Text;
    extractedRole       : Text;
    rawText             : Text;
    sourceVendorId      : ?EntityId;
  };

  // Resume enriched with matching job score
  public type ResumeJobMatch = {
    jobId        : EntityId;
    jobTitle     : Text;
    matchScore   : Float;
    skillsScore  : Float;
    expScore     : Float;
    rateScore    : Float;
    availScore   : Float;
  };
};
