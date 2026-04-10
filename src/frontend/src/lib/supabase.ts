/**
 * Supabase REST API helper.
 * Reads credentials from localStorage key 'hirenest_settings_supabase'.
 * Provides typed helpers for INSERT, SELECT, UPDATE, DELETE.
 */

interface SupabaseCreds {
  url: string;
  anonKey: string;
  serviceKey: string;
}

export function getSupabaseCreds(): SupabaseCreds | null {
  try {
    const raw = localStorage.getItem("hirenest_settings_supabase");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, string>;
    const url = (parsed.url ?? parsed.projectUrl ?? "")
      .trim()
      .replace(/\/$/, "");
    const anonKey = (parsed.anonKey ?? "").trim();
    const serviceKey = (
      parsed.serviceKey ??
      parsed.serviceRoleKey ??
      ""
    ).trim();
    if (!url || !anonKey) return null;
    return { url, anonKey, serviceKey: serviceKey || anonKey };
  } catch {
    return null;
  }
}

function buildHeaders(creds: SupabaseCreds): Record<string, string> {
  return {
    apikey: creds.serviceKey || creds.anonKey,
    Authorization: `Bearer ${creds.serviceKey || creds.anonKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

export class SupabaseNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase not connected — go to Settings to add your Supabase credentials before saving data.",
    );
    this.name = "SupabaseNotConfiguredError";
  }
}

function requireCreds(): SupabaseCreds {
  const creds = getSupabaseCreds();
  if (!creds) throw new SupabaseNotConfiguredError();
  return creds;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) {
    const text = await res.text();
    if (!text) return [] as unknown as T;
    return JSON.parse(text) as T;
  }
  const errText = await res.text();
  let msg = `Supabase error (${res.status})`;
  try {
    const parsed = JSON.parse(errText) as {
      message?: string;
      hint?: string;
      details?: string;
    };
    if (parsed.message) msg = parsed.message;
    if (parsed.hint) msg += ` — ${parsed.hint}`;
  } catch {
    if (errText) msg += `: ${errText}`;
  }
  throw new Error(msg);
}

export async function supabaseInsert<T>(
  table: string,
  data: Record<string, unknown>,
): Promise<T> {
  const creds = requireCreds();
  const res = await fetch(`${creds.url}/rest/v1/${table}`, {
    method: "POST",
    headers: buildHeaders(creds),
    body: JSON.stringify(data),
  });
  const result = await handleResponse<T[]>(res);
  return Array.isArray(result) ? result[0] : result;
}

export async function supabaseBatchInsert<T>(
  table: string,
  data: Record<string, unknown>[],
): Promise<T[]> {
  const creds = requireCreds();
  const res = await fetch(`${creds.url}/rest/v1/${table}`, {
    method: "POST",
    headers: buildHeaders(creds),
    body: JSON.stringify(data),
  });
  return handleResponse<T[]>(res);
}

export async function supabaseSelect<T>(
  table: string,
  filters?: Record<string, string | number | boolean>,
  options?: { order?: string; limit?: number },
): Promise<T[]> {
  const creds = requireCreds();
  const params = new URLSearchParams({ select: "*" });
  if (filters) {
    for (const [k, v] of Object.entries(filters)) {
      params.set(k, `eq.${v}`);
    }
  }
  if (options?.order) params.set("order", options.order);
  if (options?.limit) params.set("limit", String(options.limit));

  const res = await fetch(
    `${creds.url}/rest/v1/${table}?${params.toString()}`,
    {
      method: "GET",
      headers: buildHeaders(creds),
    },
  );
  return handleResponse<T[]>(res);
}

export async function supabaseUpdate<T>(
  table: string,
  id: string,
  data: Record<string, unknown>,
): Promise<T> {
  const creds = requireCreds();
  const res = await fetch(`${creds.url}/rest/v1/${table}?id=eq.${id}`, {
    method: "PATCH",
    headers: buildHeaders(creds),
    body: JSON.stringify(data),
  });
  const result = await handleResponse<T[]>(res);
  return Array.isArray(result) ? result[0] : result;
}

export async function supabaseDelete(table: string, id: string): Promise<void> {
  const creds = requireCreds();
  const res = await fetch(`${creds.url}/rest/v1/${table}?id=eq.${id}`, {
    method: "DELETE",
    headers: { ...buildHeaders(creds), Prefer: "return=minimal" },
  });
  if (!res.ok) {
    await handleResponse(res);
  }
}
