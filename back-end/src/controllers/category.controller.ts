import { NextFunction, Request, Response } from 'express';
import CategoryService from '@services/category.service';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, WithKeyStoreV2Request } from '@root/src/utils/type';

class CategoryController {
  //=========================================================
  // get all category list
  static getAllCategoryList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CategoryService.getAllCategoryList();

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get list category successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // get category item detail
  static getCategoryItemDetail = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CategoryService.getCategoryItemDetail({
      categoryId: String(req.params.categoryId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get category item detail successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // find list search category
  static findListSearchCategory = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CategoryService.findListSearchCategory({
      key_search: req.query?.key_search ? String(req.query.key_search) : '',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Find list search category successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // create new category
  static createNewCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CategoryService.createNewCategory({
      category_name: req.body.category_name,
      category_description: req.body.category_description,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new category successfully !!!',
      statusCode: data?.code || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update category
  static updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CategoryService.updateCategory({
      category_name: req.body.category_name,
      category_description: req.body.category_description,
      categoryId: req.params.categoryId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update category successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete category
  static deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await CategoryService.deleteCategory({
      categoryId: req.params.categoryId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update category successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default CategoryController;
