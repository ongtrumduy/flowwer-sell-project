import UserModel from '@models/user.model';

import bcrypt from 'bcrypt';
import crypto from 'node:crypto';

import UserService from '@services/user.service';
import KeyTokenService from '@services/keyToken.service';

import { createTokenPair, verifyJWT } from '@auth/authUtils';

import { getInformationData } from '@utils/index';
import { EnumMessageStatus, EnumRole } from '@root/src/utils/type';

import { JwtPayload } from 'jsonwebtoken';
import ErrorResponse from '@core/error.response';
import { DEFAULT_ROLE } from '../utils/constant';

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

      throw new ErrorResponse({
        statusCode: 403,
        message: 'Refresh token used !!!',
        reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
      });
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new ErrorResponse({
        statusCode: 403,
        message: 'Invalid refresh token',
        reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
      });
    }

    const foundUser = await UserService.findUserInformationByEmail({ email });

    if (!foundUser) {
      throw new ErrorResponse({
        statusCode: 403,
        message: 'User not found',
        reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
      });
    }

    const tokens = await createTokenPair({
      payload: { userId, email, name, roles },
      publicKey: keyStore.publicKey,
      privateKey: keyStore.privateKey,
    });

    if (!tokens) {
      throw new ErrorResponse({
        statusCode: 403,
        message: 'Create token pair failed',
        reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
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

    return {
      code: 201,
      metaData: {
        user: getInformationData({
          fields: ['userId', 'name', 'email', 'roles'],
          object: { ...user },
        }),
        tokens,
      },
      reasonStatusCode: EnumMessageStatus.CREATED_201,
    };
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
      const payload = await verifyJWT({
        token: refreshToken,
        keySecret: foundUsedToken.privateKey,
      });

      // console.log(`{ userId, email } =====> 88`, { payload });

      await KeyTokenService.deleteKeyTokenByUserId({
        userId: (payload as JwtPayload)?.userId,
      });

      throw new ErrorResponse({
        statusCode: 403,
        message: 'Refresh token used !!!',
        reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
      });
    }

    if (!foundUsedToken) {
      const holderToken = await KeyTokenService.findByRefreshToken({
        refreshToken,
      });

      // console.log('show holderToken =======> ', holderToken);

      if (!holderToken) {
        throw new ErrorResponse({
          statusCode: 403,
          message: 'Invalid refresh token',
          reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
        });
      }

      const payload = await verifyJWT({
        token: refreshToken,
        keySecret: holderToken.privateKey,
      });

      // console.log(`{ userId, email } =====> 88`, { payload });

      if (!payload) {
        throw new ErrorResponse({
          statusCode: 403,
          message: 'Invalid refresh token',
          reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
        });
      }

      const foundUser = await UserService.findUserInformationByEmail({
        email: (payload as JwtPayload)?.email,
      });

      if (!foundUser) {
        throw new ErrorResponse({
          statusCode: 403,
          message: 'User not found',
          reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
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
        throw new ErrorResponse({
          statusCode: 403,
          message: 'Create token pair failed',
          reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
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

      return {
        code: 201,
        metaData: {
          user: {
            userId: (payload as JwtPayload)?.userId,
            email: (payload as JwtPayload)?.email,
            name: (payload as JwtPayload)?.name,
            roles: (payload as JwtPayload)?.roles,
          },
          tokens,
        },
        reasonStatusCode: EnumMessageStatus.CREATED_201,
      };
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
      throw new ErrorResponse({
        statusCode: 401,
        message: 'User not found',
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);

    if (!isMatch) {
      throw new ErrorResponse({
        statusCode: 401,
        message: 'Invalid password',
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
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
      throw new ErrorResponse({
        statusCode: 403,
        message: 'Create token pair failed',
        reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
      });
    }

    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      code: 200,
      metaData: {
        user: getInformationData({
          fields: ['userId', 'name', 'email', 'roles'],
          object: { ...foundUser, userId },
        }),
        tokens,
      },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };

  //=====================================================================
  // logout
  static logout = async ({ keyStore }: { keyStore: any }) => {
    const delKey = await KeyTokenService.removeTokenById({
      id: keyStore._id,
    });

    return {
      code: 200,
      metaData: { delKey },
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
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
      throw new ErrorResponse({
        statusCode: 403,
        message: 'User already exists',
        reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
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
        throw new ErrorResponse({
          statusCode: 403,
          message: 'Create key token failed',
          reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
        });
      }

      const tokens = await createTokenPair({
        payload: { userId, email, name, roles: newUser.roles },
        publicKey,
        privateKey,
      });

      if (!tokens) {
        throw new ErrorResponse({
          statusCode: 403,
          message: 'Create token pair failed',
          reasonStatusCode: EnumMessageStatus.FORBIDDEN_403,
        });
      }

      return {
        code: 201,
        metaData: {
          user: getInformationData({
            fields: ['userId', 'name', 'email', 'roles'],
            object: { ...newUser.toObject(), userId },
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metaData: null,
      reasonStatusCode: EnumMessageStatus.SUCCESS_200,
    };
  };
}

export default AccessService;
