import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { useCategory, useUpdateCategory } from "@/hooks/useCategory";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Category — Admin" }] }),
  component: EditCategoryPage,
});

function EditCategoryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: category, isLoading } = useCategory(id);
  const update = useUpdateCategory();

  return (
    <AdminLayout
      title="Edit Category"
      subtitle={category?.name}
      actions={
        <button
          onClick={() => navigate({ to: "/admin/categories" })}
          className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : !category ? (
        <div className="text-sm text-muted-foreground">Category not found.</div>
      ) : (
        <CategoryForm
          initial={category}
          submitLabel="Save Changes"
          submitting={update.isPending}
          onCancel={() => navigate({ to: "/admin/categories" })}
          onSubmit={async (fd) => {
            try {
              await update.mutateAsync({ id, data: fd });
              toast.success("Category updated");
              navigate({ to: "/admin/categories" });
            } catch (e) {
              toast.error((e as Error).message || "Failed to update");
            }
          }}
        />
      )}
    </AdminLayout>
  );
}
