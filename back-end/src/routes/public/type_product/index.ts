import { authenticationV2 } from '@root/src/auth/authUtils';
import TypeProductController from '@root/src/controllers/public/typeproduct.controller';
import UserController from '@root/src/controllers/user.controller';
import { asyncHandler } from '@root/src/helpers/asyncHandler';
import express from 'express';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// get all typeProduct
// query params: limit, page
router.get('/all', asyncHandler(TypeProductController.getAllTypeProductList));

// get typeProduct detail
// params: typeProductId
router.get('/:typeProductId', asyncHandler(TypeProductController.getTypeProductItemDetail));

// search typeProduct
// query params: key_search
router.get('/search', asyncHandler(TypeProductController.findListSearchTypeProduct));

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));
// ==================================================
router.use(asyncHandler(UserController.checkHaveRoleUserPublic));

// create new typeProduct
router.post('/create', asyncHandler(TypeProductController.createNewTypeProduct));

// update typeProduct
router.patch('/update/:typeProductId', asyncHandler(TypeProductController.updateTypeProduct));

export default router;
