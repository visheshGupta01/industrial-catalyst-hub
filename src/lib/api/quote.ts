// Update in src/lib/api/quote.ts

import { apiFetch } from "./client";

export interface CreateQuotePayload {
  productId: string;
  fullName: string;
  phone: string;
  email: string;
  companyName?: string;
  requirementType: "standard" | "bulk";
  notes: string;
}

export const createQuoteRequest = async (payload: CreateQuotePayload) => {
  const data = await apiFetch<{ success: boolean; message: string }>("/quote/", {
    method: "POST",
    body: payload,
  });
  return data;
};
