import { AppUser } from '../models/appUser.js';

const createAppUser = async (payload, { transaction } = {}) => {
    return AppUser.create(payload, { transaction });
};

const getAppUser = async (id, { transaction } = {}) => {
    return AppUser.findByPk(id, { transaction });
};

const getAppUserByEmail = async (email, { transaction } = {}) => {
    return AppUser.findOne({
        where: { email },
        transaction,
    });
};

const updateAppUser = async (appUser, payload, { transaction } = {}) => {
    appUser.set(payload);
    await appUser.save({ transaction });
};

export default {
    createAppUser,
    getAppUser,
    getAppUserByEmail,
    updateAppUser,
};
