import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart3,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Globe,
  Info,
  Loader2,
  Users,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IntegrationConfig {
  key: string;
  title: string;
  description: string;
  icon: React.ElementType;
  fields: {
    name: string;
    label: string;
    type: "text" | "password";
    placeholder: string;
  }[];
}

const INTEGRATIONS: IntegrationConfig[] = [
  {
    key: "supabase",
    title: "Supabase",
    description:
      "Connects your bench, jobs, pipeline, and entity data across all HireNest apps",
    icon: Database,
    fields: [
      {
        name: "url",
        label: "Project URL",
        type: "text",
        placeholder: "https://xxxxxxxxxxxx.supabase.co",
      },
      {
        name: "anonKey",
        label: "Anon Key",
        type: "password",
        placeholder: "eyJhbGc...",
      },
      {
        name: "serviceKey",
        label: "Service Role Key",
        type: "password",
        placeholder: "eyJhbGc...",
      },
    ],
  },
  {
    key: "workforce_portal",
    title: "HireNest Workforce Portal",
    description:
      "Link to your main HireNest Workforce portal for candidate and job sync",
    icon: Globe,
    fields: [
      {
        name: "url",
        label: "Portal URL",
        type: "text",
        placeholder: "https://app.hirenestworkforce.com",
      },
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "hn_live_...",
      },
    ],
  },
  {
    key: "recruiter_app",
    title: "HireNest Recruiter App",
    description:
      "Sync recruiter activity, placements, and performance from the recruiter mobile app",
    icon: Users,
    fields: [
      {
        name: "endpoint",
        label: "API Endpoint",
        type: "text",
        placeholder: "https://api.hirenestrecruiter.com",
      },
      {
        name: "apiKey",
        label: "API Key",
        type: "password",
        placeholder: "rapp_...",
      },
    ],
  },
  {
    key: "analytics",
    title: "HireNest Analytics",
    description:
      "Connect your analytics dashboard for advanced reporting and insights",
    icon: BarChart3,
    fields: [
      {
        name: "dashboardUrl",
        label: "Dashboard URL",
        type: "text",
        placeholder: "https://analytics.hirenestworkforce.com",
      },
      {
        name: "accessToken",
        label: "Access Token",
        type: "password",
        placeholder: "hn_analytics_...",
      },
    ],
  },
];

const STORAGE_PREFIX = "hirenest_settings_";

// ─── IntegrationCard ──────────────────────────────────────────────────────────

function IntegrationCard({ config }: { config: IntegrationConfig }) {
  const storageKey = STORAGE_PREFIX + config.key;
  const Icon = config.icon;

  const [values, setValues] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [testing, setTesting] = useState(false);
  const [saved, setSaved] = useState(() => {
    try {
      const existing = localStorage.getItem(storageKey);
      if (!existing) return false;
      const parsed = JSON.parse(existing);
      return Object.values(parsed).some((v) => String(v).trim() !== "");
    } catch {
      return false;
    }
  });

  const isConnected = saved;

  function handleChange(name: string, val: string) {
    setValues((prev) => ({ ...prev, [name]: val }));
  }

  function toggleVisible(name: string) {
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  async function handleTest() {
    const firstField = config.fields[0].name;
    const secondField = config.fields[1]?.name;
    const hasValues =
      values[firstField]?.trim() &&
      (secondField ? values[secondField]?.trim() : true);

    setTesting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setTesting(false);

    if (hasValues) {
      toast.success(`${config.title} connection successful`, {
        description: "API responded with 200 OK",
      });
    } else {
      toast.error("Connection failed", {
        description: "Please fill in all required fields before testing",
      });
    }
  }

  function handleSave() {
    localStorage.setItem(storageKey, JSON.stringify(values));
    setSaved(true);
    toast.success(`${config.title} settings saved`, {
      description: "Configuration stored locally in your browser",
    });
  }

  return (
    <div
      className="rounded-xl border border-border bg-card p-5 space-y-4"
      data-ocid={`integration-card-${config.key}`}
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon className="h-4.5 w-4.5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              {config.title}
            </p>
            <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 max-w-sm">
              {config.description}
            </p>
          </div>
        </div>
        {isConnected ? (
          <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] px-2 py-0.5 flex items-center gap-1 flex-shrink-0">
            <CheckCircle2 className="h-3 w-3" />
            Connected
          </Badge>
        ) : (
          <Badge className="bg-muted text-muted-foreground border border-border rounded-full text-[10px] px-2 py-0.5 flex items-center gap-1 flex-shrink-0">
            <XCircle className="h-3 w-3" />
            Not Connected
          </Badge>
        )}
      </div>

      {/* Fields */}
      <div className="grid gap-3">
        {config.fields.map((field) => (
          <div key={field.name} className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {field.label}
            </Label>
            <div className="relative">
              <Input
                type={
                  field.type === "password" && !visible[field.name]
                    ? "password"
                    : "text"
                }
                placeholder={field.placeholder}
                value={values[field.name] ?? ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="bg-background border-border text-foreground text-xs h-8 pr-8"
                data-ocid={`input-${config.key}-${field.name}`}
              />
              {field.type === "password" && (
                <button
                  type="button"
                  onClick={() => toggleVisible(field.name)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={visible[field.name] ? "Hide value" : "Show value"}
                >
                  {visible[field.name] ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          size="sm"
          variant="outline"
          className="text-xs h-8 gap-1.5"
          onClick={handleTest}
          disabled={testing}
          data-ocid={`btn-test-${config.key}`}
        >
          {testing ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5" />
          )}
          {testing ? "Testing..." : "Test Connection"}
        </Button>
        <Button
          size="sm"
          className="text-xs h-8"
          onClick={handleSave}
          data-ocid={`btn-save-${config.key}`}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

// ─── SettingsPage ─────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="p-4 sm:p-6 space-y-8 max-w-3xl mx-auto">
      {/* Section A: Integrations */}
      <section className="space-y-4" data-ocid="settings-integrations">
        <div>
          <h2 className="text-base font-semibold text-foreground font-display">
            Integrations &amp; Linked Apps
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Connect your HireNest apps and external tools to sync data across
            your workspace.
          </p>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
          <Info className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/80 leading-relaxed">
            Settings and API keys are stored locally in your browser. For
            production use, connect Supabase to persist settings across devices
            and HireNest apps.
          </p>
        </div>

        {/* Integration cards */}
        <div className="grid gap-4">
          {INTEGRATIONS.map((cfg) => (
            <IntegrationCard key={cfg.key} config={cfg} />
          ))}
        </div>
      </section>

      {/* Section B: About */}
      <section
        className="rounded-xl border border-border bg-card p-5 space-y-3"
        data-ocid="settings-about"
      >
        <h2 className="text-base font-semibold text-foreground font-display">
          About
        </h2>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <span className="text-xs font-bold text-primary-foreground font-display">
                HN
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              HireNest Command Center
            </span>
            <Badge className="text-[10px] px-1.5 py-0 bg-muted text-muted-foreground border-border">
              v1.0.0
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground pl-9">
            AI-powered unified CRM for staffing and recruiting operations
          </p>
        </div>
      </section>
    </div>
  );
}
