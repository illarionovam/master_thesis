import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import characterInWorkController from '../controllers/characterInWorkController.js';

const characterInWorkRoute = express.Router();

characterInWorkRoute.use(controllerWrapper(authMiddleware.authMiddleware));

characterInWorkRoute.patch('/:id', controllerWrapper(characterInWorkController.updateCharacterInWork));

export default characterInWorkRoute;
