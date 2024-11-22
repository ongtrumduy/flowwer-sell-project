import { model, Schema } from 'mongoose';

export const CATEGORY_DOCUMENT_NAME = 'Categories';
const CATEGORY_COLLECTION_NAME = 'Categories_Collection';

const CategorySchema = new Schema(
  {
    category_name: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    category_description: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: CATEGORY_COLLECTION_NAME,
  }
);

const CategoryModel = model(CATEGORY_DOCUMENT_NAME, CategorySchema);

// =======================================================
// create index for search
CategorySchema.index({ category_name: 'text' });

export default CategoryModel;
