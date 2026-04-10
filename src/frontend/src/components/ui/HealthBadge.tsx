import { cn } from "@/lib/utils";
import {
  computeHealthStatus,
  getHealthBgColor,
  getHealthColor,
  getHealthLabel,
} from "@/lib/utils/health";
import type { HealthStatus } from "@/types/crm";

interface HealthBadgeProps {
  status?: HealthStatus;
  score?: number;
  showLabel?: boolean;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HealthBadge({
  status,
  score,
  showLabel = false,
  showScore = false,
  size = "md",
  className,
}: HealthBadgeProps) {
  const resolvedStatus: HealthStatus =
    status ?? (score != null ? computeHealthStatus(score) : "green");
  const dotSize = { sm: "w-2 h-2", md: "w-2.5 h-2.5", lg: "w-3 h-3" }[size];
  const textSize = { sm: "text-[10px]", md: "text-xs", lg: "text-sm" }[size];

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span
        className={cn(
          "rounded-full flex-shrink-0",
          dotSize,
          getHealthBgColor(resolvedStatus),
        )}
      />
      {(showLabel || showScore) && (
        <span
          className={cn(
            "font-medium",
            textSize,
            getHealthColor(resolvedStatus),
          )}
        >
          {showScore && score != null ? score : getHealthLabel(score ?? 0)}
        </span>
      )}
    </span>
  );
}
