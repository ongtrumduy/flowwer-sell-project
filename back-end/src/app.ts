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

// const swaggerDocument = YAML.load('./swagger.yaml');

const appExpress = express();

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
