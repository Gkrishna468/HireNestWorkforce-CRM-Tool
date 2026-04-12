import T "../types/entities";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

// Mixin exposing Jobs operations.
// Submission operations live in submissions-and-resumes-api.mo.
mixin (
  jobs : Map.Map<Text, T.Job>,
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
};
