import express from 'express';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';
import OrderController from '@root/src/controllers/order.controller';
import StripePaymentController from '@root/src/controllers/stripepayment.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// =================================================================================
router.use(asyncHandler(authenticationV2));

// =================================================================================
// config for stripe payment
router.get(
  '/config',
  asyncHandler(StripePaymentController.configForStripePayment)
);

// =================================================================================
// create payment intent
router.post(
  '/create/payment',
  asyncHandler(StripePaymentController.createPaymentIntent)
);

export default router;

// https://dashboard.stripe.com/test/apikeys
// https://docs.stripe.com/testing
