import { AppModal } from "@/components/ui/AppModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { StageProgressBar } from "@/components/ui/StageProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreateRecruiter, useRecruiters } from "@/hooks/use-crm";
import { computeHealthStatus } from "@/lib/utils/health";
import { RECRUITER_STAGES } from "@/lib/utils/pipeline";
import type { Recruiter } from "@/types/crm";
import type { RecruiterFormInput } from "@/types/forms";
import { Link } from "@tanstack/react-router";
import { LayoutGrid, List, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Recruiter Kanban Card ─────────────────────────────────────────────────────

function RecruiterKanbanCard({ recruiter }: { recruiter: Recruiter }) {
  const healthStatus = computeHealthStatus(recruiter.healthScore);
  return (
    <Link
      to="/recruiters/$recruiterId"
      params={{ recruiterId: recruiter.id }}
      className="block"
      data-ocid="recruiter-kanban-card"
    >
      <div className="entity-card cursor-pointer group">
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-xs font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {recruiter.name}
          </span>
          <HealthBadge status={healthStatus} size="sm" />
        </div>
        {recruiter.title && (
          <p className="text-[10px] text-muted-foreground truncate mb-2">
            {recruiter.title}
          </p>
        )}
        <div className="flex items-center gap-3 mt-2">
          <div className="flex flex-col items-center">
            <span
              className={`text-sm font-bold ${
                recruiter.healthScore >= 70
                  ? "text-[#22c55e]"
                  : recruiter.healthScore >= 40
                    ? "text-[#eab308]"
                    : "text-[#ef4444]"
              }`}
            >
              {recruiter.healthScore}
            </span>
            <span className="text-[9px] text-muted-foreground">score</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-foreground">—</span>
            <span className="text-[9px] text-muted-foreground">calls</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-bold text-foreground">—</span>
            <span className="text-[9px] text-muted-foreground">subs</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── Kanban View ────────────────────────────────────────────────────────────────

const KANBAN_STAGES = [
  "Daily Start",
  "Activity Tracking",
  "Check-ins",
  "Performance",
  "Coaching",
] as const;

function KanbanView({ recruiters }: { recruiters: Recruiter[] }) {
  // Map recruiter pipeline stages to kanban display stages
  const stageMap: Record<string, string> = {
    Onboarding: "Daily Start",
    Active: "Activity Tracking",
    "High-Performer": "Performance",
    Coaching: "Coaching",
    "Exit Risk": "Coaching",
  };

  const grouped = KANBAN_STAGES.reduce<Record<string, Recruiter[]>>(
    (acc, stage) => {
      acc[stage] = [];
      return acc;
    },
    {},
  );

  for (const r of recruiters) {
    const displayStage = stageMap[r.currentStage] ?? "Activity Tracking";
    grouped[displayStage].push(r);
  }

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-4 pt-1 px-4"
      data-ocid="recruiter-kanban"
    >
      {KANBAN_STAGES.map((stage) => {
        const cols = grouped[stage] ?? [];
        return (
          <div key={stage} className="flex-shrink-0 w-52">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                {stage}
              </span>
              <Badge
                variant="secondary"
                className="text-[10px] h-4 px-1.5 min-w-[20px] flex items-center justify-center"
              >
                {cols.length}
              </Badge>
            </div>
            <div className="space-y-2 min-h-[120px]">
              {cols.map((r) => (
                <RecruiterKanbanCard key={r.id} recruiter={r} />
              ))}
              {cols.length === 0 && (
                <div className="rounded-sm border border-dashed border-border h-16 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground/50">
                    Empty
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── List View ─────────────────────────────────────────────────────────────────

function ListView({ recruiters }: { recruiters: Recruiter[] }) {
  return (
    <div className="px-4 pt-2" data-ocid="recruiter-list">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8">
              Name
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8">
              Stage
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8">
              Health
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8 text-right">
              Score
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8 text-right">
              Calls
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8 text-right">
              Emails
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8 text-right">
              Subs
            </TableHead>
            <TableHead className="text-[11px] font-semibold text-muted-foreground h-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {recruiters.map((r) => {
            const healthStatus = computeHealthStatus(r.healthScore);
            return (
              <TableRow
                key={r.id}
                className="border-border hover:bg-muted/30 cursor-pointer"
                data-ocid="recruiter-list-row"
              >
                <TableCell className="py-2">
                  <Link
                    to="/recruiters/$recruiterId"
                    params={{ recruiterId: r.id }}
                    className="block"
                  >
                    <span className="text-xs font-medium text-foreground hover:text-primary transition-colors">
                      {r.name}
                    </span>
                    {r.title && (
                      <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                        {r.title}
                      </p>
                    )}
                  </Link>
                </TableCell>
                <TableCell className="py-2">
                  <div className="w-28">
                    <StageProgressBar
                      stages={RECRUITER_STAGES}
                      currentStage={r.currentStage}
                      compact
                    />
                    <span className="text-[9px] text-muted-foreground mt-0.5 block truncate">
                      {r.currentStage}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <HealthBadge status={healthStatus} size="sm" showLabel />
                </TableCell>
                <TableCell className="py-2 text-right">
                  <span
                    className={`text-xs font-semibold tabular-nums ${
                      r.healthScore >= 70
                        ? "text-[#22c55e]"
                        : r.healthScore >= 40
                          ? "text-[#eab308]"
                          : "text-[#ef4444]"
                    }`}
                  >
                    {r.healthScore}
                  </span>
                </TableCell>
                <TableCell className="py-2 text-right text-xs text-muted-foreground tabular-nums">
                  —
                </TableCell>
                <TableCell className="py-2 text-right text-xs text-muted-foreground tabular-nums">
                  —
                </TableCell>
                <TableCell className="py-2 text-right text-xs text-muted-foreground tabular-nums">
                  —
                </TableCell>
                <TableCell className="py-2">
                  <Link
                    to="/recruiters/$recruiterId"
                    params={{ recruiterId: r.id }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-[10px] px-2 text-muted-foreground hover:text-foreground"
                    >
                      View
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

// ── Add Recruiter Modal ───────────────────────────────────────────────────────

function AddRecruiterModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const createRecruiter = useCreateRecruiter();
  const [form, setForm] = useState<RecruiterFormInput>({
    name: "",
    email: "",
    phone: "",
  });

  function handleChange(field: keyof RecruiterFormInput, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    try {
      await createRecruiter.mutateAsync(form);
      toast.success("Recruiter added");
      onOpenChange(false);
      setForm({ name: "", email: "", phone: "" });
    } catch {
      toast.error("Failed to add recruiter");
    }
  }

  return (
    <AppModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add Recruiter"
      description="Create a new recruiter profile"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Name *
          </Label>
          <Input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Full name"
            className="h-8 text-xs bg-background"
            required
            data-ocid="recruiter-name-input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Email *
          </Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="work@email.com"
            className="h-8 text-xs bg-background"
            required
            data-ocid="recruiter-email-input"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-medium text-muted-foreground">
            Phone
          </Label>
          <Input
            value={form.phone ?? ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+1 (555) 000-0000"
            className="h-8 text-xs bg-background"
            data-ocid="recruiter-phone-input"
          />
        </div>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="h-7 text-xs"
            disabled={
              createRecruiter.isPending ||
              !form.name.trim() ||
              !form.email.trim()
            }
            data-ocid="recruiter-submit-btn"
          >
            {createRecruiter.isPending ? "Adding…" : "Add Recruiter"}
          </Button>
        </div>
      </form>
    </AppModal>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────

function KanbanSkeleton() {
  return (
    <div className="flex gap-3 overflow-x-auto px-4 pt-1 pb-4">
      {KANBAN_STAGES.map((s) => (
        <div key={s} className="flex-shrink-0 w-52 space-y-2">
          <Skeleton className="h-4 w-24" />
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-sm" />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function RecruitersPage() {
  const { data: recruiters, isLoading } = useRecruiters();
  const [modalOpen, setModalOpen] = useState(false);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const list = recruiters ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-foreground font-display">
            Recruiters
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {list.length} total
            </span>
          </h2>
          <p className="text-[11px] text-muted-foreground hidden sm:block">
            Team productivity and performance pipeline
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 bg-muted rounded-sm p-0.5">
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 rounded-sm transition-smooth ${view === "kanban" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setView("kanban")}
              aria-label="Kanban view"
              data-ocid="view-kanban-btn"
            >
              <LayoutGrid className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-6 w-6 rounded-sm transition-smooth ${view === "list" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => setView("list")}
              aria-label="List view"
              data-ocid="view-list-btn"
            >
              <List className="h-3 w-3" />
            </Button>
          </div>
          <Button
            size="sm"
            className="h-7 text-xs gap-1.5"
            onClick={() => setModalOpen(true)}
            data-ocid="add-recruiter-btn"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Recruiter
          </Button>
        </div>
      </div>

      {/* Tabs: Kanban / List */}
      <div className="flex-1 overflow-y-auto bg-background">
        <Tabs
          value={view}
          onValueChange={(v) => setView(v as "kanban" | "list")}
          className="h-full"
        >
          <div className="px-4 pt-3 border-b border-border bg-card">
            <TabsList className="h-7 text-xs bg-muted gap-0.5">
              <TabsTrigger
                value="kanban"
                className="h-6 text-xs px-3"
                data-ocid="tab-kanban"
              >
                <LayoutGrid className="h-3 w-3 mr-1.5" />
                Kanban View
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-6 text-xs px-3"
                data-ocid="tab-list"
              >
                <List className="h-3 w-3 mr-1.5" />
                List View
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="kanban" className="mt-0 py-3">
            {isLoading ? (
              <KanbanSkeleton />
            ) : list.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No recruiters yet"
                message="Add your first recruiter to start tracking team performance."
                action={{
                  label: "Add Recruiter",
                  onClick: () => setModalOpen(true),
                }}
              />
            ) : (
              <KanbanView recruiters={list} />
            )}
          </TabsContent>

          <TabsContent value="list" className="mt-0 py-2">
            {isLoading ? (
              <div className="px-4 pt-2 space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : list.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No recruiters yet"
                message="Add your first recruiter to start tracking team performance."
                action={{
                  label: "Add Recruiter",
                  onClick: () => setModalOpen(true),
                }}
              />
            ) : (
              <ListView recruiters={list} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddRecruiterModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
