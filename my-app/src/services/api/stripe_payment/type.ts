export interface InterfaceConfigPaymentMetaData {
  publishableKey: string;
}

export interface InterfaceConfigPaymentData {
  message: string;
  status: number;
  metaData: InterfaceConfigPaymentMetaData;
}

export interface InterfaceCreatePaymentMetaData {
  clientSecret: string;
}

export interface InterfaceCreatePaymentData {
  message: string;
  status: number;
  metaData: InterfaceCreatePaymentMetaData;
}

export interface InterfaceOrderInformationToPayMetaData {
  order: {
    orderId: string;
    total_amount: number;
    delivery_address: string;
    order_item_list: InterfaceOrderItem[];
    pickup_address: string;
    order_status_stage: EnumOrderStatusStage;
    delivery_date: string;
    pickup_date: string;
    process_timeline: InterfaceProcessTimelineEvent[];
    order_code: string; // Mã đơn hàng (unique code)
    order_date: string; // Ngày đặt hàng
    shipperId?: string | null; // ID của shipper (có thể null nếu chưa được gán)
    customerId: string; // ID của khách hàng
  };
}

export enum EnumOrderStatusStage {
  PENDING = 'PENDING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  WAITING_CONFIRM = 'WAITING_CONFIRM',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum ProcessEvent {
  PENDING = 'PENDING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  WAITING_CONFIRM = 'WAITING_CONFIRM',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

interface InterfaceProcessTimelineEvent {
  event: ProcessEvent;
  timestamp: string;
  currentTime: string;
  _id: string;
}

interface InterfaceOrderItem {
  productId: InterfaceProduct; // ID của sản phẩm
  product_quantity: number; // Số lượng sản phẩm
  product_price_now: number; // Giá tại thời điểm hiện tại
  _id: string; // ID của mục đơn hàng
}

interface InterfaceProduct {
  _id: string; // ID của sản phẩm
  product_name: string; // Tên sản phẩm
  product_price: number; // Giá sản phẩm
  product_image: string; // URL hình ảnh sản phẩm
  product_description: string; // Mô tả sản phẩm
  createdAt: string; // Thời gian tạo (ISO format)
  updatedAt: string; // Thời gian cập nhật (ISO format)
  __v: number; // Version của tài liệu
  categoriesIds: string[]; // Danh sách ID của danh mục
  product_quantity: number; // Số lượng sản phẩm trong kho
}
