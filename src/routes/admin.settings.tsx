import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Settings — Admin" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AdminLayout title="Settings" subtitle="Account, billing, and integration preferences">
      <div className="grid gap-5 lg:grid-cols-3">
        <nav className="border border-border bg-card p-4 lg:col-span-1">
          {["Company profile", "Billing", "Tax & compliance", "Shipping zones", "Integrations", "Users & roles", "API keys", "Notifications"].map((s, i) => (
            <button key={s} className={`flex w-full items-center justify-between border-l-2 px-3 py-2.5 text-left text-sm ${i === 0 ? "border-accent bg-surface font-semibold text-primary" : "border-transparent text-muted-foreground hover:bg-surface hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </nav>
        <div className="border border-border bg-card lg:col-span-2">
          <div className="border-b border-border p-5">
            <h2 className="text-base font-bold">Company profile</h2>
            <p className="text-xs text-muted-foreground">Public business information shown on invoices and shipping documents.</p>
          </div>
          <div className="grid gap-4 p-5 md:grid-cols-2">
            {[
              ["Legal entity", "FerroCore Industrial Supply Co."],
              ["Tax ID", "US 84-9302341"],
              ["Headquarters", "Houston, Texas, USA"],
              ["Founded", "1987"],
              ["Support email", "support@ferrocore.com"],
              ["Support phone", "+1 (800) 555-0143"],
            ].map(([label, value]) => (
              <label key={label} className="flex flex-col gap-1.5 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
                <input defaultValue={value} className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2 border-t border-border bg-surface p-4">
            <button className="border border-border px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:border-primary">Cancel</button>
            <button className="bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">Save changes</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
