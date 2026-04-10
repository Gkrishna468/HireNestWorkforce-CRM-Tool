import { type ThemeMode, useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";

const MODES: { value: ThemeMode; label: string; Icon: React.ElementType }[] = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-0.5 rounded-md border border-border bg-muted/40 p-0.5"
      aria-label="Select color theme"
      data-ocid="theme-toggle"
    >
      {MODES.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={`${label} theme`}
          aria-pressed={theme === value}
          className={cn(
            "flex items-center justify-center h-6 w-6 rounded transition-colors duration-150",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            theme === value
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-accent/60",
          )}
          data-ocid={`theme-toggle-${value}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}
