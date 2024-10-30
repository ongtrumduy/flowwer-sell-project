import ApiKeyService from '@services/apiKey.service';
import {
  EnumHeaderKey,
  EnumMessageStatus,
  EnumPermission,
} from '@root/src/utils/type';
import { NextFunction, Request, Response } from 'express';
import ErrorResponse from '../core/error.response';

interface WithObjKeyRequest extends Request {
  objKey: any;
}

export const apiKeys = async (
  req: WithObjKeyRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers[EnumHeaderKey.API_KEY]?.toString();

    if (!apiKey) {
      return res.status(401).json({
        status: '401',
        error: EnumMessageStatus.UNAUTHORIZED_401,
        message: 'Not Have API Key !!!',
      });
    }

    const objKey = await ApiKeyService.findApiKeyById({ key: apiKey });

    if (!objKey) {
      return res.status(403).json({
        status: '403',
        error: EnumMessageStatus.FORBIDDEN_403,
        message: 'Invalid API Key !!!',
      });
    }

    req.objKey = objKey;

    // return next(req); ---> ERROR
    return next();
  } catch (error) {
    // console.log('show error apiKey =========>', { error });
    throw new ErrorResponse({
      statusCode: 401,
      message: 'Invalid API Key !!!',
      reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
    });
  }
};

export const permission = (permission: EnumPermission) => {
  return (req: WithObjKeyRequest, res: Response, next: NextFunction) => {
    if (!req?.objKey?.permissions) {
      return res.status(401).json({
        status: '401',
        error: EnumMessageStatus.UNAUTHORIZED_401,
        message: 'Not Have Permission !!!',
      });
    }

    const { permissions } = req?.objKey;

    // console.log('permissions 46 =======>', { permissions });

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        status: '403',
        error: EnumMessageStatus.FORBIDDEN_403,
        message: 'Invalid Permission !!!',
      });
    }

    // return next(req); ---> ERROR
    return next();
  };
};
