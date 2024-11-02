import express from 'express';

import ProductController from '@root/src/controllers/product.controller';

import { asyncHandler } from '@helpers/asyncHandler';
import { authentication, authenticationV2 } from '@auth/authUtils';

const router = express.Router();

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
router.use(authenticationV2);
// ==================================================

// create new product
router.post('/create', asyncHandler(ProductController.createNewProduct));

// update product
router.patch(
  '/update/:productId',
  asyncHandler(ProductController.updateProduct)
);

export default router;
