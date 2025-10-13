import { Character } from '../models/character.js';

async function createCharacter(payload, { transaction } = {}) {
    return Character.create(payload, { transaction });
}

async function getCharacter(id, ownerId, { transaction } = {}) {
    return Character.findOne({
        where: {
            id,
            owner_id: ownerId,
        },
        transaction,
    });
}

async function getCharacters(ownerId, { transaction } = {}) {
    return Character.findAll({
        where: {
            owner_id: ownerId,
        },
        transaction,
    });
}

async function updateCharacter(character, payload, { transaction } = {}) {
    character.set(payload);
    await character.save({ transaction });
}

async function destroyCharacter(character, { transaction } = {}) {
    await character.destroy({ transaction });
}

export default {
    createCharacter,
    getCharacter,
    getCharacters,
    updateCharacter,
    destroyCharacter,
};
