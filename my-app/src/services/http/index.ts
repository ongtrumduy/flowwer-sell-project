import AccessApiService from '@services/api/access';
import AuthInformationMetadataService from '@services/auth';
import { API_KEY, REQUEST_TIMEOUT, SERVER_API_ENDPOINT } from '@utils/constant';
import { InterfaceAuthInformationMetaData } from '@utils/type';
import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const AxiosClientInstance = axios.create({
  baseURL: SERVER_API_ENDPOINT,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-api-key': API_KEY,
  },
});

// ========================================================================

// middleware for request handlers
AxiosClientInstance.interceptors.request.use(
  (request: InternalAxiosRequestConfig) => {
    const headers = request.headers;

    const accessToken = AuthInformationMetadataService.getAccessToken();
    const userId = AuthInformationMetadataService.getUserId();

    if (headers) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      headers['x-client-id'] = userId;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================================================
let refreshTokenRequestCall: Promise<unknown> | null = null;

// middleware for response handlers
AxiosClientInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (!refreshTokenRequestCall) {
        refreshTokenRequestCall = AccessApiService.refreshToken();
      }

      if (refreshTokenRequestCall) {
        try {
          const refreshTokenResponse = (await refreshTokenRequestCall) as InterfaceAuthInformationMetaData;

          originalRequest.headers['Authorization'] = `Bearer ${refreshTokenResponse.tokens.accessToken}`;
          originalRequest.headers['x-client-id'] = refreshTokenResponse.user.userId;
          originalRequest._retry = true;

          return AxiosClientInstance(originalRequest);
        } catch (refreshTokenCallError) {
          return Promise.reject(refreshTokenCallError);
        } finally {
          refreshTokenRequestCall = null;
        }
      }
    }

    return Promise.reject(error);
  }
);

class AxiosConfigService {
  // ========================================================================
  // method: GET
  static getData = <typeOfParams, typeOfResponse>({
    url,
    params,
    customHeaders,
    config,
  }: {
    url: string;
    params?: typeOfParams;
    customHeaders?: AxiosHeaders;
    config?: InternalAxiosRequestConfig;
  }): Promise<typeOfResponse> => {
    return AxiosClientInstance.get(url, {
      ...config,
      params,
      headers: customHeaders,
    });
  };

  // ========================================================================
  // method: POST
  static postData = <typeOfBodyData, typeOfParams, typeOfResponse>({
    url,
    data,
    params,
    customHeaders,
    config,
  }: {
    url: string;
    data?: typeOfBodyData;
    params?: typeOfParams;
    customHeaders?: AxiosHeaders;
    config?: InternalAxiosRequestConfig;
  }): Promise<typeOfResponse> => {
    return AxiosClientInstance.post(url, data, { ...config, params, headers: customHeaders });
  };

  // ========================================================================
  // method: PUT
  static putData = <typeOfBodyData, typeOfParams, typeOfResponse>({
    url,
    data,
    params,
    customHeaders,
    config,
  }: {
    url: string;
    params?: typeOfParams;
    data?: typeOfBodyData;
    customHeaders?: AxiosHeaders;
    config?: InternalAxiosRequestConfig;
  }): Promise<typeOfResponse> => {
    return AxiosClientInstance.put(url, data, {
      ...config,
      params,
      headers: customHeaders,
    });
  };

  // ========================================================================
  // method: PATCH
  static patchData = <typeOfBodyData, typeOfParams, typeOfResponse>({
    url,
    data,
    params,
    customHeaders,
    config,
  }: {
    url: string;
    params?: typeOfParams;
    data?: typeOfBodyData;
    customHeaders?: AxiosHeaders;
    config?: InternalAxiosRequestConfig;
  }): Promise<typeOfResponse> => {
    return AxiosClientInstance.patch(url, data, {
      ...config,
      params,
      headers: customHeaders,
    });
  };

  // ========================================================================
  // method: DELETE
  static deleteData = <typeOfParams, typeOfResponse>({
    url,
    params,
    customHeaders,
    config,
  }: {
    url: string;
    params?: typeOfParams;
    customHeaders?: AxiosHeaders;
    config?: InternalAxiosRequestConfig;
  }): Promise<typeOfResponse> => {
    return AxiosClientInstance.delete(url, {
      ...config,
      params,
      headers: customHeaders,
    });
  };

  // ========================================================================
}

export default AxiosConfigService;
