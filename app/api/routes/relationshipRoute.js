import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import relationshipController from '../controllers/relationshipController.js';

const relationshipRoute = express.Router();

relationshipRoute.use(controllerWrapper(authMiddleware.authMiddleware));

relationshipRoute.get('/:id', controllerWrapper(relationshipController.getRelationship));
relationshipRoute.patch('/:id', controllerWrapper(relationshipController.updateRelationship));
relationshipRoute.delete('/:id', controllerWrapper(relationshipController.destroyRelationship));

export default relationshipRoute;
