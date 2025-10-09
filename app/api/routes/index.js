import express from 'express';
import appUserRoute from './appUserRoute.js';
import controllerWrapper from '../decorators/controllerWrapper.js';

const apiRouter = express.Router();

apiRouter.use('/users', controllerWrapper(appUserRoute));

apiRouter.use((req, res) => res.status(404).json({ message: 'Page not found.' }));

export default apiRouter;
