import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import { uploadSingleImageMulter } from '@root/src/configs/config.multer';
import UserController from '@root/src/controllers/user.controller';
import ShipperOrderController from '@root/src/controllers/shipper/order.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// get all category
// query params: limit, page, priceMin, priceMax, searchName, selectedOrder
router.get('/all', asyncHandler(ShipperOrderController.getAllOrderList));

// get category detail
// params: categoryId
router.get('/:categoryId', asyncHandler(ShipperOrderController.getOrderItemDetail));

// create new category
router.post('/create', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(ShipperOrderController.createNewOrder));

router.put('/update/:categoryId', uploadSingleImageMulter({ fieldName: 'category_image' }), asyncHandler(ShipperOrderController.updateOrder));

router.delete('/delete', asyncHandler(ShipperOrderController.deleteOrder));

router.get('/get/all/shipper', asyncHandler(ShipperOrderController.getAllOrderOfShipperList));

router.post('/change/status', asyncHandler(ShipperOrderController.changeStatusOfOrderOfShipper));

router.get('/get/detail/:orderId', asyncHandler(ShipperOrderController.getDetailOfOrder));

export default router;
