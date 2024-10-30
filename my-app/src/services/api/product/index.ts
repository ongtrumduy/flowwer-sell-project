import { PRODUCT_API } from '@services/constant';
import AxiosConfigService from '@services/http';
import { InterfaceProductDetailItem, InterfaceProductList } from './type';

class ProductApiService {
  // ===========================================================================
  // get all product list
  static getAllProductList = ({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: PRODUCT_API.ALL({
          limit,
          page,
        }),
      })
        .then((data: unknown) => {
          // console.log('23 data getAllProductList ===>', data);
          const productListData = data as InterfaceProductList;

          resolve(productListData.metaData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // ===========================================================================
  // get product item detail
  static getProductItemDetail = ({ productId }: { productId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: PRODUCT_API.PRODUCT_DETAIL({
          productId,
        }),
      })
        .then((data) => {
          // console.log('43 data getProductItemDetail ===>', data);
          const productDetailData = data as InterfaceProductDetailItem;

          resolve(productDetailData.metaData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // ===========================================================================
  // find list search product
  static findListSearchProduct = ({ key_search }: { key_search: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: PRODUCT_API.SEARCH({ key_search }),
      })
        .then((data) => {
          console.log('61 data findListSearchProduct ===>', data);

          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // ===========================================================================
  // create new product
  static createNewProduct = ({
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
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: PRODUCT_API.CREATE(),
        data: {
          product_name,
          order_quantity,
          product_price,
          product_image,
          product_description,
        },
      })
        .then((data) => {
          console.log('98 data createNewProduct ===>', data);

          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // ===========================================================================
  // update product
  static updateProduct = ({
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
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: PRODUCT_API.UPDATE(),
        data: {
          product_name,
          order_quantity,
          product_price,
          product_image,
          product_description,
          productId,
        },
      })
        .then((data) => {
          console.log('138 data updateProduct ===>', data);

          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}

export default ProductApiService;
