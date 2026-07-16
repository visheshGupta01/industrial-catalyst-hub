import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Truck, FileText, ArrowRight, Package, MapPin, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CheckoutStepper, CHECKOUT_STEPS } from "@/components/site/CheckoutStepper";
import { formatINR } from "@/lib/format";
import { z } from "zod";
import { useOrder } from "@/hooks/useOrders";

export const Route = createFileRoute("/order-confirmation")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({ meta: [{ title: "Order Confirmation — FerroCore" }] }),
  component: Confirmation,
});

function Confirmation() {
  const { id } = Route.useSearch();
  const { data: order, isLoading, isError } = useOrder(id);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container-page flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p className="text-sm">Loading your order…</p>
        </div>
      </SiteLayout>
    );
  }

  if (isError || !order) {
    return (
      <SiteLayout>
        <div className="container-page flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="text-sm text-muted-foreground">
            We couldn't find that order. Double-check the link or contact support.
          </p>
          <Link
            to="/products"
            className="mt-2 inline-flex items-center gap-2 border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const eta = order.shipping?.estimatedDelivery;

  return (
    <SiteLayout>
      <div className="container-page pt-8">
        <CheckoutStepper steps={CHECKOUT_STEPS} current={5} />
      </div>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-16">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-16 w-16 place-items-center bg-primary text-primary-foreground">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="eyebrow mt-6">Confirmed</div>
            <h1 className="mt-2 text-3xl font-bold md:text-4xl">
              Thank you — your order has been received.
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              A confirmation email with full documentation has been sent to your procurement
              contact. Our account team will reach out within 24 hours to confirm freight and
              commissioning details.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-y border-border py-5 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Order Number
                </div>
                <div className="font-mono text-base font-bold">{order.orderNumber}</div>
              </div>
              {eta && (
                <>
                  <div className="hidden h-8 w-px bg-border md:block" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Estimated Delivery
                    </div>
                    <div className="text-base font-bold">
                      {eta} {Number(eta) === 1 ? "day" : "days"}
                    </div>
                  </div>
                </>
              )}
              <div className="hidden h-8 w-px bg-border md:block" />
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Order Total
                </div>
                <div className="text-base font-bold">{formatINR(order.pricing.total)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="border border-border bg-card">
          <header className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3">
            <Package className="h-4 w-4 text-primary" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">
              Purchased Products
            </h2>
          </header>
          {order.items.length > 0 ? (
            <ul>
              {order.items.map((item) => (
                <li
                  key={item._id}
                  className="flex items-center gap-4 border-b border-border px-5 py-4 last:border-0"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-14 w-14 shrink-0 rounded-sm border border-border object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.sku}
                    </div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-muted-foreground">Quantity · {item.quantity}</div>
                  </div>
                  <div className="font-bold">{formatINR(item.price * item.quantity)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Order details unavailable.
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" /> Logistics
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Shipping via {order.shipping?.courier ?? "our logistics partner"}. Tracking and bill
              of lading will be issued upon carrier pickup.
            </p>
          </div>
          <div className="border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <FileText className="h-4 w-4 text-primary" /> Documentation
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Material certificates, CE declarations, and the commercial invoice are attached to
              your confirmation email.
            </p>
            <button className="mt-4 inline-flex w-full items-center justify-center border border-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
              Download invoice (PDF)
            </button>
          </div>
          <Link
            to="/order-tracking"
            search={{ id: order.orderNumber }}
            className="inline-flex w-full items-center justify-center gap-2 bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90"
          >
            <MapPin className="h-4 w-4" /> Track Order
          </Link>
          <Link
            to="/products"
            className="inline-flex w-full items-center justify-center gap-2 border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
          >
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </section>
    </SiteLayout>
  );
}
