import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import appUserController from '../controllers/appUserController.js';
import controllerWrapper from '../decorators/controllerWrapper.js';

const appUserRoute = express.Router();

appUserRoute.post('/sign-up', controllerWrapper(appUserController.signUpAppUser));
appUserRoute.post('/sign-in', controllerWrapper(appUserController.signInAppUser));
appUserRoute.post('/forgot-password', controllerWrapper(appUserController.resetAppUserPassword));

appUserRoute.use(authMiddleware.authMiddleware);

appUserRoute.post('/sign-out', controllerWrapper(appUserController.signOutAppUser));
appUserRoute.post('/update', controllerWrapper(appUserController.updateAppUserNormalFields));
appUserRoute.post('/update-email', controllerWrapper(appUserController.updateAppUserEmail));

appUserRoute.post(
    '/confirm-password',
    authMiddleware.requireScope('password_reset'),
    controllerWrapper(appUserController.confirmAppUserPassword)
);
appUserRoute.post(
    '/confirm-email',
    authMiddleware.requireScope('email_verify'),
    controllerWrapper(appUserController.confirmAppUserEmail)
);

export default appUserRoute;
