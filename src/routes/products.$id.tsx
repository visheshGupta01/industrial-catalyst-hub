import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Download,
  ShoppingCart,
  FileText,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  Award,
  Phone,
  Loader2,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductImage } from "@/components/site/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { formatINR } from "@/lib/format";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$id")({
  head: ({ params }) => ({
    meta: [{ title: `Product ${params.id} — FerroCore` }],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { data: product, isLoading, isError } = useProduct(id);
  const [tab, setTab] = useState<"description" | "specifications" | "features">("description");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const user = useAuth();
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const { data: relatedResponse } = useProducts({
    category: product?.category._id,
    page: 1,
    limit: 4,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container-page flex items-center justify-center gap-2 py-32 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading product...
        </div>
      </SiteLayout>
    );
  }

  if (isError || !product) {
    return (
      <SiteLayout>
        <div className="container-page py-32 text-center">Product not found.</div>
      </SiteLayout>
    );
  }

  const related = relatedResponse?.products.filter((p) => p._id !== product?._id) ?? [];

  const status =
    product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? "Low Stock" : "In Stock";

  const inStock = product.stock > 0;
  return (
    <SiteLayout>
      {/* breadcrumb */}
      <div className="border-b border-border bg-surface">
        <div className="container-page py-4 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">
            Catalog
          </Link>
          <span className="mx-2">/</span>
          <Link
            to="/products"
            search={{ category: product.category._id }}
            className="hover:text-primary"
          >
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.sku}</span>
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
                style={
                  zoom
                    ? { transform: `scale(2)`, transformOrigin: `${zoom.x}% ${zoom.y}%` }
                    : undefined
                }
              >
                <ProductImage image={product.images[activeImg]?.url} className="aspect-square" />
              </div>
              <span className="pointer-events-none absolute bottom-3 right-3 hidden bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:block">
                Hover to zoom
              </span>
            </div>
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`border bg-card transition-colors ${activeImg === i ? "border-primary" : "border-border hover:border-primary"}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <ProductImage image={image.url} className="aspect-square scale-90" />
                </button>
              ))}
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`border bg-card transition-colors ${activeImg === i ? "border-primary" : "border-border hover:border-primary"}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <ProductImage
                    image={product.images[activeImg]?.url}
                    className="aspect-square scale-90"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-wider">
              <span className="bg-primary/10 px-2 py-1 font-semibold text-primary">
                {product.category.name}
              </span>
              <span className="font-mono text-muted-foreground">SKU · {product.sku}</span>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">{product.name}</h1>
            <p className="mt-3 text-base text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-border py-5">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Unit Price
                </div>
                {product.discountPrice ? (
                  <>
                    <div className="text-3xl font-bold">{formatINR(product.discountPrice)}</div>

                    <div className="line-through text-muted-foreground">
                      {formatINR(product.price)}
                    </div>
                  </>
                ) : (
                  <div className="text-3xl font-bold">{formatINR(product.price)}</div>
                )}{" "}
                <div className="text-xs text-muted-foreground">excl. tax & freight</div>
              </div>
              <div className="ml-auto text-right">
                <div
                  className={`text-sm font-semibold ${
                    status === "In Stock"
                      ? "text-emerald-700"
                      : status === "Low Stock"
                        ? "text-accent"
                        : "text-destructive"
                  }`}
                >
                  {status}
                </div>
                <div className="text-xs text-muted-foreground">Lead time · 2–4 weeks</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-stretch border border-border">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 hover:bg-surface"
                  aria-label="Decrease"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 border-x border-border bg-background text-center text-sm font-semibold focus:outline-none"
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 hover:bg-surface"
                  aria-label="Increase"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                disabled={!inStock || addToCart.isPending}
                onClick={() => {
                  if (!user) {
                    toast.info("Sign in to add products to your cart");
                    navigate({ to: "/auth" });
                    return;
                  }
                  addToCart.mutate({
                    productId: product._id,
                    quantity: qty,
                  });
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
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  At a glance
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">Origin</span>
                    <span className="font-semibold">Germany</span>
                  </li>
                  <li className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">HS Code</span>
                    <span className="font-mono">8479.89</span>
                  </li>
                  <li className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">MOQ</span>
                    <span className="font-semibold">1 unit</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span className="text-muted-foreground">Payment</span>
                    <span className="font-semibold">T/T, L/C, Net-30</span>
                  </li>
                </ul>
              </aside>
            </div>
          )}
          {tab === "specifications" && (
            <div className="overflow-x-auto border border-border">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <th className="w-1/3 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {key}
                      </th>
                      <td className="px-5 py-3 font-medium">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold">Related products</h2>
              <Link
                to="/products"
                search={{ category: product.category._id }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
