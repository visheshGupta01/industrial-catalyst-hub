import type { Category } from "./category";
import type { SubCategory } from "./sub-category";

export interface ProductImage {
  url: string;
  public_id: string;
}

export interface Product {
  _id: string;

  name: string;
  slug: string;
  description: string;

  price: number;
  discountPrice: number | null;

  stock: number;
  sku?: string;

  category: string | Category;
  subCategory?: string | SubCategory;

  brand?: string;

  images: ProductImage[];

  tags: string[];

  specifications: Record<string, string>;

  averageRating: number;
  totalReviews: number;

  isFeatured: boolean;
  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
