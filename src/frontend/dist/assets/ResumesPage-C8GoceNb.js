import { r as reactExports, aj as useResumes, j as jsxRuntimeExports, t as getSupabaseCreds, L as Link, ah as FileText, w as ue, X, O as useJobs, m as Briefcase, g as Button, ax as Search, ay as useCreateResume, az as useCheckDuplicateResume, o as useVendors, ag as useCreateSubmission, aA as useDeleteResume, aB as useListSubmissionsForResume, e as Badge } from "./index-BcyE0PSW.js";
import { I as Input } from "./input-DzfYOqkc.js";
import { L as Label } from "./label-DZ9EmIig.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as ChevronUp } from "./select-DROn7602.js";
import { S as Skeleton } from "./skeleton-BGlwOHT4.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-YuXl9Wom.js";
import { T as Textarea } from "./textarea-CIhE1djp.js";
import { C as CircleAlert } from "./circle-alert-BNrhN37r.js";
import { A as ArrowLeft, P as Phone } from "./phone-BIe1qUif.js";
import { U as Upload } from "./upload-CtQpBJaP.js";
import { U as User } from "./user-BZHGJR3p.js";
import { M as MapPin } from "./map-pin-DU_pMBIe.js";
import { C as CircleCheck } from "./circle-check-B7XqIcig.js";
import { S as Send } from "./send-BdE30fCY.js";
import { C as ChevronDown } from "./chevron-down-CBCoMYGr.js";
import { T as Trash2 } from "./trash-2-ER8LJY3d.js";
import "./index-Cm52jBe7.js";
import "./index-CZ3obOQC.js";
import "./index-BYnJqRhy.js";
import "./check-BtfY299Q.js";
function sanitizeText(text) {
  return text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2014/g, "--").replace(/\u2013/g, "-").replace(/[\u2022\u25AA\u25CF]/g, "*").replace(/\u2026/g, "...").replace(/[^\x00-\x7F]/g, "");
}
function extractTextFromDocx(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
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
    const result = texts.length > 0 ? texts.join(" ") : raw.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    return sanitizeText(result);
  } catch {
    return "";
  }
}
function extractTextFromPdf(buffer) {
  try {
    const bytes = new Uint8Array(buffer);
    let raw = "";
    for (let i = 0; i < Math.min(bytes.length, 5e5); i++) {
      const b = bytes[i];
      if (b >= 32 && b < 127) {
        raw += String.fromCharCode(b);
      } else if (b === 10 || b === 13) {
        raw += " ";
      }
    }
    const btEtTexts = [];
    const btEtRegex = /BT\s*([\s\S]*?)\s*ET/g;
    let m = btEtRegex.exec(raw);
    while (m !== null) {
      const block = m[1];
      const strRegex = /\(([^)]*)\)/g;
      let sm = strRegex.exec(block);
      while (sm !== null) {
        const s = sm[1].trim();
        if (s.length > 1) btEtTexts.push(s);
        sm = strRegex.exec(block);
      }
      m = btEtRegex.exec(raw);
    }
    let result = "";
    if (btEtTexts.length > 0) {
      result = btEtTexts.join(" ").replace(/\s+/g, " ").trim();
    } else {
      result = raw.split(/\s+/).filter((w) => w.length > 1 && /[a-zA-Z]/.test(w)).join(" ").substring(0, 8e3);
    }
    return sanitizeText(result);
  } catch {
    return "";
  }
}
const SKILL_ALIASES = {
  // JavaScript
  js: "JavaScript",
  javascript: "JavaScript",
  // TypeScript
  ts: "TypeScript",
  typescript: "TypeScript",
  // React
  react: "React",
  "react.js": "React",
  reactjs: "React",
  // Node.js
  node: "Node.js",
  "node.js": "Node.js",
  nodejs: "Node.js",
  // Vue
  vue: "Vue.js",
  "vue.js": "Vue.js",
  vuejs: "Vue.js",
  // Angular
  angular: "Angular",
  "angular.js": "Angular",
  angularjs: "Angular",
  // Python
  py: "Python",
  python: "Python",
  // Salesforce
  sf: "Salesforce",
  sfdc: "Salesforce",
  salesforce: "Salesforce",
  "salesforce.com": "Salesforce",
  // SQL / Databases
  sql: "SQL",
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  postgres: "PostgreSQL",
  // Cloud
  aws: "AWS",
  "amazon web services": "AWS",
  gcp: "GCP",
  "google cloud": "GCP",
  azure: "Azure",
  "ms azure": "Azure",
  "microsoft azure": "Azure",
  // DevOps
  docker: "Docker",
  kubernetes: "Kubernetes",
  k8s: "Kubernetes",
  // Languages
  "c#": "C#",
  csharp: "C#",
  "c++": "C++",
  cpp: "C++",
  java: "Java",
  go: "Go",
  golang: "Go",
  rust: "Rust",
  php: "PHP",
  ruby: "Ruby",
  swift: "Swift",
  kotlin: "Kotlin",
  // Other common
  nextjs: "Next.js",
  "next.js": "Next.js",
  nestjs: "NestJS",
  graphql: "GraphQL",
  rest: "REST",
  terraform: "Terraform",
  linux: "Linux",
  git: "Git",
  html: "HTML",
  css: "CSS",
  tailwind: "Tailwind CSS",
  figma: "Figma",
  agile: "Agile",
  scrum: "Scrum",
  jira: "Jira",
  tableau: "Tableau",
  powerbi: "Power BI",
  "machine learning": "Machine Learning",
  ml: "Machine Learning",
  "deep learning": "Deep Learning",
  tensorflow: "TensorFlow",
  pytorch: "PyTorch",
  devops: "DevOps",
  flutter: "Flutter",
  selenium: "Selenium",
  cypress: "Cypress",
  kafka: "Kafka",
  redis: "Redis",
  mongodb: "MongoDB",
  elasticsearch: "Elasticsearch",
  spark: "Apache Spark",
  hadoop: "Hadoop",
  microservices: "Microservices",
  "react native": "React Native",
  django: "Django",
  flask: "Flask",
  spring: "Spring",
  express: "Express",
  sap: "SAP",
  servicenow: "ServiceNow"
};
function normalizeSkill(raw) {
  const key = raw.trim().toLowerCase();
  return SKILL_ALIASES[key] ?? raw.trim();
}
const KNOWN_SKILLS = Object.keys(SKILL_ALIASES);
const JOB_TITLE_KEYWORDS = [
  "engineer",
  "developer",
  "architect",
  "manager",
  "lead",
  "director",
  "analyst",
  "consultant",
  "specialist",
  "designer",
  "administrator",
  "coordinator",
  "executive",
  "officer",
  "scientist",
  "recruiter",
  "associate",
  "intern",
  "staff",
  "senior",
  "junior",
  "principal"
];
function parseResumeText(text) {
  const sanitized = sanitizeText(text);
  const lines = sanitized.split(/[\n\r]+/).map((l) => l.trim()).filter((l) => l.length > 0);
  const skills = extractSkillsArray(sanitized);
  return {
    candidateName: extractName(lines),
    email: extractEmail(sanitized),
    phone: extractPhone(sanitized),
    location: extractLocation(lines),
    yearsExperience: extractYearsExperience(sanitized),
    extractedRole: extractRole(sanitized, lines),
    skills,
    extractedSkills: skills.join(", "),
    extractedExperience: extractExperienceString(sanitized)
  };
}
function extractName(lines) {
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (/[@|:|http|www|resume|curriculum|vitae]/i.test(line)) continue;
    if (/^\d/.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5) {
      const allAlpha = words.every((w) => /^[A-Za-z\-'.]+$/.test(w));
      const hasCapital = words.some((w) => /^[A-Z]/.test(w));
      if (allAlpha && hasCapital && line.length < 60) {
        return line;
      }
    }
  }
  return "";
}
function extractEmail(text) {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : void 0;
}
function extractPhone(text) {
  const m = text.match(/(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
  if (!m) return void 0;
  return m[0].trim();
}
function extractLocation(lines) {
  const labelPat = /(?:location|based in|address|city)\s*[:\-]\s*(.+)/i;
  for (const line of lines.slice(0, 25)) {
    const m = line.match(labelPat);
    if (m == null ? void 0 : m[1]) {
      const val = m[1].trim();
      if (val.length > 2 && val.length < 80) return val;
    }
  }
  const cityStatePat = /^([A-Za-z\s]+),\s*([A-Za-z\s]{2,30})$/;
  for (const line of lines.slice(0, 20)) {
    if (cityStatePat.test(line) && line.length < 60 && !/@/.test(line)) {
      return line;
    }
  }
  return void 0;
}
function extractYearsExperience(text) {
  const lower = text.toLowerCase();
  const patterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
    /experience\s*[:\-]?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:total|overall)/i,
    /senior\s*\(?(\d+)\+?\s*(?:years?|yrs?)\)?/i
  ];
  for (const pat of patterns) {
    const m = lower.match(pat);
    if (m == null ? void 0 : m[1]) {
      const n = Number.parseInt(m[1], 10);
      if (n > 0 && n < 50) return n;
    }
  }
  const rangeM = lower.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:years?|yrs?)/i);
  if ((rangeM == null ? void 0 : rangeM[1]) && (rangeM == null ? void 0 : rangeM[2])) {
    const lo = Number.parseInt(rangeM[1], 10);
    const hi = Number.parseInt(rangeM[2], 10);
    return Math.round((lo + hi) / 2);
  }
  return void 0;
}
function extractRole(text, lines) {
  const lowerText = text.toLowerCase();
  const labelPatterns = [
    /(?:title|role|position|designation)\s*[:\-]\s*([^\n\r,]+)/i,
    /(?:objective|summary)\s*[:\-]\s*([^\n\r,]+)/i,
    /^(?:profile|about me)\s*[:\-]\s*([^\n\r,]+)/im
  ];
  for (const pat of labelPatterns) {
    const m = lowerText.match(pat);
    if ((m == null ? void 0 : m[1]) != null) {
      const candidate = m[1].trim().replace(/\s+/g, " ");
      if (candidate.length > 3 && candidate.length < 80) return candidate;
    }
  }
  for (const line of lines.slice(0, 20)) {
    const lower = line.toLowerCase();
    const hasTitle = JOB_TITLE_KEYWORDS.some((kw) => lower.includes(kw));
    if (hasTitle && line.length < 80 && line.length > 5) {
      if (!/^[A-Z\s]+$/.test(line)) return line;
    }
  }
  return "";
}
function extractSkillsArray(text) {
  const lower = text.toLowerCase();
  const found = [];
  const skillsSectionMatch = lower.match(
    /(?:skills?|technologies|tech stack|expertise)[:\s-]+(.+?)(?=\n\n|\n[A-Z]{2,}|\n(?:experience|education|work|project)|$)/is
  );
  if ((skillsSectionMatch == null ? void 0 : skillsSectionMatch[1]) != null) {
    const sectionText = skillsSectionMatch[1].substring(0, 500);
    const items = sectionText.split(/[,\n\r•|·\-\/]+/).map((s) => s.trim()).filter((s) => s.length > 1 && s.length < 40);
    if (items.length >= 3) {
      const normalized = items.slice(0, 25).map(normalizeSkill).filter((s) => s.length > 0);
      return deduplicateSkills(normalized);
    }
  }
  for (const alias of KNOWN_SKILLS) {
    if (lower.includes(alias)) {
      found.push(normalizeSkill(alias));
    }
  }
  return deduplicateSkills(found).slice(0, 20);
}
function deduplicateSkills(skills) {
  const seen = /* @__PURE__ */ new Set();
  const result = [];
  for (const s of skills) {
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(s);
    }
  }
  return result;
}
function extractExperienceString(text) {
  const lower = text.toLowerCase();
  const yearsPatterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
    /experience\s*[:\-]?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:total|overall)/i
  ];
  for (const pat of yearsPatterns) {
    const m = lower.match(pat);
    if (m == null ? void 0 : m[1]) {
      return `${m[1]} years`;
    }
  }
  const yearSpans = [
    ...lower.matchAll(/20(\d{2})\s*[-–—to]+\s*(?:20(\d{2})|present|current)/gi)
  ];
  if (yearSpans.length > 0) {
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    let totalYears = 0;
    for (const span of yearSpans) {
      const start = 2e3 + Number.parseInt(span[1], 10);
      const end = span[2] ? 2e3 + Number.parseInt(span[2], 10) : currentYear;
      totalYears += Math.max(0, end - start);
    }
    if (totalYears > 0) return `${totalYears} years`;
  }
  return "";
}
function scoreJobMatch(resumeSkillsOrArr, resumeRole, resumeExperience, job) {
  const skillsStr = Array.isArray(resumeSkillsOrArr) ? resumeSkillsOrArr.join(", ") : resumeSkillsOrArr;
  const resumeTokens = tokenize(
    `${skillsStr} ${resumeRole} ${resumeExperience}`
  );
  const jobText = [
    job.requiredSkills ?? "",
    job.skills ?? "",
    job.title ?? "",
    job.roleSummary ?? ""
  ].join(" ");
  const jobTokens = tokenize(jobText);
  if (jobTokens.length === 0) {
    return { score: 0, matchedKeywords: [] };
  }
  const matched = jobTokens.filter(
    (jt) => resumeTokens.some((rt) => rt === jt || rt.includes(jt) || jt.includes(rt))
  );
  const unique = [...new Set(matched)];
  const roleLower = resumeRole.toLowerCase();
  const titleLower = (job.title ?? "").toLowerCase();
  const roleBonus = roleLower.split(/\s+/).some((w) => w.length > 3 && titleLower.includes(w)) ? 10 : 0;
  const raw = unique.length / Math.max(jobTokens.length, 1) * 90 + roleBonus;
  const score = Math.min(100, Math.round(raw));
  return { score, matchedKeywords: unique.slice(0, 15) };
}
function tokenize(text) {
  return text.toLowerCase().split(/[,\s\n\r\-\.\/|•·]+/).map((t) => t.replace(/[^a-z0-9#+.]/g, "")).filter((t) => t.length > 2);
}
function ScoreBadge({ score }) {
  if (score >= 70)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 tabular-nums", children: [
      score,
      "%"
    ] });
  if (score >= 40)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25 tabular-nums", children: [
      score,
      "%"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground border border-border tabular-nums", children: [
    score,
    "%"
  ] });
}
function StatusBadge({ status }) {
  if (status === "active")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500" }),
      "Active"
    ] });
  if (status === "duplicate")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-500" }),
      "Duplicate"
    ] });
  if (status === "archived")
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-muted-foreground/50" }),
      "Archived"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
    "Pending"
  ] });
}
function DropZone({ onFileSelected }) {
  const fileInputRef = reactExports.useRef(null);
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const name = file.name.toLowerCase();
      const valid = name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".doc");
      if (!valid) {
        ue.error("Unsupported file type", {
          description: "Please upload a PDF or Word (.docx) document."
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        ue.error("File too large", {
          description: "Maximum file size is 10MB."
        });
        return;
      }
      onFileSelected(file);
    },
    [onFileSelected]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "label",
    {
      onDragOver: (e) => {
        e.preventDefault();
        setIsDragging(true);
      },
      onDragLeave: () => setIsDragging(false),
      onDrop: handleDrop,
      "aria-label": "Upload resume — click or drag and drop",
      "data-ocid": "resume-dropzone",
      className: `
        relative flex flex-col items-center justify-center gap-4 py-14 px-6
        rounded-xl border-2 border-dashed cursor-pointer select-none
        transition-all duration-200 text-center group
        ${isDragging ? "border-primary bg-primary/8 scale-[1.01]" : "border-border bg-muted/20 hover:border-primary/50 hover:bg-muted/40"}
      `,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${isDragging ? "bg-primary/20 scale-110" : "bg-primary/10 group-hover:bg-primary/15"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Upload,
              {
                className: `h-6 w-6 transition-colors duration-200 ${isDragging ? "text-primary" : "text-primary/70 group-hover:text-primary"}`
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
            "Drop PDF or DOCX resume here, or",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary underline underline-offset-2", children: "click to browse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1.5", children: "Supports PDF and Word (.docx, .doc) · Max 10MB" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            ref: fileInputRef,
            type: "file",
            accept: ".pdf,.doc,.docx",
            className: "sr-only",
            tabIndex: 0,
            onChange: (e) => {
              var _a;
              const file = (_a = e.target.files) == null ? void 0 : _a[0];
              if (!file) return;
              const name = file.name.toLowerCase();
              const valid = name.endsWith(".pdf") || name.endsWith(".docx") || name.endsWith(".doc");
              if (!valid) {
                ue.error("Unsupported file type", {
                  description: "Please upload a PDF or Word (.docx) document."
                });
                e.target.value = "";
                return;
              }
              if (file.size > 10 * 1024 * 1024) {
                ue.error("File too large", {
                  description: "Maximum file size is 10MB."
                });
                e.target.value = "";
                return;
              }
              onFileSelected(file);
              e.target.value = "";
            }
          }
        )
      ]
    }
  );
}
function SubmitJobModal({ resume, onClose, onSubmitted }) {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: vendors = [] } = useVendors();
  const createSubmission = useCreateSubmission();
  const [selectedJobId, setSelectedJobId] = reactExports.useState("");
  const [selectedVendorId, setSelectedVendorId] = reactExports.useState("");
  const [notes, setNotes] = reactExports.useState("");
  const openJobs = jobs.filter((j) => j.status === "open");
  async function handleSubmit() {
    if (!selectedJobId) {
      ue.error("Please select a job to submit to.");
      return;
    }
    const job = openJobs.find((j) => j.id === selectedJobId);
    try {
      await createSubmission.mutateAsync({
        candidateId: resume.id,
        resumeId: resume.id,
        jobId: selectedJobId,
        vendorId: selectedVendorId || void 0,
        pipelineStage: "resume_sent",
        notes: notes.trim() || void 0,
        submittedBy: resume.candidateName
      });
      onSubmitted((job == null ? void 0 : job.title) ?? "Job");
      onClose();
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
      "data-ocid": "submit-job-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 px-6 py-4 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display", children: "Submit to Job" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate max-w-xs", children: resume.candidateName || resume.fileName })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Close",
              className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
              "Job ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-9 w-full rounded-md" }) : openJobs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-3.5 w-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "No open jobs.",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", className: "underline text-primary", children: "Add a job" }),
                " ",
                "first."
              ] })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedJobId, onValueChange: setSelectedJobId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-9 text-sm",
                  "data-ocid": "submit-job-select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select open job…" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: openJobs.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: job.id, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: job.title }),
                job.clientName && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground text-xs", children: [
                  "· ",
                  job.clientName
                ] }),
                job.rateAmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground text-xs", children: [
                  "· ",
                  job.rateAmount,
                  " ",
                  job.rateType
                ] })
              ] }, job.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
              "Source Vendor",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: selectedVendorId,
                onValueChange: setSelectedVendorId,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-9 text-sm",
                      "data-ocid": "submit-vendor-select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select vendor…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: vendors.map((v) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: v.id, children: [
                    v.name,
                    v.company && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1.5 text-muted-foreground text-xs", children: [
                      "· ",
                      v.company
                    ] })
                  ] }, v.id)) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
              "Notes",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(optional)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: "Any notes about this submission…",
                className: "text-sm min-h-[72px] resize-none",
                "data-ocid": "submit-notes"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-6 py-4 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: handleSubmit,
              disabled: createSubmission.isPending || !selectedJobId,
              "data-ocid": "submit-job-confirm-btn",
              children: createSubmission.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-1.5" }),
                "Submitting…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3.5 w-3.5 mr-1.5" }),
                "Submit Profile"
              ] })
            }
          )
        ] })
      ] })
    }
  );
}
function ExtractionReviewForm({ file, onClose, onSaved }) {
  const [isExtracting, setIsExtracting] = reactExports.useState(true);
  const [rawText, setRawText] = reactExports.useState("");
  const [candidateName, setCandidateName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [phone, setPhone] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [skillsInput, setSkillsInput] = reactExports.useState("");
  const [role, setRole] = reactExports.useState("");
  const [experience, setExperience] = reactExports.useState("");
  const [yearsExperience, setYearsExperience] = reactExports.useState(
    void 0
  );
  const [availability, setAvailability] = reactExports.useState("");
  const [nameError, setNameError] = reactExports.useState("");
  const [duplicateInfo, setDuplicateInfo] = reactExports.useState(null);
  const [extractError, setExtractError] = reactExports.useState(null);
  const [extractProgress, setExtractProgress] = reactExports.useState(0);
  const createResume = useCreateResume();
  const checkDuplicate = useCheckDuplicateResume();
  reactExports.useEffect(() => {
    let progressTimer = null;
    async function runExtraction() {
      setExtractProgress(0);
      let pct = 0;
      progressTimer = setInterval(() => {
        pct = Math.min(pct + Math.random() * 12 + 4, 90);
        setExtractProgress(Math.round(pct));
      }, 200);
      try {
        const ab = await file.arrayBuffer();
        const name = file.name.toLowerCase();
        let text = "";
        if (name.endsWith(".docx") || name.endsWith(".doc")) {
          text = extractTextFromDocx(ab);
        } else if (name.endsWith(".pdf")) {
          text = extractTextFromPdf(ab);
        } else {
          text = await file.text();
        }
        if (!text.trim()) {
          setExtractError(
            "Could not extract text from this file. Try a different PDF or Word document."
          );
          return;
        }
        const parsed = parseResumeText(text);
        setRawText(text.substring(0, 8e3));
        setCandidateName(parsed.candidateName || "");
        setEmail(parsed.email || "");
        setPhone(parsed.phone || "");
        setLocation(parsed.location || "");
        setRole(parsed.extractedRole || "");
        setExperience(parsed.extractedExperience || "");
        setYearsExperience(parsed.yearsExperience);
        setSkillsInput(parsed.skills.join(", "));
      } catch (err) {
        setExtractError(err.message ?? "Extraction failed.");
      } finally {
        if (progressTimer) clearInterval(progressTimer);
        setExtractProgress(100);
        setTimeout(() => setIsExtracting(false), 300);
      }
    }
    runExtraction();
    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, [file]);
  async function handleEmailBlur() {
    if (!email.trim()) {
      setDuplicateInfo(null);
      return;
    }
    try {
      const result = await checkDuplicate.mutateAsync(email.trim());
      if (result) {
        setDuplicateInfo({
          id: result.id,
          name: result.candidateName || "Unknown",
          date: result.createdAt ? new Date(result.createdAt).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "2-digit"
          }) : ""
        });
      } else {
        setDuplicateInfo(null);
      }
    } catch {
    }
  }
  function parseSkillsArray() {
    return skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
  }
  async function saveResume(asDuplicate) {
    const trimmedName = candidateName.trim();
    if (!trimmedName) {
      setNameError("Candidate name is required.");
      return;
    }
    setNameError("");
    try {
      const resume = await createResume.mutateAsync({
        fileName: file.name,
        candidateName: trimmedName,
        email: email.trim() || void 0,
        phone: phone.trim() || void 0,
        extractedSkills: parseSkillsArray(),
        extractedExperience: experience.trim(),
        extractedRole: role.trim(),
        rawText,
        status: asDuplicate ? "duplicate" : "active",
        availability: availability || void 0,
        duplicateOf: asDuplicate && duplicateInfo ? duplicateInfo.id : void 0,
        yearsExperience,
        location: location.trim() || void 0
      });
      ue.success("Resume saved successfully", {
        description: `${trimmedName}'s profile has been added.`
      });
      onSaved(resume);
    } catch {
    }
  }
  const skillTags = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm",
      "data-ocid": "resume-review-modal",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 bg-card border-b border-border px-6 py-4 flex items-start justify-between gap-3 rounded-t-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-foreground font-display leading-tight", children: "Review Extracted Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 truncate max-w-xs", children: file.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Close",
              className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0 mt-0.5",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-5 space-y-5", children: [
          isExtracting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4 py-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground text-center", children: [
              "Extracting text from ",
              file.name,
              "…"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "w-full rounded-full bg-muted overflow-hidden h-2",
                "data-ocid": "extract-progress-track",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-primary rounded-full transition-all duration-200 ease-out",
                    style: { width: `${extractProgress}%` },
                    role: "progressbar",
                    "aria-valuenow": extractProgress,
                    "aria-valuemin": 0,
                    "aria-valuemax": 100,
                    "aria-label": "Extraction progress",
                    tabIndex: -1,
                    "data-ocid": "extract-progress-bar"
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground tabular-nums", children: [
              extractProgress,
              "%"
            ] })
          ] }),
          !isExtracting && extractError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-3 py-3 rounded-lg bg-destructive/10 border border-destructive/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive flex-shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: extractError })
          ] }),
          !isExtracting && !extractError && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
                "Candidate Name ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: candidateName,
                  onChange: (e) => {
                    setCandidateName(e.target.value);
                    if (e.target.value.trim()) setNameError("");
                  },
                  placeholder: "Full name",
                  className: "h-9 text-sm",
                  "data-ocid": "review-candidate-name",
                  "aria-required": "true"
                }
              ),
              nameError && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
                nameError
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "email",
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  onBlur: handleEmailBlur,
                  placeholder: "email@example.com",
                  className: "h-9 text-sm",
                  "data-ocid": "review-email"
                }
              ),
              duplicateInfo && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30",
                  "data-ocid": "duplicate-warning",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-400 font-medium", children: [
                        "Possible duplicate: ",
                        duplicateInfo.name
                      ] }),
                      duplicateInfo.date && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5", children: [
                        "Uploaded on ",
                        duplicateInfo.date,
                        ". Save anyway?"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mt-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "outline",
                            className: "h-7 text-xs border-amber-500/40 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10",
                            onClick: () => saveResume(true),
                            disabled: createResume.isPending,
                            "data-ocid": "duplicate-link-btn",
                            children: "Save Anyway"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            size: "sm",
                            variant: "ghost",
                            className: "h-7 text-xs text-muted-foreground",
                            onClick: () => setDuplicateInfo(null),
                            disabled: createResume.isPending,
                            "data-ocid": "duplicate-cancel-btn",
                            children: "Cancel"
                          }
                        )
                      ] })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "tel",
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    placeholder: "+91 9876543210",
                    className: "h-9 text-sm",
                    "data-ocid": "review-phone"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Location" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: location,
                    onChange: (e) => setLocation(e.target.value),
                    placeholder: "e.g. Mumbai, India",
                    className: "h-9 text-sm",
                    "data-ocid": "review-location"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Current Role / Title" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: role,
                    onChange: (e) => setRole(e.target.value),
                    placeholder: "e.g. Senior Developer",
                    className: "h-9 text-sm",
                    "data-ocid": "review-role"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Years Exp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 0,
                    max: 50,
                    value: yearsExperience ?? "",
                    onChange: (e) => {
                      const v = e.target.value;
                      setYearsExperience(v === "" ? void 0 : Number(v));
                    },
                    placeholder: "5",
                    className: "h-9 text-sm",
                    "data-ocid": "review-years-exp"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Experience Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: experience,
                  onChange: (e) => setExperience(e.target.value),
                  placeholder: "e.g. 5 years",
                  className: "h-9 text-sm",
                  "data-ocid": "review-experience"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs font-medium text-foreground", children: [
                "Skills",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-normal", children: "(comma-separated)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: skillsInput,
                  onChange: (e) => setSkillsInput(e.target.value),
                  placeholder: "React, TypeScript, Node.js, Salesforce…",
                  className: "h-9 text-sm",
                  "data-ocid": "review-skills"
                }
              ),
              skillTags.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 pt-1", children: [
                skillTags.slice(0, 12).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20",
                    children: s
                  },
                  s
                )),
                skillTags.length > 12 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground pt-0.5", children: [
                  "+",
                  skillTags.length - 12,
                  " more"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-medium text-foreground", children: "Availability" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: availability,
                  onValueChange: (v) => setAvailability(v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-9 text-sm",
                        "data-ocid": "review-availability",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select availability…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "immediate", children: "Immediate" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "two_weeks", children: "2 Weeks Notice" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "one_month", children: "1 Month Notice" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "unavailable", children: "Currently Unavailable" })
                    ] })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        !isExtracting && !extractError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky bottom-0 bg-card border-t border-border px-6 py-4 flex justify-end gap-2 rounded-b-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", size: "sm", onClick: onClose, children: "Cancel" }),
          !duplicateInfo && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "sm",
              onClick: () => saveResume(false),
              disabled: createResume.isPending,
              "data-ocid": "review-save-btn",
              children: createResume.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3.5 h-3.5 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin mr-1.5" }),
                "Saving…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 mr-1.5" }),
                "Save Resume"
              ] })
            }
          )
        ] })
      ] })
    }
  );
}
function MatchCard({ match, resume, onSubmitted }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const createSubmission = useCreateSubmission();
  async function handleSubmit() {
    try {
      await createSubmission.mutateAsync({
        candidateId: resume.id,
        resumeId: resume.id,
        jobId: match.jobId,
        pipelineStage: "resume_sent",
        submittedBy: resume.candidateName
      });
      ue.success("Submitted to job!", {
        description: `${resume.candidateName} → ${match.jobTitle}`,
        action: { label: "Undo", onClick: () => {
        } }
      });
      onSubmitted();
    } catch {
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-200",
      "data-ocid": `resume-match-card-${match.jobId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBadge, { score: match.totalScore }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground leading-tight truncate", children: match.jobTitle }),
            match.clientName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: match.clientName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: [
              { label: "Skills", val: match.skillsScore },
              { label: "Exp", val: match.expScore },
              { label: "Rate", val: match.rateScore },
              { label: "Avail", val: match.availScore }
            ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border",
                children: [
                  label,
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-foreground", children: [
                    val,
                    "%"
                  ] })
                ]
              },
              label
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: handleSubmit,
                disabled: createSubmission.isPending,
                className: "h-8 text-xs",
                "data-ocid": `resume-submit-job-${match.jobId}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3 mr-1" }),
                  "Submit"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setExpanded(!expanded),
                "aria-label": expanded ? "Collapse" : "Expand skills",
                className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" })
              }
            )
          ] })
        ] }),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 space-y-2 border-t border-border/50 pt-3", children: [
          match.matchedSkills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground pt-0.5 mr-0.5 flex-shrink-0", children: "Matched:" }),
            match.matchedSkills.slice(0, 8).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
                children: s
              },
              s
            )),
            match.matchedSkills.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground pt-0.5", children: [
              "+",
              match.matchedSkills.length - 8
            ] })
          ] }),
          match.missingSkills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground pt-0.5 mr-0.5 flex-shrink-0", children: "Missing:" }),
            match.missingSkills.slice(0, 6).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border",
                children: s
              },
              s
            ))
          ] })
        ] })
      ]
    }
  );
}
function MatchPanel({ resume, onClose }) {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const [submitted, setSubmitted] = reactExports.useState(/* @__PURE__ */ new Set());
  const skillsStr = Array.isArray(resume.extractedSkills) ? resume.extractedSkills.join(", ") : resume.extractedSkills;
  const matches = jobs.filter((j) => j.status === "open").map((job) => {
    const { score, matchedKeywords } = scoreJobMatch(
      resume.extractedSkills,
      resume.extractedRole,
      resume.extractedExperience,
      job
    );
    const availMap = {
      immediate: 100,
      two_weeks: 75,
      one_month: 50,
      unavailable: 0
    };
    const availScore = resume.availability ? availMap[resume.availability] ?? 50 : 50;
    const resumeYears = resume.yearsExperience ?? (Number.parseInt(resume.extractedExperience ?? "0", 10) || 0);
    const jobYears = Number.parseInt(job.experience ?? "0", 10) || 0;
    const expScore = jobYears === 0 ? 50 : resumeYears >= jobYears ? 100 : Math.round(resumeYears / jobYears * 100);
    const jobSkillTokens = (job.requiredSkills ?? job.experience ?? "").split(/[,\s]+/).filter(Boolean);
    const skillsScore = jobSkillTokens.length === 0 ? score : Math.round(
      matchedKeywords.length / Math.max(jobSkillTokens.length, 1) * 100
    );
    const rateScore = 50;
    const totalScore = Math.min(
      100,
      Math.round(
        skillsScore * 0.6 + expScore * 0.2 + rateScore * 0.15 + availScore * 0.05
      )
    );
    return {
      jobId: job.id,
      jobTitle: job.title,
      clientName: job.clientName ?? "",
      totalScore,
      skillsScore: Math.min(100, skillsScore),
      expScore: Math.min(100, expScore),
      rateScore,
      availScore,
      matchedSkills: matchedKeywords,
      missingSkills: []
    };
  }).sort((a, b) => b.totalScore - a.totalScore).slice(0, 10);
  const skills = Array.isArray(resume.extractedSkills) ? resume.extractedSkills : skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm",
        onClick: onClose,
        onKeyDown: (e) => {
          if (e.key === "Escape") onClose();
        },
        "aria-hidden": "true"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "fixed right-0 top-0 h-full z-50 w-full max-w-md bg-card border-l border-border shadow-2xl flex flex-col",
        "data-ocid": "resume-match-panel",
        "aria-modal": "true",
        "aria-label": `Job matches for ${resume.candidateName}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground font-display", children: "Best Job Matches" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5 truncate", children: [
                "for ",
                resume.candidateName || resume.fileName
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                "aria-label": "Close matches panel",
                className: "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 bg-muted/30 border-b border-border flex-shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                resume.extractedRole && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: resume.extractedRole }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-1", children: [
                  resume.yearsExperience !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 inline-block", children: [
                    resume.yearsExperience,
                    " yrs exp"
                  ] }),
                  resume.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border inline-flex items-center gap-0.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5" }),
                    resume.location
                  ] })
                ] })
              ] })
            ] }),
            skills.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 mt-2", children: [
              skills.slice(0, 6).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border",
                  children: s
                },
                s
              )),
              skills.length > 6 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground pt-0.5", children: [
                "+",
                skills.length - 6,
                " more"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex-1 overflow-y-auto px-5 py-4 space-y-3",
              "data-ocid": "match-panel-list",
              children: jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-xl" }, i)) }) : matches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex flex-col items-center gap-3 py-12 text-center",
                  "data-ocid": "match-panel-empty",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-10 w-10 text-muted-foreground/25" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No open jobs to match" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Add open jobs in the Jobs section to see match scores here." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "mt-1", children: "Go to Jobs" }) })
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  matches.length,
                  " open jobs scored · sorted by best match"
                ] }),
                matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  MatchCard,
                  {
                    match: m,
                    resume,
                    onSubmitted: () => setSubmitted((prev) => /* @__PURE__ */ new Set([...prev, m.jobId]))
                  },
                  m.jobId
                )),
                submitted.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 text-emerald-500 flex-shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-600 dark:text-emerald-400", children: [
                    submitted.size,
                    " submission",
                    submitted.size > 1 ? "s" : "",
                    " ",
                    "created for this resume."
                  ] })
                ] })
              ] })
            }
          )
        ]
      }
    )
  ] });
}
function ResumeRow({ r, onFindMatches, onSubmitToJob }) {
  const deleteResume = useDeleteResume();
  const { data: submissions = [] } = useListSubmissionsForResume(r.id);
  const skillsList = Array.isArray(r.extractedSkills) ? r.extractedSkills.slice(0, 3) : r.extractedSkills.split(",").map((s) => s.trim()).filter(Boolean).slice(0, 3);
  const uploadedDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit"
  }) : "—";
  const activeSubmissions = submissions.filter((s) => !s.deletedAt);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    TableRow,
    {
      className: "group hover:bg-muted/20",
      "data-ocid": `resume-row-${r.id}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground min-w-[140px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[130px] block", children: r.candidateName || r.fileName }),
            r.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5" }),
              r.location
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden md:table-cell text-xs text-muted-foreground max-w-[150px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: r.email || "—" }),
          r.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] flex items-center gap-0.5 text-muted-foreground/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-2.5 w-2.5" }),
            r.phone
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "hidden sm:table-cell", children: [
          r.extractedRole ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "secondary",
              className: "text-xs font-normal max-w-[120px] truncate",
              children: [
                r.extractedRole.substring(0, 28),
                r.extractedRole.length > 28 ? "…" : ""
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }),
          r.yearsExperience !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] px-1.5 py-0.5 rounded-full bg-primary/8 text-primary/80 border border-primary/15", children: [
            r.yearsExperience,
            " yrs"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 max-w-[180px]", children: skillsList.length > 0 ? skillsList.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border whitespace-nowrap",
            children: s
          },
          s
        )) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "hidden sm:table-cell text-xs text-muted-foreground whitespace-nowrap", children: uploadedDate }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: r.status }),
          activeSubmissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 whitespace-nowrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-2.5 w-2.5" }),
            activeSubmissions.length,
            " submitted"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1 min-w-[140px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "default",
              size: "sm",
              className: "h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
              onClick: () => onSubmitToJob(r),
              "data-ocid": `resume-submit-btn-${r.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Submit" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity",
              onClick: () => onFindMatches(r),
              "data-ocid": `resume-find-matches-${r.id}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: "Matches" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-7 w-7 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all",
              onClick: () => deleteResume.mutate(r.id, {
                onSuccess: () => ue.success("Resume deleted"),
                onError: () => ue.error("Failed to delete resume")
              }),
              "aria-label": "Delete resume",
              "data-ocid": `resume-delete-${r.id}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
            }
          )
        ] }) })
      ]
    }
  );
}
const SKELETON_ROWS = Array.from({ length: 5 }, (_, i) => i);
function ListView({
  resumes,
  isLoading,
  onFindMatches,
  onSubmitToJob
}) {
  const [search, setSearch] = reactExports.useState("");
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [sortField, setSortField] = reactExports.useState("createdAt");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const deferredSearch = reactExports.useDeferredValue(search);
  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("desc");
    }
  }
  const filtered = resumes.filter((r) => {
    const q = deferredSearch.toLowerCase();
    const matchSearch = !q || (r.candidateName ?? "").toLowerCase().includes(q) || (r.email ?? "").toLowerCase().includes(q) || (r.extractedRole ?? "").toLowerCase().includes(q) || (r.location ?? "").toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => {
    if (sortField === "candidateName") {
      const cmp = (a.candidateName ?? "").localeCompare(
        b.candidateName ?? ""
      );
      return sortDir === "asc" ? cmp : -cmp;
    }
    const ta = new Date(a.createdAt ?? 0).getTime();
    const tb = new Date(b.createdAt ?? 0).getTime();
    return sortDir === "asc" ? ta - tb : tb - ta;
  });
  if (!isLoading && resumes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3 py-20 text-center bg-card rounded-xl border border-border",
        "data-ocid": "resume-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-muted flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-6 w-6 text-muted-foreground/40" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: "No resumes uploaded yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-xs", children: "Upload PDF or Word resumes above to automatically find matching jobs." })
          ] })
        ]
      }
    );
  }
  const SortIcon = ({ field }) => sortField === field ? sortDir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-3 w-3 ml-0.5 inline" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 ml-0.5 inline" }) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-2 items-start sm:items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name, email, role, location…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "h-8 pl-8 text-xs",
            "data-ocid": "resume-search"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: statusFilter,
          onValueChange: (v) => setStatusFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "h-8 text-xs w-36",
                "data-ocid": "resume-status-filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All statuses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "duplicate", children: "Duplicate" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "archived", children: "Archived" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-auto whitespace-nowrap", children: [
        filtered.length,
        " of ",
        resumes.length,
        " resume",
        resumes.length !== 1 ? "s" : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none whitespace-nowrap",
            onClick: () => toggleSort("candidateName"),
            children: [
              "Candidate ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { field: "candidateName" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden md:table-cell", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden sm:table-cell", children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "hidden lg:table-cell", children: "Skills" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          TableHead,
          {
            className: "cursor-pointer select-none whitespace-nowrap hidden sm:table-cell",
            onClick: () => toggleSort("createdAt"),
            children: [
              "Added ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(SortIcon, { field: "createdAt" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? SKELETON_ROWS.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: [0, 1, 2, 3, 4, 5, 6].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          className: j > 1 ? "hidden md:table-cell" : "",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" })
        },
        j
      )) }, i)) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        TableCell,
        {
          colSpan: 7,
          className: "py-12 text-center text-sm text-muted-foreground",
          children: "No resumes match your search."
        }
      ) }) : filtered.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ResumeRow,
        {
          r,
          onFindMatches,
          onSubmitToJob
        },
        r.id
      )) })
    ] }) })
  ] });
}
function SqlSetupNote() {
  const [visible, setVisible] = reactExports.useState(true);
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-500/30 bg-amber-500/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "One-time setup: Update the resumes table schema" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Run this SQL in your",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/sql-editor",
              className: "underline underline-offset-2 text-primary",
              children: "SQL Editor"
            }
          ),
          " ",
          "to enable email, phone, location, years of experience, and vendor fields:"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 text-[10px] bg-card border border-border rounded-lg p-3 overflow-x-auto text-foreground font-mono leading-relaxed whitespace-pre", children: `ALTER TABLE resumes ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS years_experience INT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS source_vendor_id UUID REFERENCES vendors(id);
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS availability TEXT;
ALTER TABLE resumes ADD COLUMN IF NOT EXISTS duplicate_of UUID;
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS resume_id UUID REFERENCES resumes(id);` })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setVisible(false),
        className: "text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 p-0.5",
        "aria-label": "Dismiss",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
      }
    )
  ] }) });
}
function ResumesPage() {
  const [pendingFile, setPendingFile] = reactExports.useState(null);
  const [matchingResume, setMatchingResume] = reactExports.useState(null);
  const [submitResume, setSubmitResume] = reactExports.useState(null);
  const { data: resumes = [], isLoading } = useResumes();
  function handleFileSaved(resume) {
    setPendingFile(null);
    setMatchingResume(resume);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-4 sm:p-6 max-w-full min-h-0", children: [
    !getSupabaseCreds() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30",
        "data-ocid": "resumes-no-supabase-banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-400 flex-shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-700 dark:text-amber-300 flex-1", children: [
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
            "to add your credentials."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        matchingResume && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => setMatchingResume(null),
            "aria-label": "Back to all resumes",
            className: "p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
            "data-ocid": "resumes-back-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground leading-none", children: matchingResume ? `Matches — ${matchingResume.candidateName || "Resume"}` : "Resumes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: matchingResume ? "Scored against all open jobs" : "Upload candidate resumes and find matching jobs automatically" })
        ] })
      ] }),
      !matchingResume && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: !isLoading && resumes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        resumes.length,
        " resume",
        resumes.length !== 1 ? "s" : ""
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SqlSetupNote, {}),
    !matchingResume && /* @__PURE__ */ jsxRuntimeExports.jsx(DropZone, { onFileSelected: setPendingFile }),
    matchingResume ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      MatchPanel,
      {
        resume: matchingResume,
        onClose: () => setMatchingResume(null)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListView,
      {
        resumes,
        isLoading,
        onFindMatches: setMatchingResume,
        onSubmitToJob: setSubmitResume
      }
    ),
    pendingFile && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ExtractionReviewForm,
      {
        file: pendingFile,
        onClose: () => setPendingFile(null),
        onSaved: handleFileSaved
      }
    ),
    submitResume && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubmitJobModal,
      {
        resume: submitResume,
        onClose: () => setSubmitResume(null),
        onSubmitted: (jobTitle) => {
          ue.success("Submitted!", {
            description: `${submitResume.candidateName} → ${jobTitle}`
          });
        }
      }
    )
  ] });
}
export {
  ResumesPage as default
};
