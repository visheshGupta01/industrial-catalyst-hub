import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
} from "@/lib/api/category";
import {
  createSubCategory,
  deleteSubCategory,
  fetchSubCategories,
  fetchSubCategory,
  updateSubCategory,
} from "@/lib/api/sub-category";
import type { Category, SubCategory } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => fetchCategory(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateCategory(id, data),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      qc.invalidateQueries({ queryKey: ["category", v.id] });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

export function useSubCategories(categoryId?: string) {
  return useQuery<SubCategory[]>({
    queryKey: ["subcategories", categoryId ?? "all"],
    queryFn: () => fetchSubCategories(categoryId),
  });
}

export function useSubCategory(id: string) {
  return useQuery({
    queryKey: ["subcategory", id],
    queryFn: () => fetchSubCategory(id),
    enabled: !!id,
  });
}

export function useCreateSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: FormData) => createSubCategory(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subcategories"] }),
  });
}

export function useUpdateSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateSubCategory(id, data),
    onSuccess: (_, v) => {
      qc.invalidateQueries({ queryKey: ["subcategories"] });
      qc.invalidateQueries({ queryKey: ["subcategory", v.id] });
    },
  });
}

export function useDeleteSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubCategory(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subcategories"] }),
  });
}
