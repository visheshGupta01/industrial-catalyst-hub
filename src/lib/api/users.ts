import { AdminUser, UserFilters } from "@/types/adminUser";
import { apiFetch } from "./client";

interface UsersResponse {
  success: boolean;
  users: AdminUser[];
  pagination: {
    totalUsers: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

interface UserResponse {
  success: boolean;
  user: AdminUser;
}

export const adminUserApi = {
  async getUsers(filters?: UserFilters): Promise<UsersResponse> {
    const params = new URLSearchParams();

    if (filters?.keyword) params.set("keyword", filters.keyword);

    if (filters?.role) params.set("role", filters.role);

    if (filters?.isActive !== undefined) params.set("isActive", String(filters.isActive));

    if (filters?.page) params.set("page", String(filters.page));

    if (filters?.limit) params.set("limit", String(filters.limit));

    const query = params.toString();
    const res = await apiFetch<UsersResponse>(`/user${query ? `?${query}` : ""}`);

    return res;
  },

  async getUser(id: string): Promise<AdminUser> {
    const res = await apiFetch<UserResponse>(`/user/${encodeURIComponent(id)}`);

    return res.user;
  },

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    const res = await apiFetch<UserResponse>(`/user/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    });

    return res.user;
  },

  async updateStatus(id: string, isActive: boolean): Promise<AdminUser> {
    const res = await apiFetch<UserResponse>(`/user/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      body: {
        isActive,
      },
    });

    return res.user;
  },

  async deleteUser(id: string): Promise<void> {
    await apiFetch<{ success: boolean }>(`/user/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
};
