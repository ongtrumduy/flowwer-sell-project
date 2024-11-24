import express from 'express';

import { asyncHandler } from '@helpers/asyncHandler';
import { uploadSingleImageMulter } from '@root/src/configs/config.multer';
import AdminTypeProductController from '@root/src/controllers/admin/typeproduct.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// get all typeProduct
// query params: limit, page, priceMin, priceMax, searchName, selectedTypeProduct
router.get('/all', asyncHandler(AdminTypeProductController.getAllTypeProductList));

// get typeProduct detail
// params: typeProductId
router.get('/:typeProductId', asyncHandler(AdminTypeProductController.getTypeProductItemDetail));

// create new typeProduct
router.post('/create', uploadSingleImageMulter({ fieldName: 'type_product_image' }), asyncHandler(AdminTypeProductController.createNewTypeProduct));

router.put('/update/:typeProductId', uploadSingleImageMulter({ fieldName: 'type_product_image' }), asyncHandler(AdminTypeProductController.updateTypeProduct));

router.delete('/delete', asyncHandler(AdminTypeProductController.deleteTypeProduct));

export default router;
