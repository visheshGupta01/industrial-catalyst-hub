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
} from "lucide-react";
import type { ReactNode } from "react";

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

  return (
    <div className="flex min-h-screen bg-surface">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
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
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
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
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search orders, customers, products…"
              className="w-full border border-input bg-surface py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <button
            className="ml-auto relative border border-border p-2 hover:border-primary"
            aria-label="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-accent" />
          </button>
          <div className="flex items-center gap-3 border-l border-border pl-4">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              JD
            </div>
            <div className="hidden text-xs leading-tight sm:block">
              <div className="font-semibold">Jane Doe</div>
              <div className="text-muted-foreground">Procurement Admin</div>
            </div>
          </div>
        </header> */}

        <div className="border-b border-border bg-card px-6 py-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">Admin</div>
              <h1 className="mt-1 text-2xl font-bold md:text-3xl">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions}
          </div>
        </div>

        <main className="flex-1 p-6">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}
