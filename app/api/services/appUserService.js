import { Sequelize } from 'sequelize';
import { AppUser } from '../models/appUser.js';

async function createAppUser({ username, email, hash_password, name, avatar_url }, { transaction } = {}) {
    try {
        const appUser = await AppUser.create(
            {
                username,
                email,
                hash_password,
                name: name ?? null,
                avatar_url: avatar_url ?? null,
            },
            { transaction }
        );

        return {
            id: appUser.id,
            username: appUser.username,
            email: appUser.email,
            name: appUser.name,
            avatar_url: appUser.avatar_url,
            created_at: appUser.created_at,
            updated_at: appUser.updated_at,
        };
    } catch (err) {
        if (err instanceof Sequelize.UniqueConstraintError) {
            err.status = 409;
            err.message = 'User already exists';
        } else if (err instanceof Sequelize.ValidationError) {
            err.status = 400;
            err.message = `Validation failed: ${err.errors?.[0]?.message}.`;
        }
        throw err;
    }
}

export default {
    createAppUser,
};
