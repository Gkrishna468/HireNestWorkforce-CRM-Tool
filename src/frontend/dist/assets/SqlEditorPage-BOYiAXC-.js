import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, C as ChevronRight, L as Link, g as Button, D as Database, w as ue } from "./index-CVrXVggm.js";
import { C as CircleAlert } from "./circle-alert-TRETUhER.js";
import { L as LoaderCircle } from "./loader-circle-I0OZe0Pi.js";
import { P as Play } from "./play-BY0C2iF2.js";
import { C as Clock } from "./clock-BCmjsrFH.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2", key: "4jdomd" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4", key: "3hqy98" }],
  ["path", { d: "M21 14H11", key: "1bme5i" }],
  ["path", { d: "m15 10-4 4 4 4", key: "5dvupr" }]
];
const ClipboardCopy = createLucideIcon("clipboard-copy", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
      key: "gugj83"
    }
  ]
];
const Table2 = createLucideIcon("table-2", __iconNode);
const EXAMPLE_QUERIES = [
  {
    label: "Show all vendors",
    sql: "SELECT * FROM vendors LIMIT 50"
  },
  {
    label: "Show all candidates",
    sql: "SELECT * FROM candidates LIMIT 50"
  },
  {
    label: "Recent activities",
    sql: "SELECT * FROM activities ORDER BY created_at DESC LIMIT 20"
  },
  {
    label: "Pending approvals",
    sql: "SELECT * FROM approvals WHERE status = 'pending' LIMIT 20"
  },
  {
    label: "Show all jobs",
    sql: "SELECT * FROM jobs LIMIT 50"
  },
  {
    label: "Bench records",
    sql: "SELECT * FROM bench_records LIMIT 50"
  }
];
function getSupabaseCreds() {
  try {
    const raw = localStorage.getItem("hirenest_settings_supabase");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const projectUrl = (parsed.projectUrl ?? parsed.url ?? "").trim();
    const anonKey = (parsed.anonKey ?? "").trim();
    const serviceRoleKey = (parsed.serviceRoleKey ?? parsed.serviceKey ?? "").trim();
    if (!projectUrl || !serviceRoleKey) return null;
    return { projectUrl, anonKey, serviceRoleKey };
  } catch {
    return null;
  }
}
async function runSupabaseQuery(creds, sql) {
  var _a;
  const start = performance.now();
  const base = creds.projectUrl.replace(/\/$/, "");
  const headers = {
    apikey: creds.serviceRoleKey,
    Authorization: `Bearer ${creds.serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation"
  };
  const rpcRes = await fetch(`${base}/rest/v1/rpc/execute_sql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: sql })
  });
  if (rpcRes.ok) {
    const data = await rpcRes.json();
    const rows = Array.isArray(data) ? data : [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return {
      rows,
      columns,
      rowCount: rows.length,
      durationMs: Math.round(performance.now() - start)
    };
  }
  const selectMatch = sql.trim().match(/^SELECT\s+.+?\s+FROM\s+"?(\w+)"?/i);
  if (selectMatch) {
    const table = selectMatch[1];
    const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
    const orderMatch = sql.match(/ORDER BY\s+([^\s]+)\s*(DESC|ASC)?/i);
    const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
    let url = `${base}/rest/v1/${table}?select=*`;
    if (limitMatch) url += `&limit=${limitMatch[1]}`;
    if (orderMatch) {
      const col = orderMatch[1];
      const dir = ((_a = orderMatch[2]) == null ? void 0 : _a.toUpperCase()) === "DESC" ? "desc" : "asc";
      url += `&order=${col}.${dir}`;
    }
    if (whereMatch) {
      const eqMatch = whereMatch[1].match(/(\w+)\s*=\s*'([^']+)'/);
      if (eqMatch) url += `&${eqMatch[1]}=eq.${eqMatch[2]}`;
    }
    const restRes = await fetch(url, { method: "GET", headers });
    if (restRes.ok) {
      const data = await restRes.json();
      const rows = Array.isArray(data) ? data : [];
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        rows,
        columns,
        rowCount: rows.length,
        durationMs: Math.round(performance.now() - start)
      };
    }
    const errBody2 = await restRes.text();
    throw new Error(`Supabase REST error (${restRes.status}): ${errBody2}`);
  }
  const errBody = await rpcRes.text();
  let msg = `RPC execute_sql not found (${rpcRes.status}).`;
  try {
    const parsed = JSON.parse(errBody);
    if (parsed.message)
      msg = parsed.message + (parsed.hint ? ` — ${parsed.hint}` : "");
  } catch {
  }
  throw new Error(
    `${msg} You may need to create the execute_sql function in your Supabase project, or use a simple SELECT query.`
  );
}
function ResultTable({ result }) {
  if (result.rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-12 text-muted-foreground",
        "data-ocid": "sql-empty-result",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Table2, { className: "h-8 w-8 mb-2 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Query returned 0 rows" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-auto", "data-ocid": "sql-result-table", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs border-collapse", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/60 sticky top-0", children: result.columns.map((col) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "th",
      {
        className: "text-left px-3 py-2 font-semibold text-muted-foreground border-b border-border whitespace-nowrap",
        children: col
      },
      col
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: result.rows.map((row, i) => {
      const rowKey = `${result.columns.map((c) => String(row[c])).join("|")}-${i}`;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/30 transition-colors",
          children: result.columns.map((col) => {
            const val = row[col];
            const display = val === null || val === void 0 ? "NULL" : typeof val === "object" ? JSON.stringify(val) : String(val);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "td",
              {
                className: "px-3 py-1.5 text-foreground/80 whitespace-nowrap max-w-[220px] truncate",
                title: display,
                children: val === null || val === void 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/50 italic", children: "NULL" }) : display
              },
              col
            );
          })
        },
        rowKey
      );
    }) })
  ] }) });
}
function SqlEditorPage() {
  const [sql, setSql] = reactExports.useState("SELECT * FROM vendors LIMIT 10");
  const [running, setRunning] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const textareaRef = reactExports.useRef(null);
  const creds = getSupabaseCreds();
  reactExports.useEffect(() => {
    var _a;
    (_a = textareaRef.current) == null ? void 0 : _a.focus();
  }, []);
  const handleRun = reactExports.useCallback(async () => {
    if (!creds || !sql.trim() || running) return;
    setRunning(true);
    setResult(null);
    setError(null);
    try {
      const res = await runSupabaseQuery(creds, sql.trim());
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }, [creds, sql, running]);
  const handleKeyDown = reactExports.useCallback(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun]
  );
  function handleClear() {
    var _a;
    setSql("");
    setResult(null);
    setError(null);
    (_a = textareaRef.current) == null ? void 0 : _a.focus();
  }
  function handleCopySql() {
    navigator.clipboard.writeText(sql).then(() => {
      ue.success("SQL copied to clipboard");
    });
  }
  function loadExample(exSql) {
    var _a;
    setSql(exSql);
    setResult(null);
    setError(null);
    (_a = textareaRef.current) == null ? void 0 : _a.focus();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", "data-ocid": "sql-editor-page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-52 flex-shrink-0 border-r border-border bg-card/60 flex flex-col overflow-y-auto hidden md:flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 pt-4 pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-widest", children: "Example Queries" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 px-2 pb-4 space-y-0.5", children: EXAMPLE_QUERIES.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => loadExample(q.sql),
          className: "w-full text-left px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 group",
          "data-ocid": `example-query-${q.label.toLowerCase().replace(/\s+/g, "-")}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 text-primary transition-opacity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: q.label })
          ]
        },
        q.label
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-3 border-t border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground/50 leading-relaxed", children: "Ctrl+Enter to run" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 overflow-hidden", children: [
      !creds && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 px-4 py-3 border-b border-amber-500/30 bg-amber-500/10 flex-shrink-0",
          "data-ocid": "sql-no-creds-banner",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-400 flex-shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-amber-200/80 flex-1", children: [
              "Connect your Supabase database first.",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/settings",
                  className: "underline underline-offset-2 hover:text-amber-200 transition-colors",
                  children: "Settings → Integrations"
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card flex-shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            className: "h-7 text-xs gap-1.5 px-3",
            onClick: handleRun,
            disabled: !creds || running || !sql.trim(),
            "data-ocid": "btn-run-query",
            children: [
              running ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }),
              running ? "Running…" : "Run Query"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "outline",
            className: "h-7 text-xs gap-1.5 px-3",
            onClick: handleCopySql,
            disabled: !sql.trim(),
            "data-ocid": "btn-copy-sql",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { className: "h-3.5 w-3.5" }),
              "Copy SQL"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            variant: "ghost",
            className: "h-7 text-xs gap-1.5 px-3 text-muted-foreground",
            onClick: handleClear,
            "data-ocid": "btn-clear-sql",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
              "Clear"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        creds && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-emerald-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate max-w-[180px] hidden sm:block", children: creds.projectUrl.replace("https://", "").split(".")[0] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "textarea",
        {
          ref: textareaRef,
          value: sql,
          onChange: (e) => setSql(e.target.value),
          onKeyDown: handleKeyDown,
          rows: 7,
          spellCheck: false,
          placeholder: "SELECT * FROM vendors LIMIT 10",
          className: "w-full resize-none bg-background text-foreground text-sm font-mono p-4 focus:outline-none placeholder:text-muted-foreground/40",
          "data-ocid": "sql-textarea",
          "aria-label": "SQL query editor"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto bg-background", children: [
        (result || error) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/30 text-xs text-muted-foreground flex-shrink-0", children: [
          result && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-400 font-medium", children: [
              result.rowCount,
              " row",
              result.rowCount !== 1 ? "s" : "",
              " ",
              "returned"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
              result.durationMs,
              "ms"
            ] })
          ] }),
          error && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-medium flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
            "Query failed"
          ] })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "m-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive leading-relaxed",
            "data-ocid": "sql-error-box",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold mb-1", children: "Error" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono whitespace-pre-wrap break-words", children: error })
            ]
          }
        ),
        result && !error && /* @__PURE__ */ jsxRuntimeExports.jsx(ResultTable, { result }),
        !result && !error && !running && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-full py-16 text-muted-foreground",
            "data-ocid": "sql-idle-state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "h-10 w-10 mb-3 opacity-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-60", children: creds ? "Write a query and click Run" : "Configure Supabase in Settings to get started" })
            ]
          }
        )
      ] })
    ] })
  ] });
}
export {
  SqlEditorPage as default
};
