export type PaymentProvider = "razorpay" | "cod";

export type PaymentStatus = "Pending" | "Verifying" | "Paid" | "Failed" | "Refunded";

export type ShippingStatus =
  | "Pending"
  | "Shipment Created"
  | "Pickup Scheduled"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export type OrderStatus = "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export interface OrderItem {
  product: string;

  name: string;
  slug?: string;
  sku?: string;
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

export interface Pricing {
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  total: number;
}

export interface Payment {
  provider: PaymentProvider;
  status: PaymentStatus;

  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;

  paidAt?: string;
  failureReason?: string;
}

export interface PackageDimensions {
  weight?: number;
  length?: number;
  breadth?: number;
  height?: number;
}

export interface Shipping {
  status: ShippingStatus;

  provider?: string;
  courier?: string;
  courierId?: number;

  shipmentId?: string;
  shiprocketOrderId?: string;

  awbCode?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;

  package?: PackageDimensions;
}

export interface Order {
  _id: string;

  user: string;

  orderNumber: string;

  items: OrderItem[];

  shippingAddress: ShippingAddress;

  pricing: Pricing;

  payment: Payment;

  shipping: Shipping;

  orderStatus: OrderStatus;

  createdAt: string;
  updatedAt: string;
}
