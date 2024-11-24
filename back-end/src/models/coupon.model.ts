import { Schema } from 'mongoose';
import { PRODUCT_DOCUMENT_NAME } from './product.model';
import { CATEGORY_DOCUMENT_NAME } from './category.model';

const mongoose = require('mongoose');

export const COUPON_DOCUMENT_NAME = 'Coupons';
const COUPON_COLLECTION_NAME = 'Coupons_Collection';

const CouponSchema = new mongoose.Schema(
  {
    coupon_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    coupon_percentage: {
      // Giảm giá theo phần trăm
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    coupon_end_date: {
      // Ngày kết thúc hiệu lực
      type: Date,
      required: true,
    },
    coupon_start_date: {
      // Ngày bắt đầu hiệu lực
      type: Date,
      required: true,
    },
    coupon_is_active: {
      type: Boolean,
      default: true,
    },
    coupon_amount: {
      // Giảm giá cố định
      type: Number,
      min: 0,
      default: 0,
    },
    coupon_max_discount: {
      type: Number,
      min: 0,
    },
    coupon_min_order_amount: {
      type: Number,
      min: 0, // Đơn hàng tối thiểu để áp dụng coupon
    },
    coupon_usage_limit: {
      type: Number,
      min: 0, // Giới hạn số lần sử dụng
    },
    coupon_used_times: {
      type: Number,
      default: 0, // Số lần coupon đã được sử dụng
    },
    coupon_applicable_to_product_list: [
      {
        type: Schema.Types.ObjectId,
        ref: PRODUCT_DOCUMENT_NAME, // Áp dụng cho các sản phẩm cụ thể
      },
    ],
    coupon_applicable_to_category_list: [
      {
        type: Schema.Types.ObjectId,
        ref: CATEGORY_DOCUMENT_NAME, // Áp dụng cho các danh mục cụ thể
      },
    ],
    coupon_applicable_to_type_list: [
      {
        type: Schema.Types.ObjectId,
        ref: CATEGORY_DOCUMENT_NAME, // Áp dụng cho các danh mục cụ thể
      },
    ],
  },
  {
    timestamps: true,
    collection: COUPON_COLLECTION_NAME,
  }
);

const CouponModel = mongoose.model(COUPON_DOCUMENT_NAME, CouponSchema);

export default CouponModel;
