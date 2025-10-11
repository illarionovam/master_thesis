import express from 'express';
import appUserRoute from './appUserRoute.js';

const apiRouter = express.Router();

apiRouter.use('/auth', appUserRoute);

apiRouter.use((req, res) => res.status(404).json({ message: 'Page not found' }));

export default apiRouter;
