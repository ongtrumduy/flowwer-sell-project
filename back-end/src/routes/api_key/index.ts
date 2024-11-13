import express from 'express';

import { asyncHandler } from '@helpers/asyncHandler';
import ApiKeyController from '@root/src/controllers/apikey.controller';

const router = express.Router({ mergeParams: true }); // Bật mergeParams

// generate api key
router.post('/generate-api-key', asyncHandler(ApiKeyController.generateApiKey));

export default router;
