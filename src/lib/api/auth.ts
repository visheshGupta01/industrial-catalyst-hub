import { AuthResponse, LoginData, RegisterData } from "@/types/auth";
import { apiFetch } from "./client";
import type { User } from "@/types/user";
import { tokenStore } from "../store/auth";

export const authApi = {
  async login(data: LoginData): Promise<User> {
    const res = await apiFetch<AuthResponse>("/auth/login", {
      method: "POST",
      body: data,
    });

    tokenStore.set(res.token);

    return res.user;
  },

  async register(data: RegisterData): Promise<User> {
    const res = await apiFetch<AuthResponse>("/auth/register", {
      method: "POST",
      body: data,
    });

    tokenStore.set(res.token);

    return res.user;
  },

  async me(): Promise<User> {
    const res = await apiFetch<{
      success: boolean;
      user: User;
    }>("/auth/me");
    console.log("me res", res);

    return res.user;
  },

  async logout() {
    try {
      await apiFetch("/auth/logout", {
        method: "POST",
      });
    } finally {
      tokenStore.clear();
    }
  },
};
