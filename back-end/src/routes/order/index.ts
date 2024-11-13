import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import OrderController from '@root/src/controllers/order.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// =================================================================================
router.use(asyncHandler(authenticationV2));

// =================================================================================
// get all product in cart list
// query params: limit, page, priceMin, priceMax, searchName, selectedCategory
router.post('/create', asyncHandler(OrderController.createOrderForCustomer));

export default router;
