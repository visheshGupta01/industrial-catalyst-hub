// hooks/useProductFilters.ts

import { getProductFilters } from "@/lib/api/products";
import { productKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";

export function useProductFilters() {
  return useQuery({
    queryKey: productKeys.filters(),
    queryFn: getProductFilters,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
