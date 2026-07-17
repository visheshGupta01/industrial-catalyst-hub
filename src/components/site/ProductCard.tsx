import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart, FileText, Layers } from "lucide-react";
import { formatINR } from "@/lib/format";
import { ProductImage } from "./ProductImage";
import { toast } from "sonner";
import { Product } from "@/types";
import { useAddToCart } from "@/hooks/useCart";
import { useCartDrawer } from "@/lib/store/cartDrawer";
import { useAuth } from "@/hooks/useAuth";

export function ProductCard({ product }: { product: Product }) {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const { openDrawer } = useCartDrawer();

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please sign in to continue");
      navigate({ to: "/auth" });
      return;
    }

    addToCart.mutate({
      productId: product._id,
      quantity: 1,
    });

    openDrawer();
  };

  const specs = Object.entries(product.specifications || {}).slice(0, 2);
  const status =
    product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? "Low Stock" : "In Stock";

  return (
    <article className="group flex flex-col border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:premium-shadow">
      <Link to="/products/$id" params={{ id: product._id }} className="block">
        <ProductImage image={product.images?.[0]?.url} alt={product.name} className="aspect-4/3" />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{product?.category?.name}</span>
          <span className="font-mono text-[10px]">{product.sku ?? "N/A"}</span>
        </div>

        <Link to="/products/$id" params={{ id: product._id }} className="mt-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3 text-xs">
          {specs.map(([key, value]) => (
            <div key={key}>
              <dt className="text-muted-foreground">{key}</dt>
              <dd className="truncate font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-end justify-between">
          <div>
            {product.discountPrice ? (
              <>
                <div className="text-lg font-bold text-primary">
                  {formatINR(product.discountPrice)}
                </div>
                <div className="text-sm text-muted-foreground line-through">
                  {formatINR(product.price)}
                </div>
              </>
            ) : (
              <div className="text-xl font-bold">{formatINR(product.price)}</div>
            )}
          </div>
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider ${
              status === "In Stock"
                ? "text-emerald-700"
                : status === "Low Stock"
                  ? "text-accent"
                  : "text-destructive"
            }`}
          >
            {status}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* DYNAMIC ACTION BUTTONS ACTION GRID */}
        {/* ========================================================================= */}
        <div className="mt-4 grid grid-cols-1 gap-2">
          {/* Main Action Layer: Dictated dynamically by nested isShippable flags */}
          {product.shipping?.isShippable ? (
            <button
              disabled={status === "Out of Stock" || addToCart.isPending}
              onClick={handleAddToCart}
              className="interactive-sheen inline-flex w-full items-center justify-center gap-1.5 bg-primary py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-all"
            >
              <ShoppingCart className="h-3 w-3" />
              {user ? (addToCart.isPending ? "Adding..." : "Add to cart") : "Sign in to buy"}
            </button>
          ) : (
            <Link
              to="/products/$id"
              params={{ id: product._id }}
              search={{ openQuote: "standard" }} // Pass search state token to open dialog
              className="inline-flex w-full items-center justify-center gap-1.5 bg-blue-600 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-blue-700 transition-all"
            >
              <FileText className="h-3 w-3" /> Request Quote
            </Link>
          )}

          {/* Secondary Sub-Panel Layout Row (Split Grid) */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/products/$id"
              params={{ id: product._id }}
              className="inline-flex items-center justify-center gap-1.5 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary transition-all"
            >
              View <ArrowRight className="h-3 w-3" />
            </Link>

            {/* Unified B2B Bulk RFQ Traversal Link Button */}
            <Link
              to="/products/$id"
              params={{ id: product._id }}
              search={{ openQuote: "bulk" }} // Pass search state token to open dialog
              className="inline-flex items-center justify-center gap-1.5 border border-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Layers className="h-3 w-3" /> Bulk RFQ
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
