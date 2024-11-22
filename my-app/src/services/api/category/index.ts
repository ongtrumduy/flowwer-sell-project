import { CATEGORY_API } from '@services/constant';
import AxiosConfigService from '@services/axios';
import { InterfaceCategoryDetailItem, InterfaceCategoryList } from './type';
import { AxiosHeaders } from 'axios';
import cloneDeepWith from 'lodash/cloneDeepWith';
import { isObject, omitBy } from 'lodash';

class CategoryApiService {
  // ===========================================================================
  // get all category list
  static getAllCategoryList = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: CATEGORY_API.ALL(),
      })
        .then((data: unknown) => {
          // console.log('23 data getAllCategoryList ===>', data);
          const categoryListData = data as InterfaceCategoryList;

          resolve(categoryListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // =========================================FOR_ADMIN========================================================
  // ===========================================================================================================
  // get all category list
  static getAllCategoryList_ForAdmin = ({ searchName, page, limit }: { searchName: string; page: number; limit: number }) => {
    const params = cloneDeepWith(
      {
        searchName,
        page,
        limit,
      },
      (value) => {
        if (isObject(value)) {
          return omitBy(value, (v) => v === null || v === '' || v === undefined);
        }
      }
    );

    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: CATEGORY_API.ALL_FOR_ADMIN(),
        params,
      })
        .then((data: unknown) => {
          // console.log('23 data getAllCategoryList ===>', data);
          const categoryListData = data as InterfaceCategoryList;

          resolve(categoryListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get category item detail
  static getCategoryItemDetail_ForAdmin = ({ categoryId }: { categoryId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: CATEGORY_API.CATEGORY_DETAIL_FOR_ADMIN({
          categoryId,
        }),
      })
        .then((data) => {
          // console.log('43 data getCategoryItemDetail ===>', data);
          const categoryDetailData = data as InterfaceCategoryDetailItem;

          resolve(categoryDetailData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create new category
  static createNewCategory_ForAdmin = ({ formData }: { formData: FormData }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: CATEGORY_API.CREATE_FOR_ADMIN(),
        data: formData,
        customHeaders: headers,
      })
        .then((data) => {
          console.log('98 data createNewCategory ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // update category
  static updateCategory_ForAdmin = ({ formData, categoryId }: { formData: FormData; categoryId: string }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.putData({
        url: CATEGORY_API.UPDATE_FOR_ADMIN({ categoryId }),
        data: formData,
        customHeaders: headers,

        // params: {
        //   categoryId,
        // },
      })
        .then((data) => {
          console.log('138 data updateCategory ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // delete category
  static deleteCategory_ForAdmin = ({ categoryId }: { categoryId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.deleteData({
        url: CATEGORY_API.DELETE_FOR_ADMIN(),
        params: {
          categoryId,
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

export default CategoryApiService;
