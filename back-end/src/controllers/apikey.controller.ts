import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus } from '@root/src/utils/type';
import ApiKeyService from '../services/apiKey.service';

class ApiKeyController {
  //=========================================================
  // generate api key
  static generateApiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await ApiKeyService.generateApiKey();

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Generate api key successfully !!!',
      statusCode: data?.code || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };
}

export default ApiKeyController;
