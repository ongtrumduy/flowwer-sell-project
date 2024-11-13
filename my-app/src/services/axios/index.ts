import AuthInformationMetadataService from '@services/auth';
import { ACCESS_API } from '@services/constant';
import { API_KEY, REQUEST_TIMEOUT, SERVER_API_ENDPOINT } from '@utils/constant';
import {
  EnumReasonStatusCode,
  InterfaceAuthInformationMetaData,
  InterfaceErrorResponse,
} from '@utils/type';
import axios, {
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'react-toastify';

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
      headers['Authorization'] = accessToken ? `Bearer ${accessToken}` : '';
      headers['x-client-id'] = userId;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================================================
let isRefreshing = false;
const refreshSubscribers: (({ token }: { token: string }) => void)[] = [];

const subscribeTokenRefresh = (
  callback: ({ token }: { token: string }) => void
) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = ({ token }: { token: string }) => {
  refreshSubscribers.forEach((callback) => {
    callback({ token });
  });

  refreshSubscribers.length = 0;
};

// middleware for response handlers
AxiosClientInstance.interceptors.response.use(
  (response) => {
    toast.success(response?.data?.message, {
      position: 'top-right',
      autoClose: 4000,
    });

    console.log('63 response ===>', { response });

    return response.data;
  },
  async (error: AxiosError<InterfaceErrorResponse, unknown>) => {
    const originalRequest = error.config;

    console.log('63 error ===>', { error });

    if (
      error.response &&
      (error.response.data.reasonStatusCode ===
        EnumReasonStatusCode.INVALID_ACCESS_TOKEN ||
        error.response.data.reasonStatusCode ===
          EnumReasonStatusCode.EXPIRED_ACCESS_TOKEN) &&
      error.response.status === 401 &&
      originalRequest
      // !originalRequest?._retry
    ) {
      // originalRequest._retry = true;

      if (isRefreshing) {
        // Đợi refresh token hoàn tất và sau đó gửi lại request
        return new Promise((resolve) => {
          subscribeTokenRefresh(({ token }: { token: string }) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;

            resolve(AxiosClientInstance(originalRequest));
          });
        });
      }

      isRefreshing = false;

      try {
        const refreshToken = AuthInformationMetadataService.getRefreshToken();

        const headers = new AxiosHeaders();
        headers.set('x-rtoken-id', refreshToken || '');

        const refreshTokenResponse = (await AxiosConfigService.postData({
          url: ACCESS_API.REFRESH_TOKEN(),
          customHeaders: headers,
        })) as InterfaceAuthInformationMetaData;

        const newAccessToken = refreshTokenResponse.tokens.accessToken;

        // Cập nhật token và gửi lại request ban đầu
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        originalRequest.headers['x-client-id'] =
          refreshTokenResponse.user.userId;

        // Thông báo tất cả request đang chờ về token mới
        onTokenRefreshed({ token: newAccessToken });

        return AxiosClientInstance(originalRequest);
      } catch (refreshTokenCallError) {
        console.log('111 refreshTokenCallError ===>', {
          refreshTokenCallError,
        });

        // toast.error('Refresh token failed', {
        //   position: 'top-right',
        //   autoClose: 4000,
        // });

        return Promise.reject(refreshTokenCallError);
      } finally {
        isRefreshing = false;
      }
    }

    toast.error(error.response?.data.message, {
      position: 'top-right',
      autoClose: 4000,
    });

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
    return AxiosClientInstance.post(url, data, {
      ...config,
      params,
      headers: customHeaders,
    });
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
