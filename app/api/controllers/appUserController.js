import { Sequelize } from 'sequelize';
import { sequelize } from '../db/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import appUserService from '../services/appUserService.js';
import tokenService from '../services/tokenService.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';

const stripAppUserResponse = appUser => {
    return {
        id: appUser.id,
        username: appUser.username,
        email: appUser.email,
        name: appUser.name,
        avatarUrl: appUser.avatar_url,
        updatedAt: appUser.updated_at,
        createdAt: appUser.created_at,
    };
};

const signUpAppUser = async (req, res) => {
    const { username, email, password, name } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        await appUserService.createAppUser({
            username: username.trim(),
            email: email.trim(),
            hash_password: hashPassword,
            name: normalizeOptionalText(name),
        });
    } catch (err) {
        if (!(err instanceof Sequelize.UniqueConstraintError)) {
            throw err;
        }
    }

    res.sendStatus(201);
};

const signInAppUser = async (req, res) => {
    const { email, password } = req.body;

    const appUser = await appUserService.getAppUserByEmail(email);

    if (appUser == null) {
        throw createHttpError(401, 'Incorrect credentials');
    }

    const passwordIsCorrect = await bcrypt.compare(password, appUser.hash_password);

    if (!passwordIsCorrect) {
        throw createHttpError(401, 'Incorrect credentials');
    }

    if (!appUser.verified) {
        throw createHttpError(403, 'Unverified email');
    }

    const token = jwt.sign({ sub: appUser.id, scope: '*' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await tokenService.createToken({ owner_id: appUser.id, token, scope: '*' });

    res.json({
        token,
        ...stripAppUserResponse(appUser),
    });
};

const signOutAppUser = async (req, res) => {
    const { terminateAllSessions } = req.body ?? {};
    if (terminateAllSessions === true) {
        await tokenService.destroyTokenByOwnerId(req.appUser.id);
    } else {
        await tokenService.destroyToken(req.token);
    }
    res.sendStatus(204);
};

const resetAppUserPassword = async (req, res) => {
    const { email } = req.body;

    const appUser = await appUserService.getAppUserByEmail(email);

    if (appUser != null) {
        const token = jwt.sign({ sub: appUser.id, scope: 'password_reset' }, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });
        await tokenService.createToken({ owner_id: appUser.id, token, scope: 'password_reset' });
    }

    res.sendStatus(200);
};

const confirmAppUserPassword = async (req, res) => {
    const { newPassword } = req.body;

    const hashPassword = await bcrypt.hash(newPassword, 10);

    await sequelize.transaction(async t => {
        await appUserService.updateAppUser(req.appUser, { hash_password: hashPassword }, { transaction: t });
        await tokenService.destroyToken(req.token, { transaction: t });
    });

    res.sendStatus(200);
};

const updateAppUserEmail = async (req, res) => {
    const { newEmail } = req.body;

    if (newEmail != null) {
        await sequelize.transaction(async t => {
            await appUserService.updateAppUser(req.appUser, { new_email: newEmail.trim() }, { transaction: t });
            const token = jwt.sign({ sub: req.appUser.id, scope: 'email_verify' }, process.env.JWT_SECRET, {
                expiresIn: '15m',
            });
            await tokenService.createToken(
                { owner_id: req.appUser.id, token, scope: 'email_verify' },
                { transaction: t }
            );
        });
    }

    res.sendStatus(200);
};

const confirmAppUserEmail = async (req, res) => {
    const payload = {};

    if (!req.appUser.verified) {
        payload.verified = true;
    } else {
        payload.email = req.appUser.new_email;
        payload.new_email = null;
    }

    await sequelize.transaction(async t => {
        await appUserService.updateAppUser(req.appUser, payload, { transaction: t });
        await tokenService.destroyToken(req.token, { transaction: t });
    });

    res.sendStatus(200);
};

const updateAppUserNormalFields = async (req, res) => {
    const { name, username, newPassword, avatarUrl, password } = req.body ?? {};

    const payload = {};

    if (typeof name !== 'undefined') payload.name = normalizeOptionalText(name);
    if (username != null) payload.username = username.trim();
    if (typeof avatarUrl !== 'undefined') payload.avatar_url = normalizeOptionalText(avatarUrl);

    const wantsPasswordChange = typeof newPassword === 'string' && newPassword.trim() !== '';

    if (wantsPasswordChange) {
        if (typeof password !== 'string' || password.length === 0) {
            throw createHttpError(400, 'Current password is required to set a new password');
        }

        const passwordIsCorrect = await bcrypt.compare(password, req.appUser.hash_password);

        if (!passwordIsCorrect) {
            throw createHttpError(401, 'Incorrect credentials');
        }

        payload.hash_password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(payload).length > 0) {
        await appUserService.updateAppUser(req.appUser, payload);
    }

    res.sendStatus(200);
};

export default {
    signUpAppUser,
    signInAppUser,
    signOutAppUser,
    resetAppUserPassword,
    confirmAppUserPassword,
    updateAppUserEmail,
    confirmAppUserEmail,
    updateAppUserNormalFields,
};
