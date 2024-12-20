const BASE_NAME = '/';

export const AppRoutes = {
  // ================================================================================
  BASE: () => `${BASE_NAME}`,
  HOME: () => `home`,
  LOGIN: () => `login`,
  SIGN_UP: () => `sign-up`,
  FORGOT_PASSWORD: () => `forgot-password`,
  PROFILE: () => `profile`,
  CART: () => `cart`,
  ORDER: () => 'order',
  PAYMENT: ({ orderId = '' }: { orderId?: string }) =>
    `payment/${orderId ? orderId : ':orderId'}`,
  COMPLETION: () => 'completion',

  IMAGE_UPLOAD: () => 'image-upload',

  NOTIFY: () => 'notify',

  PRODUCT_DETAIL: ({ productId = '' }: { productId?: string }) =>
    `product-detail/${productId ? productId : ':productId'}`,
  ORDER_DETAIL: ({ orderId = '' }: { orderId?: string }) =>
    `order-detail/${orderId ? orderId : ':orderId'}`,

  USER_PROFILE: ({ userId = '' }: { userId?: string }) =>
    `user-profile/${userId ? userId : ':userId'}`,
  // ================================================================================

  // ================================================================================
  // ADMIN
  ADMIN_BASE: () => `${BASE_NAME}admin/`,
  ADMIN_OVERVIEW: () => `overview`,
  ADMIN_CATEGORY: () => `category`,
  ADMIN_TYPE_PRODUCT: () => `type-product`,
  ADMIN_PRODUCT: () => `product`,
  ADMIN_ORDER: () => `order`,
  ADMIN_VOUCHER: () => `voucher`,
  ADMIN_ACCOUNT: () => `account`,
  // ADMIN_SETTING: () => `setting`,

  // ================================================================================

  // ================================================================================
  // EMPLOYEE
  EMPLOYEE_BASE: () => `${BASE_NAME}employee/`,
  EMPLOYEE_OVERVIEW: () => `overview`,
  EMPLOYEE_ORDER: () => `order`,
  EMPLOYEE_PRODUCT_TYPE: () => `product-type`,
  EMPLOYEE_PRODUCT: () => `product`,
  EMPLOYEE_VOUCHER: () => `voucher`,
  EMPLOYEE_CATEGORY: () => `category`,

  // ================================================================================

  // ================================================================================
  // SHIPPER
  SHIPPER_BASE: () => `${BASE_NAME}shipper/`,
  SHIPPER_ORDER: () => `order`,

  SHIPPER_ORDER_DETAIL: ({ orderId = '' }: { orderId?: string }) =>
    `order-detail/${orderId ? orderId : ':orderId'}`,
  // ================================================================================

  // ================================================================================
  // AUTH
  PAGE_NOT_FOUND: () => `/not-found`,
  PAGE_UNAUTHORIZED: () => `/unauthorized`,
  PAGE_SERVER_ERROR: () => `/server-error`,

  NOT_FOUND: () => `not-found`,
  UNAUTHORIZED: () => `unauthorized`,
  SERVER_ERROR: () => `/server-error`,
  // ================================================================================
};
