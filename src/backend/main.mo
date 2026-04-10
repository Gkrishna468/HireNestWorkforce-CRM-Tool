import T "types/entities";
import EntitiesApi "mixins/entities-api";
import WorkflowApi "mixins/workflow-api";
import JobsApi "mixins/jobs-api";
import MetricsApi "mixins/metrics-api";
import ApprovalsApi "mixins/approvals-api";
import DashboardApi "mixins/dashboard-api";
import BenchApi "mixins/bench-api";
import Map "mo:core/Map";
import List "mo:core/List";

actor {
  // ── Shared State ───────────────────────────────────────────────────────────
  let vendors    : Map.Map<Text, T.Vendor>    = Map.empty();
  let clients    : Map.Map<Text, T.Client>    = Map.empty();
  let recruiters : Map.Map<Text, T.Recruiter> = Map.empty();
  let candidates : Map.Map<Text, T.Candidate> = Map.empty();
  let jobs       : Map.Map<Text, T.Job>       = Map.empty();

  let activities       : List.List<T.Activity>        = List.empty();
  let followUps        : List.List<T.FollowUp>         = List.empty();
  let approvals        : List.List<T.ApprovalItem>     = List.empty();
  let submissions      : List.List<T.Submission>       = List.empty();
  let recruiterMetrics : List.List<T.RecruiterMetrics> = List.empty();
  let vendorMetrics    : List.List<T.VendorMetrics>    = List.empty();

  // ── Bench State ────────────────────────────────────────────────────────────
  let benchRecords : Map.Map<Nat, T.BenchRecord> = Map.empty();
  let benchCounter : [var Nat] = [var 0];

  var idCounter : Nat = 0;

  // ── Mixin Composition ──────────────────────────────────────────────────────
  include EntitiesApi(vendors, idCounter);
  include WorkflowApi(activities, followUps, idCounter);
  include JobsApi(jobs, submissions, idCounter);
  include MetricsApi(recruiterMetrics, vendorMetrics, idCounter);
  include ApprovalsApi(approvals, idCounter);
  include DashboardApi(vendors, clients, recruiters, candidates, jobs, activities, followUps, approvals, recruiterMetrics, idCounter);
  include BenchApi(benchRecords, benchCounter, jobs);
};
