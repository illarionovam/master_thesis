import { Token } from '../models/token.js';

const createToken = async (payload, { transaction } = {}) => {
    return Token.create(payload, { transaction });
};

const getTokenByTokenValue = async (tokenValue, { transaction } = {}) => {
    return Token.findOne({
        where: { token: tokenValue },
        transaction,
    });
};

const destroyToken = async (token, { transaction } = {}) => {
    await token.destroy({ transaction });
};

const destroyTokenByOwnerId = async (ownerId, { transaction } = {}) => {
    await Token.destroy({
        where: { owner_id: ownerId, scope: '*' },
        transaction,
    });
};

export default {
    createToken,
    getTokenByTokenValue,
    destroyToken,
    destroyTokenByOwnerId,
};
