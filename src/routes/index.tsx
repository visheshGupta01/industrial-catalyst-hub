import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Wrench,
  HeadphonesIcon,
  Award,
  Factory,
  ChevronRight,
  ChevronLeft,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";
import { formatINR } from "@/lib/format";
import { cartStore } from "@/lib/cart-store";
import * as Lucide from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategory";
import ProductCarousel from "@/components/site/ProductCarousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FerroCore — Industrial Equipment & Business Solutions" },
      {
        name: "description",
        content:
          "Premium B2B marketplace for industrial machinery, electrical systems, automation, and components. Supplying modern manufacturers worldwide.",
      },
      { property: "og:title", content: "FerroCore — Industrial Equipment & Business Solutions" },
      {
        property: "og:description",
        content:
          "Premium B2B marketplace for industrial machinery, electrical systems, automation, and components.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteLayout>
      <ProductCarousel />

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-surface">
        <div className="container-page motion-stagger grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {[
            { icon: ShieldCheck, label: "Verified Quality" },
            { icon: Truck, label: "Ships Worldwide" },
            { icon: Wrench, label: "Setup & Service Help" },
            { icon: HeadphonesIcon, label: "Support Anytime" },
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
      {/* <section className="container-page py-20">
        <SectionHeader eyebrow="Browse" title="Shop by Category" />
        <div className="motion-stagger mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories?.map((c, i) => (
            <Link
              key={c}
              to="/products"
              search={{ category: c }}
              className="group flex flex-col gap-3 border border-border bg-card p-5 transition-colors hover:border-primary"
            >
              <Factory className="h-7 w-7 text-primary" />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Category {i + 1}
                </div>
                <div className="mt-1 text-sm font-semibold leading-snug">{c}</div>
              </div>
              <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </Link>
          ))}
        </div>
      </section> */}

      {/* FEATURED PRODUCTS */}
      {/* <section className="border-y border-border bg-surface">
        <div className="container-page py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeader eyebrow="Featured" title="Popular Products" />
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
            >
              See all products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="motion-stagger mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section> */}

      {/* WHY US */}
      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Why Choose Us" title="Buying made simple." />
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
              We've spent 40+ years helping factories, energy companies and builders get the
              equipment they need — quickly, with paperwork sorted and real people to help.
            </p>
            <div className="mt-8 space-y-5">
              {[
                {
                  icon: Award,
                  title: "Trusted Suppliers",
                  desc: "We check every supplier so you get genuine, quality-tested products every time.",
                },
                {
                  icon: ShieldCheck,
                  title: "All Documents Included",
                  desc: "Certificates and test reports are shared up front, so there are no surprises.",
                },
                {
                  icon: Wrench,
                  title: "Help With Setup & Spares",
                  desc: "Our team helps with installation, training and finding spare parts later on.",
                },
                {
                  icon: HeadphonesIcon,
                  title: "A Real Person To Talk To",
                  desc: "Every business account gets a dedicated contact who answers within hours, not days.",
                },
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
              <div className="eyebrow">Business Account Perks</div>
              <h3 className="mt-3 text-2xl font-bold leading-tight">
                Better prices for
                <br />
                bigger orders.
              </h3>
              <p className="mt-4 text-sm text-muted-foreground">
                Open a free business account to unlock bulk discounts, flexible payment options and
                a dedicated contact.
              </p>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {[
                  ["Yearly purchases above", "₹40 lakh+"],
                  ["Pay later option", "Available (30 days)"],
                  ["Personal contact", "Included"],
                  ["Product certificates", "Sent with order"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between py-3 text-sm">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-semibold">{v}</span>
                  </div>
                ))}
              </div>
              <button className="mt-6 w-full bg-secondary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-secondary-foreground hover:bg-secondary/90">
                Open a business account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      {/* <section className="border-y border-border bg-secondary text-secondary-foreground">
        <div className="container-page py-20">
          <SectionHeader eyebrow="Who We Help" title="Built for every kind of business." dark />
          <div className="mt-10 grid grid-cols-2 gap-px bg-white/10 sm:grid-cols-4">
            {industries.map((ind) => {
              const Icon =
                (Lucide as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
                  ind.icon
                ] ?? Factory;
              return (
                <div
                  key={ind.name}
                  className="flex flex-col items-start gap-4 bg-secondary p-6 transition-colors hover:bg-secondary/80"
                >
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
      </section> */}

      {/* TESTIMONIALS */}
      {/* <section className="container-page py-20">
        <SectionHeader eyebrow="What Customers Say" title="Loved by buyers across India." />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="border border-border bg-card p-7">
              <div className="text-3xl font-serif text-accent">“</div>
              <blockquote className="mt-2 text-sm leading-relaxed text-foreground">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 border-t border-border pt-4">
                <div className="text-sm font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.title}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section> */}

      {/* CTA */}
      <section id="quote" className="border-t border-border bg-surface">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="eyebrow">Get In Touch</div>
            <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
              Tell us what you need — we'll send a price.
            </h2>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Share a few details about your requirement. Our team gets back to you within one
              working day with a full quote.
            </p>
          </div>
          <form className="grid gap-3 border border-border bg-card p-6 md:grid-cols-2">
            <Input label="Company name" placeholder="Your company" />
            <Input label="What you do" placeholder="e.g. Car parts maker" />
            <Input label="Work email" placeholder="you@company.com" />
            <Input label="Phone" placeholder="+91 98XXX XXXXX" />
            <div className="md:col-span-2">
              <Input
                label="What do you need?"
                placeholder="Tell us the product, quantity and when you need it…"
                textarea
              />
            </div>
            <button
              type="button"
              className="md:col-span-2 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
            >
              Send request
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionHeader({
  eyebrow,
  title,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="eyebrow">{eyebrow}</div>
      <h2
        className={`mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-4xl ${dark ? "" : ""}`}
      >
        {title}
      </h2>
    </div>
  );
}

function Input({
  label,
  placeholder,
  textarea = false,
}: {
  label: string;
  placeholder: string;
  textarea?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-xs">
      <span className="font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      ) : (
        <input
          placeholder={placeholder}
          className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      )}
    </label>
  );
}
