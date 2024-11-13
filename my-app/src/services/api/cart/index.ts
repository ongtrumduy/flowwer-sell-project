import AxiosConfigService from '@services/axios';
import { CART_API, PRODUCT_API } from '@services/constant';

import cloneDeepWith from 'lodash/cloneDeepWith';
import isObject from 'lodash/isObject';
import omitBy from 'lodash/omitBy';
import { InterfaceCartProductList, InterfaceProductDetailItem } from './type';

class CartApiService {
  // ===========================================================================
  // get all cart product list
  static getAllCartProductList = ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {
    const params = cloneDeepWith(
      {
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
        url: CART_API.ALL(),
        params,
      })
        .then((data: unknown) => {
          // console.log('23 data getAllProductList ===>', data);
          const cartListData = data as InterfaceCartProductList;

          resolve(cartListData.metaData);
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
  static addProductToCart = ({
    productId,
    product_quantity,
  }: {
    productId: string;
    product_quantity: number;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: CART_API.ADD_PRODUCT_TO_CART(),
        data: {
          productId,
          product_quantity,
        },
      })
        .then((data) => {
          console.log('119 data addProductToCart ===>', data);

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

  // ===========================================================================
  // update quantity product in cart
  static updateQuantityProductInCartV2 = ({
    product_quantity,
    cartProductId,
  }: {
    product_quantity: number;
    cartProductId: string;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.putData({
        url: CART_API.UPDATE_QUANTITY(),
        data: {
          product_quantity,
          cartProductId,
        },
      })
        .then((data) => {
          console.log('176 updateQuantityProductInCartV2 ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // update product
  static deleteProductInCartItems = ({
    cartProductId,
  }: {
    cartProductId: string;
  }) => {
    // const params = cloneDeepWith(
    //   {
    //     productId,
    //   },
    //   (value) => {
    //     if (isObject(value)) {
    //       return omitBy(
    //         value,
    //         (v) => v === null || v === '' || v === undefined
    //       );
    //     }
    //   }
    // );

    return new Promise((resolve, reject) => {
      AxiosConfigService.deleteData({
        url: CART_API.REMOVE_PRODUCT({
          cartProductId,
        }),
        // params,
      })
        .then((data) => {
          console.log('209 deleteProductInCartItems ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default CartApiService;
