import { Relationship as Relation } from '../models/relationship.js';
import { CharacterInWork } from '../models/characterInWork.js';
import { Character } from '../models/character.js';
import { Work } from '../models/work.js';

const includeFromToWithOwner = ownerId => [
    {
        model: CharacterInWork,
        as: 'from',
        required: true,
        include: [
            {
                model: Character,
                as: 'character',
                required: true,
                where: { owner_id: ownerId },
            },
            {
                model: Work,
                as: 'work',
                required: true,
                where: { owner_id: ownerId },
            },
        ],
    },
    {
        model: CharacterInWork,
        as: 'to',
        required: true,
        include: [
            {
                model: Character,
                as: 'character',
                required: true,
                where: { owner_id: ownerId },
            },
            {
                model: Work,
                as: 'work',
                required: true,
                where: { owner_id: ownerId },
            },
        ],
    },
];

const createRelationship = async (payload, { transaction } = {}) => {
    return Relation.create(payload, { transaction });
};

const getRelationship = async (id, ownerId, { transaction } = {}) => {
    return Relation.findOne({
        where: { id },
        include: includeFromToWithOwner(ownerId),
        transaction,
        subQuery: false,
    });
};

const getRelationshipByFromIdAndToId = async (fromId, toId, ownerId, { transaction } = {}) => {
    return Relation.findOne({
        where: {
            from_character_in_work_id: fromId,
            to_character_in_work_id: toId,
        },
        include: includeFromToWithOwner(ownerId),
        transaction,
        subQuery: false,
    });
};

const getRelationshipsByFromId = async (fromId, ownerId, { transaction } = {}) => {
    return Relation.findAll({
        where: { from_character_in_work_id: fromId },
        include: includeFromToWithOwner(ownerId),
        transaction,
        subQuery: false,
    });
};

const getRelationshipsByToId = async (toId, ownerId, { transaction } = {}) => {
    return Relation.findAll({
        where: { to_character_in_work_id: toId },
        include: includeFromToWithOwner(ownerId),
        transaction,
        subQuery: false,
    });
};

const updateRelationship = async (relationship, payload, { transaction } = {}) => {
    relationship.set(payload);
    await relationship.save({ transaction });
};

const destroyRelationship = async (relationship, { transaction } = {}) => {
    await relationship.destroy({ transaction });
};

export default {
    createRelationship,
    getRelationship,
    getRelationshipByFromIdAndToId,
    getRelationshipsByFromId,
    getRelationshipsByToId,
    updateRelationship,
    destroyRelationship,
};
