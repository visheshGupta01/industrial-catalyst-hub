import { apiFetch } from "./client";
import type { Order, ShippingAddress } from "@/types/order";

export interface CreatePaymentOrderResponse {
  success: boolean;

  payment: {
    key: string;
    orderId: string;
    amount: number;
    currency: string;
  };

  order: Order;
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  order: Order;
}

export const paymentApi = {
  async createOrder(shippingAddress: ShippingAddress): Promise<CreatePaymentOrderResponse> {
    return apiFetch<CreatePaymentOrderResponse>("/payment/create-order", {
      method: "POST",
      body: {
        shippingAddress,
      },
    });
  },

  async verifyPayment(data: VerifyPaymentData): Promise<Order> {
    const res = await apiFetch<VerifyPaymentResponse>("/payment/verify", {
      method: "POST",
      body: data,
    });

    return res.order;
  },

  async getPaymentStatus(orderId: string) {
    const { data } = await apiFetch(`/payment/status/${orderId}`);
    return data;
  },
};
