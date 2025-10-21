import locationInWorkService from '../services/locationInWorkService.js';
import locationController from './locationController.js';
import workController from './workController.js';

const stripBulkLocationInWorkResponse = locationInWork => {
    return {
        id: locationInWork.id,
        location_id: locationInWork.location_id,
        work_id: locationInWork.work_id,
        work: workController.stripBulkWorkResponse(locationInWork.work),
        location: locationController.stripBulkLocationResponse(locationInWork.location),
    };
};

const getLocationInWork = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId);

    if (locationInWork == null || locationInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(locationInWork);
};

const updateLocationInWork = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await characterInWorkService.getCharacterInWork(locationInWorkId);

    if (locationInWork == null || locationInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    await locationInWorkService.updateLocationInWork(locationInWork, req.body);

    res.json(locationInWork);
};

const destroyLocationInWork = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId);

    if (locationInWork == null || locationInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    await locationInWorkService.destroyLocationInWork(locationInWork);

    res.sendStatus(204);
};

export default {
    stripBulkLocationInWorkResponse,
    getLocationInWork,
    updateLocationInWork,
    destroyLocationInWork,
};
