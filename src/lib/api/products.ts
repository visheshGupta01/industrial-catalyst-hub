import { Product } from "@/types";
import { apiTry } from "./client";

export async function fetchProducts(): Promise<Product[]> {
  const res = await apiTry<Product[] | { products: Product[] }>("/product");
  if (!res) return null;
  const list = Array.isArray(res) ? res : res.products;
  return list
}

export async function fetchProduct(id: string): Promise<Product | undefined> {
  const res = await apiTry<Product>(`/products/${encodeURIComponent(id)}`);
  return res;
}
