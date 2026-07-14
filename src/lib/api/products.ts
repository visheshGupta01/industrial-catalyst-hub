import { Product } from "@/types";
import { apiFetch, apiTry } from "./client";
import { ProductFilters, ProductFiltersResponse, ProductResponse } from "@/types/product";

interface ProductDetailResponse {
  success: boolean;
  message: string;
  product: Product;
}

export async function fetchProducts(filters?: ProductFilters): Promise<ProductResponse> {
  const params = new URLSearchParams();

  if (filters?.keyword) params.set("keyword", filters.keyword);

  if (filters?.category) params.set("category", filters.category);

  if (filters?.sort) params.set("sort", filters.sort);

  if (filters?.page) params.set("page", String(filters.page));

  if (filters?.limit) params.set("limit", String(filters.limit));

  if (filters?.brand?.length) params.set("brand", filters.brand.join(","));

  if (filters?.featured !== undefined) {
    params.set("featured", String(filters.featured));
  }

  if (filters?.inStock !== undefined) {
    params.set("inStock", String(filters.inStock));
  }

  if (filters?.minPrice !== undefined) {
    params.set("minPrice", String(filters.minPrice));
  }

  if (filters?.maxPrice !== undefined) {
    params.set("maxPrice", String(filters.maxPrice));
  }

  Object.entries(filters?.specifications ?? {}).forEach(([key, values]) => {
    if (values.length) {
      params.set(key, values.join(","));
    }
  });

  const query = params.toString();

  const res = await apiTry<ProductResponse>(`/product${query ? `?${query}` : ""}`);

  if (!res)
    return {
      success: false,
      products: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: filters?.limit || 10,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };

  return res;
}
export async function fetchProduct(id: string): Promise<Product> {
  const res = await apiTry<ProductDetailResponse>(`/product/${encodeURIComponent(id)}`);

  if (!res) throw new Error("Product not found");

  return res.product;
}

export async function getProductFilters() {
  const res = await apiFetch<{
    success: boolean;
    filters: ProductFiltersResponse;
  }>("/product/filters");

  return res.filters;
}

export async function createProduct(data: FormData) {
  const res = await apiFetch<ProductDetailResponse>("/product", {
    method: "POST",
    body: data,
  });

if (!res.success) {
  throw new Error(res.message);
}
  return res.product;
}

export async function updateProduct(id: string, data: FormData) {
  const res = await apiFetch<ProductDetailResponse>(`/product/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: data,
  });

  if (!res.success) {
    throw new Error(res.message);
  }
  return res.product;
}

export async function deleteProduct(id: string) {
  const res = await apiFetch<{
    success: boolean;
    message: string;
  }>(`/product/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

  if (!res.success) {
    throw new Error(res.message);
  }

  return res;
}
