import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import AdminCategoryService from '@root/src/services/admin/category.service';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@root/src/utils/constant';

class AdminCategoryController {
  //=========================================================
  // get all category list
  // query params: limit, page, priceMin, priceMax, searchName, selectedCategory
  static getAllCategoryList = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AdminCategoryService.getAllCategoryList({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
    });

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
  static getCategoryItemDetail = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AdminCategoryService.getCategoryItemDetail({
      categoryId: String(req.params.categoryId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get category item detail successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // create new category
  static createNewCategory = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AdminCategoryService.createNewCategory({
      category_name: req.body.category_name,
      category_description: req.body.category_description,
      categoryImagePath: req.file ? req.file.path : '',
      categoryImageFieldName: 'category_image',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new category successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update category
  static updateCategory = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AdminCategoryService.updateCategory({
      category_name: req.body.category_name,
      category_description: req.body.category_description,
      categoryImagePath: req.file ? req.file.path : '',
      categoryImageFieldName: 'category_image',
      categoryId: req.params.categoryId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update Category Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete category
  static deleteCategory = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AdminCategoryService.deleteCategory({
      categoryId: String(req.query.categoryId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Delete Category Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default AdminCategoryController;
