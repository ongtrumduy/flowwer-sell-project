const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052,
  },
  db: {
    format: process.env.DEV_MONGODB_FORMAT || 'mongodb',
    host: process.env.DEV_MONGODB_HOST || '192.168.42.118' || 'localhost',
    port: process.env.DEV_MONGODB_PORT || 27017,
    name: process.env.DEV_MONGODB_NAME || 'shop-flower-sell-dev',
    username: process.env.DEV_MONGODB_USERNAME || 'tendouaaa',
    password: process.env.DEV_MONGODB_PASSWORD || '123456a%40',
    appname: process.env.DEV_MONGODB_APPNAME || 'shop-flower-sell-dev',
  },
};

const atlas = {
  app: {
    port: process.env.DEV_APP_PORT || 3052,
  },
  db: {
    format: process.env.DEV_MONGODB_FORMAT || 'mongodb+srv',
    host:
      process.env.DEV_MONGODB_HOST || 'shop-flower-sell-dev.oetq6.mongodb.net',
    port: 27017,
    name: 'shop-flower-sell-dev',
    username: process.env.DEV_MONGODB_USERNAME || 'tendouaaa',
    password: process.env.DEV_MONGODB_PASSWORD || '123456a%40',
    appname: process.env.DEV_MONGODB_APPNAME || 'shop-flower-sell-dev',
  },
};

const prod = {
  app: {
    port: process.env.PROD_APP_PORT || 3052,
  },
  db: {
    format: process.env.PROD_MONGODB_FORMAT || 'mongodb',
    host: process.env.PROD_MONGODB_HOST || 'localhost',
    port: process.env.PROD_MONGODB_PORT || 27017,
    name: process.env.PROD_MONGODB_NAME || 'shop-flower-prod',
    username: process.env.PROD_MONGODB_USERNAME || 'tendouaaa',
    password: process.env.PROD_MONGODB_PASSWORD || '123456a%40',
    appname: process.env.PROD_MONGODB_APPNAME || 'shop-flower-dev',
  },
};

const config = {
  dev,
  atlas,
  prod,
};

const env = process.env.MONGODB_CONNECT_ENV || 'atlas';

const currentConfig = config[env as keyof typeof config];

export default currentConfig;
