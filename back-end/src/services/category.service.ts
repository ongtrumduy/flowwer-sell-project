import { Types } from 'mongoose';
import ErrorDTODataResponse from '../core/error.dto.response';
import CategoryModel from '../models/category.model';
import { EnumMessageStatus } from '../utils/type';

class CategoryService {
  // =======================================================
  // get all category list
  static getAllCategoryList = async () => {
    const categories = await CategoryModel.aggregate([
      {
        $facet: {
          overview: [
            {
              $count: 'totalCount', // Đếm tổng số
            },
          ],
          data: [
            {
              $project: {
                category_name: 1,
                category_description: 1,
                categoryId: '$_id', // Đổi tên trường _id thành categoryId
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    return {
      code: 200,
      metaData: {
        categories,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  // =======================================================
  // get all category item detail
  static getCategoryItemDetail = async ({
    categoryId,
  }: {
    categoryId: string;
  }) => {
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

      return {
        code: 200,
        metaData: {
          categoryDetail: { ...categoryDetail, categoryId: categoryId },
        },
        reasonStatusCode: EnumMessageStatus.SUCCESS_200,
      };
    } catch (error) {
      throw new ErrorDTODataResponse({
        message: (error as Error).message,
        statusCode: 400,
        reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
      });
    }
  };

  static findListSearchCategory = async ({
    key_search,
  }: {
    key_search: string;
  }) => {
    // const regexSearch = new RegExp(key_search, 'i');

    const searchCategories = await CategoryModel.find(
      {
        $text: { $search: key_search },
      },
      {
        score: {
          $meta: 'textScore',
        },
      }
    )
      .sort({ score: { $meta: 'textScore' } })
      .lean();

    return {
      code: 200,
      metaData: {
        searchCategories,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  //=====================================================================
  // create new category
  static createNewCategory = async ({
    category_name,
    category_description,
  }: {
    category_name: string;
    category_description: string;
  }) => {
    const newCategory = await CategoryModel.create({
      category_name,
      category_description,
    });

    const newReturnCategory = {
      ...newCategory,
      categoryId: String(newCategory._id),
    };

    return {
      code: 200,
      metaData: {
        newReturnCategory,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  static updateCategory = async ({
    category_name,
    category_description,
    categoryId,
  }: {
    category_name: string;
    category_description: string;
    categoryId: string;
  }) => {
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

    category.category_name = category_name
      ? category_name
      : category.category_name;
    category.category_description = category_description
      ? category_description
      : category.category_description;

    category.save();

    return {
      code: 201,
      metaData: {
        category,
      },
      reasonStatusCode: EnumMessageStatus.CREATED_201,
    };
  };

  static deleteCategory = async ({ categoryId }: { categoryId: string }) => {
    const deletedCategory = await CategoryModel.findByIdAndDelete({
      _id: new Types.ObjectId(categoryId),
    });

    return {
      code: 200,
      metaData: {
        deletedCategory,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };
}

export default CategoryService;
