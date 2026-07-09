import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  LogOut,
  FileText,
  Pencil,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { orders as fallbackOrders } from "@/lib/mock-data";
import { listOrders } from "@/lib/api/orders";
import { formatINR } from "@/lib/format";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

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
  const user = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"profile" | "orders" | "wishlist" | "addresses">("profile");
  const [edit, setEdit] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [orders, setOrders] = useState(fallbackOrders);

  useEffect(() => {
    if (!user) return;
    listOrders()
      .then((list) => {
        if (Array.isArray(list) && list.length) setOrders(list as typeof fallbackOrders);
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (user === null) navigate({ to: "/auth" });
  }, [user, navigate]);

  if (!user) return null;

  const onSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    authStore.update({
      name: String(fd.get("name") || user.name),
      company: String(fd.get("company") || user.company),
      phone: String(fd.get("phone") || user.phone),
      role: String(fd.get("role") || user.role),
      gstin: String(fd.get("gstin") || user.gstin),
      address: String(fd.get("address") || user.address),
    });
    setEdit(false);
    toast.success("Profile updated");
  };

  const initials = user.name
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
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> {user.company}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" /> {user.email}
                </span>
              </div>
            </div>
            <div className="ml-auto inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1.5 text-xs">
              <ShieldCheck className="h-4 w-4 text-accent" />
              <span>Verified business account</span>
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
            className={`fixed left-0 top-0 z-50 h-full w-[min(86vw,320px)] bg-background p-5 premium-shadow transition-transform duration-300 lg:static lg:z-auto lg:h-auto lg:w-auto lg:translate-x-0 lg:bg-transparent lg:p-0 lg:shadow-none ${mobileNav ? "translate-x-0" : "-translate-x-full"}`}
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
                { id: "wishlist", label: "Wishlist", icon: Heart },
                { id: "addresses", label: "Addresses", icon: MapPin },
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
                  authStore.logout();
                  toast.success("Signed out");
                  navigate({ to: "/auth" });
                }}
                className="flex w-full items-center gap-3 border-l-2 border-transparent border-t border-border px-4 py-3 text-left text-sm text-destructive hover:bg-surface"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </nav>
          </aside>

          <div className="animate-fade-in" key={tab}>
            {tab === "profile" && (
              <div className="border border-border bg-card">
                <header className="flex items-center justify-between border-b border-border px-6 py-4">
                  <div>
                    <div className="eyebrow">Account details</div>
                    <h2 className="mt-1 text-lg font-semibold">Profile information</h2>
                  </div>
                  <button
                    onClick={() => setEdit((v) => !v)}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary"
                  >
                    <Pencil className="h-3.5 w-3.5" /> {edit ? "Cancel" : "Edit"}
                  </button>
                </header>

                {edit ? (
                  <form onSubmit={onSave} className="grid gap-4 p-6 md:grid-cols-2">
                    <EditField name="name" label="Full name" defaultValue={user.name} />
                    <EditField name="company" label="Company" defaultValue={user.company} />
                    <EditField name="role" label="Role" defaultValue={user.role} />
                    <EditField name="phone" label="Phone" defaultValue={user.phone} />
                    <EditField name="gstin" label="GSTIN" defaultValue={user.gstin} />
                    <EditField
                      name="address"
                      label="Shipping address"
                      defaultValue={user.address}
                      full
                    />
                    <div className="md:col-span-2 flex gap-3">
                      <button
                        type="submit"
                        className="bg-primary px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
                      >
                        Save changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEdit(false)}
                        className="border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-primary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <dl className="grid gap-px bg-border md:grid-cols-2">
                    {[
                      { label: "Full name", value: user.name, icon: User },
                      { label: "Company", value: user.company, icon: Building2 },
                      { label: "Email", value: user.email, icon: Mail },
                      { label: "Phone", value: user.phone, icon: Phone },
                      { label: "Role", value: user.role, icon: FileText },
                      { label: "GSTIN", value: user.gstin, icon: ShieldCheck },
                      { label: "Shipping address", value: user.address, icon: MapPin, full: true },
                    ].map(({ label, value, icon: Icon, full }) => (
                      <div key={label} className={`bg-card p-5 ${full ? "md:col-span-2" : ""}`}>
                        <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          <Icon className="h-3.5 w-3.5" /> {label}
                        </dt>
                        <dd className="mt-1.5 text-sm font-medium text-foreground">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            )}

            {tab === "orders" && (
              <div className="border border-border bg-card">
                <header className="border-b border-border px-6 py-4">
                  <div className="eyebrow">Order history</div>
                  <h2 className="mt-1 text-lg font-semibold">Your purchase orders</h2>
                </header>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3 text-left">Order</th>
                        <th className="px-5 py-3 text-left">Date</th>
                        <th className="px-5 py-3 text-left">Status</th>
                        <th className="px-5 py-3 text-right">Amount</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr
                          key={o.id}
                          className="border-t border-border transition-colors duration-200 hover:bg-surface"
                        >
                          <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                          <td className="px-5 py-3 text-muted-foreground">{o.date}</td>
                          <td className="px-5 py-3">
                            <span
                              className={`px-2 py-0.5 text-[11px] font-semibold ${
                                o.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : o.status === "Shipped"
                                    ? "bg-blue-50 text-blue-700"
                                    : o.status === "Processing"
                                      ? "bg-amber-50 text-amber-700"
                                      : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right font-semibold">
                            {formatINR(o.amount)}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Link
                              to="/order-tracking"
                              className="text-xs font-semibold text-primary hover:underline"
                            >
                              Track →
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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

            {tab === "addresses" && (
              <div className="border border-border bg-card p-6">
                <div className="eyebrow">Saved addresses</div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {[
                    { tag: "Headquarters", line: user.address },
                    {
                      tag: "Plant 2 — Chakan",
                      line: "Survey 218, Chakan Industrial Belt, Pune 410501",
                    },
                  ].map((a) => (
                    <div
                      key={a.tag}
                      className="border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:premium-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <span className="bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                          {a.tag}
                        </span>
                        <button className="text-xs text-muted-foreground hover:text-primary">
                          Edit
                        </button>
                      </div>
                      <p className="mt-3 text-sm">{a.line}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.company} · GSTIN {user.gstin}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function EditField({
  name,
  label,
  defaultValue,
  full,
}: {
  name: string;
  label: string;
  defaultValue: string;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-1.5 w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
      />
    </label>
  );
}
