import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CreditCard, Truck, Building2, CheckCircle2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useCart, cartTotals, cartStore } from "@/lib/cart-store";
import { formatUSD } from "@/lib/format";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — FerroCore" }] }),
  component: Checkout,
});

function Checkout() {
  const items = useCart();
  const totals = cartTotals(items);
  const navigate = useNavigate();
  const [shipping, setShipping] = useState("standard");
  const [payment, setPayment] = useState("card");

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link to="/products" className="mt-6 inline-block text-primary hover:underline">Browse catalog</Link>
        </div>
      </SiteLayout>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    sessionStorage.setItem("lastOrder", JSON.stringify({
      orderNumber,
      items,
      total: totals.total,
      date: new Date().toISOString(),
    }));
    cartStore.clear();
    navigate({ to: "/order-confirmation", search: { id: orderNumber } });
  }

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/cart" className="hover:text-primary">Cart</Link>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Checkout</h1>
        </div>
      </section>

      <form onSubmit={submit} className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <Panel icon={Building2} title="01 · Customer Information">
            <Grid>
              <Field label="Company name" placeholder="Acme Manufacturing Ltd." />
              <Field label="Tax / VAT number" placeholder="US 12-3456789" />
              <Field label="Contact name" placeholder="Jane Doe" />
              <Field label="Job title" placeholder="Procurement Manager" />
              <Field label="Email" placeholder="procurement@acme.com" />
              <Field label="Phone" placeholder="+1 555 000 0000" />
            </Grid>
          </Panel>

          <Panel icon={Truck} title="02 · Shipping Address">
            <Grid>
              <Field label="Address line 1" placeholder="1247 Industrial Pkwy" full />
              <Field label="Address line 2" placeholder="Building C, Loading Dock 4" full />
              <Field label="City" placeholder="Houston" />
              <Field label="State / Region" placeholder="Texas" />
              <Field label="Postal code" placeholder="77041" />
              <Field label="Country" placeholder="United States" />
            </Grid>
          </Panel>

          <Panel icon={Building2} title="03 · Billing Address">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked className="accent-primary" />
              Same as shipping address
            </label>
          </Panel>

          <Panel icon={Truck} title="04 · Shipping Method">
            <div className="space-y-3">
              {[
                { id: "standard", label: "Standard Freight", desc: "7–10 business days · LTL carrier", price: 1240 },
                { id: "express", label: "Expedited Freight", desc: "3–5 business days · Priority dispatch", price: 2680 },
                { id: "intl", label: "International Ocean", desc: "FOB / CIF available · 4–6 weeks", price: 4800 },
              ].map((s) => (
                <label key={s.id} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${shipping === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <input type="radio" name="shipping" value={s.id} checked={shipping === s.id} onChange={() => setShipping(s.id)} className="accent-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{s.label}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                  <div className="text-sm font-bold">{formatUSD(s.price)}</div>
                </label>
              ))}
            </div>
          </Panel>

          <Panel icon={CreditCard} title="05 · Payment Method">
            <div className="space-y-3">
              {[
                { id: "card", label: "Corporate Credit Card", desc: "Visa, Mastercard, Amex · Instant authorization" },
                { id: "wire", label: "Bank Wire (T/T)", desc: "Net-15 terms · For approved accounts" },
                { id: "lc", label: "Letter of Credit", desc: "International orders · 30 days processing" },
                { id: "net30", label: "Net-30 Purchase Order", desc: "For qualified business accounts" },
              ].map((p) => (
                <label key={p.id} className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${payment === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <input type="radio" name="payment" value={p.id} checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-primary" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{p.label}</div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {payment === "card" && (
              <div className="mt-5 grid gap-3 border-t border-border pt-5 md:grid-cols-2">
                <Field label="Card number" placeholder="4242 4242 4242 4242" full />
                <Field label="Expiry" placeholder="MM / YY" />
                <Field label="CVC" placeholder="123" />
              </div>
            )}
          </Panel>
        </div>

        <aside className="border border-border bg-card p-6 lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Order Summary</h2>
          <ul className="mt-5 max-h-72 space-y-3 overflow-auto pr-1 text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product.id} className="flex justify-between gap-3">
                <div className="min-w-0">
                  <div className="line-clamp-1 font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{product.code} · ×{quantity}</div>
                </div>
                <div className="shrink-0 font-semibold">{formatUSD(product.price * quantity)}</div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="font-semibold">{formatUSD(totals.subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="font-semibold">{formatUSD(totals.shipping)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd className="font-semibold">{formatUSD(totals.tax)}</dd></div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-bold">{formatUSD(totals.total)}</span>
          </div>
          <button type="submit" className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90">
            <CheckCircle2 className="h-4 w-4" /> Place Order
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">By placing this order you agree to FerroCore's Terms of Sale.</p>
        </aside>
      </form>
    </SiteLayout>
  );
}

function Panel({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <section className="border border-border bg-card">
      <header className="flex items-center gap-3 border-b border-border bg-surface px-5 py-3">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">{title}</h3>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-2">{children}</div>;
}

function Field({ label, placeholder, full = false }: { label: string; placeholder: string; full?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 text-xs ${full ? "md:col-span-2" : ""}`}>
      <span className="font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input placeholder={placeholder} className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
    </label>
  );
}
