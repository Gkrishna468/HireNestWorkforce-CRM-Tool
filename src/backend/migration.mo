import SR "./types/submissions-and-resumes";
import List "mo:core/List";

// Migration: OldSubmission (status-based) -> SR.Submission (10-stage pipelineStage).
// All other stable fields are unchanged and inherited implicitly.
module {

  // Old Submission type — matches the pre-upgrade entities.mo definition.
  type OldEntityId = Text;
  type OldTimestamp = Int;

  type OldSubmission = {
    id          : OldEntityId;
    candidateId : OldEntityId;
    jobId       : OldEntityId;
    vendorId    : ?OldEntityId;
    submittedBy : Text;
    rateProposed : Float;
    status      : Text;          // old: pending/approved/rejected/interview/offer/placed
    submittedAt : OldTimestamp;
    approvedBy  : ?Text;
    approvedAt  : ?OldTimestamp;
  };

  type OldActor = {
    submissions : List.List<OldSubmission>;
  };

  type NewActor = {
    submissions : List.List<SR.Submission>;
  };

  // Map old status string to the nearest 10-stage pipeline stage.
  func mapStatus(status : Text) : Text {
    switch (status) {
      case "pending"   { "resume_sent" };
      case "approved"  { "internal_screening" };
      case "interview" { "client_interview" };
      case "offer"     { "offer_extended" };
      case "placed"    { "placed" };
      case "rejected"  { "rejected" };
      case _           { "resume_sent" };
    };
  };

  public func run(old : OldActor) : NewActor {
    let submissions = old.submissions.map<OldSubmission, SR.Submission>(
      func(s) {
        {
          id              = s.id;
          candidateId     = s.candidateId;
          resumeId        = null;
          jobId           = s.jobId;
          vendorId        = s.vendorId;
          submittedBy     = s.submittedBy;
          rateProposed    = s.rateProposed;
          pipelineStage   = mapStatus(s.status);
          pipelineHistory = [];
          notes           = null;
          submittedAt     = s.submittedAt;
          approvedBy      = s.approvedBy;
          approvedAt      = s.approvedAt;
        };
      }
    );
    { submissions };
  };
};
