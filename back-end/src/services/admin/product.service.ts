import cloudinaryConfig from '@root/src/configs/config.cloudinary';
import ErrorDTODataResponse from '@root/src/core/error.dto.response';
import SuccessDTODataResponse from '@root/src/core/success.dto.response';
import ProductModel from '@root/src/models/product.model';
import { EnumMessageStatus, EnumReasonStatusCode } from '@root/src/utils/type';
import fs from 'fs';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';

const cloudinary = cloudinaryConfig();

class AdminProductService {
  //=====================================================================
  // get all product list version2
  static getAllProductListV2 = async ({
    limit,
    page,
    priceMin,
    priceMax,
    searchName,
    selectedCategory,
    selectedTypeProduct,
  }: {
    limit: number;
    page: number;
    priceMin: number;
    priceMax: number;
    searchName: string;
    selectedCategory: string;
    selectedTypeProduct: string;
  }) => {
    const allPipeline = [];
    // for pagination
    const dataPipeline = [];
    const overviewPipeline = [];

    if (searchName) {
      allPipeline.push({
        $search: {
          index: 'default',
          text: {
            query: searchName,
            path: ['product_name'],
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      });
    }
    if (selectedCategory) {
      allPipeline.push({
        $match: { categoryId_document_list: new Types.ObjectId(selectedCategory) },
      });
    }
    if (selectedCategory) {
      allPipeline.push({
        $match: { typeProductId_document_list: new Types.ObjectId(selectedTypeProduct) },
      });
    }
    allPipeline.push({
      $match: {
        product_price: {
          $gte: priceMin,
          $lte: priceMax,
        },
      },
    });

    // =================================================================

    dataPipeline.push({
      $skip: (page - 1) * limit,
    });
    dataPipeline.push({
      $limit: limit,
    });
    // =================================================================

    // dùng $count thì không dùng được $project nữa
    // data.push({
    //   $count: 'totalProductSearch',
    // });
    // data.push({
    //   $group: {
    //     _id: null,
    //     totalProductSearch: { $sum: 1 }, // Tổng số sản phẩm đã tìm kiếm   product_name: 1,
    //   },
    // });
    dataPipeline.push({
      $project: {
        product_name: 1,
        product_price: 1,
        product_image: 1,
        product_quantity: 1,
        product_description: 1,
        productId: '$_id', // Đổi tên trường _id thành productId
        // totalProductSearch: 1,
        _id: 0,
      },
    });
    dataPipeline.push({
      $sort: { createdAt: -1 } as Record<string, 1 | -1>, // Sắp xếp theo ngày tạo
    });
    // data.push({
    //   $group: {
    //     _id: '$productId',
    //     product_name: { $first: '$product_name' },
    //     product_price: { $first: '$product_price' },
    //     totalProductSearch: { $sum: 1 },
    //   },
    // });

    // Tạo pipeline cho tổng quan (đếm số lượng)
    overviewPipeline.push({
      $count: 'totalSearchCount',
    });

    allPipeline.push({
      $facet: {
        data: dataPipeline,
        overview: overviewPipeline,
      },
    });

    const products = await ProductModel.aggregate(allPipeline);

    // console.log('products ===>', { products });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        products: { ...products },
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get List Product Successfully !!!',
    });
  };

  //=====================================================================
  // get all product list
  // static getAllProductList = async ({
  //   limit,
  //   page,
  //   priceMin,
  //   priceMax,
  //   searchName,
  //   selectedCategory,
  // }: {
  //   limit: number;
  //   page: number;
  //   priceMin: number;
  //   priceMax: number;
  //   searchName: string;
  //   selectedCategory: string;
  // }) => {
  //   // const products = await ProductModel.find({
  //   //   $text: { $search: searchName },
  //   // }).sort({
  //   //   score: { $meta: 'scoreText' },
  //   // });

  //   // const products = await ProductModel.aggregate([
  //   //   {
  //   //     $match: {
  //   //       $text: { $search: searchName },
  //   //     },
  //   //   },
  //   //   {
  //   //     $project: {
  //   //       product_name: 1,
  //   //       product_description: 1,
  //   //       score: { $meta: 'textScore' }, // Lấy điểm số
  //   //     },
  //   //   },
  //   //   {
  //   //     $sort: { score: -1 }, // Sắp xếp theo điểm số
  //   //   },
  //   // ]);

  //   const pipeline = [];

  //   if (searchName) {
  //     pipeline.push({
  //       $match: {
  //         $or: [{ $text: { $search: searchName } }, { product_name: { $regex: searchName, $options: 'i' } }],
  //       },
  //     });
  //   }
  //   if (selectedCategory && selectedCategory !== DEFAULT_CATEGORY_ID) {
  //     pipeline.push({
  //       $match: { categoryId_document_list: new Types.ObjectId(selectedCategory) },
  //     });
  //   }
  //   pipeline.push({
  //     $match: {
  //       product_price: {
  //         $gte: priceMin,
  //         $lte: priceMax,
  //       },
  //     },
  //   });

  //   // =================================================================
  //   // for pagination
  //   const data = [];
  //   data.push({
  //     $skip: (page - 1) * limit,
  //   });
  //   data.push({
  //     $limit: limit,
  //   });
  //   // =================================================================
  //   data.push({
  //     $project: {
  //       product_name: 1,
  //       product_price: 1,
  //       product_image: 1,
  //       product_quantity: 1,
  //       product_description: 1,
  //       productId: '$_id',
  //       _id: 0,

  //       ...(searchName ? { score: { $meta: 'textScore' } } : {}),
  //     },
  //   });
  //   data.push({
  //     $sort: { createdAt: -1, ...(searchName ? { score: -1 } : {}) } as Record<string, 1 | -1>,
  //   });

  //   pipeline.push({
  //     $facet: {
  //       data: data,
  //       overview: [
  //         {
  //           $count: 'totalSearchCount',
  //         },
  //       ],
  //     },
  //   });

  //   const products = await ProductModel.aggregate(pipeline);

  //   return {
  //     code: 200,
  //     metaData: {
  //       products: { ...products },
  //     },
  //     reasonStatusCode: EnumMessageStatus.SUCCESS_200,
  //   };
  // };

  //=====================================================================
  // get product item detail
  static getProductItemDetail = async ({ productId }: { productId: string }) => {
    // console.log('productId ===>', productId);
    try {
      const productDetail = await ProductModel.findOne({
        _id: new Types.ObjectId(productId),
      })
        .select({
          product_name: 1,
          product_price: 1,
          product_image: 1,
          product_quantity: 1,
          product_description: 1,
          categoryId_document_list: 1,
          typeProductId_document_list: 1,
          _id: 0,
        })
        .populate({
          path: 'categoryId_document_list',
          select: 'category_name category_description', // Lấy những trường cần thiết
        })
        .populate({
          path: 'typeProductId_document_list',
          select: 'type_product_name type_product_description', // Lấy những trường cần thiết
        })
        .lean();

      // console.log('show productDetail ===>', { productDetail });

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          productDetail: { ...productDetail, productId: productId },
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get Product Detail Successfully !!!',
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
  // find list search product
  static findListSearchProduct = async ({ key_search }: { key_search: string }) => {
    // const regexSearch = new RegExp(key_search, 'i');

    const searchProducts = await ProductModel.find(
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
        searchProducts,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  //=====================================================================
  // create new product
  static createNewProduct = async ({
    product_name,
    product_quantity,
    product_price,
    productImagePath,
    productImageFieldName,
    product_description,
    product_type,
    product_category,
  }: {
    product_name: string;
    product_quantity: number;
    product_price: number;
    productImagePath: string;
    product_description: string;
    productImageFieldName: string;
    product_type: string[];
    product_category: string[];
  }) => {
    try {
      let result;

      if (productImagePath && productImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(productImagePath, {
          folder: productImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${productImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(productImagePath);
      }

      const newProduct = await ProductModel.create({
        product_name,
        product_quantity,
        product_price,
        product_image: result?.secure_url || '',
        product_description,
        typeProductId_document_list: product_type.map((type) => new Types.ObjectId(type)),
        categoryId_document_list: product_category.map((category) => new Types.ObjectId(category)),
      });

      const newReturnProduct = {
        ...newProduct,
        productId: String(newProduct._id),
      };

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          newReturnProduct,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Create new product successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: (error as Error).message || 'Create new product fail !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
      });
    }
  };

  //=====================================================================
  // update product
  static updateProduct = async ({
    product_name,
    product_quantity,
    product_price,
    product_image,
    product_description,
    productId,
    productImagePath,
    productImageFieldName,
    product_category,
    product_type,
  }: {
    product_name: string;
    product_quantity: number;
    product_price: number;
    product_image: string;
    product_description: string;
    productId: string;
    productImagePath: string;
    productImageFieldName: string;
    product_category: string[];
    product_type: string[];
  }) => {
    try {
      const product = await ProductModel.findOne({
        _id: new Types.ObjectId(productId),
      });

      if (!product) {
        throw new ErrorDTODataResponse({
          message: 'Product not found !!!',
          statusCode: 400,
          reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
        });
      }

      let result;

      if (productImagePath && productImageFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(productImagePath, {
          folder: productImageFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${productImageFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(productImagePath);
      }

      product.product_quantity = product_quantity ? product_quantity : product.product_quantity;
      product.product_name = product_name ? product_name : product.product_name;
      product.product_price = product_price ? product_price : product.product_price;
      product.product_image = result?.secure_url || (product_image ? product_image : product.product_image) || '';
      product.product_description = product_description ? product_description : product.product_description;

      product_category &&
        product_category.length &&
        product_category.forEach((category) => {
          product.categoryId_document_list.push(new Types.ObjectId(category));
        });

      product_type &&
        product_type.length &&
        product_type.forEach((type) => {
          product.typeProductId_document_list.push(new Types.ObjectId(type));
        });

      product.save();

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          product,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Update Product Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Update Product Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  //=====================================================================
  // delete product
  static deleteProduct = async ({ productId }: { productId: string }) => {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete({
        _id: new Types.ObjectId(productId),
      });

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          deletedProduct,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Delete Product Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Delete Product Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default AdminProductService;
