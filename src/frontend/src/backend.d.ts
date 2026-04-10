import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Candidate {
    id: EntityId;
    placementProbability: bigint;
    source: string;
    name: string;
    createdAt: Timestamp;
    salaryExpectation: number;
    email: string;
    experience: string;
    availability: string;
    pipelineStage: string;
    daysInStage: bigint;
    healthScore: bigint;
    phone: string;
    lastActivityAt: Timestamp;
    lastContact: Timestamp;
    skills: string;
}
export type Timestamp = bigint;
export interface PulseRow {
    healthStatus: HealthStatus;
    pipelineStage: string;
    entityId: EntityId;
    actionNeeded: string;
    entityName: string;
    entityType: EntityType;
    healthScore: bigint;
    lastActivityAt: Timestamp;
}
export interface MorningBriefing {
    clientInterviewsToday: bigint;
    staleCandidates: bigint;
    recruiterSummaries: Array<RecruiterSummary>;
    vendorFollowUps: bigint;
    pendingApprovals: bigint;
    date: string;
    generatedAt: Timestamp;
    aiSuggestions: Array<string>;
    pendingOfferApprovals: bigint;
}
export interface Recruiter {
    id: EntityId;
    productivityScore: bigint;
    emailsToday: bigint;
    name: string;
    createdAt: Timestamp;
    tasksCompleted: bigint;
    email: string;
    interviewsScheduled: bigint;
    pipelineStage: string;
    callsToday: bigint;
    healthScore: bigint;
    phone: string;
    lastActivityAt: Timestamp;
    submissionsToday: bigint;
}
export type EntityId = string;
export interface RecruiterMetrics {
    id: EntityId;
    emailsSent: bigint;
    productivityScore: bigint;
    date: string;
    recruiterId: EntityId;
    tasksCompleted: bigint;
    callsMade: bigint;
    submissions: bigint;
    interviewsScheduled: bigint;
    notes: string;
}
export interface BenchRecordInput {
    rate: number;
    role: string;
    experience: string;
    skill: string;
    candidateName: string;
    vendorName: string;
}
export interface RecruiterSummary {
    productivityScore: bigint;
    name: string;
    recruiterId: EntityId;
    callsToday: bigint;
    submissionsToday: bigint;
    flagged: boolean;
}
export interface VendorMetrics {
    id: EntityId;
    date: string;
    placements: bigint;
    submissionsAccepted: bigint;
    submissions: bigint;
    interviewsScheduled: bigint;
    qualityScore: number;
    vendorId: EntityId;
    responseTimeHours: number;
}
export interface PulseDashboard {
    generatedAt: Timestamp;
    rows: Array<PulseRow>;
}
export interface BenchRecord {
    id: bigint;
    rate: number;
    role: string;
    importedAt: Timestamp;
    experience: string;
    skill: string;
    candidateName: string;
    vendorName: string;
}
export interface Job {
    id: EntityId;
    status: string;
    title: string;
    clientId: EntityId;
    createdAt: Timestamp;
    rateMax: number;
    rateMin: number;
    filledAt?: Timestamp;
    requirements: string;
}
export interface Activity {
    id: EntityId;
    direction: string;
    activityType: string;
    approvedAt?: Timestamp;
    approvedBy?: string;
    createdAt: Timestamp;
    createdBy: string;
    entityId: EntityId;
    notes: string;
    requiresApproval: boolean;
    entityType: EntityType;
}
export interface PipelineStage {
    stageOrder: bigint;
    requiresApproval: boolean;
    entityType: EntityType;
    slaHours: bigint;
    stageName: string;
}
export interface FollowUp {
    id: EntityId;
    status: string;
    triggerReason: string;
    approvedAt?: Timestamp;
    approvedBy?: string;
    createdAt: Timestamp;
    suggestedAction: string;
    sentAt?: Timestamp;
    entityId: EntityId;
    snoozedUntil?: Timestamp;
    entityType: EntityType;
    suggestedMessage: string;
}
export interface ApprovalItem {
    id: EntityId;
    status: string;
    approvedAt?: Timestamp;
    approvedBy?: string;
    description: string;
    entityId: EntityId;
    snoozedUntil?: Timestamp;
    notes?: string;
    itemType: string;
    details: string;
    entityName: string;
    entityType: EntityType;
    requestedAt: Timestamp;
    requestedBy: string;
}
export interface Client {
    id: EntityId;
    hiringManager: string;
    name: string;
    createdAt: Timestamp;
    email: string;
    company: string;
    pipelineStage: string;
    notes: string;
    healthScore: bigint;
    phone: string;
    lastActivityAt: Timestamp;
    budget: number;
    churnRisk: string;
    timeline: string;
}
export interface Vendor {
    id: EntityId;
    status: string;
    contactName: string;
    name: string;
    createdAt: Timestamp;
    rateMax: number;
    rateMin: number;
    submissionsAccepted: bigint;
    submissions: bigint;
    email: string;
    specialty: string;
    qualityScore: number;
    company: string;
    pipelineStage: string;
    notes: string;
    healthScore: bigint;
    responseTimeHours: number;
    phone: string;
    lastActivityAt: Timestamp;
}
export interface Submission {
    id: EntityId;
    rateProposed: number;
    status: string;
    approvedAt?: Timestamp;
    approvedBy?: string;
    jobId: EntityId;
    submittedAt: Timestamp;
    submittedBy: string;
    vendorId?: EntityId;
    candidateId: EntityId;
}
export interface BenchMatch {
    id: bigint;
    rate: number;
    role: string;
    importedAt: Timestamp;
    matchScore: number;
    experience: string;
    skill: string;
    candidateName: string;
    vendorName: string;
}
export enum EntityType {
    client = "client",
    vendor = "vendor",
    recruiter = "recruiter",
    candidate = "candidate"
}
export enum HealthStatus {
    red = "red",
    green = "green",
    yellow = "yellow"
}
export interface backendInterface {
    approveItem(id: string, approvedBy: string): Promise<boolean>;
    createApprovalItem(itemType: string, entityId: string, entityType: EntityType, entityName: string, description: string, details: string, requestedBy: string): Promise<ApprovalItem>;
    createCandidate(name: string, email: string, phone: string, skills: string, experience: string, source: string, salaryExpectation: number, availability: string): Promise<Candidate>;
    createClient(name: string, company: string, hiringManager: string, email: string, phone: string, budget: number, timeline: string, notes: string): Promise<Client>;
    createFollowUp(entityId: string, entityType: EntityType, triggerReason: string, suggestedAction: string, suggestedMessage: string): Promise<FollowUp>;
    createJob(clientId: string, title: string, requirements: string, rateMin: number, rateMax: number): Promise<Job>;
    createRecruiter(name: string, email: string, phone: string): Promise<Recruiter>;
    createSubmission(candidateId: string, jobId: string, vendorId: string | null, submittedBy: string, rateProposed: number): Promise<Submission>;
    createVendor(name: string, company: string, contactName: string, email: string, phone: string, specialty: string, rateMin: number, rateMax: number, notes: string): Promise<Vendor>;
    deleteBenchRecord(id: bigint): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCandidate(id: string): Promise<boolean>;
    deleteClient(id: string): Promise<boolean>;
    deleteRecruiter(id: string): Promise<boolean>;
    deleteVendor(id: string): Promise<boolean>;
    getActivitiesForEntity(entityId: string): Promise<Array<Activity>>;
    getAllActivities(): Promise<Array<Activity>>;
    getCandidate(id: string): Promise<Candidate | null>;
    getClient(id: string): Promise<Client | null>;
    getJob(id: string): Promise<Job | null>;
    getMorningBriefing(): Promise<MorningBriefing>;
    getPipelineStages(entityType: EntityType): Promise<Array<PipelineStage>>;
    getPulseDashboard(): Promise<PulseDashboard>;
    getRecruiter(id: string): Promise<Recruiter | null>;
    getRecruiterMetrics(recruiterId: string, date: string): Promise<RecruiterMetrics | null>;
    getRecruiterMetricsHistory(recruiterId: string): Promise<Array<RecruiterMetrics>>;
    getVendor(id: string): Promise<Vendor | null>;
    getVendorMetrics(vendorId: string, date: string): Promise<VendorMetrics | null>;
    listApprovalHistory(): Promise<Array<ApprovalItem>>;
    listBench(vendorFilter: string | null, roleFilter: string | null, skillFilter: string | null): Promise<Array<BenchRecord>>;
    listCandidates(): Promise<Array<Candidate>>;
    listClients(): Promise<Array<Client>>;
    listFollowUps(): Promise<Array<FollowUp>>;
    listJobs(): Promise<Array<Job>>;
    listJobsForClient(clientId: string): Promise<Array<Job>>;
    listPendingApprovals(): Promise<Array<ApprovalItem>>;
    listPendingFollowUps(): Promise<Array<FollowUp>>;
    listRecruiters(): Promise<Array<Recruiter>>;
    listSubmissions(): Promise<Array<Submission>>;
    listSubmissionsForCandidate(candidateId: string): Promise<Array<Submission>>;
    listSubmissionsForJob(jobId: string): Promise<Array<Submission>>;
    listVendors(): Promise<Array<Vendor>>;
    logActivity(entityId: string, entityType: EntityType, activityType: string, direction: string, notes: string, createdBy: string, requiresApproval: boolean): Promise<Activity>;
    logRecruiterMetrics(recruiterId: string, date: string, callsMade: bigint, emailsSent: bigint, submissions: bigint, interviewsScheduled: bigint, tasksCompleted: bigint, productivityScore: bigint, notes: string): Promise<RecruiterMetrics>;
    logVendorMetrics(vendorId: string, date: string, submissions: bigint, submissionsAccepted: bigint, interviewsScheduled: bigint, placements: bigint, responseTimeHours: number, qualityScore: number): Promise<VendorMetrics>;
    matchBench(jobId: string): Promise<Array<BenchMatch>>;
    rejectItem(id: string, rejectedBy: string, notes: string): Promise<boolean>;
    runFollowUpEngine(): Promise<bigint>;
    seedSampleData(): Promise<string>;
    snoozeItem(id: string, snoozedUntil: bigint): Promise<boolean>;
    updateApprovalItem(updated: ApprovalItem): Promise<boolean>;
    updateCandidate(updated: Candidate): Promise<boolean>;
    updateClient(updated: Client): Promise<boolean>;
    updateEntityStage(entityId: string, entityType: EntityType, newStage: string, requestedBy: string): Promise<{
        __kind__: "ok";
        ok: null;
    } | {
        __kind__: "requiresApproval";
        requiresApproval: string;
    }>;
    updateFollowUpStatus(id: string, status: string, approvedBy: string | null, snoozedUntil: bigint | null): Promise<boolean>;
    updateJob(updated: Job): Promise<boolean>;
    updateRecruiter(updated: Recruiter): Promise<boolean>;
    updateSubmission(updated: Submission): Promise<boolean>;
    updateVendor(updated: Vendor): Promise<boolean>;
    uploadBenchRecords(records: Array<BenchRecordInput>): Promise<{
        __kind__: "ok";
        ok: bigint;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
