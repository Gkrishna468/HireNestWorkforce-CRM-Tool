import { cn } from "@/lib/utils";
import { type LucideIcon, Minus, TrendingDown, TrendingUp } from "lucide-react";

type Trend = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: Trend;
  trendValue?: string;
  icon?: LucideIcon;
  iconColor?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  label,
  value,
  trend,
  trendValue,
  icon: Icon,
  iconColor,
  className,
  onClick,
}: StatCardProps) {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-[#22c55e]"
      : trend === "down"
        ? "text-[#ef4444]"
        : "text-muted-foreground";

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
      className={cn(
        "bg-card border border-border rounded-sm p-3 flex flex-col gap-2 transition-smooth",
        onClick && "cursor-pointer hover:border-primary/40",
        className,
      )}
      data-ocid="stat-card"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
        {Icon && (
          <Icon
            className={cn("h-4 w-4", iconColor ?? "text-muted-foreground")}
          />
        )}
      </div>

      <div className="flex items-end justify-between gap-2">
        <span className="text-2xl font-bold text-foreground font-display leading-none">
          {value}
        </span>
        {trend && trendValue && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium mb-0.5",
              trendColor,
            )}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
