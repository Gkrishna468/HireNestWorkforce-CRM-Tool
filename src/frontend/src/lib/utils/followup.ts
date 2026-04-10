import {
  AlertTriangle,
  CalendarCheck,
  Clock,
  type LucideIcon,
  MessageSquare,
  TrendingDown,
} from "lucide-react";

export const FOLLOW_UP_TRIGGERS = [
  "inactivity_48h",
  "inactivity_72h",
  "no_feedback_24h",
  "stale_3_days",
  "low_productivity",
  "placement_30_days",
  "stage_change",
  "ai_suggestion",
] as const;

export type FollowUpTrigger = (typeof FOLLOW_UP_TRIGGERS)[number];

export function triggerLabel(reason: string): string {
  const labels: Record<string, string> = {
    inactivity_48h: "Inactive 48 hours",
    inactivity_72h: "Inactive 72 hours",
    no_feedback_24h: "No feedback (24h post-interview)",
    stale_3_days: "Stale 3+ days",
    low_productivity: "Low productivity detected",
    placement_30_days: "Approaching 30-day check-in",
    stage_change: "Stage change required",
    ai_suggestion: "AI-suggested action",
  };
  return labels[reason] ?? reason.replace(/_/g, " ");
}

export function getTriggerIcon(reason: string): LucideIcon {
  const icons: Record<string, LucideIcon> = {
    inactivity_48h: Clock,
    inactivity_72h: Clock,
    no_feedback_24h: MessageSquare,
    stale_3_days: AlertTriangle,
    low_productivity: TrendingDown,
    placement_30_days: CalendarCheck,
    stage_change: CalendarCheck,
    ai_suggestion: MessageSquare,
  };
  return icons[reason] ?? AlertTriangle;
}

export function followUpStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20";
    case "approved":
      return "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20";
    case "rejected":
      return "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20";
    case "sent":
      return "text-primary bg-primary/10 border-primary/20";
    case "snoozed":
      return "text-muted-foreground bg-muted border-border";
    default:
      return "text-muted-foreground bg-muted border-border";
  }
}
