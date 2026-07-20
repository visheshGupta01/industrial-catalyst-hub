import { apiFetch } from "./client";

export interface TrackingResponse {
  success: boolean;
  tracking: {
    tracking_data?: {
      shipment_track?: Array<{
        id: number;
        awb_code: string;
        current_status: string;
        pickup_date: string | null;
        delivered_date: string | null;
        courier_name: string;
      }>;
      shipment_track_activities?: Array<{
        date: string;
        status: string;
        activity: string;
        location: string;
      }>;
    };
  };
}

export async function calculateShipment(pincode: string) {
  // Extract data cleanly out of the client utility engine wrapper
  const data = await apiFetch<{ success: boolean; message?: string; shipping: any }>(
    "/shipment/calculate-shipment",
    {
      method: "POST",
      body: { pincode },
    },
  );

  console.log(data);

  return data.shipping;
}

export async function trackOrderShipment(orderId: string) {
  const data = await apiFetch<TrackingResponse>(`/shipment/${orderId}/track`, {
    method: "GET",
  });
  return data.tracking;
}

/**
 * Admin action: Creates a shipment entry in Shiprocket and assigns an AWB
 */
export async function createAdminShipment(orderId: string) {
  const { data } = await apiFetch<{ success: boolean; message: string; shipment: any }>(
    `/shipment/${orderId}/create`,
    {
      method: "POST",
    },
  );
  return data;
}

/**
 * Admin action: Schedules carrier pickup for a created shipment
 */
export async function requestAdminPickup(orderId: string) {
  const { data } = await apiFetch<{ success: boolean; message: string; pickup: any }>(
    `/shipment/${orderId}/pickup`,
    {
      method: "POST",
    },
  );
  return data;
}
