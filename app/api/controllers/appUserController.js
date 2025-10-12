import { Sequelize } from 'sequelize';
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
        avatar_url: appUser.avatar_url,
    };
};

const signUpAppUser = async (req, res) => {
    const { username, email, password, name } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    try {
        await appUserService.createAppUser({
            username,
            email,
            hash_password: hashPassword,
            name: normalizeOptionalText(name),
        });
    } catch (err) {
        if (!(err instanceof Sequelize.UniqueConstraintError)) {
            throw err;
        }
    }

    // тут сказати, що відправили імейл на підтвердження
    // якщо в нас Sequelize.UniqueConstraintError; - значить, такий юзер вже є, але це небезпечно показувати 209 конфлікт, так як це загроза enumeration
    // тому в такому випадку просто кажемо, що відправили імейл, але не відправляємо

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
        // тут показуємо плашку, шо ніфіга, треба підтвердити імейл, проглянь свою пошту
        // якщо загубив, запропонувати прислати знову
        // так як введено правильний пароль, то це не енумерація, дозволено показати, що відправляємо мейл
        // у такому разі не даємо юзеру токен
    }

    const token = jwt.sign({ iss: appUser.id, scope: '*' }, process.env.JWT_SECRET, { expiresIn: '1d' });
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
        await tokenService.destroyTokenByTokenValue(req.token);
    }
    res.sendStatus(204);
};

const resetAppUserPassword = async (req, res) => {
    // тут саме forgot password, тобто ендпойнт працює без токена, відправка на імейл юзера лінки з токеном із scope=password_reset
    // там вже дозволяється замінити пароль, і тоді вже викликається updateAppUserNormalFields
};

const confirmAppUserPassword = async (req, res) => {
    const { newPassword } = req.body ?? {};

    const appUser = await appUserService.getAppUser(req.appUser.id);

    if (appUser == null) {
        throw createHttpError(404, 'User not found');
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    await appUserService.updateAppUser(appUser, { hash_password: hashPassword });

    res.sendStatus(200);
};

const updateAppUserEmail = async (req, res) => {
    const { newEmail } = req.body ?? {};

    const appUser = await appUserService.getAppUser(req.appUser.id);

    if (appUser == null) {
        throw createHttpError(404, 'User not found');
    }

    if (newEmail != null) {
        await appUserService.updateAppUser(appUser, { new_email: newEmail.trim() });
        // тут відправляємо імейл на підтвердження з токеном scope=email_verify
    }

    res.sendStatus(200); // завжди 200, щоб не було енумерації, просто пишемо, що відправили на мейл, навіть якщо такий мейл вже є в базі
};

const confirmAppUserEmail = async (req, res) => {
    const appUser = await appUserService.getAppUser(req.appUser.id);

    if (appUser == null) {
        throw createHttpError(404, 'User not found');
    }

    const payload = {};

    if (!appUser.verified) {
        payload.verified = true;
    } else {
        payload.email = appUser.new_email;
        payload.new_email = null;
    }

    await appUserService.updateAppUser(appUser, payload);
    res.sendStatus(200);
};

const updateAppUserNormalFields = async (req, res) => {
    const { name, username, newPassword, avatarUrl, password } = req.body ?? {};

    const appUser = await appUserService.getAppUser(req.appUser.id);

    if (appUser == null) {
        throw createHttpError(404, 'User not found');
    }

    const payload = {};

    if (typeof name !== 'undefined') payload.name = normalizeOptionalText(name); // дозволяємо занулити
    if (username != null) payload.username = username.trim(); // тут лише замінити, занулити НЕ дозволяємо
    if (typeof avatarUrl !== 'undefined') payload.avatar_url = normalizeOptionalText(avatarUrl); // дозволяємо занулити

    const wantsPasswordChange = typeof newPassword === 'string' && newPassword.trim() !== '';

    if (wantsPasswordChange) {
        if (typeof password !== 'string' || password.length === 0) {
            throw createHttpError(400, 'Current password is required to set a new password');
        }

        const passwordIsCorrect = await bcrypt.compare(password, appUser.hash_password);

        if (!passwordIsCorrect) {
            throw createHttpError(401, 'Incorrect credentials');
        }

        payload.hash_password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(payload).length > 0) {
        await appUserService.updateAppUser(appUser, payload);
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
