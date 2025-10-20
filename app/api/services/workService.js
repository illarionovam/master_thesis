import { Work } from '../models/work.js';
import { CharacterInWork } from '../models/characterInWork.js';
import { LocationInWork } from '../models/locationInWork.js';

const createWork = async (payload, { transaction } = {}) => {
    return Work.create(payload, { transaction });
};

const getWork = async (id, ownerId, { transaction } = {}) => {
    return Work.findOne({
        where: { id, owner_id: ownerId },
        transaction,
    });
};

const getWorks = async (ownerId, { transaction } = {}) => {
    return Work.findAll({
        where: { owner_id: ownerId },
        transaction,
    });
};

const getWorksNotLinkedToCharacter = async (characterId, ownerId, { transaction } = {}) => {
    return Work.findAll({
        where: {
            owner_id: ownerId,
            '$cast.id$': null,
        },
        include: [
            {
                model: CharacterInWork,
                as: 'cast',
                required: false,
                attributes: [],
                where: { character_id: characterId },
            },
        ],
        transaction,
        subQuery: false,
    });
};

const getWorksNotLinkedToLocation = async (locationId, ownerId, { transaction } = {}) => {
    return Work.findAll({
        where: {
            owner_id: ownerId,
            '$locationLinks.id$': null,
        },
        include: [
            {
                model: LocationInWork,
                as: 'locationLinks',
                required: false,
                attributes: [],
                where: { location_id: locationId },
            },
        ],
        transaction,
        subQuery: false,
    });
};

const updateWork = async (work, payload, { transaction } = {}) => {
    work.set(payload);
    await work.save({ transaction });
};

const destroyWork = async (work, { transaction } = {}) => {
    await work.destroy({ transaction });
};

export default {
    createWork,
    getWork,
    getWorks,
    getWorksNotLinkedToCharacter,
    getWorksNotLinkedToLocation,
    updateWork,
    destroyWork,
};
