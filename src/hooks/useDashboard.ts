import { useQuery } from "@tanstack/react-query";
import { adminKeys } from "@/lib/queryKeys";
import { adminApi } from "@/lib/api/dashboard";

export function useDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: adminApi.dashboard,
  });
}
