import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminOrderApi } from "@/lib/api/adminOrders";

export const adminOrderKeys = {
  all: ["admin-orders"] as const,
  detail: (id: string) => ["admin-orders", id] as const,
};

export function useAdminOrders() {
  return useQuery({
    queryKey: adminOrderKeys.all,
    queryFn: adminOrderApi.getOrders,
  });
}

export function useAdminOrder(id: string) {
  return useQuery({
    queryKey: adminOrderKeys.detail(id),
    queryFn: () => adminOrderApi.getOrder(id),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Parameters<typeof adminOrderApi.updateStatus>[1];
    }) => adminOrderApi.updateStatus(id, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminOrderKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["admin-dashboard"],
      });
    },
  });
}
