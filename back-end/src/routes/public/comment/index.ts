import { authenticationV2 } from '@root/src/auth/authUtils';
import CommentController from '@root/src/controllers/public/comment.controller';
import UserController from '@root/src/controllers/user.controller';
import { asyncHandler } from '@root/src/helpers/asyncHandler';
import express from 'express';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// ==================================================
// authenticate
// must be authenticated ---> must be authenticated with access token
// can call endpoints that require authenticated user
router.use(asyncHandler(authenticationV2));
// ==================================================
router.use(asyncHandler(UserController.checkHaveRoleUserPublic));

// get all comment of product list
router.get('/all/comment', asyncHandler(CommentController.getAllCommentOfProductList_V2));

// send review content to product
router.post('/send/comment/review/:productId', asyncHandler(CommentController.sendReviewContentToProduct));

export default router;
