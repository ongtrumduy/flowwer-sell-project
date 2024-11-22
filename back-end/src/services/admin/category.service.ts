import cloudinaryConfig from '@root/src/configs/config.cloudinary';
import { Types } from 'mongoose';

import ErrorDTODataResponse from '@root/src/core/error.dto.response';
import SuccessDTODataResponse from '@root/src/core/success.dto.response';
import CategoryModel from '@root/src/models/category.model';
import { EnumMessageStatus, EnumReasonStatusCode } from '@root/src/utils/type';
import fs from 'fs';
import { nanoid } from 'nanoid';

const cloudinary = cloudinaryConfig();

class AdminCategoryService {
  //=====================================================================
  // get all category list version2
  static getAllCategoryListV2 = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $search: {
          index: 'default',
          text: {
            query: searchName,
            path: ['category_name'],
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      });
    }

    // =================================================================
    // for pagination
    const data = [];
    data.push({
      $skip: (page - 1) * limit,
    });
    data.push({
      $limit: limit,
    });
    // =================================================================

    data.push({
      $project: {
        category_name: 1,
        category_description: 1,
        categoryId: '$_id', // Đổi tên trường _id thành categoryId
        _id: 0,
      },
    });
    data.push({
      $sort: { createdAt: -1 } as Record<string, 1 | -1>, // Sắp xếp theo ngày tạo
    });

    pipeline.push({
      $facet: {
        data: data,
        overview: [
          {
            $count: 'totalSearchCount', // Đếm tổng số sản phẩm
          },
        ],
      },
    });

    const categories = await CategoryModel.aggregate(pipeline);

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        categories: { ...categories },
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get List Category Successfully !!!',
    });
  };

  //=====================================================================
  // get all category list
  static getAllCategoryList = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $match: {
          $or: [{ $text: { $search: searchName } }, { name: { $regex: searchName, $options: 'i' } }],
        },
      });
    }

    // =================================================================
    // for pagination
    const data = [];
    data.push({
      $skip: (page - 1) * limit,
    });
    data.push({
      $limit: limit,
    });
    // =================================================================
    data.push({
      $project: {
        category_name: 1,
        category_description: 1,

        categoryId: '$_id', // Đổi tên trường _id thành categoryId
        _id: 0,

        ...(searchName ? { score: { $meta: 'textScore' } } : {}),
      },
    });
    data.push({
      $sort: { createdAt: -1, ...(searchName ? { score: -1 } : {}) } as Record<string, 1 | -1>,
    });

    pipeline.push({
      $facet: {
        data: data,
        overview: [
          {
            $count: 'totalSearchCount',
          },
        ],
      },
    });

    const categories = await CategoryModel.aggregate(pipeline);

    return {
      code: 200,
      metaData: {
        categories: { ...categories },
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  //=====================================================================
  // get category item detail
  static getCategoryItemDetail = async ({ categoryId }: { categoryId: string }) => {
    try {
      const categoryDetail = await CategoryModel.findOne({
        _id: new Types.ObjectId(categoryId),
      })
        .select({
          category_name: 1,
          category_description: 1,
          _id: 0,
        })
        .lean();

      if (!categoryDetail) {
        throw new ErrorDTODataResponse({
          reasonStatusCode: EnumMessageStatus.NOT_FOUND_404,
          statusCode: 404,
          message: 'Category Not Found !!!',
        });
      }

      const returnCategoryDetail = {
        category_name: categoryDetail.category_name,
        category_description: categoryDetail.category_description,
      };

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          categoryDetail: { ...returnCategoryDetail, categoryId: categoryId },
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get Category Detail Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        message: (error as Error).message,
        statusCode: 400,
        reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
      });
    }
  };

  //=====================================================================
  // create new category
  static createNewCategory = async ({
    category_name,
    category_description,
    categoryImagePath,
    categoryImageFieldName,
  }: {
    category_name: string;
    category_description: string;
    categoryImagePath: string;
    categoryImageFieldName: string;
  }) => {
    try {
      let result;

      if (categoryImagePath && categoryImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(categoryImagePath, {
          folder: categoryImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${categoryImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(categoryImagePath);
      }

      const newCategory = await CategoryModel.create({
        category_name: category_name,
        category_description: category_description,
      });

      const newReturnCategory = {
        ...newCategory,
        categoryId: String(newCategory._id),
      };

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          newReturnCategory,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Create new category successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: (error as Error).message || 'Create new category fail !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
      });
    }
  };

  //=====================================================================
  // update category
  static updateCategory = async ({
    category_name,
    category_description,
    categoryImagePath,
    categoryImageFieldName,
    categoryId,
  }: {
    category_name: string;
    category_description: string;
    categoryId: string;
    categoryImagePath: string;
    categoryImageFieldName: string;
  }) => {
    try {
      const category = await CategoryModel.findOne({
        _id: new Types.ObjectId(categoryId),
      });

      if (!category) {
        throw new ErrorDTODataResponse({
          message: 'Category not found !!!',
          statusCode: 400,
          reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
        });
      }

      let result;

      if (categoryImagePath && categoryImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(categoryImagePath, {
          folder: categoryImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${categoryImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(categoryImagePath);
      }

      category.category_name = category_name ? category_name : category.category_name;
      category.category_description = category_description ? category_description : category.category_description;

      category.save();

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          category,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Update Category Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Update Category Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  //=====================================================================
  // delete category
  static deleteCategory = async ({ categoryId }: { categoryId: string }) => {
    try {
      const deletedCategory = await CategoryModel.findByIdAndDelete({
        _id: new Types.ObjectId(categoryId),
      });

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          deletedCategory,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Delete Category Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Delete Category Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default AdminCategoryService;
