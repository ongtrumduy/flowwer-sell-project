import { Types } from 'mongoose';
import ErrorDTODataResponse from '../core/error.dto.response';
import ProductModel from '../models/product.model';
import { EnumMessageStatus } from '../utils/type';

class ProductService {
  // query params: limit, page, priceMin, priceMax, searchName, selectedCategory

  static getAllProductListV2 = async ({
    limit,
    page,
    priceMin,
    priceMax,
    searchName,
    selectedCategory,
  }: {
    limit: number;
    page: number;
    priceMin: number;
    priceMax: number;
    searchName: string;
    selectedCategory: string;
  }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
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
      pipeline.push({
        $match: { categoriesIds: new Types.ObjectId(selectedCategory) },
      });
    }
    pipeline.push({
      $match: {
        product_price: {
          $gte: priceMin,
          $lte: priceMax,
        },
      },
    });

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
    data.push({
      $project: {
        product_name: 1,
        product_price: 1,
        product_image: 1,
        order_quantity: 1,
        product_description: 1,
        productId: '$_id', // Đổi tên trường _id thành productId
        // totalProductSearch: 1,
        _id: 0,
      },
    });
    data.push({
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

    pipeline.push({
      $facet: {
        data: data,
        overview: [
          {
            $count: 'totalSearchCount', // Đếm tổng số sản phẩm
            // $addFields: {
            //   totalProductSearch: '$totalProductSearch',
            // },
          },
        ],
      },
    });

    const products = await ProductModel.aggregate(pipeline);

    console.log('products ===>', { products });

    return {
      code: 200,
      metaData: {
        products: { ...products },
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  static getAllProductList = async ({
    limit,
    page,
    priceMin,
    priceMax,
    searchName,
    selectedCategory,
  }: {
    limit: number;
    page: number;
    priceMin: number;
    priceMax: number;
    searchName: string;
    selectedCategory: string;
  }) => {
    // const products = await ProductModel.find({
    //   $text: { $search: searchName },
    // }).sort({
    //   score: { $meta: 'scoreText' },
    // });

    // const products = await ProductModel.aggregate([
    //   {
    //     $match: {
    //       $text: { $search: searchName },
    //     },
    //   },
    //   {
    //     $project: {
    //       product_name: 1,
    //       product_description: 1,
    //       score: { $meta: 'textScore' }, // Lấy điểm số
    //     },
    //   },
    //   {
    //     $sort: { score: -1 }, // Sắp xếp theo điểm số
    //   },
    // ]);

    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $match: {
          $or: [
            { $text: { $search: searchName } },
            { product_name: { $regex: searchName, $options: 'i' } },
          ],
        },
      });
    }
    if (selectedCategory) {
      pipeline.push({
        $match: { categoriesIds: new Types.ObjectId(selectedCategory) },
      });
    }
    pipeline.push({
      $match: {
        product_price: {
          $gte: priceMin,
          $lte: priceMax,
        },
      },
    });

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
        product_name: 1,
        product_price: 1,
        product_image: 1,
        order_quantity: 1,
        product_description: 1,
        productId: '$_id',
        _id: 0,

        ...(searchName ? { score: { $meta: 'textScore' } } : {}),
      },
    });
    data.push({
      $sort: { createdAt: -1, ...(searchName ? { score: -1 } : {}) } as Record<
        string,
        1 | -1
      >,
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

    const products = await ProductModel.aggregate(pipeline);

    return {
      code: 200,
      metaData: {
        products: { ...products },
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  static getProductItemDetail = async ({
    productId,
  }: {
    productId: string;
  }) => {
    // console.log('productId ===>', productId);
    try {
      const productDetail = await ProductModel.findOne({
        _id: new Types.ObjectId(productId),
      })
        .select({
          product_name: 1,
          product_price: 1,
          product_image: 1,
          order_quantity: 1,
          product_description: 1,
          _id: 0,
        })
        .lean();

      // console.log('show productDetail ===>', { productDetail });

      return {
        code: 200,
        metaData: {
          productDetail: { ...productDetail, productId: productId },
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

  static findListSearchProduct = async ({
    key_search,
  }: {
    key_search: string;
  }) => {
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
    order_quantity,
    product_price,
    product_image,
    product_description,
  }: {
    product_name: string;
    order_quantity: number;
    product_price: number;
    product_image: string;
    product_description: string;
  }) => {
    const newProduct = await ProductModel.create({
      product_name,
      order_quantity,
      product_price,
      product_image,
      product_description,
    });

    const newReturnProduct = {
      ...newProduct,
      productId: String(newProduct._id),
    };

    return {
      code: 200,
      metaData: {
        newReturnProduct,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  static updateProduct = async ({
    product_name,
    order_quantity,
    product_price,
    product_image,
    product_description,
    productId,
  }: {
    product_name: string;
    order_quantity: number;
    product_price: number;
    product_image: string;
    product_description: string;
    productId: string;
  }) => {
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

    product.order_quantity = order_quantity
      ? order_quantity
      : product.order_quantity;
    product.product_name = product_name ? product_name : product.product_name;
    product.product_price = product_price
      ? product_price
      : product.product_price;
    product.product_image = product_image
      ? product_image
      : product.product_image;
    product.product_description = product_description
      ? product_description
      : product.product_description;

    product.save();

    return {
      code: 201,
      metaData: {
        product,
      },
      reasonStatusCode: EnumMessageStatus.CREATED_201,
    };
  };

  static deleteProduct = async ({ productId }: { productId: string }) => {
    const deletedProduct = await ProductModel.findByIdAndDelete({
      _id: new Types.ObjectId(productId),
    });

    return {
      code: 200,
      metaData: {
        deletedProduct,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };
}

export default ProductService;
