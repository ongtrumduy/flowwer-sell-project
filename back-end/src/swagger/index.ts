import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

import { DOMAIN, PORT } from '@utils/constant';

// Cấu hình Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Api of Flower Shop Documentation',
      version: '1.0.0',
    },

    servers: [
      {
        url: `${DOMAIN}:${PORT}`, // URL server của API
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  // Chỉ định nơi để tìm các định nghĩa API (sử dụng comment trong các file này)
  apis: ['src/swagger/**/index.ts'],
  // apis: [path.join(__dirname, '*.swagger.yaml')], // Load tất cả các file `.js` trong thư mục này
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
