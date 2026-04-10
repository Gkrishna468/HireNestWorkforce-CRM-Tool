import { c as createLucideIcon, Z as useJobs, F as useClients, J as useCreateJob, a0 as useUpdateJob, r as reactExports, j as jsxRuntimeExports, g as Button, m as Briefcase, v as ue, e as Badge, C as ChevronRight, a1 as useUpdateJobStatus, X, G as useCreateClient, a2 as useQueryClient, a3 as useBenchRecords, a4 as useMatchBench, U as Users, L as Link } from "./index-B7B8aExa.js";
import { P as PageHeader } from "./PageHeader-CeQAaYIR.js";
import { A as AppModal } from "./AppModal-BRbX2fqM.js";
import { E as EmptyState } from "./EmptyState-DprIPta5.js";
import { I as Input } from "./input-ChSpRzB0.js";
import { L as Label } from "./label-B86p4YBs.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Bb6el4sp.js";
import { S as Skeleton } from "./skeleton-Cay6fJiQ.js";
import { T as Textarea } from "./textarea-BhOLjssQ.js";
import { P as Plus } from "./plus-DyRJpMAM.js";
import { M as MapPin } from "./map-pin-C0sz284m.js";
import { C as ChevronDown } from "./chevron-down-akyJieCv.js";
import { M as MessageSquare } from "./message-square-CcjaNwcP.js";
import { R as RefreshCw } from "./refresh-cw-DH4jIXQC.js";
import "./index-CXdeRCTP.js";
import "./index-BXzjxeDL.js";
import "./index-DZYBLxUV.js";
import "./check-BwbyJByW.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
];
const Copy = createLucideIcon("copy", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M6 3h12", key: "ggurg9" }],
  ["path", { d: "M6 8h12", key: "6g4wlu" }],
  ["path", { d: "m6 13 8.5 8", key: "u1kupk" }],
  ["path", { d: "M6 13h3", key: "wdp6ag" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10", key: "1nkvk2" }]
];
const IndianRupee = createLucideIcon("indian-rupee", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
      key: "c2jq9f"
    }
  ],
  ["rect", { width: "4", height: "12", x: "2", y: "9", key: "mk3on5" }],
  ["circle", { cx: "4", cy: "4", r: "2", key: "bt5ra8" }]
];
const Linkedin = createLucideIcon("linkedin", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "18", cy: "5", r: "3", key: "gq8acd" }],
  ["circle", { cx: "6", cy: "12", r: "3", key: "w7nqdw" }],
  ["circle", { cx: "18", cy: "19", r: "3", key: "1xt0gg" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49", key: "47mynk" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49", key: "1n3mei" }]
];
const Share2 = createLucideIcon("share-2", __iconNode);
function parseJobRequirementText(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  function extract(patterns) {
    for (const pat of patterns) {
      for (const line of lines) {
        const m = line.match(pat);
        if (m == null ? void 0 : m[1]) return m[1].trim();
      }
    }
    return "";
  }
  let title = extract([
    /^(?:hiring[:\-\s*]*|position[:\-\s*]*|role[:\-\s*]*|job\s*title[:\-\s*]*|opening[:\-\s*]*|vacancy[:\-\s*]*)(.+)$/i,
    /^[*_]{1,2}([^*_\n]+)[*_]{1,2}$/
  ]);
  if (!title) {
    for (const line of lines) {
      if (line.length < 80 && !/^(hi|hello|dear|greetings|fw:|fwd:)/i.test(line)) {
        title = line.replace(/^[*_]{1,2}/, "").replace(/[*_]{1,2}$/, "").trim();
        break;
      }
    }
  }
  const companyName = extract([
    /^(?:company[:\-\s*]*|client[:\-\s*]*|organization[:\-\s*]*|org[:\-\s*]*|firm[:\-\s*]*)(.+)$/i
  ]);
  const requiredSkills = extract([
    /^(?:skills?[:\-\s*]*|required\s*skills?[:\-\s*]*|tech\s*stack[:\-\s*]*|technologies[:\-\s*]*|key\s*skills?[:\-\s*]*)(.+)$/i
  ]);
  const experience = extract([
    /^(?:exp(?:erience)?[:\-\s*]*|years?[:\-\s*]*)(.+)$/i,
    /(\d+\+?\s*(?:to|-|\–)?\s*\d*\+?\s*years?)/i,
    /(\d+\+?\s*years?)/i
  ]);
  let rateType = "";
  let rateAmount = "";
  let rateCurrency = "INR";
  if (/\$/.test(text)) rateCurrency = "USD";
  else if (/£/.test(text)) rateCurrency = "GBP";
  else if (/€/.test(text)) rateCurrency = "EUR";
  else rateCurrency = "INR";
  const rateLine = lines.find(
    (l) => /(?:ctc|salary|compensation|rate|budget|package|pay)[:\-\s*]/i.test(l) || /(?:lpm|lpa|per\s*hour|\/hr|\/month|\/year)/i.test(l) || /[₹$€£]\s*\d/.test(l)
  );
  if (rateLine) {
    if (/lpm|per\s*month|\/month/i.test(rateLine)) {
      rateType = "LPM";
      const m = rateLine.match(
        /[₹$€£]?\s*(\d+(?:\.\d+)?)\s*(?:lpm|l\s*pm|per\s*month)/i
      );
      if (m) rateAmount = m[1];
    } else if (/lpa|per\s*annum|\/year|\/annum/i.test(rateLine)) {
      rateType = "LPA";
      const m = rateLine.match(
        /[₹$€£]?\s*(\d+(?:\.\d+)?)\s*(?:lpa|l\s*pa|per\s*annum|per\s*year)/i
      );
      if (m) rateAmount = m[1];
    } else if (/per\s*hour|\/hr|\/hour|hourly/i.test(rateLine)) {
      rateType = "PerHour";
      const m = rateLine.match(
        /[₹$€£]?\s*(\d+(?:\.\d+)?)\s*(?:per\s*hour|\/hr|\/hour)/i
      );
      if (m) rateAmount = m[1];
    }
    if (!rateAmount) {
      const m = rateLine.match(/[₹$€£]?\s*(\d+(?:\.\d+)?)/);
      if (m) rateAmount = m[1];
    }
  }
  const location = extract([
    /^(?:location[:\-\s*]*|place[:\-\s*]*|city[:\-\s*]*|work\s*location[:\-\s*]*)(.+)$/i
  ]);
  let responsibilities = "";
  let inResponsibilities = false;
  const respLines = [];
  for (const line of lines) {
    if (/^(?:responsibilities|key\s*responsibilities|job\s*responsibilities|duties|key\s*duties)[:\-\s*]/i.test(
      line
    )) {
      inResponsibilities = true;
      const after = line.replace(/^[^:]+:\s*/, "").trim();
      if (after) respLines.push(after);
      continue;
    }
    if (inResponsibilities) {
      if (/^(?:skills?|experience|location|company|client|salary|rate|ctc|compensation|education|qualification)[:\-\s*]/i.test(
        line
      )) {
        break;
      }
      respLines.push(line);
    }
  }
  if (respLines.length) {
    responsibilities = respLines.join("\n");
  }
  let roleSummary = extract([
    /^(?:summary[:\-\s*]*|role\s*summary[:\-\s*]*|about\s*(?:the\s*)?role[:\-\s*]*)(.+)$/i
  ]);
  if (!roleSummary && responsibilities) {
    roleSummary = responsibilities.split(/[.\n]/)[0].trim().slice(0, 200);
  }
  return {
    title,
    companyName,
    roleSummary,
    responsibilities,
    requiredSkills,
    experience,
    location,
    rateType,
    rateAmount,
    rateCurrency
  };
}
function formatRateDisplay(job) {
  if (job.rateType && job.rateAmount) {
    const currency = job.rateCurrency ?? "INR";
    const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : currency;
    const label = job.rateType === "LPM" ? "LPM" : job.rateType === "LPA" ? "LPA" : "/hr";
    return `${symbol}${job.rateAmount} ${label}`;
  }
  if (job.rateMin && job.rateMax) return `$${job.rateMin}–$${job.rateMax}/hr`;
  if (job.rateMin) return `$${job.rateMin}/hr+`;
  if (job.rateMax) return `Up to $${job.rateMax}/hr`;
  return "—";
}
function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function getStatusVariant(status) {
  if (status === "open") return "default";
  if (status === "filled") return "secondary";
  if (status === "closed") return "destructive";
  return "outline";
}
function getStatusLabel(status) {
  const labels = {
    open: "Open",
    filled: "Filled",
    closed: "Closed",
    on_hold: "On Hold"
  };
  return labels[status] ?? status;
}
function getMatchColor(score) {
  if (score >= 0.7)
    return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
  if (score >= 0.4)
    return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
  return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800";
}
function buildShareMessage(job) {
  const location = job.location || "Remote / Flexible";
  const rate = formatRateDisplay(job);
  const summary = job.roleSummary ? job.roleSummary.slice(0, 180) + (job.roleSummary.length > 180 ? "…" : "") : job.responsibilities ? job.responsibilities.slice(0, 180) + (job.responsibilities.length > 180 ? "…" : "") : "See full details on our website";
  const skills = job.requiredSkills ? `
🛠 Skills: ${job.requiredSkills}` : "";
  return `🚀 Hiring: ${job.title}
📍 Location: ${location}
💰 Compensation: ${rate}${skills}

${summary}

📩 Interested? Reach us at HireNest Workforce
🌐 app.hirenestworkforce.com`;
}
function WhatsAppIcon({ className }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "currentColor",
      className,
      "aria-hidden": "true",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" })
    }
  );
}
function WhatsAppJobImportModal({
  open,
  onClose,
  clients
}) {
  const [step, setStep] = reactExports.useState(1);
  const [rawText, setRawText] = reactExports.useState("");
  const [parsed, setParsed] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    clientId: "",
    title: "",
    roleSummary: "",
    responsibilities: "",
    requiredSkills: "",
    experience: "",
    location: "",
    rateType: "",
    rateAmount: "",
    rateCurrency: "INR",
    _companyName: ""
  });
  const [matchedClient, setMatchedClient] = reactExports.useState(null);
  const [isNewClient, setIsNewClient] = reactExports.useState(false);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const createClient = useCreateClient();
  const createJob = useCreateJob();
  const qc = useQueryClient();
  function handleParse() {
    if (!rawText.trim()) {
      ue.error("Please paste some WhatsApp text first.");
      return;
    }
    const fields = parseJobRequirementText(rawText);
    setParsed(fields);
    let found = null;
    if (fields.companyName) {
      const needle = fields.companyName.toLowerCase();
      found = clients.find(
        (c) => {
          var _a;
          return c.name.toLowerCase().includes(needle) || needle.includes(c.name.toLowerCase()) || ((_a = c.company) == null ? void 0 : _a.toLowerCase().includes(needle)) || c.company !== void 0 && needle.includes(c.company.toLowerCase());
        }
      ) ?? null;
    }
    setMatchedClient(found);
    setIsNewClient(!found && !!fields.companyName);
    setForm({
      clientId: (found == null ? void 0 : found.id) ?? "",
      title: fields.title,
      roleSummary: fields.roleSummary,
      responsibilities: fields.responsibilities,
      requiredSkills: fields.requiredSkills,
      experience: fields.experience,
      location: fields.location,
      rateType: fields.rateType,
      rateAmount: fields.rateAmount,
      rateCurrency: fields.rateCurrency,
      _companyName: fields.companyName
    });
    setStep(2);
  }
  function handleFieldChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  async function handleSave() {
    if (!form.title.trim()) {
      ue.error("Job title is required.");
      return;
    }
    if (!form.rateType) {
      ue.error("Please select a rate structure.");
      return;
    }
    setIsSaving(true);
    try {
      let clientId = form.clientId;
      if (isNewClient && form._companyName) {
        const newClient = await createClient.mutateAsync({
          name: form._companyName,
          email: "",
          company: form._companyName
        });
        clientId = newClient.id;
      }
      if (!clientId) {
        ue.error("Please select or ensure a client is linked.");
        setIsSaving(false);
        return;
      }
      const { _companyName: _ignored, ...jobInput } = form;
      await createJob.mutateAsync({ ...jobInput, clientId });
      qc.invalidateQueries({ queryKey: ["clients"] });
      qc.invalidateQueries({ queryKey: ["jobs"] });
      ue.success(
        isNewClient ? `Job created and new client "${form._companyName}" added` : "Job created successfully"
      );
      handleClose();
    } catch {
    } finally {
      setIsSaving(false);
    }
  }
  function handleClose() {
    onClose();
    setTimeout(() => {
      setStep(1);
      setRawText("");
      setParsed(null);
      setMatchedClient(null);
      setIsNewClient(false);
    }, 200);
  }
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      open: true,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-transparent p-0 m-0 max-w-none w-full h-full",
      "aria-label": "Import job from WhatsApp",
      "data-ocid": "whatsapp-import-modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm cursor-default",
            "aria-hidden": "true",
            onClick: handleClose,
            onKeyDown: (e) => e.key === "Escape" && handleClose()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-xl mx-4 bg-card border border-border rounded-lg shadow-elevated flex flex-col max-h-[90vh]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-4 w-4 text-emerald-600 dark:text-emerald-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-card-foreground font-display", children: "Parse from WhatsApp" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                  "Step ",
                  step,
                  " of 2 —",
                  " ",
                  step === 1 ? "Paste requirement text" : "Review & confirm job details"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: handleClose,
                className: "h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150",
                "aria-label": "Close modal",
                "data-ocid": "wa-import-close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-0 px-4 pt-3 pb-0 shrink-0", children: [1, 2].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 mr-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: [
                  "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border",
                  step === s ? "bg-primary text-primary-foreground border-primary" : step > s ? "bg-primary/20 text-primary border-primary/40" : "bg-muted text-muted-foreground border-border"
                ].join(" "),
                children: s
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: `text-xs font-medium ${step === s ? "text-foreground" : "text-muted-foreground"}`,
                children: s === 1 ? "Paste Text" : "Review & Save"
              }
            )
          ] }, s)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20 px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: "How it works:" }),
              " Paste the job requirement message you received on WhatsApp. The parser will extract title, company, skills, experience, rate (LPM / LPA / Per Hour), location, and responsibilities automatically."
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-semibold", children: "WhatsApp Message Text" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  value: rawText,
                  onChange: (e) => setRawText(e.target.value),
                  placeholder: "Paste the job requirement message here…\n\nExample:\nHiring: Senior React Developer\nCompany: TechCorp India\nLocation: Pune / Remote\nSkills: React, TypeScript, Node.js\nExperience: 5+ years\nCTC: 2.5 LPM\n\nResponsibilities:\n- Lead frontend development\n- Mentor junior developers",
                  className: "text-xs min-h-[280px] font-mono resize-none",
                  "data-ocid": "wa-import-textarea",
                  autoFocus: true
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "Supports structured and conversational formats. Only company name and title are needed for auto-detection." })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: isNewClient ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-400 font-medium",
                "data-ocid": "wa-new-client-badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" }),
                  "New client will be created:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: form._companyName })
                ]
              }
            ) : matchedClient ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 text-xs text-blue-700 dark:text-blue-400 font-medium",
                "data-ocid": "wa-linked-client-badge",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" }),
                  "Linked to existing client:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: matchedClient.name })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Client *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.clientId,
                  onValueChange: (v) => setForm((p) => ({ ...p, clientId: v })),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "h-8 text-xs",
                        "data-ocid": "wa-client-select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select client…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectItem,
                      {
                        value: c.id,
                        className: "text-xs",
                        children: c.company ? `${c.company} (${c.name})` : c.name
                      },
                      c.id
                    )) })
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Job Title *" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    name: "title",
                    value: form.title,
                    onChange: handleFieldChange,
                    placeholder: "e.g. Senior React Developer",
                    className: "h-8 text-xs",
                    "data-ocid": "wa-form-title"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Role Summary" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    name: "roleSummary",
                    value: form.roleSummary ?? "",
                    onChange: handleFieldChange,
                    placeholder: "One-line description",
                    className: "h-8 text-xs",
                    "data-ocid": "wa-form-role-summary"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Responsibilities" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Textarea,
                  {
                    name: "responsibilities",
                    value: form.responsibilities ?? "",
                    onChange: handleFieldChange,
                    placeholder: "Day-to-day responsibilities…",
                    className: "text-xs min-h-[100px]",
                    "data-ocid": "wa-form-responsibilities"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Required Skills" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      name: "requiredSkills",
                      value: form.requiredSkills ?? "",
                      onChange: handleFieldChange,
                      placeholder: "React, Node.js, …",
                      className: "h-8 text-xs",
                      "data-ocid": "wa-form-skills"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Experience" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      name: "experience",
                      value: form.experience ?? "",
                      onChange: handleFieldChange,
                      placeholder: "e.g. 5+ years",
                      className: "h-8 text-xs",
                      "data-ocid": "wa-form-experience"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Location" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    name: "location",
                    value: form.location ?? "",
                    onChange: handleFieldChange,
                    placeholder: "e.g. Pune, Remote",
                    className: "h-8 text-xs",
                    "data-ocid": "wa-form-location"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                RateStructure,
                {
                  rateType: form.rateType,
                  rateAmount: form.rateAmount ?? "",
                  rateCurrency: form.rateCurrency ?? "INR",
                  onRateTypeChange: (v) => setForm((p) => ({ ...p, rateType: v })),
                  onRateAmountChange: (v) => setForm((p) => ({ ...p, rateAmount: v })),
                  onRateCurrencyChange: (v) => setForm((p) => ({ ...p, rateCurrency: v }))
                }
              )
            ] }),
            parsed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/20 px-3 py-2 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-foreground", children: "Parsed from text." }),
              " ",
              "All fields are editable. Unrecognised fields were left blank."
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20 shrink-0", children: [
            step === 2 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "h-7 text-xs",
                onClick: () => setStep(1),
                disabled: isSaving,
                "data-ocid": "wa-back-btn",
                children: "← Back"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "h-7 text-xs",
                  onClick: handleClose,
                  disabled: isSaving,
                  "data-ocid": "wa-cancel-btn",
                  children: "Cancel"
                }
              ),
              step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  size: "sm",
                  className: "h-7 text-xs gap-1",
                  onClick: handleParse,
                  disabled: !rawText.trim(),
                  "data-ocid": "wa-parse-btn",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3 w-3" }),
                    "Parse & Continue →"
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  className: "h-7 text-xs gap-1",
                  onClick: handleSave,
                  disabled: isSaving || !form.title.trim(),
                  "data-ocid": "wa-save-btn",
                  children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3 animate-spin" }),
                    isNewClient ? "Creating client & job…" : "Saving job…"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                    isNewClient ? "Create Client & Job" : "Save Job"
                  ] })
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
}
function ShareJobModal({
  job,
  open,
  onClose
}) {
  const message = buildShareMessage(job);
  const jobsUrl = "https://app.hirenestworkforce.com/jobs";
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobsUrl)}&title=${encodeURIComponent(job.title)}&summary=${encodeURIComponent(message)}`;
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message);
      ue.success("Copied to clipboard!");
    } catch {
      ue.error("Failed to copy. Please copy manually.");
    }
  }
  if (!open) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "dialog",
    {
      open: true,
      className: "fixed inset-0 z-50 flex items-center justify-center bg-transparent p-0 m-0 max-w-none w-full h-full",
      "aria-label": "Share Job Opening",
      "data-ocid": "share-job-modal",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 bg-foreground/30 backdrop-blur-sm cursor-default",
            "aria-hidden": "true",
            onClick: onClose,
            onKeyDown: (e) => e.key === "Escape" && onClose()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 w-full max-w-md mx-4 bg-card border border-border rounded-lg shadow-elevated", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4 text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-card-foreground font-display", children: "Share Job Opening" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-150",
                "aria-label": "Close modal",
                "data-ocid": "share-modal-close",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "rounded-md border border-border bg-slate-50 dark:bg-slate-800 p-3 space-y-2",
                "data-ocid": "share-preview-card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-slate-900 dark:text-slate-100 font-display", children: job.title }),
                      job.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                        job.location
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "default", className: "shrink-0 text-[10px]", children: getStatusLabel(job.status) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-slate-800 dark:text-slate-200 font-medium", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-3 w-3 text-primary" }),
                    formatRateDisplay(job)
                  ] }),
                  job.roleSummary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2", children: job.roleSummary }),
                  job.requiredSkills && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: job.requiredSkills.split(",").slice(0, 4).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary border border-primary/20",
                      children: s.trim()
                    },
                    s
                  )) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Message Preview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "bg-muted border border-border rounded-md px-3 py-2.5 text-xs text-foreground whitespace-pre-wrap leading-relaxed font-mono max-h-36 overflow-y-auto",
                  "data-ocid": "share-message-preview",
                  children: message
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider", children: "Share Via" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: whatsappUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors duration-150 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/30",
                    "data-ocid": "share-whatsapp-btn",
                    "aria-label": "Share on WhatsApp",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "WhatsApp" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: linkedinUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    className: "flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 transition-colors duration-150 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/30",
                    "data-ocid": "share-linkedin-btn",
                    "aria-label": "Share on LinkedIn",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Linkedin, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "LinkedIn" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: handleCopy,
                    className: "flex flex-col items-center gap-1.5 px-2 py-3 rounded-md bg-secondary border border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-150",
                    "data-ocid": "share-copy-btn",
                    "aria-label": "Copy message to clipboard",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-5 w-5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold", children: "Copy" })
                    ]
                  }
                )
              ] })
            ] })
          ] })
        ] })
      ]
    }
  );
}
function BenchMatchesPanel({ job }) {
  const { data: allBench = [], isLoading: benchLoading } = useBenchRecords();
  const {
    data: matches = [],
    isLoading: matchLoading,
    refetch,
    isFetching
  } = useMatchBench(job.id);
  const isLoading = matchLoading || benchLoading;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "border-t border-border mt-4 pt-4",
      "data-ocid": "bench-matches-panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-semibold text-foreground uppercase tracking-wider", children: "Bench Matches" }),
            !isLoading && matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "h-4 text-[10px] px-1.5", children: matches.length })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-6 w-6 p-0",
              onClick: () => refetch(),
              disabled: isFetching,
              "aria-label": "Reload bench matches",
              "data-ocid": "bench-reload-btn",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                RefreshCw,
                {
                  className: `h-3 w-3 ${isFetching ? "animate-spin" : ""}`
                }
              )
            }
          )
        ] }),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded" }, i)) }) : !benchLoading && allBench.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-md border border-border bg-muted/20 px-3 py-4 text-center",
            "data-ocid": "bench-empty-upload",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Upload your vendor bench list to see matching candidates here." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bench", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-7 text-xs", children: "Go to Bench" }) })
            ]
          }
        ) : matches.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "rounded-md border border-border bg-muted/20 px-3 py-4 text-center",
            "data-ocid": "bench-no-matches",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "No bench matches found.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/bench", className: "text-primary hover:underline", children: "Upload bench candidates" }),
              "."
            ] })
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-[56px_1fr_100px_100px_1fr_70px] gap-2 px-3 py-1.5 bg-muted/30 border-b border-border", children: ["Match %", "Candidate", "Vendor", "Role", "Skills", "Rate"].map(
            (h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider truncate",
                children: h
              },
              h
            )
          ) }),
          matches.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(BenchMatchRow, { match: m }, m.id))
        ] })
      ]
    }
  );
}
function BenchMatchRow({ match }) {
  const pct = Math.round(match.matchScore * 100);
  const colorClass = getMatchColor(match.matchScore);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-[56px_1fr_100px_100px_1fr_70px] gap-2 px-3 py-2 border-b border-border/50 last:border-b-0 hover:bg-muted/20 transition-colors duration-150 text-xs items-center",
      "data-ocid": "bench-match-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: `inline-flex items-center justify-center rounded border px-1.5 py-0.5 text-[10px] font-bold ${colorClass}`,
            children: [
              pct,
              "%"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-foreground truncate", children: match.candidateName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: match.vendorName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: match.role }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: match.skill }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
          "₹",
          match.rate,
          "/hr"
        ] })
      ]
    }
  );
}
function JobDetailPanel({
  job,
  clients,
  onEdit,
  onClose
}) {
  var _a;
  const [shareOpen, setShareOpen] = reactExports.useState(false);
  const updateJobStatus = useUpdateJobStatus();
  const clientName = job.clientName || ((_a = clients.find((c) => c.id === job.clientId)) == null ? void 0 : _a.name) || "Unknown Client";
  function handleToggleStatus() {
    const newStatus = job.status === "closed" ? "open" : "closed";
    updateJobStatus.mutate(
      { id: job.id, status: newStatus },
      {
        onSuccess: () => ue.success(newStatus === "closed" ? "Job closed" : "Job reopened"),
        onError: () => ue.error("Failed to update job status")
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col h-full overflow-hidden bg-card border-l border-border w-full max-w-[480px]",
        "data-ocid": "job-detail-panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border bg-card", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-card-foreground font-display truncate", children: job.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: clientName })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 ml-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 gap-1 text-xs",
                  onClick: () => setShareOpen(true),
                  "data-ocid": "job-detail-share-btn",
                  "aria-label": "Share job opening",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3 w-3" }),
                    "Share"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-7 text-xs",
                  onClick: () => onEdit(job),
                  "data-ocid": "job-edit-btn",
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: job.status === "closed" ? "outline" : "ghost",
                  size: "sm",
                  className: `h-7 text-xs ${job.status === "closed" ? "text-emerald-600 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-700 dark:hover:bg-emerald-900/20" : "text-muted-foreground hover:text-destructive hover:bg-destructive/10"}`,
                  onClick: handleToggleStatus,
                  disabled: updateJobStatus.isPending,
                  "data-ocid": "job-toggle-status-btn",
                  "aria-label": job.status === "closed" ? "Reopen job" : "Close job",
                  children: job.status === "closed" ? "Reopen" : "Close"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "h-7 w-7 p-0",
                  onClick: onClose,
                  "aria-label": "Close panel",
                  children: "✕"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: getStatusVariant(job.status),
                  className: "text-[10px]",
                  children: getStatusLabel(job.status)
                }
              ),
              job.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3 w-3" }),
                job.location
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-0.5 text-muted-foreground", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-3 w-3" }),
                formatRateDisplay(job)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Client" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-card-foreground", children: clientName })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Created" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-card-foreground", children: formatDate(job.createdAt) })
              ] })
            ] }),
            job.roleSummary && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Role Summary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-card-foreground leading-relaxed", children: job.roleSummary })
            ] }),
            job.responsibilities && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Responsibilities" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-card-foreground whitespace-pre-wrap leading-relaxed", children: job.responsibilities })
            ] }),
            !job.responsibilities && job.requirements && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Requirements" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-card-foreground whitespace-pre-wrap leading-relaxed", children: job.requirements })
            ] }),
            job.requiredSkills && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5", children: "Required Skills" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: job.requiredSkills.split(",").map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary border border-primary/20 font-medium",
                  children: s.trim()
                },
                s
              )) })
            ] }),
            job.experience && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1", children: "Experience Required" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-card-foreground", children: job.experience })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(BenchMatchesPanel, { job })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareJobModal,
      {
        job,
        open: shareOpen,
        onClose: () => setShareOpen(false)
      }
    )
  ] });
}
const RATE_TYPES = [
  { value: "LPM", label: "LPM", description: "Lakh Per Month" },
  { value: "LPA", label: "LPA", description: "Lakh Per Annum" },
  { value: "PerHour", label: "Per Hour", description: "Hourly rate" }
];
const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
function RateStructure({
  rateType,
  rateAmount,
  rateCurrency,
  onRateTypeChange,
  onRateAmountChange,
  onRateCurrencyChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-border bg-muted/20 p-3 space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2", children: [
        "Rate Structure *",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "normal-case text-muted-foreground/70", children: "(Choose one)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: RATE_TYPES.map(({ value, label, description }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: [
            "flex items-center gap-3 p-2.5 rounded-md border cursor-pointer transition-colors duration-150",
            rateType === value ? "bg-primary/10 border-primary/40 text-primary" : "bg-background border-border hover:border-border/80 hover:bg-muted/40 text-foreground"
          ].join(" "),
          "data-ocid": `rate-type-${value.toLowerCase()}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "radio",
                name: "rateType",
                value,
                checked: rateType === value,
                onChange: () => onRateTypeChange(value),
                className: "sr-only"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: [
                  "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  rateType === value ? "border-primary" : "border-muted-foreground/40"
                ].join(" "),
                children: rateType === value && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-primary" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground ml-1.5", children: [
                "(",
                description,
                ")"
              ] })
            ] })
          ]
        },
        value
      )) })
    ] }),
    rateType && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-xs", children: [
          "Amount",
          rateType === "LPM" && " (in Lakhs)",
          rateType === "LPA" && " (in Lakhs)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            min: 0,
            step: "0.1",
            value: rateAmount,
            onChange: (e) => onRateAmountChange(e.target.value),
            placeholder: rateType === "PerHour" ? "e.g. 50" : "e.g. 2.5",
            className: "h-8 text-xs",
            "data-ocid": "job-form-rate-amount"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-24 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Currency" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: rateCurrency, onValueChange: onRateCurrencyChange, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SelectTrigger,
            {
              className: "h-8 text-xs",
              "data-ocid": "job-form-rate-currency",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: CURRENCIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, className: "text-xs", children: c }, c)) })
        ] })
      ] })
    ] }),
    rateType && rateAmount && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
      rateType === "LPM" && `Example: ${rateAmount} LPM = ₹${(Number.parseFloat(rateAmount) * 1e5).toLocaleString("en-IN")}/month`,
      rateType === "LPA" && `Example: ${rateAmount} LPA = ₹${(Number.parseFloat(rateAmount) * 1e5).toLocaleString("en-IN")}/year`,
      rateType === "PerHour" && `Example: ${rateAmount} ${rateCurrency}/hr`
    ] })
  ] });
}
function JobForm({
  initial,
  clients,
  onSubmit,
  isLoading
}) {
  const [form, setForm] = reactExports.useState({
    clientId: (initial == null ? void 0 : initial.clientId) ?? "",
    title: (initial == null ? void 0 : initial.title) ?? "",
    roleSummary: (initial == null ? void 0 : initial.roleSummary) ?? "",
    responsibilities: (initial == null ? void 0 : initial.responsibilities) ?? "",
    requiredSkills: (initial == null ? void 0 : initial.requiredSkills) ?? "",
    experience: (initial == null ? void 0 : initial.experience) ?? "",
    requirements: (initial == null ? void 0 : initial.requirements) ?? "",
    rateType: (initial == null ? void 0 : initial.rateType) ?? "",
    rateAmount: (initial == null ? void 0 : initial.rateAmount) ?? "",
    rateCurrency: (initial == null ? void 0 : initial.rateCurrency) ?? "INR",
    location: (initial == null ? void 0 : initial.location) ?? ""
  });
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }
  function handleSubmit(e) {
    e.preventDefault();
    if (!form.clientId || !form.title.trim()) {
      ue.error("Client and job title are required.");
      return;
    }
    if (!form.rateType) {
      ue.error("Please select a rate structure (LPM, LPA, or Per Hour).");
      return;
    }
    onSubmit(form);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", "data-ocid": "job-form", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Job Title *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          name: "title",
          value: form.title,
          onChange: handleChange,
          placeholder: "e.g. Senior React Developer",
          className: "h-8 text-xs",
          required: true,
          "data-ocid": "job-form-title"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Client *" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: form.clientId,
          onValueChange: (v) => setForm((p) => ({ ...p, clientId: v })),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-8 text-xs", "data-ocid": "job-form-client", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select client…" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: clients.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c.id, className: "text-xs", children: c.company ? `${c.company} (${c.name})` : c.name }, c.id)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Role Summary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          name: "roleSummary",
          value: form.roleSummary ?? "",
          onChange: handleChange,
          placeholder: "One-line description of the role",
          className: "h-8 text-xs",
          "data-ocid": "job-form-role-summary"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Responsibilities" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          name: "responsibilities",
          value: form.responsibilities ?? "",
          onChange: handleChange,
          placeholder: "Describe day-to-day responsibilities, key deliverables, team structure, reporting lines...",
          className: "text-xs min-h-[120px]",
          "data-ocid": "job-form-responsibilities"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Required Skills" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          name: "requiredSkills",
          value: form.requiredSkills ?? "",
          onChange: handleChange,
          placeholder: "e.g. React, TypeScript, Node.js (comma separated)",
          className: "h-8 text-xs",
          "data-ocid": "job-form-skills"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Experience Required" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          name: "experience",
          value: form.experience ?? "",
          onChange: handleChange,
          placeholder: "e.g. 3+ years, 5-8 years",
          className: "h-8 text-xs",
          "data-ocid": "job-form-experience"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs", children: "Location" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          name: "location",
          value: form.location ?? "",
          onChange: handleChange,
          placeholder: "e.g. Remote, Bangalore, Austin TX",
          className: "h-8 text-xs",
          "data-ocid": "job-form-location"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RateStructure,
      {
        rateType: form.rateType,
        rateAmount: form.rateAmount ?? "",
        rateCurrency: form.rateCurrency ?? "INR",
        onRateTypeChange: (v) => setForm((p) => ({ ...p, rateType: v })),
        onRateAmountChange: (v) => setForm((p) => ({ ...p, rateAmount: v })),
        onRateCurrencyChange: (v) => setForm((p) => ({ ...p, rateCurrency: v }))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end gap-2 pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        type: "submit",
        size: "sm",
        disabled: isLoading,
        "data-ocid": "job-form-submit",
        children: isLoading ? "Saving…" : (initial == null ? void 0 : initial.title) ? "Save Changes" : "Add Job"
      }
    ) })
  ] });
}
function JobRow({
  job,
  clientName,
  isSelected,
  onClick,
  onShare
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: [
        "w-full text-left grid grid-cols-[1fr_120px_130px_140px_80px_52px_28px] gap-2 px-3 py-2 text-xs border-b border-border/50 transition-colors duration-150 cursor-pointer items-center",
        isSelected ? "bg-primary/8 border-l-2 border-l-primary" : "hover:bg-muted/30"
      ].join(" "),
      "data-ocid": "job-list-row",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: job.title }),
          job.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground truncate flex items-center gap-0.5 mt-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-2.5 w-2.5 flex-shrink-0" }),
            job.location
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: clientName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground truncate flex items-center gap-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(IndianRupee, { className: "h-3 w-3 flex-shrink-0" }),
          formatRateDisplay(job)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground truncate", children: formatDate(job.createdAt) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: getStatusVariant(job.status),
            className: "text-[10px] h-4 px-1.5",
            children: getStatusLabel(job.status)
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: onShare,
            className: "h-5 w-5 flex items-center justify-center rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors duration-150",
            "aria-label": `Share ${job.title}`,
            "data-ocid": "job-row-share-btn",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-3 w-3" })
          }
        ) }),
        isSelected ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3 w-3 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-muted-foreground" })
      ]
    }
  );
}
const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Filled", value: "filled" },
  { label: "Closed", value: "closed" }
];
function JobsPage() {
  const { data: jobs = [], isLoading: jobsLoading } = useJobs();
  const { data: clients = [] } = useClients();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [selectedJobId, setSelectedJobId] = reactExports.useState(null);
  const [showAddModal, setShowAddModal] = reactExports.useState(false);
  const [showWAImport, setShowWAImport] = reactExports.useState(false);
  const [editingJob, setEditingJob] = reactExports.useState(null);
  const [sharingJob, setSharingJob] = reactExports.useState(null);
  const filteredJobs = statusFilter === "all" ? jobs : jobs.filter((j) => j.status === statusFilter);
  const openCount = jobs.filter((j) => j.status === "open").length;
  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? null;
  function handleRowClick(jobId) {
    setSelectedJobId((prev) => prev === jobId ? null : jobId);
  }
  function handleAddJob(data) {
    createJob.mutate(data, {
      onSuccess: () => {
        setShowAddModal(false);
        ue.success("Job added successfully");
      },
      onError: () => ue.error("Failed to add job")
    });
  }
  function handleEditJob(data) {
    if (!editingJob) return;
    updateJob.mutate(
      { id: editingJob.id, input: data },
      {
        onSuccess: () => {
          setEditingJob(null);
          ue.success("Job updated");
        },
        onError: () => ue.error("Failed to update job")
      }
    );
  }
  function getClientName(job) {
    var _a;
    return job.clientName || ((_a = clients.find((c) => c.id === job.clientId)) == null ? void 0 : _a.name) || "Unknown Client";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col h-full", "data-ocid": "jobs-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        title: `Jobs (${openCount} open)`,
        subtitle: "Track open roles, match bench candidates, and manage submissions",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              size: "sm",
              onClick: () => setShowWAImport(true),
              className: "h-7 gap-1.5 text-xs border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 dark:border-emerald-800 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/30",
              "data-ocid": "wa-import-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppIcon, { className: "h-3.5 w-3.5" }),
                "Parse from WhatsApp"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              onClick: () => setShowAddModal(true),
              className: "h-7 gap-1 text-xs",
              "data-ocid": "add-job-btn",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3 w-3" }),
                "Add Job"
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center gap-0 px-4 pt-3 pb-0 border-b border-border bg-card",
        "data-ocid": "job-status-tabs",
        children: STATUS_TABS.map((tab) => {
          const count = tab.value === "all" ? jobs.length : jobs.filter((j) => j.status === tab.value).length;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => setStatusFilter(tab.value),
              className: [
                "flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors duration-150",
                statusFilter === tab.value ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              ].join(" "),
              "data-ocid": `job-tab-${tab.value}`,
              children: [
                tab.label,
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: [
                      "text-[10px] px-1 rounded-sm",
                      statusFilter === tab.value ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    ].join(" "),
                    children: count
                  }
                )
              ]
            },
            tab.value
          );
        })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `flex-1 overflow-y-auto bg-background ${selectedJob ? "border-r border-border" : ""}`,
          children: jobsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-2", children: [1, 2, 3, 4].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full rounded" }, i)) }) : filteredJobs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            EmptyState,
            {
              icon: Briefcase,
              title: statusFilter === "all" ? "No jobs yet" : `No ${statusFilter} jobs`,
              message: statusFilter === "all" ? "Add your first job order to start matching bench candidates." : `There are no jobs with status "${statusFilter}" right now.`,
              action: statusFilter === "all" ? { label: "Add Job", onClick: () => setShowAddModal(true) } : void 0
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[1fr_120px_130px_140px_80px_52px_28px] gap-2 px-3 py-1.5 bg-muted/20 border-b border-border text-[10px] font-semibold text-muted-foreground uppercase tracking-wider sticky top-0 z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Title / Location" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Client" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Compensation" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Created" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center", children: "Share" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
            ] }),
            filteredJobs.map((job) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              JobRow,
              {
                job,
                clientName: getClientName(job),
                isSelected: selectedJobId === job.id,
                onClick: () => handleRowClick(job.id),
                onShare: (e) => {
                  e.stopPropagation();
                  setSharingJob(job);
                }
              },
              job.id
            ))
          ] })
        }
      ),
      selectedJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
        JobDetailPanel,
        {
          job: selectedJob,
          clients,
          onEdit: (job) => setEditingJob(job),
          onClose: () => setSelectedJobId(null)
        }
      )
    ] }),
    sharingJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ShareJobModal,
      {
        job: sharingJob,
        open: !!sharingJob,
        onClose: () => setSharingJob(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      WhatsAppJobImportModal,
      {
        open: showWAImport,
        onClose: () => setShowWAImport(false),
        clients
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: showAddModal,
        onOpenChange: setShowAddModal,
        title: "Add Job",
        description: "Create a new job order for a client.",
        size: "lg",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          JobForm,
          {
            clients,
            onSubmit: handleAddJob,
            isLoading: createJob.isPending
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      AppModal,
      {
        open: !!editingJob,
        onOpenChange: (open) => !open && setEditingJob(null),
        title: "Edit Job",
        description: "Update job order details.",
        size: "lg",
        children: editingJob && /* @__PURE__ */ jsxRuntimeExports.jsx(
          JobForm,
          {
            initial: {
              clientId: editingJob.clientId,
              title: editingJob.title,
              requirements: editingJob.requirements,
              rateMin: editingJob.rateMin,
              rateMax: editingJob.rateMax,
              location: editingJob.location,
              roleSummary: editingJob.roleSummary,
              responsibilities: editingJob.responsibilities,
              requiredSkills: editingJob.requiredSkills,
              experience: editingJob.experience,
              rateType: editingJob.rateType ?? "",
              rateAmount: editingJob.rateAmount,
              rateCurrency: editingJob.rateCurrency ?? "INR"
            },
            clients,
            onSubmit: handleEditJob,
            isLoading: updateJob.isPending
          }
        )
      }
    )
  ] });
}
export {
  JobsPage as default,
  parseJobRequirementText
};
