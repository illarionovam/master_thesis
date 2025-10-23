import { CharacterInWork } from '../models/characterInWork.js';
import { Work } from '../models/work.js';
import { Character } from '../models/character.js';
import { EventParticipant } from '../models/eventParticipant.js';

const baseInclude = [
    { model: Work, as: 'work', required: true },
    { model: Character, as: 'character', required: true },
];

const createCharacterInWork = async (payload, { transaction } = {}) => {
    return CharacterInWork.create(payload, { transaction });
};

const getCharacterInWork = async (id, { transaction } = {}) => {
    return CharacterInWork.findOne({
        where: { id },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getCharactersInWorkByWorkId = async (workId, { transaction } = {}) => {
    return CharacterInWork.findAll({
        where: { work_id: workId },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getCharactersInWorkByCharacterId = async (characterId, { transaction } = {}) => {
    return CharacterInWork.findAll({
        where: { character_id: characterId },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getCharactersInWorkNotLinkedToEvent = async (event, { transaction } = {}) => {
    return CharacterInWork.findAll({
        where: {
            work_id: event.work_id,
            '$participations.id$': null,
        },
        include: [
            ...baseInclude,
            {
                model: EventParticipant,
                as: 'participations',
                required: false,
                where: { event_id: event.id },
            },
        ],
        transaction,
        subQuery: false,
    });
};

const updateCharacterInWork = async (characterInWork, payload, { transaction } = {}) => {
    characterInWork.set(payload);
    return characterInWork.save({ transaction });
};

const destroyCharacterInWork = async (characterInWork, { transaction } = {}) => {
    await characterInWork.destroy({ transaction });
};

export default {
    createCharacterInWork,
    getCharacterInWork,
    getCharactersInWorkByWorkId,
    getCharactersInWorkByCharacterId,
    getCharactersInWorkByWorkId,
    getCharactersInWorkNotLinkedToEvent,
    updateCharacterInWork,
    destroyCharacterInWork,
};
