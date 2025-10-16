import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import locationController from '../controllers/locationController.js';

const locationRoute = express.Router();

locationRoute.use(controllerWrapper(authMiddleware.authMiddleware));

locationRoute.get('/', controllerWrapper(locationController.getLocations));
locationRoute.post('/', controllerWrapper(locationController.createLocation));
locationRoute.get('/:id', controllerWrapper(locationController.getLocation));
locationRoute.patch('/:id', controllerWrapper(locationController.updateLocation));
locationRoute.delete('/:id', controllerWrapper(locationController.destroyLocation));

locationRoute.get('/:id/placements', controllerWrapper(locationController.getLocationPlacements));
locationRoute.get('/:id/placements/available', controllerWrapper(locationController.getLocationPossiblePlacements));
locationRoute.post('/:id/placements', controllerWrapper(locationController.linkWork));
locationRoute.delete('/:id/placements/:locationInWorkId', controllerWrapper(locationController.unlinkWork));

export default locationRoute;
