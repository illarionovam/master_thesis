import { CharacterInWork } from '../models/characterInWork.js';
import { Relation } from '../models/relationship.js';
import { Character } from '../models/character.js';

async function createRelationship(payload, { transaction } = {}) {
    return Relation.create(payload, { transaction });
}

async function getRelationship(id, ownerId, { transaction } = {}) {
    return Relation.findOne({
        where: { id },
        include: [
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
        ],
        transaction,
        subQuery: false,
    });
}

async function getRelationshipByFromIdAndToId(fromId, toId, ownerId, { transaction } = {}) {
    return Relation.findOne({
        where: { from_character_in_work_id: fromId, to_character_in_work_id: toId },
        include: [
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
        ],
        transaction,
        subQuery: false,
    });
}

async function getRelationshipsByFromId(fromId, ownerId, { transaction } = {}) {
    return Relation.findAll({
        where: { from_character_in_work_id: fromId },
        include: [
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
        ],
        transaction,
        subQuery: false,
    });
}

async function getRelationshipsByToId(toId, ownerId, { transaction } = {}) {
    return Relation.findAll({
        where: { to_character_in_work_id: toId },
        include: [
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
        ],
        transaction,
        subQuery: false,
    });
}

async function updateRelationship(relationship, payload, { transaction } = {}) {
    relationship.set(payload);
    await relationship.save({ transaction });
}

async function destroyRelationship(relationship, { transaction } = {}) {
    await relationship.destroy({ transaction });
}

export default {
    createRelationship,
    getRelationship,
    getRelationshipByFromIdAndToId,
    getRelationshipsByFromId,
    getRelationshipsByToId,
    updateRelationship,
    destroyRelationship,
};
