import AccessService from '@services/access.service';
import { NextFunction, Request, Response } from 'express';

import { WithKeyStoreV2Request } from '@auth/authUtils';
import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, EnumReasonStatusCode } from '@root/src/utils/type';

class AccessController {
  //=========================================================
  // Handler Refresh Token
  static handlerRefreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.handlerRefreshToken({
      refreshToken: req.body.refreshToken,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data?.metaData || 'Refresh Token Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode ||
        EnumReasonStatusCode.REFRESH_TOKEN_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // Handler Refresh Token v2
  static handlerRefreshTokenV2 = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.handlerRefreshTokenV2({
      refreshToken: req.refreshToken,
      user: req.user,
      keyStore: req.keyStore,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: data?.metaData || 'Refresh Token Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode ||
        EnumReasonStatusCode.REFRESH_TOKEN_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // logout
  static logout = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.logout({
      keyStore: req.keyStore,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Logout Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.LOGOUT_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // login
  static login = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AccessService.login({
      email: String(req.body.email),
      password: String(req.body.password),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Login Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.LOGIN_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // sign up
  static signUp = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AccessService.signUp({
      email: String(req.body.email),
      name: String(req.body.name),
      phoneNumber: String(req.body.phoneNumber),
      address: String(req.body.address),
      password: String(req.body.password),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Sign Up Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SIGN_UP_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };
}

export default AccessController;
