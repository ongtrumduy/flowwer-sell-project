import { NextFunction, Request, Response } from 'express';
import ProductService from '@services/product.service';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import { DEFAULT_LIMIT, DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, DEFAULT_PAGE } from '../utils/constant';

class ProductController {
  //=========================================================
  // get all product list
  // query params: limit, page, priceMin, priceMax, searchName, selectedCategory
  static getAllProductList = async (req: Request, res: Response, next: NextFunction) => {
    const data = await ProductService.getAllProductList({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      priceMin: req.query?.priceMin ? Number(req.query.priceMin) : DEFAULT_MIN_PRICE,
      priceMax: req.query?.priceMax ? Number(req.query.priceMax) : DEFAULT_MAX_PRICE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
      selectedCategory: req.query?.selectedCategory ? String(req.query.selectedCategory) : '',
      selectedTypeProduct: req.query?.selectedTypeProduct ? String(req.query.selectedTypeProduct) : '',
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
  static getProductItemDetail = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await ProductService.getProductItemDetail({
      productId: String(req.params.productId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get product item detail successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // find list search product
  static findListSearchProduct = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
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
  static createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
    const data = await ProductService.createNewProduct({
      product_name: req.body.product_name,
      product_quantity: req.body.product_quantity,
      product_price: req.body.product_price,
      // product_image: req.body.product_image,
      product_category: req.body.product_category,
      product_type: req.body.product_type,
      productImagePath: req.file ? req.file.path : '',
      productImageFieldName: 'product_image',
      product_description: req.body.product_description,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new product successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update product
  static updateProduct = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await ProductService.updateProduct({
      product_name: req.body.product_name,
      product_quantity: req.body.product_quantity,
      product_price: req.body.product_price,
      product_image: req.body.product_image,
      productImagePath: req.file ? req.file.path : '',
      productImageFieldName: 'product_image',
      product_description: req.body.product_description,
      product_category: req.body.product_category,
      product_type: req.body.product_type,
      productId: req.params.productId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update Product Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete product
  static deleteProduct = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await ProductService.deleteProduct({
      productId: String(req.query.productId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Delete Product Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default ProductController;
