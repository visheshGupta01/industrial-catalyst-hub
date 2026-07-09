import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProduct } from "@/hooks/useProducts";
import { useUpdateProduct } from "@/hooks/useAdminProducts";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products/$id/edit")({
  head: () => ({ meta: [{ title: "Edit Product — Admin" }] }),
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useProduct(id);
  const updateProduct = useUpdateProduct();

  return (
    <AdminLayout
      title="Edit Product"
      subtitle={product?.name ?? "Update product details"}
      actions={
        <button
          onClick={() => navigate({ to: "/admin/products" })}
          className="inline-flex items-center gap-1.5 border border-border bg-card px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading product…
        </div>
      ) : error || !product ? (
        <div className="border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
          Failed to load product.
        </div>
      ) : (
        <ProductForm
          initial={product}
          submitLabel="Save Changes"
          submitting={updateProduct.isPending}
          onCancel={() => navigate({ to: "/admin/products" })}
          onSubmit={async (fd) => {
            try {
              await updateProduct.mutateAsync({ id, data: fd });
              toast.success("Product updated");
              navigate({ to: "/admin/products" });
            } catch (e) {
              toast.error((e as Error).message || "Failed to update product");
            }
          }}
        />
      )}
    </AdminLayout>
  );
}
