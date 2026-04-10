import { c as createLucideIcon, r as reactExports, a1 as useBenchRecords, a3 as useUploadBench, a4 as useDeleteBenchRecord, j as jsxRuntimeExports, t as getSupabaseCreds, L as Link, a5 as Archive, g as Button, X, e as Badge, v as ue, C as ChevronRight } from "./index-FQ24AoYk.js";
import { I as Input } from "./input-S6aDFC4y.js";
import { L as Label } from "./label-BZ8WgIdB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as ChevronUp } from "./select-aV_wJHww.js";
import { S as Skeleton } from "./skeleton-DAIgTDa6.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-jteK0lm6.js";
import { R as Root, P as Portal, O as Overlay, C as Content, T as Title, D as Description } from "./index-XS6LeCno.js";
import { C as CircleAlert } from "./circle-alert-CEe_PZu-.js";
import { F as FileText } from "./file-text-CJu4vGGY.js";
import { T as TriangleAlert } from "./triangle-alert-C841foCQ.js";
import { I as Info } from "./info-DgiC69Wy.js";
import { T as Trash2 } from "./trash-2-uvnuDEeR.js";
import { C as ChevronDown } from "./chevron-down-D47IeKi1.js";
import "./index-BIX9gIuu.js";
import "./index-2NCsxXlq.js";
import "./check-DrKYa13V.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "m7 15 5 5 5-5", key: "1hf1tw" }],
  ["path", { d: "m7 9 5-5 5 5", key: "sgt6xg" }]
];
const ChevronsUpDown = createLucideIcon("chevrons-up-down", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
];
const CirclePlus = createLucideIcon("circle-plus", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
const dynamicImport = new Function("url", "return import(url)");
function parseCSVLine(line) {
  const fields = [];
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
const HEADER_MAP = {
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
  compensation: "rate"
};
function mapRowsToRecords(headers, rows) {
  const colMap = {};
  const unmappedHeaders = [];
  headers.forEach((h, i) => {
    const key = h.toLowerCase().replace(/\s+/g, " ").trim();
    if (HEADER_MAP[key]) {
      colMap[i] = HEADER_MAP[key];
    } else {
      unmappedHeaders.push(h);
    }
  });
  const hasMapping = Object.keys(colMap).length > 0;
  if (!hasMapping) {
    const positional = [
      "vendorName",
      "candidateName",
      "role",
      "experience",
      "skill",
      "rate"
    ];
    positional.forEach((field, i) => {
      colMap[i] = field;
    });
    unmappedHeaders.length = 0;
  }
  const records = [];
  let skippedRows = 0;
  const totalRows = rows.length;
  for (const cells of rows) {
    const rec = {
      vendorName: "",
      candidateName: "",
      role: "",
      experience: "",
      skill: "",
      rate: 0
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
    if (!rec.candidateName) {
      skippedRows++;
    } else {
      records.push(rec);
    }
  }
  return { records, skippedRows, unmappedHeaders, totalRows };
}
function parseCSVText(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length < 1) {
    return { records: [], skippedRows: 0, unmappedHeaders: [], totalRows: 0 };
  }
  const firstRow = parseCSVLine(lines[0]);
  const firstRowLower = firstRow.map(
    (h) => h.toLowerCase().replace(/\s+/g, " ").trim()
  );
  const hasHeader = firstRowLower.some((k) => HEADER_MAP[k] !== void 0);
  let headers;
  let dataLines;
  if (hasHeader) {
    headers = firstRow;
    dataLines = lines.slice(1);
  } else {
    headers = [];
    dataLines = lines;
  }
  const rows = dataLines.map(parseCSVLine);
  return mapRowsToRecords(headers, rows);
}
function parseSheetRows(sheetRows) {
  if (sheetRows.length === 0) {
    return { records: [], skippedRows: 0, unmappedHeaders: [], totalRows: 0 };
  }
  const firstRow = sheetRows[0].map((c) => String(c ?? "").trim());
  const firstRowLower = firstRow.map(
    (h) => h.toLowerCase().replace(/\s+/g, " ").trim()
  );
  const hasHeader = firstRowLower.some((k) => HEADER_MAP[k] !== void 0);
  let headers;
  let rows;
  if (hasHeader) {
    headers = firstRow;
    rows = sheetRows.slice(1).map((r) => r.map((c) => String(c ?? "")));
  } else {
    headers = [];
    rows = sheetRows.map((r) => r.map((c) => String(c ?? "")));
  }
  return mapRowsToRecords(headers, rows);
}
function extractDocxText(arrayBuffer) {
  try {
    const bytes = new Uint8Array(arrayBuffer);
    const decoder = new TextDecoder("utf-8");
    const raw = decoder.decode(bytes);
    const texts = [];
    const regex = /<w:t[^>]*>([^<]*)<\/w:t>/g;
    let match;
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
function SortIcon({ dir }) {
  if (dir === "asc") return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 ml-1 inline" });
  if (dir === "desc") return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 ml-1 inline" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "h-3 w-3 ml-1 inline opacity-30" });
}
const TABLE_COLS = [
  { key: "vendorName", label: "Vendor / Company", align: "left" },
  { key: "candidateName", label: "Candidate Name", align: "left" },
  { key: "role", label: "Role", align: "left" },
  { key: "experience", label: "Experience", align: "left" },
  { key: "skill", label: "Skill", align: "left" },
  { key: "rate", label: "Rate", align: "right" }
];
const SKELETON_ROWS = Array.from({ length: 6 }, (_, i) => i);
const SKELETON_CELLS = Array.from({ length: 7 }, (_, j) => j);
const EMPTY_MANUAL = {
  vendorName: "",
  candidateName: "",
  role: "",
  experience: "",
  skill: "",
  rate: 0
};
function ManualEntryModal({ open, onOpenChange }) {
  const [form, setForm] = reactExports.useState({ ...EMPTY_MANUAL });
  const uploadBench = useUploadBench();
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleRateChange(e) {
    setForm((prev) => ({
      ...prev,
      rate: Number.parseFloat(e.target.value) || 0
    }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.candidateName.trim()) {
      ue.error("Candidate Name is required.");
      return;
    }
    uploadBench.mutate([form], {
      onSuccess: () => {
        ue.success("Bench record added successfully");
        setForm({ ...EMPTY_MANUAL });
        onOpenChange(false);
      },
      onError: (err) => {
        ue.error(`Failed to save: ${err.message}`);
      }
    });
  }
  function handleCancel() {
    setForm({ ...EMPTY_MANUAL });
    onOpenChange(false);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { className: "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-base font-semibold text-foreground font-display", children: "Add Bench Candidate" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { className: "text-xs text-muted-foreground mt-0.5", children: "Manually add a single candidate to your bench list." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleCancel,
            className: "rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "aria-label": "Close",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          className: "space-y-3.5",
          "data-ocid": "manual-bench-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                "Candidate Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "candidateName",
                  value: form.candidateName,
                  onChange: handleChange,
                  placeholder: "e.g. John Smith",
                  className: "h-8 text-sm",
                  required: true,
                  "data-ocid": "manual-candidate-name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Vendor / Company Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "vendorName",
                  value: form.vendorName,
                  onChange: handleChange,
                  placeholder: "e.g. TechVentures LLC",
                  className: "h-8 text-sm",
                  "data-ocid": "manual-vendor-name"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Role" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    name: "role",
                    value: form.role,
                    onChange: handleChange,
                    placeholder: "e.g. React Developer",
                    className: "h-8 text-sm",
                    "data-ocid": "manual-role"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Experience" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    name: "experience",
                    value: form.experience,
                    onChange: handleChange,
                    placeholder: "e.g. 5 years",
                    className: "h-8 text-sm",
                    "data-ocid": "manual-experience"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Skills" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "skill",
                  value: form.skill,
                  onChange: handleChange,
                  placeholder: "e.g. React, TypeScript, Node.js",
                  className: "h-8 text-sm",
                  "data-ocid": "manual-skill"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Rate ($/hr)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  name: "rate",
                  type: "number",
                  min: 0,
                  step: 0.01,
                  value: form.rate || "",
                  onChange: handleRateChange,
                  placeholder: "e.g. 85",
                  className: "h-8 text-sm",
                  "data-ocid": "manual-rate"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: handleCancel,
                  "data-ocid": "manual-cancel-btn",
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  disabled: uploadBench.isPending,
                  "data-ocid": "manual-save-btn",
                  children: uploadBench.isPending ? "Saving…" : "Save Candidate"
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] }) });
}
function FormatGuide() {
  const [expanded, setExpanded] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border/60 bg-muted/20 overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setExpanded((p) => !p),
        className: "w-full flex items-center justify-between px-4 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
        "data-ocid": "format-guide-toggle",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }),
            "Format Guide — what columns are supported?"
          ] }),
          expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
        ]
      }
    ),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 space-y-3 border-t border-border/40", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground pt-3", children: "Upload any CSV, Excel, Word, or PDF file containing your bench candidates. The system will auto-detect columns." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-md border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/50 border-b border-border", children: [
          "Vendor/Company Name",
          "Candidate Name *",
          "Role",
          "Experience",
          "Skill",
          "Rate"
        ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "th",
          {
            className: "px-3 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap",
            children: h
          },
          h
        )) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-foreground/70", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: "TechVentures LLC" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-medium", children: "John Smith" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: "React Developer" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: "5 years" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: "React, TypeScript" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: "85" })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive font-bold mt-0.5", children: "*" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Only ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-foreground", children: "Candidate Name" }),
          " ",
          "is required. All other fields are optional and will default to blank/0 if missing."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground", children: "Supported column name variations:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Vendor:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] bg-muted px-1 rounded", children: "Vendor, Company, Organization, Vendor or Company Name" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Candidate:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] bg-muted px-1 rounded", children: "Candidate, Name, Full Name, Resource, Consultant" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Role:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] bg-muted px-1 rounded", children: "Role, Job Title, Position, Title, Designation" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Rate:",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] bg-muted px-1 rounded", children: "Rate, Pay Rate, Bill Rate, Hourly Rate, Rate/hr" })
        ] })
      ] })
    ] })
  ] });
}
function BenchPage() {
  const [search, setSearch] = reactExports.useState("");
  const [vendorFilter, setVendorFilter] = reactExports.useState("all");
  const [roleFilter, setRoleFilter] = reactExports.useState("all");
  const [sortKey, setSortKey] = reactExports.useState("importedAt");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [dragOver, setDragOver] = reactExports.useState(false);
  const [parseResult, setParseResult] = reactExports.useState(null);
  const [fileProcessing, setFileProcessing] = reactExports.useState(false);
  const [fileError, setFileError] = reactExports.useState(null);
  const [showManualEntry, setShowManualEntry] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const { data: records = [], isLoading } = useBenchRecords();
  const uploadBench = useUploadBench();
  const deleteBench = useDeleteBenchRecord();
  const handleFile = reactExports.useCallback(async (file) => {
    setParseResult(null);
    setFileError(null);
    setFileProcessing(true);
    const name = file.name.toLowerCase();
    try {
      if (name.endsWith(".csv") || name.endsWith(".txt")) {
        const text = await file.text();
        const result = parseCSVText(text);
        setParseResult(result);
      } else if (name.endsWith(".xlsx") || name.endsWith(".xls")) {
        try {
          const XLSX = await dynamicImport(
            "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs"
          );
          const ab = await file.arrayBuffer();
          const read = XLSX.read;
          const utils = XLSX.utils;
          const wb = read(ab, { type: "array" });
          const sheetNames = wb.SheetNames;
          const sheets = wb.Sheets;
          const wsName = sheetNames[0];
          const ws = sheets[wsName];
          const rawRows = utils.sheet_to_json(ws, {
            header: 1,
            defval: ""
          });
          const result = parseSheetRows(rawRows);
          setParseResult(result);
        } catch {
          setFileError(
            "Could not parse Excel file. Please save as CSV (File → Save As → CSV) and re-upload."
          );
        }
      } else if (name.endsWith(".docx")) {
        const ab = await file.arrayBuffer();
        const textContent = extractDocxText(ab);
        if (textContent == null ? void 0 : textContent.includes(",")) {
          const result = parseCSVText(textContent);
          setParseResult(result);
        } else {
          try {
            const text = await file.text();
            const cleaned = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
            if (cleaned.length > 0) {
              const result = parseCSVText(cleaned);
              setParseResult(result);
            } else {
              setFileError(
                "Could not extract data from this Word document. Please copy your table into a CSV file and upload that instead."
              );
            }
          } catch {
            setFileError(
              "Could not read this Word document. Please save your bench list as a CSV file and upload that instead."
            );
          }
        }
      } else if (name.endsWith(".pdf")) {
        try {
          const pdfjsLib = await dynamicImport(
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.min.mjs"
          );
          const workerOptions = pdfjsLib.GlobalWorkerOptions;
          workerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.min.mjs";
          const ab = await file.arrayBuffer();
          const getDocument = pdfjsLib.getDocument;
          const loadingTask = getDocument({ data: ab });
          const pdf = await loadingTask.promise;
          const numPages = pdf.numPages;
          const getPage = pdf.getPage;
          const pageTexts = [];
          for (let i = 1; i <= numPages; i++) {
            const page = await getPage(i);
            const getTextContent = page.getTextContent;
            const content = await getTextContent();
            const pageText = content.items.map((item) => item.str ?? "").join(" ");
            pageTexts.push(pageText);
          }
          const combined = pageTexts.join("\n");
          const result = parseCSVText(combined);
          setParseResult(result);
        } catch {
          setFileError(
            "Could not extract data from this PDF. For best results, export your bench list as a CSV or Excel file."
          );
        }
      } else {
        setFileError(
          `Unsupported file type: .${name.split(".").pop()}. Please upload a CSV, Excel (.xlsx/.xls), Word (.docx), or PDF file.`
        );
      }
    } catch (err) {
      setFileError(`Failed to read file: ${err.message}`);
    } finally {
      setFileProcessing(false);
    }
  }, []);
  const onDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );
  const onFileInput = (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (file) handleFile(file);
    e.target.value = "";
  };
  const openFilePicker = reactExports.useCallback(() => {
    var _a;
    if (!parseResult && !fileProcessing) (_a = fileInputRef.current) == null ? void 0 : _a.click();
  }, [parseResult, fileProcessing]);
  const handleImport = () => {
    if (!parseResult || parseResult.records.length === 0) return;
    uploadBench.mutate(parseResult.records, {
      onSuccess: (count) => {
        ue.success(
          `Successfully imported ${count} bench record${count !== 1 ? "s" : ""}`
        );
        setParseResult(null);
      },
      onError: (err) => {
        ue.error(`Import failed: ${err.message}`);
      }
    });
  };
  const uniqueVendors = reactExports.useMemo(
    () => [...new Set(records.map((r) => r.vendorName).filter(Boolean))].sort(),
    [records]
  );
  const uniqueRoles = reactExports.useMemo(
    () => [...new Set(records.map((r) => r.role).filter(Boolean))].sort(),
    [records]
  );
  const filtered = reactExports.useMemo(() => {
    let data = records;
    if (vendorFilter !== "all")
      data = data.filter((r) => r.vendorName === vendorFilter);
    if (roleFilter !== "all") data = data.filter((r) => r.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (r) => r.vendorName.toLowerCase().includes(q) || r.candidateName.toLowerCase().includes(q) || r.role.toLowerCase().includes(q) || r.skill.toLowerCase().includes(q)
      );
    }
    return data;
  }, [records, vendorFilter, roleFilter, search]);
  const sorted = reactExports.useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av ?? "").localeCompare(String(bv ?? ""));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortKey, sortDir]);
  const toggleSort = (key) => {
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
  const thClass = "cursor-pointer select-none hover:text-foreground text-muted-foreground transition-colors";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-6 max-w-full", children: [
    !getSupabaseCreds() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30",
        "data-ocid": "bench-no-supabase-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-300/90 flex-1", children: [
            "Supabase not connected — go to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                to: "/settings",
                className: "underline underline-offset-2 font-medium",
                children: "Settings → Integrations"
              }
            ),
            " ",
            "to add your credentials before uploading bench data."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground leading-none", children: "Bench List" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
            records.length,
            " candidate",
            records.length !== 1 ? "s" : ""
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => setShowManualEntry(true),
            "data-ocid": "bench-manual-add-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Add Manually"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            "data-ocid": "bench-upload-btn",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
              "Upload File"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: ".csv,.xlsx,.xls,.docx,.pdf",
          className: "hidden",
          onChange: onFileInput
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onDragOver: (e) => {
          e.preventDefault();
          setDragOver(true);
        },
        onDragLeave: () => setDragOver(false),
        onDrop,
        onClick: openFilePicker,
        "aria-label": "Upload bench file",
        "data-ocid": "bench-drop-zone",
        className: [
          "relative rounded-xl border-2 border-dashed transition-colors duration-200 text-left w-full",
          dragOver ? "border-primary bg-primary/10" : parseResult ? "border-border bg-card cursor-default" : fileError ? "border-destructive/40 bg-destructive/5 cursor-pointer" : fileProcessing ? "border-border/50 bg-card/50 cursor-wait" : "border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 cursor-pointer",
          parseResult ? "p-5" : "p-8"
        ].join(" "),
        children: [
          !parseResult && !fileError && !fileProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-muted-foreground/50", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-7 w-7" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: "Drag & drop your file here" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Supports CSV, Excel (.xlsx/.xls), Word (.docx), and PDF" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "or ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary underline", children: "click to browse" })
            ] })
          ] }),
          fileProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-2 text-center pointer-events-none", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Parsing file…" })
          ] }),
          fileError && !fileProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-destructive flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "Could not parse this file" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: fileError })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "self-start text-xs",
                onClick: (e) => {
                  e.stopPropagation();
                  setFileError(null);
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 mr-1" }),
                  " Dismiss"
                ]
              }
            )
          ] }),
          parseResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col gap-4",
              onClick: (e) => e.stopPropagation(),
              onKeyDown: (e) => e.stopPropagation(),
              children: [
                parseResult.unmappedHeaders.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "Unrecognized columns (will be ignored):" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: parseResult.unmappedHeaders.join(", ") })
                  ] })
                ] }),
                parseResult.skippedRows > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 rounded-lg bg-muted/40 border border-border", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    parseResult.skippedRows,
                    " row",
                    parseResult.skippedRows !== 1 ? "s" : "",
                    " skipped (no Candidate Name)."
                  ] })
                ] }),
                parseResult.records.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-2", children: [
                    "Preview — first ",
                    Math.min(5, parseResult.records.length),
                    " of",
                    " ",
                    parseResult.records.length,
                    " valid row",
                    parseResult.records.length !== 1 ? "s" : "",
                    ":"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/60 border-b border-border", children: [
                      "Vendor/Company",
                      "Candidate",
                      "Role",
                      "Experience",
                      "Skill",
                      "Rate"
                    ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "th",
                      {
                        className: "px-3 py-2 text-left font-semibold text-muted-foreground",
                        children: h
                      },
                      h
                    )) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: parseResult.records.slice(0, 5).map((rec, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "tr",
                      {
                        className: "border-b border-border/50 last:border-0",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground max-w-[120px] truncate", children: rec.vendorName || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "—" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground font-medium max-w-[120px] truncate", children: rec.candidateName }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground", children: rec.role || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: rec.experience || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "—" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground max-w-[120px] truncate", children: rec.skill || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "—" }) }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-foreground font-mono", children: rec.rate > 0 ? `$${rec.rate}/hr` : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) })
                        ]
                      },
                      `${rec.vendorName}-${rec.candidateName}-${idx}`
                    )) })
                  ] }) })
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive font-medium", children: "No valid records found. Make sure each row has at least a Candidate Name." }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
                  parseResult.records.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      size: "sm",
                      onClick: handleImport,
                      disabled: uploadBench.isPending,
                      "data-ocid": "bench-import-confirm-btn",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
                        uploadBench.isPending ? "Importing…" : `Import ${parseResult.records.length} record${parseResult.records.length !== 1 ? "s" : ""}`
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => setParseResult(null),
                      "data-ocid": "bench-cancel-import-btn",
                      children: "Cancel"
                    }
                  )
                ] })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormatGuide, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search vendor, candidate, role, skill…",
          value: search,
          onChange: (e) => setSearch(e.target.value),
          className: "max-w-sm h-8 text-sm",
          "data-ocid": "bench-search"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: vendorFilter, onValueChange: setVendorFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "h-8 w-44 text-sm",
            "data-ocid": "bench-vendor-filter",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Vendors" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Vendors" }),
          uniqueVendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: v, children: v }, v))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: roleFilter, onValueChange: setRoleFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SelectTrigger,
          {
            className: "h-8 w-44 text-sm",
            "data-ocid": "bench-role-filter",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Roles" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Roles" }),
          uniqueRoles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: r }, r))
        ] })
      ] }),
      (search || vendorFilter !== "all" || roleFilter !== "all") && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          className: "h-8 text-xs",
          onClick: () => {
            setSearch("");
            setVendorFilter("all");
            setRoleFilter("all");
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3 mr-1" }),
            " Clear filters"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-xs text-muted-foreground", children: [
        sorted.length,
        " result",
        sorted.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: [
        TABLE_COLS.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: `${thClass}${col.align === "right" ? " text-right" : ""}`,
            onClick: () => toggleSort(col.key),
            children: [
              col.label,
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { dir: sortKey === col.key ? sortDir : null })
            ]
          },
          col.key
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-10" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? SKELETON_ROWS.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: SKELETON_CELLS.map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, j)) }, i)) : sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "py-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-3",
          "data-ocid": "bench-empty-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-10 w-10 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: records.length === 0 ? "No bench records yet" : "No results match your filters" }),
            records.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Upload a file or add candidates manually to build your bench list." }),
            records.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => setShowManualEntry(true),
                  "data-ocid": "bench-empty-manual-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "h-3.5 w-3.5 mr-1.5" }),
                    "Add Manually"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  "data-ocid": "bench-empty-upload-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
                    "Upload File"
                  ]
                }
              )
            ] })
          ]
        }
      ) }) }) : sorted.map((rec) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          className: "group hover:bg-muted/20",
          "data-ocid": `bench-row-${rec.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: rec.vendorName || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-foreground max-w-[160px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: rec.candidateName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: rec.role ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "secondary",
                className: "text-xs font-normal",
                children: rec.role
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: rec.experience || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-sm max-w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block text-muted-foreground", children: rec.skill || /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-40", children: "—" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-mono text-sm font-semibold text-foreground", children: rec.rate > 0 ? `$${rec.rate}/hr` : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 font-normal", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
                onClick: () => deleteBench.mutate(rec.id, {
                  onSuccess: () => ue.success("Record deleted"),
                  onError: () => ue.error("Failed to delete record")
                }),
                "aria-label": "Delete bench record",
                "data-ocid": `bench-delete-${rec.id}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            ) })
          ]
        },
        rec.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ManualEntryModal,
      {
        open: showManualEntry,
        onOpenChange: setShowManualEntry
      }
    )
  ] });
}
export {
  BenchPage as default
};
