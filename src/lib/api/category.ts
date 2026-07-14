import { Category } from "@/types";
import { apiFetch, apiTry } from "./client";

interface CategoryDetailResponse {
  success: boolean;
  message?: string;
  category: Category;
}

export async function fetchCategories(): Promise<Category[]> {
  const res = await apiTry<Category[] | { categories: Category[] }>("/category");
  if (!res) return [];
  const list = Array.isArray(res) ? res : res.categories;
  return list ?? [];
}

export async function fetchCategory(id: string): Promise<Category | undefined> {
  const res = await apiTry<Category | CategoryDetailResponse>(
    `/category/${encodeURIComponent(id)}`,
  );
  if (!res) return undefined;
  if ((res as CategoryDetailResponse).category) return (res as CategoryDetailResponse).category;
  return res as Category;
}

export async function createCategory(data: FormData): Promise<Category> {
  const res = await apiFetch<CategoryDetailResponse | Category>("/category", {
    method: "POST",
    body: data,
  });
  return (res as CategoryDetailResponse).category ?? (res as Category);
}

export async function updateCategory(id: string, data: FormData): Promise<Category> {
  const res = await apiFetch<CategoryDetailResponse | Category>(
    `/category/${encodeURIComponent(id)}`,
    { method: "PUT", body: data },
  );
  return (res as CategoryDetailResponse).category ?? (res as Category);
}

export async function deleteCategory(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/category/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
