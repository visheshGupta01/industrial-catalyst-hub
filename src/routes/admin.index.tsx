import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { formatINR } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard — FerroCore" }] }),
  component: Dashboard,
});

const KPIS = [
  { label: "Revenue", value: "$1,842,000", change: "+12.4%", up: true, icon: DollarSign, sub: "vs. last month" },
  { label: "Orders", value: "127", change: "+8.2%", up: true, icon: ShoppingBag, sub: "vs. last month" },
  { label: "Customers", value: "4,218", change: "+3.1%", up: true, icon: Users, sub: "vs. last month" },
  { label: "Products", value: "12,402", change: "-0.4%", up: false, icon: Package, sub: "active SKUs" },
];

function Dashboard() {
  const topProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 5);

  return (
    <AdminLayout title="Dashboard" subtitle="Operational overview · last 30 days">
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k) => (
          <div key={k.label} className="border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{k.label}</div>
              <div className="grid h-8 w-8 place-items-center bg-primary/10 text-primary">
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-4 text-3xl font-bold">{k.value}</div>
            <div className="mt-1 flex items-center gap-1.5 text-xs">
              {k.up ? <TrendingUp className="h-3 w-3 text-emerald-600" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
              <span className={k.up ? "font-semibold text-emerald-700" : "font-semibold text-destructive"}>{k.change}</span>
              <span className="text-muted-foreground">{k.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="text-base font-bold">Sales Analytics</h2>
              <p className="text-xs text-muted-foreground">Monthly revenue, last 6 months</p>
            </div>
            <select className="border border-input bg-background px-3 py-1.5 text-xs focus:outline-none">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={salesData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }}
                  formatter={(v: number) => formatUSD(v)}
                />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ fill: "var(--color-primary)", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-bold">Orders by Volume</h2>
            <p className="text-xs text-muted-foreground">Units shipped per month</p>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: 12 }} />
                <Bar dataKey="orders" fill="var(--color-accent)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="border border-border bg-card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border p-5">
            <h2 className="text-base font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="px-5 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-5 py-3 text-left font-semibold">Customer</th>
                  <th className="px-5 py-3 text-left font-semibold">Amount</th>
                  <th className="px-5 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 6).map((o) => (
                  <tr key={o.id} className="border-b border-border last:border-0 hover:bg-surface">
                    <td className="px-5 py-3 font-mono text-xs">{o.id}</td>
                    <td className="px-5 py-3">{o.customer}</td>
                    <td className="px-5 py-3 font-semibold">{formatUSD(o.amount)}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-bold">Top Products</h2>
            <p className="text-xs text-muted-foreground">By value · this month</p>
          </div>
          <ul>
            {topProducts.map((p, i) => (
              <li key={p.id} className="flex items-center gap-3 border-b border-border p-4 last:border-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.code}</div>
                </div>
                <div className="text-sm font-bold">{formatUSD(p.price)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-muted text-muted-foreground",
    Processing: "bg-primary/10 text-primary",
    Shipped: "bg-accent/10 text-accent",
    Delivered: "bg-emerald-100 text-emerald-700",
    "In Stock": "bg-emerald-100 text-emerald-700",
    "Low Stock": "bg-accent/10 text-accent",
    "Out of Stock": "bg-destructive/10 text-destructive",
    Active: "bg-emerald-100 text-emerald-700",
    Expired: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold uppercase tracking-wider ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
