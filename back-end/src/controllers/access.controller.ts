import AccessService from '@services/access.service';
import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import {
  EnumMessageStatus,
  EnumReasonStatusCode,
  WithKeyStoreV2Request,
} from '@root/src/utils/type';

class AccessController {
  //=========================================================
  // Handler Refresh Token
  // static handlerRefreshToken = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const data = await AccessService.handlerRefreshToken({
  //     refreshToken: req.body.refreshToken,
  //   });

  //   new SuccessResponse({
  //     metaData: data?.metaData,
  //     message: data?.metaData || 'Refresh Token Successfully !!!',
  //     statusCode: data?.statusCode || 200,
  //     reasonStatusCode:
  //       data?.reasonStatusCode ||
  //       EnumReasonStatusCode.REFRESH_TOKEN_SUCCESSFULLY,
  //   }).send({
  //     res,
  //     headers: null,
  //   });
  // };

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
      phone_number: String(req.body.phone_number),
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

  //=========================================================
  // verify to reset password
  static verifyToResetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.verifyToResetPassword({
      resetPasswordToken: req.body.resetPasswordToken,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Verify To Reset Password Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode ||
        EnumReasonStatusCode.VERIFY_TO_RESET_PASSWORD_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // reset password
  static resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.resetPassword({
      resetPasswordToken: String(req.body.resetPasswordToken),
      newPassword: String(req.body.newPassword),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Reset Password Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode ||
        EnumReasonStatusCode.RESET_PASSWORD_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // reset password
  static changePassword = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.changePassword({
      userId: req.user.id,
      oldPassword: String(req.body.oldPassword),
      newPassword: String(req.body.newPassword),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Change Password Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode ||
        EnumReasonStatusCode.CHANGE_PASSWORD_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // post email to reset password
  static postEmailToResetPassword = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.postEmailToResetPassword({
      emailTo: req.body.emailTo,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message:
        data?.metaData ||
        'If This Email Exists, You Will Receive A Reset Link Shortly !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode ||
        EnumReasonStatusCode.CHANGE_PASSWORD_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // post email to reset password
  static updateAllInformation = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await AccessService.postEmailToResetPassword({
      emailTo: req.body.emailTo,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Change Password Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode ||
        EnumReasonStatusCode.CHANGE_PASSWORD_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };
}

export default AccessController;
