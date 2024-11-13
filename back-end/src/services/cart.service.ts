import mongoose, { Schema, Types } from 'mongoose';
import ErrorDTODataResponse from '../core/error.dto.response';
import SuccessDTODataResponse from '../core/success.dto.response';
import CartModel from '../models/cart.model';
import ProductModel, { PRODUCT_DOCUMENT_NAME } from '../models/product.model';
import UserModel from '../models/user.model';
import { EnumMessageStatus, EnumReasonStatusCode } from '../utils/type';
import { cloneDeep } from 'lodash';

class CartService {
  //=====================================================================
  // get all product in cart list
  static getAllProductInCartList = async ({
    limit,
    page,
    userId,
    cartId,
  }: {
    limit: number;
    page: number;
    userId: string;
    cartId: string;
  }) => {
    if (!userId || !cartId) {
    }

    // const carts = await CartModel.findById(new Types.ObjectId(cartId))
    const carts = await CartModel.findOne({
      _id: new Types.ObjectId(cartId),
      userId: new Types.ObjectId(userId),
    })
      .populate({
        path: 'cart_item_list.productId',
        model: PRODUCT_DOCUMENT_NAME,
        select:
          'product_name product_price product_image product_quantity  product_image  productId',
        options: { virtuals: true }, // Bao gồm các trường ảo (virtuals)
      })
      // .limit(limit)
      // .skip((page - 1) * limit)
      .select({
        cart_item_list: 1,
        cart_pagination_item_list: {
          $slice: [(page - 1) * limit, limit],
        },
        cartId: '$_id',
        cart_quantity: 1,
        total_price: 1,
        created_at: '$createdAt',
        updated_at: '$updatedAt',
        _id: 0,
      })
      .lean()
      .exec();

    const cartsReturn: any = cloneDeep(carts);

    if (cartsReturn !== null && cartsReturn !== undefined) {
      cartsReturn.cart_pagination_item_list = cartsReturn.cart_item_list.map(
        (item: { productId: { productId: any; _id: any } }) => {
          if (item.productId) {
            item.productId.productId = item.productId._id;
            delete item.productId._id; // Xóa trường _id
          }
          return item;
        }
      );
    }

    console.log('22 carts ===>', { cartsReturn });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        carts: {
          overview: { totalSearchCount: cartsReturn?.cart_item_list?.length },
          data: cartsReturn,
        },
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get All Product In Cart List Successfully !!!',
    });
  };

  //=====================================================================
  // get cart product item detail
  static getCartProductItemDetail = async ({
    productId,
    cartId,
    userId,
  }: {
    productId: string;
    cartId: string;
    userId: string;
  }) => {
    const cartProductDetail = await CartModel.findOne({
      _id: new Types.ObjectId(cartId),
      userId: new Types.ObjectId(userId),
    })
      .populate({
        path: 'cart_item_list.productId',
        model: PRODUCT_DOCUMENT_NAME,
        match: { _id: new Types.ObjectId(productId) }, // Lọc chỉ lấy sản phẩm có productId này
        justOne: true, // Chỉ lấy một tài liệu duy nhất
      })
      .exec();

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        cartProductDetail: { ...cartProductDetail },
      },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Get Cart Product Item Detail Successfully !!!',
    });
  };

  //=====================================================================
  // get cart product item detail version 2
  // static getCartProductItemDetailV2 = async ({
  //   productId,
  //   cartId,
  //   userId,
  // }: {
  //   productId: string;
  //   cartId: string;
  //   userId: string;
  // }) => {
  //   const cartProductDetail = await CartModel.findOne({
  //     _id: new Types.ObjectId(cartId),
  //     userId: new Types.ObjectId(userId),
  //   }).populate({
  //     path: 'cart_item_list.productId',
  //     model: PRODUCT_DOCUMENT_NAME,
  //   });

  //   if (cartProductDetail) {
  //     cartProductDetail.cart_item_list = cartProductDetail.cart_item_list.filter(
  //       (item) =>
  //         item.productId &&
  //         item.productId._id.toString() === productId.toString()
  //     );
  //   }

  //   return new SuccessDTODataResponse({
  //     statusCode: 200,
  //     metaData: { cartProductDetail: { ...cartProductDetail } },
  //     reasonStatusCode: EnumReasonStatusCode.SUCCESS,
  //     message: 'Get Cart Product Item Detail Successfully !!!',
  //   });
  // };

  //=====================================================================
  // update quantity product in cart
  // static updateQuantityProductInCart = async ({
  //   productId,
  //   cartId,
  //   quantity,
  //   userId,
  // }: {
  //   productId: string;
  //   cartId: string;
  //   quantity: number;
  //   userId: string;
  // }) => {
  //   const cart = CartModel.findOne({
  //     _id: new Types.ObjectId(cartId),
  //     userId: new Types.ObjectId(userId),
  //     cart_item_list: {
  //       $elementMatch: { productId: new Types.ObjectId(productId) },
  //     },
  //   }).exec();

  //   console.log(
  //     'cart_item_list =================================================================',
  //     { cart }
  //   );

  //   if (!cart) {
  //     throw new ErrorDTODataResponse({
  //       message: 'Cart Not Found !!!',
  //       statusCode: 404,
  //       reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
  //     });
  //   }
  // };

  //=====================================================================
  // update quantity product in cart version 2
  static updateQuantityProductInCartV2 = async ({
    cartProductId,
    cartId,
    product_quantity,
    userId,
  }: {
    cartProductId: string;
    cartId: string;
    product_quantity: number;
    userId: string;
  }) => {
    // Bước 1: Cập nhật product_quantity của phần tử trong cart_item_list
    const cartUpdate = await CartModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(cartId),
        userId: new Types.ObjectId(userId),
        'cart_item_list._id': new Types.ObjectId(cartProductId),
      },
      {
        $set: { 'cart_item_list.$.product_quantity': product_quantity },
      },
      {
        new: true, // Trả về giỏ hàng sau khi cập nhật
      }
    ).exec();

    // Bước 2: Tính lại cart_quantity (tổng số lượng sản phẩm trong giỏ hàng)
    if (cartUpdate) {
      const updatedCartQuantity = cartUpdate.cart_item_list.reduce(
        (total, item) => total + item.product_quantity,
        0
      );

      // Cập nhật cart_quantity trong giỏ hàng
      await CartModel.updateOne(
        { _id: new Types.ObjectId(cartId) },
        { $set: { cart_quantity: updatedCartQuantity } }
      );
    }

    console.log(
      'cart_item_list =================================================================',
      { cartUpdate }
    );

    if (!cartUpdate) {
      throw new ErrorDTODataResponse({
        message: 'Cart Not Found !!!',
        statusCode: 404,
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
      });
    }

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        cartUpdate: { ...cartUpdate },
      },
      reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
      message: 'Get Cart Product Item Detail Successfully !!!',
    });
  };

  //=====================================================================
  // create new cart for user if it not exist
  // get cart information
  static createNewCartAndGetCartForUser = async ({
    userId,
  }: {
    userId: string;
  }) => {
    if (!userId) {
      throw new ErrorDTODataResponse({
        message: 'UserId Not Found !!!',
        statusCode: 401,
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER_ID,
      });
    }

    const user = await UserModel.findById(new Types.ObjectId(userId));

    if (!user) {
      throw new ErrorDTODataResponse({
        message: 'User Not Found !!!',
        statusCode: 401,
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER,
      });
    }

    const checkCart = await CartModel.findOne({
      userId: new Types.ObjectId(userId),
    });

    if (!checkCart) {
      const newCart = new CartModel({
        userId: new Types.ObjectId(userId),
        cart_item_list: [],
        cart_quantity: 0,
      });

      await newCart.save();

      return {
        cart: newCart,
        cartId: newCart._id.toString(),
      };
    }

    return {
      cart: checkCart,
      cartId: checkCart._id.toString(),
    };
  };

  //=====================================================================
  // update product
  static addProductInCartItems = async ({
    userId,
    cartId,
    productId,
    product_quantity,
  }: {
    userId: string;
    cartId: string;
    productId: string;
    product_quantity: number;
  }) => {};

  //=====================================================================
  // delete product in cart
  static deleteProductInCartItems = async ({
    cartProductId,
    cartId,
    userId,
  }: {
    cartProductId: string;
    cartId: string;
    userId: string;
  }) => {
    // Bước 1: Tìm và lấy product_quantity của phần tử bị xóa
    const cartItem = await CartModel.findOne(
      {
        _id: new Types.ObjectId(cartId),
        userId: new Types.ObjectId(userId),
        'cart_item_list._id': new Types.ObjectId(cartProductId),
      },
      {
        'cart_item_list.$': 1, // Chỉ lấy phần tử cần xóa
      }
    );

    let deletedCart;

    if (cartItem && cartItem.cart_item_list.length > 0) {
      const productQuantityToRemove =
        cartItem.cart_item_list[0].product_quantity;

      // Bước 2: Xóa phần tử và cập nhật cart_quantity
      deletedCart = await CartModel.findOneAndUpdate(
        {
          _id: new Types.ObjectId(cartId),
          userId: new Types.ObjectId(userId),
        },
        {
          $pull: {
            cart_item_list: { _id: new Types.ObjectId(cartProductId) },
          },
          $inc: {
            cart_quantity: -productQuantityToRemove, // Trừ đi product_quantity của phần tử bị xóa
          },
        },
        { new: true } // Trả về tài liệu sau khi cập nhật
      );

      console.log(deletedCart);
    }

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        deletedCart,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
      message: 'Get Cart Product Item Detail Successfully !!!',
    });
  };

  //=====================================================================
  // delete product in cart version 2
  static deleteProductInCartItemsV2 = async ({
    productId,
    cartId,
    userId,
  }: {
    productId: string;
    cartId: string;
    userId: string;
  }) => {
    const deletedCart = await CartModel.findOne({
      _id: new Types.ObjectId(cartId),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!deletedCart) {
      throw new ErrorDTODataResponse({
        message: 'Cart Not Found!!!',
        statusCode: 404,
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
      });
    }

    // deletedCart.cart_item_list = deletedCart.cart_item_list.filter(
    //   (item) => item.productId.toString() !== productId
    // );

    deletedCart.cart_item_list.pull({
      productId: new Types.ObjectId(productId),
    });

    await deletedCart.save();

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        deletedCart,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
      message: 'Get Cart Product Item Detail Successfully !!!',
    });
  };

  //=====================================================================
  // add product in cart items version 2
  static addProductInCartItemsV2 = async ({
    productId,
    cartId,
    userId,
    product_quantity,
  }: {
    userId: string;
    cartId: string;
    productId: string;
    product_quantity: number;
  }) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
      // Tìm sản phẩm để lấy giá hiện tại
      const product = await ProductModel.findById(
        new Types.ObjectId(productId)
      );

      if (!product) {
        throw new ErrorDTODataResponse({
          statusCode: 404,
          reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
          message: 'Product Not Found !!!',
        });
      }

      // Cập nhật hoặc thêm sản phẩm vào giỏ hàng
      const cart = await CartModel.findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
          'cart_item_list.productId': new Types.ObjectId(productId),
        },
        {
          $inc: {
            'cart_item_list.$.product_quantity': product_quantity,
          },
          $set: {
            'cart_item_list.$.product_price_now': product.product_price,
          },
        },
        {
          new: true,
          // session,
        }
      );

      if (!cart) {
        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới
        await CartModel.findOneAndUpdate(
          {
            userId: new Types.ObjectId(userId),
            _id: new Types.ObjectId(cartId),
          },
          {
            $push: {
              cart_item_list: {
                productId: new Types.ObjectId(productId),
                product_quantity: product_quantity,
                product_price_now: product.product_price,
              },
            },
          },
          {
            new: true,
            upsert: true,
            // session,
          }
        );
      }

      // ----------------------------------------------------------------
      // Cập nhật cart_quantity và total_price sau khi thêm hoặc cập nhật sản phẩm
      // const updateCart = await CartModel.findOneAndUpdate(
      //   {
      //     userId: new Types.ObjectId(userId),
      //   },
      //   [
      //     {
      //       $set: {
      //         cart_quantity: { $sum: '$cart_item_list.product_quantity' },
      //         total_price: {
      //           $sum: {
      //             $multiply: [
      //               '$cart_item_list.product_quantity',
      //               '$cart_item_list.product_price_now',
      //             ],
      //           },
      //         },
      //       },
      //     },
      //   ]
      // );

      const updateCart = await CartModel.findOneAndUpdate(
        {
          userId: new Types.ObjectId(userId),
        },
        [
          {
            $set: {
              cart_quantity: {
                $reduce: {
                  input: '$cart_item_list',
                  initialValue: 0,
                  in: { $add: ['$$value', '$$this.product_quantity'] },
                },
              },
              total_price: {
                $reduce: {
                  input: '$cart_item_list',
                  initialValue: 0,
                  in: {
                    $add: [
                      '$$value',
                      {
                        $multiply: [
                          '$$this.product_quantity',
                          '$$this.product_price_now',
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        ],
        {
          new: true,
          // session
        }
      );

      if (!updateCart) {
        throw new ErrorDTODataResponse({
          statusCode: 404,
          reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_404,
          message: 'Cart Not Found !!!',
        });
      }

      // ----------------------------------------------------------------
      // nếu dùng aggregate như này thì chỉ lấy ra
      // const updateCart = await CartModel.aggregate([
      //   {
      //     $match: {
      //       userId: new Types.ObjectId(userId),
      //     },
      //   },
      //   {
      //     $unwind: '$cart_item_list', // Trải phẳng mảng cart_item_list thành các tài liệu riêng lẻ
      //   },
      //   {
      //     $group: {
      //       _id: '$userId',
      //       cart_quantity: { $sum: '$cart_item_list.product_quantity' },
      //       total_price: {
      //         $sum: {
      //           $multiply: [
      //             '$cart_item_list.product_quantity',
      //             '$cart_item_list.product_price_now',
      //           ],
      //         },
      //       },
      //     },
      //   },
      // ]);

      // await session.commitTransaction();

      return new SuccessDTODataResponse({
        message: 'Add Product In Cart Items Successfully !!!',
        metaData: {
          cart: {
            cartId: updateCart._id.toString(),
            ...updateCart,
          },
        },
        statusCode: 201,
        reasonStatusCode: EnumMessageStatus.CREATED_201,
      });
    } catch (error) {
      // await session.abortTransaction();

      throw new ErrorDTODataResponse({
        message: (error as any).message,
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    } finally {
      // await session.endSession();
    }
  };
}

export default CartService;
