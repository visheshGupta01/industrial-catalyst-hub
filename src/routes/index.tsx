import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  RotateCcw,
  Star,
  Sparkles,
  Tag,
  Mail,
  Zap,
  Package,
  ChevronRight,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductImage } from "@/components/site/ProductImage";
import { formatINR } from "@/lib/format";
import { useProducts, useFeaturedProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategory";
import ProductCarousel from "@/components/site/ProductCarousel";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FerroCore — Shop Industrial Tools, Machinery & Parts Online" },
      {
        name: "description",
        content:
          "Shop machinery, power tools, electrical, automation and industrial parts online. Best prices, fast delivery across India, easy returns and 24/7 support.",
      },
      { property: "og:title", content: "FerroCore — Industrial E-commerce" },
      {
        property: "og:description",
        content:
          "Shop machinery, tools and industrial parts online. Best prices, fast delivery, easy returns.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: categories = [] } = useCategories();
  const { data: featured, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: newest, isLoading: newestLoading } = useProducts({
    page: 1,
    limit: 8,
    sort: "newest",
  });

  const featuredList = featured?.products ?? [];
  const newestList = newest?.products ?? [];
  const dealProduct = featuredList.find((p) => p.discountPrice) ?? featuredList[0];

  return (
    <SiteLayout>
      {/* HERO CAROUSEL */}
      <ProductCarousel />

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-card">
        <div className="container-page motion-stagger grid grid-cols-2 gap-4 py-6 md:grid-cols-4 md:gap-6 md:py-8">
          {[
            { icon: Truck, label: "Free Delivery", sub: "On orders above ₹50,000" },
            { icon: RotateCcw, label: "Easy Returns", sub: "7-day replacement" },
            { icon: ShieldCheck, label: "Genuine Products", sub: "100% verified sellers" },
            { icon: Headphones, label: "24/7 Support", sub: "Real experts on call" },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground">{label}</div>
                <div className="truncate text-xs text-muted-foreground">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="container-page py-14 md:py-20">
        <SectionHeader
          eyebrow="Browse"
          title="Shop by Category"
          cta={{ label: "View all", to: "/products" }}
        />
        <div className="motion-stagger mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {categories.slice(0, 12).map((c) => (
            <Link
              key={c._id}
              to="/products"
              search={{ category: c._id }}
              className="group flex flex-col items-center gap-3 border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:premium-shadow"
            >
              <div className="grid aspect-square w-full place-items-center overflow-hidden bg-surface">
                {c.image?.url ? (
                  <img
                    src={c.image.url}
                    alt={c.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <Package className="h-8 w-8 text-primary/60" />
                )}
              </div>
              <div className="line-clamp-2 text-xs font-semibold leading-snug transition-colors group-hover:text-primary md:text-sm">
                {c.name}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* DEAL BANNER */}
      {dealProduct && (
        <section className="border-y border-border bg-surface">
          <div className="container-page grid items-center gap-8 py-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:py-16">
            <div>
              <div className="inline-flex items-center gap-2 bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-foreground">
                <Zap className="h-3.5 w-3.5" /> Deal of the Day
              </div>
              <h2 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
                {dealProduct.name}
              </h2>
              <p className="mt-3 line-clamp-3 max-w-lg text-sm text-muted-foreground md:text-base">
                {dealProduct.description}
              </p>
              <div className="mt-5 flex items-baseline gap-3">
                {dealProduct.discountPrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary md:text-4xl">
                      {formatINR(dealProduct.discountPrice)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatINR(dealProduct.price)}
                    </span>
                    <span className="bg-success/10 px-2 py-0.5 text-xs font-bold text-success">
                      {Math.round(
                        ((dealProduct.price - dealProduct.discountPrice) / dealProduct.price) * 100,
                      )}
                      % OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary md:text-4xl">
                    {formatINR(dealProduct.price)}
                  </span>
                )}
              </div>
              <Link
                to="/products/$id"
                params={{ id: dealProduct._id }}
                className="interactive-sheen mt-6 inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative order-first md:order-last">
              <div className="absolute -inset-3 border border-primary/20" />
              <div className="relative bg-card p-6 premium-shadow">
                <ProductImage
                  image={dealProduct.images?.[0]?.url}
                  alt={dealProduct.name}
                  className="aspect-4/3"
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FEATURED PRODUCTS */}
      <section className="container-page py-14 md:py-20">
        <SectionHeader
          eyebrow="Featured"
          title="Top Picks for You"
          cta={{ label: "See all products", to: "/products" }}
        />
        <div className="motion-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featuredList
                .slice(0, 8)
                .map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* PROMO STRIP */}
      <section className="border-y border-border">
        <div className="container-page grid gap-0 md:grid-cols-3">
          {[
            {
              icon: Tag,
              title: "Bulk Order Discounts",
              desc: "Save up to 30% on wholesale orders",
              cta: "Get pricing",
            },
            {
              icon: Sparkles,
              title: "New Arrivals Weekly",
              desc: "Latest tools and equipment every week",
              cta: "Explore",
            },
            {
              icon: ShieldCheck,
              title: "1-Year Warranty",
              desc: "Full manufacturer coverage on all products",
              cta: "Learn more",
            },
          ].map(({ icon: Icon, title, desc, cta }, i) => (
            <Link
              key={title}
              to="/products"
              className={`group flex items-center gap-4 bg-card p-6 transition-colors hover:bg-surface md:p-8 ${
                i < 2 ? "border-b border-border md:border-b-0 md:border-r" : ""
              }`}
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold md:text-base">{title}</div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground md:text-sm">
                  {desc}
                </div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  {cta} <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      <section className="container-page py-14 md:py-20">
        <SectionHeader
          eyebrow="Just In"
          title="New Arrivals"
          cta={{ label: "Shop new", to: "/products" }}
        />
        <div className="motion-stagger mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {newestLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : newestList.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-border bg-surface">
        <div className="container-page py-14 md:py-20">
          <SectionHeader eyebrow="Reviews" title="Trusted by 12,000+ businesses" />
          <div className="motion-stagger mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Rajesh Kumar",
                title: "Plant Manager, Auto Parts Ltd.",
                quote:
                  "Ordered a full set of industrial drills. Delivery was on time and the quality is exactly as promised. Best online supplier we've used.",
              },
              {
                name: "Priya Sharma",
                title: "Owner, Sharma Fabricators",
                quote:
                  "Great prices on bulk orders and the support team helped us pick the right welding equipment. Will definitely order again.",
              },
              {
                name: "Anil Verma",
                title: "MD, Verma Electricals",
                quote:
                  "Wide selection, transparent pricing and quick shipping. Their bulk discount saved us over ₹1.2 lakh on our last order.",
              },
            ].map((t) => (
              <figure key={t.name} className="border border-border bg-card p-6 md:p-7">
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-foreground">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 border-t border-border pt-4">
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.title}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-b border-border bg-secondary industrial-panel text-secondary-foreground">
        <div className="container-page grid items-center gap-8 py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:py-16">
          <div>
            <div className="inline-flex items-center gap-2 bg-accent/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
              <Mail className="h-3.5 w-3.5" /> Newsletter
            </div>
            <h2 className="mt-4 text-2xl font-bold leading-tight md:text-3xl">
              Get deals, new launches & offers in your inbox.
            </h2>
            <p className="mt-3 max-w-md text-sm opacity-75">
              Join 25,000+ buyers who get the best industrial deals first. No spam, unsubscribe
              anytime.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </SiteLayout>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!email) return;
        toast.success("Thanks! You're subscribed.");
        setEmail("");
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your.email@company.com"
        className="flex-1 border border-secondary-foreground/20 bg-secondary-foreground/5 px-4 py-3 text-sm text-secondary-foreground placeholder:text-secondary-foreground/50 focus:border-accent focus:outline-none"
      />
      <button
        type="submit"
        className="interactive-sheen bg-accent px-6 py-3 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90"
      >
        Subscribe
      </button>
    </form>
  );
}

function SectionHeader({
  eyebrow,
  title,
  cta,
}: {
  eyebrow: string;
  title: string;
  cta?: { label: string; to: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h2 className="mt-2 max-w-2xl text-2xl font-bold leading-tight md:text-3xl lg:text-4xl">
          {title}
        </h2>
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary transition-all hover:gap-2"
        >
          {cta.label} <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
