import ErrorDTODataResponse from '@root/src/core/error.dto.response';
import TypeProductModel from '@root/src/models/typeProduct.model';
import { EnumMessageStatus } from '@root/src/utils/type';
import { Types } from 'mongoose';

class TypeProductService {
  // =======================================================
  // get all typeProduct list
  static getAllTypeProductList = async () => {
    const typeProducts = await TypeProductModel.aggregate([
      {
        $facet: {
          overview: [
            {
              $count: 'totalSearchCount', // Đếm tổng số
            },
          ],
          data: [
            {
              $project: {
                type_product_name: 1,
                type_product_description: 1,
                typeProductId: '$_id', // Đổi tên trường _id thành typeProductId
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
        typeProducts,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  // =======================================================
  // get all typeProduct item detail
  static getTypeProductItemDetail = async ({ typeProductId }: { typeProductId: string }) => {
    try {
      const typeProductDetail = await TypeProductModel.findOne({
        _id: new Types.ObjectId(typeProductId),
      })
        .select({
          type_product_name: 1,
          type_product_description: 1,
          _id: 0,
        })
        .lean();

      return {
        code: 200,
        metaData: {
          typeProductDetail: { ...typeProductDetail, typeProductId: typeProductId },
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

  static findListSearchTypeProduct = async ({ key_search }: { key_search: string }) => {
    // const regexSearch = new RegExp(key_search, 'i');

    const searchCategories = await TypeProductModel.find(
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
  // create new typeProduct
  static createNewTypeProduct = async ({ type_product_name, type_product_description }: { type_product_name: string; type_product_description: string }) => {
    const newTypeProduct = await TypeProductModel.create({
      type_product_name,
      type_product_description,
    });

    const newReturnTypeProduct = {
      ...newTypeProduct,
      typeProductId: String(newTypeProduct._id),
    };

    return {
      code: 200,
      metaData: {
        newReturnTypeProduct,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  static updateTypeProduct = async ({
    type_product_name,
    type_product_description,
    typeProductId,
  }: {
    type_product_name: string;
    type_product_description: string;
    typeProductId: string;
  }) => {
    const typeProduct = await TypeProductModel.findOne({
      _id: new Types.ObjectId(typeProductId),
    });

    if (!typeProduct) {
      throw new ErrorDTODataResponse({
        message: 'TypeProduct not found !!!',
        statusCode: 400,
        reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
      });
    }

    typeProduct.type_product_name = type_product_name ? type_product_name : typeProduct.type_product_name;
    typeProduct.type_product_description = type_product_description ? type_product_description : typeProduct.type_product_description;

    typeProduct.save();

    return {
      code: 201,
      metaData: {
        typeProduct,
      },
      reasonStatusCode: EnumMessageStatus.CREATED_201,
    };
  };

  static deleteTypeProduct = async ({ typeProductId }: { typeProductId: string }) => {
    const deletedTypeProduct = await TypeProductModel.findByIdAndDelete({
      _id: new Types.ObjectId(typeProductId),
    });

    return {
      code: 200,
      metaData: {
        deletedTypeProduct,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };
}

export default TypeProductService;
