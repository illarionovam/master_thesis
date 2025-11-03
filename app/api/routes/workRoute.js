import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import workController from '../controllers/workController.js';
import relationshipController from '../controllers/relationshipController.js';
import eventController from '../controllers/eventController.js';
import characterInWorkController from '../controllers/characterInWorkController.js';
import locationInWorkController from '../controllers/locationInWorkController.js';
import characterInWorkValidator from '../validators/characterInWorkValidator.js';
import validateBody from '../middlewares/validateBody.js';
import { validateWorkId } from '../middlewares/validateId.js';
import workValidator from '../validators/workValidator.js';
import relationshipValidator from '../validators/relationshipValidator.js';
import eventValidator from '../validators/eventValidator.js';
import locationInWorkValidator from '../validators/locationInWorkValidator.js';

const workRoute = express.Router();

workRoute.use(controllerWrapper(authMiddleware.authMiddleware));

workRoute.get('/', controllerWrapper(workController.getWorks));
workRoute.post(
    '/',
    controllerWrapper(validateBody(workValidator.createWorkValidator)),
    controllerWrapper(workController.createWork)
);
workRoute.get('/:id', controllerWrapper(validateWorkId()), controllerWrapper(workController.getWork));
workRoute.patch(
    '/:id',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(workValidator.updateWorkValidator)),
    controllerWrapper(workController.updateWork)
);
workRoute.delete('/:id', controllerWrapper(validateWorkId()), controllerWrapper(workController.destroyWork));
workRoute.get('/:id/cast', controllerWrapper(validateWorkId()), controllerWrapper(workController.getWorkCast));
workRoute.post(
    '/:id/cast',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(workValidator.linkCharacterValidator)),
    controllerWrapper(workController.linkCharacter)
);
workRoute.get(
    '/:id/cast/available',
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkPossibleCast)
);
workRoute.get(
    '/:id/cast/:characterInWorkId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.getCharacterInWork)
);
workRoute.get(
    '/:id/cast/:characterInWorkId/relationships',
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.getCharacterInWorkRelationships)
);
workRoute.get(
    '/:id/cast/:characterInWorkId/relationships/available',
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.getCharacterInWorkPossibleRelationships)
);
workRoute.post(
    '/:id/cast/:characterInWorkId/relationships',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(relationshipValidator.createRelationshipValidator)),
    controllerWrapper(relationshipController.createRelationship)
);
workRoute.get(
    '/:id/cast/:characterInWorkId/relationships/:relationshipId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(relationshipController.getRelationship)
);
workRoute.patch(
    '/:id/cast/:characterInWorkId/relationships/:relationshipId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(relationshipValidator.updateRelationshipValidator)),
    controllerWrapper(relationshipController.updateRelationship)
);
workRoute.delete(
    '/:id/cast/:characterInWorkId/relationships/:relationshipId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(relationshipController.destroyRelationship)
);
workRoute.patch(
    '/:id/cast/:characterInWorkId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(characterInWorkValidator.updateCharacterInWork)),
    controllerWrapper(characterInWorkController.updateCharacterInWork)
);
workRoute.delete(
    '/:id/cast/:characterInWorkId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.destroyCharacterInWork)
);
workRoute.get(
    '/:id/location-links',
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkLocationLinks)
);
workRoute.get(
    '/:id/location-links/available',
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkPossibleLocationLinks)
);
workRoute.post(
    '/:id/location-links',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(workValidator.linkLocationValidator)),
    controllerWrapper(workController.linkLocation)
);
workRoute.get(
    '/:id/location-links/:locationInWorkId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(locationInWorkController.getLocationInWork)
);
workRoute.get(
    '/:id/location-links/:locationInWorkId/events',
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventsByWorkIdAndLocationInWorkId)
);
workRoute.patch(
    '/:id/location-links/:locationInWorkId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(locationInWorkValidator.updateLocationInWorkValidator)),
    controllerWrapper(locationInWorkController.updateLocationInWork)
);
workRoute.delete(
    '/:id/location-links/:locationInWorkId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(locationInWorkController.destroyLocationInWork)
);
workRoute.get('/:id/events', controllerWrapper(validateWorkId()), controllerWrapper(eventController.getEventsByWorkId));
workRoute.post(
    '/:id/events',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(eventValidator.createEventValidator)),
    controllerWrapper(eventController.createEvent)
);
workRoute.get('/:id/events/:eventId', controllerWrapper(validateWorkId()), controllerWrapper(eventController.getEvent));
workRoute.patch(
    '/:id/events/:eventId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(eventValidator.updateEventValidator)),
    controllerWrapper(eventController.updateEvent)
);
workRoute.delete(
    '/:id/events/:eventId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.destroyEvent)
);
workRoute.get(
    '/:id/events/:eventId/participants',
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventParticipants)
);
workRoute.get(
    '/:id/events/:eventId/participants/available',
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventPossibleParticipants)
);
workRoute.post(
    '/:id/events/:eventId/participants',
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(eventValidator.linkParticipantValidator)),
    controllerWrapper(eventController.linkParticipant)
);
workRoute.delete(
    '/:id/events/:eventId/participants/:eventParticipantId',
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.unlinkParticipant)
);

export default workRoute;
