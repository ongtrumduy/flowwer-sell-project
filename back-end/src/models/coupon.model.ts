const mongoose = require('mongoose');

export const COUPON_DOCUMENT_NAME = 'Coupons';
const COUPON_COLLECTION_NAME = 'Coupons_Collection';

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    discount_percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: COUPON_COLLECTION_NAME,
  }
);

const CouponModel = mongoose.model(COUPON_DOCUMENT_NAME, CouponSchema);

module.exports = CouponModel;
