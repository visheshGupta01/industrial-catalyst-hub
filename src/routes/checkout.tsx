import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CreditCard, Truck, Building2, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CheckoutStepper, CHECKOUT_STEPS } from "@/components/site/CheckoutStepper";
import { formatINR } from "@/lib/format";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCart, useCartSummary } from "@/hooks/useCart";
import { useCreatePaymentOrder, useVerifyPayment } from "@/hooks/usePayment";
import { loadRazorpay } from "@/lib/loadRazorpay";
export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — FerroCore" }] }),
  component: Checkout,
});

// Map stepper index: 0 Cart, 1 Information, 2 Shipping, 3 Payment, 4 Review, 5 Confirmation
function Checkout() {
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();
  const { data: cart } = useCart();

  const items = cart?.items ?? [];

  const totals = useCartSummary();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // start at Information
  const [payment, setPayment] = useState("razorpay");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const placing = createOrder.isPending || verifyPayment.isPending;
  const { data: user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingPayment");

    if (pending) {
      navigate({
        to: "/order-verification",
        replace: true,
      });
    }
  }, []);

  if (isLoading) return null;

  if (!user) return null;

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <h1 className="text-2xl font-bold">Your cart is empty</h1>
          <Link to="/products" className="mt-6 inline-block text-primary hover:underline">
            Browse catalog
          </Link>
        </div>
      </SiteLayout>
    );
  }

  async function placeOrderAction() {
    try {
      if (
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.pincode
      ) {
        toast.error("Please complete the shipping address.");
        return;
      }
      if (!/^\d{10}$/.test(shippingAddress.phone)) {
        toast.error("Enter a valid phone number");
        return;
      }

      const loaded = await loadRazorpay();

      if (!loaded) {
        toast.error("Failed to load Razorpay");
        return;
      }

      // 1. Create Razorpay order + pending order in DB
      const { payment, order } = await createOrder.mutateAsync(shippingAddress);

      const razorpay = new window.Razorpay({
        key: payment.key,
        amount: payment.amount,
        currency: payment.currency,
        order_id: payment.orderId,
        prefill: {
          name: shippingAddress.fullName,
          email: user.email,
          contact: shippingAddress.phone,
        },
        theme: {
          color: "#2563eb",
        },
        name: "FerroCore",

        handler: async (response) => {
          sessionStorage.setItem(
            "pendingPayment",
            JSON.stringify({
              orderId: order._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          );

          navigate({
            to: "/order-verification",
          });
        },
        modal: {
          ondismiss() {
            toast.info("Payment cancelled");
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        toast.error(response.error.description);
      });

      razorpay.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment verification failed");
    }
  }

  function next() {
    if (step === 1) {
      if (
        !shippingAddress.fullName ||
        !shippingAddress.phone ||
        !shippingAddress.address ||
        !shippingAddress.city ||
        !shippingAddress.state ||
        !shippingAddress.pincode
      ) {
        toast.error("Complete shipping information");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/cart" className="hover:text-primary">
              Cart
            </Link>
            <span>/</span>
            <span className="text-foreground">Checkout</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Checkout</h1>
        </div>
      </section>

      <div className="container-page pt-8">
        <CheckoutStepper steps={CHECKOUT_STEPS} current={step} />
      </div>

      <div className="container-page grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-6">
          {step === 1 && (
            <>
              <Panel icon={Building2} title="Customer Information">
                <Grid>
                  <Field
                    label="Full Name"
                    placeholder="John Doe"
                    value={shippingAddress.fullName}
                    onChange={(value) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        fullName: value,
                      }))
                    }
                  />

                  <Field
                    label="Phone"
                    placeholder="9876543210"
                    value={shippingAddress.phone}
                    onChange={(value) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        phone: value,
                      }))
                    }
                  />

                  <Field label="Email" value={user.email} placeholder={user.email} readOnly full />
                </Grid>
              </Panel>
              <Panel icon={Truck} title="Shipping Address">
                <Grid>
                  <Field
                    label="Address line 1"
                    placeholder="1247 Industrial Pkwy"
                    full
                    value={shippingAddress.address}
                    onChange={(value) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        address: value,
                      }))
                    }
                  />
                  <Field
                    label="City"
                    placeholder="Houston"
                    value={shippingAddress.city}
                    onChange={(value) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        city: value,
                      }))
                    }
                  />{" "}
                  <Field
                    label="State / Region"
                    placeholder="Texas"
                    value={shippingAddress.state}
                    onChange={(value) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        state: value,
                      }))
                    }
                  />{" "}
                  <Field
                    label="Postal / ZIP code"
                    placeholder="77041"
                    value={shippingAddress.pincode}
                    onChange={(value) =>
                      setShippingAddress((prev) => ({
                        ...prev,
                        pincode: value,
                      }))
                    }
                  />{" "}
                </Grid>
              </Panel>
            </>
          )}

          {step === 3 && (
            <Panel icon={CreditCard} title="Payment Method">
              <div className="space-y-3">
                {[
                  {
                    id: "razorpay",
                    label: "Pay Online",
                    desc: "Pay online",
                  },
                  // {
                  //   id: "cod",
                  //   label: "Cash on delivery",
                  //   desc: "cod",
                  // },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`flex cursor-pointer items-center gap-4 border p-4 transition-colors ${payment === p.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={p.id}
                      checked={payment === p.id}
                      onChange={() => setPayment(p.id)}
                      className="accent-primary"
                    />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Panel>
          )}

          {step === 4 && (
            <Panel icon={CheckCircle2} title="Review & Confirm">
              <div className="space-y-4 text-sm">
                <ReviewRow
                  label="Items"
                  value={`${totals.count} product${totals.count === 1 ? "" : "s"} (${formatINR(totals.subtotal)})`}
                />
                <ReviewRow
                  label="Payment method"
                  value={
                    payment === "card"
                      ? "Corporate Credit Card"
                      : payment === "wire"
                        ? "Bank Wire (T/T)"
                        : payment === "lc"
                          ? "Letter of Credit"
                          : "Net-30 PO"
                  }
                />
                <ReviewRow label="Order total" value={formatINR(totals.total)} highlight />
              </div>
              <label className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-primary" />I agree to
                FerroCore's Terms of Sale, including freight Incoterms and warranty terms.
              </label>
            </Panel>
          )}
          {/* Nav buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {step > 1 ? (
              <button
                onClick={prev}
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
            ) : (
              <Link
                to="/cart"
                className="inline-flex items-center gap-2 border border-border px-5 py-3 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Back to cart
              </Link>
            )}
            {step < 4 ? (
              <button
                onClick={next}
                className="ml-auto inline-flex items-center gap-2 bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={placeOrderAction}
                disabled={placing}
                className="ml-auto inline-flex items-center gap-2 bg-accent px-6 py-3 text-xs font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90 disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" /> {placing ? "Placing…" : "Place Order"}
              </button>
            )}
          </div>
        </div>

        <aside className="border border-border bg-card p-6 lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Order Summary
          </h2>
          <ul className="mt-5 max-h-72 space-y-3 overflow-auto pr-1 text-sm">
            {items.map(({ product, quantity }) => (
              <li key={product._id} className="flex justify-between gap-3">
                <div className="min-w-0">
                  <div className="line-clamp-1 font-medium">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.sku} · ×{quantity}
                  </div>
                </div>
                <div className="shrink-0 font-semibold">
                  {formatINR((product.discountPrice ?? product.price) * quantity)}
                </div>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{formatINR(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="font-semibold">{formatINR(totals.shipping)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Tax</dt>
              <dd className="font-semibold">{formatINR(totals.tax)}</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-bold">{formatINR(totals.total)}</span>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            By placing this order you agree to FerroCore's Terms of Sale.
          </p>
        </aside>
      </div>
    </SiteLayout>
  );
}

function Panel({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
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

function Field({
  label,
  placeholder,
  value,
  onChange,
  full = false,
  readOnly = false,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  full?: boolean;
  readOnly?: boolean;
}) {
  return (
    <label className={`flex flex-col gap-1.5 text-xs ${full ? "md:col-span-2" : ""}`}>
      <span className="font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>

      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}

function ReviewRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={highlight ? "text-lg font-bold text-primary" : "font-semibold"}>
        {value}
      </span>
    </div>
  );
}
