import { NextFunction, Response } from 'express';

import SuccessResponse from '@core/success.response';
import {
  EnumReasonStatusCode,
  InterfaceWithMulterFileRequest,
} from '@root/src/utils/type';
import CloudinaryUploadService from '../services/cloudinaryUpload.service';

class CloudinaryUploadController {
  // =========================================================
  // create a new order for customerO
  static uploadProfileAvatarImage = async (
    req: InterfaceWithMulterFileRequest,
    res: Response,
    next: NextFunction
  ) => {
    // console.log('19 show req, res, next =============================>', {
    //   req,
    //   res,
    //   next,
    // });

    const data = await CloudinaryUploadService.uploadProfileAvatarImage({
      imagePath: req.file ? req.file.path : '',
    });

    // console.log(
    //   '22 show CloudinaryUploadService.uploadProfileAvatarImage =============================>',
    //   { data }
    // );

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Upload Profile Avatar Image Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default CloudinaryUploadController;
