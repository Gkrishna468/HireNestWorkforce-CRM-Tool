import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMorningBriefing,
  usePendingApprovals,
  usePendingFollowUps,
} from "@/hooks/use-crm";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart2,
  Bell,
  CheckSquare,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useMemo } from "react";

const DISMISS_KEY = "hirenest-briefing-dismissed";

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useBriefingDismissed() {
  const dismissed = useMemo(() => {
    try {
      const stored = localStorage.getItem(DISMISS_KEY);
      return stored === getTodayKey();
    } catch {
      return false;
    }
  }, []);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(DISMISS_KEY, getTodayKey());
    } catch {
      // ignore
    }
  }, []);

  return { dismissed, dismiss };
}

interface MorningBriefingPanelProps {
  onDismiss: () => void;
}

export function MorningBriefingPanel({ onDismiss }: MorningBriefingPanelProps) {
  const { data: briefing, isLoading } = useMorningBriefing();
  const { data: pendingApprovals } = usePendingApprovals();
  const { data: pendingFollowUps } = usePendingFollowUps();
  const navigate = useNavigate();

  const approvalCount = pendingApprovals?.length ?? 0;
  const followUpCount = pendingFollowUps?.length ?? 0;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  if (isLoading) {
    return (
      <div className="border-l-4 border-[oklch(0.7_0.18_200)] bg-card rounded-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-5/6" />
      </div>
    );
  }

  const priorities = briefing?.priorities ?? [];
  const recruiterActivity = briefing?.recruiterActivity ?? [];
  const aiSuggestions = briefing?.aiSuggestions ?? [];

  // Derive counts from priorities
  const vendorFollowUps =
    priorities.find((p) => p.category === "vendor_followups")?.count ?? 0;
  const clientInterviews =
    priorities.find((p) => p.category === "client_interviews")?.count ?? 0;
  const offerApprovals =
    priorities.find((p) => p.category === "offer_approvals")?.count ?? 0;
  const staleCandidates =
    priorities.find((p) => p.category === "stale_candidates")?.count ?? 0;

  const hasPriorities =
    vendorFollowUps > 0 ||
    clientInterviews > 0 ||
    offerApprovals > 0 ||
    staleCandidates > 0 ||
    priorities.length > 0;

  const flaggedRecruiters = recruiterActivity.filter(
    (r) => (r.count ?? 100) < 70,
  );

  return (
    <div
      className="border-l-4 border-[oklch(0.7_0.18_200)] bg-card rounded-sm overflow-hidden"
      data-ocid="morning-briefing-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-[oklch(0.18_0.02_207)]">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-[oklch(0.7_0.18_200)]" />
          <span className="text-xs font-semibold text-[oklch(0.7_0.18_200)] font-display tracking-wide uppercase">
            Daily Briefing
          </span>
          <span className="text-xs text-muted-foreground">— {today}</span>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss briefing"
          className="p-0.5 rounded-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="briefing-dismiss-btn"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* PRIORITIES */}
        <BriefingSection
          icon={Bell}
          title="Priorities"
          iconColor="text-[oklch(0.85_0.24_80)]"
          empty={!hasPriorities}
          emptyText="All clear — no urgent priorities"
        >
          {hasPriorities && (
            <ul className="space-y-1">
              {vendorFollowUps > 0 && (
                <BriefingItem bullet="yellow">
                  <strong>{vendorFollowUps}</strong> vendor
                  {vendorFollowUps !== 1 ? "s" : ""} need follow-up
                  {approvalCount > 0 && (
                    <span className="text-muted-foreground">
                      {" "}
                      ({Math.min(approvalCount, vendorFollowUps)} pending
                      approval)
                    </span>
                  )}
                </BriefingItem>
              )}
              {clientInterviews > 0 && (
                <BriefingItem bullet="cyan">
                  <strong>{clientInterviews}</strong> client interview
                  {clientInterviews !== 1 ? "s" : ""} today
                </BriefingItem>
              )}
              {offerApprovals > 0 && (
                <BriefingItem bullet="red">
                  <strong>{offerApprovals}</strong> offer approval
                  {offerApprovals !== 1 ? "s" : ""} required
                </BriefingItem>
              )}
              {staleCandidates > 0 && (
                <BriefingItem bullet="yellow">
                  <strong>{staleCandidates}</strong> candidate
                  {staleCandidates !== 1 ? "s" : ""} stale &gt;3 days
                </BriefingItem>
              )}
              {/* Render any other priorities not matched above */}
              {priorities
                .filter(
                  (p) =>
                    ![
                      "vendor_followups",
                      "client_interviews",
                      "offer_approvals",
                      "stale_candidates",
                    ].includes(p.category),
                )
                .map((p) => (
                  <BriefingItem key={p.category} bullet="cyan">
                    {p.message}
                    {p.count != null && (
                      <Badge
                        variant="outline"
                        className="ml-1 text-[10px] px-1 py-0 h-4"
                      >
                        {p.count}
                      </Badge>
                    )}
                  </BriefingItem>
                ))}
            </ul>
          )}
        </BriefingSection>

        {/* RECRUITER ACTIVITY */}
        <BriefingSection
          icon={BarChart2}
          title="Recruiter Activity (Yesterday)"
          iconColor="text-[oklch(0.68_0.22_142)]"
          empty={recruiterActivity.length === 0}
          emptyText="No recruiter activity recorded"
        >
          <ul className="space-y-1">
            {recruiterActivity.map((r) => {
              const score = r.count ?? 0;
              const flagged = score > 0 && score < 70;
              return (
                <BriefingItem
                  key={r.category}
                  bullet={flagged ? "red" : "green"}
                >
                  <span className="font-medium">{r.message}</span>
                  {score > 0 && (
                    <span
                      className={cn(
                        "ml-1 text-xs font-semibold",
                        flagged
                          ? "text-[oklch(0.65_0.19_22)]"
                          : "text-[oklch(0.68_0.22_142)]",
                      )}
                    >
                      {score}% productivity
                      {flagged && " ⚑"}
                    </span>
                  )}
                </BriefingItem>
              );
            })}
          </ul>
          {flaggedRecruiters.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[oklch(0.85_0.24_80)]">
              <AlertTriangle className="h-3 w-3" />
              {flaggedRecruiters.length} recruiter
              {flaggedRecruiters.length !== 1 ? "s" : ""} flagged for low
              productivity
            </div>
          )}
        </BriefingSection>

        {/* FOLLOW-UP QUEUE */}
        <BriefingSection
          icon={CheckSquare}
          title="Follow-Up Queue"
          iconColor="text-primary"
          empty={followUpCount === 0 && approvalCount === 0}
          emptyText="No pending follow-ups"
        >
          <ul className="space-y-1">
            {followUpCount > 0 && (
              <BriefingItem bullet="cyan">
                <strong>{followUpCount}</strong> follow-up suggestion
                {followUpCount !== 1 ? "s" : ""} awaiting approval
              </BriefingItem>
            )}
            {approvalCount > 0 && (
              <BriefingItem bullet="yellow">
                <strong>{approvalCount}</strong> item
                {approvalCount !== 1 ? "s" : ""} in approval queue
              </BriefingItem>
            )}
          </ul>
        </BriefingSection>

        {/* AI SUGGESTIONS / ALERTS */}
        <BriefingSection
          icon={AlertTriangle}
          title="AI Suggestions"
          iconColor="text-[oklch(0.85_0.24_80)]"
          empty={aiSuggestions.length === 0}
          emptyText="No alerts at this time"
        >
          <ul className="space-y-1">
            {aiSuggestions.map((s) => (
              <BriefingItem key={s.category} bullet="yellow">
                {s.message}
              </BriefingItem>
            ))}
          </ul>
        </BriefingSection>
      </div>

      {/* Action Row */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-t border-border bg-[oklch(0.14_0.01_207)] flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1"
          onClick={() => navigate({ to: "/dashboard" })}
          data-ocid="briefing-pulse-btn"
        >
          View Pulse <ChevronRight className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs gap-1"
          onClick={() => navigate({ to: "/approvals" })}
          data-ocid="briefing-approvals-btn"
        >
          Approve Queue
          {approvalCount > 0 && (
            <Badge className="h-4 px-1 text-[10px] ml-0.5 bg-primary text-primary-foreground">
              {approvalCount}
            </Badge>
          )}
          <ChevronRight className="h-3 w-3" />
        </Button>
        <div className="flex-1" />
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-xs text-muted-foreground"
          onClick={onDismiss}
          data-ocid="briefing-dismiss-footer-btn"
        >
          Dismiss for today
        </Button>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface BriefingSectionProps {
  icon: React.ElementType;
  title: string;
  iconColor?: string;
  children?: React.ReactNode;
  empty?: boolean;
  emptyText?: string;
}

function BriefingSection({
  icon: Icon,
  title,
  iconColor,
  children,
  empty,
  emptyText,
}: BriefingSectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("h-3 w-3 flex-shrink-0", iconColor)} />
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          {title}
        </span>
      </div>
      {empty ? (
        <p className="text-xs text-muted-foreground italic">{emptyText}</p>
      ) : (
        children
      )}
    </div>
  );
}

type BulletColor = "green" | "yellow" | "red" | "cyan";

interface BriefingItemProps {
  bullet?: BulletColor;
  children: React.ReactNode;
}

function BriefingItem({ bullet = "cyan", children }: BriefingItemProps) {
  const dotClass: Record<BulletColor, string> = {
    green: "bg-[oklch(0.68_0.22_142)]",
    yellow: "bg-[oklch(0.85_0.24_80)]",
    red: "bg-[oklch(0.65_0.19_22)]",
    cyan: "bg-[oklch(0.7_0.18_200)]",
  };
  return (
    <li className="flex items-start gap-1.5 text-xs text-foreground leading-snug">
      <span
        className={cn(
          "mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0",
          dotClass[bullet],
        )}
      />
      <span>{children}</span>
    </li>
  );
}
