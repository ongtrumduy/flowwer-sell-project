import express from 'express';

import AccessController from '@root/src/controllers/access.controller';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadUserAvatarMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';
import OverviewController from '@root/src/controllers/overview.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));
// ==================================================
router.use(asyncHandler(UserController.checkHaveRoleUserAdminOrEmployee));

// create new user
router.get('/information', asyncHandler(OverviewController.overviewDashboardCountInformation));

// create new user
router.get('/get/month/orders', asyncHandler(OverviewController.getOrdersByMonth));

// create new user
router.get('/get/month/revenues', asyncHandler(OverviewController.getRevenueByMonth));

// create new user
router.get('/get/month/users', asyncHandler(OverviewController.getUsersByMonth));

export default router;
