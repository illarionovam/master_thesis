import express from 'express';
import appUserRoute from './appUserRoute.js';
import workRoute from './workRoute.js';

const apiRouter = express.Router();

apiRouter.use('/auth', appUserRoute);
apiRouter.use('/works', workRoute);

apiRouter.use((req, res) => res.status(404).json({ message: 'Page not found' }));

export default apiRouter;
