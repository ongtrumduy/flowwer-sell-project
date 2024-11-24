import { EnumGender, EnumPermission, EnumRole } from './type';

const DEFAULT_ROLE = [EnumRole.USER];
const DEFAULT_PERMISSION = [EnumPermission.ALL];
const DEFAULT_GENDER = EnumGender.UNKNOWN;

const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1m';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '30d';

const DEFAULT_LIMIT = 8;
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000000;
const DEFAULT_PAGE = 1;
const DEFAULT_CATEGORY_ID = 'ALL';
const DEFAULT_TYPE_PRODUCT_ID = 'ALL';

const DEFAULT_ORDER_STAGE = 'ALL';

const DEFAULT_PORT = 8888;
const DEFAULT_DOMAIN = 'http://localhost';

const PORT = process.env.PORT || DEFAULT_PORT;
const DEFAULT_APP_NAME = '';

const DOMAIN = process.env.DOMAIN || DEFAULT_DOMAIN;
const APP_NAME = process.env.APP_NAME || DEFAULT_APP_NAME;

const DEFAULT_PICK_UP_ADDRESS = 'Số nhà AA, ngõ 111, phường XX, quận YY, thành phố S';

const DEFAULT_ROLE_LIST = Object.values(EnumRole);

const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const STRIPE_API_KEY = STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_ID = '';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

const ADMIN_EMAIL_ADDRESS = process.env.ADMIN_EMAIL_ADDRESS;
const GOOGLE_MAILER_CLIENT_ID = process.env.GOOGLE_MAILER_CLIENT_ID;
const GOOGLE_MAILER_CLIENT_SECRET = process.env.GOOGLE_MAILER_CLIENT_SECRET;
const GOOGLE_MAILER_REFRESH_TOKEN = process.env.GOOGLE_MAILER_REFRESH_TOKEN;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

export {
  DEFAULT_ROLE,
  DEFAULT_GENDER,
  DEFAULT_PERMISSION,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  DEFAULT_LIMIT,
  DEFAULT_MIN_PRICE,
  DEFAULT_MAX_PRICE,
  DEFAULT_PAGE,
  DEFAULT_CATEGORY_ID,
  DEFAULT_TYPE_PRODUCT_ID,
  DEFAULT_ORDER_STAGE,
  DEFAULT_PORT,
  PORT,
  DOMAIN,
  APP_NAME,
  DEFAULT_PICK_UP_ADDRESS,
  DEFAULT_ROLE_LIST,
  // =================================================================
  // =================================================================
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  // =================================================================
  // =================================================================
  ADMIN_EMAIL_ADDRESS,
  GOOGLE_MAILER_CLIENT_ID,
  GOOGLE_MAILER_CLIENT_SECRET,
  GOOGLE_MAILER_REFRESH_TOKEN,
  GOOGLE_REDIRECT_URI,
};
