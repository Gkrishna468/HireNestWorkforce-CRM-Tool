import T "../types/entities";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

// Mixin exposing Jobs and Submissions operations
mixin (
  jobs : Map.Map<Text, T.Job>,
  submissions : List.List<T.Submission>,
  idCounter : Nat,
) {
  public func createJob(
    clientId : Text,
    title : Text,
    requirements : Text,
    rateMin : Float,
    rateMax : Float,
  ) : async T.Job {
    Runtime.trap("not implemented");
  };

  public func updateJob(updated : T.Job) : async Bool {
    Runtime.trap("not implemented");
  };

  public query func getJob(id : Text) : async ?T.Job {
    Runtime.trap("not implemented");
  };

  public query func listJobs() : async [T.Job] {
    Runtime.trap("not implemented");
  };

  public query func listJobsForClient(clientId : Text) : async [T.Job] {
    Runtime.trap("not implemented");
  };

  public func createSubmission(
    candidateId : Text,
    jobId : Text,
    vendorId : ?Text,
    submittedBy : Text,
    rateProposed : Float,
  ) : async T.Submission {
    Runtime.trap("not implemented");
  };

  public func updateSubmission(updated : T.Submission) : async Bool {
    Runtime.trap("not implemented");
  };

  public query func listSubmissions() : async [T.Submission] {
    Runtime.trap("not implemented");
  };

  public query func listSubmissionsForCandidate(candidateId : Text) : async [T.Submission] {
    Runtime.trap("not implemented");
  };

  public query func listSubmissionsForJob(jobId : Text) : async [T.Submission] {
    Runtime.trap("not implemented");
  };
};
