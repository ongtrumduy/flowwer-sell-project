import { model, Schema } from 'mongoose';

export const TYPE_PRODUCT_DOCUMENT_NAME = 'Type_Products';
const TYPE_PRODUCT_COLLECTION_NAME = 'Type_Products_Collection';

const TypeProductSchema = new Schema(
  {
    type_product_name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    type_product_description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: TYPE_PRODUCT_COLLECTION_NAME,
  }
);

const TypeProductModel = model(TYPE_PRODUCT_DOCUMENT_NAME, TypeProductSchema);

// =======================================================
// create index for search
TypeProductSchema.index({ type_product_name: 'text' });

export default TypeProductModel;
