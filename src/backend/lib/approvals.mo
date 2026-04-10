import T "../types/entities";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

module {
  // ── Approval Queue Operations ─────────────────────────────────────────────
  public func createApprovalItem(
    approvals : List.List<T.ApprovalItem>,
    id : Text,
    itemType : Text,
    entityId : Text,
    entityType : T.EntityType,
    entityName : Text,
    description : Text,
    details : Text,
    requestedBy : Text,
    now : Int,
  ) : T.ApprovalItem {
    Runtime.trap("not implemented");
  };

  public func updateApprovalItem(approvals : List.List<T.ApprovalItem>, updated : T.ApprovalItem) : Bool {
    Runtime.trap("not implemented");
  };

  public func listPendingApprovals(approvals : List.List<T.ApprovalItem>) : [T.ApprovalItem] {
    Runtime.trap("not implemented");
  };

  public func listApprovalHistory(approvals : List.List<T.ApprovalItem>) : [T.ApprovalItem] {
    Runtime.trap("not implemented");
  };

  public func approveItem(
    approvals : List.List<T.ApprovalItem>,
    id : Text,
    approvedBy : Text,
    now : Int,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func rejectItem(
    approvals : List.List<T.ApprovalItem>,
    id : Text,
    rejectedBy : Text,
    notes : Text,
    now : Int,
  ) : Bool {
    Runtime.trap("not implemented");
  };

  public func snoozeItem(
    approvals : List.List<T.ApprovalItem>,
    id : Text,
    snoozedUntil : Int,
    now : Int,
  ) : Bool {
    Runtime.trap("not implemented");
  };
};
