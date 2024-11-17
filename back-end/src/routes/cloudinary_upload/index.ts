import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import CloudinaryUploadController from '@root/src/controllers/cloudinaryupload.controller';
import { uploadAvatarMulter } from '@root/src/configs/config.multer';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// const upload = multer({ dest: 'multer_image_uploads/' });

// const myMiddleware = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   upload.single('file')(req, res, (err: any) => {
//     console.log('req, res, in multer:', { req, res, err });

//     if (err) {
//       console.error('Error in multer:', err);
//       return res
//         .status(500)
//         .json({ error: 'Multer error', details: err.message });
//     }
//     // After file upload success, call `next()` to pass control to the next handler
//     next();
//   });
// };

// =================================================================================
router.use(asyncHandler(authenticationV2));

// router.use(
//   asyncHandler((req: Request, res: Response, next: NextFunction) => {
//     upload.single('file')(req, res, (err: { message: any }) => {
//       console.log('10 err =============================>', {
//         body: req.body,
//         files: req.files,
//         file: req.file,
//       });
//       if (err) {
//         console.error('Error in multer:', err);
//         return res
//           .status(500)
//           .json({ error: 'Multer error', details: err.message });
//       }
//       next();
//     });
//   })
// );
// =================================================================================
// config for stripe payment
router.post(
  '/avatar/upload',
  uploadAvatarMulter,
  // upload.single('image'),
  asyncHandler(CloudinaryUploadController.uploadProfileAvatarImage)
);

export default router;

// https://console.cloudinary.com/pm/c-f342d4bbf48817a29751ee4dc11f0e/getting-started
