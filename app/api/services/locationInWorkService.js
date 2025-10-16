import { LocationInWork } from '../models/locationInWork.js';
import { Work } from '../models/work.js';
import { Location } from '../models/location.js';

async function createLocationInWork(payload, { transaction } = {}) {
    return LocationInWork.create(payload, { transaction });
}

async function getLocationInWork(id, ownerId, { transaction } = {}) {
    return LocationInWork.findOne({
        where: { id },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Location,
                as: 'location',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getLocationInWorkByWorkIdAndLocationId(workId, locationId, ownerId, { transaction } = {}) {
    return LocationInWork.findOne({
        where: { work_id: workId, location_id: locationId },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Location,
                as: 'location',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getLocationsInWorkByWorkId(workId, ownerId, { transaction } = {}) {
    return LocationInWork.findAll({
        where: { work_id: workId },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Location,
                as: 'location',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getLocationsInWorkByLocationId(locationId, ownerId, { transaction } = {}) {
    return LocationInWork.findAll({
        where: { location_id: locationId },
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Location,
                as: 'location',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getLocationsInWork(ownerId, { transaction } = {}) {
    return LocationInWork.findAll({
        include: [
            {
                model: Work,
                as: 'work',
                where: { owner_id: ownerId },
                required: true,
            },
            {
                model: Location,
                as: 'location',
                where: { owner_id: ownerId },
                required: true,
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function updateLocationInWork(locationInWork, payload, { transaction } = {}) {
    locationInWork.set(payload);
    await locationInWork.save({ transaction });
}

async function destroyLocationInWork(locationInWork, { transaction } = {}) {
    await locationInWork.destroy({ transaction });
}

export default {
    createLocationInWork,
    getLocationInWork,
    getLocationInWorkByWorkIdAndLocationId,
    getLocationsInWork,
    getLocationsInWorkByLocationId,
    getLocationsInWorkByWorkId,
    updateLocationInWork,
    destroyLocationInWork,
};
