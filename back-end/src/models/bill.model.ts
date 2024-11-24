import { Schema } from 'mongoose';
import { ORDER_DOCUMENT_NAME } from './order.model';

const mongoose = require('mongoose');

export const BILL_DOCUMENT_NAME = 'Bills';
const BILL_COLLECTION_NAME = 'Bills_Collection';

const BillSchema = new mongoose.Schema(
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
    collection: BILL_COLLECTION_NAME,
  }
);

const BillModel = mongoose.model(BILL_DOCUMENT_NAME, BillSchema);

export default BillModel;
