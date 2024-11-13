import JWT, { JwtPayload } from 'jsonwebtoken';

import { asyncHandler } from '@helpers/asyncHandler';

import KeyTokenService from '@services/keyToken.service';
import { NextFunction, Response } from 'express';
import ErrorDTODataResponse from '../core/error.dto.response';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../utils/constant';
import {
  EnumHeaderKey,
  EnumReasonStatusCode,
  WithKeyStoreRequest,
  WithKeyStoreV2Request,
} from '../utils/type';

export const createTokenPair = async ({
  payload,
  publicKey,
  privateKey,
}: {
  payload: { userId: string; name: string; email: string; roles: string[] };
  publicKey: string;
  privateKey: string;
}) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    // let accessTokenExpires;
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log('error verify ===>', error);
      } else {
        console.log('decode ===>', decode);
        // accessTokenExpires = decode
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ErrorDTODataResponse({
      statusCode: 401,
      message: (error as Error).message,
      reasonStatusCode: EnumReasonStatusCode.UNAUTHORIZED,
    });
  }
};

export const authentication = asyncHandler(
  async (req: WithKeyStoreRequest, res: Response, next: NextFunction) => {
    const reqHeader = req.headers;

    const userId = reqHeader[EnumHeaderKey.CLIEND_ID]?.toString();

    if (!userId) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Not Found User Id!!!',
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER_ID,
      });
    }

    const keyStore = await KeyTokenService.findKeyTokenByUserId(userId);

    if (!keyStore) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Invalid User Id !!!',
        reasonStatusCode: EnumReasonStatusCode.INVALID_USER_ID,
      });
    }

    const accessToken = reqHeader[EnumHeaderKey.TOKEN]?.toString();

    if (!accessToken) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        reasonStatusCode: EnumReasonStatusCode.NOT_HAVE_ACCESS_TOKEN,
        message: 'Not Have Access Token !!!',
      });
    }

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

      if (userId !== (decodeUser as JwtPayload).userId) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          reasonStatusCode: EnumReasonStatusCode.INVALID_USER_ID,
          message: 'Invalid UserId !!!',
        });
      }

      req.keyStore = keyStore;

      return next();
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: (error as Error).message,
        reasonStatusCode: EnumReasonStatusCode.EXPIRED_ACCESS_TOKEN,
      });
    }
  }
);

export const authenticationV2 = asyncHandler(
  async (req: WithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const userId = req.headers[EnumHeaderKey.CLIEND_ID]?.toString();

    if (!userId) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Not Found User Id!!!',
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER_ID,
      });
    }

    // atomic ---> not normal object
    const keyStore = await KeyTokenService.findKeyTokenByUserId(userId);

    if (!keyStore) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Invalid User Id !!!',
        reasonStatusCode: EnumReasonStatusCode.INVALID_USER_ID,
      });
    }

    if (req.headers[EnumHeaderKey.REFRESH_TOKEN]) {
      try {
        const refreshToken =
          req.headers[EnumHeaderKey.REFRESH_TOKEN]?.toString();

        const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);

        if (userId !== (decodeUser as JwtPayload).userId) {
          throw new ErrorDTODataResponse({
            statusCode: 401,
            reasonStatusCode: EnumReasonStatusCode.INVALID_USER_ID,
            message: 'Invalid UserId !!!',
          });
        }

        req.keyStore = keyStore;
        req.user = decodeUser;
        req.refreshToken = refreshToken;

        return next();
      } catch (error) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          reasonStatusCode: EnumReasonStatusCode.INVALID_REFRESH_TOKEN,
          message: (error as Error).message,
        });
      }
    }

    const accessTokenGetHeader =
      req.headers[EnumHeaderKey.AUTHORIZATION]?.toString() || 'Bearer ';

    const accessToken = accessTokenGetHeader.replace('Bearer ', '');

    if (!accessToken) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        reasonStatusCode: EnumReasonStatusCode.NOT_HAVE_ACCESS_TOKEN,
        message: 'Not Have Access Token !!!',
      });
    }

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

      if (userId !== (decodeUser as JwtPayload).userId) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          reasonStatusCode: EnumReasonStatusCode.INVALID_USER_ID,
          message: 'Invalid UserId !!!',
        });
      }

      req.keyStore = keyStore;
      req.user = decodeUser;
      // req.refreshToken = 'refreshToken';

      return next();
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        reasonStatusCode: EnumReasonStatusCode.EXPIRED_ACCESS_TOKEN,
        message: (error as Error).message,
      });
    }
  }
);

export const verifyJWTByRefreshToken = async ({
  refreshToken,
  keySecret,
}: {
  refreshToken: string;
  keySecret: string;
}) => {
  try {
    return await JWT.verify(refreshToken, keySecret);
  } catch (error) {
    throw new ErrorDTODataResponse({
      statusCode: 401,
      reasonStatusCode: EnumReasonStatusCode.INVALID_REFRESH_TOKEN,
      message: (error as Error).message,
    });
  }
};
