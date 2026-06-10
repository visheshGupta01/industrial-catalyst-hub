import { createFileRoute } from "@tanstack/react-router";
import { Mail, Eye, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { customers } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/admin/customers")({
  head: () => ({ meta: [{ title: "Customers — Admin" }] }),
  component: CustomersAdmin,
});

function CustomersAdmin() {
  return (
    <AdminLayout
      title="Customers"
      subtitle={`${customers.length} business accounts`}
      actions={
        <button className="inline-flex items-center gap-1.5 border border-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      }
    >
      <div className="border border-border bg-card">
        <div className="border-b border-border p-4">
          <input placeholder="Search customer or email…" className="w-full max-w-md border border-input bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-semibold">Customer</th>
                <th className="px-5 py-3 text-left font-semibold">Email</th>
                <th className="px-5 py-3 text-right font-semibold">Orders</th>
                <th className="px-5 py-3 text-right font-semibold">Total Spending</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.email} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {c.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                      </div>
                      <div className="font-semibold">{c.name}</div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c.email}</td>
                  <td className="px-5 py-4 text-right font-semibold">{c.orders}</td>
                  <td className="px-5 py-4 text-right font-bold">{formatUSD(c.spending)}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button className="border border-border p-1.5 hover:border-primary hover:text-primary" aria-label="Email"><Mail className="h-3.5 w-3.5" /></button>
                      <button className="border border-border p-1.5 hover:border-primary hover:text-primary" aria-label="View"><Eye className="h-3.5 w-3.5" /></button>
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
