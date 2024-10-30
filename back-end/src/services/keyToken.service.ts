import KeyTokenModel from '@models/keyToken.model';
import { Types } from 'mongoose';
import ErrorResponse from '../core/error.response';
import { EnumMessageStatus } from '../utils/type';

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: {
    userId: string;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
  }) => {
    try {
      const filter = { userId: new Types.ObjectId(userId) },
        update = {
          userId,
          publicKey: publicKey,
          privateKey: privateKey,
          refreshToken: refreshToken,
          refreshTokenUsed: [],
        },
        options = {
          // insert if not exist and update if exist
          upsert: true,
          new: true,
        };

      const tokens = await KeyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      // console.log('error 38 ===>', error);
      // return error;

      throw new ErrorResponse({
        statusCode: 401,
        message: String(error),
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  };

  static findKeyTokenByUserId = async (userId: string) => {
    try {
      const keyStore = await KeyTokenModel.findOne({
        userId: new Types.ObjectId(userId),
      });

      return keyStore;
    } catch (error) {
      // return error;

      throw new ErrorResponse({
        statusCode: 401,
        message: String(error),
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  };

  static removeTokenById = async ({ id }: { id: string }) => {
    try {
      const result = await KeyTokenModel.deleteOne({ _id: id });

      return result;
    } catch (error) {
      // return error;
      throw new ErrorResponse({
        statusCode: 401,
        message: String(error),
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  };

  static findByRefreshTokenUsed = async ({
    refreshToken,
  }: {
    refreshToken: string;
  }) => {
    try {
      const refreshTokenUsed = await KeyTokenModel.findOne({
        refreshTokenUsed: { $in: [refreshToken] },
      });

      return refreshTokenUsed;
    } catch (error) {
      // return error;
      throw new ErrorResponse({
        statusCode: 401,
        message: String(error),
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  };

  static findByRefreshToken = async ({
    refreshToken,
  }: {
    refreshToken: string;
  }) => {
    try {
      const refreshTokenReturn = await KeyTokenModel.findOne({ refreshToken });

      return refreshTokenReturn;
    } catch (error) {
      // return error;
      throw new ErrorResponse({
        statusCode: 401,
        message: String(error),
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  };

  static deleteKeyTokenByUserId = async ({ userId }: { userId: string }) => {
    try {
      const deleteKeyTokenByUserId = await KeyTokenModel.findOneAndDelete({
        user: userId,
      });

      return deleteKeyTokenByUserId;
    } catch (error) {
      // return error;
      throw new ErrorResponse({
        statusCode: 401,
        message: String(error),
        reasonStatusCode: EnumMessageStatus.UNAUTHORIZED_401,
      });
    }
  };
}

export default KeyTokenService;
