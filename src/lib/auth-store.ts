import { useSyncExternalStore } from "react";

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

function load() {
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

current = load();

function emit() { listeners.forEach((l) => l()); }

export const authStore = {
  subscribe(l: () => void) { listeners.add(l); return () => listeners.delete(l); },
  get(): AuthUser | null { return current; },
  login(email: string, name?: string) {
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
  signup(data: { name: string; email: string; company: string; phone: string }) {
    current = {
      name: data.name,
      email: data.email,
      company: data.company,
      phone: data.phone,
      role: "Procurement Manager",
      gstin: "27ABCDE1234F1Z5",
      address: "—",
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
  logout() { current = null; persist(); emit(); },
};

export function useAuth() {
  return useSyncExternalStore(authStore.subscribe, () => authStore.get(), () => null);
}
