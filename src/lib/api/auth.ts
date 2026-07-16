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

  async me(): Promise<User | null> {
    const token = tokenStore.get();

    if (!token) {
      return null;
    }

    const res = await apiFetch<{
      success: boolean;
      user: User;
    }>("/auth/me");

    return res.user;
  },
};

