import fs from 'fs';
import multer from 'multer';
import path from 'path';

const storage = ({ folderName }: { folderName: string }) =>
  multer.diskStorage({
    destination: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, destination: string) => void
    ) => {
      const uploadDir = path.join(__dirname, folderName || 'multer_uploads');
      // Tạo thư mục multer_uploads nếu chưa tồn tại
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      // Chuyển file vào thư mục multer_uploads
      cb(null, uploadDir);
    },
    filename: (
      req: Express.Request,
      file: Express.Multer.File,
      cb: (error: Error | null, filename: string) => void
    ) => {
      // console.log('25 filename =============================>', { req, file });

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + '-' + file.originalname); // Đặt tên file
    },
  });

const uniqueSuffix = 'multer_uploads';

// Khởi tạo Multer với cấu hình đã định
// phải cùng tên với name cái đẩy lên
export const uploadAvatarMulter = multer({
  storage: storage({
    folderName: 'avatar_name' + uniqueSuffix,
  }),
}).single('avatar_name');

export const uploadUserAvatarMulter = multer({
  storage: storage({
    folderName: 'avatar_user_name' + uniqueSuffix,
  }),
}).single('avatar_user_name');

export const uploadProductMulter = multer({
  storage: storage({
    folderName: 'product_image' + uniqueSuffix,
  }),
}).single('product_image');

export const uploadSingleImageMulter = ({ fieldName }: { fieldName: string }) =>
  multer({
    storage: storage({
      folderName: fieldName + uniqueSuffix,
    }),
  }).single(fieldName);
