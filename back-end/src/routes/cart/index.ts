import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import CartController from '@root/src/controllers/cart.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// =================================================================================
router.use(asyncHandler(authenticationV2));

router.use(asyncHandler(CartController.createNewCartAndGetCartForUser));

// =================================================================================
// get all product in cart list
// query params: limit, page, priceMin, priceMax, searchName, selectedCategory
router.get('/all', asyncHandler(CartController.getAllProductInCartList));

// =================================================================================
// get all product in cart list
router.post('/add', asyncHandler(CartController.addProductInCartItemsV2));

// =================================================================================
// get all product in cart list
router.get(
  '/:productId',
  asyncHandler(CartController.getCartProductItemDetail)
);

// =================================================================================
// update quantity product in cart list
router.put(
  '/quantity/update',
  asyncHandler(CartController.updateQuantityProductInCartV2)
);

// =================================================================================
// delete product in cart item
router.delete(
  '/product/remove/:cartProductId',
  asyncHandler(CartController.deleteProductInCartItems)
);

export default router;
