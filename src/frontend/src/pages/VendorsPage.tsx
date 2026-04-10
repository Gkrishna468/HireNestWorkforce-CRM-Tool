import { PageHeader } from "@/components/layout/PageHeader";
import { AppModal } from "@/components/ui/AppModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { HealthBadge } from "@/components/ui/HealthBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  useCreateApprovalItem,
  useCreateVendor,
  useUpdateEntityStage,
  useVendors,
} from "@/hooks/use-crm";
import { computeHealthStatus } from "@/lib/utils/health";
import { VENDOR_STAGES, stageRequiresApproval } from "@/lib/utils/pipeline";
import type { Vendor } from "@/types/crm";
import type { VendorFormInput } from "@/types/forms";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Clock,
  LayoutGrid,
  List,
  Plus,
  Send,
  Timer,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getDaysInStage(vendor: Vendor): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((Date.now() - vendor.updatedAt) / msPerDay);
}

function getLastActivity(vendor: Vendor): string {
  const diff = Date.now() - vendor.updatedAt;
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${d}d ago`;
}

// ── Vendor Card (Kanban) ──────────────────────────────────────────────────────

function VendorKanbanCard({
  vendor,
  onDragStart,
}: {
  vendor: Vendor;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const status = computeHealthStatus(vendor.healthScore);
  const days = getDaysInStage(vendor);

  return (
    <Link to="/vendors/$vendorId" params={{ vendorId: vendor.id }}>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, vendor.id)}
        className="bg-card border border-border rounded-md p-2.5 cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors group"
        data-ocid="vendor-kanban-card"
      >
        <div className="flex items-start justify-between gap-1.5 mb-1.5">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-foreground truncate leading-tight group-hover:text-primary transition-colors">
              {vendor.name}
            </p>
            {vendor.company && (
              <p className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                {vendor.company}
              </p>
            )}
          </div>
          <HealthBadge score={vendor.healthScore} status={status} />
        </div>
        <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground flex-wrap">
          <span className="flex items-center gap-0.5">
            <Timer className="h-2.5 w-2.5 flex-shrink-0" />
            {days}d in stage
          </span>
          <span className="flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5 flex-shrink-0" />
            {getLastActivity(vendor)}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Kanban Column ─────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  vendors,
  onDrop,
  onDragStart,
}: {
  stage: string;
  vendors: Vendor[];
  onDrop: (e: React.DragEvent, stage: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={[
        "flex flex-col gap-2 min-h-[200px] rounded-md p-2 border transition-colors",
        isDragOver
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-muted/20",
      ].join(" ")}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        setIsDragOver(false);
        onDrop(e, stage);
      }}
      data-ocid={`kanban-col-${stage.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <div className="flex items-center justify-between px-0.5 mb-1">
        <span className="text-[11px] font-semibold text-foreground uppercase tracking-wider">
          {stage}
        </span>
        <Badge
          variant="secondary"
          className="h-4 text-[10px] px-1.5 leading-none"
        >
          {vendors.length}
        </Badge>
      </div>
      {vendors.length === 0 ? (
        <div className="flex-1 flex items-center justify-center py-4">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            Drop here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {vendors.map((v) => (
            <VendorKanbanCard key={v.id} vendor={v} onDragStart={onDragStart} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── List Row ──────────────────────────────────────────────────────────────────

function VendorListRow({ vendor }: { vendor: Vendor }) {
  const status = computeHealthStatus(vendor.healthScore);

  return (
    <Link to="/vendors/$vendorId" params={{ vendorId: vendor.id }}>
      <div
        className="grid grid-cols-[1fr_100px_80px_90px_80px_80px_60px_60px] gap-2 px-3 py-2 text-xs border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer items-center"
        data-ocid="vendor-list-row"
      >
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{vendor.name}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            {vendor.company ?? "—"}
          </p>
        </div>
        <span className="text-muted-foreground truncate">
          {vendor.currentStage}
        </span>
        <HealthBadge score={vendor.healthScore} status={status} showScore />
        <span className="text-muted-foreground">{getLastActivity(vendor)}</span>
        <span className="text-muted-foreground text-center">—</span>
        <span className="text-muted-foreground text-center">—</span>
        <span className="text-muted-foreground text-center">—</span>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
          View
        </Button>
      </div>
    </Link>
  );
}

// ── Vendor Form ───────────────────────────────────────────────────────────────

function VendorForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (data: VendorFormInput) => void;
  isLoading: boolean;
}) {
  const [form, setForm] = useState<VendorFormInput>({
    name: "",
    email: "",
    phone: "",
    company: "",
    specialty: "",
    notes: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3" data-ocid="vendor-form">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Company Name</Label>
          <Input
            name="company"
            value={form.company ?? ""}
            onChange={handleChange}
            placeholder="Acme Staffing"
            className="h-8 text-xs"
            data-ocid="vendor-form-company"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Contact Name *</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className="h-8 text-xs"
            required
            data-ocid="vendor-form-name"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs">Email *</Label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="jane@acme.com"
            className="h-8 text-xs"
            required
            data-ocid="vendor-form-email"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Phone</Label>
          <Input
            name="phone"
            value={form.phone ?? ""}
            onChange={handleChange}
            placeholder="+1 555 000 0000"
            className="h-8 text-xs"
            data-ocid="vendor-form-phone"
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Specialty</Label>
        <Input
          name="specialty"
          value={form.specialty ?? ""}
          onChange={handleChange}
          placeholder="e.g. IT Staffing, Finance, Healthcare"
          className="h-8 text-xs"
          data-ocid="vendor-form-specialty"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Notes</Label>
        <Textarea
          name="notes"
          value={form.notes ?? ""}
          onChange={handleChange}
          placeholder="Any relevant notes..."
          className="text-xs min-h-[60px] resize-none"
          data-ocid="vendor-form-notes"
        />
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={isLoading}
          data-ocid="vendor-form-submit"
        >
          {isLoading ? "Adding…" : "Add Vendor"}
        </Button>
      </div>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function VendorsPage() {
  const { data: vendors = [], isLoading } = useVendors();
  const createVendor = useCreateVendor();
  const updateStage = useUpdateEntityStage();
  const createApproval = useCreateApprovalItem();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [showModal, setShowModal] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  // Group by stage for Kanban
  const byStage: Record<string, Vendor[]> = {};
  for (const s of VENDOR_STAGES) byStage[s] = [];
  for (const v of vendors) {
    const stage = v.currentStage ?? "Discovery";
    if (byStage[stage]) byStage[stage].push(v);
    else byStage.Discovery?.push(v);
  }

  function handleDragStart(e: React.DragEvent, id: string) {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: React.DragEvent, newStage: string) {
    e.preventDefault();
    if (!dragId) return;
    const vendor = vendors.find((v) => v.id === dragId);
    if (!vendor || vendor.currentStage === newStage) return;

    if (stageRequiresApproval("vendor", newStage)) {
      createApproval.mutate(
        {
          entityId: vendor.id,
          entityType: "vendor",
          itemType: "stage_change",
          description: `Move ${vendor.name} to ${newStage}`,
          details: `Requested stage transition: ${vendor.currentStage} → ${newStage}`,
        },
        {
          onSuccess: () =>
            toast.info("Stage change queued for approval", {
              description: `${vendor.name} → ${newStage}`,
            }),
        },
      );
    } else {
      updateStage.mutate(
        { entityId: vendor.id, entityType: "vendor", newStage },
        {
          onSuccess: () =>
            toast.success(`Moved to ${newStage}`, {
              description: vendor.name,
            }),
        },
      );
    }
    setDragId(null);
  }

  function handleAddVendor(data: VendorFormInput) {
    createVendor.mutate(data, {
      onSuccess: () => {
        setShowModal(false);
        toast.success("Vendor added");
      },
      onError: () => toast.error("Failed to add vendor"),
    });
  }

  return (
    <div className="flex flex-col h-full" data-ocid="vendors-page">
      <PageHeader
        title="Vendors"
        subtitle={`${vendors.length} vendor${vendors.length !== 1 ? "s" : ""} · Discovery → Optimization pipeline`}
        actions={
          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setView("kanban")}
                className={[
                  "flex items-center gap-1 px-2 py-1 text-[11px] transition-colors",
                  view === "kanban"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                data-ocid="view-kanban"
              >
                <LayoutGrid className="h-3 w-3" />
                Kanban
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={[
                  "flex items-center gap-1 px-2 py-1 text-[11px] transition-colors",
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                ].join(" ")}
                data-ocid="view-list"
              >
                <List className="h-3 w-3" />
                List
              </button>
            </div>
            <Button
              size="sm"
              onClick={() => setShowModal(true)}
              className="h-7 gap-1 text-xs"
              data-ocid="add-vendor-btn"
            >
              <Plus className="h-3 w-3" />
              Add Vendor
            </Button>
          </div>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-auto bg-background">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-md" />
            ))}
          </div>
        ) : vendors.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No vendors yet"
            message="Add your first vendor to start managing the pipeline."
            action={{ label: "Add Vendor", onClick: () => setShowModal(true) }}
          />
        ) : view === "kanban" ? (
          <div className="p-4 overflow-x-auto">
            <div
              className="grid gap-3 min-w-[900px]"
              style={{
                gridTemplateColumns: `repeat(${VENDOR_STAGES.length}, minmax(160px, 1fr))`,
              }}
            >
              {VENDOR_STAGES.map((stage) => (
                <KanbanColumn
                  key={stage}
                  stage={stage}
                  vendors={byStage[stage] ?? []}
                  onDrop={handleDrop}
                  onDragStart={handleDragStart}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_100px_80px_90px_80px_80px_60px_60px] gap-2 px-3 py-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border">
              <span>Name / Company</span>
              <span>Stage</span>
              <span>Health</span>
              <span>Last Activity</span>
              <span className="text-center">Submissions</span>
              <span className="text-center">Resp. Time</span>
              <span className="text-center">Quality</span>
              <span />
            </div>
            {vendors.map((v) => (
              <VendorListRow key={v.id} vendor={v} />
            ))}
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      <AppModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Add Vendor"
        description="Enter vendor contact and company details."
        size="md"
      >
        <VendorForm
          onSubmit={handleAddVendor}
          isLoading={createVendor.isPending}
        />
      </AppModal>
    </div>
  );
}
