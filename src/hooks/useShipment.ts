import { calculateShipment } from "@/lib/api/shipment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCalculateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: calculateShipment,
    onSuccess: (shippingData) => {
      console.log(shippingData);
      // Invalidate cart summary or dynamically update local pricing stores if needed
      queryClient.setQueryData(["shipping-rate"], shippingData);
    },
  });
}
