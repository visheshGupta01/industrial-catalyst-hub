import type { Product } from "@/lib/mock-data";
import { products as mockProducts } from "@/lib/mock-data";
import { apiTry } from "./client";

// All product calls fall back to bundled mock data if the backend is offline,
// so the prototype keeps working during demos.

export async function fetchProducts(): Promise<Product[]> {
  const res = await apiTry<Product[] | { products: Product[] }>("/products");
  if (!res) return mockProducts;
  const list = Array.isArray(res) ? res : res.products;
  return list && list.length ? list : mockProducts;
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  const res = await apiTry<Product>(`/products/${encodeURIComponent(id)}`);
  return res ?? mockProducts.find((p) => p.id === id);
}
