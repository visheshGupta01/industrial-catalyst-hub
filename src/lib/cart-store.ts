import { useSyncExternalStore } from "react";
import type { Product } from "./mock-data";

export type CartItem = { product: Product; quantity: number };

let cart: CartItem[] = [];
let saved: CartItem[] = [];
let drawerOpen = false;
let recent: string[] = [];

const listeners = new Set<() => void>();
const drawerListeners = new Set<() => void>();
const recentListeners = new Set<() => void>();

// Hydrate recently viewed from localStorage
if (typeof window !== "undefined") {
  try {
    const r = localStorage.getItem("ferrocore.recent");
    if (r) recent = JSON.parse(r);
  } catch {}
}

function emit() { listeners.forEach((l) => l()); }
function emitDrawer() { drawerListeners.forEach((l) => l()); }
function emitRecent() { recentListeners.forEach((l) => l()); }

export const cartStore = {
  add(product: Product, quantity = 1, openDrawer = true) {
    const existing = cart.find((i) => i.product.id === product.id);
    if (existing) existing.quantity += quantity;
    else cart = [...cart, { product, quantity }];
    cart = [...cart];
    emit();
    if (openDrawer) {
      drawerOpen = true;
      emitDrawer();
    }
  },
  remove(id: string) {
    cart = cart.filter((i) => i.product.id !== id);
    emit();
  },
  setQty(id: string, quantity: number) {
    cart = cart.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, quantity) } : i));
    emit();
  },
  saveForLater(id: string) {
    const item = cart.find((i) => i.product.id === id);
    if (!item) return;
    cart = cart.filter((i) => i.product.id !== id);
    if (!saved.find((s) => s.product.id === id)) saved = [...saved, item];
    emit();
  },
  moveToCart(id: string) {
    const item = saved.find((i) => i.product.id === id);
    if (!item) return;
    saved = saved.filter((i) => i.product.id !== id);
    const existing = cart.find((i) => i.product.id === id);
    if (existing) existing.quantity += item.quantity;
    else cart = [...cart, item];
    cart = [...cart];
    emit();
  },
  removeSaved(id: string) {
    saved = saved.filter((i) => i.product.id !== id);
    emit();
  },
  clear() {
    cart = [];
    emit();
  },
  get() { return cart; },
  getSaved() { return saved; },
  openDrawer() { drawerOpen = true; emitDrawer(); },
  closeDrawer() { drawerOpen = false; emitDrawer(); },
  trackView(id: string) {
    recent = [id, ...recent.filter((x) => x !== id)].slice(0, 8);
    if (typeof window !== "undefined") {
      try { localStorage.setItem("ferrocore.recent", JSON.stringify(recent)); } catch {}
    }
    emitRecent();
  },
  getRecent() { return recent; },
};

export function useCart() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => cart,
    () => cart,
  );
}

export function useSaved() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => saved,
    () => saved,
  );
}

export function useCartDrawer() {
  return useSyncExternalStore(
    (cb) => { drawerListeners.add(cb); return () => drawerListeners.delete(cb); },
    () => drawerOpen,
    () => false,
  );
}

export function useRecentlyViewed() {
  return useSyncExternalStore(
    (cb) => { recentListeners.add(cb); return () => recentListeners.delete(cb); },
    () => recent,
    () => [] as string[],
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
