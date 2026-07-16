import { apiFetch } from "./client";

export async function calculateShipment(pincode: string) {
  // Extract data cleanly out of the client utility engine wrapper
  const data = await apiFetch<{ success: boolean; message?: string; shipping: any }>(
    "/shipment/calculate-shipment",
    {
      method: "POST",
      body: { pincode },
    },
  );

  console.log(data)

  return data.shipping;
}
