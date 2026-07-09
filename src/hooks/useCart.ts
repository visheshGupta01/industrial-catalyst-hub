import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { useMemo } from "react";
import { toast } from "sonner";

export const cartKeys = {
  all: ["cart"] as const,
};

export function useCart() {
  return useQuery({
    queryKey: cartKeys.all,
    queryFn: cartApi.get,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.add,

    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.all, cart);
        toast.success("Added to cart");

    },
  });
}

export function useUpdateCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.update,

    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.all, cart);
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.remove,

    onSuccess: (cart) => {
      queryClient.setQueryData(cartKeys.all, cart);
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartApi.clear,

onSuccess: (cart) => {
  queryClient.setQueryData(cartKeys.all, cart);
}  });
}

export function useCartSummary() {
  const { data: cart } = useCart();

  const count = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const subtotal =
    cart?.items.reduce(
      (sum, item) => sum + item.quantity * (item.product.discountPrice ?? item.product.price),
      0,
    ) ?? 0;

  return {
    count,
    subtotal,
    total: subtotal,
  };
}
