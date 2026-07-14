import { apiFetch } from "./client";
import type { Order, OrderStatus } from "@/types/order";

interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

interface OrderResponse {
  success: boolean;
  order: Order;
}

export const adminOrderApi = {
  async getOrders(): Promise<Order[]> {
    const res = await apiFetch<OrdersResponse>("/orders");

    return res.orders;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await apiFetch<OrderResponse>(`/orders/${encodeURIComponent(id)}`);

    return res.order;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const res = await apiFetch<OrderResponse>(`/orders/${encodeURIComponent(id)}/status`, {
      method: "PUT",
      body: { status },
    });

    return res.order;
  },
};
