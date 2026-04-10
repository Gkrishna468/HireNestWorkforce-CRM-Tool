import { AppModal } from "@/components/ui/AppModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useClients,
  useCreateApprovalItem,
  useCreateClient,
  useUpdateEntityStage,
} from "@/hooks/use-crm";
import { formatRelativeTime } from "@/lib/utils/format";

import { CLIENT_STAGES, stageRequiresApproval } from "@/lib/utils/pipeline";
import type { Client } from "@/types/crm";
import type { ClientFormInput } from "@/types/forms";
import { Link } from "@tanstack/react-router";
import {
  Briefcase,
  GripVertical,
  LayoutGrid,
  List,
  Plus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

// ── Helpers ────────────────────────────────────────────────────────────────────

const STAGE_COLORS: Record<string, string> = {
  Prospect: "border-l-[oklch(0.65_0.21_200)]",
  Qualified: "border-l-[oklch(0.68_0.22_142)]",
  Active: "border-l-[oklch(0.5_0.18_207)]",
  Negotiation: "border-l-[oklch(0.85_0.24_80)]",
  "Closed-Won": "border-l-[oklch(0.68_0.22_142)]",
  Growth: "border-l-[oklch(0.5_0.18_207)]",
};

function getDaysInStage(updatedAt: number): number {
  return Math.floor((Date.now() - updatedAt) / (1000 * 60 * 60 * 24));
}

// ── Client Form ────────────────────────────────────────────────────────────────

interface ClientFormProps {
  onSubmit: (input: ClientFormInput) => void;
  loading: boolean;
}

function ClientForm({ onSubmit, loading }: ClientFormProps) {
  const [form, setForm] = useState<ClientFormInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    notes: "",
  });

  const set = (key: keyof ClientFormInput, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-ocid="client-form">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label className="text-xs text-muted-foreground">
            Company Name *
          </Label>
          <Input
            value={form.company ?? ""}
            onChange={(e) => set("company", e.target.value)}
            placeholder="Acme Technologies"
            className="h-8 text-sm bg-background"
            data-ocid="client-form-company"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">
            Hiring Manager *
          </Label>
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Jane Smith"
            className="h-8 text-sm bg-background"
            required
            data-ocid="client-form-name"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Email *</Label>
          <Input
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            type="email"
            placeholder="jane@acme.com"
            className="h-8 text-sm bg-background"
            required
            data-ocid="client-form-email"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Phone</Label>
          <Input
            value={form.phone ?? ""}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+1 555 0100"
            className="h-8 text-sm bg-background"
            data-ocid="client-form-phone"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Industry</Label>
          <Input
            value={form.industry ?? ""}
            onChange={(e) => set("industry", e.target.value)}
            placeholder="Technology"
            className="h-8 text-sm bg-background"
          />
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-xs text-muted-foreground">Notes</Label>
          <Textarea
            value={form.notes ?? ""}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="Key details about this client..."
            className="text-sm bg-background resize-none"
            rows={3}
            data-ocid="client-form-notes"
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1 border-t border-border">
        <Button
          type="submit"
          size="sm"
          disabled={loading || !form.name.trim() || !form.email.trim()}
          data-ocid="client-form-submit"
        >
          {loading ? "Creating…" : "Create Client"}
        </Button>
      </div>
    </form>
  );
}

// ── Kanban Card ────────────────────────────────────────────────────────────────

interface KanbanCardProps {
  client: Client;
  onDragStart: (e: React.DragEvent, clientId: string) => void;
}

function KanbanCard({ client, onDragStart }: KanbanCardProps) {
  const days = getDaysInStage(client.updatedAt);
  const stageColor = STAGE_COLORS[client.currentStage] ?? "border-l-border";

  return (
    <Link to="/clients/$clientId" params={{ clientId: client.id }}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, client.id)}
        className={`entity-card border-l-2 ${stageColor} cursor-grab active:cursor-grabbing group`}
        data-ocid="client-kanban-card"
      >
        <div className="flex items-start justify-between gap-1.5 mb-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate leading-snug">
              {client.company ?? client.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {client.name}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <GripVertical className="h-3 w-3 text-muted-foreground/40 group-hover:text-muted-foreground transition-smooth" />
            <HealthBadge score={client.healthScore} size="sm" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span>{days}d in stage</span>
          {client.healthScore < 40 && (
            <span className="flex items-center gap-0.5 text-[oklch(0.65_0.19_22)]">
              <TrendingDown className="h-2.5 w-2.5" />
              Churn risk
            </span>
          )}
          {client.healthScore >= 70 && (
            <span className="flex items-center gap-0.5 text-[oklch(0.68_0.22_142)] ml-auto">
              <TrendingUp className="h-2.5 w-2.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ── Kanban Column ──────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  stage: string;
  clients: Client[];
  onDragStart: (e: React.DragEvent, clientId: string) => void;
  onDrop: (e: React.DragEvent, stage: string) => void;
}

function KanbanColumn({
  stage,
  clients,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  const [dragOver, setDragOver] = useState(false);
  const requiresApproval = stageRequiresApproval("client", stage);

  return (
    <div className="flex flex-col min-w-[200px] w-[200px] flex-shrink-0">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-foreground font-display truncate">
            {stage}
          </span>
          {requiresApproval && (
            <span className="text-[9px] px-1 py-0.5 rounded bg-[oklch(0.85_0.24_80)]/20 text-[oklch(0.85_0.24_80)] border border-[oklch(0.85_0.24_80)]/30">
              gate
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
          {clients.length}
        </span>
      </div>
      <div
        className={`flex-1 min-h-[120px] rounded-sm border border-dashed transition-smooth p-1.5 space-y-1.5 ${
          dragOver ? "border-primary/60 bg-primary/5" : "border-border/50"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          setDragOver(false);
          onDrop(e, stage);
        }}
        data-ocid={`kanban-column-${stage.toLowerCase().replace(/\s+/g, "-")}`}
      >
        {clients.map((c) => (
          <KanbanCard key={c.id} client={c} onDragStart={onDragStart} />
        ))}
        {clients.length === 0 && (
          <div className="flex items-center justify-center h-16 text-[10px] text-muted-foreground/40">
            No clients
          </div>
        )}
      </div>
    </div>
  );
}

// ── List View ──────────────────────────────────────────────────────────────────

function ListView({ clients }: { clients: Client[] }) {
  return (
    <div className="overflow-x-auto" data-ocid="clients-list-view">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {[
              "Company",
              "Hiring Manager",
              "Stage",
              "Health",
              "Last Activity",
              "Churn Risk",
              "Actions",
            ].map((h) => (
              <th
                key={h}
                className="px-3 py-2 text-left font-semibold text-muted-foreground whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const isAtRisk = client.healthScore < 40;
            return (
              <tr
                key={client.id}
                className="border-b border-border hover:bg-muted/20 transition-smooth"
                data-ocid="client-list-row"
              >
                <td className="px-3 py-2 font-medium text-foreground">
                  <Link
                    to="/clients/$clientId"
                    params={{ clientId: client.id }}
                    className="hover:text-primary transition-smooth"
                  >
                    {client.company ?? client.name}
                  </Link>
                </td>
                <td className="px-3 py-2 text-muted-foreground">
                  {client.name}
                </td>
                <td className="px-3 py-2">
                  <Badge variant="outline" className="text-[10px] py-0 h-5">
                    {client.currentStage}
                  </Badge>
                </td>
                <td className="px-3 py-2">
                  <HealthBadge score={client.healthScore} showScore size="sm" />
                </td>
                <td className="px-3 py-2 text-muted-foreground whitespace-nowrap">
                  {formatRelativeTime(client.updatedAt)}
                </td>
                <td className="px-3 py-2">
                  {isAtRisk ? (
                    <span className="flex items-center gap-1 text-[oklch(0.65_0.19_22)]">
                      <TrendingDown className="h-3 w-3" />
                      High
                    </span>
                  ) : (
                    <span className="text-muted-foreground/50">Low</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <Link
                    to="/clients/$clientId"
                    params={{ clientId: client.id }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px]"
                    >
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const [modalOpen, setModalOpen] = useState(false);
  const dragId = useRef<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = (clients ?? []).filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.company ?? "").toLowerCase().includes(q) ||
      c.currentStage.toLowerCase().includes(q)
    );
  });

  const byStage = CLIENT_STAGES.reduce<Record<string, Client[]>>(
    (acc, stage) => {
      acc[stage] = filtered.filter((c) => c.currentStage === stage);
      return acc;
    },
    {},
  );

  function handleDragStart(e: React.DragEvent, clientId: string) {
    dragId.current = clientId;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent, targetStage: string) {
    e.preventDefault();
    const id = dragId.current;
    if (!id) return;
    dragId.current = null;

    const client = (clients ?? []).find((c) => c.id === id);
    if (!client || client.currentStage === targetStage) return;

    if (stageRequiresApproval("client", targetStage)) {
      createApproval.mutate(
        {
          entityId: id,
          entityType: "client",
          itemType: "stage_change",
          description: `Move ${client.company ?? client.name} → ${targetStage}`,
          details: `Requested stage change from "${client.currentStage}" to "${targetStage}". Negotiation stage requires manager approval.`,
          requestedBy: "Manager",
        },
        {
          onSuccess: () =>
            toast.success(
              `Approval request created for moving to "${targetStage}"`,
            ),
        },
      );
    } else {
      updateStage.mutate(
        { entityId: id, entityType: "client", newStage: targetStage },
        {
          onSuccess: () => toast.success(`Moved to "${targetStage}"`),
        },
      );
    }
  }

  function handleCreate(input: ClientFormInput) {
    createClient.mutate(input, {
      onSuccess: () => {
        setModalOpen(false);
        toast.success("Client created");
      },
      onError: () => toast.error("Failed to create client"),
    });
  }

  const totalActive = (clients ?? []).filter(
    (c) => c.currentStage === "Active",
  ).length;
  const atRisk = (clients ?? []).filter((c) => c.healthScore < 40).length;

  return (
    <div className="flex flex-col h-full" data-ocid="clients-page">
      {/* Page header */}
      <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-4 min-w-0">
          <div>
            <h2 className="text-sm font-semibold text-foreground font-display">
              Clients
            </h2>
            <p className="text-[11px] text-muted-foreground">
              {clients?.length ?? 0} total · {totalActive} active
              {atRisk > 0 && (
                <span className="text-[oklch(0.65_0.19_22)] ml-1">
                  · {atRisk} at risk
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Input
            placeholder="Search clients…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 text-xs w-36 sm:w-48 bg-background"
            data-ocid="clients-search"
          />
          <Button
            size="sm"
            className="h-7 gap-1.5 text-xs"
            onClick={() => setModalOpen(true)}
            data-ocid="add-client-btn"
          >
            <Plus className="h-3 w-3" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="kanban" className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card flex-shrink-0">
            <TabsList className="h-7 bg-muted/60">
              <TabsTrigger
                value="kanban"
                className="h-6 text-[11px] gap-1"
                data-ocid="clients-tab-kanban"
              >
                <LayoutGrid className="h-3 w-3" />
                Kanban
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="h-6 text-[11px] gap-1"
                data-ocid="clients-tab-list"
              >
                <List className="h-3 w-3" />
                List
              </TabsTrigger>
            </TabsList>
            <p className="text-[10px] text-muted-foreground ml-auto hidden sm:block">
              Drag cards between stages · Negotiation requires approval
            </p>
          </div>

          {/* Kanban View */}
          <TabsContent
            value="kanban"
            className="flex-1 overflow-auto p-4 mt-0"
            data-ocid="kanban-board"
          >
            {isLoading ? (
              <div className="flex gap-3">
                {CLIENT_STAGES.map((s) => (
                  <div key={s} className="w-[200px] flex-shrink-0 space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                ))}
              </div>
            ) : (clients?.length ?? 0) === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No clients yet"
                message="Add your first client to start tracking the pipeline."
                action={{
                  label: "Add Client",
                  onClick: () => setModalOpen(true),
                }}
              />
            ) : (
              <div className="flex gap-3 min-w-max pb-2">
                {CLIENT_STAGES.map((stage) => (
                  <KanbanColumn
                    key={stage}
                    stage={stage}
                    clients={byStage[stage] ?? []}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* List View */}
          <TabsContent
            value="list"
            className="flex-1 overflow-auto mt-0"
            data-ocid="list-view"
          >
            {isLoading ? (
              <div className="p-4 space-y-2">
                {["skel1", "skel2", "skel3", "skel4", "skel5"].map((k) => (
                  <Skeleton key={k} className="h-10 w-full" />
                ))}
              </div>
            ) : (clients?.length ?? 0) === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No clients yet"
                message="Add your first client to start tracking the pipeline."
                action={{
                  label: "Add Client",
                  onClick: () => setModalOpen(true),
                }}
              />
            ) : (
              <ListView clients={filtered} />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Client Modal */}
      <AppModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title="Add New Client"
        description="Create a new client account in the pipeline."
        size="md"
      >
        <ClientForm onSubmit={handleCreate} loading={createClient.isPending} />
      </AppModal>
    </div>
  );
}
