import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SubCategoryForm } from "@/components/admin/SubCategoryForm";
import { useSubCategory, useUpdateSubCategory } from "@/hooks/useCategory";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subcategories/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Sub-category — Admin" }] }),
  component: EditSubCategoryPage,
});

function EditSubCategoryPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: sub, isLoading } = useSubCategory(id);
  const update = useUpdateSubCategory();

  return (
    <AdminLayout
      title="Edit Sub-category"
      subtitle={sub?.name}
      actions={
        <button
          onClick={() => navigate({ to: "/admin/subcategories" })}
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
      ) : !sub ? (
        <div className="text-sm text-muted-foreground">Sub-category not found.</div>
      ) : (
        <SubCategoryForm
          initial={sub}
          submitLabel="Save Changes"
          submitting={update.isPending}
          onCancel={() => navigate({ to: "/admin/subcategories" })}
          onSubmit={async (fd) => {
            try {
              await update.mutateAsync({ id, data: fd });
              toast.success("Sub-category updated");
              navigate({ to: "/admin/subcategories" });
            } catch (e) {
              toast.error((e as Error).message || "Failed to update");
            }
          }}
        />
      )}
    </AdminLayout>
  );
}
