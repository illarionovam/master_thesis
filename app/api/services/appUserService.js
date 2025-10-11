import { Sequelize } from 'sequelize';
import { AppUser } from '../models/appUser.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';
import { constructValidationError } from '../helpers/constructValidationError.js';
import createHttpError from 'http-errors';

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

async function createAppUser({ username, email, hash_password, name }, { transaction } = {}) {
    try {
        const appUser = await AppUser.create(
            {
                username,
                email,
                hash_password,
                name: normalizeOptionalText(name),
            },
            { transaction }
        );

        return stripAppUserResponse(appUser);
    } catch (err) {
        console.log(err);
        if (err instanceof Sequelize.UniqueConstraintError) {
            throw createHttpError(409, 'User already exists');
        } else if (err instanceof Sequelize.ValidationError) {
            throw createHttpError(400, `Validation failed: ${constructValidationError(err)}`);
        }
        throw err;
    }
}

async function getAppUser(id, { transaction } = {}) {
    const appUser = await AppUser.findByPk(id, { transaction });

    if (appUser == null) {
        throw createHttpError(404, 'User not found');
    }

    return stripAppUserResponse(appUser);
}

async function updateAppUser(appUser, payload, { transaction } = {}) {
    try {
        appUser.set(payload);
        await appUser.save({ transaction });

        return stripAppUserResponse(appUser);
    } catch (err) {
        if (err instanceof Sequelize.ValidationError) {
            throw createHttpError(400, `Validation failed: ${constructValidationError(err)}`);
        }
        throw err; // тут дублі не викидаємо одразу звідси, бо в контролері це викликатимуть різні функції, і помилка буде різною.
    }
}

export default {
    createAppUser,
    getAppUser,
    updateAppUser,
};
