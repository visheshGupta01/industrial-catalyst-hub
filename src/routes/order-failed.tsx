import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { XCircle, RotateCcw, ShoppingCart, Home, Package, Headphones } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/order-failed")({
  component: PaymentFailed,
});

function PaymentFailed() {
  const navigate = useNavigate();

  const failureReason =
    sessionStorage.getItem("paymentFailureReason") ?? "Your payment could not be completed.";

  return (
    <SiteLayout>
      <div className="container-page flex min-h-[75vh] items-center justify-center py-12">
        <div className="w-full max-w-2xl border border-border bg-card p-8">
          <div className="flex flex-col items-center text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>

            <h1 className="mt-6 text-3xl font-bold">Payment Failed</h1>

            <p className="mt-3 max-w-lg text-muted-foreground">
              We couldn't complete your payment. No worries—you haven't been charged successfully,
              or your payment is still being verified.
            </p>

            <div className="mt-8 w-full rounded border border-border bg-surface p-4 text-left">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reason
              </div>

              <div className="mt-2 text-sm">{failureReason}</div>
            </div>

            <div className="mt-8 grid w-full gap-3 md:grid-cols-2">
              <button
                onClick={() => navigate({ to: "/checkout" })}
                className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90"
              >
                <RotateCcw className="h-4 w-4" />
                Retry Payment
              </button>

              <Link
                to="/cart"
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
              >
                <ShoppingCart className="h-4 w-4" />
                Back to Cart
              </Link>

              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
              >
                <Package className="h-4 w-4" />
                My Orders
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-3 font-semibold hover:border-primary hover:text-primary"
              >
                <Headphones className="h-4 w-4" />
                Contact Support
              </Link>
            </div>

            <Link
              to="/"
              className="mt-8 inline-flex items-center gap-2 text-primary hover:underline"
            >
              <Home className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
