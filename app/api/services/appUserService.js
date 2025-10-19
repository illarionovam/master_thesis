import { Op } from 'sequelize';
import { AppUser } from '../models/appUser.js';

export const createAppUser = async (payload, { transaction } = {}) => {
    return AppUser.create(payload, { transaction });
};

export const getAppUser = async (id, { transaction } = {}) => {
    return AppUser.findByPk(id, { transaction });
};

export const getAppUserByEmail = async (email, { transaction } = {}) => {
    return AppUser.findOne({
        where: { email },
        transaction,
    });
};

export const updateAppUser = async (appUser, payload, { transaction } = {}) => {
    appUser.set(payload);
    await appUser.save({ transaction });
};

export default {
    createAppUser,
    getAppUser,
    getAppUserByEmail,
    updateAppUser,
};
