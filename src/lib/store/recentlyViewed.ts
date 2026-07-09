import { create } from "zustand";

interface RecentlyViewedStore {
  ids: string[];

  track: (id: string) => void;
}

export const useRecentlyViewed = create<RecentlyViewedStore>((set) => ({
  ids: [],

  track: (id) =>
    set((state) => ({
      ids: [id, ...state.ids.filter((x) => x !== id)].slice(0, 8),
    })),
}));
