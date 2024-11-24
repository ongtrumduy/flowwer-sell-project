import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, EnumStatusOfOrder, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import AdminOrderService from '@root/src/services/admin/order.service';
import { DEFAULT_LIMIT, DEFAULT_ORDER_STAGE, DEFAULT_PAGE } from '@root/src/utils/constant';

class AdminOrderController {
  //=========================================================
  // get all order list
  // query params: limit, page, priceMin, priceMax, searchName, selectedOrder
  static getAllOrderList = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AdminOrderService.getAllOrderListV3({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
      orderStatus: (req.query?.orderStatus as EnumStatusOfOrder) || DEFAULT_ORDER_STAGE,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get list order successfully !!!',
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
    const data = await AdminOrderService.getOrderItemDetail({
      orderId: String(req.params.orderId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get order item detail successfully !!!',
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
    const data = await AdminOrderService.createNewOrder({
      order_name: req.body.order_name,
      order_description: req.body.order_description,
      orderImagePath: req.file ? req.file.path : '',
      orderImageFieldName: 'order_image',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new order successfully !!!',
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
    const data = await AdminOrderService.updateOrder({
      order_name: req.body.order_name,
      order_description: req.body.order_description,
      orderImagePath: req.file ? req.file.path : '',
      orderImageFieldName: 'order_image',
      orderId: req.params.orderId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update Order Successfully !!!',
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
    const data = await AdminOrderService.deleteOrder({
      orderId: String(req.query.orderId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Delete Order Successfully !!!',
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
    const data = await AdminOrderService.getShipperDataList({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Delete Order Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default AdminOrderController;
