import createHttpError from 'http-errors';
import workService from '../services/workService.js';
import characterService from '../services/characterService.js';
import relationshipService from '../services/relationshipService.js';
import characterInWorkService from '../services/characterInWorkService.js';
import locationService from '../services/locationService.js';
import locationInWorkService from '../services/locationInWorkService.js';
import {
    stripBulkWorkResponse,
    stripBulkCharacterInWorkResponse,
    stripBulkCharacterResponse,
    stripBulkLocationInWorkResponse,
    stripBulkLocationResponse,
    stripBulkRelationshipResponse,
} from '../helpers/strippers.js';
import { generateDescription } from './generateController.js';

const generateWorkDescription = async (req, res) => {
    const rawEvents = await eventService.getEventsByWorkId(req.work.id);

    const events = rawEvents.map(e => ({
        title: e.title,
        description: e.description,
    }));

    const text = await generateDescription(events);
    res.json({ description: text });
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

    res.json(cast.map(stripBulkCharacterInWorkResponse));
};

const getWorkPossibleCast = async (req, res) => {
    const possibleCast = await characterService.getCharactersNotLinkedToWork(req.work.id, req.appUser.id);

    res.json(possibleCast.map(stripBulkCharacterResponse));
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

    res.json(locationLinks.map(stripBulkLocationInWorkResponse));
};

const getWorkPossibleLocationLinks = async (req, res) => {
    const possibleLocationLinks = await locationService.getLocationsNotLinkedToWork(req.work.id, req.appUser.id);

    res.json(possibleLocationLinks.map(stripBulkLocationResponse));
};

const getWorkRelationships = async (req, res) => {
    const relationships = await relationshipService.getRelationshipsByWorkId(req.work.id);

    res.json(relationships.map(stripBulkRelationshipResponse));
};

export default {
    generateWorkDescription,
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
    getWorkRelationships,
};
