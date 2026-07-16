import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/lib/api/orders";

export const orderKeys = {
  all: ["orders"] as const,

  my: () => [...orderKeys.all, "my"] as const,

  detail: (id: string) => [...orderKeys.all, id] as const,
};

export function useMyOrders() {
  return useQuery({
    queryKey: orderKeys.my(),
    queryFn: orderApi.getMyOrders,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getOrder(id),
    enabled: !!id,
  });
}
