import express from 'express';

import { apiKeys, permission } from '@auth/checkAuth';
import { EnumMessageStatus, EnumPermission } from '@root/src/utils/type';

import accessRouter from './access';
import productRouter from './product';
import userRouter from './user';

import categoryRouter from './category';
import cartRouter from './cart';
import orderRouter from './order';
import stripePaymentRouter from './stripe_payment';
import cloudinaryUploadRouter from './cloudinary_upload';

import apiKeyRouter from './api_key';
import { asyncHandler } from '../helpers/asyncHandler';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

//=================================================
// for generate api key
router.use('/v1/api/api-key', apiKeyRouter);
//=================================================

//=================================================
// check api keys
router.use(asyncHandler(apiKeys as any));
//=================================================

//=================================================
// check permission
// default permit all permissions
router.use(asyncHandler(permission(EnumPermission.ALL) as any));
//=================================================

//=================================================
// can use this
// router.use(apiKeys as any, permission(EnumPermission.ALL) as any);
//=================================================

//=================================================
// for test
router.get('/test', (req: any, res: any) => {
  return res.status(200).json({
    status: '200',
    error: EnumMessageStatus.SUCCESS_200,
    message: 'Success !!!',
  });
});
//=================================================

//=================================================
//=================================================

//=================================================
// for product
router.use('/v1/api/user', userRouter);
//=================================================

//=================================================
// for product
router.use('/v1/api/product', productRouter);
//=================================================

//=================================================
// for category
router.use('/v1/api/category', categoryRouter);
//=================================================

//=================================================
// for cart
router.use('/v1/api/cart', cartRouter);
//=================================================

//=================================================
// for order
router.use('/v1/api/order', orderRouter);
//=================================================

//=================================================
// for stripe payment
router.use('/v1/api/stripe_payment', stripePaymentRouter);
//=================================================

//=================================================
// for cloudinary upload image
router.use('/v1/api/cloudinary_upload', cloudinaryUploadRouter);
//=================================================

//=================================================
// put in last of routes because some routers of product do not need to check authentication
// for access
router.use('/v1/api/auth', accessRouter);
//=================================================

export default router;
