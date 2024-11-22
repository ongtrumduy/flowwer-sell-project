import AxiosConfigService from '@services/axios';
import { ACCOUNT_API } from '@services/constant';

import { AxiosHeaders } from 'axios';
import cloneDeepWith from 'lodash/cloneDeepWith';
import isObject from 'lodash/isObject';
import omitBy from 'lodash/omitBy';
import { InterfaceAccountDetailItem, InterfaceAccountList } from './type';

class AccountApiService {
  // ===========================================================================
  // get all account list
  static getAllAccountList = ({
    searchName,
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
        url: ACCOUNT_API.ALL(),
        params,
      })
        .then((data: unknown) => {
          // console.log('23 data getAllAccountList ===>', data);
          const accountListData = data as InterfaceAccountList;

          resolve(accountListData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // get account item detail
  static getAccountItemDetail = ({ accountId }: { accountId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.getData({
        url: ACCOUNT_API.ACCOUNT_DETAIL({
          accountId,
        }),
      })
        .then((data) => {
          // console.log('43 data getAccountItemDetail ===>', data);
          const accountDetailData = data as InterfaceAccountDetailItem;

          resolve(accountDetailData.metaData);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // create new account
  static createNewAccount = ({ formData }: { formData: FormData }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ACCOUNT_API.CREATE(),
        data: formData,
        customHeaders: headers,
      })
        .then((data) => {
          console.log('98 data createNewAccount ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // update account
  static updateAccount = ({ formData, accountId }: { formData: FormData; accountId: string }) => {
    const headers = new AxiosHeaders();
    headers.set('Content-Type', 'multipart/form-data');

    return new Promise((resolve, reject) => {
      AxiosConfigService.putData({
        url: ACCOUNT_API.UPDATE({ accountId }),
        data: formData,
        customHeaders: headers,

        // params: {
        //   accountId,
        // },
      })
        .then((data) => {
          console.log('138 data updateAccount ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };

  // ===========================================================================
  // delete account
  static deleteAccount = ({ accountId }: { accountId: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.deleteData({
        url: ACCOUNT_API.DELETE(),
        params: {
          accountId,
        },
      })
        .then((data) => {
          console.log('138 data deleteAccount ===>', data);

          resolve(data);
        })
        .catch((error) => {
          reject(error.response.data);
        });
    });
  };
}

export default AccountApiService;
