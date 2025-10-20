import createHttpError from 'http-errors';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';
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

const stripWorkResponse = work => {
    return {
        id: work.id,
        title: work.title,
        ownerId: work.owner_id,
        annotation: work.annotation,
        synopsis: work.synopsis,
        updatedAt: work.updated_at,
        createdAt: work.created_at,
    };
};

const createWork = async (req, res) => {
    const { title, annotation, synopsis } = req.body;

    const work = await workService.createWork({
        title: title.trim(),
        annotation: normalizeOptionalText(annotation),
        synopsis: normalizeOptionalText(synopsis),
        owner_id: req.appUser.id,
    });

    res.status(201).json(stripWorkResponse(work));
};

const getWork = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripWorkResponse(work));
};

const getWorks = async (req, res) => {
    const works = await workService.getWorks(req.appUser.id);

    res.json(works.map(stripWorkResponse));
};

const updateWork = async (req, res) => {
    const { id } = req.params;
    const { title, annotation, synopsis } = req.body;

    const payload = {};

    if (title != null) payload.title = title.trim();
    if (typeof annotation !== 'undefined') payload.annotation = normalizeOptionalText(annotation);
    if (typeof synopsis !== 'undefined') payload.synopsis = normalizeOptionalText(synopsis);

    if (Object.keys(payload).length > 0) {
        const work = await workService.getWork(id, req.appUser.id);

        if (work == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await workService.updateWork(work, payload);
    }

    res.sendStatus(200);
};

const destroyWork = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await workService.destroyWork(work);

    res.sendStatus(204);
};

const linkCharacter = async (req, res) => {
    const { id } = req.params;
    const { characterId } = req.body;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const character = await characterService.getCharacter(characterId, req.appUser.id);

    if (character == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const characterInWork = await characterInWorkService.createCharacterInWork({
        work_id: id,
        character_id: characterId,
    });

    res.status(201).json(characterInWorkController.stripCharacterInWorkResponse(characterInWork));
};

const getWorkCast = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const cast = await characterInWorkService.getCharactersInWorkByWorkId(id);

    res.json(cast.map(characterInWorkController.stripCharacterInWorkResponse));
};

const getWorkPossibleCast = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const possibleCast = await characterService.getCharactersNotLinkedToWork(id, req.appUser.id);

    res.json(possibleCast.map(characterController.stripCharacterResponse));
};

const linkLocation = async (req, res) => {
    const { id } = req.params;
    const { locationId } = req.body;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const location = await locationService.getLocation(locationId, req.appUser.id);

    if (location == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const locationInWork = await locationInWorkService.createLocationInWork({
        work_id: id,
        location_id: locationId,
    });

    res.status(201).json(locationInWorkController.stripLocationInWorkResponse(locationInWork));
};

const unlinkLocation = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId, req.appUser.id);

    if (locationInWork == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await locationInWorkService.destroyLocationInWork(locationInWork);

    res.sendStatus(204);
};

const getWorkLocationLinks = async (req, res) => {
    const { id } = req.params;

    const cast = await locationInWorkService.getLocationsInWorkByWorkId(id, req.appUser.id);

    res.json(cast.map(locationInWorkController.stripLocationInWorkResponse));
};

const getWorkPossibleLocationLinks = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const possibleLocationLinks = await locationService.getLocationsNotLinkedToWork(id, req.appUser.id);

    res.json(possibleLocationLinks.map(locationController.stripLocationResponse));
};

export default {
    stripBulkWorkResponse,
    stripWorkResponse,
    createWork,
    getWork,
    getWorks,
    updateWork,
    destroyWork,
    linkCharacter,
    getWorkCast,
    getWorkPossibleCast,
    linkLocation,
    unlinkLocation,
    getWorkLocationLinks,
    getWorkPossibleLocationLinks,
};
