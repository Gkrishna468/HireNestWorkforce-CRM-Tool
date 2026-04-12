/**
 * resumeParser.ts — Pure TS resume text extraction and parsing utilities.
 * No external deps beyond what's already used in BenchPage.
 */

import type { Job } from "../types/crm";

// ── Unicode sanitization ──────────────────────────────────────────────────────

/**
 * Extract a display name from a filename.
 * "Sorabh.doc" → "Sorabh"
 * "Sorabh_9+_Salesforce.doc" → "Sorabh"
 * Takes the first underscore/space-delimited token and capitalises the first letter.
 */
export function extractNameFromFilename(filename: string): string {
  // Strip extension
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  // Take first token split on underscore or space
  const first = withoutExt.split(/[_\s]+/)[0] ?? withoutExt;
  if (!first) return "";
  return first.charAt(0).toUpperCase() + first.slice(1);
}

/**
 * Sanitize text for safe Postgres storage.
 * - Removes null bytes and control characters (PostgreSQL rejects these)
 * - Replaces smart quotes / em-dashes / ellipsis with ASCII equivalents
 * - Removes zero-width spaces
 * - Normalizes Unicode to NFC
 * - Does NOT strip all > 0x7F characters (preserves accented letters in names)
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== "string") return "";
  // Step 1: replace problematic Unicode with ASCII equivalents
  let result = text
    // Smart single quotes → straight apostrophe
    .replace(/[\u2018\u2019]/g, "'")
    // Smart double quotes → straight double quote
    .replace(/[\u201C\u201D]/g, '"')
    // Em dash → hyphen
    .replace(/\u2014/g, "-")
    // En dash → hyphen
    .replace(/\u2013/g, "-")
    // Bullets (separate replacements to avoid multi-codepoint class issues)
    .replace(/\u2022/g, "*")
    .replace(/\u25AA/g, "*")
    .replace(/\u25CF/g, "*")
    // Ellipsis
    .replace(/\u2026/g, "...")
    // Zero-width spaces / BOM (separate replacements to satisfy linter)
    .replace(/\u200B/g, "")
    .replace(/\u200C/g, "")
    .replace(/\u200D/g, "")
    .replace(/\uFEFF/g, "");

  // Step 2: remove null bytes and control characters using charCodeAt
  // (avoids biome lint errors on regex control character ranges)
  result = Array.from(result)
    .filter((ch) => {
      const code = ch.charCodeAt(0);
      // Allow: printable ASCII (32–126), newline (10), carriage return (13), tab (9)
      // Allow: non-ASCII printable (>= 160) to preserve accented names
      return (
        code === 9 ||
        code === 10 ||
        code === 13 ||
        (code >= 32 && code <= 126) ||
        code >= 160
      );
    })
    .join("");

  // Step 3: Normalize Unicode composition (NFC)
  return result.normalize("NFC");
}

// ── DOCX text extraction ──────────────────────────────────────────────────────

/** Extract plain text from a DOCX ArrayBuffer using the w:t XML approach */
export function extractTextFromDocx(buffer: ArrayBuffer): string {
  try {
    const bytes = new Uint8Array(buffer);
    const decoder = new TextDecoder("utf-8");
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
    const result =
      texts.length > 0
        ? texts.join(" ")
        : raw
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    return sanitizeText(result);
  } catch {
    return "";
  }
}

// ── PDF text extraction ───────────────────────────────────────────────────────

/** Best-effort PDF text extraction from ArrayBuffer using BT/ET text markers */
export function extractTextFromPdf(buffer: ArrayBuffer): string {
  try {
    const bytes = new Uint8Array(buffer);
    let raw = "";
    for (let i = 0; i < Math.min(bytes.length, 500_000); i++) {
      const b = bytes[i];
      if (b >= 32 && b < 127) {
        raw += String.fromCharCode(b);
      } else if (b === 10 || b === 13) {
        raw += " ";
      }
    }

    const btEtTexts: string[] = [];
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
      result = raw
        .split(/\s+/)
        .filter((w) => w.length > 1 && /[a-zA-Z]/.test(w))
        .join(" ")
        .substring(0, 8000);
    }
    return sanitizeText(result);
  } catch {
    return "";
  }
}

// ── Skill normalization map ────────────────────────────────────────────────────

const SKILL_ALIASES: Record<string, string> = {
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
  servicenow: "ServiceNow",
};

function normalizeSkill(raw: string): string {
  const key = raw.trim().toLowerCase();
  return SKILL_ALIASES[key] ?? raw.trim();
}

const KNOWN_SKILLS = Object.keys(SKILL_ALIASES);

// ── Resume parsing ────────────────────────────────────────────────────────────

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
  "principal",
];

export interface ParsedResume {
  candidateName: string;
  email?: string;
  phone?: string;
  location?: string;
  yearsExperience?: number;
  extractedRole: string;
  skills: string[];
  extractedSkills: string; // comma-joined for backward compat
  extractedExperience: string;
}

/** Parse raw resume text into structured fields */
export function parseResumeText(text: string): ParsedResume {
  const sanitized = sanitizeText(text);
  const lines = sanitized
    .split(/[\n\r]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

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
    extractedExperience: extractExperienceString(sanitized),
  };
}

function extractName(lines: string[]): string {
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

function extractEmail(text: string): string | undefined {
  const m = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return m ? m[0] : undefined;
}

function extractPhone(text: string): string | undefined {
  const m = text.match(/(\+?1?\s?)?(\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4})/);
  if (!m) return undefined;
  return m[0].trim();
}

function extractLocation(lines: string[]): string | undefined {
  // Check prefixed label lines first
  const labelPat = /(?:location|based in|address|city)\s*[:\-]\s*(.+)/i;
  for (const line of lines.slice(0, 25)) {
    const m = line.match(labelPat);
    if (m?.[1]) {
      const val = m[1].trim();
      if (val.length > 2 && val.length < 80) return val;
    }
  }
  // Detect "City, State" or "City, Country" pattern (2-word comma pattern near top)
  const cityStatePat = /^([A-Za-z\s]+),\s*([A-Za-z\s]{2,30})$/;
  for (const line of lines.slice(0, 20)) {
    if (cityStatePat.test(line) && line.length < 60 && !/@/.test(line)) {
      return line;
    }
  }
  return undefined;
}

function extractYearsExperience(text: string): number | undefined {
  const lower = text.toLowerCase();
  const patterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
    /experience\s*[:\-]?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:total|overall)/i,
    /senior\s*\(?(\d+)\+?\s*(?:years?|yrs?)\)?/i,
  ];
  for (const pat of patterns) {
    const m = lower.match(pat);
    if (m?.[1]) {
      const n = Number.parseInt(m[1], 10);
      if (n > 0 && n < 50) return n;
    }
  }
  // Range: "0-2 years" → 1
  const rangeM = lower.match(/(\d+)\s*[-–]\s*(\d+)\s*(?:years?|yrs?)/i);
  if (rangeM?.[1] && rangeM?.[2]) {
    const lo = Number.parseInt(rangeM[1], 10);
    const hi = Number.parseInt(rangeM[2], 10);
    return Math.round((lo + hi) / 2);
  }
  return undefined;
}

function extractRole(text: string, lines: string[]): string {
  const lowerText = text.toLowerCase();
  const labelPatterns = [
    /(?:title|role|position|designation)\s*[:\-]\s*([^\n\r,]+)/i,
    /(?:objective|summary)\s*[:\-]\s*([^\n\r,]+)/i,
    /^(?:profile|about me)\s*[:\-]\s*([^\n\r,]+)/im,
  ];
  for (const pat of labelPatterns) {
    const m = lowerText.match(pat);
    if (m?.[1] != null) {
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

function extractSkillsArray(text: string): string[] {
  const lower = text.toLowerCase();
  const found: string[] = [];

  // Look for a skills section first
  const skillsSectionMatch = lower.match(
    /(?:skills?|technologies|tech stack|expertise)[:\s-]+(.+?)(?=\n\n|\n[A-Z]{2,}|\n(?:experience|education|work|project)|$)/is,
  );
  if (skillsSectionMatch?.[1] != null) {
    const sectionText = skillsSectionMatch[1].substring(0, 500);
    const items = sectionText
      .split(/[,\n\r•|·\-\/]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 1 && s.length < 40);
    if (items.length >= 3) {
      const normalized = items
        .slice(0, 25)
        .map(normalizeSkill)
        .filter((s) => s.length > 0);
      // Deduplicate case-insensitively
      return deduplicateSkills(normalized);
    }
  }

  // Scan for known tech keywords
  for (const alias of KNOWN_SKILLS) {
    if (lower.includes(alias)) {
      found.push(normalizeSkill(alias));
    }
  }
  return deduplicateSkills(found).slice(0, 20);
}

function deduplicateSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const s of skills) {
    const key = s.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      result.push(s);
    }
  }
  return result;
}

function extractExperienceString(text: string): string {
  const lower = text.toLowerCase();
  const yearsPatterns = [
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s+)?(?:experience|exp)/i,
    /experience\s*[:\-]?\s*(\d+)\+?\s*(?:years?|yrs?)/i,
    /(\d+)\+?\s*(?:years?|yrs?)\s*(?:total|overall)/i,
  ];
  for (const pat of yearsPatterns) {
    const m = lower.match(pat);
    if (m?.[1]) {
      return `${m[1]} years`;
    }
  }

  const yearSpans = [
    ...lower.matchAll(/20(\d{2})\s*[-–—to]+\s*(?:20(\d{2})|present|current)/gi),
  ];
  if (yearSpans.length > 0) {
    const currentYear = new Date().getFullYear();
    let totalYears = 0;
    for (const span of yearSpans) {
      const start = 2000 + Number.parseInt(span[1], 10);
      const end = span[2] ? 2000 + Number.parseInt(span[2], 10) : currentYear;
      totalYears += Math.max(0, end - start);
    }
    if (totalYears > 0) return `${totalYears} years`;
  }

  return "";
}

// ── Job matching ──────────────────────────────────────────────────────────────

export interface MatchResult {
  score: number;
  matchedKeywords: string[];
}

/** Score how well a resume matches a job based on keyword overlap.
 *  Accepts skills as string (comma-joined) or string[] */
export function scoreJobMatch(
  resumeSkillsOrArr: string | string[],
  resumeRole: string,
  resumeExperience: string,
  job: Pick<
    Job,
    | "requiredSkills"
    | "title"
    | "roleSummary"
    | "responsibilities"
    | "experience"
  > & { skills?: string },
): MatchResult {
  const skillsStr = Array.isArray(resumeSkillsOrArr)
    ? resumeSkillsOrArr.join(", ")
    : resumeSkillsOrArr;
  const resumeTokens = tokenize(
    `${skillsStr} ${resumeRole} ${resumeExperience}`,
  );
  const jobText = [
    job.requiredSkills ?? "",
    job.skills ?? "",
    job.title ?? "",
    job.roleSummary ?? "",
  ].join(" ");
  const jobTokens = tokenize(jobText);

  if (jobTokens.length === 0) {
    return { score: 0, matchedKeywords: [] };
  }

  const matched = jobTokens.filter((jt) =>
    resumeTokens.some((rt) => rt === jt || rt.includes(jt) || jt.includes(rt)),
  );
  const unique = [...new Set(matched)];

  const roleLower = resumeRole.toLowerCase();
  const titleLower = (job.title ?? "").toLowerCase();
  const roleBonus = roleLower
    .split(/\s+/)
    .some((w) => w.length > 3 && titleLower.includes(w))
    ? 10
    : 0;

  const raw = (unique.length / Math.max(jobTokens.length, 1)) * 90 + roleBonus;
  const score = Math.min(100, Math.round(raw));

  return { score, matchedKeywords: unique.slice(0, 15) };
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[,\s\n\r\-\.\/|•·]+/)
    .map((t) => t.replace(/[^a-z0-9#+.]/g, ""))
    .filter((t) => t.length > 2);
}
