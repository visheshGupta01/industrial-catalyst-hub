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
import { useCalculateShipment } from "@/hooks/useShipment";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — FerroCore" }] }),
  component: Checkout,
});

interface FormErrors {
  fullName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

function Checkout() {
  const createOrder = useCreatePaymentOrder();
  const verifyPayment = useVerifyPayment();
  const calculateShipment = useCalculateShipment();
  const { data: cart } = useCart();
  const items = cart?.items ?? [];
  const totals = useCartSummary();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("razorpay");
  const [liveShippingCost, setLiveShippingCost] = useState<number | null>(null);

  // State tracking explicit error visual markers
  const [errors, setErrors] = useState<FormErrors>({});

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
      navigate({ to: "/order-verification", replace: true });
    }
  }, []);

  // Live Pincode Verification & Error Removal Hook
  useEffect(() => {
    if (/^\d{6}$/.test(shippingAddress.pincode)) {
      setErrors((prev) => ({ ...prev, pincode: undefined }));
      async function autoFetchRates() {
        try {
          toast.loading("Calculating live shipping fees...", { id: "ship-calc" });
          const rateDetails = await calculateShipment.mutateAsync(shippingAddress.pincode);

          if (rateDetails && typeof rateDetails.shippingCost === "number") {
            setLiveShippingCost(rateDetails.shippingCost);
            toast.success(`Shipping computed via ${rateDetails.courier || "Courier"}!`, {
              id: "ship-calc",
            });
          } else {
            throw new Error("Invalid response structure");
          }
        } catch (error: any) {
          setLiveShippingCost(null);
          setErrors((prev) => ({
            ...prev,
            pincode: error.message || "Pincode is not serviceable by our couriers",
          }));
          toast.error(error.message || "Pincode is not serviceable by our couriers", {
            id: "ship-calc",
          });
        }
      }
      autoFetchRates();
    } else {
      if (liveShippingCost !== null) {
        setLiveShippingCost(null);
      }
    }
  }, [shippingAddress.pincode]);

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

  // Centralized Validation Engine Validator
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};

    if (!shippingAddress.fullName.trim()) tempErrors.fullName = "Full name is required";

    if (!shippingAddress.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(shippingAddress.phone.trim())) {
      tempErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!shippingAddress.address.trim()) tempErrors.address = "Shipping address line 1 is required";
    if (!shippingAddress.city.trim()) tempErrors.city = "City is required";
    if (!shippingAddress.state.trim()) tempErrors.state = "State / Region is required";

    if (!shippingAddress.pincode.trim()) {
      tempErrors.pincode = "Postal ZIP code is required";
    } else if (!/^\d{6}$/.test(shippingAddress.pincode.trim())) {
      tempErrors.pincode = "Enter a valid 6-digit PIN code";
    } else if (liveShippingCost === null) {
      tempErrors.pincode = "This region is currently unserviceable by our couriers";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  async function placeOrderAction() {
    try {
      if (!validateForm()) {
        toast.error("Please resolve address validation errors before placing your order.");
        return;
      }

      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Failed to load Razorpay script");
        return;
      }

      const { payment: paymentConfig, order } = await createOrder.mutateAsync(shippingAddress);

      const razorpay = new window.Razorpay({
        key: paymentConfig.key,
        amount: paymentConfig.amount,
        currency: paymentConfig.currency,
        order_id: paymentConfig.orderId,
        prefill: {
          name: shippingAddress.fullName,
          email: user.email,
          contact: shippingAddress.phone,
        },
        theme: { color: "#2563eb" },
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
          navigate({ to: "/order-verification" });
        },
        modal: {
          ondismiss() {
            toast.info("Payment cancelled");
          },
        },
      });

      razorpay.on("payment.failed", (response: any) => {
        toast.error(response.error.description);
      });
      razorpay.open();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment verification failed");
    }
  }

  async function next() {
    if (step === 1) {
      if (!validateForm()) {
        toast.error("Please fix all form validation requirements to continue.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prev() {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const finalActiveShippingCost = liveShippingCost !== null ? liveShippingCost : 0;
  const computedGrandTotal = totals.subtotal + finalActiveShippingCost;

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
                    error={errors.fullName}
                    onChange={(value) => {
                      setShippingAddress((p) => ({ ...p, fullName: value }));
                      if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
                    }}
                  />
                  <Field
                    label="Phone"
                    placeholder="9876543210"
                    value={shippingAddress.phone}
                    error={errors.phone}
                    onChange={(value) => {
                      // Only permit numerical digits up to 10 characters
                      if (/^\d*$/.test(value) && value.length <= 10) {
                        setShippingAddress((p) => ({ ...p, phone: value }));
                        if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                      }
                    }}
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
                    error={errors.address}
                    onChange={(value) => {
                      setShippingAddress((p) => ({ ...p, address: value }));
                      if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
                    }}
                  />
                  <Field
                    label="City"
                    placeholder="Houston"
                    value={shippingAddress.city}
                    error={errors.city}
                    onChange={(value) => {
                      setShippingAddress((p) => ({ ...p, city: value }));
                      if (errors.city) setErrors((prev) => ({ ...prev, city: undefined }));
                    }}
                  />
                  <Field
                    label="State / Region"
                    placeholder="Texas"
                    value={shippingAddress.state}
                    error={errors.state}
                    onChange={(value) => {
                      setShippingAddress((p) => ({ ...p, state: value }));
                      if (errors.state) setErrors((prev) => ({ ...prev, state: undefined }));
                    }}
                  />
                  <Field
                    label="Postal / ZIP code"
                    placeholder="6-digit PIN code"
                    value={shippingAddress.pincode}
                    error={errors.pincode}
                    onChange={(value) => {
                      if (/^\d*$/.test(value) && value.length <= 6) {
                        setShippingAddress((p) => ({ ...p, pincode: value }));
                        if (errors.pincode) setErrors((prev) => ({ ...prev, pincode: undefined }));
                      }
                    }}
                  />
                </Grid>
              </Panel>
            </>
          )}

          {step === 2 && (
            <Panel icon={CreditCard} title="Payment Method">
              <div className="space-y-3">
                <label className="flex cursor-pointer items-center gap-4 border p-4 transition-colors border-primary bg-primary/5">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={payment === "razorpay"}
                    onChange={() => setPayment("razorpay")}
                    className="accent-primary"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">Pay Online (Razorpay)</div>
                    <div className="text-xs text-muted-foreground">
                      Secure payment via UPI, Cards, and Netbanking.
                    </div>
                  </div>
                </label>
              </div>
            </Panel>
          )}

          {step === 3 && (
            <Panel icon={CheckCircle2} title="Review & Confirm">
              <div className="space-y-4 text-sm">
                <ReviewRow
                  label="Items"
                  value={`${totals.count} product${totals.count === 1 ? "" : "s"} (${formatINR(totals.subtotal)})`}
                />
                <ReviewRow
                  label="Shipping charges"
                  value={liveShippingCost !== null ? formatINR(liveShippingCost) : "Calculating..."}
                />
                <ReviewRow
                  label="Payment method"
                  value={payment === "razorpay" ? "Online Payment (Razorpay)" : "Standard Gateway"}
                />
                <ReviewRow label="Order total" value={formatINR(computedGrandTotal)} highlight />
              </div>
              <label className="mt-6 flex items-start gap-2 text-xs text-muted-foreground">
                <input type="checkbox" defaultChecked className="mt-0.5 accent-primary" />I agree to
                FerroCore's Terms of Sale, including freight Incoterms and warranty terms.
              </label>
            </Panel>
          )}

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

            {step < 3 ? (
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
              <dd
                className={`font-semibold ${liveShippingCost !== null ? "text-blue-600 font-bold" : ""}`}
              >
                {liveShippingCost !== null ? formatINR(liveShippingCost) : "Enter pincode"}
              </dd>
            </div>
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
            <span className="text-sm font-semibold uppercase tracking-wider">Total</span>
            <span className="text-2xl font-bold">{formatINR(computedGrandTotal)}</span>
          </div>
        </aside>
      </div>
    </SiteLayout>
  );
}

// Subcomponents helper layout utilities
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

// FIXED: Child Field Component updated to conditionally inject error text structures
function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  full = false,
  readOnly = false,
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  error?: string;
  full?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${full ? "md:col-span-2" : ""}`}>
      <label className="flex flex-col gap-1.5 text-xs">
        <span className="font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`border bg-background px-3 py-2 text-sm focus:outline-none transition-colors ${
            error ? "border-red-500 focus:border-red-500" : "border-input focus:border-primary"
          }`}
        />
      </label>
      {error && <span className="text-[11px] font-medium text-red-500 mt-0.5">{error}</span>}
    </div>
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
