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

import instanceMongodb from '@dbs/init.mongodb';

import router from '@routes/index';
import ErrorResponse from './core/error.response';

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
// init routes
appExpress.use('/', router);
//=================================================

//=================================================
// handling errors
// after handling in routes
appExpress.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error('Not found');

  const middleError = error as any;

  middleError.status = 404;

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
  return new ErrorResponse({
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
