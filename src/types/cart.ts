import type { Product } from "./product";
import type { User } from "./user";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  _id: string;

  user: string | User;

  items: CartItem[];

  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: boolean;
  cart: Cart;
}