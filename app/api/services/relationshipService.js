import { Relationship } from '../models/relationship.js';
import { CharacterInWork } from '../models/characterInWork.js';
import characterInWorkService from './characterInWorkService.js';
import { Op } from 'sequelize';

const baseInclude = [
    {
        model: CharacterInWork,
        as: 'from',
        required: true,
        attributes: [],
        include: characterInWorkService.baseInclude,
    },
    {
        model: CharacterInWork,
        as: 'to',
        required: true,
        attributes: [],
        include: characterInWorkService.baseInclude,
    },
];

const createRelationship = async (payload, { transaction } = {}) => {
    return Relationship.create(payload, { transaction });
};

const getRelationship = async (id, { transaction } = {}) => {
    return Relationship.findOne({
        where: { id },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getRelationships = async (characterInWorkId, workId, { transaction } = {}) => {
    return Relationship.findAll({
        where: { from_character_in_work_id: characterInWorkId, '$to.work_id$': workId },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getPossibleRelationships = async (characterInWorkId, workId, { transaction } = {}) => {
    return CharacterInWork.findAll({
        where: {
            work_id: workId,
            id: { [Op.ne]: characterInWorkId },
            '$relsFromThis.id$': null,
        },
        include: [
            characterInWorkService.baseInclude,
            {
                model: Relationship,
                as: 'incomingRelationships',
                attributes: [],
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
