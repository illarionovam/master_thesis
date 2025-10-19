import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import appUserController from '../controllers/appUserController.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import {
    signUpAppUserValidator,
    signInAppUserValidator,
    resetAppUserPasswordValidator,
    signOutAppUserValidator,
    updateAppUserNormalFieldsValidator,
    updateAppUserEmailValidator,
    confirmAppUserPasswordValidator,
} from '../validators/appUserValidator.js';

const appUserRoute = express.Router();

appUserRoute.post(
    '/sign-up',
    controllerWrapper(validateBody(signUpAppUserValidator)),
    controllerWrapper(appUserController.signUpAppUser)
);
appUserRoute.post(
    '/sign-in',
    controllerWrapper(validateBody(signInAppUserValidator)),
    controllerWrapper(appUserController.signInAppUser)
);
appUserRoute.post(
    '/forgot-password',
    controllerWrapper(validateBody(resetAppUserPasswordValidator)),
    controllerWrapper(appUserController.resetAppUserPassword)
);

appUserRoute.use(controllerWrapper(authMiddleware.authMiddleware));

appUserRoute.get('/user-info', controllerWrapper(appUserController.getAppUser));
appUserRoute.post(
    '/sign-out',
    controllerWrapper(validateBody(signOutAppUserValidator)),
    controllerWrapper(appUserController.signOutAppUser)
);
appUserRoute.post(
    '/update',
    controllerWrapper(validateBody(updateAppUserNormalFieldsValidator)),
    controllerWrapper(appUserController.updateAppUserNormalFields)
);
appUserRoute.post(
    '/update-email',
    controllerWrapper(validateBody(updateAppUserEmailValidator)),
    controllerWrapper(appUserController.updateAppUserEmail)
);

appUserRoute.post(
    '/confirm-password',
    controllerWrapper(authMiddleware.requireScope('password_reset')),
    controllerWrapper(validateBody(confirmAppUserPasswordValidator)),
    controllerWrapper(appUserController.confirmAppUserPassword)
);
appUserRoute.post(
    '/confirm-email',
    controllerWrapper(authMiddleware.requireScope('email_verify')),
    controllerWrapper(appUserController.confirmAppUserEmail)
);

export default appUserRoute;
