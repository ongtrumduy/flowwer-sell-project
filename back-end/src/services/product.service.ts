import { Types } from 'mongoose';
import ErrorResponse from '../core/error.response';
import ProductModel from '../models/product.model';
import { EnumMessageStatus } from '../utils/type';

class ProductService {
  static getAllProductList = async ({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }) => {
    // const products = await ProductModel.find()
    //   .limit(limit)
    //   .skip(limit * (page - 1)).select({
    //     product_name: 1,
    //     product_price: 1,
    //     product_image: 1,
    //     order_quantity: 1,
    //     product_description: 1,
    //   })
    //   .lean();

    const products = await ProductModel.aggregate([
      {
        $facet: {
          overview: [
            {
              $count: 'totalCount', // Đếm tổng số sản phẩm
            },
          ],
          data: [
            {
              $skip: limit * (page - 1), // Bỏ qua số sản phẩm đã chỉ định
            },
            {
              $limit: limit, // Giới hạn số sản phẩm trả về
            },
            {
              $project: {
                product_name: 1,
                product_price: 1,
                product_image: 1,
                order_quantity: 1,
                product_description: 1,
                productId: '$_id', // Đổi tên trường _id thành productId
                _id: 0,
              },
            },
          ],
        },
      },
    ]);

    // Sau đó bạn có thể xử lý và trích xuất metaData và data như sau:
    const totalCount = products[0].overview[0]
      ? products[0].overview[0].totalCount
      : 0;
    const items = products[0].data;

    // console.log({ products, totalCount, items });

    return {
      code: 200,
      metaData: {
        products,
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
      throw new ErrorResponse({
        message: 'Invalid Product Id !!!',
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
      throw new ErrorResponse({
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
