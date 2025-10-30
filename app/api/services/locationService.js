import { Location } from '../models/location.js';
import { LocationInWork } from '../models/locationInWork.js';

const createLocation = async (payload, { transaction } = {}) => {
    return Location.create(payload, { transaction });
};

const getLocation = async (id, ownerId, { transaction } = {}) => {
    return Location.findOne({
        where: { id, owner_id: ownerId },
        include: [
            {
                model: Location,
                as: 'parent',
                required: false,
            },
        ],
        transaction,
    });
};

const getLocations = async (ownerId, { transaction } = {}) => {
    return Location.findAll({
        where: { owner_id: ownerId },
        transaction,
    });
};

const getLocationsNotLinkedToWork = async (workId, ownerId, { transaction } = {}) => {
    return Location.findAll({
        where: {
            owner_id: ownerId,
            '$placements.id$': null,
        },
        include: [
            {
                model: LocationInWork,
                as: 'placements',
                required: false,
                where: { work_id: workId },
            },
        ],
        transaction,
        subQuery: false,
    });
};

const updateLocation = async (location, payload, { transaction } = {}) => {
    location.set(payload);
    return location.save({ transaction });
};

const destroyLocation = async (location, { transaction } = {}) => {
    await location.destroy({ transaction });
};

export default {
    createLocation,
    getLocation,
    getLocations,
    getLocationsNotLinkedToWork,
    updateLocation,
    destroyLocation,
};
