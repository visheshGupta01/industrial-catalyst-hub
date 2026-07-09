import { apiFetch } from "./client";
import type { Order, ShippingAddress } from "@/types/order";

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
    const res = await apiFetch<OrdersResponse>("/orders/my");

    return res.orders;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await apiFetch<OrderResponse>(`/orders/${encodeURIComponent(id)}`);

    return res.order;
  },

  async placeOrder(shippingAddress: ShippingAddress): Promise<Order> {
    const res = await apiFetch<OrderResponse>("/orders", {
      method: "POST",
      body: {
        shippingAddress,
      },
    });

    return res.order;
  },
};
