import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StageProgressBarProps {
  stages: string[];
  currentStage: string;
  className?: string;
  compact?: boolean;
}

export function StageProgressBar({
  stages,
  currentStage,
  className,
  compact = false,
}: StageProgressBarProps) {
  const currentIdx = stages.indexOf(currentStage);

  return (
    <div className={cn("w-full", className)} data-ocid="stage-progress">
      {compact ? (
        <div className="flex items-center gap-1">
          {stages.map((stage, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            return (
              <div
                key={stage}
                className="flex items-center gap-1 flex-1 min-w-0"
              >
                <div
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-smooth",
                    isDone && "bg-primary",
                    isCurrent && "bg-primary/60",
                    !isDone && !isCurrent && "bg-muted",
                  )}
                  title={stage}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-start gap-0">
          {stages.map((stage, idx) => {
            const isDone = idx < currentIdx;
            const isCurrent = idx === currentIdx;
            const isLast = idx === stages.length - 1;
            return (
              <div
                key={stage}
                className="flex flex-col items-center flex-1 min-w-0"
              >
                <div className="flex items-center w-full">
                  {/* Dot */}
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-smooth z-10",
                      isDone && "bg-primary border-primary",
                      isCurrent && "bg-primary/20 border-primary",
                      !isDone && !isCurrent && "bg-muted border-border",
                    )}
                  >
                    {isDone && (
                      <Check className="h-2.5 w-2.5 text-primary-foreground" />
                    )}
                    {isCurrent && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  {/* Connector */}
                  {!isLast && (
                    <div
                      className={cn(
                        "flex-1 h-0.5 transition-smooth",
                        idx < currentIdx ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                </div>
                <p
                  className={cn(
                    "text-[9px] mt-1 text-center leading-tight px-0.5 truncate w-full",
                    isCurrent && "text-primary font-semibold",
                    isDone && "text-muted-foreground",
                    !isDone && !isCurrent && "text-muted-foreground/50",
                  )}
                >
                  {stage}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
