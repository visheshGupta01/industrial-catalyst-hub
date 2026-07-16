import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { ProductGridSkeleton } from "@/components/skeletons/ProductGridSkeleton";
import { EmptyState } from "@/components/states/EmptyState";
import { ErrorState } from "@/components/states/ErrorState";
import { Spinner } from "@/components/ui/spinner";
import { useCategories } from "@/hooks/useCategory";
import { ProductFilters } from "@/types/product";
import { useProductFilters } from "@/hooks/useProductFilters";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "Industrial Product Catalog — FerroCore" },
      {
        name: "description",
        content:
          "Browse industrial machinery, electrical systems, automation, pneumatics, and components from qualified suppliers.",
      },
    ],
  }),
  validateSearch: (search) => ({
    q: search.q ?? "",
    category: search.category,
    page: Number(search.page ?? 1),
    sort: search.sort ?? "newest",
    minPrice: search.minPrice ? Number(search.minPrice) : undefined,
    maxPrice: search.maxPrice ? Number(search.maxPrice) : undefined,
    inStock: search.inStock === "true",
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [mobileFilters, setMobileFilters] = useState(false);
  const { data: filterData } = useProductFilters();
  const search = Route.useSearch();
  const navigate = Route.useNavigate();

  const filters: ProductFilters = {
    keyword: search.q,
    category: search.category,
    page: search.page,
    sort: search.sort,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    inStock: search.inStock,
    limit: 12,
  };
  const { data, isLoading, isFetching, isError, error } = useProducts(filters);
  const products = data?.products ?? [];

  const pagination = data?.pagination;
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const categorySpecifications = filters.category ? (filterData?.specifications ?? {}) : {};

  const updateFilters = (updates: Partial<ProductFilters>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...updates,
      }),
      replace: true,
    });
  };

  const filterPanel = (
    <>
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider">Category</h4>

        <ul className="mt-3 space-y-1.5 text-sm">
          <li>
            <button
              onClick={() => updateFilters({ category: undefined, page: 1 })}
              className={`w-full text-left ${
                !filters.category ? "font-semibold text-primary" : ""
              }`}
            >
              All
            </button>
          </li>

          {filterData?.global.categories.map((category) => (
            <li key={category._id}>
              <button
                onClick={() => updateFilters({ category: category._id, page: 1 })}
                className={`w-full text-left ${
                  filters.category === category._id ? "font-semibold text-primary" : ""
                }`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 border-t border-border pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Availability</h4>

        <ul className="mt-3 space-y-2 text-sm">
          {filterData?.global.availability.map((item) => (
            <li key={item.label} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.inStock ?? false}
                onChange={(e) => updateFilters({ inStock: e.target.checked, page: 1 })}
              />
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
      {Object.entries(categorySpecifications).map(([specName, values]) => (
        <div key={specName} className="mt-6 border-t border-border pt-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider">{specName}</h4>

          <ul className="mt-3 space-y-2 text-sm">
            {values.map((value) => {
              const selected = filters.specifications?.[specName]?.includes(value);

              return (
                <li key={value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(e) => {
                      updateFilters({
                        specifications: {
                          ...filters.specifications,
                          [specName]: e.target.checked
                            ? [...(filters.specifications?.[specName] ?? []), value]
                            : (filters.specifications?.[specName] ?? []).filter((v) => v !== value),
                        },
                        page: 1,
                      });
                    }}
                  />

                  <span>{value}</span>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      <div className="mt-6 border-t border-border pt-5">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Price range (₹)</h4>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <input
            className="w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            value={filters.minPrice ?? ""}
            placeholder={String(filterData?.global.priceRange.min ?? 0)}
            onChange={(e) =>
              updateFilters({
                minPrice: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
          />
          <span className="text-muted-foreground">—</span>
          <input
            className="w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            value={filters.maxPrice ?? ""}
            placeholder={String(filterData?.global.priceRange.max ?? 0)}
            onChange={(e) =>
              updateFilters({
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
                page: 1,
              })
            }
          />
        </div>
      </div>
      <div className="mt-6 border-t border-border pt-5 lg:hidden">
        <h4 className="text-xs font-semibold uppercase tracking-wider">Sort by</h4>
        <select
          value={filters.sort}
          onChange={(e) =>
            updateFilters({
              sort: e.target.value,
              page: 1,
            })
          }
          className="mt-3 w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          {filterData?.global.sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </>
  );

  return (
    <SiteLayout>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-12">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Product Catalog</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">Industrial Product Catalog</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {pagination?.totalProducts ?? products.length} products across {categories.length}{" "}
            engineered categories — fully certified, in stock, ready for global shipment.
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
              <div className="relative flex-1 min-w-200px">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={filters.keyword ?? ""}
                  onChange={(e) =>
                    updateFilters({
                      keyword: e.target.value,
                      page: 1,
                    })
                  }
                  placeholder="Search by name, SKU, or specification…"
                  className="w-full border border-input bg-background py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none"
                />
              </div>
              <select
                value={filters.sort}
                onChange={(e) =>
                  updateFilters({
                    sort: e.target.value,
                    page: 1,
                  })
                }
                className="hidden border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none lg:block"
              >
                {filterData?.global.sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-sm text-muted-foreground">
              {isFetching && (
                <>
                  <Spinner size="sm" />
                  <span>Refreshing products...</span>
                </>
              )}
            </div>
            <main className="mt-6">
              {isLoading ? (
                <ProductGridSkeleton />
              ) : isError ? (
                <ErrorState
                  title="Failed to load products"
                  description={
                    error instanceof Error
                      ? error.message
                      : "Something went wrong while loading products."
                  }
                />
              ) : products.length === 0 ? (
                <EmptyState title="No products found" description="Try adjusting your filters." />
              ) : (
                <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} />
                  ))}
                </div>
              )}
            </main>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              disabled={!pagination?.hasPreviousPage}
              onClick={() =>
                updateFilters({
                  page: filters.page - 1,
                })
              }
            >
              Previous
            </button>

            <span>
              Page {pagination?.currentPage} of {pagination?.totalPages}
            </span>

            <button
              disabled={!pagination?.hasNextPage}
              onClick={() =>
                updateFilters({
                  page: filters.page + 1,
                })
              }
            >
              Next
            </button>
          </div>
        </div>
      </section>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog">
          <div
            onClick={() => setMobileFilters(false)}
            className="absolute inset-0 bg-black/40 animate-fade-in"
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto bg-background shadow-2xl animate-slide-up">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em]">Filter & Sort</h3>
              </div>
              <button
                onClick={() => setMobileFilters(false)}
                className="p-1"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="p-5">{filterPanel}</div>
            <footer className="sticky bottom-0 grid grid-cols-2 gap-3 border-t border-border bg-background p-4">
              <button
                onClick={() => {
                  updateFilters({
                    keyword: "",
                    category: undefined,
                    sort: "newest",
                    page: 1,
                    brand: undefined,
                    minPrice: undefined,
                    maxPrice: undefined,
                    inStock: false,
                    specifications: {},
                    limit: 12,
                  });
                }}
                className="border border-border px-4 py-3 text-xs font-semibold uppercase tracking-wider hover:border-primary hover:text-primary"
              >
                Clear all
              </button>
              <button
                onClick={() => setMobileFilters(false)}
                className="bg-primary px-4 py-3 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90"
              >
                Show {pagination?.totalProducts ?? products.length} results
              </button>
            </footer>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
