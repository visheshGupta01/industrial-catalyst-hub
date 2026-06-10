import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "./admin.index";
import { coupons } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/coupons")({
  head: () => ({ meta: [{ title: "Coupons — Admin" }] }),
  component: CouponsAdmin,
});

function CouponsAdmin() {
  return (
    <AdminLayout
      title="Coupons"
      subtitle="Discount codes and account-level promotions"
      actions={
        <button className="inline-flex items-center gap-1.5 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
          <Plus className="h-3.5 w-3.5" /> Create Coupon
        </button>
      }
    >
      <div className="border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-semibold">Coupon Code</th>
                <th className="px-5 py-3 text-left font-semibold">Discount</th>
                <th className="px-5 py-3 text-left font-semibold">Expiry Date</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.code} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-5 py-4"><span className="border border-dashed border-border bg-surface px-2 py-1 font-mono text-xs font-bold">{c.code}</span></td>
                  <td className="px-5 py-4 font-semibold">{c.discount}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.expiry}</td>
                  <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button className="border border-border p-1.5 hover:border-primary hover:text-primary" aria-label="Edit"><Pencil className="h-3.5 w-3.5" /></button>
                      <button className="border border-border p-1.5 hover:border-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
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
