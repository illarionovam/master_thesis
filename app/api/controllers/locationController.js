import createHttpError from 'http-errors';
import workService from '../services/workService.js';
import locationService from '../services/locationService.js';
import locationInWorkService from '../services/locationInWorkService.js';
import locationInWorkController from './locationInWorkController.js';
import workController from './workController.js';

const stripBulkLocationResponse = location => {
    return {
        id: location.id,
        title: location.title,
    };
};

const stripLocationResponse = location => {
    return {
        id: location.id,
        owner_id: location.owner_id,
        title: location.title,
        description: location.description,
        attributes: location.attributes,
        parent_location_id: location.parent_location_id,
        updated_at: location.updated_at,
        created_at: location.created_at,
    };
};

const createLocation = async (req, res) => {
    const { parent_location_id } = req.body;

    if (parent_location_id != null) {
        const parentLocation = await locationService.getLocation(parent_location_id, req.appUser.id);

        if (parentLocation == null) {
            throw createHttpError(403, 'Forbidden');
        }
    }

    const location = await locationService.createLocation({
        owner_id: req.appUser.id,
        ...req.body,
    });

    res.status(201).json(stripLocationResponse(location));
};

const getLocation = async (req, res) => {
    res.json(stripLocationResponse(req.location));
};

const getLocations = async (req, res) => {
    const locations = await locationService.getLocations(req.appUser.id);

    res.json(locations.map(stripBulkLocationResponse));
};

const updateLocation = async (req, res) => {
    const { parent_location_id } = req.body;

    if (parent_location_id != null) {
        const parentLocation = await locationService.getLocation(parent_location_id, req.appUser.id);

        if (parentLocation == null) {
            throw createHttpError(403, 'Forbidden');
        }
    }

    await locationService.updateLocation(req.location, req.body);

    res.sendStatus(200);
};

const destroyLocation = async (req, res) => {
    await locationService.destroyLocation(req.location);

    res.sendStatus(204);
};

const linkWork = async (req, res) => {
    const { work_id } = req.body;

    const work = await workService.getWork(work_id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const locationInWork = await locationInWorkService.createLocationInWork({
        work_id,
        location_id: req.location.id,
    });

    res.status(201).json(locationInWorkController.stripLocationInWorkResponse(locationInWork));
};

const getLocationPlacements = async (req, res) => {
    const placements = await locationInWorkService.getLocationsInWorkByLocationId(req.location.id, req.appUser.id);

    res.json(placements.map(locationInWorkController.stripBulkLocationInWorkResponse));
};

const getLocationPossiblePlacements = async (req, res) => {
    const possiblePlacements = await workService.getWorksNotLinkedToLocation(req.location.id, req.appUser.id);

    res.json(possiblePlacements.map(workController.stripBulkWorkResponse));
};

export default {
    stripBulkLocationResponse,
    stripLocationResponse,
    createLocation,
    getLocation,
    getLocations,
    updateLocation,
    destroyLocation,
    linkWork,
    getLocationPlacements,
    getLocationPossiblePlacements,
};
