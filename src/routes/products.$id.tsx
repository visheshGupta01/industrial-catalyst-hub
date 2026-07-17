import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Layers,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductImage } from "@/components/site/ProductImage";
import { ProductCard } from "@/components/site/ProductCard";
import { formatINR } from "@/lib/format";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useCreateQuote } from "@/hooks/useQuote";
// Import UI Modal Components
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/products/$id")({
  validateSearch: (search: Record<string, unknown>) => ({
    openQuote: (search.openQuote as "standard" | "bulk") || undefined,
  }),
  head: ({ params }) => ({
    meta: [{ title: `Product ${params.id} — FerroCore` }],
  }),
  component: ProductDetail,
});

function ProductDetail() {
  const { openQuote } = Route.useSearch(); // 2. Pull the token out of search parameters
  const { id } = Route.useParams();
  const { data: product, isLoading, isError } = useProduct(id);
  const [tab, setTab] = useState<"description" | "specifications" | "features">("description");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  // FIX 1: Destructure user data cleanly out of the query container
  const { data: user } = useAuth();

  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const createQuote = useCreateQuote();
  // Modal Dialog UI Visibility States
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteType, setQuoteType] = useState<"standard" | "bulk">("standard");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    companyName: "",
    notes: "",
  });

  const { data: relatedResponse } = useProducts({
    category: product?.category._id,
    page: 1,
    limit: 4,
  });
  useEffect(() => {
    if (openQuote && user) {
      setQuoteType(openQuote);
      setIsQuoteModalOpen(true);
    }
  }, [openQuote, user]);
  // Pre-populate form variables automatically once auth loading resolves
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container-page flex items-center justify-center gap-2 py-32 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading product details...
        </div>
      </SiteLayout>
    );
  }

  if (isError || !product) {
    return (
      <SiteLayout>
        <div className="container-page py-32 text-center">Industrial product record not found.</div>
      </SiteLayout>
    );
  }

  const related = relatedResponse?.products.filter((p) => p._id !== product?._id) ?? [];

  const status =
    product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? "Low Stock" : "In Stock";

  const inStock = product.stock > 0;

  const openQuoteWizard = (type: "standard" | "bulk") => {
    if (!user) {
      toast.info("Please sign in to log procurement requests.");
      navigate({ to: "/auth" });
      return;
    }
    setQuoteType(type);
    setIsQuoteModalOpen(true);
  };

  const submitQuoteForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.notes.trim()
    ) {
      toast.error("Please fill in all required operational information fields.");
      return;
    }

    try {
      await createQuote.mutateAsync({
        productId: product._id,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        companyName: formData.companyName,
        requirementType: quoteType,
        notes: formData.notes,
      });
      setIsQuoteModalOpen(false);
      setFormData((prev) => ({ ...prev, notes: "" })); // Clear notes context on complete
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <SiteLayout>
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
          {/* Gallery Canvas Column */}
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

            {/* FIX 2: Removed duplicated hardcoded [0,1,2,3] sub-button layer loops */}
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-3">
                {product.images.map((image, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`border bg-card transition-colors ${activeImg === i ? "border-primary" : "border-border hover:border-primary"}`}
                    aria-label={`View asset thumbnail ${i + 1}`}
                  >
                    <ProductImage image={image.url} className="aspect-square scale-90" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info Details Panel Column */}
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
                  Unit Pricing
                </div>
                {product.discountPrice ? (
                  <>
                    <div className="text-3xl font-bold text-primary">
                      {formatINR(product.discountPrice)}
                    </div>
                    <div className="line-through text-xs text-muted-foreground">
                      {formatINR(product.price)}
                    </div>
                  </>
                ) : (
                  <div className="text-3xl font-bold">{formatINR(product.price)}</div>
                )}
                <div className="text-xs text-muted-foreground">excl. B2B freight liabilities</div>
              </div>
              <div className="ml-auto text-right">
                <div
                  className={`text-sm font-semibold ${
                    status === "In Stock"
                      ? "text-emerald-700"
                      : status === "Low Stock"
                        ? "text-amber-600"
                        : "text-destructive"
                  }`}
                >
                  {status}
                </div>
                <div className="text-xs text-muted-foreground">Lead time · 2–4 weeks</div>
              </div>
            </div>

            {/* Quantity Controller Panel Input */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {/* Quantity Increment Controller */}
              <div className="inline-flex items-stretch border border-border bg-background">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 hover:bg-surface transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <input
                  type="text"
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                  className="w-14 border-x border-border bg-background text-center text-sm font-semibold focus:outline-none"
                />
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="px-3 hover:bg-surface transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Dynamic Shippable Button Gate Layer */}
              {product.shipping?.isShippable ? (
                <button
                  disabled={!inStock || addToCart.isPending}
                  onClick={() => addToCart.mutate({ productId: product._id, quantity: qty })}
                  className="bg-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  Buy Now / Add to Cart
                </button>
              ) : (
                <button
                  onClick={() => openQuoteWizard("standard")}
                  className="bg-blue-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-blue-700"
                >
                  <FileText className="h-4 w-4 inline mr-2" /> Request Custom Quote
                </button>
              )}

              <button
                onClick={() => openQuoteWizard("bulk")}
                className="border border-primary px-6 py-3 text-sm font-semibold uppercase tracking-wider text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Layers className="h-4 w-4 inline mr-2" /> Bulk Buy / RFQ
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-sm">
              <button className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
                <Download className="h-4 w-4" /> Download technical datasheet (PDF)
              </button>
              <button className="inline-flex items-center gap-2 font-medium text-muted-foreground hover:text-primary">
                <Phone className="h-4 w-4" /> Contact factory sales engineer
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 border border-border bg-surface p-4 text-xs">
              {[
                { icon: ShieldCheck, label: "ISO Certified" },
                {
                  icon: Truck,
                  label: product.shipping?.isShippable
                    ? "Courier Serviceable"
                    : "Freight Shipping Only",
                },
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

        {/* Tab Selection Layers Container */}
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
                  Engineered to maximum industrial utility standards with field-serviceable modular
                  architecture components. Documentation envelope packages include CE Declaration of
                  Conformity registry, full material batch traceability certificates, and validation
                  onboarding metrics.
                </p>
              </div>
              <aside className="border border-border bg-surface p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Specifications Summary
                </div>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">Fulfillment Model</span>
                    <span className="font-semibold text-primary">
                      {product.shipping?.isShippable ? "Direct Courier Box" : "Heavy LTL Freight"}
                    </span>
                  </li>
                  <li className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">Origin Hub</span>
                    <span className="font-semibold">Germany Eurozone</span>
                  </li>
                  <li className="flex justify-between border-b border-border py-2">
                    <span className="text-muted-foreground">HS Nomenclature Code</span>
                    <span className="font-mono text-xs">8479.89.99</span>
                  </li>
                  <li className="flex justify-between py-2">
                    <span className="text-muted-foreground">Procurement Window</span>
                    <span className="font-semibold">T/T Wire, Net-30 Verified Corporate PO</span>
                  </li>
                </ul>
              </aside>
            </div>
          )}
          {tab === "specifications" && product.specifications && (
            <div className="overflow-x-auto border border-border bg-card">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr
                      key={key}
                      className="border-b border-border last:border-0 hover:bg-surface/40"
                    >
                      <th className="w-1/3 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-surface/50">
                        {key}
                      </th>
                      <td className="px-5 py-3 font-medium">{String(value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Related Assets Canvas Carousels */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-baseline justify-between">
              <h2 className="text-2xl font-bold">Related Equipment Catalog</h2>
              <Link
                to="/products"
                search={{ category: product.category._id }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all categories →
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
      <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
        <DialogContent className="sm:max-w-[500px] border border-border bg-card p-6 rounded-none">
          <DialogHeader className="border-b border-border pb-3">
            <DialogTitle className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground flex items-center gap-2">
              {quoteType === "bulk" ? (
                <Layers className="h-4 w-4 text-primary" />
              ) : (
                <FileText className="h-4 w-4 text-primary" />
              )}
              {quoteType === "bulk" ? "B2B Wholesale Bulk RFQ" : "Technical Procurement Quote"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={submitQuoteForm} className="mt-4 space-y-4">
            <div className="bg-surface border p-3 flex gap-3 text-xs">
              <ProductImage
                image={product.images[0]?.url}
                className="h-12 w-12 border object-cover bg-background shrink-0"
              />
              <div className="min-w-0">
                <div className="font-semibold text-foreground truncate">{product.name}</div>
                <div className="text-muted-foreground mt-0.5">SKU: {product.sku}</div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Full Name *
                </span>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                  className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs">
                <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                  Contact Phone *
                </span>
                <input
                  required
                  type="tel"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={(e) =>
                    /^\d*$/.test(e.target.value) &&
                    setFormData((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </label>
            </div>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                Corporate Email *
              </span>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                Company Name (Optional)
              </span>
              <input
                type="text"
                placeholder="Enterprise Pvt Ltd"
                value={formData.companyName}
                onChange={(e) => setFormData((p) => ({ ...p, companyName: e.target.value }))}
                className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold uppercase tracking-wider text-muted-foreground">
                Detailed Specification Requirements *
              </span>
              <textarea
                required
                rows={4}
                placeholder={
                  quoteType === "bulk"
                    ? "Please state target logistics deadlines, required customized sizing adjustments, or expected compliance testing documentation folders..."
                    : "Provide custom sizing, delivery timelines, or target pricing requirements..."
                }
                value={formData.notes}
                onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                className="border border-input bg-background px-3 py-2 text-sm resize-none focus:border-primary focus:outline-none"
              />
            </label>

            <div className="flex justify-end gap-3 pt-2 border-t border-border mt-6">
              <button
                type="button"
                onClick={() => setIsQuoteModalOpen(false)}
                className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider border border-border bg-background hover:bg-surface"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createQuote.isPending}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-60 flex items-center gap-1.5"
              >
                {createQuote.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Submit RFQ Request
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}
