import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2, Minus, Plus, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductImage } from "@/components/site/ProductImage";
import { useCart, cartStore, cartTotals } from "@/lib/cart-store";
import { formatUSD } from "@/lib/format";
import { useState } from "react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — FerroCore" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart();
  const totals = cartTotals(items);
  const [coupon, setCoupon] = useState("");

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10">
          <h1 className="text-3xl font-bold md:text-4xl">Shopping Cart</h1>
          <p className="mt-1 text-sm text-muted-foreground">{totals.count} item{totals.count === 1 ? "" : "s"} in cart</p>
        </div>
      </section>

      <section className="container-page py-10">
        {items.length === 0 ? (
          <div className="border border-dashed border-border bg-surface p-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">Browse the catalog to add industrial products.</p>
            <Link to="/products" className="mt-6 inline-flex bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="border border-border bg-card">
              <div className="grid grid-cols-[1fr_120px_160px_40px] items-center gap-4 border-b border-border bg-surface px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground max-md:hidden">
                <span>Product</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Total</span>
                <span />
              </div>
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="grid items-center gap-4 border-b border-border px-5 py-5 md:grid-cols-[1fr_120px_160px_40px]">
                  <div className="flex items-center gap-4">
                    <Link to="/products/$id" params={{ id: product.id }} className="shrink-0">
                      <ProductImage image={product.image} className="h-20 w-20" />
                    </Link>
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.code}</div>
                      <Link to="/products/$id" params={{ id: product.id }} className="block text-sm font-semibold hover:text-primary">
                        {product.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{formatUSD(product.price)} / unit</div>
                    </div>
                  </div>
                  <div className="inline-flex items-stretch justify-self-center border border-border">
                    <button onClick={() => cartStore.setQty(product.id, quantity - 1)} className="px-2.5 hover:bg-surface" aria-label="Decrease"><Minus className="h-3 w-3" /></button>
                    <span className="grid min-w-10 place-items-center border-x border-border px-2 text-sm font-semibold">{quantity}</span>
                    <button onClick={() => cartStore.setQty(product.id, quantity + 1)} className="px-2.5 hover:bg-surface" aria-label="Increase"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="text-right text-base font-bold md:text-lg">{formatUSD(product.price * quantity)}</div>
                  <button onClick={() => cartStore.remove(product.id)} className="justify-self-end text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="flex flex-wrap items-center gap-3 p-5">
                <div className="relative flex-1 min-w-[200px]">
                  <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full border border-input bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                  />
                </div>
                <button className="border border-primary px-4 py-2 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">Apply</button>
                <Link to="/products" className="ml-auto text-sm font-semibold text-primary hover:underline">Continue shopping</Link>
              </div>
            </div>

            <aside className="border border-border bg-card p-6 lg:sticky lg:top-28 lg:self-start">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold">{formatUSD(totals.subtotal)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Shipping & freight</dt><dd className="font-semibold">{formatUSD(totals.shipping)}</dd></div>
                <div className="flex justify-between"><dt className="text-muted-foreground">Estimated tax</dt><dd className="font-semibold">{formatUSD(totals.tax)}</dd></div>
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5">
                <span className="text-sm font-semibold uppercase tracking-wider">Total</span>
                <span className="text-2xl font-bold">{formatUSD(totals.total)}</span>
              </div>
              <Link to="/checkout" className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
                Proceed to checkout <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">Secure procurement · ISO certified suppliers</p>
            </aside>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
