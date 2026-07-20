// Lightweight typed REST client for the user's backend.
// Base URL comes from BACKEND_URL
// Bearer token is read from localStorage on every request.

import { tokenStore } from "../store/auth";

export const API_BASE: string =
  (typeof import.meta !== "undefined" &&
    (import.meta as { env?: { BACKEND_URL?: string } }).env?.BACKEND_URL) ||
  "http://127.0.0.1:3000/api";


export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  /** if true, do NOT throw on non-2xx — return null instead */
  soft?: boolean;
};

export async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  // SSR guard — we only ever call the backend from the browser
  if (typeof window === "undefined") {
    throw new ApiError(0, "API not available during SSR");
  }
  const url = `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    Accept: "application/json",
  };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  
  const isFormData = opts.body instanceof FormData;

  if (opts.body !== undefined && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method: opts.method ?? "GET",
      headers,
      body:
        opts.body === undefined ? undefined : isFormData ? opts.body : JSON.stringify(opts.body),
      signal: opts.signal,
    });
  } catch (e) {
    throw new ApiError(0, `Network error: ${(e as Error).message}`);
  }

let data: unknown = null;

if (res.status !== 204) {
  const text = await res.text();

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
}

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    if (data && typeof data === "object" && "message" in (data as Record<string, unknown>)) {
      msg = String((data as Record<string, unknown>).message);
    }
    throw new ApiError(res.status, msg, data);
  }
  return data as T;
}

/** Best-effort GET: returns null on any failure. Useful for falling back to mock data. */
export async function apiTry<T>(path: string, opts: RequestOptions = {}): Promise<T | null> {
  try {
    return await apiFetch<T>(path, opts);
  } catch (error) {
    console.error(error);
    return null;
  }
}
