import T "../types/entities";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

// Mixin exposing Approval Queue operations
mixin (
  approvals : List.List<T.ApprovalItem>,
  idCounter : Nat,
) {
  public func createApprovalItem(
    itemType : Text,
    entityId : Text,
    entityType : T.EntityType,
    entityName : Text,
    description : Text,
    details : Text,
    requestedBy : Text,
  ) : async T.ApprovalItem {
    Runtime.trap("not implemented");
  };

  public func updateApprovalItem(updated : T.ApprovalItem) : async Bool {
    Runtime.trap("not implemented");
  };

  public query func listPendingApprovals() : async [T.ApprovalItem] {
    Runtime.trap("not implemented");
  };

  public query func listApprovalHistory() : async [T.ApprovalItem] {
    Runtime.trap("not implemented");
  };

  public func approveItem(id : Text, approvedBy : Text) : async Bool {
    Runtime.trap("not implemented");
  };

  public func rejectItem(id : Text, rejectedBy : Text, notes : Text) : async Bool {
    Runtime.trap("not implemented");
  };

  public func snoozeItem(id : Text, snoozedUntil : Int) : async Bool {
    Runtime.trap("not implemented");
  };
};
