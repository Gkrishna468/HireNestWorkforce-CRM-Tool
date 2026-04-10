import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className,
      )}
      data-ocid="empty-state"
    >
      {Icon && (
        <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-foreground mb-1 font-display">
        {title}
      </h3>
      {message && (
        <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-4">
          {message}
        </p>
      )}
      {action && (
        <Button size="sm" onClick={action.onClick} data-ocid="empty-state-cta">
          {action.label}
        </Button>
      )}
    </div>
  );
}
