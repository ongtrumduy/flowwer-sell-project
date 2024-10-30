import AuthInformationMetadataService from '@services/auth';
import { ACCESS_API } from '@services/constant';
import AxiosConfigService from '@services/http';
import { AxiosHeaders } from 'axios';
import { InterfaceAuthInformation, InterfaceLogoutResponseData } from './type';
import LocalStorageService from '@services/local-storage';
import { EnumLocalStorage } from '@services/local-storage/type';

class AccessApiService {
  // ===========================================================================
  // Login
  static login = ({ email, password }: { email: string; password: string }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ACCESS_API.LOG_IN(),
        data: {
          email,
          password,
        },
      })
        .then((data) => {
          const userInformationReturnValue = data as InterfaceAuthInformation;

          LocalStorageService.setItem({
            key: EnumLocalStorage.AUTH_INFORMATION,
            value: userInformationReturnValue.metaData,
          });

          resolve(userInformationReturnValue.metaData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // ===========================================================================
  // Logout
  static logout = () => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ACCESS_API.LOG_OUT(),
      })
        .then((data) => {
          // console.log('37 data logout ===>', data);
          const logoutReturnValue = data as InterfaceLogoutResponseData;

          LocalStorageService.removeAll({ skipList: [] });

          resolve(logoutReturnValue.metaData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // ===========================================================================
  // Sign Up
  static signUp = ({
    email,
    name,
    phoneNumber,
    address,
    password,
  }: {
    email: string;
    name: string;
    phoneNumber: string;
    address: string;
    password: string;
  }) => {
    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ACCESS_API.SIGN_UP(),
        data: {
          email,
          name,
          phoneNumber,
          address,
          password,
        },
      })
        .then((data) => {
          // console.log('72 data signUp ===>', data);
          const userInformationReturnValue = data as InterfaceAuthInformation;

          LocalStorageService.setItem({
            key: EnumLocalStorage.AUTH_INFORMATION,
            value: userInformationReturnValue.metaData,
          });

          resolve(userInformationReturnValue.metaData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  // ===========================================================================
  // Refresh Token
  static refreshToken = () => {
    const refreshToken = AuthInformationMetadataService.getRefreshToken();

    const headers = new AxiosHeaders();
    headers.set('x-rtoken-id', refreshToken || '');

    return new Promise((resolve, reject) => {
      AxiosConfigService.postData({
        url: ACCESS_API.REFRESH_TOKEN(),
        customHeaders: headers,
      })
        .then((data) => {
          // console.log('98 data refreshToken ===>', data);
          const refreshTokenReturnValue = data as InterfaceAuthInformation;

          LocalStorageService.setItem({
            key: EnumLocalStorage.AUTH_INFORMATION,
            value: refreshTokenReturnValue.metaData,
          });

          resolve(refreshTokenReturnValue.metaData);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
}

export default AccessApiService;
