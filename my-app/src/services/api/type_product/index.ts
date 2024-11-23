import { TYPE_PRODUCT_API } from '@services/constant';
import AxiosConfigService from '@services/axios';
import {
  InterfaceTypeProductDetailItem,
  InterfaceTypeProductList,
} from './type';
import { AxiosHeaders } from 'axios';
import cloneDeepWith from 'lodash/cloneDeepWith';
import { isObject, omitBy } from 'lodash';

class TypeProductApiService {
  // ===========================================================================
  // get all typeProduct list
  static getAllTypeProductList = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: TYPE_PRODUCT_API.ALL(),
      })
        .then((data: unknown) => {
          // console.log('23 data getAllTypeProductList ===>', data);
          const typeProductListData = data as InterfaceTypeProductList;

          resolve(typeProductListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // =========================================FOR_ADMIN========================================================
  // ===========================================================================================================
  // get all typeProduct list
  static getAllTypeProductList_ForAdmin = ({
    searchName,
    page,
    limit,
  }: {
    searchName: string;
    page: number;
    limit: number;
  }) => {
    const params = cloneDeepWith(
      {
        searchName,
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
        url: TYPE_PRODUCT_API.ALL_FOR_ADMIN(),
        params,
      })
        .then((data: unknown) => {
          // console.log('23 data getAllTypeProductList ===>', data);
          const typeProductListData = data as InterfaceTypeProductList;

          resolve(typeProductListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get typeProduct item detail
  static getTypeProductItemDetail_ForAdmin = ({
    typeProductId,
  }: {
    typeProductId: string;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: TYPE_PRODUCT_API.TYPE_PRODUCT_DETAIL_FOR_ADMIN({
          typeProductId,
        }),
      })
        .then((data) => {
          // console.log('43 data getTypeProductItemDetail ===>', data);
          const typeProductDetailData = data as InterfaceTypeProductDetailItem;

          resolve(typeProductDetailData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create new typeProduct
  static createNewTypeProduct_ForAdmin = ({
    formData,
  }: {
    formData: FormData;
  }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: TYPE_PRODUCT_API.CREATE_FOR_ADMIN(),
        data: formData,
        customHeaders: headers,
      })
        .then((data) => {
          console.log('98 data createNewTypeProduct ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // update typeProduct
  static updateTypeProduct_ForAdmin = ({
    formData,
    typeProductId,
  }: {
    formData: FormData;
    typeProductId: string;
  }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.putData({
        url: TYPE_PRODUCT_API.UPDATE_FOR_ADMIN({ typeProductId }),
        data: formData,
        customHeaders: headers,

        // params: {
        //   typeProductId,
        // },
      })
        .then((data) => {
          console.log('138 data updateTypeProduct ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // delete typeProduct
  static deleteTypeProduct_ForAdmin = ({
    typeProductId,
  }: {
    typeProductId: string;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.deleteData({
        url: TYPE_PRODUCT_API.DELETE_FOR_ADMIN(),
        params: {
          typeProductId,
        },
      })
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default TypeProductApiService;
