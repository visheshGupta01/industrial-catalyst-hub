import { create } from "zustand";

interface CartDrawerStore {
  open: boolean;

  openDrawer: () => void;

  closeDrawer: () => void;
}

export const useCartDrawer = create<CartDrawerStore>((set) => ({
  open: false,

  openDrawer: () => set({ open: true }),

  closeDrawer: () => set({ open: false }),
}));
