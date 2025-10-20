import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import locationController from '../controllers/locationController.js';
import locationInWorkController from '../controllers/locationInWorkController.js';
import validateBody from '../middlewares/validateBody.js';
import { validateLocationId } from '../middlewares/validateId.js';
import locationValidator from '../validators/locationValidator.js';
import locationInWorkValidator from '../validators/locationInWorkValidator.js';

const locationRoute = express.Router();

locationRoute.use(controllerWrapper(authMiddleware.authMiddleware));

locationRoute.get('/', controllerWrapper(locationController.getLocations));
locationRoute.post(
    '/',
    controllerWrapper(validateBody(locationValidator.createLocationValidator)),
    controllerWrapper(locationController.createLocation)
);
locationRoute.get('/:id', controllerWrapper(validateLocationId()), controllerWrapper(locationController.getLocation));
locationRoute.patch(
    '/:id',
    controllerWrapper(validateLocationId()),
    controllerWrapper(validateBody(locationValidator.updateLocationValidator)),
    controllerWrapper(locationController.updateLocation)
);
locationRoute.delete(
    '/:id',
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.destroyLocation)
);
locationRoute.get(
    '/:id/placements',
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocationPlacements)
);
locationRoute.get(
    '/:id/placements/available',
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocationPossiblePlacements)
);

export default locationRoute;
