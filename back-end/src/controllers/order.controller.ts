import { NextFunction, Response, Request } from 'express';

import SuccessResponse from '@core/success.response';
import {
  EnumReasonStatusCode,
  EnumStatusOfOrder,
  WithCartRequest,
} from '@root/src/utils/type';
import OrderService from '../services/order.service';
import { DEFAULT_LIMIT } from '../utils/constant';

class OrderController {
  // =========================================================
  // create a new order for customer
  static createOrderForCustomer = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await OrderService.createOrderForCustomerV2({
      delivery_address: req.body?.delivery_address,
      order_item_list: req.body.order_item_list,
      customerId: req?.user?.userId,
      cartId: req.cartId,
      total_amount: req.body.total_amount,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create New Order Successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // get order information to payment
  static getOrderInformationToPayment = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await OrderService.getOrderInformationToPayment({
      orderId: req.params?.orderId,
      customerId: req?.user?.userId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Order Information To Payment Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // update payment success order
  static updatePaymentSuccessOrder = async (
    req: WithCartRequest,
    res: Response
  ) => {
    const data = await OrderService.updatePaymentSuccessOrder({
      orderId: String(req.query?.orderId),
      customerId: req?.user?.userId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update Payment Success Order Information Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // get detail of order
  static getDetailOfOrder = async (req: WithCartRequest, res: Response) => {
    const data = await OrderService.getDetailOfOrder({
      orderId: String(req.params?.orderId),
      customerId: req?.user?.userId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Detail Of Order Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // get all order of customer list
  static getAllOrderOfCustomerList = async (
    req: WithCartRequest,
    res: Response
  ) => {
    const data = await OrderService.getAllOrderOfCustomerList({
      limit: Number(req.query?.limit) || Number(DEFAULT_LIMIT),
      customerId: req?.user?.userId,
      page: Number(req.query?.page),
      orderStatus: req.query?.orderStatus as EnumStatusOfOrder,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get All Order Of Customer Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // get all order of customer list
  static destroyOrderItem = async (req: WithCartRequest, res: Response) => {
    const data = await OrderService.destroyOrderItem({
      orderId: String(req.params?.orderId),
      customerId: req?.user?.userId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Order Deleted And Product Quantities Updated Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default OrderController;
