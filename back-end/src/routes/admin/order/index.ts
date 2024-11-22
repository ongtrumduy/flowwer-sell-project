import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadSingleImageMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';
import AdminOrderController from '@root/src/controllers/admin/order.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// get all category
// query params: limit, page, priceMin, priceMax, searchName, selectedOrder
router.get('/all', asyncHandler(AdminOrderController.getAllOrderList));

// get category detail
// params: categoryId
router.get('/:categoryId', asyncHandler(AdminOrderController.getOrderItemDetail));

// create new category
router.post('/create', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(AdminOrderController.createNewOrder));

router.put('/update/:categoryId', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(AdminOrderController.updateOrder));

router.delete('/delete', asyncHandler(AdminOrderController.deleteOrder));

router.get('/shipper/list', asyncHandler(AdminOrderController.getShipperDataList));

export default router;
