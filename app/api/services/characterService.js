import { Character } from '../models/character.js';
import { CharacterInWork } from '../models/characterInWork.js';

const createCharacter = async (payload, { transaction } = {}) => {
    return Character.create(payload, { transaction });
};

const getCharacter = async (id, ownerId, { transaction } = {}) => {
    return Character.findOne({
        where: { id, owner_id: ownerId },
        transaction,
    });
};

const getCharacters = async (ownerId, { transaction } = {}) => {
    return Character.findAll({
        where: { owner_id: ownerId },
        transaction,
    });
};

const getCharactersNotLinkedToWork = async (workId, ownerId, { transaction } = {}) => {
    return Character.findAll({
        where: {
            owner_id: ownerId,
            '$appearances.id$': null,
        },
        include: [
            {
                model: CharacterInWork,
                as: 'appearances',
                required: false,
                attributes: [],
                where: { work_id: workId },
            },
        ],
        transaction,
        subQuery: false,
    });
};

const updateCharacter = async (character, payload, { transaction } = {}) => {
    character.set(payload);
    await character.save({ transaction });
};

const destroyCharacter = async (character, { transaction } = {}) => {
    await character.destroy({ transaction });
};

export default {
    createCharacter,
    getCharacter,
    getCharacters,
    getCharactersNotLinkedToWork,
    updateCharacter,
    destroyCharacter,
};
