import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ChevronRight,
  ClipboardCopy,
  Clock,
  Database,
  Loader2,
  Play,
  RotateCcw,
  Table2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SupabaseCreds {
  projectUrl: string;
  anonKey: string;
  serviceRoleKey: string;
}

interface QueryResult {
  rows: Record<string, unknown>[];
  columns: string[];
  rowCount: number;
  durationMs: number;
}

// ─── Example queries ──────────────────────────────────────────────────────────

const EXAMPLE_QUERIES = [
  {
    label: "Show all vendors",
    sql: "SELECT * FROM vendors LIMIT 50",
  },
  {
    label: "Show all candidates",
    sql: "SELECT * FROM candidates LIMIT 50",
  },
  {
    label: "Recent activities",
    sql: "SELECT * FROM activities ORDER BY created_at DESC LIMIT 20",
  },
  {
    label: "Pending approvals",
    sql: "SELECT * FROM approvals WHERE status = 'pending' LIMIT 20",
  },
  {
    label: "Show all jobs",
    sql: "SELECT * FROM jobs LIMIT 50",
  },
  {
    label: "Bench records",
    sql: "SELECT * FROM bench_records LIMIT 50",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getSupabaseCreds(): SupabaseCreds | null {
  try {
    const raw = localStorage.getItem("hirenest_settings_supabase");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, string>;
    const projectUrl = (parsed.projectUrl ?? parsed.url ?? "").trim();
    const anonKey = (parsed.anonKey ?? "").trim();
    const serviceRoleKey = (
      parsed.serviceRoleKey ??
      parsed.serviceKey ??
      ""
    ).trim();
    if (!projectUrl || !serviceRoleKey) return null;
    return { projectUrl, anonKey, serviceRoleKey };
  } catch {
    return null;
  }
}

async function runSupabaseQuery(
  creds: SupabaseCreds,
  sql: string,
): Promise<QueryResult> {
  const start = performance.now();
  const base = creds.projectUrl.replace(/\/$/, "");
  const headers = {
    apikey: creds.serviceRoleKey,
    Authorization: `Bearer ${creds.serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };

  // Attempt 1: execute_sql RPC
  const rpcRes = await fetch(`${base}/rest/v1/rpc/execute_sql`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query: sql }),
  });

  if (rpcRes.ok) {
    const data = (await rpcRes.json()) as unknown;
    const rows = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
    const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
    return {
      rows,
      columns,
      rowCount: rows.length,
      durationMs: Math.round(performance.now() - start),
    };
  }

  // Attempt 2: try to detect a SELECT from table and use REST GET
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
      const dir = orderMatch[2]?.toUpperCase() === "DESC" ? "desc" : "asc";
      url += `&order=${col}.${dir}`;
    }
    if (whereMatch) {
      // Basic equality filter: column = 'value'
      const eqMatch = whereMatch[1].match(/(\w+)\s*=\s*'([^']+)'/);
      if (eqMatch) url += `&${eqMatch[1]}=eq.${eqMatch[2]}`;
    }

    const restRes = await fetch(url, { method: "GET", headers });
    if (restRes.ok) {
      const data = (await restRes.json()) as unknown;
      const rows = Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : [];
      const columns = rows.length > 0 ? Object.keys(rows[0]) : [];
      return {
        rows,
        columns,
        rowCount: rows.length,
        durationMs: Math.round(performance.now() - start),
      };
    }
    const errBody = await restRes.text();
    throw new Error(`Supabase REST error (${restRes.status}): ${errBody}`);
  }

  // Fallback: surface the original RPC error
  const errBody = await rpcRes.text();
  let msg = `RPC execute_sql not found (${rpcRes.status}).`;
  try {
    const parsed = JSON.parse(errBody) as { message?: string; hint?: string };
    if (parsed.message)
      msg = parsed.message + (parsed.hint ? ` — ${parsed.hint}` : "");
  } catch {
    // ignore
  }
  throw new Error(
    `${msg} You may need to create the execute_sql function in your Supabase project, or use a simple SELECT query.`,
  );
}

// ─── ResultTable ──────────────────────────────────────────────────────────────

function ResultTable({ result }: { result: QueryResult }) {
  if (result.rows.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-12 text-muted-foreground"
        data-ocid="sql-empty-result"
      >
        <Table2 className="h-8 w-8 mb-2 opacity-40" />
        <p className="text-sm">Query returned 0 rows</p>
      </div>
    );
  }

  return (
    <div className="overflow-auto" data-ocid="sql-result-table">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-muted/60 sticky top-0">
            {result.columns.map((col) => (
              <th
                key={col}
                className="text-left px-3 py-2 font-semibold text-muted-foreground border-b border-border whitespace-nowrap"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {result.rows.map((row, i) => {
            const rowKey = `${result.columns.map((c) => String(row[c])).join("|")}-${i}`;
            return (
              <tr
                key={rowKey}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors"
              >
                {result.columns.map((col) => {
                  const val = row[col];
                  const display =
                    val === null || val === undefined
                      ? "NULL"
                      : typeof val === "object"
                        ? JSON.stringify(val)
                        : String(val);
                  return (
                    <td
                      key={col}
                      className="px-3 py-1.5 text-foreground/80 whitespace-nowrap max-w-[220px] truncate"
                      title={display}
                    >
                      {val === null || val === undefined ? (
                        <span className="text-muted-foreground/50 italic">
                          NULL
                        </span>
                      ) : (
                        display
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── SqlEditorPage ─────────────────────────────────────────────────────────────

export default function SqlEditorPage() {
  const [sql, setSql] = useState("SELECT * FROM vendors LIMIT 10");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const creds = getSupabaseCreds();

  // Focus editor on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleRun = useCallback(async () => {
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

  // Cmd/Ctrl+Enter to run
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleRun();
      }
    },
    [handleRun],
  );

  function handleClear() {
    setSql("");
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  }

  function handleCopySql() {
    navigator.clipboard.writeText(sql).then(() => {
      toast.success("SQL copied to clipboard");
    });
  }

  function loadExample(exSql: string) {
    setSql(exSql);
    setResult(null);
    setError(null);
    textareaRef.current?.focus();
  }

  return (
    <div className="flex h-full" data-ocid="sql-editor-page">
      {/* ── Example queries sidebar ── */}
      <aside className="w-52 flex-shrink-0 border-r border-border bg-card/60 flex flex-col overflow-y-auto hidden md:flex">
        <div className="px-3 pt-4 pb-2">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Example Queries
          </p>
        </div>
        <div className="flex-1 px-2 pb-4 space-y-0.5">
          {EXAMPLE_QUERIES.map((q) => (
            <button
              key={q.label}
              type="button"
              onClick={() => loadExample(q.sql)}
              className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors flex items-center gap-1.5 group"
              data-ocid={`example-query-${q.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <ChevronRight className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
              <span className="truncate">{q.label}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-3 border-t border-border">
          <p className="text-[10px] text-muted-foreground/50 leading-relaxed">
            Ctrl+Enter to run
          </p>
        </div>
      </aside>

      {/* ── Main editor area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* No credentials banner */}
        {!creds && (
          <div
            className="flex items-center gap-3 px-4 py-3 border-b border-amber-500/30 bg-amber-500/10 flex-shrink-0"
            data-ocid="sql-no-creds-banner"
          >
            <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-200/80 flex-1">
              Connect your Supabase database first.{" "}
              <Link
                to="/settings"
                className="underline underline-offset-2 hover:text-amber-200 transition-colors"
              >
                Settings → Integrations
              </Link>
            </p>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card flex-shrink-0">
          <Button
            size="sm"
            className="h-7 text-xs gap-1.5 px-3"
            onClick={handleRun}
            disabled={!creds || running || !sql.trim()}
            data-ocid="btn-run-query"
          >
            {running ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {running ? "Running…" : "Run Query"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs gap-1.5 px-3"
            onClick={handleCopySql}
            disabled={!sql.trim()}
            data-ocid="btn-copy-sql"
          >
            <ClipboardCopy className="h-3.5 w-3.5" />
            Copy SQL
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs gap-1.5 px-3 text-muted-foreground"
            onClick={handleClear}
            data-ocid="btn-clear-sql"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </Button>
          <div className="flex-1" />
          {creds && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <Database className="h-3.5 w-3.5" />
              <span className="truncate max-w-[180px] hidden sm:block">
                {creds.projectUrl.replace("https://", "").split(".")[0]}
              </span>
            </div>
          )}
        </div>

        {/* Editor */}
        <div className="flex-shrink-0 border-b border-border">
          <textarea
            ref={textareaRef}
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={7}
            spellCheck={false}
            placeholder="SELECT * FROM vendors LIMIT 10"
            className="w-full resize-none bg-background text-foreground text-sm font-mono p-4 focus:outline-none placeholder:text-muted-foreground/40"
            data-ocid="sql-textarea"
            aria-label="SQL query editor"
          />
        </div>

        {/* Results area */}
        <div className="flex-1 overflow-auto bg-background">
          {/* Status bar */}
          {(result || error) && (
            <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-muted/30 text-xs text-muted-foreground flex-shrink-0">
              {result && (
                <>
                  <span className="text-emerald-400 font-medium">
                    {result.rowCount} row{result.rowCount !== 1 ? "s" : ""}{" "}
                    returned
                  </span>
                  <span className="text-border">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {result.durationMs}ms
                  </span>
                </>
              )}
              {error && (
                <span className="text-destructive font-medium flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Query failed
                </span>
              )}
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="m-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive leading-relaxed"
              data-ocid="sql-error-box"
            >
              <p className="font-semibold mb-1">Error</p>
              <p className="font-mono whitespace-pre-wrap break-words">
                {error}
              </p>
            </div>
          )}

          {/* Results table */}
          {result && !error && <ResultTable result={result} />}

          {/* Idle state */}
          {!result && !error && !running && (
            <div
              className="flex flex-col items-center justify-center h-full py-16 text-muted-foreground"
              data-ocid="sql-idle-state"
            >
              <Database className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm opacity-60">
                {creds
                  ? "Write a query and click Run"
                  : "Configure Supabase in Settings to get started"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
