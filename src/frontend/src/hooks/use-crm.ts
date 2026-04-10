import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import * as api from "../lib/api";
import type {
  ApprovalStatus,
  BenchMatch,
  BenchRecord,
  BenchRecordInput,
  FollowUpStatus,
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
  submissionsForCandidate: (candidateId: string) =>
    ["submissions", "candidate", candidateId] as const,
  recruiterMetrics: (recruiterId: string) =>
    ["recruiter-metrics", recruiterId] as const,
  pipelineStages: ["pipeline-stages"] as const,
  bench: ["bench"] as const,
  benchMatch: (jobId: string) => ["bench-match", jobId] as const,
};

// ── Helper ────────────────────────────────────────────────────────────────────

function useActorQuery() {
  const { actor, isFetching } = useActor(createActor);
  return { actor, ready: !!actor && !isFetching };
}

// ── Vendors ───────────────────────────────────────────────────────────────────

export function useVendors() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.vendors,
    queryFn: () => api.getVendors(actor),
    enabled: ready,
  });
}

export function useCreateVendor() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: VendorFormInput) => api.createVendor(actor, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.vendors }),
  });
}

export function useUpdateVendor() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<VendorFormInput> }) =>
      api.updateVendor(actor, id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendors });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useDeleteVendor() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (id: string) => api.deleteVendor(actor, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendors });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

// ── Clients ───────────────────────────────────────────────────────────────────

export function useClients() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.clients,
    queryFn: () => api.getClients(actor),
    enabled: ready,
  });
}

export function useCreateClient() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: ClientFormInput) => api.createClient(actor, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.clients }),
  });
}

export function useUpdateClient() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<ClientFormInput> }) =>
      api.updateClient(actor, id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.clients });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useDeleteClient() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (id: string) => api.deleteClient(actor, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.clients });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

// ── Recruiters ────────────────────────────────────────────────────────────────

export function useRecruiters() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.recruiters,
    queryFn: () => api.getRecruiters(actor),
    enabled: ready,
  });
}

export function useCreateRecruiter() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: RecruiterFormInput) =>
      api.createRecruiter(actor, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.recruiters }),
  });
}

export function useUpdateRecruiter() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<RecruiterFormInput> }) =>
      api.updateRecruiter(actor, id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.recruiters });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useDeleteRecruiter() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (id: string) => api.deleteRecruiter(actor, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.recruiters });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

// ── Candidates ────────────────────────────────────────────────────────────────

export function useCandidates() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.candidates,
    queryFn: () => api.getCandidates(actor),
    enabled: ready,
  });
}

export function useCreateCandidate() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: CandidateFormInput) =>
      api.createCandidate(actor, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.candidates }),
  });
}

export function useUpdateCandidate() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({
      id,
      input,
    }: { id: string; input: Partial<CandidateFormInput> }) =>
      api.updateCandidate(actor, id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.candidates });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useDeleteCandidate() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (id: string) => api.deleteCandidate(actor, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.candidates });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
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
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({
      entityId,
      entityType,
      newStage,
    }: { entityId: string; entityType: string; newStage: string }) =>
      api.updateEntityStage(actor, entityId, entityType, newStage),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.vendors });
      qc.invalidateQueries({ queryKey: QK.clients });
      qc.invalidateQueries({ queryKey: QK.recruiters });
      qc.invalidateQueries({ queryKey: QK.candidates });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

// ── Activities ────────────────────────────────────────────────────────────────

export function useActivities(entityId: string) {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.activities(entityId),
    queryFn: () => api.listActivities(actor, entityId),
    enabled: ready && !!entityId,
  });
}

export function useLogActivity() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: ActivityFormInput) => api.logActivity(actor, input),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: QK.activities(variables.entityId) });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
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
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.jobs,
    queryFn: () => api.getJobs(actor),
    enabled: ready,
  });
}

export function useJobsForClient(clientId: string) {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.jobsForClient(clientId),
    queryFn: () => api.getJobsForClient(actor, clientId),
    enabled: ready && !!clientId,
  });
}

export function useCreateJob() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: JobFormInput) => api.createJob(actor, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.jobs }),
  });
}

export function useUpdateJob() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<JobFormInput> }) =>
      api.updateJob(actor, id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.jobs }),
  });
}

// ── Submissions ───────────────────────────────────────────────────────────────

export function useSubmissions() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.submissions,
    queryFn: () => api.getSubmissions(actor),
    enabled: ready,
  });
}

export function useSubmissionsForJob(jobId: string) {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.submissionsForJob(jobId),
    queryFn: () => api.getSubmissionsForJob(actor, jobId),
    enabled: ready && !!jobId,
  });
}

export function useSubmissionsForCandidate(candidateId: string) {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.submissionsForCandidate(candidateId),
    queryFn: () => api.getSubmissionsForCandidate(actor, candidateId),
    enabled: ready && !!candidateId,
  });
}

export function useCreateSubmission() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: SubmissionFormInput) =>
      api.createSubmission(actor, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.submissions }),
  });
}

export function useUpdateSubmission() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: SubmissionStatus }) =>
      api.updateSubmission(actor, id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.submissions }),
  });
}

// ── Approvals ─────────────────────────────────────────────────────────────────

export function usePendingApprovals() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.pendingApprovals,
    queryFn: () => api.listPendingApprovals(actor),
    enabled: ready,
    refetchInterval: POLL_INTERVAL,
  });
}

export function useApprovalHistory() {
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: QK.approvalHistory,
    queryFn: () => api.listApprovalHistory(actor),
    enabled: ready,
  });
}

export function useApproveItem() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({ id, approvedBy }: { id: string; approvedBy: string }) =>
      api.approveItem(actor, id, approvedBy),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.approvalHistory });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useRejectItem() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({
      id,
      rejectedBy,
      notes,
    }: { id: string; rejectedBy: string; notes?: string }) =>
      api.rejectItem(actor, id, rejectedBy, notes),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.approvalHistory });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useSnoozeItem() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({ id, snoozedUntil }: { id: string; snoozedUntil: number }) =>
      api.snoozeItem(actor, id, snoozedUntil),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.pulseDashboard });
    },
  });
}

export function useCreateApprovalItem() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (input: ApprovalFormInput) =>
      api.createApprovalItem(actor, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.pendingApprovals }),
  });
}

export function useUpdateApprovalItem() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApprovalStatus }) =>
      api.updateApprovalItem(actor, id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.pendingApprovals });
      qc.invalidateQueries({ queryKey: QK.approvalHistory });
    },
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
    queryFn: () => api.getPulseDashboard(actor),
    enabled: ready,
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
  const { actor, ready } = useActorQuery();
  return useQuery({
    queryKey: [...QK.bench, filters],
    queryFn: () => api.getBenchRecords(actor, filters),
    enabled: ready,
  });
}

export function useUploadBench() {
  const qc = useQueryClient();
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (records: BenchRecordInput[]) =>
      api.uploadBenchRecords(actor, records),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.bench });
    },
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
  const { actor } = useActorQuery();
  return useMutation({
    mutationFn: (id: number) => api.deleteBenchRecord(actor, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.bench });
    },
  });
}
