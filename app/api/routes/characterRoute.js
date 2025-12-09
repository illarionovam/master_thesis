import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import characterController from '../controllers/characterController.js';
import validateBody from '../middlewares/validateBody.js';
import characterValidator from '../validators/characterValidator.js';
import { validateCharacterId } from '../middlewares/validateId.js';
import { generalRateLimiter, generationRateLimiter } from '../middlewares/rateLimiters.js';

const characterRoute = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Character:
 *       type: object
 *       description: Full character entity
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         appearance:
 *           type: string
 *         personality:
 *           type: string
 *         bio:
 *           type: string
 *         attributes:
 *           type: object
 *           additionalProperties: true
 *           description: Arbitrary structured attributes for the character
 *         image_url:
 *           type: string
 *           format: uri
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     CharacterListItem:
 *       type: object
 *       description: Lightweight character representation used in lists
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     WorkListItem:
 *       type: object
 *       description: Lightweight work representation
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *     CharacterInWorkListItem:
 *       type: object
 *       description: Character appearance in a work
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
 *     CharacterCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - appearance
 *         - personality
 *         - bio
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *         appearance:
 *           type: string
 *           minLength: 1
 *           maxLength: 3000
 *         personality:
 *           type: string
 *           minLength: 1
 *           maxLength: 3000
 *         bio:
 *           type: string
 *           minLength: 1
 *           maxLength: 6000
 *         attributes:
 *           type: object
 *           additionalProperties: true
 *           description: Optional JSON object with custom attributes
 *     CharacterUpdateInput:
 *       oneOf:
 *         - type: object
 *           description: Update core character fields
 *           properties:
 *             name:
 *               type: string
 *             appearance:
 *               type: string
 *             personality:
 *               type: string
 *             bio:
 *               type: string
 *             attributes:
 *               type: object
 *               additionalProperties: true
 *         - type: object
 *           description: Update only the image URL
 *           required:
 *             - image_url
 *           properties:
 *             image_url:
 *               oneOf:
 *                 - type: string
 *                   format: uri
 *                 - type: "null"
 */

characterRoute.use(controllerWrapper(authMiddleware.authMiddleware));

/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: List characters
 *     description: Returns all characters owned by the currently authenticated user (stripped to id and name).
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of characters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CharacterListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unverified email
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Create a new character
 *     description: Creates a character owned by the authenticated user.
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CharacterCreateInput'
 *     responses:
 *       201:
 *         description: Character created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
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
characterRoute.get('/', generalRateLimiter, controllerWrapper(characterController.getCharacters));
characterRoute.post(
    '/',
    generalRateLimiter,
    controllerWrapper(validateBody(characterValidator.createCharacterValidator)),
    controllerWrapper(characterController.createCharacter)
);

/**
 * @swagger
 * /api/characters/{id}:
 *   get:
 *     summary: Get a character by ID
 *     description: Returns a single character owned by the authenticated user.
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Character ID
 *     responses:
 *       200:
 *         description: Character found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (character not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 *   patch:
 *     summary: Update a character
 *     description: >
 *       Updates either core character fields (name, appearance, personality, bio, attributes)
 *       or only the image URL. These two modes are mutually exclusive.
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Character ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CharacterUpdateInput'
 *     responses:
 *       200:
 *         description: Character updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (character not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete a character
 *     description: Deletes a character owned by the authenticated user.
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Character ID
 *     responses:
 *       204:
 *         description: Character deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (character not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
characterRoute.get(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacter)
);
characterRoute.patch(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(validateBody(characterValidator.updateCharacterValidator)),
    controllerWrapper(characterController.updateCharacter)
);
characterRoute.delete(
    '/:id',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.destroyCharacter)
);

/**
 * @swagger
 * /api/characters/{id}/generate:
 *   post:
 *     summary: Generate an image for the character
 *     description: >
 *       Uses the character's appearance and attributes to generate an image with AI,
 *       uploads it, saves the resulting URL to `image_url`, and returns the updated character.
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Character ID
 *     responses:
 *       200:
 *         description: Image generated and character updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Character'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (character not found or does not belong to the user)
 *       429:
 *         description: Too many requests (generation rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
characterRoute.post(
    '/:id/generate',
    generationRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.generateImageUrl)
);

/**
 * @swagger
 * /api/characters/{id}/appearances:
 *   get:
 *     summary: List character appearances in works
 *     description: Returns all appearances of this character in different works.
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Character ID
 *     responses:
 *       200:
 *         description: List of character appearances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CharacterInWorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (character not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 * /api/characters/{id}/appearances/available:
 *   get:
 *     summary: List works where character can still appear
 *     description: >
 *       Returns works owned by the user where this character is not yet linked and can be added.
 *     tags:
 *       - Characters
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Character ID
 *     responses:
 *       200:
 *         description: List of works where the character can be added
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WorkListItem'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (character not found or does not belong to the user)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
characterRoute.get(
    '/:id/appearances',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacterAppearances)
);
characterRoute.get(
    '/:id/appearances/available',
    generalRateLimiter,
    controllerWrapper(validateCharacterId()),
    controllerWrapper(characterController.getCharacterPossibleAppearances)
);

export default characterRoute;
