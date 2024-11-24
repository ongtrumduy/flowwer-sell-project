import { model, Schema } from 'mongoose';
import { CATEGORY_DOCUMENT_NAME } from './category.model';
import { TYPE_PRODUCT_DOCUMENT_NAME } from './typeProduct.model';

export const PRODUCT_DOCUMENT_NAME = 'Products';
export const PRODUCT_COLLECTION_NAME = 'Products_Collection';

const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    product_quantity: {
      type: Number,
      default: 0,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_image: {
      type: String,
      unique: true,
      required: true,
    },
    product_description: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    categoryId_document_list: [
      {
        type: Schema.Types.ObjectId,
        ref: CATEGORY_DOCUMENT_NAME,
        // required: true,
      },
    ],
    typeProductId_document_list: [
      {
        type: Schema.Types.ObjectId,
        ref: TYPE_PRODUCT_DOCUMENT_NAME,
        // required: true,
      },
    ],
    product_average_rating: {
      type: Number,
      default: 4,
      min: 0,
      max: 5,
    },
    product_total_review: {
      type: Number,
      default: 0,
    },
    // discount: {
    //   type: Number,
    //   default: 0,
    //   min: [0, 'Discount cannot be negative'],
    //   max: [100, 'Discount cannot exceed 100%'],
    // },
    // discounted_Price: {
    //   type: Number,
    //   min: 0,
    // },
  },
  {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME,
  }
);

// =======================================================
// visual
ProductSchema.virtual('productId').get(function () {
  return this._id;
});
// =======================================================

// =======================================================
// create index for search
ProductSchema.index({ product_name: 'text' });
// =======================================================

// =======================================================
// create middleware
// ProductSchema.pre('save', function (next) {
//   if (this.isModified('product_price') || this.isModified('discount')) {
//     this.discounted_Price = this.product_price * (1 - this.discount / 100);
//   }

//   next();
// });

// ProductSchema.pre('validate', function (next) {
//   if (this.discount > 100) {
//     throw new Error('Discount cannot exceed 100%');
//   }
//   if (this.isModified('discounted_Price') && this.discounted_Price !== undefined && this.discounted_Price !== null && this.discounted_Price < 0) {
//     throw new Error('Discounted price must be non-negative');
//   }

//   next();
// });

// =======================================================

const ProductModel = model(PRODUCT_DOCUMENT_NAME, ProductSchema);

export default ProductModel;
