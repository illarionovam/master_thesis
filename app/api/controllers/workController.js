import createHttpError from 'http-errors';
import workService from '../services/workService.js';
import characterService from '../services/characterService.js';
import characterInWorkService from '../services/characterInWorkService.js';
import characterInWorkController from './characterInWorkController.js';
import locationInWorkController from './locationInWorkController.js';
import characterController from './characterController.js';
import locationController from './locationController.js';
import locationService from '../services/locationService.js';
import locationInWorkService from '../services/locationInWorkService.js';

const stripBulkWorkResponse = work => {
    return {
        id: work.id,
        title: work.title,
    };
};

const createWork = async (req, res) => {
    const work = await workService.createWork({
        owner_id: req.appUser.id,
        ...req.body,
    });

    res.status(201).json(work);
};

const getWork = async (req, res) => {
    res.json(req.work);
};

const getWorks = async (req, res) => {
    const works = await workService.getWorks(req.appUser.id);

    res.json(works.map(stripBulkWorkResponse));
};

const updateWork = async (req, res) => {
    await workService.updateWork(req.work, req.body);

    res.json(req.work);
};

const destroyWork = async (req, res) => {
    await workService.destroyWork(req.work);

    res.sendStatus(204);
};

const linkCharacter = async (req, res) => {
    const { character_id } = req.body;

    const character = await characterService.getCharacter(character_id, req.appUser.id);

    if (character == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const characterInWork = await characterInWorkService.createCharacterInWork({
        work_id: req.work.id,
        character_id,
    });

    res.status(201).json(characterInWork);
};

const getWorkCast = async (req, res) => {
    const cast = await characterInWorkService.getCharactersInWorkByWorkId(req.work.id);

    res.json(cast.map(characterInWorkController.stripBulkCharacterInWorkResponse));
};

const getWorkPossibleCast = async (req, res) => {
    const possibleCast = await characterService.getCharactersNotLinkedToWork(req.work.id, req.appUser.id);

    res.json(possibleCast.map(characterController.stripBulkCharacterResponse));
};

const linkLocation = async (req, res) => {
    const { location_id } = req.body;

    const location = await locationService.getLocation(location_id, req.appUser.id);

    if (location == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const locationInWork = await locationInWorkService.createLocationInWork({
        work_id: req.work.id,
        location_id,
    });

    res.status(201).json(locationInWork);
};

const getWorkLocationLinks = async (req, res) => {
    const locationLinks = await locationInWorkService.getLocationsInWorkByWorkId(req.work.id);

    res.json(locationLinks.map(locationInWorkController.stripBulkLocationInWorkResponse));
};

const getWorkPossibleLocationLinks = async (req, res) => {
    const possibleLocationLinks = await locationService.getLocationsNotLinkedToWork(req.work.id, req.appUser.id);

    res.json(possibleLocationLinks.map(locationController.stripBulkLocationResponse));
};

export default {
    stripBulkWorkResponse,
    createWork,
    getWork,
    getWorks,
    updateWork,
    destroyWork,
    linkCharacter,
    getWorkCast,
    getWorkPossibleCast,
    linkLocation,
    getWorkLocationLinks,
    getWorkPossibleLocationLinks,
};
