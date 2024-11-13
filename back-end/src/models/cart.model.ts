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
    // cart_state: {
    //   type: String,
    //   trim: true,
    //   unique: true,
    //   required: true,
    // },
    cart_item_list: {
      type: [CartItemSchema],
      default: [],
      required: true,
    },
    cart_quantity: {
      type: Number,
      default: 0,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: USER_DOCUMENT_NAME,
      required: true,
      unique: true,
    },
    total_price: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: CART_COLLECTION_NAME,
  }
);

const CartModel = model(CART_DOCUMENT_NAME, CartSchema);

// =======================================================
// create middleware
CartSchema.pre('save', function (next) {
  this.cart_quantity = this.cart_item_list.reduce(
    (acc, item) => acc + item.product_quantity,
    0
  );

  this.total_price = this.cart_item_list.reduce(
    (acc, item) => acc + item.product_quantity * item.product_price_now,
    0
  );

  next();
});

// =======================================================
// create index for search
// CartSchema.index({ product_name: 'text' });

export default CartModel;
