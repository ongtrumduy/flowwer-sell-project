import { model, Schema } from 'mongoose';
import { USER_DOCUMENT_NAME } from './user.model';
import { PRODUCT_DOCUMENT_NAME } from './product.model';

export const CART_DOCUMENT_NAME = 'Carts';
const CART_COLLECTION_NAME = 'Carts_Collection';

const CartItemSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: PRODUCT_DOCUMENT_NAME,
    unique: true,
    required: true,
  },
  product_quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  product_price_now: {
    type: Number,
    required: true,
    default: 0,
  },
});

const CartSchema = new Schema(
  {
    cart_state: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    cart_items: {
      type: [CartItemSchema],
      default: [],
    },
    cart_quantity: {
      type: Number,
      default: 0,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    collection: CART_COLLECTION_NAME,
  }
);

const CartModel = model(CART_DOCUMENT_NAME, CartSchema);

// =======================================================
// create index for search
CartSchema.index({ product_name: 'text' });

export default CartModel;
