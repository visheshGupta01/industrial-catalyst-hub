import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Search, Menu, Phone, X } from "lucide-react";
import { useState } from "react";
import { useCart, cartTotals } from "@/lib/cart-store";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
  { to: "/admin", label: "Admin" },
];

export function Navbar() {
  const items = useCart();
  const { count } = cartTotals(items);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="hidden border-b border-border/60 bg-secondary text-secondary-foreground md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-6 opacity-80">
            <span className="flex items-center gap-2"><Phone className="h-3 w-3" /> +1 (800) 555-0143 · 24/7 Industrial Support</span>
            <span>ISO 9001:2015 Certified Supply Chain</span>
          </div>
          <div className="flex items-center gap-6 opacity-80">
            <span>Ship to: United States · USD</span>
            <Link to="/admin" className="hover:text-accent">Procurement Portal</Link>
          </div>
        </div>
      </div>

      <div className="container-page flex h-16 items-center gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="grid h-9 w-9 place-items-center bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6" />
            </svg>
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-tight">FERROCORE</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Industrial Supply Co.</div>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  active ? "text-primary" : "text-foreground/80 hover:text-primary"
                }`}
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

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link to="/cart" className="relative inline-flex items-center gap-2 border border-border px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary transition">
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center bg-accent px-1 text-[11px] font-bold text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
          <a href="#quote" className="hidden bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 md:inline-block">
            Request Quote
          </a>
          <button onClick={() => setOpen(!open)} className="lg:hidden border border-border p-2" aria-label="Menu">
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="container-page flex flex-col py-3">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="py-2 text-sm font-medium">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
