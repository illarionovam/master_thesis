import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import uploadController from '../controllers/uploadController.js';
import uploadSingle from '../middlewares/upload.js';

const uploadRoute = express.Router();

uploadRoute.use(controllerWrapper(authMiddleware.authMiddleware));

uploadRoute.post('/', controllerWrapper(uploadSingle), controllerWrapper(uploadController.uploadImage));

export default uploadRoute;
