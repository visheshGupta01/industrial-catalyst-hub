import { Category } from "@/types";
import { apiTry } from "./client";

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiTry<Category[] | { categories: Category[] }>("/category");
  if (!res) return null;
  const list = Array.isArray(res) ? res : res.categories;
      console.log("categories", list);

  return list
}

export async function fetchCategory(id: string): Promise<Category | undefined> {
  const res = await apiTry<Category>(`/category/${encodeURIComponent(id)}`);
  return res;
}