import { NextFunction, Request, Response } from 'express';
import ProductService from '@services/product.service';

import SuccessResponse from '@core/success.response';
import {
  EnumMessageStatus,
  EnumReasonStatusCode,
  InterfaceWithCartRequest,
  InterfaceWithKeyStoreV2Request,
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
import StripePaymentService from '../services/stripePayment.service';

class StripePaymentController {
  // =========================================================
  // config for stripe payment
  static configForStripePayment = async (
    req: InterfaceWithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await StripePaymentService.configForStripePayment();

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Publishable Key Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // create payment intent
  static createPaymentIntent = async (
    req: InterfaceWithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await StripePaymentService.createPaymentIntent({
      totalAmount: req.body.totalAmount,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create Payment Intent Successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };
}

export default StripePaymentController;
