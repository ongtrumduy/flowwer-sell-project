import JWT, { JwtPayload } from 'jsonwebtoken';

import { asyncHandler } from '@helpers/asyncHandler';

import KeyTokenService from '@services/keyToken.service';
import { EnumHeaderKey, EnumMessageStatus } from '../utils/type';
import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../core/error.response';
import {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} from '../utils/constant';

export interface WithKeyStoreRequest extends Request {
  keyStore: any;
}

export interface WithKeyStoreV2Request extends Request {
  keyStore: any;
  user: any;
  refreshToken: any;
}

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
    throw new ErrorResponse({
      statusCode: 401,
      message: 'Invalid Token !!!',
      reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
    });
  }
};

export const authentication = asyncHandler(
  async (req: WithKeyStoreRequest, res: Response, next: NextFunction) => {
    const reqHeader = req.headers;

    const userId = reqHeader[EnumHeaderKey.CLIEND_ID]?.toString();

    if (!userId) {
      return res.status(401).json({
        status: '401',
        error: EnumMessageStatus.UNAUTHORIZED_401,
        message: 'Not Have User Id !!!',
      });
    }

    const keyStore = await KeyTokenService.findKeyTokenByUserId(userId);

    if (!keyStore) {
      return res.status(403).json({
        status: '403',
        error: EnumMessageStatus.FORBIDDEN_403,
        message: 'Invalid User Id !!!',
      });
    }

    const accessToken = reqHeader[EnumHeaderKey.TOKEN]?.toString();

    if (!accessToken) {
      return res.status(401).json({
        status: '401',
        error: EnumMessageStatus.UNAUTHORIZED_401,
        message: 'Not Have Access Token !!!',
      });
    }

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

      if (userId !== (decodeUser as JwtPayload).userId) {
        return res.status(401).json({
          status: '401',
          error: EnumMessageStatus.UNAUTHORIZED_401,
          message: 'Invalid UserId !!!',
        });
      }

      req.keyStore = keyStore;

      return next();
    } catch (error) {
      throw new ErrorResponse({
        statusCode: 401,
        message: 'Invalid Token !!!',
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  }
);

export const authenticationV2 = asyncHandler(
  async (req: WithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const userId = req.headers[EnumHeaderKey.CLIEND_ID]?.toString();

    if (!userId) {
      // throw new Error('Not Have User Id !!!');
      return res.status(403).json({
        status: '403',
        error: EnumMessageStatus.FORBIDDEN_403,
        message: 'Not Have User Id !!!',
      });
    }

    // atomic ---> not normal object
    const keyStore = await KeyTokenService.findKeyTokenByUserId(userId);

    if (!keyStore) {
      // throw new Error('Invalid User Id !!!');
      return res.status(403).json({
        status: '403',
        error: EnumMessageStatus.FORBIDDEN_403,
        message: 'Invalid User Id !!!',
      });
    }

    if (req.headers[EnumHeaderKey.REFRESH_TOKEN]) {
      try {
        const refreshToken =
          req.headers[EnumHeaderKey.REFRESH_TOKEN]?.toString();

        const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);

        if (userId !== (decodeUser as JwtPayload).userId) {
          // throw new Error('Invalid UserId !!!');
          return res.status(403).json({
            status: '403',
            error: EnumMessageStatus.FORBIDDEN_403,
            message: 'Invalid User Id !!!',
          });
        }

        req.keyStore = keyStore;
        req.user = decodeUser;
        req.refreshToken = refreshToken;

        return next();
      } catch (error) {
        return res.status(401).json({
          status: '401',
          error: EnumMessageStatus.UNAUTHORIZED_401,
          message: error,
        });
      }
    }

    const accessTokenGetHeader =
      req.headers[EnumHeaderKey.AUTHORIZATION]?.toString() || 'Bearer ';
    const accessToken = accessTokenGetHeader.replace('Bearer ', '');

    if (!accessToken) {
      // throw new Error('Not Have Access Token !!!');
      return res.status(403).json({
        status: '403',
        error: EnumMessageStatus.FORBIDDEN_403,
        message: 'Not Have Access Token !!!',
      });
    }

    try {
      const decodeUser = JWT.verify(accessToken, keyStore.publicKey);

      if (userId !== (decodeUser as JwtPayload).userId) {
        // throw new Error('Invalid UserId !!!');
        return res.status(403).json({
          status: '403',
          error: EnumMessageStatus.FORBIDDEN_403,
          message: 'Invalid User Id !!!',
        });
      }

      req.keyStore = keyStore;
      req.user = decodeUser;
      // req.refreshToken = 'refreshToken';

      return next();
    } catch (error) {
      // throw error;
      throw new ErrorResponse({
        statusCode: 401,
        message: 'Invalid Token !!!',
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  }
);

export const verifyJWT = async ({
  token,
  keySecret,
}: {
  token: string;
  keySecret: string;
}) => {
  try {
    return await JWT.verify(token, keySecret);
  } catch (error) {
    return null;
  }
};
