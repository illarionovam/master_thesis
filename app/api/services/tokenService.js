import { Token } from '../models/token.js';

async function createToken(payload, { transaction } = {}) {
    await Token.create(payload, { transaction });
}

async function getTokenByTokenValue(tokenValue, { transaction } = {}) {
    return Token.findOne({
        where: {
            token: tokenValue,
        },
        transaction,
    });
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
