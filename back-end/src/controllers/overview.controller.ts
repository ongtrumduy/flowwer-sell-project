import { NextFunction, Response } from 'express';

import SuccessResponse from '@core/success.response';
import {
  EnumReasonStatusCode,
  InterfaceWithKeyStoreV2Request,
} from '@root/src/utils/type';
import cloudinaryConfig from '../configs/config.cloudinary';
import OverviewService from '../services/overview.service';
import OrderModel from '../models/order.model';
import SuccessDTODataResponse from '../core/success.dto.response';

const cloudinary = cloudinaryConfig();

class OverviewController {
  // =========================================================
  // change information
  static overviewDashboardCountInformation = async (
    req: InterfaceWithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await OverviewService.overviewDashboardCountInformation({
      haveRoleUser: req.user,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Overview Dashboard Successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =================================================================
  //
  static getRevenueByMonth = async (
    req: InterfaceWithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await OverviewService.getRevenueByMonth({
      haveRoleUser: req.user,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Overview Dashboard Successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =================================================================
  //
  static getUsersByMonth = async (
    req: InterfaceWithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await OverviewService.getUsersByMonth({
      haveRoleUser: req.user,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Overview Dashboard Successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =================================================================
  //
  static getOrdersByMonth = async (
    req: InterfaceWithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await OverviewService.getOrdersByMonth({
      haveRoleUser: req.user,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get Overview Dashboard Successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default OverviewController;
