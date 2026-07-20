import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createQuoteRequest,
  CreateQuotePayload,
  getAdminQuotes,
  updateQuoteStatus,
  getMyQuotes,
} from "@/lib/api/quote";
import { toast } from "sonner";

export function useCreateQuote() {
  return useMutation({
    mutationFn: createQuoteRequest,
    onSuccess: (data) => {
      toast.success(
        data.message ||
          "Quotation request submitted successfully! Our sales desk will contact you shortly.",
      );
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit quote request. Please try again.");
    },
  });
}

export function useAdminQuotes() {
  return useQuery({
    queryKey: ["admin-quotes"],
    queryFn: getAdminQuotes,
  });
}

export function useUpdateQuoteStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateQuoteStatus,
    onSuccess: (data) => {
      toast.success(data.message || "Quote status updated");
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update quote status");
    },
  });
}

export function useMyQuotes() {
  return useQuery({
    queryKey: ["my-quotes"],
    queryFn: getMyQuotes,
  });
}