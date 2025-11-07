import createHttpError from 'http-errors';
import workService from '../services/workService.js';
import locationService from '../services/locationService.js';
import locationInWorkService from '../services/locationInWorkService.js';
import {
    stripBulkLocationResponse,
    stripBulkLocationInWorkResponse,
    stripBulkWorkResponse,
} from '../helpers/strippers.js';

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

    res.status(201).json(location);
};

const getLocation = async (req, res) => {
    res.json(req.location);
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

    res.json(req.location);
};

const destroyLocation = async (req, res) => {
    await locationService.destroyLocation(req.location);

    res.sendStatus(204);
};

const getLocationPlacements = async (req, res) => {
    const placements = await locationInWorkService.getLocationsInWorkByLocationId(req.location.id);

    res.json(placements.map(stripBulkLocationInWorkResponse));
};

const getLocationPossiblePlacements = async (req, res) => {
    const possiblePlacements = await workService.getWorksNotLinkedToLocation(req.location.id, req.appUser.id);

    res.json(possiblePlacements.map(stripBulkWorkResponse));
};

export default {
    createLocation,
    getLocation,
    getLocations,
    updateLocation,
    destroyLocation,
    getLocationPlacements,
    getLocationPossiblePlacements,
};
