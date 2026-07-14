import { apiFetch } from "./client";
import { DashboardResponse } from "@/types/dashboard";

export const adminApi = {
  dashboard: async () => {
    const res = await apiFetch<DashboardResponse>("/admin/dashboard");

    return res.dashboard;
  },
};
