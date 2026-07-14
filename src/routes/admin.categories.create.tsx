import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { useCreateCategory } from "@/hooks/useCategory";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories/create")({
  head: () => ({ meta: [{ title: "Create Category — Admin" }] }),
  component: CreateCategoryPage,
});

function CreateCategoryPage() {
  const navigate = useNavigate();
  const create = useCreateCategory();

  return (
    <AdminLayout
      title="Create Category"
      subtitle="Add a new top-level category"
      actions={
        <button
          onClick={() => navigate({ to: "/admin/categories" })}
          className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      }
    >
      <CategoryForm
        submitLabel="Create Category"
        submitting={create.isPending}
        onCancel={() => navigate({ to: "/admin/categories" })}
        onSubmit={async (fd) => {
          try {
            await create.mutateAsync(fd);
            toast.success("Category created");
            navigate({ to: "/admin/categories" });
          } catch (e) {
            toast.error((e as Error).message || "Failed to create category");
          }
        }}
      />
    </AdminLayout>
  );
}
