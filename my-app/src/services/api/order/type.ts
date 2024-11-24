import { EnumOrderStatusStage } from '../stripe_payment/type';

export interface InterfaceOrderMetaData {
  Orders: {
    overview: {
      totalSearchCount: number;
    }[];
    data: InterfaceOrderItem[];
  }[];
}

export interface InterfaceOrderList {
  message: string;
  status: number;
  metaData: InterfaceOrderMetaData;
}

export interface InterfaceOrderDetailItem {
  message: string;
  status: number;
  metaData: {
    OrderDetail: InterfaceOrderItem;
  };
}

export interface InterfaceOrderDetailItemMetaData {
  OrderDetail: InterfaceOrderItem;
}

export interface InterfaceOrderListMetadata {
  totalOrderStatusItem: number;
  orders: InterfaceOrderListData[];
}

export interface InterfaceOrderDetailMetadata {
  totalOrderStatusItem: number;
  order: InterfaceOrderListData;
}

interface InterfacProduct {
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

export interface InterfaceOrderItem {
  productId: InterfacProduct;
  product_quantity: string;
  product_price_now: string;
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
  customerId: {
    name: string;
    phone_number: string;
    _id: string;
    address: string;
    email: string;
  };
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
    _id: string;
    address: string;
    email: string;
  };
}

export interface InterfaceOrderItem_ForAdmin {
  orderId?: string;
  order_item_list: InterfaceOrderItem[];
  total_amount: number;
  order_code: string;
  customerId: {
    name: string;
    phone_number: string;
    _id: string;
  };
  pickup_address: string;
  delivery_address: string;
  order_status_stage: EnumOrderStatusStage; // Enum nếu có
  process_timeline: InterfaceProcessTimeline[];
  order_date: string; // ISO Date string
  delivery_date: string; // ISO Date string
  pickup_date: string; // ISO Date string
  shipperId?: {
    name: string;
    phone_number: string;
    _id: string;
    address: string;
  };
}

export interface InterfaceShipperListMetaData_ForAdmin {
  shipperData: InterfaceShipperDetailItem_ForAdmin[];
}

export interface InterfaceShipperDetailItem_ForAdmin {
  shipperId: string;
  shipper_name: string;
  shipper_phone_number: string;
  shipper_email: string;
  shipper_gender: string;
  shipper_address: string;
  currentOrders: number;
}

export interface InterfaceOrderDetailItem_ForAdmin {
  message: string;
  status: number;
  metaData: {
    orderDetail: InterfaceOrderItem;
  };
}

export interface InterfaceOrderDetailItemMetaData {
  orderDetail: InterfaceOrderItem_ForAdmin;
}

export interface InterfaceOrderMetaData {
  orders: {
    overview: {
      totalSearchCount: number;
    }[];
    data: InterfaceOrderItem_ForAdmin[];
  }[];
}

// =====================================================================================================================================
// =====================================================================================================================================
export interface InterfaceNeoProcessTimeline {
  event: string;
  timestamp: string;
  currentTime: string;
  _id: string;
}

export interface InterfaceNeoOrderItem {
  productId: string;
  product_quantity: number;
  product_price_now: number;
  product_name: string;
}

export interface InterfaceNeoOrder {
  order_code: string;
  total_amount: number;
  delivery_address: string;
  order_date: string;
  shipperId: string | null;
  customerId: string;
  pickup_address: string;
  pickup_date: string;
  delivery_date: string;
  order_status_stage: string;
  process_timeline: InterfaceNeoProcessTimeline[];
  order_item_list: InterfaceNeoOrderItem[];
  orderId: string;
  customerDetails: InterfaceNeoUserDetailI_ForAdmin | null;
  shipperDetails: InterfaceNeoUserDetailI_ForAdmin | null;
}

export interface InterfaceNeoOrderResponseMetadata {
  orders: InterfaceNeoOrder[];
  totalSearchCount: number;
}

export interface InterfaceNeoOrderList_ForAdmin {
  message: string;
  status: number;
  metaData: InterfaceNeoOrderResponseMetadata;
}

export interface InterfaceNeoUserDetailI_ForAdmin {
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  status: boolean;
  verify: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  role_list: string[];
  phone_number: string;
}

export interface InterfaceShipperListMetaData_ForEmployee {
  shipperData: InterfaceShipperDetailItem_ForEmployee[];
}

export interface InterfaceShipperDetailItem_ForEmployee {
  shipperId: string;
  shipper_name: string;
  shipper_phone_number: string;
  shipper_email: string;
  shipper_gender: string;
  shipper_address: string;
  currentOrders: number;
  currentAssignedOrders: number;
}

export interface InterfaceOrderDetailMetadata_ForShipper {
  totalOrderStatusItem: number;
  order: InterfaceOrderListData_ForShipper;
}

export interface InterfaceOrderListData_ForShipper {
  _id?: string;
  orderId?: string;
  order_item_list: InterfaceOrderItem[];
  total_amount: number;
  customerId: {
    name: string;
    phone_number: string;
    _id: string;
    address: string;
    email: string;
  };
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
    _id: string;
    address: string;
    email: string;
  };
}
