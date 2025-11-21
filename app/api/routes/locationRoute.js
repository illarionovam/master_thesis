import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import locationController from '../controllers/locationController.js';
import validateBody from '../middlewares/validateBody.js';
import { validateLocationId } from '../middlewares/validateId.js';
import locationValidator from '../validators/locationValidator.js';
import { generalRateLimiter } from '../middlewares/rateLimiters.js';

const locationRoute = express.Router();

locationRoute.use(controllerWrapper(authMiddleware.authMiddleware));

locationRoute.get('/', generalRateLimiter, controllerWrapper(locationController.getLocations));
locationRoute.post(
    '/',
    generalRateLimiter,
    controllerWrapper(validateBody(locationValidator.createLocationValidator)),
    controllerWrapper(locationController.createLocation)
);
locationRoute.get(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocation)
);
locationRoute.patch(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(validateBody(locationValidator.updateLocationValidator)),
    controllerWrapper(locationController.updateLocation)
);
locationRoute.delete(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.destroyLocation)
);
locationRoute.get(
    '/:id/placements',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocationPlacements)
);
locationRoute.get(
    '/:id/placements/available',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocationPossiblePlacements)
);

export default locationRoute;
