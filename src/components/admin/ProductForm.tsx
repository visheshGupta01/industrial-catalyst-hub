import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Trash2, Upload, Loader2, Package, Truck, Layers, FolderPlus } from "lucide-react";
import { Product } from "@/types";
import { useCategories, useSubCategories } from "@/hooks/useCategory";

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (formData: FormData) => void;
  isPending: boolean;
  submitLabel: string;
}

export function ProductForm({ initialData, onSubmit, isPending, submitLabel }: ProductFormProps) {
  const { data: categories = [] } = useCategories();
  const { data: subCategories = [] } = useSubCategories();

  // Basic Information States
  const [name, setName] = useState(initialData?.name || "");
  const [sku, setSku] = useState(initialData?.sku || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice?.toString() || "");
  const [stock, setStock] = useState(initialData?.stock?.toString() || "0");
  const [category, setCategory] = useState(
    typeof initialData?.category === "object"
      ? initialData.category._id
      : initialData?.category || "",
  );
  const [subCategory, setSubCategory] = useState(
    typeof initialData?.subCategory === "object"
      ? initialData.subCategory._id
      : initialData?.subCategory || "",
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);

  // Nested Shipping Subdocument States
  const [isShippable, setIsShippable] = useState(initialData?.shipping?.isShippable ?? true);
  const [weight, setWeight] = useState(initialData?.shipping?.package?.weight?.toString() || "0.5");
  const [length, setLength] = useState(initialData?.shipping?.package?.length?.toString() || "10");
  const [width, setWidth] = useState(initialData?.shipping?.package?.width?.toString() || "10");
  const [height, setHeight] = useState(initialData?.shipping?.package?.height?.toString() || "10");
  // Track existing images and removed image IDs
  const [removedImagePublicIds, setRemovedImagePublicIds] = useState<string[]>([]);

  // Dynamic Specifications State Array
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>(() => {
    if (initialData?.specifications && typeof initialData.specifications === "object") {
      return Object.entries(initialData.specifications).map(([key, value]) => ({
        key,
        value: String(value),
      }));
    }
    return [{ key: "Material", value: "Stainless Steel" }];
  });

  // Images State
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Filter Subcategories by Selected Parent Category
  const filteredSubCategories = subCategories.filter(
    (sc) => (typeof sc.category === "object" ? sc.category._id : sc.category) === category,
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (publicId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.public_id !== publicId));
    setRemovedImagePublicIds((prev) => [...prev, publicId]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("sku", sku);
    formData.append("description", description);
    formData.append("price", price);
    if (discountPrice) formData.append("discountPrice", discountPrice);
    formData.append("stock", stock);
    formData.append("category", category);
    if (subCategory) formData.append("subCategory", subCategory);
    formData.append("isActive", String(isActive));

    // Nested Shipping Object Serialized for Express Parser
    formData.append("shipping[isShippable]", String(isShippable));
    formData.append("shipping[package][weight]", weight);
    formData.append("shipping[package][length]", length);
    formData.append("shipping[package][width]", width);
    formData.append("shipping[package][height]", height);
    // Pass array of public_ids to delete on backend
    formData.append("removedImagePublicIds", JSON.stringify(removedImagePublicIds));

    // Append new files
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Reconstruct Specifications Key-Value Map
    const specificationsObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim() && s.value.trim()) {
        specificationsObj[s.key.trim()] = s.value.trim();
      }
    });
    formData.append("specifications", JSON.stringify(specificationsObj));

    // Append Image Files
    selectedFiles.forEach((file) => {
      formData.append("images", file);
    });

    onSubmit(formData);
  };;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 border border-border bg-card p-6">
      {/* SECTION 1: Core Details */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" /> Product Identity & Categorization
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-muted-foreground uppercase">Product Title *</span>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="e.g., Heavy Duty Photocell Sensor"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-muted-foreground uppercase">
              Stock Keeping Unit (SKU) *
            </span>
            <input
              required
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="border border-input bg-background px-3 py-2 text-sm font-mono focus:border-primary focus:outline-none"
              placeholder="SKU-1002"
            />
          </label>
        </div>

        {/* Category & Subcategory Select Row with "+ Add" Quick Action Buttons */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground uppercase">
                Primary Category *
              </span>
              <Link
                to="/admin/categories/create"
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:underline"
              >
                <FolderPlus className="h-3 w-3" /> + Add Category
              </Link>
            </div>
            <select
              required
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubCategory("");
              }}
              className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-muted-foreground uppercase">
                Sub-Category (Optional)
              </span>
              <Link
                to="/admin/subcategories/create"
                target="_blank"
                className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:underline"
              >
                <FolderPlus className="h-3 w-3" /> + Add Subcategory
              </Link>
            </div>
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              disabled={!category || filteredSubCategories.length === 0}
              className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none disabled:opacity-50"
            >
              <option value="">Select Sub-Category</option>
              {filteredSubCategories.map((sc) => (
                <option key={sc._id} value={sc._id}>
                  {sc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-xs">
          <span className="font-semibold text-muted-foreground uppercase">Description *</span>
          <textarea
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
            placeholder="Comprehensive description of equipment specifications..."
          />
        </label>
      </div>

      {/* SECTION 2: Pricing & Inventory */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground border-b border-border pb-2">
          Pricing & Inventory Matrix
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-muted-foreground uppercase">
              Base Price (INR) *
            </span>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-muted-foreground uppercase">
              Discounted Price (INR)
            </span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              placeholder="Optional sale rate"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs">
            <span className="font-semibold text-muted-foreground uppercase">Available Stock *</span>
            <input
              required
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="h-4 w-4 border-input accent-primary"
          />
          <label
            htmlFor="isActive"
            className="text-xs font-semibold uppercase text-foreground cursor-pointer"
          >
            Mark Product Active in Catalog
          </label>
        </div>
      </div>

      {/* SECTION 3: Shiprocket Logistics Configuration */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground border-b border-border pb-2 flex items-center gap-2">
          <Truck className="h-4 w-4 text-primary" /> Shiprocket Parcel & Freight Setup
        </h2>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isShippable"
            checked={isShippable}
            onChange={(e) => setIsShippable(e.target.checked)}
            className="h-4 w-4 border-input accent-primary"
          />
          <label
            htmlFor="isShippable"
            className="text-xs font-bold uppercase text-foreground cursor-pointer"
          >
            Courier Serviceable (If unchecked, forces B2B Quote Request)
          </label>
        </div>

        {isShippable && (
          <div className="grid gap-4 sm:grid-cols-4 bg-surface p-4 border border-border">
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-muted-foreground uppercase">Weight (kg) *</span>
              <input
                required
                type="number"
                step="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-muted-foreground uppercase">Length (cm) *</span>
              <input
                required
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-muted-foreground uppercase">Width (cm) *</span>
              <input
                required
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-semibold text-muted-foreground uppercase">Height (cm) *</span>
              <input
                required
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </label>
          </div>
        )}
      </div>

      {/* SECTION 4: Technical Specifications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" /> Technical Data Map
          </h2>
          <button
            type="button"
            onClick={() => setSpecs((prev) => [...prev, { key: "", value: "" }])}
            className="inline-flex items-center gap-1 text-xs font-semibold uppercase text-primary hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add Attribute
          </button>
        </div>

        <div className="space-y-2">
          {specs.map((s, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Attribute Key (e.g. Voltage)"
                value={s.key}
                onChange={(e) => {
                  const updated = [...specs];
                  updated[index].key = e.target.value;
                  setSpecs(updated);
                }}
                className="w-1/2 border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Value (e.g. 220V AC)"
                value={s.value}
                onChange={(e) => {
                  const updated = [...specs];
                  updated[index].value = e.target.value;
                  setSpecs(updated);
                }}
                className="w-1/2 border border-input bg-background px-3 py-2 text-xs focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSpecs((prev) => prev.filter((_, i) => i !== index))}
                className="p-2 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5: Media Attachments */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground border-b border-border pb-2">
          Asset Gallery & Cloudinary Files
        </h2>

        {/* Existing Images (Edit mode) */}
        {existingImages.length > 0 && (
          <div>
            <div className="text-[11px] font-semibold text-muted-foreground uppercase mb-2">
              Current Cloud Assets
            </div>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div
                  key={img._id || img.public_id}
                  className="relative h-20 w-20 border border-border bg-surface"
                >
                  <img
                    src={img.url}
                    alt="Product Thumbnail"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.public_id)}
                    className="absolute top-1 right-1 bg-background/80 p-1 text-destructive hover:bg-background transition-colors"
                    title="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Dropzone */}
        <div>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border bg-surface p-6 cursor-pointer hover:border-primary transition-colors">
            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Select Product Images to Upload
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* New Selected Image Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {previews.map((preview, i) => (
              <div key={i} className="relative h-20 w-20 border border-border">
                <img
                  src={preview}
                  alt="New Upload Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeSelectedFile(i)}
                  className="absolute top-1 right-1 bg-background/80 p-1 text-destructive hover:bg-background"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit Button Controls */}
      <div className="flex justify-end pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 bg-primary px-8 py-3 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
