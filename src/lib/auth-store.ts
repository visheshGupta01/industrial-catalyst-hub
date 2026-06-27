import { useSyncExternalStore } from "react";
import { loginRequest, registerRequest, meRequest, logoutRequest, type ApiUser } from "./api/auth";
import { tokenStore } from "./api/client";
import { cartStore } from "./cart-store";

export type AuthUser = {
  name: string;
  email: string;
  company: string;
  phone: string;
  role: string;
  gstin: string;
  address: string;
  avatar?: string;
};

const KEY = "ferrocore_auth_user";
let current: AuthUser | null = null;
const listeners = new Set<() => void>();

function load(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function persist() {
  if (typeof window === "undefined") return;
  if (current) localStorage.setItem(KEY, JSON.stringify(current));
  else localStorage.removeItem(KEY);
}

function emit() { listeners.forEach((l) => l()); }

function normalize(api: ApiUser, fallback?: Partial<AuthUser>): AuthUser {
  return {
    name: api.name || fallback?.name || api.email.split("@")[0],
    email: api.email,
    company: api.company ?? fallback?.company ?? "—",
    phone: api.phone ?? fallback?.phone ?? "",
    role: api.role ?? fallback?.role ?? "Procurement Manager",
    gstin: api.gstin ?? fallback?.gstin ?? "—",
    address: api.address ?? fallback?.address ?? "—",
    avatar: api.avatar ?? fallback?.avatar,
  };
}

current = load();

// On boot, if we have a token try to refresh the profile from the backend.
// Silently keep the cached user if the backend is offline.
if (typeof window !== "undefined" && tokenStore.get()) {
  void meRequest()
    .then((u) => { current = normalize(u, current ?? undefined); persist(); emit(); })
    .catch(() => { /* keep cached */ });
}

export const authStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  get(): AuthUser | null { return current; },

  async login(email: string, password: string) {
    const { user } = await loginRequest(email, password);
    current = normalize(user);
    persist();
    emit();
  },

  async signup(data: { name: string; email: string; password: string; company?: string; phone?: string }) {
    const { user } = await registerRequest(data);
    current = normalize(user, data);
    persist();
    emit();
  },

  /** Local demo fallback — used by SSO buttons that don't have credentials in this prototype */
  loginLocal(email: string, name?: string) {
    current = {
      name: name || email.split("@")[0].replace(/\W+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      company: "Acme Manufacturing Ltd.",
      phone: "+91 98100 12345",
      role: "Procurement Manager",
      gstin: "27ABCDE1234F1Z5",
      address: "Plot 42, MIDC Industrial Area, Pune, Maharashtra 411019",
    };
    persist();
    emit();
  },

  update(patch: Partial<AuthUser>) {
    if (!current) return;
    current = { ...current, ...patch };
    persist();
    emit();
  },

  logout() {
    logoutRequest();
    current = null;
    persist();
    emit();
  },
};

export function useAuth() {
  return useSyncExternalStore(authStore.subscribe, () => authStore.get(), () => null);
}
