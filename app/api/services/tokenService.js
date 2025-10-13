import { Token } from '../models/token.js';

async function createToken(payload, { transaction } = {}) {
    await Token.create(payload, { transaction });
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

async function destroyToken(token, { transaction } = {}) {
    await token.destroy({ transaction });
}

async function destroyTokenByOwnerId(ownerId, { transaction } = {}) {
    await Token.destroy({ where: { owner_id: ownerId, scope: '*' }, transaction });
}

export default {
    createToken,
    getTokenByTokenValue,
    destroyToken,
    destroyTokenByOwnerId,
};
