import { LocationInWork } from '../models/locationInWork.js';
import { Work } from '../models/work.js';
import { Location } from '../models/location.js';

const withOwnerInclude = ownerId => [
    { model: Work, as: 'work', where: { owner_id: ownerId }, required: true },
    { model: Location, as: 'location', where: { owner_id: ownerId }, required: true },
];

const createLocationInWork = async (payload, { transaction } = {}) => {
    return LocationInWork.create(payload, { transaction });
};

const getLocationInWork = async (id, ownerId, { transaction } = {}) => {
    return LocationInWork.findOne({
        where: { id },
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const getLocationInWorkByWorkIdAndLocationId = async (workId, locationId, ownerId, { transaction } = {}) => {
    return LocationInWork.findOne({
        where: { work_id: workId, location_id: locationId },
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const getLocationsInWorkByWorkId = async (workId, ownerId, { transaction } = {}) => {
    return LocationInWork.findAll({
        where: { work_id: workId },
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const getLocationsInWorkByLocationId = async (locationId, ownerId, { transaction } = {}) => {
    return LocationInWork.findAll({
        where: { location_id: locationId },
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const getLocationsInWork = async (ownerId, { transaction } = {}) => {
    return LocationInWork.findAll({
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const updateLocationInWork = async (locationInWork, payload, { transaction } = {}) => {
    locationInWork.set(payload);
    await locationInWork.save({ transaction });
};

const destroyLocationInWork = async (locationInWork, { transaction } = {}) => {
    await locationInWork.destroy({ transaction });
};

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
