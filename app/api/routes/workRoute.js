import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import workController from '../controllers/workController.js';
import relationshipController from '../controllers/relationshipController.js';
import eventController from '../controllers/eventController.js';

const workRoute = express.Router();

workRoute.use(controllerWrapper(authMiddleware.authMiddleware));

workRoute.get('/', controllerWrapper(workController.getWorks));
workRoute.post('/', controllerWrapper(workController.createWork));
workRoute.get('/:id', controllerWrapper(workController.getWork));
workRoute.patch('/:id', controllerWrapper(workController.updateWork));
workRoute.delete('/:id', controllerWrapper(workController.destroyWork));

workRoute.get('/:id/cast', controllerWrapper(workController.getWorkCast));
workRoute.get('/:id/cast/available', controllerWrapper(workController.getWorkPossibleCast));
workRoute.post('/:id/cast', controllerWrapper(workController.linkCharacter));
workRoute.delete('/:id/cast/:characterInWorkId', controllerWrapper(workController.unlinkCharacter));

workRoute.post('/:id/cast/relationships', controllerWrapper(relationshipController.createRelationship));
workRoute.post(
    '/:id/cast/relationships/:fromId/:toId',
    controllerWrapper(relationshipController.getRelationshipByFromIdAndToId)
);

workRoute.get('/:id/location-links', controllerWrapper(workController.getWorkLocationLinks));
workRoute.get('/:id/location-links/available', controllerWrapper(workController.getWorkPossibleLocationLinks));
workRoute.post('/:id/location-links', controllerWrapper(workController.linkLocation));
workRoute.delete('/:id/location-links/:locationInWorkId', controllerWrapper(workController.unlinkLocation));

workRoute.get('/:id/events', controllerWrapper(eventController.getEventsByWorkId));
workRoute.get('/:workId/events/:id', controllerWrapper(eventController.getEvent));
workRoute.post('/:workId/events/:id', controllerWrapper(eventController.updateEvent));
workRoute.delete('/:workId/events/:id', controllerWrapper(eventController.destroyEvent));

workRoute.get('/:workId/events/:id/participants', controllerWrapper(eventController.getEventParticipants));
workRoute.get(
    '/:workId/events/:id/participants/available',
    controllerWrapper(eventController.getEventPossibleParticipants)
);
workRoute.post('/:workId/events/:id/participants', controllerWrapper(eventController.linkParticipant));
workRoute.delete(
    '/:workId/events/:id/participants/:eventParticipantId',
    controllerWrapper(eventController.unlinkParticipant)
);

export default workRoute;
