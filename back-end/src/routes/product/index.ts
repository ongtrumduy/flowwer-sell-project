import express from 'express';

import ProductController from '@root/src/controllers/product.controller';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadProductMulter, uploadSingleImageMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// get all product
// query params: limit, page, priceMin, priceMax, searchName, selectedCategory
router.get('/all', asyncHandler(ProductController.getAllProductList));

// get product detail
// params: productId
router.get('/:productId', asyncHandler(ProductController.getProductItemDetail));

// search product
// query params: key_search
router.get('/search', asyncHandler(ProductController.findListSearchProduct));

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));
// ==================================================
router.use(asyncHandler(UserController.checkHaveRoleUserAdminOrEmployee));

// create new product
router.post(
  '/create',
  // uploadSingleImageMulter({ fieldName: 'product_image' }),
  uploadProductMulter,
  asyncHandler(ProductController.createNewProduct)
);

router.put('/update/:productId', uploadSingleImageMulter({ fieldName: 'product_image' }), asyncHandler(ProductController.updateProduct));

router.delete('/delete', asyncHandler(ProductController.deleteProduct));

export default router;
