import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import OrderController from '@root/src/controllers/order.controller';
import CartController from '@root/src/controllers/cart.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// =================================================================================
router.use(asyncHandler(authenticationV2));

router.use(asyncHandler(CartController.createNewCartAndGetCartForUser));

// =================================================================================
// get all product in cart list
// query params: limit, page, priceMin, priceMax, searchName, selectedCategory
router.post('/create', asyncHandler(OrderController.createOrderForCustomer));

router.get(
  '/get/information/payment/:orderId',
  asyncHandler(OrderController.getOrderInformationToPayment)
);

// =================================================================================
router.post(
  '/update/success/payment',
  asyncHandler(OrderController.updatePaymentSuccessOrder)
);

router.get(
  '/get/detail/:orderId',
  asyncHandler(OrderController.getDetailOfOrder)
);

router.get(
  '/get/all/customer',
  asyncHandler(OrderController.getAllOrderOfCustomerList)
);

router.delete(
  '/destroy/item/:orderId',
  asyncHandler(OrderController.destroyOrderItem)
);

export default router;
