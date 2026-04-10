import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Activity } from "@/types/crm";
import {
  CalendarCheck,
  FileText,
  GitBranch,
  Mail,
  Phone,
  Send,
  Users,
} from "lucide-react";

const ACTIVITY_CONFIG = {
  call: {
    icon: Phone,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    label: "Call",
  },
  email: {
    icon: Mail,
    color: "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20",
    label: "Email",
  },
  meeting: {
    icon: Users,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    label: "Meeting",
  },
  submission: {
    icon: Send,
    color: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    label: "Submission",
  },
  interview: {
    icon: CalendarCheck,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    label: "Interview",
  },
  note: {
    icon: FileText,
    color: "text-muted-foreground bg-muted border-border",
    label: "Note",
  },
  stage_change: {
    icon: GitBranch,
    color: "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20",
    label: "Stage Change",
  },
} as const;

interface ActivityTimelineProps {
  activities: Activity[];
  emptyMessage?: string;
  className?: string;
}

export function ActivityTimeline({
  activities,
  emptyMessage = "No activities recorded yet.",
  className,
}: ActivityTimelineProps) {
  if (activities.length === 0) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-8 text-sm text-muted-foreground",
          className,
        )}
      >
        {emptyMessage}
      </div>
    );
  }

  const sorted = [...activities].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className={cn("space-y-1", className)} data-ocid="activity-timeline">
      {sorted.map((activity) => {
        const config =
          ACTIVITY_CONFIG[activity.activityType] ?? ACTIVITY_CONFIG.note;
        const Icon = config.icon;
        return (
          <div key={activity.id} className="flex gap-2.5 py-2">
            <div
              className={cn(
                "mt-0.5 flex-shrink-0 w-6 h-6 rounded-sm border flex items-center justify-center",
                config.color,
              )}
            >
              <Icon className="h-3 w-3" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-0.5 rounded-sm border",
                    config.color,
                  )}
                >
                  {config.label}
                </span>
                {activity.direction && (
                  <span className="text-[10px] text-muted-foreground capitalize">
                    {activity.direction}
                  </span>
                )}
                <span className="text-[10px] text-muted-foreground ml-auto flex-shrink-0">
                  {formatRelativeTime(activity.createdAt)}
                </span>
              </div>
              {activity.notes && (
                <p className="text-xs text-foreground mt-1 leading-snug">
                  {activity.notes}
                </p>
              )}
              {activity.createdBy && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  by {activity.createdBy}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
