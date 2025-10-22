import { Sequelize } from 'sequelize';
import { sequelize } from '../db/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import appUserService from '../services/appUserService.js';
import tokenService from '../services/tokenService.js';

const stripAppUserResponse = appUser => {
    return {
        id: appUser.id,
        username: appUser.username,
        email: appUser.email,
        name: appUser.name,
        avatar_url: appUser.avatar_url,
        created_at: appUser.created_at,
        updated_at: appUser.updated_at,
    };
};

const signUpAppUser = async (req, res) => {
    const { password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        await sequelize.transaction(async t => {
            const appUser = await appUserService.createAppUser({
                hash_password: hashPassword,
                ...req.body,
            });
            const token = jwt.sign({ sub: appUser.id, scope: 'email_verify' }, process.env.JWT_SECRET, {
                expiresIn: '15m',
            });
            await tokenService.createToken({ owner_id: appUser.id, token, scope: 'email_verify' }, { transaction: t });
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
    const { terminate_all_sessions } = req.body;
    if (terminate_all_sessions) {
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
    const { new_password } = req.body;

    const hashPassword = await bcrypt.hash(new_password, 10);

    await sequelize.transaction(async t => {
        await appUserService.updateAppUser(req.appUser, { hash_password: hashPassword }, { transaction: t });
        await tokenService.destroyToken(req.token, { transaction: t });
    });

    res.sendStatus(200);
};

const updateAppUserEmail = async (req, res) => {
    const { new_email } = req.body;

    await sequelize.transaction(async t => {
        await appUserService.updateAppUser(req.appUser, { new_email }, { transaction: t });
        const token = jwt.sign({ sub: req.appUser.id, scope: 'email_verify' }, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });
        await tokenService.createToken({ owner_id: req.appUser.id, token, scope: 'email_verify' }, { transaction: t });
    });

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

    res.json(stripAppUserResponse(req.appUser));
};

const updateAppUserNormalFields = async (req, res) => {
    const { new_password, password } = req.body;
    const wantsPasswordChange = password != null && new_password != null;

    if (wantsPasswordChange) {
        const passwordIsCorrect = await bcrypt.compare(password, req.appUser.hash_password);

        if (!passwordIsCorrect) {
            throw createHttpError(401, 'Incorrect credentials');
        }

        req.body.hash_password = await bcrypt.hash(new_password, 10);
    }

    await appUserService.updateAppUser(req.appUser, req.body);

    res.json(stripAppUserResponse(req.appUser));
};

const getAppUser = async (req, res) => {
    res.json(stripAppUserResponse(req.appUser));
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
    getAppUser,
};
