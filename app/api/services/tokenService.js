import { Token } from '../models/token.js';

async function createToken(payload, { transaction } = {}) {
    const token = await Token.create(payload, { transaction });

    return token;
}

async function getTokenByTokenValue(tokenValue, { transaction } = {}) {
    const token = await Token.findOne({
        where: {
            token: tokenValue,
        },
        transaction,
    });

    return token;
}

async function destroyTokenByOwnerId(ownerId, { transaction } = {}) {
    await Token.destroy({ where: { owner_id: ownerId }, transaction });
}

async function destroyTokenByTokenValue(tokenValue, { transaction } = {}) {
    await Token.destroy({ where: { token: tokenValue }, transaction });
}

export default {
    createToken,
    getTokenByTokenValue,
    destroyTokenByOwnerId,
    destroyTokenByTokenValue,
};
