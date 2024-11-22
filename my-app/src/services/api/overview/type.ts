import { EnumOrderStatusStage } from '../stripe_payment/type';

export interface InterfaceProductItem {
  product_name: string;
  product_quantity: number;
  product_price: number;
  product_image: string;
  product_description: string;
  productId: string;
}

export interface InterfaceProductMetaData {
  products: {
    overview: {
      totalSearchCount: number;
    }[];
    data: InterfaceProductItem[];
  }[];
}

export interface InterfaceProductList {
  message: string;
  status: number;
  metaData: InterfaceProductMetaData;
}

export interface InterfaceProductDetailItem {
  message: string;
  status: number;
  metaData: {
    productDetail: InterfaceProductItem;
  };
}

export interface InterfaceProductDetailItemMetaData {
  productDetail: InterfaceProductItem;
}

interface InterfaceProduct {
  name: string; // Tên sản phẩm
  quantity: number; // Số lượng sản phẩm
  price: number; // Giá của sản phẩm
}

export interface InterfaceOrder {
  id: string; // Mã đơn hàng
  date: string; // Ngày đặt hàng (có thể là ISO string hoặc định dạng khác)
  status: EnumOrderStatusStage; // Trạng thái của đơn hàng
  order_item_list: InterfaceProduct[]; // Danh sách sản phẩm trong đơn hàng
  totalPrice: number; // Tổng giá trị đơn hàng
}

export interface InterfaceOrderListMetadata {
  totalOrderStatusItem: number;
  orders: InterfaceOrderListData[];
}

export interface InterfaceOrderDetailMetadata {
  totalOrderStatusItem: number;
  order: InterfaceOrderListData;
}

interface InterfaceProduct {
  _id: string;
  product_name: string;
  product_price: number;
  product_image: string;
  product_description: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  __v: number;
  product_quantity: number;
}

interface InterfaceOrderItem {
  productId: InterfaceProduct;
  product_quantity: number;
  product_price_now: number;
  _id: string;
}

export interface InterfaceProcessTimeline {
  event: string; // Có thể là Enum nếu các trạng thái được định nghĩa
  timestamp: string; // ISO Date string
  currentTime: string; // ISO Date string
  _id: string;
}

export interface InterfaceOrderListData {
  _id?: string;
  orderId?: string;
  order_item_list: InterfaceOrderItem[];
  total_amount: number;
  customerId: string;
  pickup_address: string;
  delivery_address: string;
  order_status_stage: EnumOrderStatusStage; // Enum nếu có
  process_timeline: InterfaceProcessTimeline[];
  order_date: string; // ISO Date string
  delivery_date: string; // ISO Date string
  pickup_date: string; // ISO Date string
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  order_code: string;
  __v: number;
  shipperId: {
    name: string;
    phone_number: string;
  };
}

export interface InterfaceOverviewMetaData {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
}

export interface InterfaceOrdersByMonthMetaData {
  ordersByMonthResult: {
    year: string;
    month: string;
    totalOrders: number;
    label?: string;
  }[];
}

export interface InterfaceRevenueByMonthMetaData {
  revenueByMonthResult: {
    year: string;
    month: string;
    totalRevenue: number;
    label?: string;
  }[];
}

export interface InterfaceUsersByMonthMetaData {
  usersByMonthResult: {
    year: string;
    month: string;
    totalUsers: number;
    label?: string;
  }[];
}
