import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { products as fallbackProducts, type Product } from "@/lib/mock-data";
import { fetchProducts } from "@/lib/api/products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Industrial Product Catalog — FerroCore" },
      { name: "description", content: "Browse industrial machinery, electrical systems, automation, pneumatics, and components from qualified suppliers." },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { category, q } = Route.useSearch({ select: (s: { category?: string; q?: string }) => s }) as { category?: string; q?: string };
  const [search, setSearch] = useState(q ?? "");
  const [cat, setCat] = useState(category ?? "All");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [mobileFilters, setMobileFilters] = useState(false);
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchProducts()
      .then((list) => { if (active) setProducts(list); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let r = products;
    if (cat !== "All") r = r.filter((p) => p.category === cat);
    if (search) {
      const s = search.toLowerCase();
      r = r.filter((p) => p.name.toLowerCase().includes(s) || p.code.toLowerCase().includes(s) || p.category.toLowerCase().includes(s));
    }
    const arr = [...r];
    if (sort === "price-asc") arr.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") arr.sort((a, b) => b.price - a.price);
    if (sort === "name") arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [cat, search, sort]);

  const filterPanel = (
    <>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider">Category</h4>
        <ul className="mt-3 space-y-1.5 text-sm">
          {["All", ...categories].map((c) => (
            <li key={c}>
              <button
                onClick={() => setCat(c)}
                className={`flex w-full items-center justify-between border-l-2 px-3 py-1.5 text-left transition-colors ${
                  cat === c ? "border-accent bg-surface font-semibold text-primary" : "border-transparent hover:border-border hover:bg-surface"
                }`}
              >
                <span>{c}</span>
                <span className="text-xs text-muted-foreground">
                  {c === "All" ? products.length : products.filter((p) => p.category === c).length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Availability</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {["In Stock", "Low Stock", "Out of Stock"].map((s) => (
            <li key={s} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="accent-primary" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Certification</h4>
        <ul className="mt-3 space-y-2 text-sm">
          {["CE", "ISO 9001", "ATEX", "REACH", "UL"].map((s) => (
            <li key={s} className="flex items-center gap-2">
              <input type="checkbox" className="accent-primary" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Price range (₹)</h4>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <input placeholder="Min" className="w-full border border-input bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none" />
          <span className="text-muted-foreground">—</span>
          <input placeholder="Max" className="w-full border border-input bg-background px-2 py-1.5 text-sm focus:border-primary focus:outline-none" />
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-5 lg:hidden">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Sort by</h4>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="mt-3 w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>
    </>
  );

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-12">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-foreground">Product Catalog</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Industrial Product Catalog</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {filtered.length} products across {categories.length} engineered categories — fully certified, in stock, ready for global shipment.
          </p>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="border border-border bg-card p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </div>
              <div className="mt-5">{filterPanel}</div>
            </div>
          </aside>

          <div>
            <button
              onClick={() => setMobileFilters(true)}
              className="mb-3 inline-flex w-full items-center justify-center gap-2 border border-border bg-card px-4 py-3 text-sm font-semibold uppercase tracking-wider hover:border-primary hover:text-primary lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" /> Filter & Sort
            </button>

            <div className="flex flex-wrap items-center gap-3 border border-border bg-card p-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, SKU, or specification…"
                  className="w-full border border-input bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="hidden border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none lg:block"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>

            {filtered.length === 0 ? (
              <div className="mt-6 border border-dashed border-border bg-surface p-16 text-center">
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or clearing your search.</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog">
          <div onClick={() => setMobileFilters(false)} className="absolute inset-0 bg-black/40 animate-fade-in" />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-background shadow-2xl animate-slide-up">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Filter & Sort</h3>
              </div>
              <button onClick={() => setMobileFilters(false)} className="p-1" aria-label="Close filters">
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="p-5">{filterPanel}</div>
            <footer className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-border bg-background p-4">
              <button onClick={() => { setCat("All"); setSearch(""); }} className="border border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary">
                Clear all
              </button>
              <button onClick={() => setMobileFilters(false)} className="bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90">
                Show {filtered.length} results
              </button>
            </footer>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
