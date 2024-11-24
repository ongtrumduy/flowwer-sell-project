import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import TypeProductService from '@root/src/services/public/typeProduct.service';

class TypeProductController {
  //=========================================================
  // get all typeProduct list
  static getAllTypeProductList = async (req: Request, res: Response, next: NextFunction) => {
    const data = await TypeProductService.getAllTypeProductList();

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
    const data = await TypeProductService.getTypeProductItemDetail({
      typeProductId: String(req.params.typeProductId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get typeProduct item detail successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // find list search typeProduct
  static findListSearchTypeProduct = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await TypeProductService.findListSearchTypeProduct({
      key_search: req.query?.key_search ? String(req.query.key_search) : '',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Find list search typeProduct successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // create new typeProduct
  static createNewTypeProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = await TypeProductService.createNewTypeProduct({
      type_product_name: req.body.type_product_name,
      type_product_description: req.body.type_product_description,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new typeProduct successfully !!!',
      statusCode: data?.code || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update typeProduct
  static updateTypeProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = await TypeProductService.updateTypeProduct({
      type_product_name: req.body.type_product_name,
      type_product_description: req.body.type_product_description,
      typeProductId: req.params.typeProductId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update typeProduct successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete typeProduct
  static deleteTypeProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = await TypeProductService.deleteTypeProduct({
      typeProductId: req.params.typeProductId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update typeProduct successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default TypeProductController;
