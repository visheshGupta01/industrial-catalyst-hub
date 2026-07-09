import type { Product } from "./product";
import type { User } from "./user";

export type PaymentStatus = "Pending" | "Paid" | "Failed";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  product: string | Product;

  // product snapshot
  name: string;
  slug: string;
  sku: string;
  image?: string;

  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  _id: string;

  user: string | User;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  totalAmount: number;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  orderNumber: string;

  createdAt: string;
  updatedAt: string;
}
