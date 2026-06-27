import { apiFetch } from "./client";

export type RemoteCartItem = { productId: string; quantity: number };

export const cartApi = {
  get: () => apiFetch<{ items: RemoteCartItem[] }>("/cart").catch(() => ({ items: [] })),
  add: (productId: string, quantity: number) =>
    apiFetch("/cart/items", { method: "POST", body: { productId, quantity } }).catch(() => null),
  update: (productId: string, quantity: number) =>
    apiFetch(`/cart/items/${encodeURIComponent(productId)}`, { method: "PATCH", body: { quantity } }).catch(() => null),
  remove: (productId: string) =>
    apiFetch(`/cart/items/${encodeURIComponent(productId)}`, { method: "DELETE" }).catch(() => null),
  clear: () => apiFetch("/cart", { method: "DELETE" }).catch(() => null),
};
