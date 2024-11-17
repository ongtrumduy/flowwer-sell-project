import cloudinaryConfig from '../configs/config.cloudinary';
import ErrorDTODataResponse from '../core/error.dto.response';
import SuccessDTODataResponse from '../core/success.dto.response';
import { EnumReasonStatusCode } from '../utils/type';
import fs from 'fs';
import { nanoid } from 'nanoid';

const cloudinary = cloudinaryConfig();

const suffix_folder = '_cloudinary_upload';

class CloudinaryUploadService {
  static uploadProfileAvatarImage = async ({
    imagePath,
  }: {
    imagePath: string;
  }) => {
    console.log('17 imagePath =============================>', { imagePath });
    try {
      // Upload file từ thư mục tạm thời lên Cloudinary
      const result = await cloudinary.uploader.upload(imagePath, {
        folder: 'avatar_image_uploads', // Đặt tên thư mục trên Cloudinary
        public_id: `avatar_image_${nanoid(8)}_${Date.now()}`, // Tên ảnh trên Cloudinary
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
      console.log('35 error =============================>', { error });

      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message || 'Upload failed!!!',
      });
    }
  };

  // =================================================================
  // upload single image cloudinary
  static uploadSingleImage = async ({
    imagePath,
    fieldName,
  }: {
    imagePath: string;
    fieldName: string;
  }) => {
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
      console.log('35 error =============================>', { error });

      throw new ErrorDTODataResponse({
        statusCode: 500,
        reasonStatusCode: EnumReasonStatusCode.INTERNAL_SERVER_ERROR,
        message: (error as Error).message || 'Upload failed!!!',
      });
    }
  };
}

export default CloudinaryUploadService;
