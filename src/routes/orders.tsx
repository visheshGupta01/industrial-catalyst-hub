import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  Loader2,
  Package,
  ArrowRight,
  ExternalLink,
  Calendar,
  CreditCard,
  Truck,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatINR } from "@/lib/format";
import { useAuth } from "@/hooks/useAuth";
import { useMyOrders } from "@/hooks/useOrders";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "My Purchase History — FerroCore" }] }),
  component: CustomerOrdersPage,
});

function CustomerOrdersPage() {
  const { data: user, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading, isError } = useMyOrders();
  const navigate = useNavigate();

  // Route protection guardrail
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading || ordersLoading) {
    return (
      <SiteLayout>
        <div className="container-page flex items-center justify-center gap-2 py-32 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Loading your order history...
        </div>
      </SiteLayout>
    );
  }

  if (!user) return null;

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">My Orders</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Order History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your recent industrial procurement records and trace parcel logistics.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        {isError && (
          <div className="text-center py-10 text-sm text-destructive">
            Failed to parse your orders. Please reload the page.
          </div>
        )}

        {!isError && (!orders || orders.length === 0) ? (
          <div className="border border-dashed border-border bg-surface p-16 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <h2 className="mt-4 text-xl font-bold">No orders found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You haven't placed any industrial orders yet.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders?.map((order: any) => {
              const isPaid = order.payment?.status === "Paid";

              return (
                <div
                  key={order._id}
                  className="border border-border bg-card transition-all hover:border-border-hover"
                >
                  {/* Order Top Panel Header */}
                  <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-5 py-4 text-xs">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                      <div>
                        <span className="text-muted-foreground block font-medium uppercase tracking-wider">
                          Order Placed
                        </span>
                        <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium uppercase tracking-wider">
                          Order Ref
                        </span>
                        <span className="font-mono font-bold text-foreground mt-0.5 block">
                          {order.orderNumber}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block font-medium uppercase tracking-wider">
                          Total Value
                        </span>
                        <span className="font-bold text-primary text-sm mt-0.5 block">
                          {formatINR(order.pricing?.total)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Payment Status Token */}
                      <span
                        className={`px-2 py-1 font-semibold uppercase tracking-wider text-[10px] border ${
                          isPaid
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                            : "bg-amber-50 border-amber-200 text-amber-700"
                        }`}
                      >
                        {order.payment?.status || "Pending"}
                      </span>

                      {/* Logistic Tracking Status Token */}
                      {order.shipping?.status && (
                        <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 font-semibold uppercase tracking-wider text-[10px]">
                          {order.shipping.status}
                        </span>
                      )}
                    </div>
                  </header>

                  {/* Order Items Body Content */}
                  <div className="p-5 divide-y divide-border/60">
                    {order.items?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-start justify-between gap-4 py-4 first:pt-0 last:pb-0 text-sm"
                      >
                        <div className="flex items-start gap-4 min-w-0">
                          <div className="min-w-0">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                              {item.sku}
                            </div>
                            <Link
                              to={`/products/${item.product}`}
                              className="font-semibold text-foreground hover:text-primary transition-colors block mt-0.5 line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <div className="text-xs text-muted-foreground mt-1">
                              Quantity:{" "}
                              <span className="font-semibold text-foreground">
                                ×{item.quantity}
                              </span>{" "}
                              · {formatINR(item.price)} / unit
                            </div>
                          </div>
                        </div>

                        <div className="text-right font-semibold">
                          {formatINR(item.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Action Footer Pane */}
                  <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-surface/40 px-5 py-3 text-xs">
                    <div className="text-muted-foreground flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3.5 w-3.5" />
                        Via{" "}
                        {order.payment?.provider === "razorpay"
                          ? "Online Gateway"
                          : "Standard Channel"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        Ship to:{" "}
                        <span className="font-medium text-foreground">
                          {order.shippingAddress?.city} ({order.shippingAddress?.pincode})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Only link to tracking view if an active carrier tracking URL exists */}
                      {order.shipping?.trackingUrl && (
                        <a
                          href={order.shipping.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 border border-border bg-background px-3 py-2 font-semibold uppercase tracking-wider text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          Track Shipment <ExternalLink className="h-3 w-3" />
                        </a>
                      )}

                      <Link
                        to={`/order-tracking`}
                        search={{ orderId: order._id }}
                        className="inline-flex items-center gap-1 bg-primary px-3 py-2 font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Details <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </footer>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
