import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { Category } from "@/types";

export type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
};

function toInitial(c?: Category | null): CategoryFormValues {
  return {
    name: c?.name ?? "",
    slug: c?.slug ?? "",
    description: c?.description ?? "",
    isActive: c?.isActive ?? true,
  };
}

export function CategoryForm({
  initial,
  submitting,
  submitLabel,
  compact,
  onSubmit,
  onCancel,
}: {
  initial?: Category | null;
  submitting?: boolean;
  submitLabel: string;
  compact?: boolean;
  onSubmit: (fd: FormData) => void | Promise<void>;
  onCancel?: () => void;
}) {
  const [values, setValues] = useState<CategoryFormValues>(() => toInitial(initial));
  const [file, setFile] = useState<File | null>(null);

  const update = <K extends keyof CategoryFormValues>(k: K, v: CategoryFormValues[K]) =>
    setValues((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", values.name);
    if (values.slug) fd.append("slug", values.slug);
    if (values.description) fd.append("description", values.description);
    fd.append("isActive", String(values.isActive));
    if (file) fd.append("image", file);
    await onSubmit(fd);
  };

  const inputCls =
    "w-full border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-4" : "grid gap-6 lg:grid-cols-3"}>
      <div className={compact ? "space-y-4" : "space-y-6 lg:col-span-2"}>
        <section className={compact ? "" : "border border-border bg-card p-5"}>
          {!compact && (
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Basic Info</h2>
          )}
          <div className="grid gap-4">
            <Field label="Name" required>
              <input
                className={inputCls}
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </Field>
            <Field label="Slug">
              <input
                className={inputCls}
                value={values.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="auto-generated if empty"
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={3}
                className={inputCls}
                value={values.description}
                onChange={(e) => update("description", e.target.value)}
              />
            </Field>
            <Field label="Image">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="block w-full text-sm file:mr-4 file:border file:border-border file:bg-surface file:px-3 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-wider hover:file:border-primary"
              />
            </Field>
            {initial?.image?.url && (
              <img
                src={initial.image.url}
                alt=""
                className="h-20 w-20 border border-border object-cover"
              />
            )}
          </div>
        </section>
      </div>

      <aside className={compact ? "" : "space-y-6"}>
        <section className={compact ? "" : "border border-border bg-card p-5"}>
          {!compact && (
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider">Visibility</h2>
          )}
          <label className="flex items-center gap-2 text-sm">
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
