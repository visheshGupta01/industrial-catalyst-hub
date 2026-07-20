import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProduct } from "@/hooks/useProducts";
import { useUpdateProduct } from "@/hooks/useAdminProducts";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/products/$id/edit")({
  head: ({ params }) => ({ meta: [{ title: `Edit Product ${params.id} — Admin` }] }),
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { data: product, isLoading, isError } = useProduct(id);
  const updateProduct = useUpdateProduct();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading product record...
        </div>
      </AdminLayout>
    );
  }

  if (isError || !product) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-destructive">
          Failed to fetch product record. Please refresh.
        </div>
      </AdminLayout>
    );
  }

  const handleUpdate = async (formData: FormData) => {
    try {
      await updateProduct.mutateAsync({ id, formData });
      navigate({ to: "/admin/products" });
    } catch (err) {
      // Errors handled in hook toast notification
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit SKU: {product.sku}</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Modify product parameters, update logistics dimensions, or alter inventory counts.
          </p>
        </div>

        <ProductForm
          initialData={product}
          onSubmit={handleUpdate}
          isPending={updateProduct.isPending}
          submitLabel="Update Product"
        />
      </div>
    </AdminLayout>
  );
}
