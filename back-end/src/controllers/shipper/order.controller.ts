import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, EnumReasonStatusCode, EnumStatusOfOrder, InterfaceWithCartRequest, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import ShipperOrderService from '@root/src/services/shipper/order.service';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@root/src/utils/constant';

class ShipperOrderController {
  //=========================================================
  // get all order list
  // query params: limit, page, priceMin, priceMax, searchName, selectedOrder
  static getAllOrderList = async (req: Request, res: Response, next: NextFunction) => {
    const data = await ShipperOrderService.getAllOrderListV3({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
      orderStatus: (req.query?.orderStatus as EnumStatusOfOrder) || 'ALL',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Get list order successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // get order item detail
  static getOrderItemDetail = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await ShipperOrderService.getOrderItemDetail({
      orderId: String(req.params.orderId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Get order item detail successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // create new order
  static createNewOrder = async (req: Request, res: Response, next: NextFunction) => {
    const data = await ShipperOrderService.createNewOrder({
      order_name: req.body.order_name,
      order_description: req.body.order_description,
      orderImagePath: req.file ? req.file.path : '',
      orderImageFieldName: 'order_image',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Create new order successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update order
  static updateOrder = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await ShipperOrderService.updateOrder({
      order_name: req.body.order_name,
      order_description: req.body.order_description,
      orderImagePath: req.file ? req.file.path : '',
      orderImageFieldName: 'order_image',
      orderId: req.params.orderId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Update Order Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete order
  static deleteOrder = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await ShipperOrderService.deleteOrder({
      orderId: String(req.query.orderId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Delete Order Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete order
  static getShipperDataList = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await ShipperOrderService.getShipperDataList({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Delete Order Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // get all order of shipper list
  static getAllOrderOfShipperList = async (req: InterfaceWithKeyStoreV2Request, res: Response) => {
    const data = await ShipperOrderService.getAllOrderOfShipperList({
      limit: Number(req.query?.limit) || Number(DEFAULT_LIMIT),
      shipperId: req?.user?.userId,
      page: Number(req.query?.page),
      orderStatus: req.query?.orderStatus as EnumStatusOfOrder,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Get All Order Of Customer Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // change status of order of shipper
  static changeStatusOfOrderOfShipper = async (req: InterfaceWithKeyStoreV2Request, res: Response) => {
    const data = await ShipperOrderService.changeStatusOfOrderOfShipper({
      orderId: req.body.orderId,
      shipperId: req.user.userId,
      currentOrderStatus: req.body.currentOrderStatus as EnumStatusOfOrder,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data.message || 'Change Status Of Order Of Shipper Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // get detail of order
  static getDetailOfOrder = async (req: InterfaceWithCartRequest, res: Response) => {
    const data = await ShipperOrderService.getDetailOfOrder({
      orderId: String(req.params?.orderId),
      shipperId: req?.user?.userId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Detail Of Order Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default ShipperOrderController;
