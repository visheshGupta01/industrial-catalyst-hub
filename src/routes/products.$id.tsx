import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Download, ShoppingCart, FileText, Minus, Plus, ShieldCheck, Truck, Award, Phone, Zap, Settings, BadgeCheck, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductImage } from "@/components/site/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { products, type Product } from "@/lib/mock-data";
import { fetchProduct, fetchProducts } from "@/lib/api/products";
import { formatUSD } from "@/lib/format";
import { cartStore, useRecentlyViewed } from "@/lib/cart-store";
import { useAuth } from "@/lib/auth-store";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product ${params.id} — FerroCore` },
    ],
  }),
  component: ProductDetail,
});

const FEATURE_ICONS = [Zap, Settings, ShieldCheck, BadgeCheck];

function ProductDetail() {
  const { id } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [catalog, setCatalog] = useState<Product[]>(products);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"description" | "specifications" | "features">("description");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const recent = useRecentlyViewed();
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cartStore.trackView(product.id);
    setActiveImg(0);
    setQty(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id]);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const recentProducts = recent
    .filter((id) => id !== product.id)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 4) as typeof products;

  const inStock = product.status !== "Out of Stock";

  return (
    <SiteLayout>
      {/* breadcrumb */}
      <div className="border-b border-border bg-surface">
        <div className="container-page py-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Catalog</Link>
          <span className="mx-2">/</span>
          <Link to="/products" search={{ category: product.category }} className="hover:text-primary">{product.category}</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.code}</span>
        </div>
      </div>

      <section className="container-page py-10">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div>
            <div
              className="group relative overflow-hidden border border-border bg-card"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setZoom({
                  x: ((e.clientX - rect.left) / rect.width) * 100,
                  y: ((e.clientY - rect.top) / rect.height) * 100,
                });
              }}
              onMouseLeave={() => setZoom(null)}
            >
              <div
                className="transition-transform duration-200 ease-out"
                style={zoom ? { transform: `scale(2)`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              >
                <ProductImage image={product.image} className="aspect-square" />
              </div>
              <span className="pointer-events-none absolute bottom-3 right-3 hidden bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:block">
                Hover to zoom
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`border bg-card transition-colors ${activeImg === i ? "border-primary" : "border-border hover:border-primary"}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <ProductImage image={product.image} className="aspect-square scale-90" />
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider">
              <span className="bg-primary/10 px-2 py-1 font-semibold text-primary">{product.category}</span>
              <span className="font-mono text-muted-foreground">SKU · {product.code}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-base text-muted-foreground">{product.shortDescription}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-5">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Unit Price</div>
                <div className="text-3xl font-bold">{formatUSD(product.price)}</div>
                <div className="text-xs text-muted-foreground">excl. tax & freight</div>
              </div>
              <div className="ml-auto text-right">
                <div className={`text-sm font-semibold ${
                  product.status === "In Stock" ? "text-emerald-700" :
                  product.status === "Low Stock" ? "text-accent" : "text-destructive"
                }`}>{product.status}</div>
                <div className="text-xs text-muted-foreground">Lead time · 2–4 weeks</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-stretch border border-border">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 hover:bg-surface" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                <input
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 border-x border-border bg-background text-center text-sm font-semibold focus:outline-none"
                />
                <button onClick={() => setQty((q) => q + 1)} className="px-3 hover:bg-surface" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <button
                disabled={!inStock}
                onClick={() => {
                  if (!user) {
                    toast.info("Sign in to add products to your cart");
                    navigate({ to: "/auth" });
                    return;
                  }
                  cartStore.add(product, qty);
                }}
                className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
              >
                <ShoppingCart className="h-4 w-4" /> {user ? "Add to Cart" : "Sign in to purchase"}
              </button>
              <button className="inline-flex items-center gap-2 border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary transition-colors hover:bg-primary hover:text-primary-foreground">
                <FileText className="h-4 w-4" /> Request Quote
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
              <button className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
                <Download className="h-4 w-4" /> Download brochure (PDF, 4.2 MB)
              </button>
              <button className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-primary">
                <Phone className="h-4 w-4" /> Contact sales
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border border-border bg-surface p-4 text-xs">
              {[
                { icon: ShieldCheck, label: "Certified" },
                { icon: Truck, label: "Worldwide ship" },
                { icon: Award, label: "5-year warranty" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 border-b border-border">
          <div className="flex gap-8 overflow-x-auto">
            {(["description", "specifications", "features"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative pb-4 text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="py-10">
          {tab === "description" && (
            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <p className="text-base leading-relaxed text-foreground">{product.description}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Built to industrial duty cycles with field-serviceable components. Documentation
                  package includes CE Declaration of Conformity, material traceability certificates,
                  and commissioning procedures.
                </p>
              </div>
              <aside className="border border-border bg-surface p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">At a glance</div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between border-b border-border py-2"><span className="text-muted-foreground">Origin</span><span className="font-semibold">Germany</span></li>
                  <li className="flex justify-between border-b border-border py-2"><span className="text-muted-foreground">HS Code</span><span className="font-mono">8479.89</span></li>
                  <li className="flex justify-between border-b border-border py-2"><span className="text-muted-foreground">MOQ</span><span className="font-semibold">1 unit</span></li>
                  <li className="flex justify-between py-2"><span className="text-muted-foreground">Payment</span><span className="font-semibold">T/T, L/C, Net-30</span></li>
                </ul>
              </aside>
            </div>
          )}
          {tab === "specifications" && (
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={s.label} className={i % 2 ? "bg-surface" : "bg-card"}>
                      <th className="w-1/3 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</th>
                      <td className="px-5 py-3 font-medium">{s.value}</td>
                    </tr>
                  ))}
                  <tr className="bg-surface"><th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Material</th><td className="px-5 py-3 font-medium">Cast iron / SS316 / Alloy steel</td></tr>
                  <tr className="bg-card"><th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Certification</th><td className="px-5 py-3 font-medium">CE · ISO 9001:2015 · RoHS</td></tr>
                </tbody>
              </table>
            </div>
          )}
          {tab === "features" && (
            <ul className="grid gap-4 md:grid-cols-2">
              {product.features.map((f, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                return (
                  <li key={f} className="flex items-start gap-4 border border-border bg-card p-5 text-sm transition-colors hover:border-primary">
                    <div className="grid h-10 w-10 shrink-0 place-items-center bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{f}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold">Related products</h2>
              <Link to="/products" search={{ category: product.category }} className="text-sm font-semibold text-primary hover:underline">View all →</Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}

        {recentProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Recently viewed</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
