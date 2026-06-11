import { Link } from "@tanstack/react-router";
import { X, ShoppingCart, Check, ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useCart, useCartDrawer, cartStore, cartTotals } from "@/lib/cart-store";
import { ProductImage } from "./ProductImage";
import { formatUSD } from "@/lib/format";
import { useEffect } from "react";

export function CartDrawer() {
  const open = useCartDrawer();
  const items = useCart();
  const totals = cartTotals(items);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && cartStore.closeDrawer();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div
        onClick={() => cartStore.closeDrawer()}
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
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em]">Your Cart ({totals.count})</h2>
          </div>
          <button onClick={() => cartStore.closeDrawer()} className="p-1 hover:bg-background" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </header>

        {items.length > 0 && (
          <div className="flex items-center gap-2 border-b border-border bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-800 animate-fade-in">
            <Check className="h-4 w-4" />
            Item successfully added to cart
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <ShoppingCart className="h-10 w-10 text-muted-foreground" />
              <h3 className="mt-4 text-base font-semibold">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">Browse the catalog to add products.</p>
              <Link
                to="/products"
                onClick={() => cartStore.closeDrawer()}
                className="mt-6 inline-flex bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Browse Catalog
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-3 p-5">
                  <Link to="/products/$id" params={{ id: product.id }} onClick={() => cartStore.closeDrawer()} className="shrink-0">
                    <ProductImage image={product.image} className="h-16 w-16" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{product.code}</div>
                    <Link
                      to="/products/$id"
                      params={{ id: product.id }}
                      onClick={() => cartStore.closeDrawer()}
                      className="line-clamp-2 text-sm font-semibold hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-stretch border border-border text-xs">
                        <button onClick={() => cartStore.setQty(product.id, quantity - 1)} className="px-2 hover:bg-surface" aria-label="Decrease">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="grid min-w-8 place-items-center border-x border-border px-1.5 font-semibold">{quantity}</span>
                        <button onClick={() => cartStore.setQty(product.id, quantity + 1)} className="px-2 hover:bg-surface" aria-label="Increase">
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatUSD(product.price * quantity)}</div>
                        <button
                          onClick={() => cartStore.remove(product.id)}
                          className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
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
                <dd className="font-semibold">{formatUSD(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>Shipping & tax calculated at checkout</dt>
              </div>
            </dl>
            <div className="mt-4 grid gap-2">
              <Link
                to="/checkout"
                onClick={() => cartStore.closeDrawer()}
                className="inline-flex w-full items-center justify-center gap-2 bg-accent px-5 py-3 text-xs font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/cart"
                onClick={() => cartStore.closeDrawer()}
                className="inline-flex w-full items-center justify-center border border-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
              >
                View Cart
              </Link>
              <button
                onClick={() => cartStore.closeDrawer()}
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
