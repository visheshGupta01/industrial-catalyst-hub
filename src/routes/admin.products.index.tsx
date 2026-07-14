import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Trash2, Filter, Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatusBadge } from "./admin.index";
import { formatINR, formatUSD } from "@/lib/format";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useDeleteProduct } from "@/hooks/useAdminProducts";
import { useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({ meta: [{ title: "Products — Admin" }] }),
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const [filters, setFilters] = useState({
    keyword: "",
    page: 1,
    limit: 10,
    sort: "newest",
    category: "",
  });
  const { data = [] } = useProducts(filters);
  const { data: productFilters } = useProductFilters();
  const deleteProduct = useDeleteProduct();
  const navigate = useNavigate();

  const products = data?.products ?? [];
  const pagination = data?.pagination;
  return (
    <AdminLayout
      title="Products"
      subtitle={`${products.length} active SKUs in catalog`}
      actions={
        <div className="flex flex-wrap gap-2">
          <button className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <Link
            className="inline-flex items-center gap-1.5 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            to="/admin/products/create"
          >
            <Plus className="h-3.5 w-3.5" /> Add Product
          </Link>
        </div>
      }
    >
      <div className="border border-border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
          <input
            value={filters.keyword}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                keyword: e.target.value,
                page: 1,
              }))
            }
            placeholder="Search SKU or name…"
          />
          <select
            value={filters.category}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                category: e.target.value,
                page: 1,
              }))
            }
          >
            <option value="">All Categories</option>

            {productFilters?.global.categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => {
              const value = e.target.value;

              setFilters((prev) => ({
                ...prev,
                inStock: value === "all" ? undefined : value === "stock",
                page: 1,
              }));
            }}
          >
            <option value="all">All</option>
            <option value="stock">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
          <button className="inline-flex items-center gap-1.5 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary">
            <Filter className="h-3.5 w-3.5" /> Filters
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 text-left font-semibold">
                  <input type="checkbox" className="accent-primary" />
                </th>
                <th className="px-5 py-3 text-left font-semibold">Product</th>
                <th className="px-5 py-3 text-left font-semibold">Category</th>
                <th className="px-5 py-3 text-left font-semibold">Price</th>
                <th className="px-5 py-3 text-left font-semibold">Stock</th>
                <th className="px-5 py-3 text-left font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-border last:border-0 hover:bg-surface"
                >
                  <td className="px-5 py-4">
                    <input type="checkbox" className="accent-primary" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="font-semibold">{product.name}</div>
                    <div className="font-mono text-[11px] text-muted-foreground">{product.sku}</div>
                  </td>
                  <td className="px-5 py-4">{product.category.name}</td>
                  <td className="px-5 py-4 font-semibold">
                    {formatINR(product.discountPrice ?? product.price)}
                  </td>
                  <td className="px-5 py-4">{product.stock}</td>
                  <td className="px-5 py-4">
                    <StatusBadge
                      status={
                        product.stock === 0
                          ? "Out of Stock"
                          : product.stock <= 5
                            ? "Low Stock"
                            : "In Stock"
                      }
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        className="border border-border p-1.5 hover:border-primary hover:text-primary"
                        aria-label="Edit"
                        onClick={() =>
                          navigate({ to: "/admin/products/$id/edit", params: { id: product._id } })
                        }
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        className="border border-border p-1.5 hover:border-destructive hover:text-destructive"
                        aria-label="Delete"
                        onClick={() => {
                          if (confirm("Delete product?")) {
                            deleteProduct.mutate(product._id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-border p-4 text-xs text-muted-foreground">
          <span>
            Showing
            {(filters.page - 1) * filters.limit + 1}-
            {Math.min(filters.page * filters.limit, pagination?.totalProducts ?? 0)}
            of
            {pagination?.totalProducts}{" "}
          </span>
          <div className="flex gap-1">
            <button
              className="border border-border px-3 py-1.5 hover:border-primary"
              disabled={!pagination?.hasPreviousPage}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
            >
              Previous
            </button>
            <button className="border border-primary bg-primary px-3 py-1.5 text-primary-foreground">
              1
            </button>
            <button className="border border-border px-3 py-1.5 hover:border-primary">2</button>
            <button
              className="border border-border px-3 py-1.5 hover:border-primary"
              disabled={!pagination?.hasNextPage}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
