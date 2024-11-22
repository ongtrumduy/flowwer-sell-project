import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadSingleImageMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';
import AdminCategoryController from '@root/src/controllers/admin/category.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// get all category
// query params: limit, page, priceMin, priceMax, searchName, selectedCategory
router.get('/all', asyncHandler(AdminCategoryController.getAllCategoryList));

// get category detail
// params: categoryId
router.get('/:categoryId', asyncHandler(AdminCategoryController.getCategoryItemDetail));

// create new category
router.post('/create', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(AdminCategoryController.createNewCategory));

router.put('/update/:categoryId', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(AdminCategoryController.updateCategory));

router.delete('/delete', asyncHandler(AdminCategoryController.deleteCategory));

export default router;
