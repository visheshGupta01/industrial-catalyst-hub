import { createFileRoute } from "@tanstack/react-router";
import { Download, Eye } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "./admin.index";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/useAdminOrders";
import { formatINR } from "@/lib/format";
import { useNavigate } from "@tanstack/react-router";
export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders — Admin" }] }),
  component: OrdersAdmin,
});

function OrdersAdmin() {

  const { data: orders = [], isLoading } = useAdminOrders();
  const navigate = useNavigate();

  const updateStatus = useUpdateOrderStatus();

  if (isLoading) {
    return <AdminLayout title="Orders">Loading...</AdminLayout>;
  }
  return (
    <AdminLayout
      title="Orders"
      subtitle={`${orders.length} orders in the last 30 days`}
      actions={
        <button className="inline-flex items-center gap-1.5 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      }
    >
      <div className="mb-5 grid gap-3 md:grid-cols-4">
        {[
          {
            label: "Pending",
            value: orders.filter((o) => o.orderStatus === "Pending").length,
            color: "text-muted-foreground",
          },
          {
            label: "Processing",
            value: orders.filter((o) => o.orderStatus === "Processing").length,
            color: "text-primary",
          },
          {
            label: "Shipped",
            value: orders.filter((o) => o.orderStatus === "Shipped").length,
            color: "text-accent",
          },
          {
            label: "Delivered",
            value: orders.filter((o) => o.orderStatus === "Delivered").length,
            color: "text-emerald-600",
          },
        ].map((c) => (
          <div key={c.label} className="border border-border bg-card p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {c.label}
            </div>
            <div className={`mt-2 text-2xl font-bold ${c.color}`}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <input
            placeholder="Search by order ID or customer…"
            className="flex-1 min-w-[200px] border border-input bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <select className="border border-input bg-surface px-3 py-2 text-sm">
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
          </select>
          <select className="border border-input bg-surface px-3 py-2 text-sm">
            <option>Last 30 days</option>
            <option>This quarter</option>
            <option>This year</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-semibold">Order ID</th>
                <th className="px-5 py-3 text-left font-semibold">Customer</th>
                <th className="px-5 py-3 text-left font-semibold">Date</th>
                <th className="px-5 py-3 text-left font-semibold">Amount</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-5 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-5 py-3 font-semibold">
                    {typeof o.user === "string" ? "-" : o.user.name}
                  </td>{" "}
                  <td className="px-5 py-3 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>{" "}
                  <td className="px-5 py-3 font-semibold">{formatINR(o.totalAmount)}</td>{" "}
                  <td className="px-5 py-3">
                    <select
                      value={o.orderStatus}
                      onChange={(e) =>
                        updateStatus.mutate({
                          id: o._id,
                          status: e.target.value as
                            | "Pending"
                            | "Processing"
                            | "Shipped"
                            | "Delivered"
                            | "Cancelled",
                        })
                      }
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>{" "}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end">
                      <button
                        onClick={() =>
                          navigate({
                            to: "/admin/orders/$id",
                            params: { id: o._id },
                          })
                        }
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
