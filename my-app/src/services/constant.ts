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
  CREATE: () => '/v1/api/product/add',
  UPDATE: () => '/v1/api/product/update',
  DELETE: () => '/v1/api/product/delete',
  PRODUCT_DETAIL: ({ productId }: { productId: string }) =>
    `/v1/api/product/${productId}`,
  SEARCH: ({ key_search }: { key_search: string }) =>
    `/v1/api/product/search?key_search=${key_search ? key_search : ''}`,
};

//===============================================================================================================
export const ORDER_API = {
  CREATE: () => `/v1/api/order/create`,
};

//===============================================================================================================

export const CART_API = {
  ALL: () => `/v1/api/cart/all`,
  ADD_PRODUCT_TO_CART: () => '/v1/api/cart/add',
  UPDATE_QUANTITY: () => '/v1/api/cart/quantity/update',
  REMOVE_PRODUCT: ({ cartProductId }: { cartProductId: string }) =>
    `/v1/api/cart/product/remove/${cartProductId}`,
};

//===============================================================================================================

export const CATEGORY_API = {
  ALL: () => `/v1/api/category/all`,
};

//===============================================================================================================
