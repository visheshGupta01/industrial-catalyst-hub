import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Download, ShoppingCart, FileText, Minus, Plus, ShieldCheck, Truck, Award } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductImage } from "@/components/site/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { getProduct, products } from "@/lib/mock-data";
import { formatUSD } from "@/lib/format";
import { cartStore } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to="/products" className="mt-6 inline-block text-primary hover:underline">Back to catalog</Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ reset }) => (
    <SiteLayout>
      <div className="container-page py-24 text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <button onClick={reset} className="mt-4 bg-primary px-4 py-2 text-sm text-primary-foreground">Try again</button>
      </div>
    </SiteLayout>
  ),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — FerroCore` },
          { name: "description", content: loaderData.product.shortDescription },
        ]
      : [],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData() as { product: NonNullable<ReturnType<typeof getProduct>> };
  const [tab, setTab] = useState<"description" | "specifications" | "features">("description");
  const [qty, setQty] = useState(1);

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
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
            <div className="border border-border bg-card">
              <ProductImage image={product.image} className="aspect-square" />
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((i) => (
                <button key={i} className={`border bg-card transition-colors ${i === 0 ? "border-primary" : "border-border hover:border-primary"}`}>
                  <ProductImage image={product.image} className="aspect-square scale-90" />
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider">
              <span className="bg-primary/10 px-2 py-1 font-semibold text-primary">{product.category}</span>
              <span className="font-mono text-muted-foreground">SKU · {product.code}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-base text-muted-foreground">{product.shortDescription}</p>

            <div className="mt-6 flex items-center gap-4 border-y border-border py-5">
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
                onClick={() => { cartStore.add(product, qty); toast.success("Added to cart"); }}
                className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
              >
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
              <button className="inline-flex items-center gap-2 border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground">
                <FileText className="h-4 w-4" /> Request Quote
              </button>
            </div>

            <button className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <Download className="h-4 w-4" /> Download technical brochure (PDF, 4.2 MB)
            </button>

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
          <div className="flex gap-8">
            {(["description", "specifications", "features"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative pb-4 text-sm font-semibold uppercase tracking-wider transition-colors ${
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
                <div className="eyebrow">At a glance</div>
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
                </tbody>
              </table>
            </div>
          )}
          {tab === "features" && (
            <ul className="grid gap-3 md:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-start gap-3 border border-border bg-card p-4 text-sm">
                  <span className="mt-1 h-2 w-2 shrink-0 bg-accent" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold">Related products</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
