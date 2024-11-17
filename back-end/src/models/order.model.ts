import { model, Schema, Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { EnumStatusOfOrder } from '../utils/type';
import { PRODUCT_DOCUMENT_NAME } from './product.model';
import { USER_DOCUMENT_NAME } from './user.model';
import { DEFAULT_PICK_UP_ADDRESS } from '../utils/constant';

export const ORDER_DOCUMENT_NAME = 'Orders';
const ORDER_COLLECTION_NAME = 'Orders_Collection';

interface InterfaceOrder extends Document {
  order_code: string;
  total_amount: number;
  delivery_address: string;
  order_item_list: Array<{
    productId: Types.ObjectId;
    product_quantity: number;
    product_price_now: number;
  }>;
  order_date: Date;
  shipperId: Types.ObjectId;
  customerId: Types.ObjectId;
  pickup_address: string;
  order_status_stage: EnumStatusOfOrder;
  delivery_date: Date;
  pickup_date: Date;
  process_timeline: {
    event: EnumStatusOfOrder;
    timestamp: Date;
    currentTime?: Date; // Add this property
  }[];

  generateOrderCode(): string;
}

const OrderItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: PRODUCT_DOCUMENT_NAME,
    unique: true,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  product_price_now: {
    type: Number,
    required: true,
    default: 0,
  },
});

const OrderSchema = new Schema<InterfaceOrder>(
  {
    order_code: {
      type: String,
      // required: true,
      unique: true,
      trim: true,
    },
    order_item_list: {
      type: [OrderItemSchema],
      default: [],
      required: true,
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    order_date: {
      type: Date,
      default: Date.now,
    },
    shipperId: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      // required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      required: true,
    },
    // default address of shop
    pickup_address: {
      type: String,
      default: DEFAULT_PICK_UP_ADDRESS,
      // required: true,
    },
    delivery_address: {
      type: String,
      required: true,
    },
    order_status_stage: {
      type: String,
      enum: Object.values(EnumStatusOfOrder),
      default: EnumStatusOfOrder.PENDING,
      // required: true,
    },
    delivery_date: {
      type: Date,
      default: Date.now,
    },
    pickup_date: {
      type: Date,
      default: Date.now,
    },
    process_timeline: [
      {
        event: {
          enum: Object.values(EnumStatusOfOrder),
          type: String,
          default: EnumStatusOfOrder.PENDING,
          // required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        currentTime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // created_at: {
    //   type: Date,
    //   default: Date.now,
    // },
    // updated_at: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  {
    timestamps: true, // Sử dụng timestamps để tự động quản lý `createdAt` và `updatedAt`
    collection: ORDER_COLLECTION_NAME,
  }
);

// =======================================================
// create method
OrderSchema.methods.generateOrderCode = function (): string {
  const id = nanoid(8); // Tạo mã ngẫu nhiên có độ dài 8 ký tự
  const prefix = 'FLOWER';

  return prefix + '-' + id;
};
// =======================================================

// =======================================================
// create middleware
OrderSchema.pre('save', function (next) {
  this.total_amount = this.order_item_list.reduce((acc, item) => {
    return acc + item.product_quantity * item.product_price_now;
  }, 0);

  this.order_code = this.generateOrderCode();

  next();
});

// =======================================================

const OrderModel = model(ORDER_DOCUMENT_NAME, OrderSchema);

export default OrderModel;
