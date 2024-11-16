//===============================================================================================================
export const ACCESS_API = {
  LOG_IN: () => `/v1/api/auth/login`,
  LOG_OUT: () => `/v1/api/auth/logout`,
  SIGN_UP: () => `/v1/api/auth/sign-up`,

  REFRESH_TOKEN: () => `/v1/api/auth/refresh-token-v2`,

  CHANGE_PASSWORD: () => `/v1/api/auth/change/password`,
  RESET_PASSWORD: () => `/v1/api/auth/reset/password`,
  VERIFY_EMAIL: () => `/v1/api/auth/verify/email`,
  POST_MAIL_TO_RESET_PASSWORD: () => `/v1/api/auth/mail/reset/password`,
};

//===============================================================================================================
export const PRODUCT_API = {
  ALL: () => `/v1/api/product/all`,
  CREATE: () => `/v1/api/product/add`,
  UPDATE: () => `/v1/api/product/update`,
  DELETE: () => `/v1/api/product/delete`,
  PRODUCT_DETAIL: ({ productId }: { productId: string }) =>
    `/v1/api/product/${productId}`,
  SEARCH: ({ key_search }: { key_search: string }) =>
    `/v1/api/product/search?key_search=${key_search ? key_search : ``}`,
};

//===============================================================================================================
export const ORDER_API = {
  CREATE: () => `/v1/api/order/create`,
};

//===============================================================================================================
export const STRIPE_PAYMENT_API = {
  CONFIG: () => `/v1/api/stripe_payment/config`,
  CREATE_PAYMENT: () => `/v1/api/stripe_payment/create/payment`,
};
//===============================================================================================================

export const CLOUDINARY_UPLOAD_API = {
  UPLOAD: () => `/v1/api/cloudinary_upload/avatar/upload`,
};

//===============================================================================================================

export const CART_API = {
  ALL: () => `/v1/api/cart/all`,
  ADD_PRODUCT_TO_CART: () => `/v1/api/cart/add`,
  UPDATE_QUANTITY: () => `/v1/api/cart/quantity/update`,
  REMOVE_PRODUCT: ({ cartProductId }: { cartProductId: string }) =>
    `/v1/api/cart/product/remove/${cartProductId}`,
};

//===============================================================================================================

export const CATEGORY_API = {
  ALL: () => `/v1/api/category/all`,
};

//===============================================================================================================
