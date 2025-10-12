import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import appUserController from '../controllers/appUserController.js';
import controllerWrapper from '../decorators/controllerWrapper.js';

const appUserRoute = express.Router();

appUserRoute.post('/sign-up', controllerWrapper(appUserController.signUpAppUser));
appUserRoute.post('/sign-in', controllerWrapper(appUserController.signInAppUser));

appUserRoute.use(authMiddleware);

appUserRoute.post('/sign-out', controllerWrapper(appUserController.signOutAppUser));
appUserRoute.post('/update', controllerWrapper(appUserController.updateAppUserNormalFields));

export default appUserRoute;
