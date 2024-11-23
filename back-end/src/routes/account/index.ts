import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadSingleImageMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';
import AccountController from '@root/src/controllers/account.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));
// ==================================================
router.use(asyncHandler(UserController.checkHaveRoleUserAdmin));

// get all account
// query params: limit, page, priceMin, priceMax, searchName, selectedCategory
router.get('/all', asyncHandler(AccountController.getAllAccountList));

// get account detail
// params: accountId
router.get('/:accountId', asyncHandler(AccountController.getAccountItemDetail));

// create new account
router.post('/create', uploadSingleImageMulter({ fieldName: 'account_avatar' }), asyncHandler(AccountController.createNewAccount));

router.put('/update/:accountId', uploadSingleImageMulter({ fieldName: 'account_avatar' }), asyncHandler(AccountController.updateAccount));

router.delete('/delete', asyncHandler(AccountController.deleteAccount));

export default router;
