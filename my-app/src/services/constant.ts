//===============================================================================================================
export const ACCESS_API = {
  LOG_IN: () => '/v1/api/auth/login',
  LOG_OUT: () => '/v1/api/auth/logout',
  SIGN_UP: () => '/v1/api/auth/sign-up',

  REFRESH_TOKEN: () => '/v1/api/auth/refresh-token-v2',
};

//===============================================================================================================
export const PRODUCT_API = {
  ALL: () => `/v1/api/product/all`,
  CREATE: () => '/v1/api/product/create',
  UPDATE: () => '/v1/api/product/update',
  DELETE: () => '/v1/api/product/delete',
  PRODUCT_DETAIL: ({ productId }: { productId: string }) => `/v1/api/product/${productId}`,
  SEARCH: ({ key_search }: { key_search: string }) =>
    `/v1/api/product/search?key_search=${key_search ? key_search : ''}`,
};

//===============================================================================================================
export const CATEGORY_API = {
  ALL: () => `/v1/api/category/all`,
};

//===============================================================================================================
