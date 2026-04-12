import T "../types/submissions-and-resumes";
import Lib "../lib/submissions-and-resumes";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

// Public API mixin for Submissions and Resumes.
// Injected state:
//   submissions  — junction table; source of truth for candidate-job-vendor relationships
//   resumes      — resume records keyed by id
//   idCounter    — shared monotonic counter for id generation
mixin (
  submissions : List.List<T.Submission>,
  resumes     : Map.Map<Text, T.Resume>,
  idCounter   : Nat,
) {

  // ── Submission mutations ───────────────────────────────────────────────────

  // Creates a new submission with pipelineStage = "resume_sent" and empty history.
  // Accepts optional resumeId to link directly to a Resume record.
  // Does NOT create a Candidate record.
  public func createSubmission(input : T.SubmissionInput) : async T.Submission {
    Runtime.trap("not implemented");
  };

  // Update mutable fields on a submission (notes, rateProposed).
  // To change pipeline stage use updateSubmissionStage.
  public func updateSubmission(updated : T.Submission) : async Bool {
    Runtime.trap("not implemented");
  };

  // Advance the pipeline stage.
  // Validates the transition via Lib.isValidTransition.
  // Appends a PipelineHistoryEntry with caller as changedBy.
  // Rejected stage is allowed from any stage (requires a notes reason).
  public func updateSubmissionStage(
    id        : Text,
    newStage  : Text,
    changedBy : Text,
  ) : async Bool {
    Runtime.trap("not implemented");
  };

  // Soft-delete: marks submission notes with "[deleted]" prefix — no hard deletes.
  public func deleteSubmission(id : Text) : async Bool {
    Runtime.trap("not implemented");
  };

  // ── Submission queries ─────────────────────────────────────────────────────

  public query func getSubmission(id : Text) : async ?T.Submission {
    Runtime.trap("not implemented");
  };

  public query func listSubmissions() : async [T.Submission] {
    Runtime.trap("not implemented");
  };

  // Returns all submissions for a job (= kanban cards for the job pipeline).
  public query func listSubmissionsForJob(jobId : Text) : async [T.Submission] {
    Runtime.trap("not implemented");
  };

  // Returns all submissions linked to a specific resume (same resume × N jobs = N cards).
  public query func listSubmissionsForResume(resumeId : Text) : async [T.Submission] {
    Runtime.trap("not implemented");
  };

  public query func listSubmissionsForCandidate(candidateId : Text) : async [T.Submission] {
    Runtime.trap("not implemented");
  };

  // ── Resume mutations ───────────────────────────────────────────────────────

  // Creates a Resume record. Does NOT auto-create a Candidate.
  // rawText must be Unicode-sanitized by the caller before passing in.
  // extractedSkills must be a [Text] array (not a single comma-joined string).
  public func createResume(input : T.ResumeInput) : async T.Resume {
    Runtime.trap("not implemented");
  };

  // Updates all resume fields including new: email, phone, yearsExperience,
  // location, sourceVendorId, and skills as [Text] array.
  public func updateResume(id : Text, input : T.ResumeInput) : async Bool {
    Runtime.trap("not implemented");
  };

  // Soft-delete resume — no hard deletes.
  public func deleteResume(id : Text) : async Bool {
    Runtime.trap("not implemented");
  };

  // ── Resume queries ─────────────────────────────────────────────────────────

  public query func getResume(id : Text) : async ?T.Resume {
    Runtime.trap("not implemented");
  };

  public query func listResumes() : async [T.Resume] {
    Runtime.trap("not implemented");
  };

  // Returns ranked job matches for a resume.
  // Scoring: skills 60%, experience 20%, rate 15%, availability 5%.
  public query func matchResumeToJobs(resumeId : Text) : async [T.ResumeJobMatch] {
    Runtime.trap("not implemented");
  };
};
