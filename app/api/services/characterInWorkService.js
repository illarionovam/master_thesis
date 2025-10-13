import { CharacterInWork } from '../models/characterInWork.js';
import { Work } from '../models/work.js';
import { Character } from '../models/character.js';

async function createCharacterInWork(payload, { transaction } = {}) {
    return CharacterInWork.create(payload, { transaction });
}

async function getCharacterInWork(id, ownerId, { transaction } = {}) {
    return CharacterInWork.findOne({
        where: { id },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Character,
                as: 'character',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getCharacterInWorkByWorkIdAndCharacterId(workId, characterId, ownerId, { transaction } = {}) {
    return CharacterInWork.findOne({
        where: { work_id: workId, character_id: characterId },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Character,
                as: 'character',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getCharactersInWorkByWorkId(workId, ownerId, { transaction } = {}) {
    return CharacterInWork.findAll({
        where: { work_id: workId },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Character,
                as: 'character',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getCharactersInWorkByCharacterId(characterId, ownerId, { transaction } = {}) {
    return CharacterInWork.findAll({
        where: { character_id: characterId },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Character,
                as: 'character',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getCharactersInWork(ownerId, { transaction } = {}) {
    return CharacterInWork.findAll({
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Character,
                as: 'character',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function updateCharacterInWork(characterInWork, payload, { transaction } = {}) {
    characterInWork.set(payload);
    await characterInWork.save({ transaction });
}

async function destroyCharacter(characterInWork, { transaction } = {}) {
    await characterInWork.destroy({ transaction });
}

export default {
    createCharacterInWork,
    getCharacterInWork,
    getCharacterInWorkByWorkIdAndCharacterId,
    getCharactersInWork,
    getCharactersInWorkByCharacterId,
    getCharactersInWorkByWorkId,
    updateCharacterInWork,
    destroyCharacter,
};
