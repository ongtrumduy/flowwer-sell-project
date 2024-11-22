import { Types } from 'mongoose';
import ErrorDTODataResponse from '../core/error.dto.response';
import { EnumMessageStatus, EnumReasonStatusCode } from '../utils/type';
import { DEFAULT_CATEGORY_ID } from '../utils/constant';
import SuccessDTODataResponse from '../core/success.dto.response';
import { nanoid } from 'nanoid';
import cloudinaryConfig from '../configs/config.cloudinary';

const cloudinary = cloudinaryConfig();
import fs from 'fs';
import UserModel from '../models/user.model';

class AccountService {
  //=====================================================================
  // get all account list version2
  static getAllAccountListV2 = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $search: {
          index: 'default',
          text: {
            query: searchName,
            path: ['account_name'],
            fuzzy: {
              maxEdits: 2,
            },
          },
        },
      });
    }

    // =================================================================
    // for pagination
    const data = [];
    data.push({
      $skip: (page - 1) * limit,
    });
    data.push({
      $limit: limit,
    });
    // =================================================================

    data.push({
      $project: {
        account_name: '$name',
        account_email: '$email',
        account_phone_number: '$phone_number',
        account_address: '$address',
        account_role: '$role_list',
        account_avatar: '$avatar_url',

        accountId: '$_id', // Đổi tên trường _id thành accountId
        // totalAccountSearch: 1,
        _id: 0,
      },
    });
    data.push({
      $sort: { createdAt: -1 } as Record<string, 1 | -1>, // Sắp xếp theo ngày tạo
    });
    // data.push({
    //   $group: {
    //     _id: '$accountId',
    //     account_name: { $first: '$account_name' },
    //     account_price: { $first: '$account_price' },
    //     totalAccountSearch: { $sum: 1 },
    //   },
    // });

    pipeline.push({
      $facet: {
        data: data,
        overview: [
          {
            $count: 'totalSearchCount', // Đếm tổng số sản phẩm
            // $addFields: {
            //   totalAccountSearch: '$totalAccountSearch',
            // },
          },
        ],
      },
    });

    const accounts = await UserModel.aggregate(pipeline);

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        accounts: { ...accounts },
      },
      reasonStatusCode: EnumReasonStatusCode.GET_LIST_SUCCESSFULLY,
      message: 'Get List Account Successfully !!!',
    });
  };

  //=====================================================================
  // get all account list
  static getAllAccountList = async ({ limit, page, searchName }: { limit: number; page: number; searchName: string }) => {
    const pipeline = [];

    if (searchName) {
      pipeline.push({
        $match: {
          $or: [{ $text: { $search: searchName } }, { name: { $regex: searchName, $options: 'i' } }],
        },
      });
    }

    // =================================================================
    // for pagination
    const data = [];
    data.push({
      $skip: (page - 1) * limit,
    });
    data.push({
      $limit: limit,
    });
    // =================================================================
    data.push({
      $project: {
        account_name: '$name',
        account_email: '$email',
        account_phone_number: '$phone_number',
        account_address: '$address',
        account_role: '$role_list',
        account_avatar: '$avatar_url',

        accountId: '$_id', // Đổi tên trường _id thành accountId
        // totalAccountSearch: 1,
        _id: 0,

        ...(searchName ? { score: { $meta: 'textScore' } } : {}),
      },
    });
    data.push({
      $sort: { createdAt: -1, ...(searchName ? { score: -1 } : {}) } as Record<string, 1 | -1>,
    });

    pipeline.push({
      $facet: {
        data: data,
        overview: [
          {
            $count: 'totalSearchCount',
          },
        ],
      },
    });

    const accounts = await UserModel.aggregate(pipeline);

    return {
      code: 200,
      metaData: {
        accounts: { ...accounts },
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  //=====================================================================
  // get account item detail
  static getAccountItemDetail = async ({ accountId }: { accountId: string }) => {
    // console.log('accountId ===>', accountId);
    try {
      const accountDetail = await UserModel.findOne({
        _id: new Types.ObjectId(accountId),
      })
        .select({
          name: 1,
          email: 1,
          avatar_url: 1,
          phone_number: 1,
          address: 1,
          role_list: 1,
          _id: 0,
        })
        .lean();

      if (!accountDetail) {
        throw new ErrorDTODataResponse({
          reasonStatusCode: EnumMessageStatus.NOT_FOUND_404,
          statusCode: 404,
          message: 'Account Not Found !!!',
        });
      }

      const returnAccountDetail = {
        account_name: accountDetail.name,
        account_email: accountDetail.email,
        account_phone_number: accountDetail.phone_number,
        account_address: accountDetail.address,
        account_avatar: accountDetail.avatar_url,
        account_role: accountDetail.role_list,
      };

      // console.log('show accountDetail ===>', { accountDetail });

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: {
          accountDetail: { ...returnAccountDetail, accountId: accountId },
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Get Account Detail Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        message: (error as Error).message,
        statusCode: 400,
        reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
      });
    }
  };

  //=====================================================================
  // create new account
  static createNewAccount = async ({
    account_name,
    account_email,
    account_phone_number,
    accountAvatarPath,
    accountAvatarFieldName,
    account_role,
    account_address,
  }: {
    account_name: string;
    account_email: number;
    account_phone_number: number;
    accountAvatarPath: string;
    account_address: string;
    accountAvatarFieldName: string;
    account_role: string[];
  }) => {
    try {
      let result;

      if (accountAvatarPath && accountAvatarFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(accountAvatarPath, {
          folder: accountAvatarFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${accountAvatarFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(accountAvatarPath);
      }

      const generate_nanoid = nanoid(8);

      const newAccount = await UserModel.create({
        name: account_name,
        email: account_email,
        password: generate_nanoid,
        phone_number: account_phone_number,
        avatar_url: result,
        address: account_address,
        role_list: account_role,
      });

      const newReturnAccount = {
        ...newAccount,
        accountId: String(newAccount._id),
      };

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          newReturnAccount,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Create new account successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: (error as Error).message || 'Create new account fail !!!',
        reasonStatusCode: EnumReasonStatusCode.BAD_REQUEST,
      });
    }
  };

  //=====================================================================
  // update account
  static updateAccount = async ({
    account_name,
    account_email,
    account_phone_number,
    accountAvatarPath,
    accountAvatarFieldName,
    account_role,
    account_address,
    account_avatar,
    accountId,
  }: {
    account_name: string;
    account_email: string;
    account_phone_number: string;
    account_avatar: string;
    account_address: string;
    accountId: string;
    accountAvatarPath: string;
    accountAvatarFieldName: string;
    account_role: string[];
  }) => {
    try {
      const account = await UserModel.findOne({
        _id: new Types.ObjectId(accountId),
      });

      if (!account) {
        throw new ErrorDTODataResponse({
          message: 'Account not found !!!',
          statusCode: 400,
          reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
        });
      }

      let result;

      if (accountAvatarPath && accountAvatarFieldName) {
        const suffix_folder = '_cloudinary_upload';

        result = await cloudinary.uploader.upload(accountAvatarPath, {
          folder: accountAvatarFieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
          public_id: `${accountAvatarFieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
          resource_type: 'auto',
        });

        // Xóa file tạm sau khi upload xong
        fs.unlinkSync(accountAvatarPath);
      }

      account.name = account_name ? account_name : account.name;
      account.email = account_email ? account_email : account.email;
      account.phone_number = account_phone_number ? account_phone_number : account.phone_number;
      account.avatar_url = result?.secure_url || (account_avatar ? account_avatar : account.avatar_url) || '';
      account.address = account_address ? account_address : account.address;

      account.role_list = account_role && account_role.length > 0 ? account_role : account.role_list;

      account.save();

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          account,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Update Account Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Update Account Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  //=====================================================================
  // delete account
  static deleteAccount = async ({ accountId }: { accountId: string }) => {
    try {
      const deletedAccount = await UserModel.findByIdAndDelete({
        _id: new Types.ObjectId(accountId),
      });

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          deletedAccount,
        },
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Delete Account Successfully !!!',
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message: (error as Error).message || 'Delete Account Fail !!!',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default AccountService;
