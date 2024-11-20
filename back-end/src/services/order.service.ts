import mongoose, { Types } from 'mongoose';
import ErrorDTODataResponse from '../core/error.dto.response';
import SuccessDTODataResponse from '../core/success.dto.response';
import CartModel from '../models/cart.model';
import OrderModel from '../models/order.model';
import ProductModel, { PRODUCT_DOCUMENT_NAME } from '../models/product.model';
import { getInformationData, getInformationData_V2 } from '../utils';
import { EnumReasonStatusCode, EnumStatusOfOrder } from '../utils/type';

class OrderService {
  //=====================================================================
  // get all order of customer list
  static getAllOrderOfCustomerList = async ({
    limit,
    page,
    customerId,
    orderStatus,
  }: {
    limit: number;
    page: number;
    customerId: string;
    orderStatus: EnumStatusOfOrder;
  }) => {
    if (!orderStatus) {
      throw new ErrorDTODataResponse({
        message: 'OrderStatus Is Required !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
        statusCode: 400,
      });
    }

    const orders = await OrderModel.find({
      customerId: new Types.ObjectId(customerId),
      order_status_stage: orderStatus, // Chú ý: phải dùng `order_status_stage` thay vì `orderStatus`
    })
      .populate({
        path: 'order_item_list.productId',
        model: PRODUCT_DOCUMENT_NAME,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ order_date: -1 }) // Sắp xếp giảm dần theo ngày đặt hàng
      .lean()
      .exec();

    // Đếm tổng số đơn hàng theo bộ lọc
    const totalOrderStatusItem = await OrderModel.countDocuments({
      customerId: new Types.ObjectId(customerId),
      orderStatus,
    });

    if (!orders) {
      throw new ErrorDTODataResponse({
        statusCode: 404,
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
        message: 'Not Found Order List By CustomerId !!!',
      });
    }

    console.log('22 carts ===>', { orders });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        orders: orders,
        totalOrderStatusItem,
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get All Order Of Customer Successfully !!!',
    });
  };

  //=====================================================================
  // get detail of order
  static getDetailOfOrder = async ({
    orderId,
    customerId,
  }: {
    orderId: string;
    customerId: string;
  }) => {
    if (!customerId) {
      throw new ErrorDTODataResponse({
        message: 'CustomerId Is Required !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
        statusCode: 400,
      });
    }

    if (!orderId) {
      throw new ErrorDTODataResponse({
        message: 'OrderId Is Required !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
        statusCode: 400,
      });
    }

    const order = await OrderModel.findOne({
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(customerId),
    })
      .populate('order_item_list.productId')
      .lean()
      .exec();

    if (!order) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: 'Order Not Found or Not Belong To Customer!!!',
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
      });
    }

    console.log('22 carts ===>', { order });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        order: {
          ...getInformationData_V2({
            fields: [
              'orderId',
              'total_amount',
              'delivery_address',
              'order_item_list',
              'pickup_address',
              'order_status_stage',
              'delivery_date',
              'pickup_date',
              'process_timeline',
              'event',
              'timestamp',
              'currentTime',
              'order_code',
              'order_date',
              'shipperId',
              'customerId',
            ],
            object: { ...order, orderId: order?._id },
          }),
        },
      },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Get Detail Of Order Successfully !!!',
    });
  };

  //=====================================================================
  // create order for customer
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
      productId: string;
      product_quantity: number;
      product_price_now: number;
    }[];
    cartId: string;
    total_amount: number;
  }) => {
    // Đảm bảo MongoDB chạy trong replica set mode:
    // mongod --replSet rs0

    // Sau đó khởi tạo replica set mode
    // mongo
    // rs.initiate()

    let session;

    try {
      session = await mongoose.startSession();
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
      });
    }

    try {
      session.startTransaction();

      // =================================================================
      // Kiểm tra từng sản phẩm trong danh sách đặt hàng
      for (const item of order_item_list) {
        const product = await ProductModel.findById(item.productId).session(
          session
        );

        if (!product) {
          throw new ErrorDTODataResponse({
            statusCode: 500,
            reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
            message: `Product with ID ${item.productId} does not exist !!!`,
          });
        }

        if (item.product_quantity > product.product_quantity) {
          throw new ErrorDTODataResponse({
            statusCode: 500,
            reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
            message: `The quantity ordered (${item.product_quantity}) for the product "${product.product_name}" exceeds the available stock (${product.product_quantity}) !!!`,
          });
        }
      }
      // =================================================================

      const newOrder = await OrderModel.create(
        [
          {
            customerId: new Types.ObjectId(customerId),
            delivery_address,
            order_item_list: order_item_list.map((item) => {
              return {
                productId: new Types.ObjectId(item.productId),
                product_quantity: item.product_quantity,
                product_price_now: item.product_price_now,
              };
            }),
            total_amount,
            process_timeline: [
              {
                event: EnumStatusOfOrder.PENDING,
                timestamp: new Date(),
                currentTime: new Date(),
              },
            ],
            order_status_stage: EnumStatusOfOrder.PENDING,
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
              $in: order_item_list.map((item) => {
                return new Types.ObjectId(item.productId);
              }),
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
        metaData: {
          newOrder: getInformationData({
            fields: [
              'orderId',
              'total_amount',
              'delivery_address',
              'order_item_list',
              'pickup_address',
              'order_status_stage',
              'delivery_date',
              'pickup_date',
              'process_timeline',
              'event',
              'timestamp',
              'currentTime',
            ],
            object: { ...newOrder, orderId: newOrder[0]._id },
          }),
        },
        reasonStatusCode: EnumReasonStatusCode.CREATED_SUCCESSFULLY,
        message: 'Create Order Successfully!!!',
      });
    } catch (error) {
      await session.abortTransaction();

      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message || 'Create Order Failed!!!',
      });
    } finally {
      session.endSession();
    }
  };

  //=====================================================================
  // create order for customer version 2
  static createOrderForCustomerV2 = async ({
    customerId,
    delivery_address,
    order_item_list,
    cartId,
    total_amount,
  }: {
    customerId: string;
    delivery_address: string;
    order_item_list: {
      productId: string;
      product_quantity: number;
      product_price_now: number;
    }[];
    cartId: string;
    total_amount: number;
  }) => {
    // Đảm bảo MongoDB chạy trong replica set mode:
    // mongod --replSet rs0

    // Sau đó khởi tạo replica set mode
    // mongo
    // rs.initiate()

    let session;

    try {
      session = await mongoose.startSession();
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message,
      });
    }

    try {
      session.startTransaction();

      // =================================================================
      // Kiểm tra từng sản phẩm trong danh sách đặt hàng
      for (const item of order_item_list) {
        try {
          const product = await ProductModel.findById(
            new Types.ObjectId(item.productId)
          ).session(session);

          if (!product) {
            throw new ErrorDTODataResponse({
              statusCode: 500,
              reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
              message: `Product with ID ${item.productId} does not exist !!!`,
            });
          }

          if (item.product_quantity > product.product_quantity) {
            throw new ErrorDTODataResponse({
              statusCode: 500,
              reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
              message: `The quantity ordered (${item.product_quantity}) for the product "${product.product_name}" exceeds the available stock (${product.product_quantity}) !!!`,
            });
          }
        } catch (error) {
          throw new ErrorDTODataResponse({
            statusCode: 500,
            reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
            message: (error as Error).message,
          });
        }
      }
      // =================================================================
      const convertOrderItemToList = order_item_list.map((item) => {
        return {
          productId: new Types.ObjectId(item.productId),
          product_quantity: item.product_quantity,
          product_price_now: item.product_price_now,
        };
      });

      const newOrder = await OrderModel.create(
        [
          {
            customerId: new Types.ObjectId(customerId),
            delivery_address,
            order_item_list: convertOrderItemToList,
            total_amount,
            process_timeline: [
              {
                event: EnumStatusOfOrder.PENDING,
                timestamp: new Date(),
                currentTime: new Date(),
              },
            ],
            order_status_stage: EnumStatusOfOrder.PENDING,
          },
        ],
        { session }
      );

      // ==================================================================
      // Remove items from the cart
      const cart = await CartModel.findOne({
        _id: new Types.ObjectId(cartId),
        userId: new Types.ObjectId(customerId),
      }).session(session);

      if (!cart) {
        throw new Error(`Cart for user with ID ${customerId} does not exist.`);
      }

      // ==================================================================
      // Filter out items in the cart that were added to the order
      // const filteredItems = cart.cart_item_list.filter(
      //   (cartItem) =>
      //     !order_item_list.some(
      //       (orderItem) =>
      //         String(orderItem.productId) === String(cartItem.productId)
      //     )
      // );

      // // Cập nhật từng phần tử bằng cách sử dụng `set`
      // cart.cart_item_list.splice(0); // Xóa toàn bộ mảng cũ
      // filteredItems.forEach((item, index) => {
      //   cart.cart_item_list.set(index, item); // Thêm từng phần tử mới vào
      // });
      // ==================================================================
      // try {
      //   order_item_list.forEach((orderItem) => {
      //     cart.cart_item_list.pull({
      //       productId: new Types.ObjectId(orderItem.productId),
      //     });
      //   });
      //   // ==================================================================

      //   // Recalculate cart totals
      //   cart.cart_quantity = cart.cart_item_list.reduce(
      //     (acc, item) => acc + item.product_quantity,
      //     0
      //   );
      //   cart.total_price = cart.cart_item_list.reduce(
      //     (acc, item) => acc + item.product_quantity * item.product_price_now,
      //     0
      //   );

      //   await cart.save({ session });
      // } catch (error) {
      //   throw new ErrorDTODataResponse({
      //     statusCode: 500,
      //     reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      //     message: (error as Error).message,
      //   });
      // }

      const updatedCart = await CartModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(cartId),
          userId: new Types.ObjectId(customerId),
        },
        {
          $pull: {
            cart_item_list: {
              productId: {
                $in: order_item_list.map(
                  (item) => new Types.ObjectId(item.productId)
                ),
              },
            },
          },
        },
        { upsert: true, new: true, session }
      );

      //   // Recalculate cart totals
      updatedCart.cart_quantity = cart.cart_item_list.reduce(
        (acc, item) => acc + item.product_quantity,
        0
      );
      updatedCart.total_price = cart.cart_item_list.reduce(
        (acc, item) => acc + item.product_quantity * item.product_price_now,
        0
      );

      await updatedCart.save({ session });
      // ==================================================================

      // Commit transaction nếu tất cả các bước thành công
      await session.commitTransaction();

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          newOrder: getInformationData({
            fields: [
              'orderId',
              'total_amount',
              'delivery_address',
              'order_item_list',
              'pickup_address',
              'order_status_stage',
              'delivery_date',
              'pickup_date',
              'process_timeline',
              'event',
              'timestamp',
              'currentTime',
            ],
            object: { ...newOrder, orderId: newOrder[0]._id },
          }),
        },
        reasonStatusCode: EnumReasonStatusCode.CREATED_SUCCESSFULLY,
        message: 'Create Order Successfully!!!',
      });
    } catch (error) {
      await session.abortTransaction();

      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message || 'Create Order Failed!!!',
      });
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

  //=====================================================================
  // get order information to payment
  static getOrderInformationToPayment = async ({
    orderId,
    customerId,
  }: {
    orderId: string;
    customerId: string;
  }) => {
    const order = await OrderModel.findOne({
      _id: new Types.ObjectId(orderId),
      customerId: new Types.ObjectId(customerId),
    })
      .populate('order_item_list.productId')
      .populate('shipperId')
      .lean()
      .exec();

    if (!order) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: 'Order Not Found or Not Belong To Customer!!!',
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
      });
    }

    const returnOrder = getInformationData_V2({
      fields: [
        'orderId',
        'total_amount',
        'delivery_address',
        'order_item_list',
        'pickup_address',
        'order_status_stage',
        'delivery_date',
        'pickup_date',
        'process_timeline',
        'event',
        'timestamp',
        'currentTime',
        'order_code',
        'order_date',
        'shipperId',
        'customerId',
      ],
      object: { ...order, orderId: order._id },
    });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        order: returnOrder,
      },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Get Order Information To Payment Successfully !!!',
    });
  };

  // =====================================================================
  // get order information to payment
  static updatePaymentSuccessOrder = async ({
    orderId,
    customerId,
  }: {
    orderId: string;
    customerId: string;
  }) => {
    let session = null;

    try {
      session = await mongoose.startSession();
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }

    try {
      session.startTransaction(); // Bắt đầu transaction

      const order = await OrderModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(orderId),
          customerId: new Types.ObjectId(customerId),
          order_status_stage: EnumStatusOfOrder.PENDING,
        },
        {
          $set: {
            order_status_stage: EnumStatusOfOrder.PAYMENT_SUCCESS,
          },
          $push: {
            process_timeline: {
              event: EnumStatusOfOrder.PAYMENT_SUCCESS, // Trạng thái mới
              timestamp: new Date(), // Thời gian hiện tại
            },
          },
        },
        { new: true, upsert: true, session }
      ).populate('order_item_list.productId');

      if (!order) {
        throw new ErrorDTODataResponse({
          statusCode: 500,
          message: 'Order Not Found or Not Belong To Customer!!!',
          reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        });
      }

      // Giảm product_quantity cho từng sản phẩm trong order_item_list
      for (const item of order.order_item_list) {
        const { productId, product_quantity } = item;

        const updatedProduct = await ProductModel.findOneAndUpdate(
          { _id: productId },
          { $inc: { product_quantity: -product_quantity } }, // Giảm số lượng
          { session, new: true }
        );

        if (!updatedProduct || updatedProduct.product_quantity < 0) {
          throw new ErrorDTODataResponse({
            message: `Product ${productId} does not have enough stock.`,
            statusCode: 500,
            reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
          });
        }
      }

      await session.commitTransaction();

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          order: order,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get Order Information To Payment Successfully !!!',
      });
    } catch (error) {
      await session.abortTransaction();

      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    } finally {
      session.endSession();
    }
  };

  // ======================================================================
  //
  static destroyOrderItem = async ({
    orderId,
    customerId,
  }: {
    orderId: string;
    customerId: string;
  }) => {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      // Lấy thông tin đơn hàng

      // Xóa đơn hàng
      // await OrderModel.findByIdAndDelete(orderId).session(session);

      // không xóa cập nhật lại trạng thái thoi

      const order = await OrderModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(orderId),
          customerId: new Types.ObjectId(customerId),
          order_status_stage: EnumStatusOfOrder.PENDING,
        },
        {
          $set: {
            order_status_stage: EnumStatusOfOrder.CANCELLED,
          },
          $push: {
            process_timeline: {
              event: EnumStatusOfOrder.CANCELLED, // Trạng thái mới
              timestamp: new Date(), // Thời gian hiện tại
            },
          },
        },
        { new: true, upsert: true, session }
      );

      if (!order) {
        throw new ErrorDTODataResponse({
          statusCode: 500,
          message: 'Order Not Found or Not Belong To Customer!!!',
          reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        });
      }

      // Cập nhật số lượng sản phẩm
      for (const item of order.order_item_list) {
        const { productId, product_quantity } = item;

        const updatedProduct = await ProductModel.findByIdAndUpdate(
          productId,
          { $inc: { product_quantity } },
          { new: true, session }
        );

        if (!updatedProduct) {
          throw new ErrorDTODataResponse({
            statusCode: 500,
            message: 'Failed to update product with ID ${productId}',
            reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
          });
        }
      }

      // Hoàn tất transaction
      await session.commitTransaction();

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          order: order,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message:
          'Order Deleted And Product Quantities Updated Successfully !!!',
      });
      console.log(
        'Order deleted and product quantities updated successfully !'
      );
    } catch (error) {
      // Rollback nếu có lỗi
      await session.abortTransaction();
      console.error('Error occurred, rolling back:', (error as Error).message);
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    } finally {
      session.endSession();
    }
  };
}

export default OrderService;
