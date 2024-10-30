import { NextFunction, Request, Response } from 'express';
import ProductService from '@services/product.service';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus } from '@root/src/utils/type';
import { WithKeyStoreV2Request } from '@auth/authUtils';

class ProductController {
  //=========================================================
  // get all product list
  static getAllProductList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await ProductService.getAllProductList({
      limit: req.query?.limit ? Number(req.query.limit) : 10,
      page: req.query?.page ? Number(req.query.page) : 1,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get list product successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // get product item detail
  static getProductItemDetail = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await ProductService.getProductItemDetail({
      productId: String(req.params.productId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get product item detail successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // find list search product
  static findListSearchProduct = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await ProductService.findListSearchProduct({
      key_search: req.query?.key_search ? String(req.query.key_search) : '',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Find list search product successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // create new product
  static createNewProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await ProductService.createNewProduct({
      product_name: req.body.product_name,
      order_quantity: req.body.order_quantity,
      product_price: req.body.product_price,
      product_image: req.body.product_image,
      product_description: req.body.product_description,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new product successfully !!!',
      statusCode: data?.code || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update product
  static updateProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await ProductService.updateProduct({
      product_name: req.body.product_name,
      order_quantity: req.body.order_quantity,
      product_price: req.body.product_price,
      product_image: req.body.product_image,
      product_description: req.body.product_description,
      productId: req.params.productId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update product successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete product
  static deleteProduct = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await ProductService.deleteProduct({
      productId: req.params.productId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update product successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default ProductController;
