import T "../types/entities";
import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";

// Mixin exposing Vendor Bench List operations.
// Standard upload format: VendorName, CandidateName, Role, Experience, Skill, Rate
mixin (
  benchRecords : Map.Map<Nat, T.BenchRecord>,
  benchCounter : [var Nat],
  jobs         : Map.Map<Text, T.Job>,
) {
  // ── Private Helpers ───────────────────────────────────────────────────────

  // Tokenise text into lower-case words, splitting on spaces and commas
  func tokenise(t : Text) : [Text] {
    let withCommas = t.replace(#char ',', " ");
    let iter = withCommas.split(#char ' ');
    let tokens = List.empty<Text>();
    for (tok in iter) {
      let trimmed = tok.trim(#char ' ');
      if (not trimmed.isEmpty()) {
        tokens.add(trimmed.toLower());
      };
    };
    tokens.toArray()
  };

  // Count how many tokens from `needles` appear in `haystack` (exact word overlap)
  func countOverlap(needles : [Text], haystack : [Text]) : Nat {
    var count = 0;
    for (n in needles.values()) {
      for (h in haystack.values()) {
        if (n == h) { count += 1 };
      };
    };
    count
  };

  // Return the larger of two Floats
  func floatMax(a : Float, b : Float) : Float {
    if (a > b) a else b
  };

  // Clamp a Float to [0.0, 1.0]
  func clamp01(x : Float) : Float {
    if (x < 0.0) 0.0
    else if (x > 1.0) 1.0
    else x
  };

  // Compute 0-1 match score between a bench record and a job
  func computeScore(record : T.BenchRecord, job : T.Job) : Float {
    let jobTitleTokens = tokenise(job.title);
    let jobReqTokens   = tokenise(job.requirements);
    let roleTokens     = tokenise(record.role);
    let skillTokens    = tokenise(record.skill);

    // Role score: keyword overlap between bench role and job title
    let roleMax  = floatMax(
      jobTitleTokens.size().toFloat(),
      roleTokens.size().toFloat(),
    );
    let roleScore : Float = if (roleMax == 0.0) 0.0 else
      countOverlap(roleTokens, jobTitleTokens).toFloat() / roleMax;

    // Skill score: keyword overlap between bench skills and job requirements
    let skillMax = floatMax(
      jobReqTokens.size().toFloat(),
      skillTokens.size().toFloat(),
    );
    let skillScore : Float = if (skillMax == 0.0) 0.0 else
      countOverlap(skillTokens, jobReqTokens).toFloat() / skillMax;

    // Weighted average: 40% role + 60% skill, clamped to [0, 1]
    clamp01(roleScore * 0.4 + skillScore * 0.6)
  };

  // ── Public API ────────────────────────────────────────────────────────────

  /// Bulk-upload bench records parsed from CSV/Excel.
  /// Expected format per row: VendorName, CandidateName, Role, Experience, Skill, Rate
  /// Returns count of records stored on success.
  public func uploadBenchRecords(records : [T.BenchRecordInput]) : async { #ok : Nat; #err : Text } {
    let now = Time.now();
    var count = 0;
    for (input in records.values()) {
      let id = benchCounter[0];
      benchCounter[0] += 1;
      benchRecords.add(id, {
        id;
        vendorName    = input.vendorName;
        candidateName = input.candidateName;
        role          = input.role;
        experience    = input.experience;
        skill         = input.skill;
        rate          = input.rate;
        importedAt    = now;
      });
      count += 1;
    };
    #ok count
  };

  /// List bench records with optional case-insensitive substring filters.
  public query func listBench(
    vendorFilter : ?Text,
    roleFilter   : ?Text,
    skillFilter  : ?Text,
  ) : async [T.BenchRecord] {
    let vf = switch (vendorFilter) { case (?v) v.toLower(); case null "" };
    let rf = switch (roleFilter)   { case (?r) r.toLower(); case null "" };
    let sf = switch (skillFilter)  { case (?s) s.toLower(); case null "" };

    let results = List.empty<T.BenchRecord>();
    for ((_, record) in benchRecords.entries()) {
      let matchVendor = vf == "" or record.vendorName.toLower().contains(#text vf);
      let matchRole   = rf == "" or record.role.toLower().contains(#text rf);
      let matchSkill  = sf == "" or record.skill.toLower().contains(#text sf);
      if (matchVendor and matchRole and matchSkill) {
        results.add(record);
      };
    };
    results.toArray()
  };

  /// Match bench records against an open job requirement.
  /// Returns top 15 records with matchScore > 0, sorted descending by score.
  public query func matchBench(jobId : Text) : async [T.BenchMatch] {
    let job = switch (jobs.get(jobId)) {
      case null { return [] };
      case (?j) { j };
    };

    // Score every bench record, collect those with score > 0
    let scored = List.empty<T.BenchMatch>();
    for ((_, record) in benchRecords.entries()) {
      let score = computeScore(record, job);
      if (score > 0.0) {
        scored.add({
          id            = record.id;
          vendorName    = record.vendorName;
          candidateName = record.candidateName;
          role          = record.role;
          experience    = record.experience;
          skill         = record.skill;
          rate          = record.rate;
          importedAt    = record.importedAt;
          matchScore    = score;
        });
      };
    };

    // Sort descending by matchScore
    let arr = scored.toArray();
    let sorted = arr.sort(func(a : T.BenchMatch, b : T.BenchMatch) : { #less; #equal; #greater } {
      if (b.matchScore > a.matchScore) #less
      else if (b.matchScore < a.matchScore) #greater
      else #equal
    });

    // Return top 15
    if (sorted.size() <= 15) sorted
    else sorted.sliceToArray(0, 15)
  };

  /// Delete a single bench record by id.
  public func deleteBenchRecord(id : Nat) : async { #ok : Bool; #err : Text } {
    switch (benchRecords.get(id)) {
      case null { #err ("Record " # id.toText() # " not found") };
      case (?_) {
        benchRecords.remove(id);
        #ok true
      };
    }
  };
};
