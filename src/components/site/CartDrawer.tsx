import { Link } from "@tanstack/react-router";
import { X, ShoppingCart, Check, ArrowRight, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { ProductImage } from "./ProductImage";
import { formatINR, formatUSD } from "@/lib/format";
import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { useUpdateCart, useRemoveFromCart, useCartSummary } from "@/hooks/useCart";
import { useCartDrawer } from "@/lib/store/cartDrawer";
import { toast } from "sonner";

export function CartDrawer() {
  const { open, closeDrawer } = useCartDrawer();
  const { data: cart } = useCart();

  const items = cart?.items ?? [];
  const totals = useCartSummary();
  const updateCart = useUpdateCart();

  const removeFromCart = useRemoveFromCart();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeDrawer]);

  return (
    <>
      <div
        onClick={() => closeDrawer()}
        className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <header className="flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">
              Your Cart ({totals.count})
            </h2>
          </div>
          <button
            onClick={() => closeDrawer()}
            className="p-1 hover:bg-background"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-base font-semibold">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse the catalog to add products.
              </p>
              <Link
                to="/products"
                onClick={() => closeDrawer()}
                className="mt-6 inline-flex bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map(({ product, quantity }) => (
                <li
                  key={product._id}
                  className="flex gap-3 p-5 transition-colors duration-200 hover:bg-surface"
                >
                  <Link
                    to="/products/$id"
                    params={{ id: product._id }}
                    onClick={() => closeDrawer()}
                    className="shrink-0"
                  >
                    <ProductImage image={product.images?.[0]?.url} className="h-16 w-16" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      {product.sku}
                    </div>
                    <Link
                      to="/products/$id"
                      params={{ id: product._id }}
                      onClick={() => closeDrawer()}
                      className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-stretch border border-border text-xs">
                        <button
                          onClick={() =>
                            updateCart.mutate(
                              {
                                productId: product._id,
                                quantity: quantity - 1,
                              },
                              {
                                onError: () => {
                                  toast.error("Couldn't update cart");
                                },
                              },
                            )
                          }
                          disabled={updateCart.isPending || quantity >= product.stock}
                          className="px-2 hover:bg-surface"
                          aria-label="Decrease"
                        >
                          {updateCart.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Minus className="h-3 w-3" />
                          )}{" "}
                        </button>
                        <span className="grid min-w-8 place-items-center border-x border-border px-1.5 font-semibold">
                          {quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateCart.mutate(
                              {
                                productId: product._id,
                                quantity: quantity + 1,
                              },
                              {
                                onError: () => {
                                  toast.error("Couldn't update cart");
                                },
                              },
                            )
                          }
                          disabled={updateCart.isPending}
                          className="px-2 hover:bg-surface"
                          aria-label="Increase"
                        >
                          {updateCart.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Plus className="h-3 w-3" />
                          )}{" "}
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">
                          {formatINR((product.discountPrice ?? product.price) * quantity)}{" "}
                        </div>
                        <button
                          onClick={() => removeFromCart.mutate(product._id)}
                          disabled={removeFromCart.isPending}
                          className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
                        >
                          {removeFromCart.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}{" "}
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border bg-surface p-5">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatINR(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>Shipping & tax calculated at checkout</dt>
              </div>
            </dl>
            <div className="mt-4 grid gap-2">
              <Link
                to="/checkout"
                onClick={() => closeDrawer()}
                className="interactive-sheen inline-flex w-full items-center justify-center gap-2 bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-wider text-accent-foreground hover:-translate-y-0.5 hover:bg-accent/90"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/cart"
                onClick={() => closeDrawer()}
                className="inline-flex w-full items-center justify-center border border-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View Cart
              </Link>
              <button
                onClick={() => closeDrawer()}
                className="inline-flex w-full items-center justify-center px-5 py-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Continue Shopping
              </button>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}
