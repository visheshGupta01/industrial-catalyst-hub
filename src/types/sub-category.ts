import type { Category } from "./category";

export interface SubCategoryImage {
  url?: string;
  public_id?: string;
}

export interface SubCategory {
  _id: string;

  name: string;
  slug: string;

  category: string | Category;

  image?: SubCategoryImage;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
