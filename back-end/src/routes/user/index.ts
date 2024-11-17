import express from 'express';

import AccessController from '@root/src/controllers/access.controller';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadUserAvatarMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));
// ==================================================

// create new user
router.post('/create/new', asyncHandler(UserController.createNewUser));

// change user information
router.post(
  '/change/information',
  asyncHandler(UserController.changeInformation)
);

// change user avatar
router.post(
  '/change/avatar',
  uploadUserAvatarMulter,
  asyncHandler(UserController.changeAvatar)
);

// update all information
router.post(
  '/update/all/information',
  asyncHandler(AccessController.updateAllInformation)
);

// refresh token v2
router.post(
  '/delete/user',
  asyncHandler(AccessController.handlerRefreshTokenV2)
);

export default router;
