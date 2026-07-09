import { useFeaturedProducts, useProducts } from "@/hooks/useProducts";
import { useState, useEffect } from "react";
import { ChevronLeft, ShoppingCart, CheckCircle2, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ProductImage } from "./ProductImage";
import { formatINR } from "@/lib/format";
import { useAddToCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function ProductCarousel() {
  const [idx, setIdx] = useState(0);
  const user = useAuth();
  const addToCart = useAddToCart();
  const { data, isLoading } = useFeaturedProducts();
  const slides = data?.products ?? [];

  useEffect(() => {
    if (slides.length <= 1) return;

    if (idx >= slides.length) {
      setIdx(0);
    }

    const interval = setInterval(() => {
      setIdx((i) => (i + 1) % slides.length);
    }, 6500);

    return () => clearInterval(interval);
  }, [slides.length]);


  const go = (delta: number) => setIdx((i) => (i + delta + slides.length) % slides.length);

  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary industrial-panel text-secondary-foreground">
      <div className="pointer-  events-none absolute inset-0 hairline-grid opacity-15" />
      <div className="relative min-h-[570px] md:min-h-[620px]">
        {slides?.map((product, i) => {
          const status =
            product.stock === 0 ? "Out of Stock" : product.stock <= 5 ? "Low Stock" : "In Stock";
          return (
            <div
              key={product._id}
              className={`transition-all duration-700 ease-out ${i === idx ? "translate-x-0 opacity-100" : "pointer-events-none absolute inset-0 translate-x-8 opacity-0"}`}
              aria-hidden={i !== idx}
            >
              <div className="container-page relative grid items-center gap-8 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(380px,0.8fr)] lg:gap-16">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 border border-secondary-foreground/20 bg-secondary-foreground/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" /> Featured ·{" "}
                    {product.category.name}
                  </div>
                  <h1 className="mt-6 text-4xl font-bold leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
                    {product.name}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed opacity-75 md:text-lg">
                    {product.description} Comes with full setup help and after-sales support.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs opacity-80">
                    {Object.entries(product.specifications)
                      .slice(0, 3)
                      .map(([key, value]) => (
                        <span key={key} className="flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-steel" />
                          <span className="font-medium">{key}:</span> {value}
                        </span>
                      ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to="/products/$id"
                      params={{ id: product._id }}
                      className="interactive-sheen inline-flex items-center gap-2 bg-accent px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-accent-foreground hover:-translate-y-0.5 hover:bg-accent/90"
                    >
                      View details <ArrowRight className="h-4 w-4" />
                    </Link>
                    {user ? (
                      <button
                        disabled={addToCart.isPending}
                        onClick={() =>
                          addToCart.mutate({
                            productId: product._id,
                            quantity: 1,
                          })
                        }
                      >
                        {addToCart.isPending ? "Adding..." : "Add to Cart"}
                      </button>
                    ) : (
                      <Link
                        to="/auth"
                        className="inline-flex items-center gap-2 border border-secondary-foreground/30 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider hover:border-accent hover:text-accent"
                      >
                        Sign in to buy
                      </Link>
                    )}
                  </div>
                </div>
                <div className="relative hidden lg:block">
                  <div className="absolute -inset-5 border border-steel/30" />
                  <div className="relative bg-background p-7 premium-shadow">
                    <div className="absolute left-0 top-0 bg-copper px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                      {product.sku}
                    </div>
                    <ProductImage
                      image={product.images[0].url || undefined}
                      className="aspect-4/3"
                    />
                    <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4 border-t border-border pt-4 text-foreground">
                      <div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                          Price
                        </div>
                        <div>
                          {product.discountPrice ? (
                            <>
                              <div className="text-2xl font-bold">
                                {formatINR(product.discountPrice)}
                              </div>

                              <div className="text-sm line-through text-muted-foreground">
                                {formatINR(product.price)}
                              </div>
                            </>
                          ) : (
                            <div className="text-2xl font-bold">{formatINR(product.price)}</div>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-success">{status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="container-page absolute inset-x-0 bottom-5 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {slides.map((product, i) => (
            <button
              key={product._id}
              onClick={() => setIdx(i)}
              aria-label={`Show ${product.name}`}
              className={`h-1 transition-all ${i === idx ? "w-10 bg-accent" : "w-6 bg-secondary-foreground/30 hover:bg-secondary-foreground/60"}`}
            />
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <button
            onClick={() => go(-1)}
            aria-label="Previous product"
            className="border border-secondary-foreground/30 p-2 hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next product"
            className="border border-secondary-foreground/30 p-2 hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
