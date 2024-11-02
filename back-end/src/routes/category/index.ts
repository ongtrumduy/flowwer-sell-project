import express from 'express';

import CategoryController from '@root/src/controllers/category.controller';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';

const router = express.Router();

// get all category
// query params: limit, page
router.get('/all', asyncHandler(CategoryController.getAllCategoryList));

// get category detail
// params: categoryId
router.get(
  '/:categoryId',
  asyncHandler(CategoryController.getCategoryItemDetail)
);

// search category
// query params: key_search
router.get('/search', asyncHandler(CategoryController.findListSearchCategory));

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(authenticationV2);
// ==================================================

// create new category
router.post('/create', asyncHandler(CategoryController.createNewCategory));

// update category
router.patch(
  '/update/:categoryId',
  asyncHandler(CategoryController.updateCategory)
);

export default router;
