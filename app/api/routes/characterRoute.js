import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import characterController from '../controllers/characterController.js';
import characterInWorkController from '../controllers/characterInWorkController.js';
import validateBody from '../middlewares/validateBody.js';
import characterValidator from '../validators/characterValidator.js';
import characterInWorkValidator from '../validators/characterInWorkValidator.js';
import { validateCharacterId } from '../middlewares/validateId.js';

const characterRoute = express.Router();

characterRoute.use(controllerWrapper(authMiddleware.authMiddleware));

characterRoute.get('/', controllerWrapper(characterController.getCharacters));
characterRoute.post(
    '/',
    controllerWrapper(validateBody(characterValidator.createCharacterValidator)),
    controllerWrapper(characterController.createCharacter)
);
characterRoute.get(
    '/:id',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacter)
);
characterRoute.patch(
    '/:id',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(validateBody(characterValidator.updateCharacterValidator)),
    controllerWrapper(characterController.updateCharacter)
);
characterRoute.delete(
    '/:id',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.destroyCharacter)
);
characterRoute.get(
    '/:id/appearances',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacterAppearances)
);
characterRoute.get(
    '/:id/appearances/available',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacterPossibleAppearances)
);
characterRoute.post(
    '/:id/appearances',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(validateBody(characterValidator.linkWorkValidator)),
    controllerWrapper(characterController.linkWork)
);
characterRoute.get(
    '/:id/appearances/:characterInWorkId',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterInWorkController.getCharacterInWork)
);
characterRoute.get(
    '/:id/appearances/:characterInWorkId/relationships',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterInWorkController.getCharacterInWorkRelationships)
);
characterRoute.get(
    '/:id/appearances/:characterInWorkId/relationships/available',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterInWorkController.getCharacterInWorkPossibleRelationships)
);
characterRoute.patch(
    '/:id/appearances/:characterInWorkId',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(validateBody(characterInWorkValidator.updateCharacterInWork)),
    controllerWrapper(characterInWorkController.updateCharacterInWork)
);
characterRoute.delete(
    '/:id/appearances/:characterInWorkId',
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterInWorkController.destroyCharacterInWork)
);

export default characterRoute;
