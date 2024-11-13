import { NextFunction, Request, Response } from 'express';
import ProductService from '@services/product.service';

import SuccessResponse from '@core/success.response';
import {
  EnumMessageStatus,
  EnumReasonStatusCode,
  WithCartRequest,
  WithKeyStoreV2Request,
} from '@root/src/utils/type';
import {
  DEFAULT_LIMIT,
  DEFAULT_MAX_PRICE,
  DEFAULT_MIN_PRICE,
  DEFAULT_PAGE,
} from '../utils/constant';
import CartService from '../services/cart.service';
import mongoose from 'mongoose';
import ProductModel from '../models/product.model';

class CartController {
  // =========================================================
  // get all product list
  // query params: limit, page, userId, cartId
  static getAllProductInCartList = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CartService.getAllProductInCartList({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      userId: req?.user?.userId,
      cartId: req.cartId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get All Product In Cart List Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  // =================================================================
  // create new cart and get cart for user
  static createNewCartAndGetCartForUser = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { cart, cartId } = await CartService.createNewCartAndGetCartForUser({
      userId: req?.user?.userId,
    });

    req.cart = cart;
    req.cartId = cartId;

    return next();
  };

  // =========================================================
  // get cart product item details
  static getCartProductItemDetail = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CartService.getCartProductItemDetail({
      productId: req?.params.productId,
      userId: req?.user.userId,
      cartId: req.cartId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get All Product In Cart List Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // update quantity product in cart 2
  static updateQuantityProductInCartV2 = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CartService.updateQuantityProductInCartV2({
      cartProductId: req.body.cartProductId,
      userId: req?.user.userId,
      cartId: req.cartId,
      product_quantity: req.body.product_quantity,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update Quantity Product In Cart Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.UPDATED_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // delete product in cart items
  static deleteProductInCartItems = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CartService.deleteProductInCartItems({
      cartProductId: req?.params.cartProductId,
      userId: req?.user.userId,
      cartId: req.cartId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Delete Product In Cart Items Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.REMOVED_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // add product in cart items
  // static addProductInCartItems = async (
  //   req: WithCartRequest,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const data = await CartService.addProductInCartItemsV2({
  //     productId: req?.params.productId,
  //     product_quantity: req.body.product_quantity,
  //     userId: req?.user.userId,
  //     cartId: req.cartId,
  //   });

  //   new SuccessResponse({
  //     metaData: data?.metaData,
  //     message: 'Delete Product In Cart Items Successfully !!!',
  //     statusCode: data?.statusCode || 200,
  //     reasonStatusCode:
  //       data?.reasonStatusCode || EnumReasonStatusCode.REMOVED_SUCCESSFULLY,
  //   }).send({
  //     res,
  //     headers: null,
  //   });
  // };

  // =========================================================
  // add product in cart items version 2
  static addProductInCartItemsV2 = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CartService.addProductInCartItemsV2({
      productId: req.body.productId,
      product_quantity: req.body.product_quantity,
      userId: req?.user.userId,
      cartId: req.cartId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Add Product In Cart Items Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.CREATED_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };
}

export default CartController;
