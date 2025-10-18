import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import characterInWorkController from '../controllers/characterInWorkController.js';

const characterInWorkRoute = express.Router();

characterInWorkRoute.use(controllerWrapper(authMiddleware.authMiddleware));

characterInWorkRoute.get('/:id', controllerWrapper(characterInWorkController.getCharacterInWork));
characterInWorkRoute.patch('/:id', controllerWrapper(characterInWorkController.updateCharacterInWork));
characterInWorkRoute.get(
    '/:id/relationships',
    controllerWrapper(characterInWorkController.getCharacterInWorkRelationships)
);

export default characterInWorkRoute;
