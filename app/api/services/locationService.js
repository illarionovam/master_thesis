import { Location } from '../models/location.js';
import { LocationInWork } from '../models/locationInWork.js';

async function createLocation(payload, { transaction } = {}) {
    return Location.create(payload, { transaction });
}

async function getLocation(id, ownerId, { transaction } = {}) {
    return Location.findOne({
        where: {
            id,
            owner_id: ownerId,
        },
        transaction,
    });
}

async function getLocations(ownerId, { transaction } = {}) {
    return Location.findAll({
        where: {
            owner_id: ownerId,
        },
        transaction,
    });
}

async function getLocationsNotLinkedToWork(workId, ownerId, { transaction } = {}) {
    return Location.findAll({
        where: {
            owner_id: ownerId,
            '$placements.id$': null,
        },
        include: [
            {
                model: LocationInWork,
                as: 'placements',
                attributes: [],
                required: false,
                where: { work_id: workId },
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function updateLocation(location, payload, { transaction } = {}) {
    location.set(payload);
    await location.save({ transaction });
}

async function destroyLocation(location, { transaction } = {}) {
    await location.destroy({ transaction });
}

export default {
    createLocation,
    getLocation,
    getLocations,
    getLocationsNotLinkedToWork,
    updateLocation,
    destroyLocation,
};
