import ApiKeyService from '@services/apiKey.service';
import {
  EnumHeaderKey,
  EnumMessageStatus,
  EnumPermission,
  EnumReasonStatusCode,
} from '@root/src/utils/type';
import { NextFunction, Request, Response } from 'express';
import ErrorDTODataResponse from '../core/error.dto.response';

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
      throw new ErrorDTODataResponse({
        statusCode: 401,
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_API_KEY,
        message: 'Not Found API Key!!!',
      });
    }

    const objKey = await ApiKeyService.findApiKeyById({ key: apiKey });

    if (!objKey) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        reasonStatusCode: EnumReasonStatusCode.INVALID_API_KEY,
        message: 'Invalid API Key!!!',
      });
    }

    req.objKey = objKey;

    // return next(req); ---> ERROR
    return next();
  } catch (error) {
    throw new ErrorDTODataResponse({
      statusCode: 401,
      message: (error as Error).message,
      reasonStatusCode: EnumReasonStatusCode.UNAUTHORIZED,
    });
  }
};

export const permission = (permission: EnumPermission) => {
  return (req: WithObjKeyRequest, res: Response, next: NextFunction) => {
    if (!req?.objKey?.permissions) {
      throw new ErrorDTODataResponse({
        statusCode: 403,
        message: 'Not Have Permission !!!',
        reasonStatusCode: EnumReasonStatusCode.NOT_HAVE_PERMISSION,
      });
    }

    const { permissions } = req?.objKey;

    const validPermission = permissions.includes(permission);

    if (!validPermission) {
      throw new ErrorDTODataResponse({
        statusCode: 403,
        message: 'Forbidden Permission !!!',
        reasonStatusCode: EnumReasonStatusCode.FORBIDDEN_PERMISSION,
      });
    }

    // return next(req); ---> ERROR
    return next();
  };
};
