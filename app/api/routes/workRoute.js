import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import workController from '../controllers/workController.js';
import relationshipController from '../controllers/relationshipController.js';
import eventController from '../controllers/eventController.js';
import characterInWorkController from '../controllers/characterInWorkController.js';
import locationInWorkController from '../controllers/locationInWorkController.js';
import characterInWorkValidator from '../validators/characterInWorkValidator.js';
import validateBody from '../middlewares/validateBody.js';
import { validateWorkId } from '../middlewares/validateId.js';
import workValidator from '../validators/workValidator.js';
import relationshipValidator from '../validators/relationshipValidator.js';
import eventValidator from '../validators/eventValidator.js';
import locationInWorkValidator from '../validators/locationInWorkValidator.js';
import { generalRateLimiter, generationRateLimiter } from '../middlewares/rateLimiters.js';

const workRoute = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Work:
 *       type: object
 *       description: Full work entity
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         annotation:
 *           type: string
 *           nullable: true
 *         synopsis:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     WorkListItem:
 *       type: object
 *       description: Lightweight work representation
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *     CharacterListItem:
 *       type: object
 *       description: Lightweight character representation
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     LocationListItem:
 *       type: object
 *       description: Lightweight location representation
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *     CharacterInWorkListItem:
 *       type: object
 *       description: Character appearance in a work (from stripBulkCharacterInWorkResponse)
 *       properties:
 *         id:
 *           type: integer
 *         character_id:
 *           type: integer
 *         work_id:
 *           type: integer
 *         work:
 *           $ref: '#/components/schemas/WorkListItem'
 *         character:
 *           $ref: '#/components/schemas/CharacterListItem'
 *     LocationInWorkListItem:
 *       type: object
 *       description: Location placement in a work (from stripBulkLocationInWorkResponse)
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
 *     RelationshipListItem:
 *       type: object
 *       description: Relationship between two characters in a work (from stripBulkRelationshipResponse)
 *       properties:
 *         id:
 *           type: integer
 *         work_id:
 *           type: integer
 *         from_character_in_work_id:
 *           type: integer
 *         to_character_in_work_id:
 *           type: integer
 *         type:
 *           type: string
 *         from:
 *           $ref: '#/components/schemas/CharacterListItem'
 *         to:
 *           $ref: '#/components/schemas/CharacterListItem'
 *     EventListItem:
 *       type: object
 *       description: Event in a work (from stripBulkEventResponse)
 *       properties:
 *         id:
 *           type: integer
 *         work_id:
 *           type: integer
 *         location_in_work_id:
 *           type: integer
 *           nullable: true
 *         title:
 *           type: string
 *         order_in_work:
 *           type: integer
 *         work:
 *           $ref: '#/components/schemas/WorkListItem'
 *         location:
 *           oneOf:
 *             - $ref: '#/components/schemas/LocationListItem'
 *             - type: "null"
 *     EventParticipantListItem:
 *       type: object
 *       description: Event participant (from stripBulkEventParticipantResponse)
 *       properties:
 *         id:
 *           type: integer
 *         event_id:
 *           type: integer
 *         character_in_work_id:
 *           type: integer
 *         character:
 *           $ref: '#/components/schemas/CharacterListItem'
 *         event:
 *           $ref: '#/components/schemas/EventListItem'
 *     WorkCreateInput:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 300
 *         annotation:
 *           type: string
 *           maxLength: 3000
 *           nullable: true
 *         synopsis:
 *           type: string
 *           maxLength: 1500
 *           nullable: true
 *     WorkUpdateInput:
 *       type: object
 *       description: At least one of title, annotation, or synopsis must be provided.
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 300
 *         annotation:
 *           type: string
 *           minLength: 1
 *           maxLength: 3000
 *         synopsis:
 *           type: string
 *           minLength: 1
 *           maxLength: 1500
 *     LinkCharacterInput:
 *       type: object
 *       required:
 *         - character_id
 *       properties:
 *         character_id:
 *           type: string
 *           format: uuid
 *           description: Character ID to link to this work
 *     LinkLocationInput:
 *       type: object
 *       required:
 *         - location_id
 *       properties:
 *         location_id:
 *           type: string
 *           format: uuid
 *           description: Location ID to link to this work
 *     RelationshipCreateInput:
 *       type: object
 *       required:
 *         - to_character_in_work_id
 *         - type
 *       properties:
 *         to_character_in_work_id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 120
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *     RelationshipUpdateInput:
 *       type: object
 *       description: At least one of type or notes must be provided.
 *       properties:
 *         type:
 *           type: string
 *           minLength: 1
 *           maxLength: 120
 *         notes:
 *           type: string
 *           maxLength: 500
 *           nullable: true
 *     EventCreateInput:
 *       type: object
 *       required:
 *         - title
 *         - description
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description:
 *           type: string
 *           minLength: 1
 *           maxLength: 6000
 *         location_in_work_id:
 *           oneOf:
 *             - type: string
 *               format: uuid
 *             - type: "null"
 *           description: Optional location_in_work ID or null
 *     EventUpdateInput:
 *       oneOf:
 *         - type: object
 *           description: Update only order_in_work
 *           required:
 *             - order_in_work
 *           properties:
 *             order_in_work:
 *               type: integer
 *               minimum: 1
 *         - type: object
 *           description: Update content fields (title, description, location_in_work_id)
 *           properties:
 *             title:
 *               type: string
 *               minLength: 1
 *               maxLength: 100
 *             description:
 *               type: string
 *               minLength: 1
 *               maxLength: 6000
 *             location_in_work_id:
 *               oneOf:
 *                 - type: string
 *                   format: uuid
 *                 - type: "null"
 *     ReorderEventsInput:
 *       type: object
 *       required:
 *         - data
 *       properties:
 *         data:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: object
 *             required:
 *               - id
 *               - order_in_work
 *             properties:
 *               id:
 *                 type: string
 *                 format: uuid
 *               order_in_work:
 *                 type: integer
 *                 minimum: 1
 *     LinkParticipantInput:
 *       type: object
 *       required:
 *         - character_in_work_id
 *       properties:
 *         character_in_work_id:
 *           type: string
 *           format: uuid
 *     CharacterInWorkUpdateInput:
 *       oneOf:
 *         - type: object
 *           description: Update only image_url
 *           required:
 *             - image_url
 *           properties:
 *             image_url:
 *               oneOf:
 *                 - type: string
 *                   format: uri
 *                 - type: "null"
 *         - type: object
 *           description: Update only attributes
 *           required:
 *             - attributes
 *           properties:
 *             attributes:
 *               type: object
 *               additionalProperties: true
 *     LocationInWorkUpdateInput:
 *       type: object
 *       required:
 *         - attributes
 *       properties:
 *         attributes:
 *           type: object
 *           additionalProperties: true
 */

workRoute.use(controllerWrapper(authMiddleware.authMiddleware));

/**
 * @swagger
 * /api/works:
 *   get:
 *     summary: List works
 *     description: Returns all works owned by the currently authenticated user (stripped to id and title).
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of works
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unverified email
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new work
 *     description: Creates a work owned by the authenticated user.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkCreateInput'
 *     responses:
 *       201:
 *         description: Work created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Work'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unverified email
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
workRoute.get('/', generalRateLimiter, controllerWrapper(workController.getWorks));
workRoute.post(
    '/',
    generalRateLimiter,
    controllerWrapper(validateBody(workValidator.createWorkValidator)),
    controllerWrapper(workController.createWork)
);

/**
 * @swagger
 * /api/works/{id}:
 *   get:
 *     summary: Get a work by ID
 *     description: Returns a single work owned by the authenticated user.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     responses:
 *       200:
 *         description: Work found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Work'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (work not found or does not belong to the user)
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update a work
 *     description: Updates title, annotation and/or synopsis of a work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkUpdateInput'
 *     responses:
 *       200:
 *         description: Work updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Work'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (work not found or does not belong to the user)
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a work
 *     description: Deletes a work owned by the authenticated user.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     responses:
 *       204:
 *         description: Work deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (work not found or does not belong to the user)
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWork)
);
workRoute.patch(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(workValidator.updateWorkValidator)),
    controllerWrapper(workController.updateWork)
);
workRoute.delete(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.destroyWork)
);

/**
 * @swagger
 * /api/works/{id}/generate:
 *   get:
 *     summary: Generate work description
 *     description: >
 *       Uses the work's events (title + description) to generate a synthesized description
 *       via AI and returns it as plain text.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     responses:
 *       200:
 *         description: Generated description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Generated description text
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (work not found or does not belong to the user)
 *       429:
 *         description: Too many requests (generation rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/generate',
    generationRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.generateWorkDescription)
);

/**
 * @swagger
 * /api/works/{id}/cast:
 *   get:
 *     summary: Get work cast
 *     description: Returns all characters linked to a work (characters in work).
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     responses:
 *       200:
 *         description: List of cast members
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CharacterInWorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Link a character to a work
 *     description: >
 *       Links an existing character (owned by the user) to this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LinkCharacterInput'
 *     responses:
 *       201:
 *         description: Character linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: CharacterInWork plus embedded work and character
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (character not found or does not belong to the user)
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/cast',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkCast)
);
workRoute.post(
    '/:id/cast',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(workValidator.linkCharacterValidator)),
    controllerWrapper(workController.linkCharacter)
);

/**
 * @swagger
 * /api/works/{id}/cast/available:
 *   get:
 *     summary: List characters that can be added to the work
 *     description: Returns characters owned by the user that are not yet linked to this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     responses:
 *       200:
 *         description: List of characters that can be linked
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CharacterListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/cast/available',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkPossibleCast)
);

/**
 * @swagger
 * /api/works/{id}/cast/{characterInWorkId}:
 *   get:
 *     summary: Get character-in-work details
 *     description: Returns a specific character-in-work entry for this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *         description: CharacterInWork ID
 *     responses:
 *       200:
 *         description: Character-in-work record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update character-in-work
 *     description: >
 *       Updates either the image_url **or** the attributes of a character-in-work entry.
 *       These two modes are mutually exclusive.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CharacterInWorkUpdateInput'
 *     responses:
 *       200:
 *         description: Character-in-work updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Remove character from work
 *     description: Deletes the character-in-work link.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Character removed from work
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/cast/:characterInWorkId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.getCharacterInWork)
);
workRoute.patch(
    '/:id/cast/:characterInWorkId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(characterInWorkValidator.updateCharacterInWork)),
    controllerWrapper(characterInWorkController.updateCharacterInWork)
);
workRoute.delete(
    '/:id/cast/:characterInWorkId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.destroyCharacterInWork)
);

/**
 * @swagger
 * /api/works/{id}/cast/{characterInWorkId}/generate:
 *   post:
 *     summary: Generate an image for character-in-work
 *     description: >
 *       Uses character appearance and attributes (global + per-work) to generate an image with AI,
 *       updates image_url on the character-in-work, and returns the updated record.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *         description: CharacterInWork ID
 *     responses:
 *       200:
 *         description: Image generated and character-in-work updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests (generation rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
workRoute.post(
    '/:id/cast/:characterInWorkId/generate',
    generationRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.generateImageUrl)
);

/**
 * @swagger
 * /api/works/{id}/relationships:
 *   get:
 *     summary: Get all relationships in a work
 *     description: Returns all relationships between characters within this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Work ID
 *     responses:
 *       200:
 *         description: List of relationships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RelationshipListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/relationships',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkRelationships)
);

/**
 * @swagger
 * /api/works/{id}/cast/{characterInWorkId}/relationships:
 *   get:
 *     summary: Get relationships for a specific character-in-work
 *     description: Returns relationships where the character is the "from" side.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of relationships for this character
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RelationshipListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a relationship from this character-in-work
 *     description: >
 *       Creates a relationship where this character-in-work is the "from" side.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RelationshipCreateInput'
 *     responses:
 *       201:
 *         description: Relationship created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/cast/:characterInWorkId/relationships',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.getCharacterInWorkRelationships)
);
workRoute.post(
    '/:id/cast/:characterInWorkId/relationships',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(relationshipValidator.createRelationshipValidator)),
    controllerWrapper(relationshipController.createRelationship)
);

/**
 * @swagger
 * /api/works/{id}/cast/{characterInWorkId/relationships/available}:
 *   get:
 *     summary: List characters that can form a relationship with this character-in-work
 *     description: >
 *       Returns other characters-in-work that are valid as "to" side for a new relationship.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of possible relationship targets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CharacterInWorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/cast/:characterInWorkId/relationships/available',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(characterInWorkController.getCharacterInWorkPossibleRelationships)
);

/**
 * @swagger
 * /api/works/{id}/cast/{characterInWorkId}/relationships/{relationshipId}:
 *   get:
 *     summary: Get a relationship by ID
 *     description: Returns a single relationship where this character-in-work is the "from" side.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: relationshipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Relationship found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update a relationship
 *     description: Updates type and/or notes of a relationship.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: relationshipId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RelationshipUpdateInput'
 *     responses:
 *       200:
 *         description: Relationship updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a relationship
 *     description: Deletes a relationship where this character-in-work is the "from" side.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: relationshipId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Relationship deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/cast/:characterInWorkId/relationships/:relationshipId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(relationshipController.getRelationship)
);
workRoute.patch(
    '/:id/cast/:characterInWorkId/relationships/:relationshipId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(relationshipValidator.updateRelationshipValidator)),
    controllerWrapper(relationshipController.updateRelationship)
);
workRoute.delete(
    '/:id/cast/:characterInWorkId/relationships/:relationshipId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(relationshipController.destroyRelationship)
);

/**
 * @swagger
 * /api/works/{id}/cast/{characterInWorkId}/events:
 *   get:
 *     summary: Get all events for a specific character-in-work
 *     description: Returns event-participant records for this character-in-work within the work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: characterInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of event participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventParticipantListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/cast/:characterInWorkId/events',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventParticipantsByWorkIdAndCharacterInWorkId)
);

/**
 * @swagger
 * /api/works/{id}/location-links:
 *   get:
 *     summary: Get locations linked to a work
 *     description: Returns all location-in-work entries for this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of location links
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationInWorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Link a location to a work
 *     description: Links an existing location (owned by the user) to this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LinkLocationInput'
 *     responses:
 *       201:
 *         description: Location linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/location-links',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkLocationLinks)
);
workRoute.post(
    '/:id/location-links',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(workValidator.linkLocationValidator)),
    controllerWrapper(workController.linkLocation)
);

/**
 * @swagger
 * /api/works/{id}/location-links/available:
 *   get:
 *     summary: List locations that can be linked to this work
 *     description: Returns locations owned by the user that are not yet linked to this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of locations that can be linked
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/LocationListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/location-links/available',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(workController.getWorkPossibleLocationLinks)
);

/**
 * @swagger
 * /api/works/{id}/location-links/{locationInWorkId}:
 *   get:
 *     summary: Get a location-in-work record
 *     description: Returns a specific location-in-work entry for this work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: locationInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location-in-work record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update a location-in-work
 *     description: Updates the attributes of a location-in-work entry.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: locationInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LocationInWorkUpdateInput'
 *     responses:
 *       200:
 *         description: Location-in-work updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Remove location from work
 *     description: Deletes the location-in-work link.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: locationInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Location removed from work
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/location-links/:locationInWorkId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(locationInWorkController.getLocationInWork)
);
workRoute.patch(
    '/:id/location-links/:locationInWorkId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(locationInWorkValidator.updateLocationInWorkValidator)),
    controllerWrapper(locationInWorkController.updateLocationInWork)
);
workRoute.delete(
    '/:id/location-links/:locationInWorkId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(locationInWorkController.destroyLocationInWork)
);

/**
 * @swagger
 * /api/works/{id}/location-links/{locationInWorkId}/events:
 *   get:
 *     summary: Get events for a specific location-in-work
 *     description: Returns all events that take place at this location within the work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: locationInWorkId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/location-links/:locationInWorkId/events',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventsByWorkIdAndLocationInWorkId)
);

/**
 * @swagger
 * /api/works/{id}/events:
 *   get:
 *     summary: Get all events in a work
 *     description: Returns all events for this work, in their current order.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new event in a work
 *     description: Creates an event within this work and optionally links it to a location-in-work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventCreateInput'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/events',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventsByWorkId)
);
workRoute.post(
    '/:id/events',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(eventValidator.createEventValidator)),
    controllerWrapper(eventController.createEvent)
);

/**
 * @swagger
 * /api/works/{id}/events/reorder:
 *   post:
 *     summary: Reorder events in a work
 *     description: >
 *       Updates the order_in_work of multiple events in a single request.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReorderEventsInput'
 *     responses:
 *       200:
 *         description: Events reordered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventListItem'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.post(
    '/:id/events/reorder',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(eventValidator.reorderEventsValidator)),
    controllerWrapper(eventController.reorderEvents)
);

/**
 * @swagger
 * /api/works/{id}/events/{eventId}:
 *   get:
 *     summary: Get an event by ID
 *     description: Returns a single event within the work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update an event
 *     description: >
 *       Updates either only order_in_work, or title/description/location_in_work_id of an event.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventUpdateInput'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an event
 *     description: Deletes an event from the work.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/events/:eventId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEvent)
);
workRoute.patch(
    '/:id/events/:eventId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(eventValidator.updateEventValidator)),
    controllerWrapper(eventController.updateEvent)
);
workRoute.delete(
    '/:id/events/:eventId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.destroyEvent)
);

/**
 * @swagger
 * /api/works/{id}/events/{eventId}/generate:
 *   get:
 *     summary: Generate fact-check for an event
 *     description: >
 *       Uses the event, its participants and previous events to generate an AI-powered
 *       continuity / fact-check report.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fact-check generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 result:
 *                   type: string
 *                   description: Generated analysis / fact-check text
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests (generation rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/events/:eventId/generate',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.generateFactCheck)
);

/**
 * @swagger
 * /api/works/{id}/events/{eventId}/participants:
 *   get:
 *     summary: Get participants of an event
 *     description: Returns all participants of a given event.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of event participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/EventParticipantListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Link a character-in-work as event participant
 *     description: Adds a character-in-work as a participant of this event.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LinkParticipantInput'
 *     responses:
 *       201:
 *         description: Participant linked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties: true
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/events/:eventId/participants',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventParticipants)
);
workRoute.post(
    '/:id/events/:eventId/participants',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(validateBody(eventValidator.linkParticipantValidator)),
    controllerWrapper(eventController.linkParticipant)
);

/**
 * @swagger
 * /api/works/{id}/events/{eventId}/participants/available:
 *   get:
 *     summary: List characters that can be added as participants
 *     description: Returns characters-in-work that are not yet linked to the given event.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of possible participants
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CharacterInWorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.get(
    '/:id/events/:eventId/participants/available',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.getEventPossibleParticipants)
);

/**
 * @swagger
 * /api/works/{id}/events/{eventId}/participants/{eventParticipantId}:
 *   delete:
 *     summary: Remove a participant from an event
 *     description: Deletes the event-participant link.
 *     tags:
 *       - Works
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: eventParticipantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Participant removed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
workRoute.delete(
    '/:id/events/:eventId/participants/:eventParticipantId',
    generalRateLimiter,
    controllerWrapper(validateWorkId()),
    controllerWrapper(eventController.unlinkParticipant)
);

export default workRoute;
