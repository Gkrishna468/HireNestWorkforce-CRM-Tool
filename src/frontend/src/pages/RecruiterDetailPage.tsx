import { ActivityTimeline } from "@/components/ui/ActivityTimeline";
import { AppModal } from "@/components/ui/AppModal";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { StageProgressBar } from "@/components/ui/StageProgressBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useActivities,
  useLogActivity,
  useLogRecruiterMetrics,
  useRecruiterMetrics,
  useRecruiters,
  useUpdateEntityStage,
  useUpdateRecruiter,
} from "@/hooks/use-crm";
import { computeHealthStatus, getHealthColor } from "@/lib/utils/health";
import { RECRUITER_STAGES } from "@/lib/utils/pipeline";
import type { Recruiter } from "@/types/crm";
import type {
  RecruiterFormInput,
  RecruiterMetricsFormInput,
} from "@/types/forms";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  ChevronRight,
  Edit2,
  Lightbulb,
  Mail,
  Phone,
  TrendingUp,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

// ── Edit Recruiter Modal ──────────────────────────────────────────────────────

function EditRecruiterModal({
  recruiter,
  open,
  onOpenChange,
}: {
  recruiter: Recruiter;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const updateRecruiter = useUpdateRecruiter();
  const [form, setForm] = useState<RecruiterFormInput>({
    name: recruiter.name,
    email: recruiter.email,
    phone: recruiter.phone ?? "",
    title: recruiter.title ?? "",
    notes: recruiter.notes ?? "",
  });

  function handleChange(field: keyof RecruiterFormInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await updateRecruiter.mutateAsync({ id: recruiter.id, input: form });
      toast.success("Recruiter updated");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update recruiter");
    }
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Recruiter"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-8 text-xs bg-background"
              required
              data-ocid="edit-recruiter-name"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input
              value={form.title ?? ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Senior Recruiter"
              className="h-8 text-xs bg-background"
              data-ocid="edit-recruiter-title"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Email *</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="h-8 text-xs bg-background"
            required
            data-ocid="edit-recruiter-email"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Phone</Label>
          <Input
            value={form.phone ?? ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="h-8 text-xs bg-background"
            data-ocid="edit-recruiter-phone"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Notes</Label>
          <Textarea
            value={form.notes ?? ""}
            onChange={(e) => handleChange("notes", e.target.value)}
            rows={3}
            className="text-xs bg-background resize-none"
            data-ocid="edit-recruiter-notes"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="h-7 text-xs"
            disabled={updateRecruiter.isPending}
            data-ocid="edit-recruiter-submit"
          >
            {updateRecruiter.isPending ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

// ── Daily Check-In Form ───────────────────────────────────────────────────────

function DailyCheckInForm({ recruiterId }: { recruiterId: string }) {
  const logMetrics = useLogRecruiterMetrics();
  const logActivity = useLogActivity();

  const todayStr = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState<RecruiterMetricsFormInput>({
    recruiterId,
    date: todayStr,
    callsMade: 0,
    emailsSent: 0,
    submissions: 0,
    interviewsScheduled: 0,
    tasksCompleted: 0,
  });
  const [notes, setNotes] = useState("");

  function handleNumChange(
    field: keyof RecruiterMetricsFormInput,
    raw: string,
  ) {
    const val = Number.parseInt(raw, 10);
    setForm((prev) => ({ ...prev, [field]: Number.isNaN(val) ? 0 : val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await logMetrics.mutateAsync(form);
      await logActivity.mutateAsync({
        entityId: recruiterId,
        activityType: "note",
        notes: notes
          ? `Daily check-in: ${notes}`
          : `Daily check-in logged — Calls: ${form.callsMade}, Emails: ${form.emailsSent}, Submissions: ${form.submissions}`,
        createdBy: "Manager",
      });
      toast.success("Check-in logged");
      setForm({
        recruiterId,
        date: todayStr,
        callsMade: 0,
        emailsSent: 0,
        submissions: 0,
        interviewsScheduled: 0,
        tasksCompleted: 0,
      });
      setNotes("");
    } catch {
      toast.error("Failed to log check-in");
    }
  }

  const METRICS_FIELDS: Array<{
    key: keyof RecruiterMetricsFormInput;
    label: string;
    ocid: string;
  }> = [
    { key: "callsMade", label: "Calls Made", ocid: "checkin-calls" },
    { key: "emailsSent", label: "Emails Sent", ocid: "checkin-emails" },
    { key: "submissions", label: "Submissions", ocid: "checkin-submissions" },
    {
      key: "interviewsScheduled",
      label: "Interviews Scheduled",
      ocid: "checkin-interviews",
    },
    {
      key: "tasksCompleted",
      label: "Tasks Completed",
      ocid: "checkin-tasks",
    },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      data-ocid="daily-checkin-form"
    >
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Date</Label>
        <Input
          type="date"
          value={form.date ?? todayStr}
          onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
          className="h-8 text-xs bg-background"
          data-ocid="checkin-date"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {METRICS_FIELDS.map(({ key, label, ocid }) => (
          <div key={key} className="space-y-1">
            <Label className="text-[10px] text-muted-foreground">{label}</Label>
            <Input
              type="number"
              min={0}
              value={(form[key] as number) ?? 0}
              onChange={(e) => handleNumChange(key, e.target.value)}
              className="h-7 text-xs bg-background tabular-nums"
              data-ocid={ocid}
            />
          </div>
        ))}
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Notes</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any blockers, wins, or updates..."
          rows={2}
          className="text-xs bg-background resize-none"
          data-ocid="checkin-notes"
        />
      </div>
      <Button
        type="submit"
        size="sm"
        className="w-full h-7 text-xs"
        disabled={logMetrics.isPending || logActivity.isPending}
        data-ocid="checkin-submit-btn"
      >
        {logMetrics.isPending ? "Logging…" : "Submit Check-In"}
      </Button>
    </form>
  );
}

// ── Performance Chart ─────────────────────────────────────────────────────────

function PerformanceChart({ recruiterId }: { recruiterId: string }) {
  const { data: metricsHistory, isLoading } = useRecruiterMetrics(recruiterId);

  if (isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }

  const last7 = (metricsHistory ?? []).slice(-7).map((m) => ({
    date: m.date.slice(5), // MM-DD
    calls: m.callsMade,
    subs: m.submissions,
  }));

  if (last7.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-xs text-muted-foreground">
        No metrics logged yet. Submit your first daily check-in.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart
        data={last7}
        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="oklch(0.22 0 0)"
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 9, fill: "oklch(0.58 0 0)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 9, fill: "oklch(0.58 0 0)" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "oklch(0.16 0 0)",
            border: "1px solid oklch(0.22 0 0)",
            borderRadius: "4px",
            fontSize: "11px",
            color: "oklch(0.98 0 0)",
          }}
          cursor={{ fill: "oklch(0.22 0 0)" }}
        />
        <Bar
          dataKey="calls"
          name="Calls"
          fill="oklch(0.5 0.18 207)"
          radius={[2, 2, 0, 0]}
        />
        <Bar
          dataKey="subs"
          name="Submissions"
          fill="oklch(0.68 0.22 142)"
          radius={[2, 2, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── Coaching Suggestions ──────────────────────────────────────────────────────

function CoachingSuggestions({ score }: { score: number }) {
  if (score >= 70) return null;
  const suggestions =
    score < 40
      ? [
          "Schedule an immediate 1:1 to discuss performance blockers",
          "Review daily goal-setting process and adjust targets",
          "Consider a short-term improvement plan with daily check-ins",
        ]
      : [
          "Consider a 1:1 meeting to address current challenges",
          "Review daily goal-setting process",
          "Identify specific activity areas needing improvement",
        ];

  return (
    <div
      className="rounded-sm border border-[#eab308]/30 bg-[#eab308]/5 p-3 space-y-2"
      data-ocid="coaching-suggestions"
    >
      <div className="flex items-center gap-1.5">
        <Lightbulb className="h-3.5 w-3.5 text-[#eab308]" />
        <span className="text-xs font-semibold text-[#eab308]">
          Coaching Suggestions
        </span>
      </div>
      <ul className="space-y-1">
        {suggestions.map((s) => (
          <li key={s} className="flex items-start gap-1.5">
            <ChevronRight className="h-3 w-3 text-[#eab308]/60 mt-0.5 flex-shrink-0" />
            <span className="text-xs text-muted-foreground leading-snug">
              {s}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Stage Selector ────────────────────────────────────────────────────────────

function StageSelector({
  recruiterId,
  currentStage,
}: {
  recruiterId: string;
  currentStage: string;
}) {
  const updateStage = useUpdateEntityStage();

  async function handleStageClick(stage: string) {
    if (stage === currentStage) return;
    try {
      await updateStage.mutateAsync({
        entityId: recruiterId,
        entityType: "recruiter",
        newStage: stage,
      });
      toast.success(`Stage updated to ${stage}`);
    } catch {
      toast.error("Failed to update stage");
    }
  }

  return (
    <div className="space-y-2" data-ocid="stage-selector">
      <StageProgressBar stages={RECRUITER_STAGES} currentStage={currentStage} />
      <div className="flex flex-wrap gap-1 mt-1">
        {RECRUITER_STAGES.map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => handleStageClick(stage)}
            disabled={updateStage.isPending}
            className={`text-[10px] px-2 py-0.5 rounded-sm border transition-smooth ${
              stage === currentStage
                ? "bg-primary/20 border-primary text-primary font-semibold"
                : "bg-muted border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
            }`}
            data-ocid={`stage-btn-${stage.toLowerCase().replace(/\s+/g, "-")}`}
          >
            {stage}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Detail Page ──────────────────────────────────────────────────────────

export default function RecruiterDetailPage() {
  const { recruiterId } = useParams({ from: "/recruiters/$recruiterId" });
  const { data: recruiters, isLoading } = useRecruiters();
  const { data: activities, isLoading: activitiesLoading } =
    useActivities(recruiterId);
  const [editOpen, setEditOpen] = useState(false);

  const recruiter = recruiters?.find((r) => r.id === recruiterId);

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!recruiter) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <UserCog className="h-10 w-10 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">Recruiter not found</p>
        <Link to="/recruiters">
          <Button variant="outline" size="sm" className="h-7 text-xs">
            Back to Recruiters
          </Button>
        </Link>
      </div>
    );
  }

  const healthStatus = computeHealthStatus(recruiter.healthScore);
  const healthColorClass = getHealthColor(healthStatus);

  return (
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <Link to="/recruiters">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            aria-label="Back to recruiters"
            data-ocid="back-btn"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Button>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-sm font-semibold text-foreground font-display truncate">
              {recruiter.name}
            </h2>
            <HealthBadge status={healthStatus} showLabel size="sm" />
          </div>
          {recruiter.title && (
            <p className="text-[11px] text-muted-foreground">
              {recruiter.title}
            </p>
          )}
        </div>

        {/* Productivity score — large, color-coded */}
        <div className="flex flex-col items-center flex-shrink-0 mr-2">
          <span
            className={`text-2xl font-bold tabular-nums font-display ${healthColorClass}`}
          >
            {recruiter.healthScore}
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wide">
            score
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs gap-1.5 flex-shrink-0"
          onClick={() => setEditOpen(true)}
          data-ocid="edit-recruiter-btn"
        >
          <Edit2 className="h-3 w-3" />
          Edit
        </Button>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
          {/* ── Left Column ─────────────────────────────────────────── */}
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Recruiter info */}
            <section>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Contact Info
              </h3>
              <div className="space-y-1.5">
                {recruiter.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`mailto:${recruiter.email}`}
                      className="text-xs text-foreground hover:text-primary transition-colors truncate"
                    >
                      {recruiter.email}
                    </a>
                  </div>
                )}
                {recruiter.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <a
                      href={`tel:${recruiter.phone}`}
                      className="text-xs text-foreground hover:text-primary transition-colors"
                    >
                      {recruiter.phone}
                    </a>
                  </div>
                )}
              </div>
              {recruiter.notes && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed border-l-2 border-border pl-2">
                  {recruiter.notes}
                </p>
              )}
            </section>

            <Separator className="bg-border" />

            {/* Stage */}
            <section>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Pipeline Stage
              </h3>
              <StageSelector
                recruiterId={recruiter.id}
                currentStage={recruiter.currentStage}
              />
            </section>

            <Separator className="bg-border" />

            {/* Coaching suggestions */}
            <section>
              <CoachingSuggestions score={recruiter.healthScore} />
              {recruiter.healthScore >= 70 && (
                <div className="rounded-sm border border-[#22c55e]/30 bg-[#22c55e]/5 p-3">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-[#22c55e]" />
                    <span className="text-xs font-semibold text-[#22c55e]">
                      On Track
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    This recruiter is performing well. Keep up the great work!
                  </p>
                </div>
              )}
            </section>

            <Separator className="bg-border" />

            {/* Daily Check-In */}
            <section>
              <div className="flex items-center gap-1.5 mb-3">
                <BarChart3 className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Daily Check-In
                </h3>
              </div>
              <DailyCheckInForm recruiterId={recruiter.id} />
            </section>
          </div>

          {/* ── Right Column ────────────────────────────────────────── */}
          <div className="p-4 space-y-4 overflow-y-auto">
            {/* Weekly performance chart */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  7-Day Performance
                </h3>
                <div className="flex items-center gap-3 ml-auto">
                  <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-sm bg-primary inline-block" />
                    Calls
                  </span>
                  <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <span className="w-2 h-2 rounded-sm bg-[#22c55e] inline-block" />
                    Submissions
                  </span>
                </div>
              </div>
              <PerformanceChart recruiterId={recruiter.id} />
            </section>

            <Separator className="bg-border" />

            {/* Activity timeline */}
            <section>
              <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Activity Timeline
              </h3>
              {activitiesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <ActivityTimeline
                  activities={activities ?? []}
                  emptyMessage="No activities recorded yet. Submit a daily check-in to start the timeline."
                />
              )}
            </section>
          </div>
        </div>
      </div>

      <EditRecruiterModal
        recruiter={recruiter}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </div>
  );
}
