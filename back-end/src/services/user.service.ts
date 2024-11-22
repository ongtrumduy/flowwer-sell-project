import UserModel from '@models/user.model';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import { nanoid } from 'nanoid';
import cloudinaryConfig from '../configs/config.cloudinary';
import ErrorDTODataResponse from '../core/error.dto.response';
import SuccessDTODataResponse from '../core/success.dto.response';
import { EnumGender, EnumMessageStatus, EnumReasonStatusCode, EnumRole } from '../utils/type';
import { Types } from 'mongoose';
const cloudinary = cloudinaryConfig();
const suffix_folder = '_cloudinary_upload';

class UserService {
  // =========================================================================
  // find user information by email
  static findUserInformationByEmail = async ({
    email = '',
    select = {
      email: 1,
      password: 1,
      name: 1,
      phone: 1,
      address: 1,
      role_list: 1,
      avatar_url: 1,
      phone_number: 1,
      status: 1,
      verified: 1,
    },
  }) => {
    try {
      const userInformation = await UserModel.findOne({ email }).select(select).lean();

      return new SuccessDTODataResponse({
        statusCode: 201,
        reasonStatusCode: EnumReasonStatusCode.CREATED_201,
        message: 'Find User Information Successfully !!!',
        metaData: {
          userInformation: userInformation,
        },
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 400,
        message: (error as Error).message,
        reasonStatusCode: EnumMessageStatus.BAD_REQUEST_400,
      });
    }
  };

  // =========================================================================
  // ensure admin account exists
  static ensureAdminAccountExists = async () => {
    const existingAdmin = await UserModel.findOne({ role: 'admin' });
    let adminAccount = null;
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('yourAdminPassword', 10);
      adminAccount = new UserModel({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
      });

      await adminAccount.save();
      console.log('Admin account created.');
    }

    return new SuccessDTODataResponse({
      statusCode: 201,
      reasonStatusCode: EnumReasonStatusCode.CREATED_201,
      message: 'Create Admin successfully!!!',
      metaData: {
        adminAccount: adminAccount,
      },
    });
  };

  // =========================================================================
  // upload single image cloudinary
  static uploadSingleImage = async ({ imagePath, fieldName }: { imagePath: string; fieldName: string }) => {
    try {
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: fieldName + suffix_folder, // Đặt tên thư mục trên Cloudinary
        public_id: `${fieldName}_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
        resource_type: 'auto',
      });

      // Xóa file tạm sau khi upload xong
      fs.unlinkSync(imagePath);

      // Trả về URL của ảnh đã upload
      return new SuccessDTODataResponse({
        statusCode: 200,
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Upload successfully!!!',
        metaData: {
          imageUrl: result.secure_url,
        },
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message || 'Upload failed!!!',
      });
    }
  };

  // =========================================================================
  // change information
  static changeInformation = async ({
    userId,
    phone_number,
    address,
    name,
    gender,
    birth_date,
  }: {
    userId: string;
    phone_number: string;
    address: string;
    name: string;
    gender: EnumGender;
    birth_date: Date;
  }) => {
    try {
      const user = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        {
          phone_number,
          address,
          name,
          gender,
          birth_date,
        },
        { new: true }
      );

      // Trả về URL của ảnh đã upload
      return new SuccessDTODataResponse({
        statusCode: 200,
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Update Information successfully!!!',
        metaData: { user },
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message || 'Update Information failed!!!',
      });
    }
  };

  // =========================================================================
  // upload single image cloudinary
  static createNewUser = async ({
    phone_number,
    address,
    name,
    gender,
    birth_date,
    email,
    password,
    role_list,
  }: {
    phone_number: string;
    address: string;
    name: string;
    gender: EnumGender;
    birth_date: Date;
    email: string;
    password: string;
    role_list: EnumRole[];
  }) => {
    try {
      const user = await UserModel.create([
        {
          phone_number,
          address,
          name,
          gender,
          birth_date,
          email,
          password,
          role_list,
        },
      ]);

      // Trả về URL của ảnh đã upload
      return new SuccessDTODataResponse({
        statusCode: 200,
        reasonStatusCode: EnumReasonStatusCode.SUCCESS_200,
        message: 'Update Information successfully!!!',
        metaData: { user },
      });
    } catch (error) {
      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message || 'Update Information failed!!!',
      });
    }
  };
}

export default UserService;
