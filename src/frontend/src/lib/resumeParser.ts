/**
 * resumeParser.ts — Pure TS resume text extraction and parsing utilities.
 * No external deps beyond what's already used in BenchPage.
 */

import type { Job } from "../types/crm";

// ── DOCX text extraction ──────────────────────────────────────────────────────

/** Extract plain text from a DOCX ArrayBuffer using the same w:t XML approach as BenchPage */
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
    if (texts.length > 0) return texts.join(" ");
    // Fallback: strip all XML tags
    return raw
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
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
    // Build string from printable ASCII bytes only
    for (let i = 0; i < Math.min(bytes.length, 500_000); i++) {
      const b = bytes[i];
      if (b >= 32 && b < 127) {
        raw += String.fromCharCode(b);
      } else if (b === 10 || b === 13) {
        raw += " ";
      }
    }

    // Extract text between BT (Begin Text) and ET (End Text) markers
    const btEtTexts: string[] = [];
    const btEtRegex = /BT\s*([\s\S]*?)\s*ET/g;
    let m = btEtRegex.exec(raw);
    while (m !== null) {
      // Extract strings inside () parentheses (PDF text objects)
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

    if (btEtTexts.length > 0) {
      return btEtTexts.join(" ").replace(/\s+/g, " ").trim();
    }

    // Fallback: return printable characters, filter noise
    return raw
      .split(/\s+/)
      .filter((w) => w.length > 1 && /[a-zA-Z]/.test(w))
      .join(" ")
      .substring(0, 8000);
  } catch {
    return "";
  }
}

// ── Resume parsing ────────────────────────────────────────────────────────────

const KNOWN_SKILLS = [
  "react",
  "angular",
  "vue",
  "svelte",
  "typescript",
  "javascript",
  "python",
  "java",
  "go",
  "golang",
  "rust",
  "c++",
  "c#",
  "php",
  "ruby",
  "swift",
  "kotlin",
  "node.js",
  "nodejs",
  "express",
  "django",
  "flask",
  "spring",
  "nextjs",
  "next.js",
  "nestjs",
  "graphql",
  "rest",
  "sql",
  "mysql",
  "postgresql",
  "mongodb",
  "redis",
  "elasticsearch",
  "aws",
  "azure",
  "gcp",
  "docker",
  "kubernetes",
  "terraform",
  "linux",
  "git",
  "ci/cd",
  "jenkins",
  "github",
  "html",
  "css",
  "tailwind",
  "sass",
  "webpack",
  "vite",
  "figma",
  "agile",
  "scrum",
  "jira",
  "salesforce",
  "servicenow",
  "sap",
  "tableau",
  "powerbi",
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "data science",
  "etl",
  "hadoop",
  "spark",
  "kafka",
  "microservices",
  "devops",
  "ios",
  "android",
  "react native",
  "flutter",
  "selenium",
  "cypress",
];

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
  extractedRole: string;
  extractedSkills: string;
  extractedExperience: string;
}

/** Parse raw resume text into structured fields */
export function parseResumeText(text: string): ParsedResume {
  const lines = text
    .split(/[\n\r]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  return {
    candidateName: extractName(lines),
    extractedRole: extractRole(text, lines),
    extractedSkills: extractSkills(text),
    extractedExperience: extractExperience(text),
  };
}

function extractName(lines: string[]): string {
  // Look for a name-like line near the top (capitalized words, no special chars, not an email)
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    // Skip lines that look like emails, phones, URLs, or section headers
    if (/[@|:|http|www|resume|curriculum|vitae]/i.test(line)) continue;
    if (/^\d/.test(line)) continue;
    // A name is typically 2-4 words, mostly letters
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

function extractRole(text: string, lines: string[]): string {
  const lowerText = text.toLowerCase();

  // Look for explicit label
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

  // Look for a line that contains job title keywords
  for (const line of lines.slice(0, 20)) {
    const lower = line.toLowerCase();
    const hasTitle = JOB_TITLE_KEYWORDS.some((kw) => lower.includes(kw));
    if (hasTitle && line.length < 80 && line.length > 5) {
      // Make sure it's not a section header with lots of uppercase
      if (!/^[A-Z\s]+$/.test(line)) return line;
    }
  }
  return "";
}

function extractSkills(text: string): string {
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
      return items.slice(0, 20).join(", ");
    }
  }

  // Scan for known tech keywords
  for (const skill of KNOWN_SKILLS) {
    if (lower.includes(skill)) {
      found.push(skill);
    }
  }
  return found.slice(0, 20).join(", ");
}

function extractExperience(text: string): string {
  const lower = text.toLowerCase();

  // Pattern: "X years" or "X+ years" or "X yrs"
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

  // Count distinct year spans in work history (e.g. 2018 - 2022)
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

/** Score how well a resume matches a job based on keyword overlap */
export function scoreJobMatch(
  resumeSkills: string,
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
  const resumeTokens = tokenize(
    `${resumeSkills} ${resumeRole} ${resumeExperience}`,
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

  // Role title bonus: if resume role words appear in job title
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
