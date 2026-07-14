import { Order } from "./order";

export interface DashboardStats {
  totalRevenue: number;

  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;

  totalCategories: number;

  totalUsers: number;

  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}

export interface SalesChartItem {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  name: string;
  image?: string;
  sold: number;
  price: number;
  slug: string;
  sku: string;
}

export interface DashboardResponse {
  success: boolean;

  dashboard: {
    stats: DashboardStats;
    salesChart: SalesChartItem[];
    topProducts: TopProduct[];
    recentOrders: Order[];
  };
}
