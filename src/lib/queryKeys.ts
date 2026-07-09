import type { ProductFilters } from "@/types/product";

export const authKeys = {
  all: ["auth"] as const,

  me: () => [...authKeys.all, "me"] as const,
};

export const cartKeys = {
  all: ["cart"] as const,
};

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,

  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,

  detail: (id: string) => [...productKeys.all, id] as const,

  featured: () => [...productKeys.all, "featured"] as const,

  filters: () => [...productKeys.all, "filters"] as const,
};