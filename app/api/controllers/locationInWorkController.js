import createHttpError from 'http-errors';
import locationInWorkService from '../services/locationInWorkService.js';

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

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId);

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
    getLocationInWork,
    updateLocationInWork,
    destroyLocationInWork,
};
