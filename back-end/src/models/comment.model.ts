import { Schema } from 'mongoose';
import { PRODUCT_DOCUMENT_NAME } from './product.model';
import { USER_COLLECTION_NAME, USER_DOCUMENT_NAME } from './user.model';

const mongoose = require('mongoose');

export const COMMENT_DOCUMENT_NAME = 'Comments';
const COMMENT_COLLECTION_NAME = 'Comments_Collection';

const CommentSchema = new mongoose.Schema(
  {
    comment_title: {
      type: String,
      required: true,
      trim: true,
    },
    comment_content: {
      type: String,
      required: true,
      trim: true,
    },
    comment_rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    comment_image_list: {
      type: [String],
      default: false,
    },
    productId_document: {
      type: Schema.Types.ObjectId,
      ref: PRODUCT_DOCUMENT_NAME,
      required: true,
    },
    userId_document: { type: Schema.Types.ObjectId, ref: USER_DOCUMENT_NAME, required: true },
  },
  {
    timestamps: true,
    collection: COMMENT_COLLECTION_NAME,
  }
);

const CommentModel = mongoose.model(COMMENT_DOCUMENT_NAME, CommentSchema);

export default CommentModel;
