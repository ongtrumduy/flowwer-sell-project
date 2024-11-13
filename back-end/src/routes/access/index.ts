import express from 'express';

import AccessController from '@root/src/controllers/access.controller';

import { authenticationV2 } from '@auth/authUtils';
import { asyncHandler } from '@helpers/asyncHandler';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// sign up
router.post('/sign-up', asyncHandler(AccessController.signUp));

// login
router.post('/login', asyncHandler(AccessController.login));

// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));

// logout
router.post('/logout', asyncHandler(AccessController.logout));

// refresh token
router.post(
  '/refresh-token',
  asyncHandler(AccessController.handlerRefreshToken)
);

// refresh token v2
router.post(
  '/refresh-token-v2',
  asyncHandler(AccessController.handlerRefreshTokenV2)
);

export default router;
