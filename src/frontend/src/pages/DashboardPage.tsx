import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { PageLoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  MorningBriefingPanel,
  useBriefingDismissed,
} from "@/components/ui/MorningBriefingPanel";
import { StatCard } from "@/components/ui/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  usePendingApprovals,
  usePulseDashboard,
  useRunFollowUpEngine,
  useSeedSampleData,
} from "@/hooks/use-crm";
import {
  formatRelativeTime,
  getEntityTypeIcon,
  getEntityTypeLabel,
} from "@/lib/utils/format";
import { computeHealthStatus } from "@/lib/utils/health";
import type { EntityType, PulseEntry } from "@/types/crm";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  Briefcase,
  Building2,
  ChevronDown,
  CircleUser,
  Clock,
  Database,
  RefreshCw,
  Sparkles,
  UserCheck,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type FilterType = "all" | EntityType;
type SortKey = "health-asc" | "health-desc" | "last-activity" | "name";

// ── Entity detail route helper ────────────────────────────────────────────────

function getDetailPath(entityId: string, entityType: EntityType): string {
  const routeMap: Record<EntityType, string> = {
    vendor: `/vendors/${entityId}`,
    client: `/clients/${entityId}`,
    recruiter: `/recruiters/${entityId}`,
    candidate: `/candidates/${entityId}`,
  };
  return routeMap[entityType];
}

// ── Health color helpers ──────────────────────────────────────────────────────

function healthDotClass(score: number): string {
  const status = computeHealthStatus(score);
  if (status === "green") return "bg-[#22c55e]";
  if (status === "yellow") return "bg-[#eab308]";
  return "bg-[#ef4444]";
}

function healthTextClass(score: number): string {
  const status = computeHealthStatus(score);
  if (status === "green") return "text-[#22c55e]";
  if (status === "yellow") return "text-[#eab308]";
  return "text-[#ef4444]";
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface FilterToggleProps {
  active: FilterType;
  onChange: (f: FilterType) => void;
}

const FILTER_OPTIONS: {
  value: FilterType;
  label: string;
  Icon: typeof Building2;
}[] = [
  { value: "all", label: "All", Icon: CircleUser },
  { value: "vendor", label: "Vendors", Icon: Building2 },
  { value: "client", label: "Clients", Icon: Briefcase },
  { value: "recruiter", label: "Recruiters", Icon: Users },
  { value: "candidate", label: "Candidates", Icon: UserCheck },
];

function FilterToggle({ active, onChange }: FilterToggleProps) {
  return (
    <div className="flex gap-1 flex-wrap">
      {FILTER_OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          data-ocid={`filter-${value}`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors duration-150 ${
            active === value
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
          }`}
        >
          <Icon className="h-3 w-3" />
          {label}
        </button>
      ))}
    </div>
  );
}

// ── Sort dropdown ─────────────────────────────────────────────────────────────

interface SortDropdownProps {
  value: SortKey;
  onChange: (s: SortKey) => void;
}

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "health-desc", label: "Health (High → Low)" },
  { value: "health-asc", label: "Health (Low → High)" },
  { value: "last-activity", label: "Last Activity" },
  { value: "name", label: "Name (A → Z)" },
];

function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const current = SORT_OPTIONS.find((o) => o.value === value);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        data-ocid="sort-dropdown"
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors duration-150"
      >
        {current?.label}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-20 bg-popover border border-border rounded shadow-lg min-w-[180px] py-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors ${
                opt.value === value
                  ? "text-primary font-medium"
                  : "text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Table row (desktop) ───────────────────────────────────────────────────────

function PulseTableRow({
  entry,
  pendingCount,
}: { entry: PulseEntry; pendingCount: number }) {
  const Icon = getEntityTypeIcon(entry.entityType);
  const detailPath = getDetailPath(entry.entityId, entry.entityType);
  const typeColors: Record<EntityType, string> = {
    vendor: "bg-[oklch(0.22_0.04_207)] text-[oklch(0.7_0.14_207)]",
    client: "bg-[oklch(0.22_0.04_142)] text-[oklch(0.7_0.14_142)]",
    recruiter: "bg-[oklch(0.22_0.04_80)] text-[oklch(0.7_0.14_80)]",
    candidate: "bg-[oklch(0.22_0.04_300)] text-[oklch(0.7_0.14_300)]",
  };

  return (
    <tr
      className="border-b border-border hover:bg-muted/30 cursor-pointer transition-colors duration-100 group"
      data-ocid="pulse-row"
      onClick={() => {
        window.location.href = detailPath;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") window.location.href = detailPath;
      }}
      tabIndex={0}
    >
      {/* Entity name + icon */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground truncate group-hover:text-primary transition-colors">
              {entry.name}
            </p>
            {entry.company && (
              <p className="text-[10px] text-muted-foreground truncate">
                {entry.company}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Type badge */}
      <td className="py-2.5 px-3 hidden sm:table-cell">
        <span
          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
            typeColors[entry.entityType]
          }`}
        >
          {getEntityTypeLabel(entry.entityType)}
        </span>
      </td>

      {/* Stage */}
      <td className="py-2.5 px-3 hidden md:table-cell">
        <span className="text-xs text-muted-foreground">
          {entry.currentStage}
        </span>
      </td>

      {/* Health */}
      <td className="py-2.5 px-3">
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${healthDotClass(entry.healthScore)}`}
          />
          <span
            className={`text-xs font-semibold font-mono ${healthTextClass(entry.healthScore)}`}
          >
            {entry.healthScore}
          </span>
        </div>
      </td>

      {/* Last Activity */}
      <td className="py-2.5 px-3 hidden lg:table-cell">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 flex-shrink-0" />
          {entry.lastActivityAt
            ? formatRelativeTime(entry.lastActivityAt)
            : "No activity"}
        </div>
      </td>

      {/* Action Needed */}
      <td className="py-2.5 px-3 hidden sm:table-cell">
        {entry.actionsNeeded.length > 0 || pendingCount > 0 ? (
          <Link
            to="/approvals"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400 hover:text-amber-300 transition-colors"
            data-ocid="action-needed-link"
          >
            <AlertCircle className="h-3 w-3" />
            {entry.actionsNeeded.length > 0
              ? entry.actionsNeeded[0]
              : `${pendingCount} pending`}
          </Link>
        ) : (
          <span className="text-[10px] text-muted-foreground">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-2.5 px-3">
        <Link
          to={detailPath}
          onClick={(e) => e.stopPropagation()}
          className="text-[10px] text-primary hover:text-primary/80 font-medium transition-colors"
          data-ocid="view-entity-btn"
        >
          View →
        </Link>
      </td>
    </tr>
  );
}

// ── Mobile card ───────────────────────────────────────────────────────────────

function PulseMobileCard({ entry }: { entry: PulseEntry }) {
  const Icon = getEntityTypeIcon(entry.entityType);
  const detailPath = getDetailPath(entry.entityId, entry.entityType);

  return (
    <Link
      to={detailPath}
      className="block bg-card border border-border rounded p-3 hover:border-primary/40 transition-colors"
      data-ocid="pulse-card"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-muted flex items-center justify-center flex-shrink-0">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {entry.name}
            </p>
            {entry.company && (
              <p className="text-[11px] text-muted-foreground truncate">
                {entry.company}
              </p>
            )}
          </div>
        </div>
        <HealthBadge score={entry.healthScore} showScore size="sm" />
      </div>
      <div className="flex items-center gap-2 mt-2 flex-wrap">
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {getEntityTypeLabel(entry.entityType)}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {entry.currentStage}
        </span>
        {entry.lastActivityAt && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 ml-auto">
            <Clock className="h-2.5 w-2.5" />
            {formatRelativeTime(entry.lastActivityAt)}
          </span>
        )}
      </div>
      {entry.actionsNeeded.length > 0 && (
        <div className="mt-1.5">
          <span className="text-[10px] text-amber-400 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {entry.actionsNeeded[0]}
          </span>
        </div>
      )}
    </Link>
  );
}

// ── Skeleton rows ─────────────────────────────────────────────────────────────

function SkeletonRows() {
  return (
    <>
      {Array.from({ length: 6 }, (_, i) => `skel-row-${i}`).map((key) => (
        <tr key={key} className="border-b border-border">
          <td className="py-2.5 px-3">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded" />
              <Skeleton className="h-3.5 w-28" />
            </div>
          </td>
          <td className="py-2.5 px-3 hidden sm:table-cell">
            <Skeleton className="h-4 w-16" />
          </td>
          <td className="py-2.5 px-3 hidden md:table-cell">
            <Skeleton className="h-3.5 w-20" />
          </td>
          <td className="py-2.5 px-3">
            <Skeleton className="h-4 w-10" />
          </td>
          <td className="py-2.5 px-3 hidden lg:table-cell">
            <Skeleton className="h-3.5 w-16" />
          </td>
          <td className="py-2.5 px-3 hidden sm:table-cell">
            <Skeleton className="h-3.5 w-20" />
          </td>
          <td className="py-2.5 px-3">
            <Skeleton className="h-3.5 w-10" />
          </td>
        </tr>
      ))}
    </>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const {
    data: dashboard,
    isLoading,
    dataUpdatedAt,
    refetch,
  } = usePulseDashboard();
  const { data: approvals } = usePendingApprovals();
  const seedMutation = useSeedSampleData();
  const followUpMutation = useRunFollowUpEngine();
  const { dismissed, dismiss } = useBriefingDismissed();
  const [briefingVisible, setBriefingVisible] = useState(!dismissed);

  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("health-desc");
  const [followUpResult, setFollowUpResult] = useState<number | null>(null);

  const pendingApprovalsCount = approvals?.length ?? 0;

  // Color distribution counts
  const colorCounts = useMemo(() => {
    const entries = dashboard?.entries ?? [];
    return {
      green: entries.filter(
        (e) => computeHealthStatus(e.healthScore) === "green",
      ).length,
      yellow: entries.filter(
        (e) => computeHealthStatus(e.healthScore) === "yellow",
      ).length,
      red: entries.filter((e) => computeHealthStatus(e.healthScore) === "red")
        .length,
    };
  }, [dashboard]);

  // Filtered + sorted entries
  const filteredEntries = useMemo(() => {
    let entries = dashboard?.entries ?? [];

    if (filter !== "all") {
      entries = entries.filter((e) => e.entityType === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.company ?? "").toLowerCase().includes(q) ||
          e.currentStage.toLowerCase().includes(q),
      );
    }

    return [...entries].sort((a, b) => {
      switch (sortKey) {
        case "health-desc":
          return b.healthScore - a.healthScore;
        case "health-asc":
          return a.healthScore - b.healthScore;
        case "last-activity":
          return (b.lastActivityAt ?? 0) - (a.lastActivityAt ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  }, [dashboard, filter, search, sortKey]);

  const hasData = (dashboard?.entries.length ?? 0) > 0;
  const lastUpdatedLabel = dataUpdatedAt
    ? formatRelativeTime(dataUpdatedAt)
    : "—";

  const handleRunFollowUpEngine = async () => {
    const before = (dashboard?.entries ?? []).reduce(
      (acc, e) => acc + e.actionsNeeded.length,
      0,
    );
    await followUpMutation.mutateAsync();
    await refetch();
    const after = (dashboard?.entries ?? []).reduce(
      (acc, e) => acc + e.actionsNeeded.length,
      0,
    );
    setFollowUpResult(Math.max(0, after - before));
    setTimeout(() => setFollowUpResult(null), 5000);
  };

  if (isLoading) return <PageLoadingSpinner />;

  return (
    <div className="flex flex-col gap-0 pb-6" data-ocid="dashboard-page">
      {/* ── Morning Briefing ────────────────────────────────────────────────── */}
      {briefingVisible && (
        <div className="px-4 pt-4">
          <MorningBriefingPanel
            onDismiss={() => {
              dismiss();
              setBriefingVisible(false);
            }}
          />
        </div>
      )}
      {/* ── Stats bar ──────────────────────────────────────────────────────── */}
      <div className="bg-card border-b border-border px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <StatCard
            label="Vendors"
            value={dashboard?.totalVendors ?? 0}
            icon={Building2}
            onClick={() => {
              window.location.href = "/vendors";
            }}
          />
          <StatCard
            label="Clients"
            value={dashboard?.totalClients ?? 0}
            icon={Briefcase}
            onClick={() => {
              window.location.href = "/clients";
            }}
          />
          <StatCard
            label="Recruiters"
            value={dashboard?.totalRecruiters ?? 0}
            icon={Users}
            onClick={() => {
              window.location.href = "/recruiters";
            }}
          />
          <StatCard
            label="Candidates"
            value={dashboard?.totalCandidates ?? 0}
            icon={UserCheck}
            onClick={() => {
              window.location.href = "/candidates";
            }}
          />
          <StatCard
            label="Pending Approvals"
            value={pendingApprovalsCount}
            icon={AlertCircle}
            iconColor={pendingApprovalsCount > 0 ? "text-amber-400" : undefined}
            onClick={() => {
              window.location.href = "/approvals";
            }}
          />
          {/* Health distribution */}
          <div
            className="bg-card border border-border rounded-sm p-3 flex flex-col gap-2"
            data-ocid="health-dist-card"
          >
            <span className="text-xs text-muted-foreground font-medium">
              Health
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs font-semibold text-[#22c55e]">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                {colorCounts.green}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#eab308]">
                <span className="w-2 h-2 rounded-full bg-[#eab308]" />
                {colorCounts.yellow}
              </span>
              <span className="flex items-center gap-1 text-xs font-semibold text-[#ef4444]">
                <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                {colorCounts.red}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Legend + actions bar ────────────────────────────────────────────── */}
      <div className="bg-muted/20 border-b border-border px-4 py-2 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            Active (70-100)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
            Warning (40-79)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
            Critical (&lt;40)
          </span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            Updated {lastUpdatedLabel}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => refetch()}
            data-ocid="refresh-btn"
          >
            <RefreshCw className="h-3 w-3" />
            Refresh
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleRunFollowUpEngine}
            disabled={followUpMutation.isPending}
            data-ocid="run-followup-engine-btn"
          >
            <Zap className="h-3 w-3" />
            {followUpMutation.isPending ? "Running…" : "Run Follow-Up Engine"}
          </Button>
        </div>
      </div>

      {/* Follow-up result toast */}
      {followUpResult !== null && (
        <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 bg-primary/10 border border-primary/20 rounded text-xs text-primary">
          <Sparkles className="h-3.5 w-3.5 flex-shrink-0" />
          {followUpResult > 0
            ? `Generated ${followUpResult} new follow-up suggestion${followUpResult !== 1 ? "s" : ""}`
            : "Follow-up engine ran — no new suggestions at this time"}
        </div>
      )}

      {/* ── Filter + search bar ─────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2 items-center">
        <FilterToggle active={filter} onChange={setFilter} />
        <div className="flex items-center gap-2 ml-auto flex-1 min-w-[160px] max-w-xs">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search entities…"
            className="h-7 text-xs bg-card border-border"
            data-ocid="search-input"
          />
          <SortDropdown value={sortKey} onChange={setSortKey} />
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      {!hasData ? (
        /* Empty state */
        <div className="px-4">
          <EmptyState
            icon={Database}
            title="No entities yet"
            message="Seed the system with sample data to see vendors, clients, recruiters, and candidates in the Pulse dashboard."
            action={{
              label: seedMutation.isPending ? "Seeding…" : "Seed Sample Data",
              onClick: () => seedMutation.mutate(),
            }}
          />
        </div>
      ) : filteredEntries.length === 0 ? (
        /* No results from filter/search */
        <div className="px-4">
          <EmptyState
            title="No matches found"
            message="Try adjusting your filters or search term."
          />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="px-4 hidden md:block" data-ocid="pulse-table">
            <div className="bg-card border border-border rounded overflow-hidden">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Entity
                    </th>
                    <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Type
                    </th>
                    <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                      Stage
                    </th>
                    <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Health
                    </th>
                    <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                      Last Activity
                    </th>
                    <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                      Action Needed
                    </th>
                    <th className="text-left py-2 px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <SkeletonRows />
                  ) : (
                    filteredEntries.map((entry) => (
                      <PulseTableRow
                        key={entry.entityId}
                        entry={entry}
                        pendingCount={
                          entry.actionsNeeded.length > 0
                            ? entry.actionsNeeded.length
                            : 0
                        }
                      />
                    ))
                  )}
                </tbody>
              </table>

              {/* Table footer */}
              <div className="border-t border-border bg-muted/20 px-3 py-1.5 flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  {filteredEntries.length} of {dashboard?.entries.length ?? 0}{" "}
                  entities
                </span>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                    {colorCounts.green} active
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#eab308]" />
                    {colorCounts.yellow} warning
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" />
                    {colorCounts.red} critical
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile card stack */}
          <div
            className="px-4 flex flex-col gap-2 md:hidden"
            data-ocid="pulse-cards"
          >
            {isLoading
              ? Array.from({ length: 4 }, (_, i) => `skel-card-${i}`).map(
                  (key) => <Skeleton key={key} className="h-20 rounded" />,
                )
              : filteredEntries.map((entry) => (
                  <PulseMobileCard key={entry.entityId} entry={entry} />
                ))}
          </div>
        </>
      )}

      {/* ── Bottom legend ───────────────────────────────────────────────────── */}
      <div className="px-4 mt-4 flex items-center gap-4 text-[10px] text-muted-foreground border-t border-border pt-3 flex-wrap">
        <span className="font-medium">Legend:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Green = Active
          (health 70-100, last activity &lt;24h)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#eab308]" /> Yellow =
          Warning (health 40-69, 1-2 days)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Red = Critical
          (health &lt;40, stale 3+ days)
        </span>
      </div>
    </div>
  );
}
