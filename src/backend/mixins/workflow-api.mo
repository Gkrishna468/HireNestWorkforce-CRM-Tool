import T "../types/entities";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

// Mixin exposing Activity and Follow-Up operations
mixin (
  activities : List.List<T.Activity>,
  followUps : List.List<T.FollowUp>,
  idCounter : Nat,
) {
  public func logActivity(
    entityId : Text,
    entityType : T.EntityType,
    activityType : Text,
    direction : Text,
    notes : Text,
    createdBy : Text,
    requiresApproval : Bool,
  ) : async T.Activity {
    Runtime.trap("not implemented");
  };

  public query func getActivitiesForEntity(entityId : Text) : async [T.Activity] {
    Runtime.trap("not implemented");
  };

  public query func getAllActivities() : async [T.Activity] {
    Runtime.trap("not implemented");
  };

  public func createFollowUp(
    entityId : Text,
    entityType : T.EntityType,
    triggerReason : Text,
    suggestedAction : Text,
    suggestedMessage : Text,
  ) : async T.FollowUp {
    Runtime.trap("not implemented");
  };

  public func updateFollowUpStatus(
    id : Text,
    status : Text,
    approvedBy : ?Text,
    snoozedUntil : ?Int,
  ) : async Bool {
    Runtime.trap("not implemented");
  };

  public query func listFollowUps() : async [T.FollowUp] {
    Runtime.trap("not implemented");
  };

  public query func listPendingFollowUps() : async [T.FollowUp] {
    Runtime.trap("not implemented");
  };

  public func runFollowUpEngine() : async Nat {
    Runtime.trap("not implemented");
  };
};
