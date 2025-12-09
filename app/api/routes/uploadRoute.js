import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import uploadController from '../controllers/uploadController.js';
import uploadSingle from '../middlewares/upload.js';
import { generationRateLimiter } from '../middlewares/rateLimiters.js';

const uploadRoute = express.Router();

uploadRoute.use(controllerWrapper(authMiddleware.authMiddleware));

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image file
 *     description: >
 *       Accepts a single image file and returns a public URL after uploading it
 *       to cloud storage.
 *       Allowed types: PNG, JPEG, WEBP, GIF, SVG.
 *       Max size: 5 MB.
 *     tags:
 *       - Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: Public URL of the uploaded image
 *       400:
 *         description: No file provided or invalid file type
 *       401:
 *         description: Unauthorized (missing, invalid or expired token)
 *       403:
 *         description: Forbidden (unverified email or insufficient scope)
 *       413:
 *         description: File too large
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
uploadRoute.post(
    '/',
    generationRateLimiter,
    controllerWrapper(uploadSingle),
    controllerWrapper(uploadController.uploadImage)
);

export default uploadRoute;
