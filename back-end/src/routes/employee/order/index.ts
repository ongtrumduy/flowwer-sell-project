import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadSingleImageMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';
import EmployeeOrderController from '@root/src/controllers/employee/order.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// get all category
// query params: limit, page, priceMin, priceMax, searchName, selectedOrder
router.get('/all', asyncHandler(EmployeeOrderController.getAllOrderList));

// get category detail
// params: categoryId
router.get('/:categoryId', asyncHandler(EmployeeOrderController.getOrderItemDetail));

// create new category
router.post('/create', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(EmployeeOrderController.createNewOrder));

router.put('/update/:categoryId', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(EmployeeOrderController.updateOrder));

router.delete('/delete', asyncHandler(EmployeeOrderController.deleteOrder));

router.get('/shipper/list', asyncHandler(EmployeeOrderController.getShipperDataList));

router.post('/shipper/assign', asyncHandler(EmployeeOrderController.assignShipperToDeliver));

export default router;
