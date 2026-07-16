import { apiFetch } from "./client";
import type { Order } from "@/types/order";

interface OrderResponse {
  success: boolean;
  order: Order;
}

interface OrdersResponse {
  success: boolean;
  orders: Order[];
}

export const orderApi = {
  async getMyOrders(): Promise<Order[]> {
    const res = await apiFetch<OrdersResponse>("/orders");

    return res.orders;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await apiFetch<OrderResponse>(`/orders/${encodeURIComponent(id)}`);

    return res.order;
  },
};
