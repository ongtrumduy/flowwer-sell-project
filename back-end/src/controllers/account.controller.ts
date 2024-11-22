import { NextFunction, Request, Response } from 'express';
import AccountService from '@services/account.service';

import SuccessResponse from '@core/success.response';
import { EnumMessageStatus, InterfaceWithKeyStoreV2Request } from '@root/src/utils/type';
import { DEFAULT_LIMIT, DEFAULT_MAX_PRICE, DEFAULT_MIN_PRICE, DEFAULT_PAGE } from '../utils/constant';

class AccountController {
  //=========================================================
  // get all account list
  // query params: limit, page, priceMin, priceMax, searchName, selectedCategory
  static getAllAccountList = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AccountService.getAllAccountList({
      limit: req.query?.limit ? Number(req.query.limit) : DEFAULT_LIMIT,
      page: req.query?.page ? Number(req.query.page) : DEFAULT_PAGE,
      searchName: req.query?.searchName ? String(req.query.searchName) : '',
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get list account successfully !!!',
      statusCode: data?.code || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // get account item detail
  static getAccountItemDetail = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AccountService.getAccountItemDetail({
      accountId: String(req.params.accountId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Get account item detail successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // create new account
  static createNewAccount = async (req: Request, res: Response, next: NextFunction) => {
    const data = await AccountService.createNewAccount({
      account_name: req.body.account_name,
      account_email: req.body.account_email,
      account_phone_number: req.body.account_phone_number,
      account_address: req.body.account_address,
      accountAvatarPath: req.file ? req.file.path : '',
      accountAvatarFieldName: 'account_avatar',
      account_role: req.body.account_role,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Create new account successfully !!!',
      statusCode: data?.statusCode || 201,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.CREATED_201,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // update account
  static updateAccount = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AccountService.updateAccount({
      account_name: req.body.account_name,
      account_email: req.body.account_email,
      account_phone_number: req.body.account_phone_number,
      account_address: req.body.account_address,
      accountAvatarPath: req.file ? req.file.path : '',
      accountAvatarFieldName: 'account_avatar',
      account_role: req.body.account_role,
      account_avatar: req.body.account_avatar,
      accountId: req.params.accountId,
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Update Account Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };

  //=========================================================
  // delete account
  static deleteAccount = async (req: InterfaceWithKeyStoreV2Request, res: Response, next: NextFunction) => {
    const data = await AccountService.deleteAccount({
      accountId: String(req.query.accountId),
    });

    new SuccessResponse({
      metaData: data?.metaData,
      message: 'Delete Account Successfully !!!',
      statusCode: data?.statusCode || 200,
      reasonStatusCode: data?.reasonStatusCode || EnumMessageStatus.SUCCESS_200,
    }).send({
      res,
      headers: null,
    });
  };
}

export default AccountController;
