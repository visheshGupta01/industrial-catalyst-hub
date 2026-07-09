import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useCreateProduct } from "@/hooks/useAdminProducts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/create")({
  head: () => ({ meta: [{ title: "Create Product — Admin" }] }),
  component: CreateProductPage,
});

function CreateProductPage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  return (
    <AdminLayout
      title="Create Product"
      subtitle="Add a new SKU to the catalog"
      actions={
        <button
          onClick={() => navigate({ to: "/admin/products" })}
          className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      }
    >
      <ProductForm
        submitLabel="Create Product"
        submitting={createProduct.isPending}
        onCancel={() => navigate({ to: "/admin/products" })}
        onSubmit={async (fd) => {
          try {
            await createProduct.mutateAsync(fd);
            toast.success("Product created");
            navigate({ to: "/admin/products" });
          } catch (e) {
            toast.error((e as Error).message || "Failed to create product");
          }
        }}
      />
    </AdminLayout>
  );
}
