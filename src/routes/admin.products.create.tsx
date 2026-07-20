import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useCreateProduct } from "@/hooks/useAdminProducts";

export const Route = createFileRoute("/admin/products/create")({
  head: () => ({ meta: [{ title: "Create Product — Admin" }] }),
  component: CreateProductPage,
});

function CreateProductPage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const handleCreate = async (formData: FormData) => {
    try {
      await createProduct.mutateAsync(formData);
      navigate({ to: "/admin/products" });
    } catch (err) {
      // Errors handled in hook toast notification
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Industrial Asset</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Register new equipment SKUs, define freight parcel dimensions, and upload image assets.
          </p>
        </div>

        <ProductForm
          onSubmit={handleCreate}
          isPending={createProduct.isPending}
          submitLabel="Save & Publish SKU"
        />
      </div>
    </AdminLayout>
  );
}