import { NextFunction, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumReasonStatusCode, WithCartRequest } from '@root/src/utils/type';
import OrderService from '../services/order.service';
import NodeMailerService from '../services/nodemailerMail.service';

class NodemailerMailController {
  // =========================================================
  // post email
  static postEmail = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await NodeMailerService.postEmail({
      email: req.body.email,
      subject: req.body.subject,
      content: req.body.content,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Email Sent Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // post email to reset password
  // static postEmailToResetPassword = async (
  //   req: WithCartRequest,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   const data = await NodeMailerService.postEmailToResetPassword({
  //     email: req.body.email,
  //   });

  //   new SuccessResponse({
  //     metaData: data?.metaData,
  //     message: 'Email Sent Successfully !!!',
  //     statusCode: data?.statusCode || 200,
  //     reasonStatusCode:
  //       data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
  //   }).send({
  //     res,
  //     headers: null,
  //   });
  // };
}

export default NodemailerMailController;
