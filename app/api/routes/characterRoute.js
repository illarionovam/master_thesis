import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import characterController from '../controllers/characterController.js';
import validateBody from '../middlewares/validateBody.js';
import characterValidator from '../validators/characterValidator.js';
import { validateCharacterId } from '../middlewares/validateId.js';
import { generalRateLimiter, generationRateLimiter } from '../middlewares/rateLimiters.js';

const characterRoute = express.Router();

characterRoute.use(controllerWrapper(authMiddleware.authMiddleware));

characterRoute.get('/', generalRateLimiter, controllerWrapper(characterController.getCharacters));
characterRoute.post(
    '/',
    generalRateLimiter,
    controllerWrapper(validateBody(characterValidator.createCharacterValidator)),
    controllerWrapper(characterController.createCharacter)
);
characterRoute.get(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacter)
);
characterRoute.post(
    '/:id/generate',
    generationRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.generateImageUrl)
);
characterRoute.patch(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(validateBody(characterValidator.updateCharacterValidator)),
    controllerWrapper(characterController.updateCharacter)
);
characterRoute.delete(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.destroyCharacter)
);
characterRoute.get(
    '/:id/appearances',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacterAppearances)
);
characterRoute.get(
    '/:id/appearances/available',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacterPossibleAppearances)
);

export default characterRoute;
