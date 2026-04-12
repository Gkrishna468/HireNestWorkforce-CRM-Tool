import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createActor } from "../backend";
import * as api from "../lib/api";
import { scoreJobMatch } from "../lib/resumeParser";
import { SupabaseNotConfiguredError, getSupabaseCreds } from "../lib/supabase";
import type {
  ApprovalStatus,
  BenchRecord,
  BenchRecordInput,
  FollowUpStatus,
  FuzzyDuplicateMatch,
  Resume,
  ResumeMatch,
  SubmissionStatus,
} from "../types/crm";
import type {
  ActivityFormInput,
  ApprovalFormInput,
  CandidateFormInput,
  ClientFormInput,
  FollowUpFormInput,
  JobFormInput,
  RecruiterFormInput,
  RecruiterMetricsFormInput,
  SubmissionFormInput,
  SubmissionUpdateInput,
  VendorFormInput,
  VendorMetricsFormInput,
} from "../types/forms";

const POLL_INTERVAL = 120_000; // 2 minutes

// ── Query Keys ────────────────────────────────────────────────────────────────

export const QK = {
  vendors: ["vendors"] as const,
  clients: ["clients"] as const,
  recruiters: ["recruiters"] as const,
  candidates: ["candidates"] as const,
  pulseDashboard: ["pulse-dashboard"] as const,
  morningBriefing: ["morning-briefing"] as const,
  followUps: ["follow-ups"] as const,
  pendingFollowUps: ["follow-ups", "pending"] as const,
  pendingApprovals: ["approvals", "pending"] as const,
  approvalHistory: ["approvals", "history"] as const,
  activities: (entityId: string) => ["activities", entityId] as const,
  jobs: ["jobs"] as const,
  jobsForClient: (clientId: string) => ["jobs", "client", clientId] as const,
  submissions: ["submissions"] as const,
  submissionsForJob: (jobId: string) => ["submissions", "job", jobId] as const,
  submissionsForVendor: (vendorId: string) =>
    ["submissions", "vendor", vendorId] as const,
  submissionsForCandidate: (candidateId: string) =>
    ["submissions", "candidate", candidateId] as const,
  recruiterMetrics: (recruiterId: string) =>
    ["recruiter-metrics", recruiterId] as const,
  pipelineStages: ["pipeline-stages"] as const,
  bench: ["bench"] as const,
  benchMatch: (jobId: string) => ["bench-match", jobId] as const,
  resumes: ["resumes"] as const,
  clientJobLinks: (clientId: string) => ["client-job-links", clientId] as const,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function useActorQuery() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, ready: !!actor && !isFetching };
}

/** Check Supabase credentials and show a toast if missing */
function checkSupabaseOrThrow() {
  const creds = getSupabaseCreds();
  if (!creds) {
    toast.error("Supabase not connected", {
      description:
        "Go to Settings → Integrations to add your Supabase credentials before saving data.",
      duration: 6000,
    });
    throw new SupabaseNotConfiguredError();
  }
}

function handleMutationError(err: unknown) {
  if (err instanceof SupabaseNotConfiguredError) {
    // already toasted in checkSupabaseOrThrow
    return;
  }
  const msg =
    err instanceof Error ? err.message : "An unexpected error occurred";
  toast.error(msg);
}

// ── Vendors ───────────────────────────────────────────────────────────────────

export function useVendors() {
  return useQuery({
    queryKey: QK.vendors,
    queryFn: () => api.getVendors(null),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: VendorFormInput) => {
      checkSupabaseOrThrow();
      return api.createVendor(null, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.vendors }),
    onError: handleMutationError,
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<VendorFormInput> }) => {
      checkSupabaseOrThrow();
      return api.updateVendor(null, id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendors });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

export function useDeleteVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      checkSupabaseOrThrow();
      return api.deleteVendor(null, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendors });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

// ── Clients ───────────────────────────────────────────────────────────────────

export function useClients() {
  return useQuery({
    queryKey: QK.clients,
    queryFn: () => api.getClients(null),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ClientFormInput) => {
      checkSupabaseOrThrow();
      return api.createClient(null, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.clients }),
    onError: handleMutationError,
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<ClientFormInput> }) => {
      checkSupabaseOrThrow();
      return api.updateClient(null, id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.clients });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      checkSupabaseOrThrow();
      return api.deleteClient(null, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.clients });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

// ── Recruiters ────────────────────────────────────────────────────────────────

export function useRecruiters() {
  return useQuery({
    queryKey: QK.recruiters,
    queryFn: () => api.getRecruiters(null),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateRecruiter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RecruiterFormInput) => {
      checkSupabaseOrThrow();
      return api.createRecruiter(null, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.recruiters }),
    onError: handleMutationError,
  });
}

export function useUpdateRecruiter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<RecruiterFormInput> }) => {
      checkSupabaseOrThrow();
      return api.updateRecruiter(null, id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.recruiters });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

export function useDeleteRecruiter() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      checkSupabaseOrThrow();
      return api.deleteRecruiter(null, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.recruiters });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

// ── Candidates ────────────────────────────────────────────────────────────────

export function useCandidates() {
  return useQuery({
    queryKey: QK.candidates,
    queryFn: () => api.getCandidates(null),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CandidateFormInput) => {
      checkSupabaseOrThrow();
      return api.createCandidate(null, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.candidates }),
    onError: handleMutationError,
  });
}

export function useUpdateCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<CandidateFormInput> }) => {
      checkSupabaseOrThrow();
      return api.updateCandidate(null, id, input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.candidates });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

export function useDeleteCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      checkSupabaseOrThrow();
      return api.deleteCandidate(null, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.candidates });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

export function usePipelineStages() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.pipelineStages,
    queryFn: () => api.getPipelineStages(actor),
    enabled: ready,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateEntityStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      entityId,
      entityType,
      newStage,
    }: { entityId: string; entityType: string; newStage: string }) => {
      checkSupabaseOrThrow();
      return api.updateEntityStage(null, entityId, entityType, newStage);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendors });
      qc.invalidateQueries({ queryKey: QK.clients });
      qc.invalidateQueries({ queryKey: QK.recruiters });
      qc.invalidateQueries({ queryKey: QK.candidates });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

// ── Activities ────────────────────────────────────────────────────────────────

export function useActivities(entityId: string) {
  return useQuery({
    queryKey: QK.activities(entityId),
    queryFn: () => api.listActivities(null, entityId),
    enabled: !!entityId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useLogActivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ActivityFormInput) => {
      checkSupabaseOrThrow();
      return api.logActivity(null, input);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: QK.activities(variables.entityId) });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

// ── Follow-Ups ────────────────────────────────────────────────────────────────

export function useFollowUps() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.followUps,
    queryFn: () => api.listFollowUps(actor),
    enabled: ready,
    refetchInterval: POLL_INTERVAL,
  });
}

export function usePendingFollowUps() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.pendingFollowUps,
    queryFn: () => api.listPendingFollowUps(actor),
    enabled: ready,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useUpdateFollowUpStatus() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({
      id,
      status,
      approvedBy,
      snoozedUntil,
    }: {
      id: string;
      status: FollowUpStatus;
      approvedBy?: string;
      snoozedUntil?: number;
    }) => api.updateFollowUpStatus(actor, id, status, approvedBy, snoozedUntil),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.followUps });
      qc.invalidateQueries({ queryKey: QK.pendingFollowUps });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useRunFollowUpEngine() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: () => api.runFollowUpEngine(actor),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.followUps });
      qc.invalidateQueries({ queryKey: QK.pendingFollowUps });
    },
  });
}

// ── Jobs ──────────────────────────────────────────────────────────────────────

export function useJobs() {
  return useQuery({
    queryKey: QK.jobs,
    queryFn: () => api.getJobs(null),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useJobsForClient(clientId: string) {
  return useQuery({
    queryKey: QK.jobsForClient(clientId),
    queryFn: () => api.getJobsForClient(null, clientId),
    enabled: !!clientId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: JobFormInput) => {
      checkSupabaseOrThrow();
      return api.createJob(null, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.jobs }),
    onError: handleMutationError,
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<JobFormInput> }) => {
      checkSupabaseOrThrow();
      return api.updateJob(null, id, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.jobs }),
    onError: handleMutationError,
  });
}

export function useUpdateJobStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: { id: string; status: "open" | "filled" | "closed" | "on_hold" }) => {
      checkSupabaseOrThrow();
      return api.updateJobStatus(null, id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.jobs }),
    onError: handleMutationError,
  });
}

// ── Submissions ───────────────────────────────────────────────────────────────

export function useSubmissions() {
  return useQuery({
    queryKey: QK.submissions,
    queryFn: () => api.getSubmissions(null),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useSubmissionsForJob(jobId: string) {
  return useQuery({
    queryKey: QK.submissionsForJob(jobId),
    queryFn: () => api.getSubmissionsForJob(null, jobId),
    enabled: !!jobId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useSubmissionsForVendor(vendorId: string) {
  return useQuery({
    queryKey: QK.submissionsForVendor(vendorId),
    queryFn: () => api.getSubmissionsForVendor(null, vendorId),
    enabled: !!vendorId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useSubmissionsForCandidate(candidateId: string) {
  return useQuery({
    queryKey: QK.submissionsForCandidate(candidateId),
    queryFn: () => api.getSubmissionsForCandidate(null, candidateId),
    enabled: !!candidateId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useSubmissionsForResume(resumeId: string) {
  return useQuery({
    queryKey: ["submissions", "resume", resumeId] as const,
    queryFn: () => api.getSubmissionsForResume(null, resumeId),
    enabled: !!resumeId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmissionFormInput) => {
      checkSupabaseOrThrow();
      return api.createSubmission(null, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.submissions }),
    onError: handleMutationError,
  });
}

export function useUpdateSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch:
        | SubmissionStatus
        | { status?: SubmissionStatus; pipeline_stage?: string };
    }) => {
      checkSupabaseOrThrow();
      return api.updateSubmission(null, id, patch);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.submissions });
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: handleMutationError,
  });
}

export function useUpdateSubmissionStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      update,
    }: { id: string; update: SubmissionUpdateInput; jobId?: string }) => {
      checkSupabaseOrThrow();
      return api.updateSubmissionStage(id, update);
    },
    onSuccess: (_data, variables) => {
      // Invalidate all submission query variants so job-scoped and vendor-scoped
      // views re-fetch automatically after a stage change.
      qc.invalidateQueries({ queryKey: QK.submissions });
      qc.invalidateQueries({ queryKey: ["submissions"] });
      // If a jobId hint was passed, also invalidate that job-scoped key.
      if (variables.jobId) {
        qc.invalidateQueries({
          queryKey: QK.submissionsForJob(variables.jobId),
        });
      }
    },
    onError: handleMutationError,
  });
}

export function useSoftDeleteSubmission() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      checkSupabaseOrThrow();
      return api.softDeleteSubmission(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.submissions });
      qc.invalidateQueries({ queryKey: ["submissions"] });
    },
    onError: handleMutationError,
  });
}

// ── Approvals ─────────────────────────────────────────────────────────────────

export function usePendingApprovals() {
  return useQuery({
    queryKey: QK.pendingApprovals,
    queryFn: () => api.listPendingApprovals(null),
    enabled: !!getSupabaseCreds(),
    refetchInterval: POLL_INTERVAL,
    retry: false,
  });
}

export function useApprovalHistory() {
  return useQuery({
    queryKey: QK.approvalHistory,
    queryFn: () => api.listApprovalHistory(null),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useApproveItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approvedBy }: { id: string; approvedBy: string }) => {
      checkSupabaseOrThrow();
      return api.approveItem(null, id, approvedBy);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.approvalHistory });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

export function useRejectItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      rejectedBy,
      notes,
    }: { id: string; rejectedBy: string; notes?: string }) => {
      checkSupabaseOrThrow();
      return api.rejectItem(null, id, rejectedBy, notes);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.approvalHistory });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

export function useSnoozeItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      snoozedUntil,
    }: { id: string; snoozedUntil: number }) => {
      checkSupabaseOrThrow();
      return api.snoozeItem(null, id, snoozedUntil);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
    onError: handleMutationError,
  });
}

export function useCreateApprovalItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ApprovalFormInput) => {
      checkSupabaseOrThrow();
      return api.createApprovalItem(null, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.pendingApprovals }),
    onError: handleMutationError,
  });
}

export function useUpdateApprovalItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApprovalStatus }) => {
      checkSupabaseOrThrow();
      return api.updateApprovalItem(null, id, status);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.approvalHistory });
    },
    onError: handleMutationError,
  });
}

// ── Recruiter Metrics ─────────────────────────────────────────────────────────

export function useRecruiterMetrics(recruiterId: string) {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.recruiterMetrics(recruiterId),
    queryFn: () => api.getRecruiterMetricsHistory(actor, recruiterId),
    enabled: ready && !!recruiterId,
  });
}

export function useLogRecruiterMetrics() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: RecruiterMetricsFormInput) =>
      api.logRecruiterMetrics(actor, input),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: QK.recruiterMetrics(variables.recruiterId),
      });
    },
  });
}

export function useLogVendorMetrics() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: VendorMetricsFormInput) =>
      api.logVendorMetrics(actor, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendors });
    },
  });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

export function usePulseDashboard() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.pulseDashboard,
    queryFn: () => {
      if (getSupabaseCreds()) return api.getPulseDashboard(null);
      return api.getPulseDashboard(actor);
    },
    enabled: ready || !!getSupabaseCreds(),
    refetchInterval: POLL_INTERVAL,
  });
}

export function useMorningBriefing() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.morningBriefing,
    queryFn: () => api.getMorningBriefing(actor),
    enabled: ready,
    staleTime: 30 * 60_000,
  });
}

export function useSeedSampleData() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: () => api.seedSampleData(actor),
    onSuccess: () => {
      qc.invalidateQueries();
    },
  });
}

// ── Bench ──────────────────────────────────────────────────────────────────────

export function useBenchRecords(filters?: {
  vendor?: string;
  role?: string;
  skill?: string;
}) {
  return useQuery({
    queryKey: [...QK.bench, filters],
    queryFn: () => api.getBenchRecords(null, filters),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useUploadBench() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (records: BenchRecordInput[]) => {
      checkSupabaseOrThrow();
      return api.uploadBenchRecords(null, records);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.bench });
      qc.invalidateQueries({ queryKey: ["bench-match"] });
    },
    onError: handleMutationError,
  });
}

export function useMatchBench(jobId: string) {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.benchMatch(jobId),
    queryFn: () => api.matchBench(actor, jobId),
    enabled: ready && !!jobId,
  });
}

export function useDeleteBenchRecord() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      checkSupabaseOrThrow();
      return api.deleteBenchRecord(null, id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.bench });
    },
    onError: handleMutationError,
  });
}

// ── Re-exports for type usage ─────────────────────────────────────────────────
export type { BenchRecord, BenchRecordInput };
export type { FuzzyDuplicateMatch, Resume, ResumeMatch };

export function useResumes() {
  return useQuery<Resume[]>({
    queryKey: QK.resumes,
    queryFn: () => api.getResumes(),
    enabled: !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      fileName: string;
      fileUrl?: string;
      candidateName: string;
      email?: string;
      phone?: string;
      extractedSkills: string[];
      extractedExperience: string;
      extractedRole: string;
      rawText: string;
      status?: "pending" | "active" | "duplicate" | "archived";
      availability?: string;
      duplicateOf?: string;
      yearsExperience?: number;
      location?: string;
      sourceVendorId?: string;
    }) => {
      checkSupabaseOrThrow();
      return api.createResume(input);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.resumes });
      // Sync candidates list — createResume also inserts a candidate row
      qc.invalidateQueries({ queryKey: QK.candidates });
    },
    onError: handleMutationError,
  });
}

export function useDeleteResume() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      checkSupabaseOrThrow();
      return api.deleteResume(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.resumes }),
    onError: handleMutationError,
  });
}

export function useCheckDuplicateResume() {
  return useMutation({
    mutationFn: (email: string) => api.checkDuplicateResume(email),
    onError: handleMutationError,
  });
}

export function useFindSimilarCandidates() {
  return useMutation({
    mutationFn: (params: {
      inputName: string;
      inputPhone: string | null;
      inputSkills: string[];
    }) => api.findSimilarCandidates(params),
    // Non-fatal — silently ignore errors (RPC may not exist yet)
  });
}

export function useListSubmissionsForResume(resumeId: string | undefined) {
  return useQuery({
    queryKey: ["submissions", "resume", resumeId ?? ""] as const,
    queryFn: () => api.listSubmissionsForResume(resumeId ?? ""),
    enabled: !!resumeId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useResumeJobMatches(resume: Resume | null) {
  return useQuery<ResumeMatch[]>({
    queryKey: ["resume-matches", resume?.id ?? ""],
    queryFn: async () => {
      if (!resume) return [];
      const jobs = await api.getJobsForMatching();
      const matches: ResumeMatch[] = jobs
        .map((job) => {
          const { score, matchedKeywords } = scoreJobMatch(
            resume.extractedSkills,
            resume.extractedRole,
            resume.extractedExperience,
            job,
          );
          return {
            jobId: job.id,
            jobTitle: job.title,
            clientName: job.clientName ?? "",
            totalScore: score,
            skillsScore: Math.round(score * 0.6),
            expScore: Math.round(score * 0.2),
            rateScore: Math.round(score * 0.15),
            availScore: Math.round(score * 0.05),
            matchedSkills: matchedKeywords,
            missingSkills: [],
          };
        })
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 10);
      return matches;
    },
    enabled: !!resume && !!getSupabaseCreds(),
    retry: false,
  });
}

// ── Client Job Links ──────────────────────────────────────────────────────────

export function useClientJobLinks(clientId: string) {
  return useQuery({
    queryKey: QK.clientJobLinks(clientId),
    queryFn: () => api.getClientJobLinks(clientId),
    enabled: !!clientId && !!getSupabaseCreds(),
    retry: false,
  });
}

export function useCreateClientJobLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, jobId }: { clientId: string; jobId: string }) => {
      checkSupabaseOrThrow();
      return api.createClientJobLink(clientId, jobId);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: QK.clientJobLinks(variables.clientId),
      });
      qc.invalidateQueries({ queryKey: QK.jobs });
    },
    onError: handleMutationError,
  });
}

export function useSoftDeleteClientJobLink() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, jobId }: { clientId: string; jobId: string }) => {
      checkSupabaseOrThrow();
      return api.softDeleteClientJobLink(clientId, jobId);
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: QK.clientJobLinks(variables.clientId),
      });
    },
    onError: handleMutationError,
  });
}
