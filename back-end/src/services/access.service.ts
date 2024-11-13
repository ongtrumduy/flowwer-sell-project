import UserModel from '@models/user.model';

import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

import UserService from '@services/user.service';
import KeyTokenService from '@services/keyToken.service';

import { createTokenPair, verifyJWTByRefreshToken } from '@auth/authUtils';

import { getInformationData } from '@utils/index';
import {
  EnumMessageStatus,
  EnumReasonStatusCode,
  EnumRole,
} from '@root/src/utils/type';

import { JwtPayload } from 'jsonwebtoken';
import ErrorDTODataResponse from '@root/src/core/error.dto.response';
import { DEFAULT_ROLE, DEFAULT_ROLE_LIST } from '../utils/constant';
import SuccessDTODataResponse from '../core/success.dto.response';

class AccessService {
  //=====================================================================
  // handle refresh token version 2
  static handlerRefreshTokenV2 = async ({
    refreshToken,
    keyStore,
    user,
  }: {
    refreshToken: string;
    keyStore: any;
    user: { userId: string; email: string; name: string; roles: string[] };
  }) => {
    const { userId, email, name, roles } = user;

    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyTokenByUserId({
        userId,
      });

      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Refresh Token Used !!!',
        reasonStatusCode: EnumReasonStatusCode.REFRESH_TOKEN_USED,
      });
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Invalid Refresh Token !!!',
        reasonStatusCode: EnumReasonStatusCode.INVALID_REFRESH_TOKEN,
      });
    }

    const foundUser = await UserService.findUserInformationByEmail({ email });

    if (!foundUser) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Not Found User !!!',
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER,
      });
    }

    const tokens = await createTokenPair({
      payload: { userId, email, name, roles },
      publicKey: keyStore.publicKey,
      privateKey: keyStore.privateKey,
    });

    if (!tokens) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Create token pair failed !!!',
        reasonStatusCode: EnumReasonStatusCode.CREATE_TOKEN_PAIR_FAILED,
      });
    }

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return new SuccessDTODataResponse({
      statusCode: 201,
      metaData: {
        user: getInformationData({
          fields: ['userId', 'name', 'email', 'roles', 'address'],
          object: { ...user },
        }),
        tokens,
        roles: DEFAULT_ROLE,
      },
      reasonStatusCode: EnumReasonStatusCode.CREATED_SUCCESSFULLY,
      message: 'Refresh Token Successfully !!!',
    });
  };

  //=====================================================================
  // handle refresh token
  static handlerRefreshToken = async ({
    refreshToken,
  }: {
    refreshToken: string;
  }) => {
    const foundUsedToken = await KeyTokenService.findByRefreshTokenUsed({
      refreshToken,
    });

    if (foundUsedToken) {
      const payload = await verifyJWTByRefreshToken({
        refreshToken,
        keySecret: foundUsedToken.privateKey,
      });

      // console.log(`{ userId, email } =====> 88`, { payload });

      await KeyTokenService.deleteKeyTokenByUserId({
        userId: (payload as JwtPayload)?.userId,
      });

      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Refresh Token Used !!!',
        reasonStatusCode: EnumReasonStatusCode.REFRESH_TOKEN_USED,
      });
    }

    if (!foundUsedToken) {
      const holderToken = await KeyTokenService.findByRefreshToken({
        refreshToken,
      });

      if (!holderToken) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          message: 'Invalid Refresh Token !!!',
          reasonStatusCode: EnumReasonStatusCode.INVALID_REFRESH_TOKEN,
        });
      }

      const payload = await verifyJWTByRefreshToken({
        refreshToken,
        keySecret: holderToken.privateKey,
      });

      if (!payload) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          message: 'Invalid Refresh Token !!!',
          reasonStatusCode: EnumReasonStatusCode.INVALID_REFRESH_TOKEN,
        });
      }

      const foundUser = await UserService.findUserInformationByEmail({
        email: (payload as JwtPayload)?.email,
      });

      if (!foundUser) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          message: 'Not Found User !!!',
          reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER,
        });
      }

      const userId = String(foundUser._id);

      const tokens = await createTokenPair({
        payload: {
          userId,
          email: foundUser.email,
          name: foundUser.name,
          roles: foundUser.roles,
        },
        publicKey: holderToken.publicKey,
        privateKey: holderToken.privateKey,
      });

      if (!tokens) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          message: 'Create Token Pair Failed !!!',
          reasonStatusCode: EnumReasonStatusCode.CREATE_TOKEN_PAIR_FAILED,
        });
      }

      await holderToken.updateOne({
        $set: {
          refreshToken: tokens.refreshToken,
        },
        $addToSet: {
          refreshTokenUsed: refreshToken,
        },
      });

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          user: {
            userId: (payload as JwtPayload)?.userId,
            email: (payload as JwtPayload)?.email,
            name: (payload as JwtPayload)?.name,
            roles: (payload as JwtPayload)?.roles,
          },
          tokens,
        },
        message: 'Refresh Token Successfully !!!',
        reasonStatusCode: EnumReasonStatusCode.CREATED_SUCCESSFULLY,
      });
    }
  };

  //=====================================================================
  // login
  static login = async ({
    email,
    password,
    refreshToken = null,
  }: {
    email: string;
    password: string;
    refreshToken?: string | null;
  }) => {
    const foundUser = await UserService.findUserInformationByEmail({ email });

    if (!foundUser) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Not Found User !!!',
        reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER,
      });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Invalid Password !!!',
        reasonStatusCode: EnumReasonStatusCode.INVALID_PASSWORD,
      });
    }

    const { _id, name, roles } = foundUser;
    const userId = String(_id);

    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.randomBytes(32).toString('hex');

    const tokens = await createTokenPair({
      payload: { userId: userId, email, name, roles },
      publicKey,
      privateKey,
    });

    if (!tokens) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Create Token Pair Failed !!!',
        reasonStatusCode: EnumReasonStatusCode.CREATE_TOKEN_PAIR_FAILED,
      });
    }

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        user: getInformationData({
          fields: ['userId', 'name', 'email', 'roles', 'address'],
          object: { ...foundUser, userId },
        }),
        tokens,
        roleList: DEFAULT_ROLE_LIST,
      },
      message: 'Login Successfully !!!',
      reasonStatusCode: EnumReasonStatusCode.LOGIN_SUCCESSFULLY,
    });
  };

  //=====================================================================
  // logout
  static logout = async ({ keyStore }: { keyStore: any }) => {
    const delKey = await KeyTokenService.removeTokenById({
      id: keyStore._id,
    });

    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: { delKey },
      message: 'Logout Successfully !!!',
      reasonStatusCode: EnumReasonStatusCode.LOGOUT_SUCCESSFULLY,
    });
  };

  //=====================================================================
  // sign up
  static signUp = async ({
    email,
    name,
    password,
    address,
    phoneNumber,
  }: {
    email: string;
    name: string;
    password: string;
    address: string;
    phoneNumber: string;
  }) => {
    const holderUser = await UserModel.findOne({ email }).lean();

    if (holderUser) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Existed User !!!',
        reasonStatusCode: EnumReasonStatusCode.EXISTED_USER,
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      name,
      address,
      phoneNumber,
      password: passwordHash,
      roles: DEFAULT_ROLE,
    });

    if (newUser) {
      const privateKey = crypto.randomBytes(32).toString('hex');
      const publicKey = crypto.randomBytes(32).toString('hex');

      const userId = String(newUser._id);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: userId,
        publicKey,
        privateKey,
        refreshToken: '',
      });

      if (!keyStore) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          message: 'Create Key Token Failed !!!',
          reasonStatusCode: EnumReasonStatusCode.CREATE_KEY_TOKEN_FAILED,
        });
      }

      const tokens = await createTokenPair({
        payload: { userId, email, name, roles: newUser.roles },
        publicKey,
        privateKey,
      });

      if (!tokens) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          message: 'Create Token Pair Failed !!!',
          reasonStatusCode: EnumReasonStatusCode.CREATE_TOKEN_PAIR_FAILED,
        });
      }

      return new SuccessDTODataResponse({
        statusCode: 201,
        metaData: {
          user: getInformationData({
            fields: ['userId', 'name', 'email', 'roles', 'address'],
            object: { ...newUser.toObject(), userId },
          }),
          tokens,
          roleList: DEFAULT_ROLE_LIST,
        },
        message: 'Sign Up Successfully !!!',
        reasonStatusCode: EnumReasonStatusCode.SIGN_UP_SUCCESSFULLY,
      });
    }

    return new SuccessDTODataResponse({
      statusCode: 201,
      metaData: null,
      message: 'Sign Up Successfully !!!',
      reasonStatusCode: EnumReasonStatusCode.SIGN_UP_SUCCESSFULLY,
    });
  };
}

export default AccessService;
