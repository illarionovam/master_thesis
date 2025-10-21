import { Relationship } from '../models/relationship.js';
import { CharacterInWork } from '../models/characterInWork.js';
import { Work } from '../models/work.js';
import { Character } from '../models/character.js';
import { Op } from 'sequelize';

const createRelationship = async (payload, { transaction } = {}) => {
    return Relationship.create(payload, { transaction });
};

const getRelationship = async (id, { transaction } = {}) => {
    return Relationship.findOne({
        where: { id },
        include: [
            {
                model: CharacterInWork,
                as: 'from',
                required: true,
                include: [
                    { model: Work, as: 'work', required: true },
                    { model: Character, as: 'character', required: true },
                ],
            },
            {
                model: CharacterInWork,
                as: 'to',
                required: true,
                include: [
                    { model: Work, as: 'work', required: true },
                    { model: Character, as: 'character', required: true },
                ],
            },
        ],
        transaction,
        subQuery: false,
    });
};

const getRelationships = async (characterInWorkId, workId, { transaction } = {}) => {
    return Relationship.findAll({
        where: { from_character_in_work_id: characterInWorkId },
        include: [
            {
                model: CharacterInWork,
                as: 'from',
                required: true,
                include: [
                    { model: Work, as: 'work', required: true },
                    { model: Character, as: 'character', required: true },
                ],
            },
            {
                model: CharacterInWork,
                as: 'to',
                required: true,
                where: { work_id: workId },
                include: [
                    { model: Work, as: 'work', required: true },
                    { model: Character, as: 'character', required: true },
                ],
            },
        ],
        transaction,
        subQuery: false,
    });
};

const getPossibleRelationships = async (characterInWorkId, workId, { transaction } = {}) => {
    return CharacterInWork.findAll({
        where: {
            work_id: workId,
            id: { [Op.ne]: characterInWorkId },
            '$incomingRelationships.id$': null,
        },
        include: [
            { model: Work, as: 'work', required: true },
            { model: Character, as: 'character', required: true },

            {
                model: Relationship,
                as: 'incomingRelationships',
                required: false,
                where: { from_character_in_work_id: characterInWorkId },
            },
        ],
        transaction,
        subQuery: false,
    });
};

const updateRelationship = async (relationship, payload, { transaction } = {}) => {
    relationship.set(payload);
    return relationship.save({ transaction });
};

const destroyRelationship = async (relationship, { transaction } = {}) => {
    await relationship.destroy({ transaction });
};

export default {
    createRelationship,
    getRelationship,
    getRelationships,
    getPossibleRelationships,
    updateRelationship,
    destroyRelationship,
};
