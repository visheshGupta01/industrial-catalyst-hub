import { apiFetch, apiTry } from "./client";

export type ApiOrder = {
  id: string;
  date: string;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | string;
  amount: number;
  items?: Array<{ productId: string; quantity: number; price: number; name?: string }>;
  shipping?: Record<string, unknown>;
  payment?: Record<string, unknown>;
};

export async function listOrders(): Promise<ApiOrder[]> {
  const res = await apiTry<ApiOrder[] | { orders: ApiOrder[] }>("/orders");
  if (!res) return [];
  return Array.isArray(res) ? res : res.orders ?? [];
}

export async function getOrder(id: string): Promise<ApiOrder | null> {
  return apiTry<ApiOrder>(`/orders/${encodeURIComponent(id)}`);
}

export async function placeOrder(payload: {
  items: Array<{ productId: string; quantity: number; price: number }>;
  shipping: Record<string, unknown>;
  payment: Record<string, unknown>;
  total: number;
}): Promise<ApiOrder> {
  return apiFetch<ApiOrder>("/orders", { method: "POST", body: payload });
}
