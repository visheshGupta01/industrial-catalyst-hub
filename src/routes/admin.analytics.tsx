import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { salesData, categories, products } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
  component: Analytics,
});

const COLORS = ["var(--color-primary)", "var(--color-accent)", "#0ea5e9", "#64748b", "#10b981", "#a855f7"];

function Analytics() {
  const byCategory = categories.map((c) => ({
    name: c,
    value: products.filter((p) => p.category === c).reduce((s, p) => s + p.price, 0),
  }));

  return (
    <AdminLayout title="Analytics" subtitle="Performance and revenue insights">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-bold">Revenue Trend</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatUSD(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-primary)" fill="url(#rev)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-border bg-card">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-bold">Catalog Value by Category</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={60} outerRadius={110} paddingAngle={2}>
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => formatUSD(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-border bg-card lg:col-span-2">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-bold">Orders per Month</h2>
          </div>
          <div className="p-5">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)" }} />
                <Bar dataKey="orders" fill="var(--color-accent)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
