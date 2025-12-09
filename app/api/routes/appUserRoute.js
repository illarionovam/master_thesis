import express from 'express';

import authMiddleware from '../middlewares/authMiddleware.js';
import appUserController from '../controllers/appUserController.js';
import controllerWrapper from '../decorators/controllerWrapper.js';
import validateBody from '../middlewares/validateBody.js';
import appUserValidator from '../validators/appUserValidator.js';
import { authRateLimiter, authSlowDown, generalRateLimiter } from '../middlewares/rateLimiters.js';

const appUserRoute = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     AppUser:
 *       type: object
 *       description: Stripped user object returned by auth endpoints
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         name:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/auth/verify:
 *   post:
 *     summary: Request email verification link
 *     description: >
 *       Triggers sending a verification email with a short-lived token,
 *       if the user exists and is not yet verified.
 *       Always returns 200 to avoid leaking whether the email is registered.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User email address
 *     responses:
 *       200:
 *         description: Verification email sent if applicable
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.post(
    '/verify',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.verifyAppUserEmailValidator)),
    controllerWrapper(appUserController.verifyAppUserEmail)
);

/**
 * @swagger
 * /api/auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     description: >
 *       Creates a new user account and sends a verification email with a short-lived token.
 *       If a user with the same email already exists, the operation is effectively ignored
 *       and 201 is still returned (idempotent behavior from the client's perspective).
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 60
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *               name:
 *                 oneOf:
 *                   - type: string
 *                     minLength: 1
 *                     maxLength: 255
 *                   - type: "null"
 *                 description: Optional display name; may be null or a non-empty string
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 20
 *                 pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'
 *                 description: >
 *                   8-20 characters; must include at least 1 lowercase letter,
 *                   1 uppercase letter, and 1 digit.
 *     responses:
 *       201:
 *         description: User created (or already exists) and verification email sent
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.post(
    '/sign-up',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.signUpAppUserValidator)),
    controllerWrapper(appUserController.signUpAppUser)
);

/**
 * @swagger
 * /api/auth/sign-in:
 *   post:
 *     summary: Sign in with email and password
 *     description: >
 *       Authenticates the user with email and password and returns a JWT access token.
 *       The email must be verified before sign-in is allowed.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email used during registration
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Sign-in successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT access token
 *                 - $ref: '#/components/schemas/AppUser'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Incorrect credentials
 *       403:
 *         description: Email not verified
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.post(
    '/sign-in',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.signInAppUserValidator)),
    controllerWrapper(appUserController.signInAppUser)
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request password reset link
 *     description: >
 *       Triggers sending a password reset email with a short-lived token,
 *       if the user exists.
 *       Always returns 200 to avoid leaking whether the email is registered.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email address
 *     responses:
 *       200:
 *         description: Password reset email sent if applicable
 *       400:
 *         description: Validation error
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.post(
    '/forgot-password',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.resetAppUserPasswordValidator)),
    controllerWrapper(appUserController.resetAppUserPassword)
);

appUserRoute.use(controllerWrapper(authMiddleware.authMiddleware));

/**
 * @swagger
 * /api/auth/user-info:
 *   get:
 *     summary: Get current user info
 *     description: Returns the profile of the currently authenticated user.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppUser'
 *       401:
 *         description: Unauthorized (missing, invalid or expired token)
 *       403:
 *         description: Unverified email
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.get('/user-info', generalRateLimiter, controllerWrapper(appUserController.getAppUser));

/**
 * @swagger
 * /api/auth/sign-out:
 *   post:
 *     summary: Sign out from current or all sessions
 *     description: >
 *       Invalidates the current access token or all tokens for the user,
 *       depending on the `terminate_all_sessions` flag.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               terminate_all_sessions:
 *                 type: boolean
 *                 default: false
 *                 description: >
 *                   If true, all active sessions for the user are terminated.
 *                   If false or omitted, only the current token is revoked.
 *     responses:
 *       204:
 *         description: Signed out successfully
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
appUserRoute.post(
    '/sign-out',
    generalRateLimiter,
    controllerWrapper(validateBody(appUserValidator.signOutAppUserValidator)),
    controllerWrapper(appUserController.signOutAppUser)
);

/**
 * @swagger
 * /api/auth/update:
 *   post:
 *     summary: Update profile or change password
 *     description: >
 *       Updates either profile fields (username and name) **or** changes the password.
 *       These two modes are mutually exclusive:
 *       - **Password change**: requires `password` and `new_password`.
 *       - **Profile update**: requires `username` (and optionally `name`), and forbids password fields.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 description: Change password
 *                 required:
 *                   - password
 *                   - new_password
 *                 properties:
 *                   password:
 *                     type: string
 *                     description: Current password
 *                   new_password:
 *                     type: string
 *                     minLength: 8
 *                     maxLength: 20
 *                     pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'
 *                     description: >
 *                       New password; 8-20 characters; must include at least 1 lowercase letter,
 *                       1 uppercase letter, and 1 digit.
 *               - type: object
 *                 description: Update username and name
 *                 required:
 *                   - username
 *                 properties:
 *                   username:
 *                     type: string
 *                     minLength: 3
 *                     maxLength: 60
 *                   name:
 *                     oneOf:
 *                       - type: string
 *                         minLength: 1
 *                         maxLength: 255
 *                       - type: "null"
 *                     description: Optional display name; may be null or a non-empty string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppUser'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unverified email
 *       422:
 *         description: Current password is incorrect (when attempting password change)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.post(
    '/update',
    generalRateLimiter,
    controllerWrapper(validateBody(appUserValidator.updateAppUserNormalFieldsValidator)),
    controllerWrapper(appUserController.updateAppUserNormalFields)
);

/**
 * @swagger
 * /api/auth/update-email:
 *   post:
 *     summary: Request email change
 *     description: >
 *       Starts the email change flow: stores the new email as pending and sends
 *       a verification email for confirmation.
 *       The actual email is updated only after `/api/auth/confirm-email`.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_email
 *             properties:
 *               new_email:
 *                 type: string
 *                 format: email
 *                 maxLength: 255
 *                 description: New email address to be verified
 *     responses:
 *       200:
 *         description: Email change requested and verification email sent
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
appUserRoute.post(
    '/update-email',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(validateBody(appUserValidator.updateAppUserEmailValidator)),
    controllerWrapper(appUserController.updateAppUserEmail)
);

/**
 * @swagger
 * /api/auth/confirm-password:
 *   post:
 *     summary: Confirm password reset
 *     description: >
 *       Completes the password reset flow.
 *       Requires a special token with scope `password_reset` obtained from the reset email link.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - new_password
 *             properties:
 *               new_password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 20
 *                 pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'
 *                 description: >
 *                   New password; 8-20 characters; must include at least 1 lowercase letter,
 *                   1 uppercase letter, and 1 digit.
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: >
 *           Forbidden (invalid scope; token does not have `password_reset` scope
 *           or email is not verified where required)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.post(
    '/confirm-password',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(authMiddleware.requireScope('password_reset')),
    controllerWrapper(validateBody(appUserValidator.confirmAppUserPasswordValidator)),
    controllerWrapper(appUserController.confirmAppUserPassword)
);

/**
 * @swagger
 * /api/auth/confirm-email:
 *   post:
 *     summary: Confirm email address
 *     description: >
 *       Confirms the user's email address.
 *       If the user is not verified yet, marks the account as verified.
 *       If an email change is in progress, applies `new_email` and clears the pending value.
 *       Requires a token with scope `email_verify` obtained from the verification email link.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Email confirmed successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (invalid scope; token does not have `email_verify` scope)
 *       429:
 *         description: Too many requests (rate limit exceeded)
 *       500:
 *         description: Internal server error
 */
appUserRoute.post(
    '/confirm-email',
    authRateLimiter,
    authSlowDown,
    controllerWrapper(authMiddleware.requireScope('email_verify')),
    controllerWrapper(appUserController.confirmAppUserEmail)
);

export default appUserRoute;
