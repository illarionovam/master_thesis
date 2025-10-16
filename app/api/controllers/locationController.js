import createHttpError from 'http-errors';
import workService from '../services/workService.js';
import locationService from '../services/locationService.js';
import locationInWorkService from '../services/locationInWorkService.js';
import locationInWorkController from './locationInWorkController.js';
import workController from './workController.js';

const stripLocationResponse = location => {
    return {
        id: location.id,
        ownerId: location.owner_id,
        title: location.title,
        description: location.description,
        attributes: location.attributes,
        parentLocationId: location.parent_location_id,
        updatedAt: location.updated_at,
        createdAt: location.created_at,
    };
};

const createLocation = async (req, res) => {
    const { title, description, parentLocationId } = req.body;

    const location = await locationService.createLocation({
        title: title.trim(),
        description: description.trim(),
        parent_location_id: parentLocationId,
        owner_id: req.appUser.id,
    });

    res.status(201).json(stripLocationResponse(location));
};

const getLocation = async (req, res) => {
    const { id } = req.params;

    const location = await locationService.getLocation(id, req.appUser.id);

    if (location == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripLocationResponse(location));
};

const getLocations = async (req, res) => {
    const locations = await locationService.getLocations(req.appUser.id);

    res.json(locations.map(stripLocationResponse));
};

const updateLocation = async (req, res) => {
    const { id } = req.params;
    const { title, description, parentLocationId } = req.body;

    const payload = {};

    if (title != null) payload.title = title.trim();
    if (description != null) payload.description = description.trim();
    if (parentLocationId != null) payload.parent_location_id = parentLocationId;

    if (Object.keys(payload).length > 0) {
        const location = await locationService.getLocation(id, req.appUser.id);

        if (location == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await locationService.updateLocation(location, payload);
    }

    res.sendStatus(200);
};

const destroyLocation = async (req, res) => {
    const { id } = req.params;

    const location = await locationService.getLocation(id, req.appUser.id);

    if (location == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await locationService.destroyLocation(location);

    res.sendStatus(204);
};

const linkWork = async (req, res) => {
    const { id } = req.params;
    const { workId } = req.body;

    const location = await locationService.getLocation(id, req.appUser.id);

    if (location == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const work = await workService.getWork(workId, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const locationInWork = await locationInWorkService.createLocationInWork({
        work_id: workId,
        location_id: id,
    });

    res.status(201).json(locationInWork);
};

const unlinkWork = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId, req.appUser.id);

    if (locationInWork == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await locationInWorkService.destroyLocationInWork(locationInWork);

    res.sendStatus(204);
};

const getLocationPlacements = async (req, res) => {
    const { id } = req.params;

    const placements = await locationInWorkService.getLocationsInWorkByLocationId(id, req.appUser.id);

    res.json(placements.map(locationInWorkController.stripLocationInWorkResponse));
};

const getLocationPossiblePlacements = async (req, res) => {
    const { id } = req.params;

    const location = await locationService.getLocation(id, req.appUser.id);

    if (location == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const possiblePlacements = await workService.getWorksNotLinkedToLocation(id, req.appUser.id);

    res.json(possiblePlacements.map(workController.stripWorkResponse));
};

export default {
    stripLocationResponse,
    createLocation,
    getLocation,
    getLocations,
    updateLocation,
    destroyLocation,
    linkWork,
    unlinkWork,
    getLocationPlacements,
    getLocationPossiblePlacements,
};
