import { PRODUCT_API } from '@services/constant';
import AxiosConfigService from '@services/axios';
import { InterfaceProductDetailItem, InterfaceProductList } from './type';

import cloneDeepWith from 'lodash/cloneDeepWith';
import isObject from 'lodash/isObject';
import omitBy from 'lodash/omitBy';
import { DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE } from '@utils/constant';
import { AxiosHeaders } from 'axios';

class ProductApiService {
  // ===========================================================================
  // get all product list
  static getAllProductList = ({
    searchName,
    selectedCategory,
    priceRange,
    page,
    limit,
  }: {
    searchName: string;
    selectedCategory: string;
    priceRange: number[];
    page: number;
    limit: number;
  }) => {
    const params = cloneDeepWith(
      {
        searchName,
        selectedCategory,
        priceMin: priceRange[0] || DEFAULT_MIN_PRICE,
        priceMax: priceRange[1] || DEFAULT_MAX_PRICE,
        page,
        limit,
      },
      (value) => {
        if (isObject(value)) {
          return omitBy(
            value,
            (v) => v === null || v === '' || v === undefined
          );
        }
      }
    );

    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: PRODUCT_API.ALL(),
        params,
      })
        .then((data: unknown) => {
          // console.log('23 data getAllProductList ===>', data);
          const productListData = data as InterfaceProductList;

          resolve(productListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
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
        .catch((error) => {
          reject(error.response.data);
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
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create new product
  static createNewProduct = ({ formData }: { formData: FormData }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: PRODUCT_API.CREATE(),
        data: formData,
        customHeaders: headers,
      })
        .then((data) => {
          console.log('98 data createNewProduct ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // update product
  static updateProduct = ({
    product_name,
    product_quantity,
    product_price,
    product_image,
    product_description,
    productId,
  }: {
    product_name: string;
    product_quantity: number;
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
          product_quantity,
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
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default ProductApiService;
