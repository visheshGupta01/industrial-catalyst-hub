import type { Category } from "./category";
import type { SubCategory } from "./sub-category";

export interface ProductImage {
  url: string;
  public_id: string;
}

export interface ProductShipping {
  weight: number;
  length: number;
  breadth: number;
  height: number;
  hsnCode?: string;
  isShippable: boolean;
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

  category: string;
  subCategory?: string;

  brand?: string;

  shipping: ProductShipping;

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

export interface ProductFilters {
  keyword?: string;

  category?: string;

  brand?: string[];

  minPrice?: number;
  maxPrice?: number;

  inStock?: boolean;
  featured?: boolean;
  active?: boolean;

  specifications?: Record<string, string[]>;

  sort?: string;

  page: number;
  limit: number;
}

export interface ProductResponse {
  success: boolean;

  products: Product[];

  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    limit: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ProductFiltersResponse {
  global: {
    categories: Category[];
    brands: string[];

    priceRange: {
      min: number;
      max: number;
    };

    availability: {
      label: string;
      value: boolean;
    }[];

    sortOptions: {
      label: string;
      value: string;
    }[];
  };

  specifications: Record<string, string[]>;
}