import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import locationController from '../controllers/locationController.js';
import validateBody from '../middlewares/validateBody.js';
import { validateLocationId } from '../middlewares/validateId.js';
import locationValidator from '../validators/locationValidator.js';
import { generalRateLimiter } from '../middlewares/rateLimiters.js';

const locationRoute = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Location:
 *       type: object
 *       description: Full location entity
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         parent_location_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Optional parent location (for hierarchies)
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     LocationListItem:
 *       type: object
 *       description: Lightweight location representation used in lists
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *     WorkListItem:
 *       type: object
 *       description: Lightweight work representation
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *     LocationInWorkListItem:
 *       type: object
 *       description: Location placement in a work
 *       properties:
 *         id:
 *           type: integer
 *         location_id:
 *           type: integer
 *         work_id:
 *           type: integer
 *         work:
 *           $ref: '#/components/schemas/WorkListItem'
 *         location:
 *           $ref: '#/components/schemas/LocationListItem'
 *     LocationCreateInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 300
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 3000
 *         parent_location_id:
 *           oneOf:
 *             - type: string
 *               format: uuid
 *             - type: "null"
 *           description: Optional parent location ID or null
 *     LocationUpdateInput:
 *       type: object
 *       description: >
 *         At least one of title, description, or parent_location_id must be provided.
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 300
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 3000
 *         parent_location_id:
 *           oneOf:
 *             - type: string
 *               format: uuid
 *             - type: "null"
 *           description: Optional parent location ID or null
 */

locationRoute.use(controllerWrapper(authMiddleware.authMiddleware));

/**
 * @swagger
 * /api/locations:
 *   get:
 *     summary: List locations
 *     description: Returns all locations owned by the currently authenticated user (stripped to id and title).
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unverified email
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new location
 *     description: >
 *       Creates a location owned by the authenticated user.
 *       If parent_location_id is provided, it must reference a location owned by the same user.
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationCreateInput'
 *     responses:
 *       201:
 *         description: Location created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (parent_location_id does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
locationRoute.get('/', generalRateLimiter, controllerWrapper(locationController.getLocations));
locationRoute.post(
    '/',
    generalRateLimiter,
    controllerWrapper(validateBody(locationValidator.createLocationValidator)),
    controllerWrapper(locationController.createLocation)
);

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get a location by ID
 *     description: Returns a single location owned by the authenticated user.
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: Location found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (location not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update a location
 *     description: >
 *       Updates the title, description and/or parent_location_id of a location.
 *       If parent_location_id is provided, it must reference a location owned by the same user.
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationUpdateInput'
 *     responses:
 *       200:
 *         description: Location updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Location'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (location not found / not owned or invalid parent_location_id)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a location
 *     description: Deletes a location owned by the authenticated user.
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       204:
 *         description: Location deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (location not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
locationRoute.get(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocation)
);
locationRoute.patch(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(validateBody(locationValidator.updateLocationValidator)),
    controllerWrapper(locationController.updateLocation)
);
locationRoute.delete(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.destroyLocation)
);

/**
 * @swagger
 * /api/locations/{id}/placements:
 *   get:
 *     summary: List location placements in works
 *     description: Returns all placements of this location in different works.
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: List of location placements
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationInWorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (location not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 * /api/locations/{id}/placements/available:
 *   get:
 *     summary: List works where location can still appear
 *     description: >
 *       Returns works owned by the user where this location is not yet linked
 *       and can be added as a placement.
 *     tags:
 *       - Locations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Location ID
 *     responses:
 *       200:
 *         description: List of works where the location can be added
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (location not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
locationRoute.get(
    '/:id/placements',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocationPlacements)
);
locationRoute.get(
    '/:id/placements/available',
    generalRateLimiter,
    controllerWrapper(validateLocationId()),
    controllerWrapper(locationController.getLocationPossiblePlacements)
);

export default locationRoute;
