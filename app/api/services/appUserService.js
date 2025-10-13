import { AppUser } from '../models/appUser.js';

async function createAppUser(payload, { transaction } = {}) {
    await AppUser.create(payload, { transaction });
}

async function getAppUser(id, { transaction } = {}) {
    const appUser = await AppUser.findByPk(id, { transaction });

    return appUser;
}

async function getAppUserByEmail(email, { transaction } = {}) {
    const appUser = await AppUser.findOne({
        where: {
            email: email,
        },
        transaction,
    });

    return appUser;
}

async function updateAppUser(appUser, payload, { transaction } = {}) {
    appUser.set(payload);
    await appUser.save({ transaction });
}

export default {
    createAppUser,
    getAppUser,
    getAppUserByEmail,
    updateAppUser,
};
