import type { UserRole } from "./user";

export interface AdminUser {
  _id: string;

  name: string;
  email: string;

  role: UserRole;

  isActive: boolean;

  orderCount: number;
  totalSpending: number;

  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  keyword?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}