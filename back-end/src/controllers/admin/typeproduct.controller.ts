import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import AdminTypeProductService from '@root/src/services/admin/typeProduct.service';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@root/src/utils/constant';

class AdminTypeProductController {
  //=========================================================
  // get all typeProduct list
  // query params: limit, page, priceMin, priceMax, searchName, selectedTypeProduct
  static getAllTypeProductList = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AdminTypeProductService.getAllTypeProductList({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get list typeProduct successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // get typeProduct item detail
  static getTypeProductItemDetail = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AdminTypeProductService.getTypeProductItemDetail({
      typeProductId: String(req.params.typeProductId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get typeProduct item detail successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // create new typeProduct
  static createNewTypeProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AdminTypeProductService.createNewTypeProduct({
      type_product_name: req.body.type_product_name,
      type_product_description: req.body.type_product_description,
      typeProductImagePath: req.file ? req.file.path : '',
      typeProductImageFieldName: 'type_product_image',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new typeProduct successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update typeProduct
  static updateTypeProduct = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AdminTypeProductService.updateTypeProduct({
      type_product_name: req.body.type_product_name,
      type_product_description: req.body.type_product_description,
      typeProductImagePath: req.file ? req.file.path : '',
      typeProductImageFieldName: 'type_product_image',
      typeProductId: req.params.typeProductId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update TypeProduct Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete typeProduct
  static deleteTypeProduct = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AdminTypeProductService.deleteTypeProduct({
      typeProductId: String(req.query.typeProductId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Delete TypeProduct Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default AdminTypeProductController;
