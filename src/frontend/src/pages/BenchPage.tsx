import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useBenchRecords,
  useDeleteBenchRecord,
  useUploadBench,
} from "@/hooks/use-crm";
import type { BenchRecord, BenchRecordInput } from "@/types/crm";
import * as RadixDialog from "@radix-ui/react-dialog";
import {
  AlertTriangle,
  Archive,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronsUpDown,
  FileText,
  Info,
  PlusCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

// ── Dynamic CDN import helper (bypasses TS module resolution) ─────────────────

// Using Function constructor to bypass TS static module resolution for CDN URLs
const dynamicImport = new Function("url", "return import(url)") as (
  url: string,
) => Promise<Record<string, unknown>>;

// ── CSV Parser ────────────────────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  fields.push(current.trim());
  return fields;
}

const HEADER_MAP: Record<string, keyof BenchRecordInput> = {
  vendorname: "vendorName",
  vendor: "vendorName",
  company: "vendorName",
  companyname: "vendorName",
  "vendor or company name": "vendorName",
  "vendor/company name": "vendorName",
  "vendor name": "vendorName",
  organization: "vendorName",
  candidatename: "candidateName",
  candidate: "candidateName",
  name: "candidateName",
  "candidate name": "candidateName",
  fullname: "candidateName",
  "full name": "candidateName",
  resource: "candidateName",
  consultant: "candidateName",
  role: "role",
  "job title": "role",
  title: "role",
  position: "role",
  jobtitle: "role",
  designation: "role",
  experience: "experience",
  exp: "experience",
  years: "experience",
  "years of experience": "experience",
  "total experience": "experience",
  yoe: "experience",
  skill: "skill",
  skills: "skill",
  technologies: "skill",
  tech: "skill",
  technology: "skill",
  expertise: "skill",
  "tech stack": "skill",
  rate: "rate",
  "pay rate": "rate",
  "bill rate": "rate",
  "hourly rate": "rate",
  "rate/hr": "rate",
  "rate ($/hr)": "rate",
  compensation: "rate",
};

interface ParseResult {
  records: BenchRecordInput[];
  skippedRows: number;
  unmappedHeaders: string[];
  totalRows: number;
}

/** Map rows (array of string arrays) using column-mapped or positional logic */
function mapRowsToRecords(headers: string[], rows: string[][]): ParseResult {
  const colMap: Record<number, keyof BenchRecordInput> = {};
  const unmappedHeaders: string[] = [];

  headers.forEach((h, i) => {
    const key = h.toLowerCase().replace(/\s+/g, " ").trim();
    if (HEADER_MAP[key]) {
      colMap[i] = HEADER_MAP[key];
    } else {
      unmappedHeaders.push(h);
    }
  });

  // Positional fallback if no headers matched
  const hasMapping = Object.keys(colMap).length > 0;
  if (!hasMapping) {
    const positional: (keyof BenchRecordInput)[] = [
      "vendorName",
      "candidateName",
      "role",
      "experience",
      "skill",
      "rate",
    ];
    positional.forEach((field, i) => {
      colMap[i] = field;
    });
    unmappedHeaders.length = 0;
  }

  const records: BenchRecordInput[] = [];
  let skippedRows = 0;
  const totalRows = rows.length;

  for (const cells of rows) {
    const rec: BenchRecordInput = {
      vendorName: "",
      candidateName: "",
      role: "",
      experience: "",
      skill: "",
      rate: 0,
    };

    for (const [idxStr, field] of Object.entries(colMap)) {
      const idx = Number(idxStr);
      const val = (cells[idx] ?? "").toString().trim();
      if (field === "rate") {
        rec.rate = Number.parseFloat(val.replace(/[^0-9.]/g, "")) || 0;
      } else {
        rec[field] = val;
      }
    }

    // Only skip if candidate name is empty
    if (!rec.candidateName) {
      skippedRows++;
    } else {
      records.push(rec);
    }
  }

  return { records, skippedRows, unmappedHeaders, totalRows };
}

function parseCSVText(text: string): ParseResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 1) {
    return { records: [], skippedRows: 0, unmappedHeaders: [], totalRows: 0 };
  }

  const firstRow = parseCSVLine(lines[0]);
  // Detect if first row is a header by checking if any cell matches HEADER_MAP
  const firstRowLower = firstRow.map((h) =>
    h.toLowerCase().replace(/\s+/g, " ").trim(),
  );
  const hasHeader = firstRowLower.some((k) => HEADER_MAP[k] !== undefined);

  let headers: string[];
  let dataLines: string[];

  if (hasHeader) {
    headers = firstRow;
    dataLines = lines.slice(1);
  } else {
    // No header row — use positional
    headers = [];
    dataLines = lines;
  }

  const rows = dataLines.map(parseCSVLine);
  return mapRowsToRecords(headers, rows);
}

/** Parse rows from SheetJS sheet (array of arrays) */
function parseSheetRows(sheetRows: string[][]): ParseResult {
  if (sheetRows.length === 0) {
    return { records: [], skippedRows: 0, unmappedHeaders: [], totalRows: 0 };
  }

  const firstRow = sheetRows[0].map((c) => String(c ?? "").trim());
  const firstRowLower = firstRow.map((h) =>
    h.toLowerCase().replace(/\s+/g, " ").trim(),
  );
  const hasHeader = firstRowLower.some((k) => HEADER_MAP[k] !== undefined);

  let headers: string[];
  let rows: string[][];

  if (hasHeader) {
    headers = firstRow;
    rows = sheetRows.slice(1).map((r) => r.map((c) => String(c ?? "")));
  } else {
    headers = [];
    rows = sheetRows.map((r) => r.map((c) => String(c ?? "")));
  }

  return mapRowsToRecords(headers, rows);
}

/** Extract plain text lines from DOCX XML (w:t elements) */
function extractDocxText(arrayBuffer: ArrayBuffer): string {
  // DOCX is a ZIP — try to find word/document.xml using a simple string scan
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder("utf-8");
    // Convert to string and extract content between <w:t> tags
    const raw = decoder.decode(bytes);
    const texts: string[] = [];
    const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match: RegExpExecArray | null;
    match = regex.exec(raw);
    while (match !== null) {
      const t = match[1].trim();
      if (t) texts.push(t);
      match = regex.exec(raw);
    }
    return texts.join(",");
  } catch {
    return "";
  }
}

// ── Sort helpers ──────────────────────────────────────────────────────────────

type SortKey = keyof BenchRecord;
type SortDir = "asc" | "desc" | null;

function SortIcon({ dir }: { dir: SortDir }) {
  if (dir === "asc") return <ChevronUp className="h-3 w-3 ml-1 inline" />;
  if (dir === "desc") return <ChevronDown className="h-3 w-3 ml-1 inline" />;
  return <ChevronsUpDown className="h-3 w-3 ml-1 inline opacity-30" />;
}

const TABLE_COLS = [
  { key: "vendorName" as SortKey, label: "Vendor / Company", align: "left" },
  { key: "candidateName" as SortKey, label: "Candidate Name", align: "left" },
  { key: "role" as SortKey, label: "Role", align: "left" },
  { key: "experience" as SortKey, label: "Experience", align: "left" },
  { key: "skill" as SortKey, label: "Skill", align: "left" },
  { key: "rate" as SortKey, label: "Rate", align: "right" },
];

const SKELETON_ROWS = Array.from({ length: 6 }, (_, i) => i);
const SKELETON_CELLS = Array.from({ length: 7 }, (_, j) => j);

// ── Manual Entry Modal ────────────────────────────────────────────────────────

interface ManualEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMPTY_MANUAL: BenchRecordInput = {
  vendorName: "",
  candidateName: "",
  role: "",
  experience: "",
  skill: "",
  rate: 0,
};

function ManualEntryModal({ open, onOpenChange }: ManualEntryModalProps) {
  const [form, setForm] = useState<BenchRecordInput>({ ...EMPTY_MANUAL });
  const uploadBench = useUploadBench();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleRateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({
      ...prev,
      rate: Number.parseFloat(e.target.value) || 0,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.candidateName.trim()) {
      toast.error("Candidate Name is required.");
      return;
    }
    uploadBench.mutate([form], {
      onSuccess: () => {
        toast.success("Bench record added successfully");
        setForm({ ...EMPTY_MANUAL });
        onOpenChange(false);
      },
      onError: (err) => {
        toast.error(`Failed to save: ${(err as Error).message}`);
      },
    });
  }

  function handleCancel() {
    setForm({ ...EMPTY_MANUAL });
    onOpenChange(false);
  }

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <RadixDialog.Content className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <RadixDialog.Title className="text-base font-semibold text-foreground font-display">
                Add Bench Candidate
              </RadixDialog.Title>
              <RadixDialog.Description className="text-xs text-muted-foreground mt-0.5">
                Manually add a single candidate to your bench list.
              </RadixDialog.Description>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-3.5"
            data-ocid="manual-bench-form"
          >
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Candidate Name <span className="text-destructive">*</span>
              </Label>
              <Input
                name="candidateName"
                value={form.candidateName}
                onChange={handleChange}
                placeholder="e.g. John Smith"
                className="h-8 text-sm"
                required
                data-ocid="manual-candidate-name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Vendor / Company Name
              </Label>
              <Input
                name="vendorName"
                value={form.vendorName}
                onChange={handleChange}
                placeholder="e.g. TechVentures LLC"
                className="h-8 text-sm"
                data-ocid="manual-vendor-name"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Role</Label>
                <Input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g. React Developer"
                  className="h-8 text-sm"
                  data-ocid="manual-role"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Experience
                </Label>
                <Input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 5 years"
                  className="h-8 text-sm"
                  data-ocid="manual-experience"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Skills</Label>
              <Input
                name="skill"
                value={form.skill}
                onChange={handleChange}
                placeholder="e.g. React, TypeScript, Node.js"
                className="h-8 text-sm"
                data-ocid="manual-skill"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Rate ($/hr)
              </Label>
              <Input
                name="rate"
                type="number"
                min={0}
                step={0.01}
                value={form.rate || ""}
                onChange={handleRateChange}
                placeholder="e.g. 85"
                className="h-8 text-sm"
                data-ocid="manual-rate"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                data-ocid="manual-cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={uploadBench.isPending}
                data-ocid="manual-save-btn"
              >
                {uploadBench.isPending ? "Saving…" : "Save Candidate"}
              </Button>
            </div>
          </form>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

// ── Format Guide ──────────────────────────────────────────────────────────────

function FormatGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        data-ocid="format-guide-toggle"
      >
        <span className="flex items-center gap-2">
          <Info className="h-3.5 w-3.5" />
          Format Guide — what columns are supported?
        </span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/40">
          <p className="text-xs text-muted-foreground pt-3">
            Upload any CSV, Excel, Word, or PDF file containing your bench
            candidates. The system will auto-detect columns.
          </p>
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {[
                    "Vendor/Company Name",
                    "Candidate Name *",
                    "Role",
                    "Experience",
                    "Skill",
                    "Rate",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="text-foreground/70">
                  <td className="px-3 py-2">TechVentures LLC</td>
                  <td className="px-3 py-2 font-medium">John Smith</td>
                  <td className="px-3 py-2">React Developer</td>
                  <td className="px-3 py-2">5 years</td>
                  <td className="px-3 py-2">React, TypeScript</td>
                  <td className="px-3 py-2">85</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <span className="text-destructive font-bold mt-0.5">*</span>
            <span>
              Only <strong className="text-foreground">Candidate Name</strong>{" "}
              is required. All other fields are optional and will default to
              blank/0 if missing.
            </span>
          </div>
          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">
              Supported column name variations:
            </p>
            <p>
              Vendor:{" "}
              <span className="font-mono text-[11px] bg-muted px-1 rounded">
                Vendor, Company, Organization, Vendor or Company Name
              </span>
            </p>
            <p>
              Candidate:{" "}
              <span className="font-mono text-[11px] bg-muted px-1 rounded">
                Candidate, Name, Full Name, Resource, Consultant
              </span>
            </p>
            <p>
              Role:{" "}
              <span className="font-mono text-[11px] bg-muted px-1 rounded">
                Role, Job Title, Position, Title, Designation
              </span>
            </p>
            <p>
              Rate:{" "}
              <span className="font-mono text-[11px] bg-muted px-1 rounded">
                Rate, Pay Rate, Bill Rate, Hourly Rate, Rate/hr
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BenchPage() {
  const [search, setSearch] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("importedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const [dragOver, setDragOver] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: records = [], isLoading } = useBenchRecords();
  const uploadBench = useUploadBench();
  const deleteBench = useDeleteBenchRecord();

  // ── File handling ─────────────────────────────────────────────────────────

  const handleFile = useCallback(async (file: File) => {
    setParseResult(null);
    setFileError(null);
    setFileProcessing(true);

    const name = file.name.toLowerCase();

    try {
      if (name.endsWith(".csv") || name.endsWith(".txt")) {
        // CSV — use pure TS parser
        const text = await file.text();
        const result = parseCSVText(text);
        setParseResult(result);
      } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        // Excel — dynamic import SheetJS from CDN
        try {
          const XLSX = await dynamicImport(
            "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs",
          );
          const ab = await file.arrayBuffer();
          const read = XLSX.read as (
            data: ArrayBuffer,
            opts: Record<string, unknown>,
          ) => Record<string, unknown>;
          const utils = XLSX.utils as Record<
            string,
            (ws: unknown, opts: Record<string, unknown>) => string[][]
          >;
          const wb = read(ab, { type: "array" }) as Record<string, unknown>;
          const sheetNames = wb.SheetNames as string[];
          const sheets = wb.Sheets as Record<string, unknown>;
          const wsName = sheetNames[0];
          const ws = sheets[wsName];
          const rawRows: string[][] = utils.sheet_to_json(ws, {
            header: 1,
            defval: "",
          });
          const result = parseSheetRows(rawRows);
          setParseResult(result);
        } catch {
          setFileError(
            "Could not parse Excel file. Please save as CSV (File → Save As → CSV) and re-upload.",
          );
        }
      } else if (name.endsWith(".docx")) {
        // DOCX — extract <w:t> text from the ZIP XML
        const ab = await file.arrayBuffer();
        const textContent = extractDocxText(ab);
        if (textContent?.includes(",")) {
          const result = parseCSVText(textContent);
          setParseResult(result);
        } else {
          // Fallback: try reading as plain text (older DOCX or text-only)
          try {
            const text = await file.text();
            const cleaned = text
              .replace(/<[^>]+>/g, " ")
              .replace(/\s+/g, " ")
              .trim();
            if (cleaned.length > 0) {
              const result = parseCSVText(cleaned);
              setParseResult(result);
            } else {
              setFileError(
                "Could not extract data from this Word document. Please copy your table into a CSV file and upload that instead.",
              );
            }
          } catch {
            setFileError(
              "Could not read this Word document. Please save your bench list as a CSV file and upload that instead.",
            );
          }
        }
      } else if (name.endsWith(".pdf")) {
        // PDF — try dynamic import of pdfjs-dist from CDN
        try {
          const pdfjsLib = await dynamicImport(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs",
          );
          const workerOptions = pdfjsLib.GlobalWorkerOptions as Record<
            string,
            unknown
          >;
          workerOptions.workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";

          const ab = await file.arrayBuffer();
          const getDocument = pdfjsLib.getDocument as (
            opts: Record<string, unknown>,
          ) => { promise: Promise<Record<string, unknown>> };
          const loadingTask = getDocument({ data: ab });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages as number;
          const getPage = pdf.getPage as (
            n: number,
          ) => Promise<Record<string, unknown>>;

          const pageTexts: string[] = [];
          for (let i = 1; i <= numPages; i++) {
            const page = await getPage(i);
            const getTextContent = page.getTextContent as () => Promise<{
              items: { str?: string }[];
            }>;
            const content = await getTextContent();
            const pageText = content.items
              .map((item) => item.str ?? "")
              .join(" ");
            pageTexts.push(pageText);
          }

          const combined = pageTexts.join("\n");
          const result = parseCSVText(combined);
          setParseResult(result);
        } catch {
          setFileError(
            "Could not extract data from this PDF. For best results, export your bench list as a CSV or Excel file.",
          );
        }
      } else {
        setFileError(
          `Unsupported file type: .${name.split(".").pop()}. Please upload a CSV, Excel (.xlsx/.xls), Word (.docx), or PDF file.`,
        );
      }
    } catch (err) {
      setFileError(`Failed to read file: ${(err as Error).message}`);
    } finally {
      setFileProcessing(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const openFilePicker = useCallback(() => {
    if (!parseResult && !fileProcessing) fileInputRef.current?.click();
  }, [parseResult, fileProcessing]);

  // ── Import confirm ──────────────────────────────────────────────────────────

  const handleImport = () => {
    if (!parseResult || parseResult.records.length === 0) return;
    uploadBench.mutate(parseResult.records, {
      onSuccess: (count) => {
        toast.success(
          `Successfully imported ${count} bench record${count !== 1 ? "s" : ""}`,
        );
        setParseResult(null);
      },
      onError: (err) => {
        toast.error(`Import failed: ${(err as Error).message}`);
      },
    });
  };

  // ── Filtering & sorting ─────────────────────────────────────────────────────

  const uniqueVendors = useMemo(
    () => [...new Set(records.map((r) => r.vendorName).filter(Boolean))].sort(),
    [records],
  );
  const uniqueRoles = useMemo(
    () => [...new Set(records.map((r) => r.role).filter(Boolean))].sort(),
    [records],
  );

  const filtered = useMemo(() => {
    let data = records;
    if (vendorFilter !== "all")
      data = data.filter((r) => r.vendorName === vendorFilter);
    if (roleFilter !== "all") data = data.filter((r) => r.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) =>
          r.vendorName.toLowerCase().includes(q) ||
          r.candidateName.toLowerCase().includes(q) ||
          r.role.toLowerCase().includes(q) ||
          r.skill.toLowerCase().includes(q),
      );
    }
    return data;
  }, [records, vendorFilter, roleFilter, search]);

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else if (sortDir === "desc") {
      setSortDir(null);
    } else {
      setSortDir("asc");
    }
  };

  const thClass =
    "cursor-pointer select-none hover:text-foreground text-muted-foreground transition-colors";

  return (
    <div className="flex flex-col gap-5 p-6 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center">
            <Archive className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-foreground leading-none">
              Bench List
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {records.length} candidate{records.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowManualEntry(true)}
            data-ocid="bench-manual-add-btn"
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
            Add Manually
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            data-ocid="bench-upload-btn"
          >
            <Upload className="h-3.5 w-3.5 mr-1.5" />
            Upload File
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls,.docx,.pdf"
          className="hidden"
          onChange={onFileInput}
        />
      </div>

      {/* Drop Zone */}
      <button
        type="button"
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={openFilePicker}
        aria-label="Upload bench file"
        data-ocid="bench-drop-zone"
        className={[
          "relative rounded-xl border-2 border-dashed transition-colors duration-200 text-left w-full",
          dragOver
            ? "border-primary bg-primary/10"
            : parseResult
              ? "border-border bg-card cursor-default"
              : fileError
                ? "border-destructive/40 bg-destructive/5 cursor-pointer"
                : fileProcessing
                  ? "border-border/50 bg-card/50 cursor-wait"
                  : "border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
          parseResult ? "p-5" : "p-8",
        ].join(" ")}
      >
        {/* Idle state */}
        {!parseResult && !fileError && !fileProcessing && (
          <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
            <div className="flex items-center gap-2 text-muted-foreground/50">
              <Upload className="h-7 w-7" />
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-foreground">
              Drag &amp; drop your file here
            </p>
            <p className="text-xs text-muted-foreground">
              Supports CSV, Excel (.xlsx/.xls), Word (.docx), and PDF
            </p>
            <p className="text-xs text-muted-foreground">
              or <span className="text-primary underline">click to browse</span>
            </p>
          </div>
        )}

        {/* Processing */}
        {fileProcessing && (
          <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">Parsing file…</p>
          </div>
        )}

        {/* File error */}
        {fileError && !fileProcessing && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  Could not parse this file
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {fileError}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="self-start text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setFileError(null);
              }}
            >
              <X className="h-3 w-3 mr-1" /> Dismiss
            </Button>
          </div>
        )}

        {/* Parse result preview */}
        {parseResult && (
          <div
            className="flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Unmapped headers warning */}
            {parseResult.unmappedHeaders.length > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Unrecognized columns (will be ignored):
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {parseResult.unmappedHeaders.join(", ")}
                  </p>
                </div>
              </div>
            )}

            {/* Skipped rows info */}
            {parseResult.skippedRows > 0 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border">
                <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {parseResult.skippedRows} row
                  {parseResult.skippedRows !== 1 ? "s" : ""} skipped (no
                  Candidate Name).
                </p>
              </div>
            )}

            {/* Preview table */}
            {parseResult.records.length > 0 ? (
              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Preview — first {Math.min(5, parseResult.records.length)} of{" "}
                  {parseResult.records.length} valid row
                  {parseResult.records.length !== 1 ? "s" : ""}:
                </p>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-muted/60 border-b border-border">
                        {[
                          "Vendor/Company",
                          "Candidate",
                          "Role",
                          "Experience",
                          "Skill",
                          "Rate",
                        ].map((h) => (
                          <th
                            key={h}
                            className="px-3 py-2 text-left font-semibold text-muted-foreground"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {parseResult.records.slice(0, 5).map((rec, idx) => (
                        <tr
                          key={`${rec.vendorName}-${rec.candidateName}-${idx}`}
                          className="border-b border-border/50 last:border-0"
                        >
                          <td className="px-3 py-2 text-muted-foreground max-w-[120px] truncate">
                            {rec.vendorName || (
                              <span className="opacity-40">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-foreground font-medium max-w-[120px] truncate">
                            {rec.candidateName}
                          </td>
                          <td className="px-3 py-2 text-foreground">
                            {rec.role || (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">
                            {rec.experience || (
                              <span className="opacity-40">—</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground max-w-[120px] truncate">
                            {rec.skill || <span className="opacity-40">—</span>}
                          </td>
                          <td className="px-3 py-2 text-foreground font-mono">
                            {rec.rate > 0 ? (
                              `$${rec.rate}/hr`
                            ) : (
                              <span className="text-muted-foreground/40">
                                —
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="text-xs text-destructive font-medium">
                No valid records found. Make sure each row has at least a
                Candidate Name.
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {parseResult.records.length > 0 && (
                <Button
                  size="sm"
                  onClick={handleImport}
                  disabled={uploadBench.isPending}
                  data-ocid="bench-import-confirm-btn"
                >
                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                  {uploadBench.isPending
                    ? "Importing…"
                    : `Import ${parseResult.records.length} record${parseResult.records.length !== 1 ? "s" : ""}`}
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setParseResult(null)}
                data-ocid="bench-cancel-import-btn"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </button>

      {/* Format Guide */}
      <FormatGuide />

      {/* Search & Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          placeholder="Search vendor, candidate, role, skill…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm h-8 text-sm"
          data-ocid="bench-search"
        />
        <Select value={vendorFilter} onValueChange={setVendorFilter}>
          <SelectTrigger
            className="h-8 w-44 text-sm"
            data-ocid="bench-vendor-filter"
          >
            <SelectValue placeholder="All Vendors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Vendors</SelectItem>
            {uniqueVendors.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger
            className="h-8 w-44 text-sm"
            data-ocid="bench-role-filter"
          >
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(search || vendorFilter !== "all" || roleFilter !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => {
              setSearch("");
              setVendorFilter("all");
              setRoleFilter("all");
            }}
          >
            <X className="h-3 w-3 mr-1" /> Clear filters
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {sorted.length} result{sorted.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              {TABLE_COLS.map((col) => (
                <TableHead
                  key={col.key}
                  className={`${thClass}${col.align === "right" ? " text-right" : ""}`}
                  onClick={() => toggleSort(col.key)}
                >
                  {col.label}
                  <SortIcon dir={sortKey === col.key ? sortDir : null} />
                </TableHead>
              ))}
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              SKELETON_ROWS.map((i) => (
                <TableRow key={i}>
                  {SKELETON_CELLS.map((j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sorted.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div
                    className="flex flex-col items-center gap-3"
                    data-ocid="bench-empty-state"
                  >
                    <Archive className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {records.length === 0
                        ? "No bench records yet"
                        : "No results match your filters"}
                    </p>
                    {records.length === 0 && (
                      <p className="text-xs text-muted-foreground max-w-xs">
                        Upload a file or add candidates manually to build your
                        bench list.
                      </p>
                    )}
                    {records.length === 0 && (
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowManualEntry(true)}
                          data-ocid="bench-empty-manual-btn"
                        >
                          <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                          Add Manually
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          data-ocid="bench-empty-upload-btn"
                        >
                          <Upload className="h-3.5 w-3.5 mr-1.5" />
                          Upload File
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              sorted.map((rec) => (
                <TableRow
                  key={rec.id}
                  className="group hover:bg-muted/20"
                  data-ocid={`bench-row-${rec.id}`}
                >
                  <TableCell className="font-medium text-foreground max-w-[160px]">
                    <span className="truncate block">
                      {rec.vendorName || (
                        <span className="text-muted-foreground/40">—</span>
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-foreground max-w-[160px]">
                    <span className="truncate block">{rec.candidateName}</span>
                  </TableCell>
                  <TableCell>
                    {rec.role ? (
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {rec.role}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground/40 text-xs">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {rec.experience || (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm max-w-[180px]">
                    <span className="truncate block text-muted-foreground">
                      {rec.skill || <span className="opacity-40">—</span>}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold text-foreground">
                    {rec.rate > 0 ? (
                      `$${rec.rate}/hr`
                    ) : (
                      <span className="text-muted-foreground/40 font-normal">
                        —
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                      onClick={() =>
                        deleteBench.mutate(rec.id, {
                          onSuccess: () => toast.success("Record deleted"),
                          onError: () => toast.error("Failed to delete record"),
                        })
                      }
                      aria-label="Delete bench record"
                      data-ocid={`bench-delete-${rec.id}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        open={showManualEntry}
        onOpenChange={setShowManualEntry}
      />
    </div>
  );
}
