import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Ticket,
  BarChart3,
  Settings,
  Bell,
  Search,
  FolderTree,
  Layers,
  Quote,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: FolderTree },
  { to: "/admin/subcategories", label: "Sub-categories", icon: Layers },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/users", label: "Users", icon: Users },
  {to:"/admin/quotes", label: "Quotes", icon: Quote}
  // { to: "/admin/coupons", label: "Coupons", icon: Ticket },
  // { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  // { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminLayout({
  children,
  title,
  subtitle,
  actions,
}: {
  children?: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const SidebarInner = (
    <>
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="grid h-8 w-8 place-items-center bg-accent text-accent-foreground">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M3 20h18M5 20V8l7-4 7 4v12M9 20v-6h6v6" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight">FERROCORE</div>
          <div className="text-[9px] uppercase tracking-[0.18em] opacity-60">Admin Console</div>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="ml-auto grid h-8 w-8 place-items-center text-sidebar-foreground/70 hover:text-sidebar-foreground md:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((n) => {
          const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent font-semibold text-sidebar-primary-foreground border-l-2 border-accent"
                  : "border-l-2 border-transparent text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-4">
        <Link to="/" className="text-xs text-sidebar-foreground/60 hover:text-accent">
          ← Back to storefront
        </Link>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        {SidebarInner}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-sidebar text-sidebar-foreground shadow-xl animate-in slide-in-from-left duration-200">
            {SidebarInner}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="border-b border-border bg-card px-4 py-4 md:px-6 md:py-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="grid h-10 w-10 shrink-0 place-items-center border border-border bg-card hover:border-primary md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div>
                <div className="eyebrow">Admin</div>
                <h1 className="mt-1 text-xl font-bold md:text-3xl">{title}</h1>
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
            {actions}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
