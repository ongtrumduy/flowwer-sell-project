import cloudinaryConfig from '@root/src/configs/config.cloudinary';
import { Types } from 'mongoose';

import ErrorDTODataResponse from '@root/src/core/error.dto.response';
import SuccessDTODataResponse from '@root/src/core/success.dto.response';
import TypeProductModel from '@root/src/models/typeProduct.model';
import { EnumMessageStatus, EnumReasonStatusCode } from '@root/src/utils/type';
import fs from 'fs';
import { nanoid } from 'nanoid';

const cloudinary = cloudinaryConfig();

class AdminTypeProductService {
  //=====================================================================
  // get all typeProduct list version2
  static getAllTypeProductListV2 = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $search: {
          index: 'default',
          text: {
            query: searchName,
            path: ['type_product_name'],
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
        type_product_name: 1,
        type_product_description: 1,
        typeProductId: '$_id', // Đổi tên trường _id thành typeProductId
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

    const categories = await TypeProductModel.aggregate(pipeline);

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        categories: { ...categories },
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get List TypeProduct Successfully !!!',
    });
  };

  //=====================================================================
  // get all typeProduct list
  static getAllTypeProductList = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
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
        type_product_name: 1,
        type_product_description: 1,

        typeProductId: '$_id', // Đổi tên trường _id thành typeProductId
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

    const categories = await TypeProductModel.aggregate(pipeline);

    return {
      code: 200,
      metaData: {
        categories: { ...categories },
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  //=====================================================================
  // get typeProduct item detail
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

      if (!typeProductDetail) {
        throw new ErrorDTODataResponse({
          reasonStatusCode: EnumMessageStatus.NOT_FOUND_404,
          statusCode: 404,
          message: 'TypeProduct Not Found !!!',
        });
      }

      const returnTypeProductDetail = {
        type_product_name: typeProductDetail.type_product_name,
        type_product_description: typeProductDetail.type_product_description,
      };

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          typeProductDetail: { ...returnTypeProductDetail, typeProductId: typeProductId },
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get TypeProduct Detail Successfully !!!',
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
  // create new typeProduct
  static createNewTypeProduct = async ({
    type_product_name,
    type_product_description,
    typeProductImagePath,
    typeProductImageFieldName,
  }: {
    type_product_name: string;
    type_product_description: string;
    typeProductImagePath: string;
    typeProductImageFieldName: string;
  }) => {
    try {
      let result;

      if (typeProductImagePath && typeProductImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(typeProductImagePath, {
          folder: typeProductImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${typeProductImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(typeProductImagePath);
      }

      const newTypeProduct = await TypeProductModel.create({
        type_product_name: type_product_name,
        type_product_description: type_product_description,
      });

      const newReturnTypeProduct = {
        ...newTypeProduct,
        typeProductId: String(newTypeProduct._id),
      };

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          newReturnTypeProduct,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Create new typeProduct successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: (error as Error).message || 'Create new typeProduct fail !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
      });
    }
  };

  //=====================================================================
  // update typeProduct
  static updateTypeProduct = async ({
    type_product_name,
    type_product_description,
    typeProductImagePath,
    typeProductImageFieldName,
    typeProductId,
  }: {
    type_product_name: string;
    type_product_description: string;
    typeProductId: string;
    typeProductImagePath: string;
    typeProductImageFieldName: string;
  }) => {
    try {
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

      let result;

      if (typeProductImagePath && typeProductImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(typeProductImagePath, {
          folder: typeProductImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${typeProductImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(typeProductImagePath);
      }

      typeProduct.type_product_name = type_product_name ? type_product_name : typeProduct.type_product_name;
      typeProduct.type_product_description = type_product_description ? type_product_description : typeProduct.type_product_description;

      typeProduct.save();

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          typeProduct,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Update TypeProduct Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Update TypeProduct Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  //=====================================================================
  // delete typeProduct
  static deleteTypeProduct = async ({ typeProductId }: { typeProductId: string }) => {
    try {
      const deletedTypeProduct = await TypeProductModel.findByIdAndDelete({
        _id: new Types.ObjectId(typeProductId),
      });

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          deletedTypeProduct,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Delete TypeProduct Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Delete TypeProduct Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default AdminTypeProductService;
