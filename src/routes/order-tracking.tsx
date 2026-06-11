import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Package, Truck, MapPin, FileText, Phone, Clock, ShieldCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { z } from "zod";

export const Route = createFileRoute("/order-tracking")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({ meta: [{ title: "Order Tracking — FerroCore" }] }),
  component: OrderTracking,
});

const STAGES = [
  { id: "placed", label: "Order Placed", desc: "Order received and acknowledged", icon: FileText, date: "Jun 11, 2026 · 09:42" },
  { id: "confirmed", label: "Confirmed", desc: "Procurement team confirmed inventory & pricing", icon: ShieldCheck, date: "Jun 11, 2026 · 11:18" },
  { id: "processing", label: "Processing", desc: "Items being prepared for dispatch at Houston DC", icon: Package, date: "Jun 11, 2026 · 16:05" },
  { id: "packed", label: "Packed", desc: "Goods packed, awaiting carrier pickup", icon: Package, date: null },
  { id: "shipped", label: "Shipped", desc: "Carrier picked up · in transit", icon: Truck, date: null },
  { id: "delivered", label: "Delivered", desc: "Delivered to consignee", icon: MapPin, date: null },
];

const CURRENT = 2; // Processing

function OrderTracking() {
  const { id } = Route.useSearch();
  const orderNumber = id ?? "ORD-433566";
  const eta = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Order Tracking</span>
          </div>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">Order Tracking</h1>
              <p className="mt-1 text-sm text-muted-foreground">Real-time status of your industrial procurement order.</p>
            </div>
            <div className="border border-border bg-card px-4 py-3">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Order Number</div>
              <div className="font-mono text-lg font-bold">{orderNumber}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          {/* Status overview */}
          <div className="grid grid-cols-1 gap-3 border border-border bg-card p-5 sm:grid-cols-3">
            <Stat label="Current Status" value={STAGES[CURRENT].label} accent />
            <Stat label="Estimated Delivery" value={eta} />
            <Stat label="Carrier" value="FedEx Freight Priority" />
          </div>

          {/* Timeline */}
          <div className="border border-border bg-card">
            <header className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">Shipment Timeline</h2>
            </header>
            <ol className="relative px-5 py-6">
              <span className="absolute left-[2.1rem] top-8 bottom-8 w-px bg-border" aria-hidden />
              {STAGES.map((s, i) => {
                const done = i < CURRENT;
                const active = i === CURRENT;
                const Icon = s.icon;
                return (
                  <li key={s.id} className="relative flex gap-4 py-4">
                    <span
                      className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 ${
                        done
                          ? "border-primary bg-primary text-primary-foreground"
                          : active
                          ? "border-accent bg-accent text-accent-foreground animate-pulse"
                          : "border-border bg-background text-muted-foreground"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1 pt-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className={`text-sm font-bold ${done || active ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</h3>
                        {s.date && <span className="font-mono text-[11px] text-muted-foreground">{s.date}</span>}
                      </div>
                      <p className={`mt-0.5 text-sm ${done || active ? "text-muted-foreground" : "text-muted-foreground/60"}`}>{s.desc}</p>
                      {active && (
                        <div className="mt-2 inline-flex items-center gap-1.5 bg-accent/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent">
                          In progress
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Tracking notes */}
          <div className="border border-border bg-card">
            <header className="flex items-center gap-2 border-b border-border bg-surface px-5 py-3">
              <FileText className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em]">Tracking Notes</h2>
            </header>
            <ul className="divide-y divide-border">
              {[
                { date: "Jun 11, 16:05", note: "Items moved to packing station 04 · QC inspection passed" },
                { date: "Jun 11, 11:18", note: "Order confirmed by procurement specialist M. Hartley" },
                { date: "Jun 11, 09:42", note: "Order received via web portal · auto-acknowledged" },
              ].map((n) => (
                <li key={n.date} className="flex gap-4 px-5 py-3 text-sm">
                  <span className="w-32 shrink-0 font-mono text-xs text-muted-foreground">{n.date}</span>
                  <span>{n.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> Shipping Address
            </div>
            <address className="mt-3 not-italic text-sm leading-relaxed">
              <div className="font-semibold">Acme Manufacturing Ltd.</div>
              <div className="text-muted-foreground">Attn: Jane Doe — Procurement</div>
              <div className="text-muted-foreground">1247 Industrial Pkwy</div>
              <div className="text-muted-foreground">Building C, Loading Dock 4</div>
              <div className="text-muted-foreground">Houston, TX 77041 · USA</div>
            </address>
          </div>

          <div className="border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Truck className="h-4 w-4 text-primary" /> Shipment Details
            </div>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Method" value="Expedited LTL Freight" />
              <Row label="Tracking #" value="FX-8842-09115-22" mono />
              <Row label="Incoterms" value="DAP — Delivered at Place" />
              <Row label="Insurance" value="Full value coverage" />
            </dl>
          </div>

          <div className="border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              <Phone className="h-4 w-4 text-primary" /> Need help?
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Your dedicated account manager is available 24/7 for any shipment inquiries.</p>
            <button className="mt-4 inline-flex w-full items-center justify-center gap-2 border border-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
              Contact account manager
            </button>
          </div>
        </aside>
      </section>
    </SiteLayout>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 text-base font-bold ${accent ? "text-accent" : ""}`}>{value}</div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={`text-right text-sm font-semibold ${mono ? "font-mono" : ""}`}>{value}</dd>
    </div>
  );
}
