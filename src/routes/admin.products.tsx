import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Filter, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "./admin.index";
import { products } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/admin/products")({
  head: () => ({ meta: [{ title: "Products — Admin" }] }),
  component: ProductsAdmin,
});

function ProductsAdmin() {
  return (
    <AdminLayout
      title="Products"
      subtitle={`${products.length} active SKUs in catalog`}
      actions={
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button className="inline-flex items-center gap-1.5 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
            <Plus className="h-3.5 w-3.5" /> Add Product
          </button>
        </div>
      }
    >
      <div className="border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <input placeholder="Search SKU or name…" className="flex-1 min-w-[200px] border border-input bg-surface px-3 py-2 text-sm focus:border-primary focus:outline-none" />
          <select className="border border-input bg-surface px-3 py-2 text-sm">
            <option>All Categories</option><option>Machinery</option><option>Electrical</option><option>Automation</option>
          </select>
          <select className="border border-input bg-surface px-3 py-2 text-sm">
            <option>All Statuses</option><option>In Stock</option><option>Low Stock</option><option>Out of Stock</option>
          </select>
          <button className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-semibold"><input type="checkbox" className="accent-primary" /></th>
                <th className="px-5 py-3 text-left font-semibold">Product</th>
                <th className="px-5 py-3 text-left font-semibold">Category</th>
                <th className="px-5 py-3 text-left font-semibold">Price</th>
                <th className="px-5 py-3 text-left font-semibold">Stock</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-5 py-4"><input type="checkbox" className="accent-primary" /></td>
                  <td className="px-5 py-4">
                    <div className="font-semibold">{p.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{p.code}</div>
                  </td>
                  <td className="px-5 py-4">{p.category}</td>
                  <td className="px-5 py-4 font-semibold">{formatUSD(p.price)}</td>
                  <td className="px-5 py-4">{p.stock}</td>
                  <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
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
        <div className="flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground">
          <span>Showing 1–{products.length} of {products.length}</span>
          <div className="flex gap-1">
            <button className="border border-border px-3 py-1.5 hover:border-primary">Previous</button>
            <button className="border border-primary bg-primary px-3 py-1.5 text-primary-foreground">1</button>
            <button className="border border-border px-3 py-1.5 hover:border-primary">2</button>
            <button className="border border-border px-3 py-1.5 hover:border-primary">Next</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
