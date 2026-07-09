import { Cart } from "@/types";
import { apiFetch } from "./client";
import { CartResponse } from "@/types/cart";

export const cartApi = {
  get: async (): Promise<Cart> => {
    const res = await apiFetch<CartResponse>("/cart");
    return res.cart;
  },

  add: async ({ productId, quantity }: { productId: string; quantity: number }): Promise<Cart> => {
    const res = await apiFetch<CartResponse>("/cart/items", {
      method: "POST",
      body: {
        productId,
        quantity,
      },
    });

    return res.cart;
  },

  update: async ({
    productId,
    quantity,
  }: {
    productId: string;
    quantity: number;
  }): Promise<Cart> => {
    const res = await apiFetch<CartResponse>(`/cart/items/${productId}`, {
      method: "PUT",
      body: { quantity },
    });

    return res.cart;
  },

  remove: async (productId: string): Promise<Cart> => {
    const res = await apiFetch<CartResponse>(`/cart/items/${productId}`, {
      method: "DELETE",
    });

    return res.cart;
  },

  clear: async (): Promise<Cart> => {
    const res = await apiFetch<CartResponse>("/cart", {
      method: "DELETE",
    });

    return res.cart;
  },
};
