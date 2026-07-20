import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Truck,
  PackageCheck,
  ExternalLink,
  Loader2,
  Calendar,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatINR } from "@/lib/format";
import { useAdminOrders } from "@/hooks/useAdminOrders";
import { useCreateShipment, useRequestPickup } from "@/hooks/useShipment";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Admin Order Logistics — FerroCore" }] }),
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const { data: orders, isLoading, isError } = useAdminOrders();
  const createShipment = useCreateShipment();
  const requestPickup = useRequestPickup();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading orders and logistics manifests...
        </div>
      </AdminLayout>
    );
  }

  if (isError) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-destructive">
          Failed to load administrative order list. Please refresh the page.
        </div>
      </AdminLayout>
    );
  }

  const filteredOrders = (orders ?? []).filter((o: any) => {
    const matchesSearch =
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.shippingAddress?.pincode?.includes(search);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "paid" && o.payment?.status === "Paid") ||
      (filterStatus === "unshipped" && !o.shipping?.shipmentId) ||
      (filterStatus === "shipped" && o.shipping?.shipmentId);

    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Fulfillment & Logistics</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Dispatch paid orders to Shiprocket, generate courier AWBs, and schedule carrier pickups.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-card p-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by Order #, Email, or PIN Code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-input bg-background py-2 pl-9 pr-3 text-xs focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            {["all", "paid", "unshipped", "shipped"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  filterStatus === st
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background hover:bg-surface"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table */}
        <div className="border border-border bg-card overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-surface text-[10px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Order Ref</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Shipping PIN</th>
                <th className="px-4 py-3">AWB / Courier</th>
                <th className="px-4 py-3 text-right">Logistics Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No order records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order: any) => {
                  const isPaid = order.payment?.status === "Paid";
                  const hasShipment = !!order.shipping?.shipmentId;
                  const hasAwb = !!order.shipping?.awbCode;

                  return (
                    <tr key={order._id} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{order.user?.name || "Customer"}</div>
                        <div className="text-[10px] text-muted-foreground">{order.user?.email}</div>
                      </td>
                      <td className="px-4 py-3 font-bold text-primary">
                        {formatINR(order.pricing?.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 font-bold uppercase tracking-wider text-[9px] border ${
                            isPaid
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                              : "bg-amber-50 border-amber-200 text-amber-700"
                          }`}
                        >
                          {order.payment?.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {order.shippingAddress?.city}, {order.shippingAddress?.pincode}
                      </td>
                      <td className="px-4 py-3">
                        {hasAwb ? (
                          <div>
                            <span className="font-mono font-bold text-foreground block">
                              {order.shipping.awbCode}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {order.shipping.courierName || "Carrier Assigned"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">
                            Unassigned
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* 1. If Paid & No Shipment Created -> Push to Shiprocket */}
                          {isPaid && !hasShipment && (
                            <button
                              disabled={createShipment.isPending}
                              onClick={() => createShipment.mutate(order._id)}
                              className="inline-flex items-center gap-1 bg-primary px-3 py-1.5 font-semibold uppercase tracking-wider text-primary-foreground text-[10px] hover:bg-primary/90 disabled:opacity-50"
                            >
                              {createShipment.isPending && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                              <Truck className="h-3 w-3" /> Push to Shiprocket
                            </button>
                          )}

                          {/* 2. If Shipment Exists -> Request Pickup */}
                          {hasShipment && (
                            <button
                              disabled={requestPickup.isPending}
                              onClick={() => requestPickup.mutate(order._id)}
                              className="inline-flex items-center gap-1 border border-primary text-primary px-3 py-1.5 font-semibold uppercase tracking-wider text-[10px] hover:bg-primary hover:text-primary-foreground disabled:opacity-50"
                            >
                              {requestPickup.isPending && (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              )}
                              <PackageCheck className="h-3 w-3" /> Schedule Pickup
                            </button>
                          )}

                          {/* 3. External Tracking Link */}
                          {order.shipping?.trackingUrl && (
                            <a
                              href={order.shipping.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-muted-foreground hover:text-primary transition-colors border border-border"
                              title="Open Carrier Tracker"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
