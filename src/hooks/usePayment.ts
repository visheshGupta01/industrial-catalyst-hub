import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment";
import { orderKeys } from "./useOrders";
import { cartKeys } from "./useCart";

export function useCreatePaymentOrder() {
  return useMutation({
    mutationFn: paymentApi.createOrder,
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentApi.verifyPayment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orderKeys.my(),
      });

      queryClient.invalidateQueries({
        queryKey: cartKeys.all,
      });
    },
  });
}

export const usePaymentStatus = (orderId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: ["payment-status", orderId],

    queryFn: () => paymentApi.getPaymentStatus(orderId!),

    enabled: enabled && !!orderId,

    retry: false,

    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status === "Pending") return 2000;

      if (status === "Verifying") return 2000;

      return false;
    },
  });
};