import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";
import { cartStore } from "@/lib/cart-store";
import { ProductImage } from "./ProductImage";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const inStock = product.status !== "Out of Stock";
  const user = useAuth();
  const navigate = useNavigate();
  const addToCart = () => {
    if (!user) {
      toast.info("Sign in to add products to your cart");
      navigate({ to: "/auth" });
      return;
    }
    cartStore.add(product);
  };
  return (
    <article className="group flex flex-col border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:premium-shadow">

      <Link to="/products/$id" params={{ id: product.id }} className="block">
        <ProductImage image={product.image} className="aspect-[4/3]" />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground">
          <span>{product.category}</span>
          <span className="font-mono text-[10px]">{product.code}</span>
        </div>
        <Link to="/products/$id" params={{ id: product.id }} className="mt-2">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.shortDescription}</p>

        <dl className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-border pt-3 text-xs">
          {product.specs.slice(0, 2).map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="text-muted-foreground">{s.label}</dt>
              <dd className="truncate font-medium text-foreground">{s.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Price</div>
            <div className="text-xl font-bold text-foreground">{formatUSD(product.price)}</div>
          </div>
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${
            product.status === "In Stock" ? "text-emerald-700" :
            product.status === "Low Stock" ? "text-accent" : "text-destructive"
          }`}>
            {product.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <Link to="/products/$id" params={{ id: product.id }} className="inline-flex items-center justify-center gap-1.5 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary">
            Details <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            disabled={!inStock}
            onClick={addToCart}
            className="interactive-sheen inline-flex items-center justify-center gap-1.5 bg-primary px-3 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:-translate-y-0.5 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
          >
            <ShoppingCart className="h-3 w-3" /> {user ? "Add" : "Sign in"}
          </button>
        </div>
      </div>
    </article>
  );
}
