import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import locationInWorkController from '../controllers/locationInWorkController.js';

const locationInWorkRoute = express.Router();

locationInWorkRoute.use(controllerWrapper(authMiddleware.authMiddleware));

locationInWorkRoute.get('/:id', controllerWrapper(locationInWorkController.getLocationInWork));
locationInWorkRoute.patch('/:id', controllerWrapper(locationInWorkController.updateLocationInWork));

export default locationInWorkRoute;
