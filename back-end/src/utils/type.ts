import { Request } from 'express';

export interface InterfacePayload {
  userId: string;
  name: string;
  email: string;
  role_list: EnumRole[];
  avatar_url: string;
  address: string;
  phone_number: string;
  status: boolean;
  verified: boolean;
}

export interface InterfaceWithKeyStoreRequest extends Request {
  keyStore: any;
}

export interface InterfaceWithKeyStoreV2Request extends Request {
  keyStore: any;
  user: InterfacePayload;
  refreshToken: any;
}

export interface InterfaceWithMulterFileRequest extends Request {
  file?: Express.Multer.File;
}

export interface InterfaceWithCartRequest extends Request {
  cart: any;
  cartId: string;
  user: InterfacePayload;
}

export enum EnumMessageStatus {
  SUCCESS_200 = 'Success',
  CREATED_201 = 'Created',
  UPDATED = 'Updated',
  DELETED = 'Deleted',
  ERROR = 'Error',
  BAD_REQUEST_400 = 'Bad Request',
  NOT_FOUND_404 = 'Not Found',
  UNAUTHORIZED_401 = 'Unauthorized',
  FORBIDDEN_403 = 'Forbidden',
  INTERNET_SERVER_ERROR_500 = 'Internet Server Error',
}

export enum EnumHeaderKey {
  API_KEY = 'x-api-key',
  TOKEN = 'x-token',
  AUTHORIZATION = 'authorization',
  CLIEND_ID = 'x-client-id',
  REFRESH_TOKEN = 'x-rtoken-id',
}

export enum EnumPermission {
  ALL = 'ALL',
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export enum EnumRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SHIPPER = 'SHIPPER',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST',
}

export enum EnumGender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  UNKNOWN = 'UNKNOWN',
}

export enum EnumStatusOfOrder {
  PENDING = 'PENDING',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  WAITING_CONFIRM = 'WAITING_CONFIRM',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum EnumReasonStatusCode {
  INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN',
  INVALID_REFRESH_TOKEN = 'INVALID_REFRESH_TOKEN',
  INVALID_USER_ID = 'INVALID_USER_ID',
  NOT_HAVE_ACCESS_TOKEN = 'NOT_HAVE_ACCESS_TOKEN',
  NOT_HAVE_PERMISSION = 'NOT_HAVE_PERMISSION',
  EXPIRED_ACCESS_TOKEN = 'EXPIRED_ACCESS_TOKEN',
  OLD_PASSWORD_AND_NEW_PASSWORD_REQUIRED = 'OLD_PASSWORD_AND_NEW_PASSWORD_REQUIRED',
  EXPIRED_REFRESH_TOKEN = 'EXPIRED_REFRESH_TOKEN',
  REFRESH_TOKEN_SUCCESSFULLY = 'REFRESH_TOKEN_SUCCESSFULLY',
  RESET_PASSWORD_SUCCESSFULLY = 'RESET_PASSWORD_SUCCESSFULLY',
  VERIFY_TO_RESET_PASSWORD_SUCCESSFULLY = 'VERIFY_TO_RESET_PASSWORD_SUCCESSFULLY',
  CHANGE_PASSWORD_SUCCESSFULLY = 'CHANGE_PASSWORD_SUCCESSFULLY',
  TOO_MANY_RESET_ATTEMPTS = 'TOO_MANY_RESET_ATTEMPTS',
  FORBIDDEN_PERMISSION = 'FORBIDDEN_PERMISSION',
  RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR',
  SUCCESS_200 = 'SUCCESS_200',
  CREATED_201 = 'CREATED_201',
  INVALID_RESET_PASSWORD_TOKEN = 'INVALID_RESET_PASSWORD_TOKEN',
  NOT_FOUND_404 = 'NOT_FOUND_404',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  BAD_REQUEST = 'BAD_REQUEST',
  NOT_FOUND_USER = 'NOT_FOUND_USER',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND_USER_ID = 'NOT_FOUND_USER_ID',
  NOT_FOUND_CLIENT = 'NOT_FOUND_CLIENT',
  NOT_FOUND_ACCESS_TOKEN = 'NOT_FOUND_ACCESS_TOKEN',
  NOT_FOUND_REFRESH_TOKEN = 'NOT_FOUND_REFRESH_TOKEN',
  REFRESH_TOKEN_USED = 'REFRESH_TOKEN_USED',
  CREATE_TOKEN_PAIR_FAILED = 'CREATE_TOKEN_PAIR_FAILED',
  INVALID_CLIENT_ID = 'INVALID_CLIENT_ID',
  EXPIRED_API_KEY = 'EXPIRED_API_KEY',
  INVALID_API_KEY = 'INVALID_API_KEY',
  NOT_FOUND_API_KEY = 'NOT_FOUND_API_KEY',
  NOT_FOUND_PRODUCT = 'NOT_FOUND_PRODUCT',
  NOT_FOUND_CATEGORY = 'NOT_FOUND_CATEGORY',
  NOT_FOUND_ORDER = 'NOT_FOUND_ORDER',
  NOT_FOUND_ORDER_DETAIL = 'NOT_FOUND_ORDER_DETAIL',
  NOT_FOUND_COMMENT = 'NOT_FOUND_COMMENT',
  NOT_FOUND_USER_ADDRESS = 'NOT_FOUND_USER_ADDRESS',
  NOT_FOUND_USER_PAYMENT = 'NOT_FOUND_USER_PAYMENT',
  NOT_FOUND_USER_SHIPPING = 'NOT_FOUND_USER_SHIPPING',
  NOT_FOUND_USER_WISHLIST = 'NOT_FOUND_USER_WISHLIST',
  NOT_FOUND_USER_CART = 'NOT_FOUND_USER_CART',
  NOT_FOUND_USER_ORDER = 'NOT_FOUND_USER_ORDER',
  NOT_FOUND_USER_ORDER_DETAIL = 'NOT_FOUND_USER_ORDER_DETAIL',
  NOT_FOUND_USER_WISHLIST_PRODUCT = 'NOT_FOUND_USER_WISHLIST_PRODUCT',
  NOT_FOUND_USER_CART_PRODUCT = 'NOT_FOUND_USER_CART_PRODUCT',
  NOT_FOUND_USER_ADDRESS_SHIPPING = 'NOT_FOUND_USER_ADDRESS_SHIPPING',
  NOT_FOUND_USER_ADDRESS_BILLING = 'NOT_FOUND_USER_ADDRESS_BILLING',
  NOT_FOUND_USER_ADDRESS_BILLING_SAME = 'NOT_FOUND_USER_ADDRESS_BILLING_SAME',
  NOT_FOUND_USER_ADDRESS_BILLING_ORDER = 'NOT_FOUND_USER_ADDRESS_BILLING_ORDER',
  NOT_FOUND_USER_PAYMENT_ORDER = 'NOT_FOUND_USER_PAYMENT_ORDER',
  NOT_FOUND_USER_PAYMENT_ORDER_SAME = 'NOT_FOUND_USER_PAYMENT_ORDER_SAME',
  NOT_FOUND_USER_PAYMENT_ORDER_BILLING = 'NOT_FOUND_USER_PAYMENT_ORDER_BILLING',
  NOT_FOUND_USER_PAYMENT_ORDER_BILLING_SAME = 'NOT_FOUND_USER_PAYMENT_ORDER_BILLING_SAME',
  NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER = 'NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER',
  NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER_SAME = 'NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER_SAME',
  NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER_SAME_SAME = 'NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER_SAME_SAME',
  NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER_SAME_SAME_SAME = 'NOT_FOUND_USER_PAYMENT_ORDER_BILLING_ORDER_SAME_SAME_SAME',
  NOT_FOUND_USER_SHIPPING_ORDER = 'NOT_FOUND_USER_SHIPPING_ORDER',
  SIGN_UP_SUCCESSFULLY = 'SIGN_UP_SUCCESSFULLY',
  CREATE_KEY_TOKEN_FAILED = 'CREATE_KEY_TOKEN_FAILED',
  EXISTED_USER = 'EXISTED_USER',
  LOGOUT_SUCCESSFULLY = 'LOGOUT_SUCCESSFULLY',
  LOGIN_SUCCESSFULLY = 'LOGIN_SUCCESSFULLY',
  INVALID_PASSWORD = 'INVALID_PASSWORD',
  CREATED_SUCCESSFULLY = 'CREATED_SUCCESSFULLY',
  GET_LIST_SUCCESSFULLY = 'GET_LIST_SUCCESSFULLY',
  UPDATED_SUCCESSFULLY = 'UPDATED_SUCCESSFULLY',
  REMOVED_SUCCESSFULLY = 'REMOVED_SUCCESSFULLY',
}
