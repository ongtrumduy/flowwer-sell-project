import mongoose, { Schema, Types } from 'mongoose';
import ErrorDTODataResponse from '../core/error.dto.response';
import SuccessDTODataResponse from '../core/success.dto.response';
import CartModel from '../models/cart.model';
import ProductModel, { PRODUCT_DOCUMENT_NAME } from '../models/product.model';
import UserModel from '../models/user.model';
import {
  EnumMessageStatus,
  EnumReasonStatusCode,
  EnumStatusOfOrder,
} from '../utils/type';
import OrderModel from '../models/order.model';

class OrderService {
  //=====================================================================
  // get all order of customer list
  static getAllOrderOfCustomerList = async ({
    limit,
    page,
    customerId,
  }: {
    limit: number;
    page: number;
    customerId: string;
  }) => {
    if (!customerId) {
      throw new ErrorDTODataResponse({
        message: 'CustomerId Is Required !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
        statusCode: 400,
      });
    }

    // const carts = await CartModel.findById(new Types.ObjectId(cartId))
    const orders = await OrderModel.findOne({
      customerId: new Types.ObjectId(customerId),
    })
      .populate({
        path: 'order_item_list.productId',
        model: PRODUCT_DOCUMENT_NAME,
      })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    console.log('22 carts ===>', { orders });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        orders: { ...orders },
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get All Product In Cart List Successfully !!!',
    });
  };

  //=====================================================================
  // get cart product item detail
  static createOrderForCustomer = async ({
    customerId,
    delivery_address,
    order_item_list,
    cartId,
    total_amount,
  }: {
    customerId: string;
    delivery_address: string;
    order_item_list: {
      cartProductId: string;
      product_quantity: number;
      product_price_now: number;
    }[];
    cartId: string;
    total_amount: number;
  }) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const newOrder = OrderModel.create(
        [
          {
            customerId: new Types.ObjectId(customerId),
            delivery_address,
            order_item_list,
            total_amount,
          },
        ],
        { session }
      );

      await CartModel.updateOne(
        {
          _id: new Types.ObjectId(cartId),
          userId: new Types.ObjectId(customerId),
        },
        {
          $pull: {
            cart_item_list: {
              $in: order_item_list.map((item) => ({
                _id: new Types.ObjectId(item.cartProductId),
              })),
            },
          },
        },
        { session }
      );

      const updatedCart = await CartModel.findOne(
        {
          _id: new Types.ObjectId(cartId),
          userId: new Types.ObjectId(customerId),
        },
        'cart_item_list',
        { session }
      );

      const newCartQuantity = updatedCart
        ? updatedCart.cart_item_list.reduce(
            (sum, item) => sum + item.product_quantity,
            0
          )
        : 0;

      const newTotalPrice = updatedCart
        ? updatedCart.cart_item_list.reduce(
            (sum, item) => sum + item.product_quantity * item.product_price_now,
            0
          )
        : 0;

      // Cập nhật lại `cart_quantity`
      await CartModel.updateOne(
        {
          _id: new Types.ObjectId(cartId),
          userId: new Types.ObjectId(customerId),
        },
        {
          $set: { cart_quantity: newCartQuantity, total_price: newTotalPrice },
        },
        { session }
      );

      // Commit transaction nếu tất cả các bước thành công
      await session.commitTransaction();

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: { newOrder: newOrder },
        reasonStatusCode: EnumReasonStatusCode.CREATED_SUCCESSFULLY,
        message: 'Create Order Successfully!!!',
      });
    } catch {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  };

  //=====================================================================
  // cancel the order by customer
  static cancelTheOrderByCustomer = async ({
    customerId,
    orderId,
  }: {
    customerId: string;
    orderId: string;
  }) => {
    const cartProductDetail = await OrderModel.findOneAndDelete({
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(customerId),
    }).exec();

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: { cartProductDetail: { ...cartProductDetail } },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Get Cart Product Item Detail Successfully !!!',
    });
  };

  //=====================================================================
  // update new shipper
  static updateNewShipperOfOrder = async ({
    shipperId,
    orderId,
  }: {
    shipperId: string;
    orderId: string;
  }) => {
    // remember don't miss await promise
    const order = await OrderModel.findOne(new Types.ObjectId(orderId));

    if (!order) {
      throw new ErrorDTODataResponse({
        message: 'Order Not Found !!!',
        statusCode: 404,
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
      });
    }

    const newShipperId = new Types.ObjectId(shipperId);

    order.shipperId = newShipperId;

    await order.save();

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: { order: { ...order } },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Update New Shipper Of Order Successfully !!!',
    });
  };

  //=====================================================================
  // update order status
  static updateOrderStatus = async ({
    orderId,
    newStatus,
  }: {
    orderId: string;
    newStatus: EnumStatusOfOrder;
  }) => {
    const order = await OrderModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(orderId),
      },
      {
        $set: {
          order_status: newStatus,
        },
      }
    );

    if (!order) throw new Error('Order not found');

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: { order: order },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Update Order Status Successfully !!!',
    });
  };
}

export default OrderService;
