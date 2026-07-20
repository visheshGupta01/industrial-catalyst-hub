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

export const getAdminQuotes = async () => {
  const data = await apiFetch<{ success: boolean; quotes: QuoteItem[] }>("/quote/", {
    method: "GET",
  });
  return data.quotes;
};

export const updateQuoteStatus = async ({
  id,
  status,
  adminNotes,
}: {
  id: string;
  status: string;
  adminNotes?: string;
}) => {
  const data = await apiFetch<{ success: boolean; message: string }>(`/quote/${id}/status`,{
    method: "PATCH",
    body: { status, adminNotes },
  } as any);
  return data;
};
