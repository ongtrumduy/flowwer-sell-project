import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import UserController from '@root/src/controllers/user.controller';
import categoryRouter from '@root/src/routes/admin/category';
import orderRouter from '@root/src/routes/admin/order';
import productRouter from '@root/src/routes/admin/product';
import typeProductRouter from '@root/src/routes/admin/type_product';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));
// ==================================================
router.use(asyncHandler(UserController.checkHaveRoleUserAdmin));
// ==================================================
// ==================================================

router.use('/category', categoryRouter);

router.use('/order', orderRouter);

router.use('/product', productRouter);

router.use('/type/product', typeProductRouter);

export default router;
