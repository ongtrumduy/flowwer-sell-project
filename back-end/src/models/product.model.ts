import { model, Schema } from 'mongoose';
import { CATEGORY_DOCUMENT_NAME } from './category.model';

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
    categoriesIds: [
      {
        type: Schema.Types.ObjectId,
        ref: CATEGORY_DOCUMENT_NAME,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
    collection: PRODUCT_COLLECTION_NAME,
  }
);

// =======================================================
// create index for search
ProductSchema.index({ product_name: 'text' });

const ProductModel = model(PRODUCT_DOCUMENT_NAME, ProductSchema);

export default ProductModel;
