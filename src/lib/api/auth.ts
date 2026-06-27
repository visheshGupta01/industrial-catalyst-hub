import { apiFetch, tokenStore } from "./client";

export type ApiUser = {
  id?: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  role?: string;
  gstin?: string;
  address?: string;
  avatar?: string;
};

type AuthResponse = { token: string; user: ApiUser };

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  tokenStore.set(res.token);
  return res;
}

export async function registerRequest(payload: {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
}): Promise<AuthResponse> {
  const res = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload,
  });
  tokenStore.set(res.token);
  return res;
}

export async function meRequest(): Promise<ApiUser> {
  return apiFetch<ApiUser>("/auth/me");
}

export function logoutRequest() {
  tokenStore.set(null);
  // Fire-and-forget — don't block the UI if the server is offline
  void apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
}
