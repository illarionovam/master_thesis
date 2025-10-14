import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import workController from '../controllers/workController.js';

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

export default workRoute;
