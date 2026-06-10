import { useSyncExternalStore } from "react";
import type { Product } from "./mock-data";

export type CartItem = { product: Product; quantity: number };

let cart: CartItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const cartStore = {
  add(product: Product, quantity = 1) {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) existing.quantity += quantity;
    else cart = [...cart, { product, quantity }];
    cart = [...cart];
    emit();
  },
  remove(id: string) {
    cart = cart.filter((i) => i.product.id !== id);
    emit();
  },
  setQty(id: string, quantity: number) {
    cart = cart.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
    emit();
  },
  clear() {
    cart = [];
    emit();
  },
  get() {
    return cart;
  },
};

export function useCart() {
  return useSyncExternalStore(
    subscribe,
    () => cart,
    () => cart,
  );
}

export function cartTotals(items: CartItem[]) {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shipping = subtotal > 0 ? Math.max(450, Math.round(subtotal * 0.015)) : 0;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return { subtotal, shipping, tax, total, count };
}
