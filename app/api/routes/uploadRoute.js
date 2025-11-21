import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import uploadController from '../controllers/uploadController.js';
import uploadSingle from '../middlewares/upload.js';
import { generationRateLimiter } from '../middlewares/rateLimiters.js';

const uploadRoute = express.Router();

uploadRoute.use(controllerWrapper(authMiddleware.authMiddleware));

uploadRoute.post(
    '/',
    generationRateLimiter,
    controllerWrapper(uploadSingle),
    controllerWrapper(uploadController.uploadImage)
);

export default uploadRoute;
