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
import NodeMailerService from './nodemailerMail.service';
import { Types } from 'mongoose';

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
    user: {
      userId: string;
      email: string;
      name: string;
      roles: string[];
      address: string;
      avatar_url: string;
      phone_number: string;
      status: boolean;
      verified: boolean;
    };
  }) => {
    const {
      userId,
      email,
      name,
      roles,
      address,
      avatar_url,
      phone_number,
      status,
      verified,
    } = user;

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
      payload: {
        userId,
        email,
        name,
        roles,
        address,
        avatar_url,
        phone_number,
        status,
        verified,
      },
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
          fields: [
            'userId',
            'name',
            'email',
            'roles',
            'address',
            'avatar_url',
            'phone_number',
            'status',
            'verified',
          ],
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
          avatar_url: foundUser.avatar_url,
          address: foundUser.address,
          phone_number: foundUser.phone_number,
          status: foundUser.status,
          verified: foundUser.verified,
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
            address: (payload as JwtPayload)?.address,
            avatar_url: (payload as JwtPayload)?.avatar_url,
            phone_number: (payload as JwtPayload)?.phone_number,
            status: (payload as JwtPayload)?.status,
            verified: (payload as JwtPayload)?.verified,
          },
          tokens,
          roles: DEFAULT_ROLE,
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

    const {
      _id,
      name,
      roles,
      avatar_url,
      address,
      phone_number,
      status,
      verified,
    } = foundUser;
    const userId = String(_id);

    const privateKey = crypto.randomBytes(32).toString('hex');
    const publicKey = crypto.randomBytes(32).toString('hex');

    const tokens = await createTokenPair({
      payload: {
        userId: userId,
        email,
        name,
        roles,
        avatar_url,
        address,
        phone_number,
        status,
        verified,
      },
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
          fields: [
            'userId',
            'name',
            'email',
            'roles',
            'address',
            'avatar_url',
            'phone_number',
            'status',
            'verified',
          ],
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
    phone_number,
  }: {
    email: string;
    name: string;
    password: string;
    address: string;
    phone_number: string;
  }) => {
    const holderUser = await UserModel.findOne({ email }).lean();

    if (holderUser) {
      throw new ErrorDTODataResponse({
        statusCode: 401,
        message: 'Existed User !!!',
        reasonStatusCode: EnumReasonStatusCode.EXISTED_USER,
      });
    }

    // const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      email,
      name,
      address,
      phone_number,
      password: password,
      roles: DEFAULT_ROLE,
      avatar_url: '',
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
        payload: {
          userId,
          email,
          name,
          roles: newUser.roles,
          address,
          avatar_url: newUser.avatar_url,
          phone_number,
          status: newUser.status,
          verified: newUser.verified,
        },
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
            fields: [
              'userId',
              'name',
              'email',
              'roles',
              'address',
              'avatar_url',
              'phone_number',
              'status',
              'verified',
            ],
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

  //=====================================================================
  // verify to reset password
  static verifyToResetPassword = async ({
    resetPasswordToken,
  }: {
    resetPasswordToken: string;
  }) => {
    // Mã hóa token từ người dùng
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordToken)
      .digest('hex');

    // Kiểm tra token trong cơ sở dữ liệu
    const user = await UserModel.findOne({
      resetToken: hashedToken,
      resetTokenExpiration: { $gt: Date.now() }, // Token còn hạn
    });

    if (!user) {
      throw new ErrorDTODataResponse({
        message: 'Invalid Or Expired Reset Password Token !!!',
        reasonStatusCode: EnumReasonStatusCode.INVALID_RESET_PASSWORD_TOKEN,
        statusCode: 401,
      });
    }

    // Tiếp tục xử lý reset mật khẩu
    return new SuccessDTODataResponse({
      statusCode: 200,
      metaData: {
        user: user,
      },
      message: 'Verify To Reset Password Successfully !!!',
      reasonStatusCode:
        EnumReasonStatusCode.VERIFY_TO_RESET_PASSWORD_SUCCESSFULLY,
    });
  };

  //=====================================================================
  // handle to reset password
  // Endpoint để người dùng reset mật khẩu

  static resetPassword = async ({
    resetPasswordToken,
    newPassword,
  }: {
    resetPasswordToken: string;
    newPassword: string;
  }) => {
    // Mã hóa token gửi lên từ người dùng
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordToken)
      .digest('hex');

    // Tìm kiếm người dùng với token và kiểm tra thời gian hết hạn
    const user = await UserModel.findOne({
      resetToken: hashedToken,
      resetTokenExpiration: { $gt: Date.now() }, // Token vẫn còn hiệu lực
    });

    if (!user) {
      throw new ErrorDTODataResponse({
        message: 'Invalid or expired reset token.',
        reasonStatusCode: EnumReasonStatusCode.INVALID_RESET_PASSWORD_TOKEN,
        statusCode: 401,
      });
    }

    // Token hợp lệ, tiếp tục xử lý thay đổi mật khẩu
    try {
      // Đổi mật khẩu người dùng
      user.password = newPassword; // Đảm bảo mã hóa mật khẩu trước khi lưu vào DB

      // Xóa token reset sau khi sử dụng để đảm bảo không bị lạm dụng
      user.resetToken = '';
      user.resetTokenExpiration = 0;

      await user.save();

      // Gửi email thông báo mật khẩu đã thay đổi
      await NodeMailerService.handleSendMail({
        emailTo: user.email,
        subject: 'Thay đổi mật khẩu thành công',
        content: `<p>Xin chào,</p>
<p>Mật khẩu của bạn đã được thay đổi thành công.</p>
<p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với bộ phận hỗ trợ để đảm bảo an toàn cho tài khoản của bạn.</p>
<p>Trân trọng,</p>
<p>Đội ngũ hỗ trợ Flower Shop</p>
`,
      });

      return new SuccessDTODataResponse({
        statusCode: 200,
        metaData: null,
        message: 'Reset Password Successfully !!!',
        reasonStatusCode: EnumReasonStatusCode.RESET_PASSWORD_SUCCESSFULLY,
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        message:
          (error as Error).message ||
          'An Error Occurred While Resetting Your Password !!!',
        reasonStatusCode: EnumReasonStatusCode.RESET_PASSWORD_ERROR,
        statusCode: 500,
      });
    }
  };

  //=====================================================================
  // handle to reset password
  // Endpoint để người dùng reset mật khẩu

  static changePassword = async ({
    userId,
    oldPassword,
    newPassword,
  }: {
    userId: string;
    oldPassword: string;
    newPassword: string;
  }) => {
    try {
      // Kiểm tra đầu vào
      if (!oldPassword || !newPassword) {
        throw new ErrorDTODataResponse({
          message: 'Old Password And New Password Are Required !!!',
          reasonStatusCode:
            EnumReasonStatusCode.OLD_PASSWORD_AND_NEW_PASSWORD_REQUIRED,
          statusCode: 400,
        });
      }

      // Tìm người dùng từ cơ sở dữ liệu
      const user = await UserModel.findOne({
        _id: new Types.ObjectId(userId),
        role: { $ne: EnumRole.GUEST },
      });

      if (!user) {
        throw new ErrorDTODataResponse({
          message: 'User Not Found !!!',
          reasonStatusCode: EnumReasonStatusCode.NOT_FOUND_USER_ID,
          statusCode: 404,
        });
      }

      // Kiểm tra mật khẩu cũ

      const isMatchPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isMatchPassword) {
        throw new ErrorDTODataResponse({
          statusCode: 401,
          message: 'Old Password Is Incorrect.',
          reasonStatusCode: EnumReasonStatusCode.INVALID_PASSWORD,
        });
      }

      // Hash mật khẩu mới
      // const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Cập nhật mật khẩu
      user.password = newPassword;
      await user.save();

      await NodeMailerService.handleSendMail({
        emailTo: user.email,
        subject: 'Thay đổi mật khẩu thành công',
        content: `<p>Xin chào,</p>
<p>Mật khẩu của bạn đã được thay đổi thành công.</p>
<p>Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với bộ phận hỗ trợ để đảm bảo an toàn cho tài khoản của bạn.</p>
<p>Trân trọng,</p>
<p>Đội ngũ hỗ trợ Flower Shop</p>
`,
      });

      // Phản hồi thành công
      return new SuccessDTODataResponse({
        statusCode: 200,
        message: 'Password Updated Successfully.',
        metaData: { user },
        reasonStatusCode: EnumReasonStatusCode.UPDATED_SUCCESSFULLY,
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        message:
          (error as Error).message ||
          'An Error Occurred While Updating Your Password.',
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };

  //=====================================================================
  // post email to reset password
  // Endpoint để người dùng reset mật khẩu
  static postEmailToResetPassword = async ({
    emailTo,
  }: {
    emailTo: string;
  }) => {
    try {
      // Kiểm tra người dùng
      const user = await UserModel.findOne({ email: emailTo });

      if (!user) {
        // Luôn trả thông báo thành công để tránh lộ thông tin

        return new SuccessDTODataResponse({
          message:
            'If This Email Exists, You Will Receive A Reset Link Shortly !!!',
          statusCode: 200,
          reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
          metaData: { emailTo },
        });
      }

      if (user) {
        const now = Date.now();

        // Reset lại đếm nếu quá 1 giờ từ yêu cầu trước
        if (
          user.lastResetRequest &&
          now - user.lastResetRequest.getTime() > 3600000
        ) {
          user.resetAttempts = 0;
        }

        if (user.resetAttempts >= 3) {
          throw new ErrorDTODataResponse({
            message: 'Too Many Reset Attempts. Please Try Again Later !!!',
            statusCode: 429,
            reasonStatusCode: EnumReasonStatusCode.TOO_MANY_RESET_ATTEMPTS,
          });
        }

        user.resetAttempts += 1;
        user.lastResetRequest = new Date();
        await user.save();
      }

      // Tạo token reset
      const buffer = await new Promise<Buffer>((resolve, reject) => {
        crypto.randomBytes(32, (err, buf) => {
          if (err) return reject(err);
          resolve(buf);
        });
      });

      const token = buffer.toString('hex');
      // Tạo token và mã hóa
      // const token = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      // Lưu token và thời gian hết hạn
      user.resetToken = hashedToken;
      user.resetTokenExpiration = Date.now() + 3600000; // 1 giờ
      await user.save();

      // Gửi email
      await NodeMailerService.handleSendMail({
        emailTo: emailTo,
        subject: 'Đặt lại Mật khẩu',
        content: `<p>Xin chào,</p>
<p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
<p>Vui lòng nhấn vào liên kết bên dưới để đặt lại mật khẩu:</p>
<a href="http://localhost:3000/reset/${token}">Đặt lại mật khẩu</a>
<p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với bộ phận hỗ trợ của chúng tôi.</p>
<p>Trân trọng,</p>
<p>Đội ngũ hỗ trợ Flower Shop</p>
<p><a href="http://localhost:3000/support">Liên hệ hỗ trợ</a></p><p>Lưu ý: Liên kết này chỉ có hiệu lực trong vòng 1 giờ. Vui lòng đặt lại mật khẩu trước khi liên kết hết hạn.</p>

`,
      });

      return new SuccessDTODataResponse({
        message: 'Email Sent Successfully !!!',
        statusCode: 200,
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        metaData: {
          user: user,
        },
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        message: (error as Error).message || 'Email Sent Failed !!!',
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export default AccessService;
