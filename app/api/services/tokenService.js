import { Token } from '../models/token.js';

async function createToken(payload, { transaction } = {}) {
    const token = await Token.create(payload, { transaction });

    return token;
}

export default {
    createToken,
};
