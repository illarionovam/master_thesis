import { AppUser } from '../models/appUser.js';

async function createAppUser(payload, { transaction } = {}) {
    await AppUser.create(payload, { transaction });
}

async function getAppUser(id, { transaction } = {}) {
    return AppUser.findByPk(id, { transaction });
}

async function getAppUserByEmail(email, { transaction } = {}) {
    return AppUser.findOne({
        where: {
            email: email,
        },
        transaction,
    });
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
