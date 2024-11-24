import express from 'express';

import commentRouter from '@root/src/routes/public/comment';
import typeProductRouter from '@root/src/routes/public/type_product';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// // ==================================================
// // authenticate
// // must be authenticated ---> must be authenticated with access token
// // can call endpoints that require authenticated user
// router.use(asyncHandler(authenticationV2));
// // ==================================================
// router.use(asyncHandler(UserController.checkHaveRoleUserPublic));
// // ==================================================
// // ==================================================

router.use('/type/product', typeProductRouter);

router.use('/comment', commentRouter);

export default router;
