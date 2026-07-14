import { SubCategory } from "@/types";
import { apiFetch, apiTry } from "./client";

interface SubCategoryDetailResponse {
  success: boolean;
  message?: string;
  subCategory: SubCategory;
}

export async function fetchSubCategories(categoryId?: string): Promise<SubCategory[]> {
  const query = categoryId ? `?category=${encodeURIComponent(categoryId)}` : "";
  const res = await apiTry<SubCategory[] | { subCategories: SubCategory[] }>(
    `/sub-category${query}`,
  );
  if (!res) return [];
  const list = Array.isArray(res) ? res : res.subCategories;
  return list ?? [];
}

export async function fetchSubCategory(id: string): Promise<SubCategory | undefined> {
  const res = await apiTry<SubCategory | SubCategoryDetailResponse>(
    `/sub-category/${encodeURIComponent(id)}`,
  );
  if (!res) return undefined;
  if ((res as SubCategoryDetailResponse).subCategory)
    return (res as SubCategoryDetailResponse).subCategory;
  return res as SubCategory;
}

export async function createSubCategory(data: FormData): Promise<SubCategory> {
  const res = await apiFetch<SubCategoryDetailResponse | SubCategory>("/sub-category", {
    method: "POST",
    body: data,
  });
  return (res as SubCategoryDetailResponse).subCategory ?? (res as SubCategory);
}

export async function updateSubCategory(id: string, data: FormData): Promise<SubCategory> {
  const res = await apiFetch<SubCategoryDetailResponse | SubCategory>(
    `/sub-category/${encodeURIComponent(id)}`,
    { method: "PUT", body: data },
  );
  return (res as SubCategoryDetailResponse).subCategory ?? (res as SubCategory);
}

export async function deleteSubCategory(id: string): Promise<void> {
  await apiFetch<{ success: boolean }>(`/sub-category/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
