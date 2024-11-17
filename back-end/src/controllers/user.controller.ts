import { NextFunction, Request, Response } from 'express';

import SuccessResponse from '@core/success.response';
import {
  EnumReasonStatusCode,
  WithCartRequest,
  WithKeyStoreV2Request,
} from '@root/src/utils/type';
import cloudinaryConfig from '../configs/config.cloudinary';
import UserService from '../services/user.service';

const cloudinary = cloudinaryConfig();

class UserController {
  // =========================================================
  // change information
  static createNewUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await UserService.createNewUser({
      phone_number: req.body.phone_number,
      address: req.body.address,
      name: req.body.name,
      gender: req.body.gender,
      birth_date: req.body.birth_date,
      email: req.body.email,
      password: req.body.password,
      roles: req.body.roles,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create New User Successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // change information
  static changeInformation = async (
    req: WithKeyStoreV2Request,
    res: Response,
    next: NextFunction
  ) => {
    const data = await UserService.changeInformation({
      userId: req.user.userId,
      phone_number: req.body.phone_number,
      address: req.body.address,
      name: req.body.name,
      gender: req.body.gender,
      birth_date: req.body.birth_date,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Change Information Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  // =========================================================
  // change avatar
  static changeAvatar = async (
    req: WithCartRequest,
    res: Response,
    next: NextFunction
  ) => {
    const data = await UserService.uploadSingleImage({
      imagePath: req.file ? req.file.path : '',
      fieldName: 'avatar_user_image',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Change Avatar Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode:
        data?.reasonStatusCode || EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
    }).send({
      res,
      headers: null,
    });
  };

  // =================================================================
}

export default UserController;
