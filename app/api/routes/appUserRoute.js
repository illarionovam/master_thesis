import express from 'express';

import appUserController from '../controllers/appUserController.js';
import controllerWrapper from '../decorators/controllerWrapper.js';

const appUserRoute = express.Router();

appUserRoute.post('/sign-up', controllerWrapper(appUserController.createAppUser));
appUserRoute.post('/sign-in', controllerWrapper(appUserController.signInAppUser));

export default appUserRoute;
