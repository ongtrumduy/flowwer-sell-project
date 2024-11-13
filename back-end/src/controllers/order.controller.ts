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
import OrderService from '../services/order.service';

class OrderController {
  // =========================================================
  // create a new order for customer
  static createOrderForCustomer = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await OrderService.createOrderForCustomer({
      delivery_address: req.body?.delivery_address,
      order_item_list: req.body.order_item_list,
      customerId: req?.user?.userId,
      cartId: req.cartId,
      total_amount: req.body.total_amount,
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
}

export default OrderController;
