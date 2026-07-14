import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SubCategoryForm } from "@/components/admin/SubCategoryForm";
import { useCreateSubCategory } from "@/hooks/useCategory";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/subcategories/create")({
  head: () => ({ meta: [{ title: "Create Sub-category — Admin" }] }),
  component: CreateSubCategoryPage,
});

function CreateSubCategoryPage() {
  const navigate = useNavigate();
  const create = useCreateSubCategory();

  return (
    <AdminLayout
      title="Create Sub-category"
      subtitle="Add a new sub-category under a parent"
      actions={
        <button
          onClick={() => navigate({ to: "/admin/subcategories" })}
          className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      }
    >
      <SubCategoryForm
        submitLabel="Create Sub-category"
        submitting={create.isPending}
        onCancel={() => navigate({ to: "/admin/subcategories" })}
        onSubmit={async (fd) => {
          try {
            await create.mutateAsync(fd);
            toast.success("Sub-category created");
            navigate({ to: "/admin/subcategories" });
          } catch (e) {
            toast.error((e as Error).message || "Failed to create");
          }
        }}
      />
    </AdminLayout>
  );
}
