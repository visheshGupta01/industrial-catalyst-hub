import { fetchCategories, fetchCategory } from "@/lib/api/category";
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";

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