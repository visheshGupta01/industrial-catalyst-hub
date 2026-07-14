import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useCategories, useDeleteCategory } from "@/hooks/useCategory";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories/")({
  head: () => ({ meta: [{ title: "Categories — Admin" }] }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const navigate = useNavigate();
  const { data: categories = [], isLoading } = useCategories();
  const del = useDeleteCategory();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      await del.mutateAsync(id);
      toast.success("Category deleted");
    } catch (e) {
      toast.error((e as Error).message || "Failed to delete");
    }
  };

  return (
    <AdminLayout
      title="Categories"
      subtitle="Manage top-level product categories"
      actions={
        <button
          onClick={() => navigate({ to: "/admin/categories/create" })}
          className="inline-flex items-center gap-1.5 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> New Category
        </button>
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : categories.length === 0 ? (
        <div className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          No categories yet. Create your first one.
        </div>
      ) : (
        <div className="border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-surface text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    {c.image?.url ? (
                      <img
                        src={c.image.url}
                        alt=""
                        className="h-10 w-10 border border-border object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 border border-dashed border-border" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        c.isActive
                          ? "bg-emerald-500/10 text-emerald-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {c.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link
                        to="/admin/categories/$id/edit"
                        params={{ id: c._id }}
                        className="inline-flex items-center gap-1 border border-border px-2 py-1 text-xs hover:border-primary"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(c._id, c.name)}
                        className="inline-flex items-center gap-1 border border-border px-2 py-1 text-xs hover:border-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
