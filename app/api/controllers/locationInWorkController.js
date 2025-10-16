import locationInWorkService from '../services/locationInWorkService.js';
import locationController from './locationController.js';
import workController from './workController.js';

const stripLocationInWorkResponse = locationInWork => {
    return {
        id: locationInWork.id,
        locationId: locationInWork.location_id,
        workId: locationInWork.work_id,
        attributes: locationInWork.attributes,
        updatedAt: locationInWork.updated_at,
        createdAt: locationInWork.created_at,
        work: workController.stripWorkResponse(locationInWork.work),
        location: locationController.stripLocationResponse(locationInWork.location),
    };
};

const getLocationInWork = async (req, res) => {
    const { id } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(id, req.appUser.id);

    if (locationInWork == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripLocationInWorkResponse(locationInWork));
};

const updateLocationInWork = async (req, res) => {
    const { id } = req.params;
    const { attributes } = req.body;

    if (attributes != null) {
        const locationInWork = await locationInWorkService.getLocationInWork(id, req.appUser.id);

        if (locationInWork == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await locationInWorkService.updateLocationInWork(locationInWork, { attributes });
    }

    res.sendStatus(200);
};

export default {
    stripLocationInWorkResponse,
    getLocationInWork,
    updateLocationInWork,
};
