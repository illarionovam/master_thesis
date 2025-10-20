import locationInWorkService from '../services/locationInWorkService.js';

const stripBulkLocationInWorkResponse = locationInWork => {
    return {
        id: locationInWork.id,
        location_id: locationInWork.location_id,
        work_id: locationInWork.work_id,
        work: locationInWork.work,
        location: locationInWork.location,
    };
};

const stripLocationInWorkResponse = locationInWork => {
    return {
        id: locationInWork.id,
        location_id: locationInWork.location_id,
        work_id: locationInWork.work_id,
        attributes: locationInWork.attributes,
        updated_at: locationInWork.updated_at,
        created_at: locationInWork.created_at,
        work: locationInWork.work,
        location: locationInWork.location,
    };
};

const getLocationInWork = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId);

    if (locationInWork == null || locationInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    return res.json(stripLocationInWorkResponse(locationInWork));
};

const updateLocationInWork = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await characterInWorkService.getCharacterInWork(locationInWorkId);

    if (locationInWork == null || locationInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    await locationInWorkService.updateLocationInWork(locationInWork, req.body);

    return res.sendStatus(200);
};

const destroyLocationInWork = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId);

    if (locationInWork == null || locationInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    await locationInWorkService.destroyLocationInWork(locationInWork);

    return res.sendStatus(204);
};

export default {
    stripBulkLocationInWorkResponse,
    stripLocationInWorkResponse,
    getLocationInWork,
    updateLocationInWork,
    destroyLocationInWork,
};
