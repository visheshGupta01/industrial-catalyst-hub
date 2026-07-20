import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  Package,
  Heart,
  LogOut,
  FileText,
  Pencil,
  ShieldCheck,
  Menu,
  X,
  Loader2,
  ExternalLink,
  Layers,
  ArrowRight,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useMyOrders } from "@/hooks/useOrders";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { useMyQuotes } from "@/hooks/useQuote";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Account — FerroCore" },
      {
        name: "description",
        content: "Manage your business profile, orders, and procurement preferences.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: user, isLoading: authLoading } = useAuth();
  const { data: orders = [], isLoading: ordersLoading } = useMyOrders();
  const navigate = useNavigate();

  const [tab, setTab] = useState<"profile" | "orders" | "quotes" | "wishlist">("profile");
  const [edit, setEdit] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  // Fetch Customer's Active RFQs/Quotes
  const { data: quotes, isLoading: quotesLoading } = useMyQuotes();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth", replace: true });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <SiteLayout>
        <div className="flex h-64 items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          Loading your profile...
        </div>
      </SiteLayout>
    );
  }

  if (!user) return null;

  const initials = (user.name || "User")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary text-secondary-foreground">
        <div className="container-page py-10">
          <div className="flex items-center gap-2 text-xs opacity-70">
            <Link to="/" className="hover:text-accent">
              Home
            </Link>
            <span>/</span>
            <span>My Account</span>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <div className="grid h-16 w-16 place-items-center bg-accent text-2xl font-bold text-accent-foreground">
              {initials}
            </div>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">{user.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm opacity-80">
                {/* {user.companyName && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" /> {user.companyName}
                  </span>
                )} */}
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </span>
              </div>
            </div>
            <div className="ml-auto inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5 text-xs">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Verified Account</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <button
          onClick={() => setMobileNav(true)}
          className="mb-5 inline-flex items-center gap-2 border border-border bg-card px-4 py-2.5 text-sm font-semibold text-primary shadow-sm lg:hidden"
        >
          <Menu className="h-4 w-4" /> Account options
        </button>
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          {mobileNav && (
            <button
              className="fixed inset-0 z-40 bg-secondary/55 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileNav(false)}
              aria-label="Close account options"
            />
          )}
          <aside
            className={`fixed left-0 top-0 z-50 h-full w-[min(86vw,320px)] bg-background p-5 premium-shadow transition-transform duration-300 lg:static lg:z-auto lg:h-auto lg:w-auto lg:translate-x-0 lg:bg-transparent lg:p-0 lg:shadow-none ${
              mobileNav ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="mb-5 flex items-center justify-between lg:hidden">
              <div>
                <div className="eyebrow">My account</div>
                <div className="mt-1 font-bold">Account options</div>
              </div>
              <button
                onClick={() => setMobileNav(false)}
                className="border border-border p-2"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="border border-border bg-card premium-shadow">
              {[
                { id: "profile", label: "Profile", icon: User },
                { id: "orders", label: "Orders", icon: Package },
                { id: "quotes", label: "Quotations / RFQs", icon: FileText },
                { id: "wishlist", label: "Wishlist", icon: Heart },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => {
                    setTab(id as typeof tab);
                    setMobileNav(false);
                  }}
                  className={`flex w-full items-center gap-3 border-l-2 px-4 py-3 text-left text-sm transition-colors ${
                    tab === id
                      ? "border-accent bg-surface font-semibold text-primary"
                      : "border-transparent hover:bg-surface"
                  }`}
                >
                  <Icon className="h-4 w-4" /> {label}
                </button>
              ))}
              <button
                onClick={() => {
                  toast.success("Signed out successfully");
                  navigate({ to: "/auth" });
                }}
                className="flex w-full items-center gap-3 border-l-2 border-transparent border-t border-border px-4 py-3 text-left text-sm text-destructive hover:bg-surface"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </nav>
          </aside>

          <div className="animate-fade-in" key={tab}>
            {/* PROFILE TAB */}
            {tab === "profile" && (
              <div className="border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border px-6 py-4">
                  <div>
                    <div className="eyebrow">Account details</div>
                    <h2 className="mt-1 text-lg font-semibold">Profile information</h2>
                  </div>
                </header>

                <dl className="grid gap-px bg-border md:grid-cols-2">
                  {[
                    { label: "Full name", value: user.name, icon: User },
                    { label: "Email", value: user.email, icon: Mail },
                    { label: "Phone", value: user.phone || "Not Provided", icon: Phone },
                    { label: "Role", value: user.role || "Customer", icon: ShieldCheck },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-card p-5">
                      <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </dt>
                      <dd className="mt-1.5 text-sm font-medium text-foreground">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* ORDERS TAB */}
            {tab === "orders" && (
              <div className="border border-border bg-card">
                <header className="border-b border-border px-6 py-4">
                  <div className="eyebrow">Order history</div>
                  <h2 className="mt-1 text-lg font-semibold">Your purchase orders</h2>
                </header>

                {ordersLoading ? (
                  <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="p-12 text-center text-sm text-muted-foreground">
                    No order records found.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-5 py-3 text-left">Order #</th>
                          <th className="px-5 py-3 text-left">Date</th>
                          <th className="px-5 py-3 text-left">Payment</th>
                          <th className="px-5 py-3 text-left">Shipping</th>
                          <th className="px-5 py-3 text-right">Amount</th>
                          <th className="px-5 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.map((o: any) => (
                          <tr key={o._id} className="hover:bg-surface/50 transition-colors">
                            <td className="px-5 py-3 font-mono text-xs font-bold">
                              {o.orderNumber}
                            </td>
                            <td className="px-5 py-3 text-xs text-muted-foreground">
                              {new Date(o.createdAt).toLocaleDateString("en-IN")}
                            </td>
                            <td className="px-5 py-3">
                              <span
                                className={`px-2 py-0.5 text-[10px] font-semibold border ${
                                  o.payment?.status === "Paid"
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                    : "bg-amber-50 border-amber-200 text-amber-700"
                                }`}
                              >
                                {o.payment?.status || "Pending"}
                              </span>
                            </td>
                            <td className="px-5 py-3">
                              <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-0.5 text-[10px] font-semibold">
                                {o.shipping?.status || "Processing"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right font-bold text-primary">
                              {formatINR(o.pricing?.total)}
                            </td>
                            <td className="px-5 py-3 text-right">
                              <Link
                                to="/order-tracking"
                                search={{ orderId: o._id }}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                              >
                                Track <ArrowRight className="h-3 w-3" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* QUOTATIONS / RFQs TAB */}
            {tab === "quotes" && (
              <div className="border border-border bg-card">
                <header className="border-b border-border px-6 py-4">
                  <div className="eyebrow">B2B Procurement</div>
                  <h2 className="mt-1 text-lg font-semibold">Submitted Quotation Requests</h2>
                </header>

                {quotesLoading ? (
                  <div className="p-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" /> Loading quotations...
                  </div>
                ) : quotes.length === 0 ? (
                  <div className="p-12 text-center text-sm text-muted-foreground">
                    You haven't submitted any quote requests yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-5 py-3 text-left">Type</th>
                          <th className="px-5 py-3 text-left">Item / SKU</th>
                          <th className="px-5 py-3 text-center">Qty</th>
                          <th className="px-5 py-3 text-left">Status</th>
                          <th className="px-5 py-3 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {quotes.map((q: any) => (
                          <tr key={q._id} className="hover:bg-surface/50 transition-colors">
                            <td className="px-5 py-3">
                              {q.requirementType === "bulk" ? (
                                <span className="inline-flex items-center gap-1 text-primary font-bold text-xs">
                                  <Layers className="h-3.5 w-3.5" /> Bulk RFQ
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-blue-600 font-semibold text-xs">
                                  <FileText className="h-3.5 w-3.5" /> Quote
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <div className="font-semibold">{q.product?.name || "Equipment"}</div>
                              <div className="text-[10px] font-mono text-muted-foreground">
                                {q.product?.sku}
                              </div>
                            </td>
                            <td className="px-5 py-3 text-center font-bold">{q.quantity || 1}</td>
                            <td className="px-5 py-3">
                              <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 text-[10px] font-bold uppercase">
                                {q.status || "Pending"}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                              {new Date(q.createdAt).toLocaleDateString("en-IN")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* WISHLIST TAB */}
            {tab === "wishlist" && (
              <div className="border border-dashed border-border bg-surface p-16 text-center">
                <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">Your wishlist is empty</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Save products to compare specifications and pricing for upcoming RFQs.
                </p>
                <Link
                  to="/products"
                  className="mt-5 inline-block bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                >
                  Browse catalog
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
