import { useMutation } from "@tanstack/react-query";
import { createQuoteRequest, CreateQuotePayload } from "@/lib/api/quote";
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
