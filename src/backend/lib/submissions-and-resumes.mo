import T "../types/submissions-and-resumes";
import List "mo:core/List";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

// Domain logic for Submissions and Resumes.
// Stateless module — all state is injected via parameters.
module {

  // ── Valid stage transition table ───────────────────────────────────────────
  // Forward order:  resume_sent → internal_screening → submitted_to_client →
  //                 client_screening → client_interview → offer_extended →
  //                 offer_accepted → placed → onboarding
  // rejected: allowed from ANY stage
  public func isValidTransition(from : Text, to : Text) : Bool {
    Runtime.trap("not implemented");
  };

  // ── Submission helpers ─────────────────────────────────────────────────────

  public func newSubmission(
    id    : Text,
    input : T.SubmissionInput,
    now   : Int,
  ) : T.Submission {
    Runtime.trap("not implemented");
  };

  public func advanceStage(
    sub       : T.Submission,
    newStage  : Text,
    changedBy : Text,
    now       : Int,
  ) : T.Submission {
    Runtime.trap("not implemented");
  };

  public func filterByJob(
    submissions : List.List<T.Submission>,
    jobId       : Text,
  ) : [T.Submission] {
    Runtime.trap("not implemented");
  };

  public func filterByResume(
    submissions : List.List<T.Submission>,
    resumeId    : Text,
  ) : [T.Submission] {
    Runtime.trap("not implemented");
  };

  public func filterByCandidate(
    submissions : List.List<T.Submission>,
    candidateId : Text,
  ) : [T.Submission] {
    Runtime.trap("not implemented");
  };

  // ── Resume helpers ─────────────────────────────────────────────────────────

  public func newResume(
    id    : Text,
    input : T.ResumeInput,
    now   : Int,
  ) : T.Resume {
    Runtime.trap("not implemented");
  };

  public func updateResume(
    existing : T.Resume,
    input    : T.ResumeInput,
  ) : T.Resume {
    Runtime.trap("not implemented");
  };

  // Compute a ranked list of job matches for a resume.
  // Scoring: skills 60%, experience 20%, rate 15%, availability 5%.
  public func matchResumesToJobs(
    resume   : T.Resume,
    jobTitles : [(Text, Text)], // [(jobId, title)]
    jobSkills : [(Text, Text)], // [(jobId, skills csv)]
  ) : [T.ResumeJobMatch] {
    Runtime.trap("not implemented");
  };
};
