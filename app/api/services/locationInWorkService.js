import { LocationInWork } from '../models/locationInWork.js';
import { Work } from '../models/work.js';
import { Location } from '../models/location.js';

const baseInclude = [
    { model: Work, as: 'work', required: true, attributes: ['title'] },
    { model: Location, as: 'location', required: true, attributes: ['title'] },
];

const createLocationInWork = async (payload, { transaction } = {}) => {
    return LocationInWork.create(payload, { transaction });
};

const getLocationInWork = async (id, { transaction } = {}) => {
    return LocationInWork.findOne({
        where: { id },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getLocationsInWorkByWorkId = async (workId, { transaction } = {}) => {
    return LocationInWork.findAll({
        where: { work_id: workId },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getLocationsInWorkByLocationId = async (locationId, { transaction } = {}) => {
    return LocationInWork.findAll({
        where: { location_id: locationId },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const updateLocationInWork = async (locationInWork, payload, { transaction } = {}) => {
    locationInWork.set(payload);
    return locationInWork.save({ transaction });
};

const destroyLocationInWork = async (locationInWork, { transaction } = {}) => {
    await locationInWork.destroy({ transaction });
};

export default {
    createLocationInWork,
    getLocationInWork,
    getLocationsInWorkByLocationId,
    getLocationsInWorkByWorkId,
    updateLocationInWork,
    destroyLocationInWork,
};
