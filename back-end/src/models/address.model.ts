import { Schema } from 'mongoose';
import { ORDER_DOCUMENT_NAME } from './order.model';

const mongoose = require('mongoose');

export const COMMENT_DOCUMENT_NAME = 'Bills';
const COMMENT_COLLECTION_NAME = 'Bills_Collection';

const CommentSchema = new mongoose.Schema(
  {
    bill_code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    bill_issue_date: {
      type: String,
    },
    bill_total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    bill_discount_end: {
      type: Date,
      required: true,
    },
    orderId_document: {
      type: Schema.Types.ObjectId,
      ref: ORDER_DOCUMENT_NAME,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COMMENT_COLLECTION_NAME,
  }
);

const CommentModel = mongoose.model(COMMENT_DOCUMENT_NAME, CommentSchema);

export default CommentModel;
