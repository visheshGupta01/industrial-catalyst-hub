import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Search, Menu, Phone, X, User as UserIcon, LogOut, Package, Heart, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useCart, cartTotals, cartStore } from "@/lib/cart-store";
import { useAuth, authStore } from "@/lib/auth-store";
import { toast } from "sonner";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/admin", label: "Admin" },
];

export function Navbar() {
  const items = useCart();
  const { count } = cartTotals(items);
  const user = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  const initials = user ? user.name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase() : "";

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="hidden border-b border-border/60 bg-secondary text-secondary-foreground md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-6 opacity-80">
            <span className="flex items-center gap-2"><Phone className="h-3 w-3" /> +91 22 6100 4500 · 24/7 Industrial Support</span>
            <span>ISO 9001:2015 Certified Supply Chain</span>
          </div>
          <div className="flex items-center gap-6 opacity-80">
            <span>Ship to: India · INR ₹</span>
            <Link to="/admin" className="hover:text-accent">Procurement Portal</Link>
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center gap-3 lg:gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">FERROCORE</div>
            <div className="hidden text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:block">Industrial Supply Co.</div>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-4 py-2 text-sm font-medium transition-colors ${active ? "text-primary" : "text-foreground/80 hover:text-primary"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden flex-1 lg:block">
          <div className="relative ml-auto max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search SKU, product, or specification…"
              className="w-full border border-input bg-surface py-2 pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:gap-2">
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="border border-border p-2 hover:border-primary hover:text-primary lg:hidden"
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          {user && (
            <button
              onClick={() => cartStore.openDrawer()}
              className="relative inline-flex items-center gap-2 border border-border px-2.5 py-2 text-sm font-medium transition hover:border-primary hover:text-primary lg:px-3"
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Cart</span>
              {count > 0 && (
                <span className="ml-0.5 inline-flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[11px] font-bold text-accent-foreground animate-scale-in">
                  {count}
                </span>
              )}
            </button>
          )}

          {user ? (
            <div className="relative">
              <button
                onClick={() => setMenu((v) => !v)}
                className="hidden items-center gap-2 border border-border px-2 py-1.5 hover:border-primary md:inline-flex"
                aria-label="Account"
              >
                <span className="grid h-6 w-6 place-items-center bg-primary text-[10px] font-bold text-primary-foreground">{initials}</span>
                <span className="hidden text-sm font-medium md:inline">{user.name.split(" ")[0]}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-1 w-56 border border-border bg-card shadow-lg animate-fade-in">
                  <div className="border-b border-border p-3">
                    <div className="text-sm font-semibold">{user.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{user.email}</div>
                  </div>
                  <Link to="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface">
                    <UserIcon className="h-4 w-4" /> My profile
                  </Link>
                  <Link to="/order-tracking" onClick={() => setMenu(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface">
                    <ShoppingCart className="h-4 w-4" /> Orders
                  </Link>
                  <button
                    onClick={() => { authStore.logout(); setMenu(false); toast.success("Signed out"); }}
                    className="flex w-full items-center gap-2 border-t border-border px-3 py-2 text-left text-sm text-destructive hover:bg-surface"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="inline-flex items-center gap-2 border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary">
              <UserIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}

          <a href="#quote" className="hidden bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:inline-block">
            Request Quote
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden border border-border p-2" aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-border bg-background p-3 lg:hidden animate-fade-in">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Search products, SKU, specifications..."
              className="w-full border border-input bg-surface py-2.5 pl-9 pr-9 text-sm focus:border-primary focus:outline-none"
            />
            <button onClick={() => setSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1" aria-label="Close search">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-secondary/55 backdrop-blur-sm" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="absolute right-0 top-0 flex h-full w-[min(88vw,360px)] flex-col bg-background premium-shadow animate-in slide-in-from-right">
            <header className="industrial-panel flex items-center justify-between px-5 py-5 text-secondary-foreground">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">FerroCore</div>
                <div className="mt-1 text-lg font-bold">{user ? user.name : "Navigation"}</div>
                {user && <div className="text-xs opacity-70">{user.company}</div>}
              </div>
              <button onClick={() => setOpen(false)} className="border border-secondary-foreground/20 p-2" aria-label="Close menu"><X className="h-4 w-4" /></button>
            </header>
            <div className="flex flex-1 flex-col overflow-y-auto px-5 py-4">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex items-center justify-between border-b border-border py-3 text-sm font-semibold">
                {n.label}<ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            {user ? (
              <div className="mt-6">
                <div className="eyebrow mb-2">My account</div>
                {[
                  { label: "Profile details", icon: UserIcon },
                  { label: "My orders", icon: Package },
                  { label: "Wishlist", icon: Heart },
                  { label: "Saved addresses", icon: MapPin },
                ].map(({ label, icon: Icon }) => (
                  <Link key={label} to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 border-b border-border py-3 text-sm font-medium">
                    <Icon className="h-4 w-4 text-primary" /> {label}
                  </Link>
                ))}
                <Link to="/order-tracking" onClick={() => setOpen(false)} className="flex items-center gap-3 border-b border-border py-3 text-sm font-medium">
                  <ShoppingCart className="h-4 w-4 text-primary" /> Track shipment
                </Link>
                <button onClick={() => { authStore.logout(); setOpen(false); toast.success("Signed out"); }} className="mt-4 flex w-full items-center gap-3 py-3 text-left text-sm font-medium text-destructive">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </div>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="mt-6 bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">
                Sign in / Sign up
              </Link>
            )}
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
