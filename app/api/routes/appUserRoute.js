import express from 'express';

import appUserController from '../controllers/appUserController.js';

const appUserRoute = express.Router();

appUserRoute.post('/signup', appUserController.createAppUser);

export default appUserRoute;
