import express, {
  NextFunction,
  Request,
  Response,
  ErrorRequestHandler,
} from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import router from '@routes/index';
import ErrorResponse from '@core/error.response';
import instanceMongodb from '@dbs/init.mongodb';
import swaggerSpec from '@swagger/index';
import { EnumReasonStatusCode } from './utils/type';
import cloudinaryConfig from './configs/config.cloudinary';
import path from 'path';

// const swaggerDocument = YAML.load('./swagger.yaml');
const cloudinary = cloudinaryConfig();

// =================================================================================
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: (
//     req: Express.Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, destination: string) => void
//   ) => {
//     console.log('17 destination =============================>', { req, file });
//     cb(null, path.join(__dirname, 'uploads'));
//   },
//   filename: (
//     req: Express.Request,
//     file: Express.Multer.File,
//     cb: (error: Error | null, filename: string) => void
//   ) => {
//     console.log('25 filename =============================>', { req, file });

//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + '-' + file.originalname); // Đặt tên file
//   },
// });

// Khởi tạo Multer với cấu hình đã định
// const upload = multer({ storage: storage });

// const upload = multer({ dest: 'uploads/' }); // Thư mục lưu file

// =================================================================================================

const appExpress = express();

// =================================================================================================
// const myMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   upload.single('file')(req, res, (err: any) => {
//     console.log('req, res, in multer:', { req, res, err });

//     if (err) {
//       console.error('Error in multer:', err);
//       return res
//         .status(500)
//         .json({ error: 'Multer error', details: err.message });
//     }
//     // After file upload success, call `next()` to pass control to the next handler
//     next();
//   });
// };

// appExpress.post('/upload', myMiddleware, (req: Request, res: Response) => {
//   res.send('File uploaded successfully!');
// });

// appExpress.post(
//   '/upload',
//   upload.single('file'),
//   (req: Request, res: Response) => {
//     // Không cần return cho res
//     console.log('File:', req.file); // Kiểm tra dữ liệu file
//     console.log('Body:', req.body); // Kiểm tra dữ liệu body

//     if (!req.file) {
//       res.status(400).json({ error: 'No file uploaded' });
//     }
//     res.json({
//       message: 'File uploaded successfully',
//       filePath: req?.file?.path,
//     });
//   }
// );

// =================================================================================

appExpress.use(morgan('dev'));
appExpress.use(cors());

appExpress.use(helmet());
appExpress.use(express.json());

appExpress.use(compression());

appExpress.use(express.json());
appExpress.use(express.urlencoded({ extended: true }));

//=================================================
// init db
instanceMongodb();
//=================================================

//=================================================
// init swagger
appExpress.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//=================================================
// init routes
appExpress.use('/', router);
//=================================================

//=================================================
// handling errors
// after handling in routes
appExpress.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error();

  const middleError = error as any;

  middleError.statusCode = 404;
  middleError.message =
    'Resource Not Found Or Not FoundApi Endpoint Or Wrong Api Method !!!';
  middleError.reasonStatusCode = EnumReasonStatusCode.NOT_FOUND_404;

  next(middleError);
});
//=================================================

//=================================================
// handle error for all routers

// const errorHandler: ErrorRequestHandler  = (
const errorHandler = (
  error: Error & any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log('inside here errorHandler', { error });
  // return
  new ErrorResponse({
    status: 'ERROR',
    reasonStatusCode: error.reasonStatusCode,
    message: error.message || 'Internal Server Error',
    statusCode: error.statusCode || 500,
    stack: error.stack || 'OH NO! Something went wrong',
  }).send({ res, headers: null });
};

appExpress.use(errorHandler as unknown as ErrorRequestHandler);
//=================================================

// module.exports = appExpress;

export default appExpress;
