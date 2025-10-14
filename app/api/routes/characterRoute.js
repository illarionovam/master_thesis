import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import characterController from '../controllers/characterController.js';

const characterRoute = express.Router();

characterRoute.use(controllerWrapper(authMiddleware.authMiddleware));

characterRoute.get('/', controllerWrapper(characterController.getCharacters));
characterRoute.post('/', controllerWrapper(characterController.createCharacter));
characterRoute.get('/:id', controllerWrapper(characterController.getCharacter));
characterRoute.patch('/:id', controllerWrapper(characterController.updateCharacter));
characterRoute.delete('/:id', controllerWrapper(characterController.destroyCharacter));
characterRoute.get('/:id/appearances', controllerWrapper(characterController.getCharacterAppearances));
characterRoute.get(
    '/:id/appearances/available',
    controllerWrapper(characterController.getCharacterPossibleAppearances)
);
characterRoute.post('/:id/appearances', controllerWrapper(characterController.linkWork));
characterRoute.delete('/:id/appearances/:characterInWorkId', controllerWrapper(characterController.unlinkWork));

export default characterRoute;
