import { useMemo, useState, type FormEvent } from "react";
import { Loader2, Plus, X } from "lucide-react";
import type { Product } from "@/types";
import {
  useCategories,
  useCreateCategory,
  useSubCategories,
} from "@/hooks/useCategory";
import { CategoryForm } from "@/components/admin/CategoryForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export type ProductFormValues = {
  name: string;
  description: string;
  price: string;
  discountPrice: string;
  stock: string;
  sku: string;
  brand: string;
  category: string;
  subCategory: string;
  tags: string;
  isFeatured: boolean;
  isActive: boolean;
  specifications: { key: string; value: string }[];
};

function toInitial(p?: Product | null): ProductFormValues {
  return {
    name: p?.name ?? "",
    description: p?.description ?? "",
    price: p?.price != null ? String(p.price) : "",
    discountPrice: p?.discountPrice != null ? String(p.discountPrice) : "",
    stock: p?.stock != null ? String(p.stock) : "0",
    sku: p?.sku ?? "",
    brand: p?.brand ?? "",
    category: (p?.category as any)?._id ?? (p?.category as any) ?? "",
    subCategory: (p?.subCategory as any)?._id ?? (p?.subCategory as any) ?? "",
    tags: (p?.tags ?? []).join(", "),
    isFeatured: p?.isFeatured ?? false,
    isActive: p?.isActive ?? true,
    specifications: p?.specifications
      ? Object.entries(p.specifications).map(([key, value]) => ({ key, value: String(value) }))
      : [],
  };
}

export function ProductForm({
  initial,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initial?: Product | null;
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (fd: FormData) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<ProductFormValues>(() => toInitial(initial));
  const [files, setFiles] = useState<File[]>([]);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const { data: categories = [] } = useCategories();
  const { data: subCategories = [] } = useSubCategories(values.category || undefined);
  const createCategory = useCreateCategory();

  const existingImages = useMemo(() => initial?.images ?? [], [initial]);

  const update = <K extends keyof ProductFormValues>(k: K, v: ProductFormValues[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const setSpec = (i: number, patch: Partial<{ key: string; value: string }>) =>
    setValues((s) => ({
      ...s,
      specifications: s.specifications.map((r, idx) => (idx === i ? { ...r, ...patch } : r)),
    }));

  const addSpec = () =>
    setValues((s) => ({ ...s, specifications: [...s.specifications, { key: "", value: "" }] }));

  const removeSpec = (i: number) =>
    setValues((s) => ({ ...s, specifications: s.specifications.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", values.name);
    fd.append("description", values.description);
    fd.append("price", values.price);
    if (values.discountPrice) fd.append("discountPrice", values.discountPrice);
    fd.append("stock", values.stock || "0");
    if (values.sku) fd.append("sku", values.sku);
    if (values.brand) fd.append("brand", values.brand);
    if (values.category) fd.append("category", values.category);
    if (values.subCategory) fd.append("subCategory", values.subCategory);
    fd.append("isFeatured", String(values.isFeatured));
    fd.append("isActive", String(values.isActive));

    const tags = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    fd.append("tags", JSON.stringify(tags));

    const specs = values.specifications.reduce<Record<string, string>>((acc, r) => {
      if (r.key.trim()) acc[r.key.trim()] = r.value;
      return acc;
    }, {});
    fd.append("specifications", JSON.stringify(specs));

    files.forEach((f) => fd.append("images", f));

    await onSubmit(fd);
  };

  const inputCls =
    "w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <>
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Basic Info</h2>
            <div className="grid gap-4">
              <Field label="Name" required>
                <input
                  className={inputCls}
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  required
                />
              </Field>
              <Field label="Description" required>
                <textarea
                  rows={5}
                  className={inputCls}
                  value={values.description}
                  onChange={(e) => update("description", e.target.value)}
                  required
                />
              </Field>
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="SKU">
                  <input
                    className={inputCls}
                    value={values.sku}
                    onChange={(e) => update("sku", e.target.value)}
                  />
                </Field>
                <Field label="Brand">
                  <input
                    className={inputCls}
                    value={values.brand}
                    onChange={(e) => update("brand", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </section>

          <section className="border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Pricing & Stock</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Price" required>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputCls}
                  value={values.price}
                  onChange={(e) => update("price", e.target.value)}
                  required
                />
              </Field>
              <Field label="Discount Price">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputCls}
                  value={values.discountPrice}
                  onChange={(e) => update("discountPrice", e.target.value)}
                />
              </Field>
              <Field label="Stock" required>
                <input
                  type="number"
                  min="0"
                  className={inputCls}
                  value={values.stock}
                  onChange={(e) => update("stock", e.target.value)}
                  required
                />
              </Field>
            </div>
          </section>

          <section className="border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider">Specifications</h2>
              <button
                type="button"
                onClick={addSpec}
                className="inline-flex items-center gap-1 border border-border px-2 py-1 text-xs font-semibold uppercase tracking-wider hover:border-primary"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            {values.specifications.length === 0 && (
              <p className="text-xs text-muted-foreground">No specifications yet.</p>
            )}
            <div className="space-y-2">
              {values.specifications.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                  <input
                    placeholder="Key (e.g. Material)"
                    className={inputCls}
                    value={row.key}
                    onChange={(e) => setSpec(i, { key: e.target.value })}
                  />
                  <input
                    placeholder="Value"
                    className={inputCls}
                    value={row.value}
                    onChange={(e) => setSpec(i, { value: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    className="border border-border p-2 hover:border-destructive hover:text-destructive"
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Images</h2>
            {existingImages.length > 0 && (
              <div className="mb-4">
                <div className="mb-2 text-xs text-muted-foreground">Current images</div>
                <div className="flex flex-wrap gap-2">
                  {existingImages.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt=""
                      className="h-20 w-20 border border-border object-cover"
                    />
                  ))}
                </div>
              </div>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
              className="block w-full text-sm file:mr-4 file:border file:border-border file:bg-surface file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wider hover:file:border-primary"
            />
            {files.length > 0 && (
              <div className="mt-3 text-xs text-muted-foreground">
                {files.length} file(s) selected
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Organization</h2>
            <div className="grid gap-4">
              <Field label="Category">
                <div className="flex gap-2">
                  <select
                    className={inputCls}
                    value={values.category}
                    onChange={(e) => {
                      update("category", e.target.value);
                      update("subCategory", "");
                    }}
                  >
                    <option value="">Select…</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setCatModalOpen(true)}
                    className="inline-flex shrink-0 items-center gap-1 border border-border px-2 text-xs font-semibold uppercase tracking-wider hover:border-primary"
                    title="Create new category"
                  >
                    <Plus className="h-3.5 w-3.5" /> New
                  </button>
                </div>
              </Field>
              <Field label="Sub-category">
                <select
                  className={inputCls}
                  value={values.subCategory}
                  onChange={(e) => update("subCategory", e.target.value)}
                  disabled={!values.category}
                >
                  <option value="">
                    {values.category ? "Select…" : "Pick a category first"}
                  </option>
                  {subCategories.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Tags (comma separated)">
                <input
                  className={inputCls}
                  value={values.tags}
                  onChange={(e) => update("tags", e.target.value)}
                />
              </Field>
            </div>
          </section>

          <section className="border border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Visibility</h2>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-primary"
                checked={values.isFeatured}
                onChange={(e) => update("isFeatured", e.target.checked)}
              />
              Featured
            </label>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="accent-primary"
                checked={values.isActive}
                onChange={(e) => update("isActive", e.target.checked)}
              />
              Active
            </label>
          </section>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex flex-1 items-center justify-center gap-2 bg-primary px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {submitLabel}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="border border-border px-4 py-2.5 text-xs font-semibold uppercase tracking-wider hover:border-primary"
              >
                Cancel
              </button>
            )}
          </div>
        </aside>
      </form>

      <Dialog open={catModalOpen} onOpenChange={setCatModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Category</DialogTitle>
          </DialogHeader>
          <CategoryForm
            compact
            submitLabel="Create"
            submitting={createCategory.isPending}
            onCancel={() => setCatModalOpen(false)}
            onSubmit={async (fd) => {
              try {
                const created = await createCategory.mutateAsync(fd);
                toast.success("Category created");
                setCatModalOpen(false);
                if (created?._id) update("category", created._id);
              } catch (e) {
                toast.error((e as Error).message || "Failed to create category");
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}
