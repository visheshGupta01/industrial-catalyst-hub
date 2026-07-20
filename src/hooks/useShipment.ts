import { calculateShipment, createAdminShipment, requestAdminPickup, trackOrderShipment } from "@/lib/api/shipment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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

export function useTrackShipment(orderId: string) {
  return useQuery({
    queryKey: ["shipment-tracking", orderId],
    queryFn: () => trackOrderShipment(orderId),
    enabled: !!orderId, // Prevent execution if no orderId is present
    refetchOnWindowFocus: false,
  });
}

export function useCreateShipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAdminShipment,
    onSuccess: (data) => {
      toast.success(data.message || "Shipment successfully pushed to Shiprocket!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create shipment in Shiprocket");
    },
  });
}

export function useRequestPickup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestAdminPickup,
    onSuccess: (data) => {
      toast.success(data.message || "Pickup truck scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to request pickup from carrier");
    },
  });
}