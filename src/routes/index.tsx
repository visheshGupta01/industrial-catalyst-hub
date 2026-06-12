import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ShieldCheck, Truck, Wrench, HeadphonesIcon, Award, Factory, ChevronRight, ChevronLeft } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { products, industries, testimonials, stats, categories } from "@/lib/mock-data";
import * as Lucide from "lucide-react";
import heroFactory from "@/assets/hero-factory.jpg";
import heroAutomation from "@/assets/hero-automation.jpg";
import heroPower from "@/assets/hero-power.jpg";

const SLIDES = [
  {
    image: heroFactory,
    eyebrow: "Trusted by 4,200+ Manufacturers",
    title: "Industrial Equipment",
    accent: "& Business Solutions",
    body: "Supplying high-quality industrial products and machinery to modern manufacturing businesses — engineered for performance, certified for compliance.",
    cta: { label: "Browse Catalog", to: "/products" as const },
  },
  {
    image: heroAutomation,
    eyebrow: "Automation & Robotics",
    title: "Smart Factories,",
    accent: "Built to Scale.",
    body: "6-axis robotics, modular PLCs, vision systems, and OPC-UA ready edge gateways for Industry 4.0 transformation programs.",
    cta: { label: "Explore Automation", to: "/products" as const },
  },
  {
    image: heroPower,
    eyebrow: "Power & Electrical Systems",
    title: "Resilient Power",
    accent: "for Critical Loads.",
    body: "IEC-compliant switchgear, IE4 premium motors, and full electrical balance-of-plant with CE / UL documentation.",
    cta: { label: "View Electrical", to: "/products" as const },
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FerroCore — Industrial Equipment & Business Solutions" },
      { name: "description", content: "Premium B2B marketplace for industrial machinery, electrical systems, automation, and components. Supplying modern manufacturers worldwide." },
      { property: "og:title", content: "FerroCore — Industrial Equipment & Business Solutions" },
      { property: "og:description", content: "Premium B2B marketplace for industrial machinery, electrical systems, automation, and components." },
    ],
  }),
  component: Home,
});

function Home() {
  const featured = products.slice(0, 4);

  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-secondary text-secondary-foreground">
        <img src={heroImg} alt="" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/20" />
        <div className="container-page relative grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Trusted by 4,200+ Manufacturers
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Industrial Equipment<br />
              & <span className="text-accent">Business Solutions</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed opacity-80 md:text-lg">
              Supplying high-quality industrial products and machinery to modern manufacturing
              businesses — engineered for performance, certified for compliance, delivered with confidence.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link to="/products" className="inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90">
                Browse Products <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#quote" className="inline-flex items-center gap-2 border border-white/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider hover:border-accent hover:text-accent">
                Request Quote
              </a>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 border-t border-white/15 pt-8 text-sm sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-accent md:text-3xl">{s.value}</div>
                  <div className="mt-1 text-[11px] uppercase tracking-wider opacity-60">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-surface">
        <div className="container-page grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "ISO 9001:2015 Certified" },
            { icon: Truck, label: "Worldwide Logistics" },
            { icon: Wrench, label: "Installation & Service" },
            { icon: HeadphonesIcon, label: "24/7 Technical Support" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-20">
        <SectionHeader eyebrow="Product Catalog" title="Categories We Supply" />
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c}
              to="/products"
              search={{ category: c }}
              className="group flex flex-col gap-3 border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <Factory className="h-7 w-7 text-primary" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Cat. 0{i + 1}</div>
                <div className="mt-1 text-sm font-semibold leading-snug">{c}</div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="border-y border-border bg-surface">
        <div className="container-page py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Featured" title="Top Industrial Products" />
            <Link to="/products" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all">
              View entire catalog <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Why Choose FerroCore" title="Enterprise procurement, engineered." />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              Four decades supplying tier-1 manufacturers, energy operators, and infrastructure
              programs. Every SKU is qualified through our supplier audit framework with full
              documentation traceability.
            </p>
            <div className="mt-8 space-y-5">
              {[
                { icon: Award, title: "Tier-1 Qualified Supply Chain", desc: "Every supplier audited under ISO 9001, with full MTC and CoC available before purchase." },
                { icon: ShieldCheck, title: "Compliance-First Sourcing", desc: "CE, ATEX, IECEx, REACH, RoHS, and OEM-traceable components for regulated industries." },
                { icon: Wrench, title: "Installation, Service & Spares", desc: "Lifecycle support including commissioning, training, preventative maintenance, and OEM spares." },
                { icon: HeadphonesIcon, title: "Dedicated Account Managers", desc: "Named engineers for capex equipment programs, with SLA-backed response times." },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="grid h-11 w-11 shrink-0 place-items-center bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="border border-border bg-card p-8 md:p-10">
              <div className="eyebrow">Procurement Toolkit</div>
              <h3 className="mt-3 text-2xl font-bold leading-tight">Volume pricing &<br />enterprise terms.</h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Get tier discounts, framework agreements, and Net-30 terms for qualifying business accounts.
              </p>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {[
                  ["Annual contract volume", "$50K+"],
                  ["Payment terms", "Net-30 / LC available"],
                  ["Dedicated engineer", "Included"],
                  ["Compliance documentation", "Pre-shipment"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-secondary-foreground hover:bg-secondary/90">
                Open business account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="border-y border-border bg-secondary text-secondary-foreground">
        <div className="container-page py-20">
          <SectionHeader eyebrow="Industries We Serve" title="Trusted by demanding sectors." dark />
          <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
            {industries.map((ind) => {
              const Icon = (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[ind.icon] ?? Factory;
              return (
                <div key={ind.name} className="flex flex-col items-start gap-4 bg-secondary p-6 transition-colors hover:bg-secondary/80">
                  <Icon className="h-7 w-7 text-accent" />
                  <div>
                    <div className="text-xs uppercase tracking-wider opacity-50">Industry</div>
                    <div className="text-base font-semibold">{ind.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container-page py-20">
        <SectionHeader eyebrow="Client Voices" title="Procurement leaders rely on FerroCore." />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="border border-border bg-card p-7">
              <div className="text-3xl font-serif text-accent">“</div>
              <blockquote className="mt-2 text-sm leading-relaxed text-foreground">{t.quote}</blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="quote" className="border-t border-border bg-surface">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">Talk to procurement</div>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Request a quote for your next industrial program.
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Share your specifications, quantities, and delivery requirements. Our engineers respond within one business day with a fully-documented proposal.
            </p>
          </div>
          <form className="grid gap-3 border border-border bg-card p-6 md:grid-cols-2">
            <Input label="Company" placeholder="Acme Manufacturing Ltd." />
            <Input label="Industry" placeholder="Aerospace" />
            <Input label="Work email" placeholder="procurement@acme.com" />
            <Input label="Phone" placeholder="+1 555 000 0000" />
            <div className="md:col-span-2">
              <Input label="Requirements" placeholder="Equipment, quantities, delivery window…" textarea />
            </div>
            <button type="button" className="md:col-span-2 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
              Send request
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionHeader({ eyebrow, title, dark = false }: { eyebrow: string; title: string; dark?: boolean }) {
  return (
    <div>
      <div className="eyebrow">{eyebrow}</div>
      <h2 className={`mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl ${dark ? "" : ""}`}>{title}</h2>
    </div>
  );
}

function Input({ label, placeholder, textarea = false }: { label: string; placeholder: string; textarea?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea rows={3} placeholder={placeholder} className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      ) : (
        <input placeholder={placeholder} className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none" />
      )}
    </label>
  );
}
