import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import appUserController from '../controllers/appUserController.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import appUserValidator from '../validators/appUserValidator.js';
import { authRateLimiter, authSlowDown, generalRateLimiter } from '../middlewares/rateLimiters.js';

const appUserRoute = express.Router();

appUserRoute.post(
    '/verify',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.verifyAppUserEmailValidator)),
    controllerWrapper(appUserController.verifyAppUserEmail)
);

appUserRoute.post(
    '/sign-up',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.signUpAppUserValidator)),
    controllerWrapper(appUserController.signUpAppUser)
);
appUserRoute.post(
    '/sign-in',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.signInAppUserValidator)),
    controllerWrapper(appUserController.signInAppUser)
);
appUserRoute.post(
    '/forgot-password',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.resetAppUserPasswordValidator)),
    controllerWrapper(appUserController.resetAppUserPassword)
);

appUserRoute.use(controllerWrapper(authMiddleware.authMiddleware));

appUserRoute.get('/user-info', generalRateLimiter, controllerWrapper(appUserController.getAppUser));
appUserRoute.post(
    '/sign-out',
    generalRateLimiter,
    controllerWrapper(validateBody(appUserValidator.signOutAppUserValidator)),
    controllerWrapper(appUserController.signOutAppUser)
);
appUserRoute.post(
    '/update',
    generalRateLimiter,
    controllerWrapper(validateBody(appUserValidator.updateAppUserNormalFieldsValidator)),
    controllerWrapper(appUserController.updateAppUserNormalFields)
);
appUserRoute.post(
    '/update-email',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.updateAppUserEmailValidator)),
    controllerWrapper(appUserController.updateAppUserEmail)
);

appUserRoute.post(
    '/confirm-password',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(authMiddleware.requireScope('password_reset')),
    controllerWrapper(validateBody(appUserValidator.confirmAppUserPasswordValidator)),
    controllerWrapper(appUserController.confirmAppUserPassword)
);
appUserRoute.post(
    '/confirm-email',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(authMiddleware.requireScope('email_verify')),
    controllerWrapper(appUserController.confirmAppUserEmail)
);

export default appUserRoute;
