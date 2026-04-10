import { cn } from "@/lib/utils";
import { computeHealthStatus, getRelativeTime } from "@/lib/utils/health";
import type { EntityType } from "@/types/crm";
import { HealthBadge } from "./HealthBadge";

interface EntityCardProps {
  id: string;
  name: string;
  company?: string;
  subtitle?: string;
  currentStage: string;
  healthScore: number;
  lastActivityAt?: number;
  daysInStage?: number;
  entityType: EntityType;
  actionCount?: number;
  onClick?: () => void;
  className?: string;
  leftAccentColor?: string;
}

export function EntityCard({
  name,
  company,
  subtitle,
  currentStage,
  healthScore,
  lastActivityAt,
  daysInStage,
  onClick,
  className,
  leftAccentColor,
}: EntityCardProps) {
  const status = computeHealthStatus(healthScore);
  const accentColors: Record<string, string> = {
    green: "border-l-[#22c55e]",
    yellow: "border-l-[#eab308]",
    red: "border-l-[#ef4444]",
  };
  const accent = leftAccentColor ?? accentColors[status];

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "entity-card border-l-2 cursor-pointer select-none",
        accent,
        className,
      )}
      data-ocid="entity-card"
    >
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate leading-tight">
            {name}
          </p>
          {(company ?? subtitle) && (
            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
              {company ?? subtitle}
            </p>
          )}
        </div>
        <HealthBadge status={status} size="sm" />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span
          className={cn(
            "text-[10px] font-medium px-1.5 py-0.5 rounded-sm border",
            status === "green" &&
              "text-[#22c55e] bg-[#22c55e]/10 border-[#22c55e]/20",
            status === "yellow" &&
              "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20",
            status === "red" &&
              "text-[#ef4444] bg-[#ef4444]/10 border-[#ef4444]/20",
          )}
        >
          {currentStage}
        </span>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {daysInStage != null && <span>{daysInStage}d in stage</span>}
          {lastActivityAt && <span>{getRelativeTime(lastActivityAt)}</span>}
        </div>
      </div>
    </div>
  );
}
