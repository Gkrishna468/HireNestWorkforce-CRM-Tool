module {
  // Cross-cutting identifier and timestamp types
  public type EntityId = Text;
  public type Timestamp = Int;
  public type DateStr = Text; // ISO date string e.g. "2026-04-10"

  // Entity classification
  public type EntityType = {
    #vendor;
    #client;
    #recruiter;
    #candidate;
  };

  // Health signal
  public type HealthStatus = {
    #green;
    #yellow;
    #red;
  };
};
