import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductImage } from "@/components/site/ProductImage";
import { formatINR } from "@/lib/format";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCart, useCartSummary, useUpdateCart, useRemoveFromCart } from "@/hooks/useCart";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — FerroCore" }] }),
  component: CartPage,
});

function CartPage() {
  // FIX 1: Destructure 'data' as 'user' and extract 'isLoading' from the query hook object
  const { data: user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { data: cart } = useCart();

  const items = cart?.items ?? [];
  const totals = useCartSummary();
  const updateCart = useUpdateCart();
  const removeFromCart = useRemoveFromCart();
  const total = totals.subtotal;

  // FIX 2: Correct route redirection authorization wrapper checks
  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return null;
  if (!user) return null;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10">
          <h1 className="text-3xl font-bold md:text-4xl">Shopping Cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totals.count} item{totals.count === 1 ? "" : "s"} in cart
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {items.length === 0 ? (
          <div className="border border-dashed border-border bg-surface p-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse the catalog to add industrial products.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-8">
              <div className="border border-border bg-card">
                <div className="grid grid-cols-[1fr_120px_160px_40px] items-center gap-4 border-b border-border bg-surface px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground max-md:hidden">
                  <span>Product</span>
                  <span className="text-center">Qty</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>
                {items.map(({ product, quantity }) => (
                  <div
                    key={product._id}
                    className="grid items-center gap-4 border-b border-border px-5 py-5 md:grid-cols-[1fr_120px_160px_40px]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* FIX 3: Dynamic multi-segment link mappings corrected */}
                      <Link to={`/products/${product._id}`} className="shrink-0">
                        <ProductImage image={product.images?.[0]?.url} className="h-20 w-20" />
                      </Link>
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                          {product.sku}
                        </div>
                        <Link
                          to={`/products/${product._id}`}
                          className="block text-sm font-semibold hover:text-primary truncate"
                        >
                          {product.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {formatINR(product.discountPrice ?? product.price)} / unit
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-wider">
                          <button
                            onClick={() => removeFromCart.mutate(product._id)}
                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="inline-flex items-stretch justify-self-center border border-border bg-background">
                      <button
                        onClick={() => {
                          // FIX 4: If quantity drops to 1, pressing minus safely triggers product deletion
                          if (quantity <= 1) {
                            removeFromCart.mutate(product._id);
                          } else {
                            updateCart.mutate({ productId: product._id, quantity: quantity - 1 });
                          }
                        }}
                        className="px-2.5 hover:bg-surface transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="grid min-w-10 place-items-center border-x border-border px-2 text-sm font-semibold">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCart.mutate({
                            productId: product._id,
                            quantity: quantity + 1,
                          })
                        }
                        className="px-2.5 hover:bg-surface transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-right text-base font-bold md:text-lg">
                      {formatINR((product.discountPrice ?? product.price) * quantity)}
                    </div>
                    <button
                      onClick={() => removeFromCart.mutate(product._id)}
                      className="hidden justify-self-end text-muted-foreground hover:text-destructive md:block transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <aside className="border border-border bg-card p-6 lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Order Summary
              </h2>
              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
                <span className="text-sm font-semibold uppercase tracking-wider">Subtotal</span>
                <span className="text-2xl font-bold">{formatINR(total)}</span>
              </div>

              <Link
                to="/checkout"
                disabled={items.length === 0}
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider transition-all ${
                  items.length === 0
                    ? "pointer-events-none bg-muted text-muted-foreground opacity-50"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
