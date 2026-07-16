import { useNavigate } from "@tanstack/react-router";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useVerifyPayment, usePaymentStatus } from "@/hooks/usePayment";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/order-verification")({
  component: PaymentVerifying,
});

export const PAYMENT_STATUS = {
  Pending: "Pending",
  Verifying: "Verifying",
  Paid: "Paid",
  Failed: "Failed",
} as const;

function PaymentVerifying() {
  const navigate = useNavigate();

  const verifyPayment = useVerifyPayment();

  const hasStarted = useRef(false);

  const [pollingEnabled, setPollingEnabled] = useState(false);

  const [timedOut, setTimedOut] = useState(false);

  const pending = useMemo(() => {
    const value = sessionStorage.getItem("pendingPayment");
    return value ? JSON.parse(value) : null;
  }, []);
  const { data: status } = usePaymentStatus(pending?.orderId, pollingEnabled);

  useEffect(() => {
    if (!pending) {
      navigate({
        to: "/cart",
        replace: true,
      });

      return;
    }

    if (hasStarted.current) return;

    hasStarted.current = true;

    async function verify() {
      if (!pending) return;
      await new Promise((resolve) => setTimeout(resolve, 500));
      try {
        await verifyPayment.mutateAsync({
          razorpay_order_id: pending.razorpayOrderId,
          razorpay_payment_id: pending.razorpayPaymentId,
          razorpay_signature: pending.razorpaySignature,
        });

        sessionStorage.removeItem("pendingPayment");

        navigate({
          to: "/order-confirmation",
          search: {
            id: pending.orderId,
          },
          replace: true,
        });
      } catch (err) {
        console.error(err);

        setPollingEnabled(true);
      }
    }

    verify();
  }, [navigate, pending, verifyPayment]);

  useEffect(() => {
    if (!pollingEnabled) return;

    const timeout = setTimeout(() => {
      setTimedOut(true);
    }, 60000);

    return () => clearTimeout(timeout);
  }, [pollingEnabled]);

  useEffect(() => {
    if (!status) return;

    switch (status.status) {
      case PAYMENT_STATUS.Paid:
        setPollingEnabled(false);
        sessionStorage.removeItem("pendingPayment");

        navigate({
          to: "/order-confirmation",
          search: {
            id: pending.orderId,
          },
          replace: true,
        });

        break;

      case PAYMENT_STATUS.Failed:
        setPollingEnabled(false);
        sessionStorage.removeItem("pendingPayment");

        toast.error(status.failureReason ?? "Payment failed");

        navigate({
          to: "/order-failed",
          replace: true,
        });

        break;
    }
  }, [status, navigate, pending]);

  return (
    <SiteLayout>
      <div className="container-page flex min-h-[70vh] items-center justify-center">
        <div className="max-w-md text-center">
          {!timedOut ? (
            <>
              <Loader2 className="mx-auto h-14 w-14 animate-spin text-primary" />

              <h1 className="mt-6 text-3xl font-bold">Verifying Payment</h1>

              <p className="mt-4 text-muted-foreground">
                Please don't close this page. We're confirming your payment securely.
              </p>
            </>
          ) : (
            <>
              <XCircle className="mx-auto h-14 w-14 text-yellow-500" />

              <h1 className="mt-6 text-3xl font-bold">Still Verifying</h1>

              <p className="mt-4 text-muted-foreground">
                Your payment may already be successful. Verification is taking longer than expected.
              </p>

              <button
                className="mt-8 rounded bg-primary px-6 py-3 text-primary-foreground"
                onClick={() => {
                  sessionStorage.removeItem("pendingPayment");
                  navigate({
                    to: "/orders",
                  });
                }}
              >
                Go to My Orders
              </button>
            </>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
