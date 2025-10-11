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
        // у такому разі не даємо юзеру токен
    }

    const token = jwt.sign({ id: appUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await tokenService.createToken({ owner_id: appUser.id, token });

    res.json({
        token,
        ...stripAppUserResponse(appUser),
    });
};

const signOutAppUser = async (req, res) => {
    const { terminateAllSessions } = req.body;
    if (terminateAllSessions === true) {
        await tokenService.destroyTokenByOwnerId(req.appUser.id);
    } else {
        await tokenService.destroyTokenByTokenValue(req.token);
    }
    res.sendStatus(204);
};

export default {
    signUpAppUser,
    signInAppUser,
    signOutAppUser,
};
