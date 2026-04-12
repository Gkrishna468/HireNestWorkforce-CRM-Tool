import { r as reactExports, ae as useResumes, j as jsxRuntimeExports, t as getSupabaseCreds, L as Link, a1 as FileText, g as Button, X, af as useResumeJobMatches, m as Briefcase, ag as useDeleteResume, e as Badge, ah as Search, v as ue, ai as useCreateResume, a7 as useBenchRecords, aj as scoreJobMatch, ak as extractTextFromDocx, al as extractTextFromPdf, am as parseResumeText } from "./index-D6lnvgsb.js";
import { I as Input } from "./input-BYWIipv0.js";
import { L as Label } from "./label-A68ha9bT.js";
import { S as Skeleton } from "./skeleton-5QCXauyp.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-BAbE-EV2.js";
import { R as Root, P as Portal, O as Overlay, C as Content, T as Title, D as Description } from "./index-r8censFK.js";
import { C as CircleAlert } from "./circle-alert-L6CunwHD.js";
import { U as Upload } from "./upload-CbkahMUN.js";
import { A as ArrowLeft } from "./arrow-left-CmuWJ1PJ.js";
import { U as User } from "./user-D5hKauei.js";
import { T as Trash2 } from "./trash-2-DpmiKwi2.js";
import "./index-DS3ypJTE.js";
function ScoreBadge({ score }) {
  if (score >= 70)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25", children: [
      score,
      "%"
    ] });
  if (score >= 40)
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/25", children: [
      score,
      "%"
    ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border", children: [
    score,
    "%"
  ] });
}
function formatRate(rateType, rateAmount, rateCurrency) {
  if (!rateType || !rateAmount) return "";
  const cur = rateCurrency ?? "INR";
  return `${rateAmount} ${cur} ${rateType}`;
}
function UploadModal({ open, onOpenChange, onUploaded }) {
  const [file, setFile] = reactExports.useState(null);
  const [nameOverride, setNameOverride] = reactExports.useState("");
  const [parsing, setParsing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const createResume = useCreateResume();
  function reset() {
    setFile(null);
    setNameOverride("");
    setError(null);
    setParsing(false);
  }
  function handleClose() {
    reset();
    onOpenChange(false);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file.");
      return;
    }
    setError(null);
    setParsing(true);
    try {
      const ab = await file.arrayBuffer();
      const name = file.name.toLowerCase();
      let rawText = "";
      if (name.endsWith(".docx") || name.endsWith(".doc")) {
        rawText = extractTextFromDocx(ab);
      } else if (name.endsWith(".pdf")) {
        rawText = extractTextFromPdf(ab);
      } else {
        rawText = await file.text();
      }
      if (!rawText.trim()) {
        setError(
          "Could not extract text from this file. Try a different PDF or Word document."
        );
        setParsing(false);
        return;
      }
      const parsed = parseResumeText(rawText);
      const candidateName = nameOverride.trim() || parsed.candidateName || file.name.replace(/\.[^.]+$/, "");
      const resume = await createResume.mutateAsync({
        fileName: file.name,
        candidateName,
        extractedSkills: parsed.extractedSkills,
        extractedExperience: parsed.extractedExperience,
        extractedRole: parsed.extractedRole,
        rawText: rawText.substring(0, 5e3)
      });
      ue.success("Resume uploaded and parsed successfully");
      reset();
      onOpenChange(false);
      onUploaded(resume);
    } catch (err) {
      setError(err.message ?? "Failed to upload resume.");
    } finally {
      setParsing(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Portal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Overlay, { className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { className: "fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Title, { className: "text-base font-semibold text-foreground font-display", children: "Upload Resume" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Description, { className: "text-xs text-muted-foreground mt-0.5", children: "Upload a PDF or Word document — skills and role will be auto-extracted." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: handleClose,
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
          className: "space-y-4",
          "data-ocid": "resume-upload-form",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                "Resume File ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex items-center gap-2 px-3 py-2 rounded-lg border border-input bg-background",
                  "aria-label": "Choose resume file",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `text-sm flex-1 truncate ${file ? "text-foreground" : "text-muted-foreground"}`,
                        children: file ? file.name : "Click to choose PDF or Word file…"
                      }
                    ),
                    file && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => setFile(null),
                        className: "text-muted-foreground hover:text-destructive transition-colors",
                        "aria-label": "Remove file",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          var _a;
                          return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                        },
                        className: "text-xs text-primary underline underline-offset-2 hover:text-primary/80 transition-colors whitespace-nowrap",
                        children: "Browse"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: ".pdf,.doc,.docx",
                  className: "hidden",
                  onChange: (e) => {
                    var _a;
                    setFile(((_a = e.target.files) == null ? void 0 : _a[0]) ?? null);
                    e.target.value = "";
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: "Supports PDF and Word (.docx, .doc)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs text-muted-foreground", children: [
                "Candidate Name Override",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/60", children: "(optional — auto-detected if blank)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: nameOverride,
                  onChange: (e) => setNameOverride(e.target.value),
                  placeholder: "e.g. Priya Sharma",
                  className: "h-8 text-sm",
                  "data-ocid": "resume-name-override"
                }
              )
            ] }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/20", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-destructive flex-shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: error })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  onClick: handleClose,
                  children: "Cancel"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "submit",
                  size: "sm",
                  disabled: parsing || createResume.isPending,
                  "data-ocid": "resume-parse-upload-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
                    parsing || createResume.isPending ? "Parsing…" : "Parse & Upload"
                  ]
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] }) });
}
function BenchMatchSection({ resume }) {
  const { data: benchRecords = [] } = useBenchRecords();
  const topBench = benchRecords.map((b) => {
    const { score } = scoreJobMatch(
      resume.extractedSkills,
      resume.extractedRole,
      resume.extractedExperience,
      { requiredSkills: b.skill, title: b.role }
    );
    return { ...b, score };
  }).filter((b) => b.score >= 30).sort((a, b) => b.score - a.score).slice(0, 3);
  if (topBench.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic", children: "No bench candidates match this resume (threshold: 30% skill overlap)." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3", children: topBench.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-foreground truncate max-w-[120px]", children: b.candidateName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBadge, { score: b.score })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground truncate", children: b.vendorName || "—" }),
        b.role && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "secondary",
            className: "text-[10px] w-fit font-normal",
            children: b.role
          }
        )
      ]
    },
    b.id
  )) });
}
function MatchingView({
  resume,
  onBack
}) {
  const { data: matches = [], isLoading } = useResumeJobMatches(resume);
  const skills = resume.extractedSkills ? resume.extractedSkills.split(",").map((s) => s.trim()).filter(Boolean) : [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: onBack,
        className: "flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors self-start",
        "data-ocid": "resume-back-btn",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
          "Back to All Resumes"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-card border border-border rounded-xl p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold text-foreground font-display", children: resume.candidateName || resume.fileName }),
        resume.extractedRole && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: resume.extractedRole }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1.5 mt-2", children: [
          resume.extractedExperience && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20", children: [
            resume.extractedExperience,
            " experience"
          ] }),
          skills.slice(0, 8).map((skill) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
              children: skill
            },
            skill
          )),
          skills.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
            "+",
            skills.length - 8,
            " more"
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-amber-600 dark:text-amber-400", children: "B" }) }),
        "Bench Candidates Match"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(BenchMatchSection, { resume })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card border border-border rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-4 w-4 text-primary" }),
        "Matching Open Jobs",
        !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-muted-foreground ml-1", children: [
          "(",
          matches.length,
          " found)"
        ] })
      ] }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full rounded-lg" }, i)) }) : matches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center gap-2 py-10 text-center",
          "data-ocid": "resume-no-matches-state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-8 w-8 text-muted-foreground/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No open jobs found." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Add open jobs in the Jobs section to start matching." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "mt-2", children: "Go to Jobs" }) })
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", "data-ocid": "resume-matches-list", children: matches.map(({ job, matchScore, matchedKeywords }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col gap-2 p-4 rounded-lg bg-muted/20 border border-border hover:bg-muted/40 transition-colors",
          "data-ocid": `resume-match-${job.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBadge, { score: matchScore }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-semibold text-foreground truncate", children: job.title })
                ] }),
                job.clientName && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: job.clientName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/jobs", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-xs flex-shrink-0",
                  "data-ocid": `resume-view-job-${job.id}`,
                  children: "View Job"
                }
              ) })
            ] }),
            (job.rateType ?? job.rateAmount) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: formatRate(job.rateType, job.rateAmount, job.rateCurrency) }),
            matchedKeywords.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground mr-0.5", children: "Matched:" }),
              matchedKeywords.slice(0, 5).map((kw) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20",
                  children: kw
                },
                kw
              )),
              matchedKeywords.length > 5 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px] text-muted-foreground", children: [
                "+",
                matchedKeywords.length - 5,
                " more"
              ] })
            ] }),
            job.responsibilities && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground line-clamp-2", children: [
              job.responsibilities.substring(0, 120),
              job.responsibilities.length > 120 ? "…" : ""
            ] })
          ]
        },
        job.id
      )) })
    ] })
  ] });
}
const SKELETON_ROWS = Array.from({ length: 4 }, (_, i) => i);
function ListView({
  resumes,
  isLoading,
  onFindMatches
}) {
  const deleteResume = useDeleteResume();
  if (!isLoading && resumes.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center gap-3 py-20 text-center",
        "data-ocid": "resume-empty-state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 text-muted-foreground/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "No resumes uploaded yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground max-w-xs", children: "Upload PDF or Word resumes to automatically find matching jobs." })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Candidate Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Role" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Key Skills" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Uploaded" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? SKELETON_ROWS.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: [0, 1, 2, 3, 4].map((j) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-full" }) }, j)) }, i)) : resumes.map((r) => {
      const skillsDisplay = r.extractedSkills ? r.extractedSkills.length > 60 ? `${r.extractedSkills.substring(0, 60)}…` : r.extractedSkills : "—";
      const uploadedDate = r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "—";
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          className: "group hover:bg-muted/20",
          "data-ocid": `resume-row-${r.id}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-foreground max-w-[180px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: r.candidateName || r.fileName }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: r.extractedRole ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Badge,
              {
                variant: "secondary",
                className: "text-xs font-normal",
                children: [
                  r.extractedRole.substring(0, 30),
                  r.extractedRole.length > 30 ? "…" : ""
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/40 text-xs", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: skillsDisplay }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-xs text-muted-foreground", children: uploadedDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-xs opacity-0 group-hover:opacity-100 transition-all",
                  onClick: () => onFindMatches(r),
                  "data-ocid": `resume-find-matches-${r.id}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3 w-3 mr-1" }),
                    "Find Matches"
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
        },
        r.id
      );
    }) })
  ] }) });
}
function SqlSetupNote() {
  const [visible, setVisible] = reactExports.useState(true);
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-amber-500/30 bg-amber-500/5 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-foreground", children: "One-time setup: Create the resumes table in Supabase" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
          "Run this SQL in your",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/sql-editor", className: "underline underline-offset-2", children: "SQL Editor" }),
          " ",
          "once to enable resume saving:"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "mt-2 text-[11px] bg-card border border-border rounded-lg p-3 overflow-x-auto text-foreground font-mono leading-relaxed", children: "CREATE TABLE IF NOT EXISTS resumes (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  file_name TEXT NOT NULL,\n  file_url TEXT,\n  candidate_name TEXT,\n  extracted_skills TEXT,\n  extracted_experience TEXT,\n  extracted_role TEXT,\n  raw_text TEXT,\n  created_at TIMESTAMPTZ DEFAULT now()\n);" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setVisible(false),
        className: "text-muted-foreground hover:text-foreground transition-colors flex-shrink-0",
        "aria-label": "Dismiss",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
      }
    )
  ] }) });
}
function ResumesPage() {
  const [showUpload, setShowUpload] = reactExports.useState(false);
  const [selectedResume, setSelectedResume] = reactExports.useState(null);
  const { data: resumes = [], isLoading } = useResumes();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-5 p-6 max-w-full", children: [
    !getSupabaseCreds() && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center gap-2 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30",
        "data-ocid": "resumes-no-supabase-banner",
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
            "to add your credentials."
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-display text-foreground leading-none", children: "Resumes" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Upload candidate resumes and find matching jobs automatically" })
        ] })
      ] }),
      !selectedResume && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => setShowUpload(true),
          "data-ocid": "resumes-upload-btn",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5 mr-1.5" }),
            "Upload Resume"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SqlSetupNote, {}),
    !selectedResume && !isLoading && resumes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      resumes.length,
      " resume",
      resumes.length !== 1 ? "s" : "",
      " uploaded"
    ] }),
    selectedResume ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      MatchingView,
      {
        resume: selectedResume,
        onBack: () => setSelectedResume(null)
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      ListView,
      {
        resumes,
        isLoading,
        onFindMatches: setSelectedResume
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      UploadModal,
      {
        open: showUpload,
        onOpenChange: setShowUpload,
        onUploaded: (r) => setSelectedResume(r)
      }
    )
  ] });
}
export {
  ResumesPage as default
};
