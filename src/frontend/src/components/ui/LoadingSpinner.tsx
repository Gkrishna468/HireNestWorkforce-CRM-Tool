import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export function LoadingSpinner({
  size = "md",
  className,
  label,
}: LoadingSpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-[3px]",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className,
      )}
      aria-label={label ?? "Loading"}
    >
      <div
        className={cn(
          "rounded-full border-border border-t-primary animate-spin",
          sizes[size],
        )}
      />
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-48">
      <LoadingSpinner size="lg" label="Loading..." />
    </div>
  );
}
