import { fetchProducts, fetchProduct } from "@/lib/api/products";
import { productKeys } from "@/lib/queryKeys";
import { ProductFilters } from "@/types/product";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),

    queryFn: () => fetchProducts(filters),

    placeholderData: keepPreviousData,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () =>
      fetchProducts({
        sort: "newest",
        page: 1,
        limit: 12,
        featured: true,
      }),
  });
}
