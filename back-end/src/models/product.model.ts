import { model, Schema } from 'mongoose';

export const PRODUCT_DOCUMENT_NAME = 'Products';
const PRODUCT_COLLECTION_NAME = 'Products_Collection';

const ProductSchema = new Schema(
  {
    product_name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    order_quantity: {
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
  },
  {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME,
  }
);

const ProductModel = model(PRODUCT_DOCUMENT_NAME, ProductSchema);

// =======================================================
// create index for search
ProductSchema.index({ product_name: 'text' });

export default ProductModel;
