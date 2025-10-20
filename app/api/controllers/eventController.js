import createHttpError from 'http-errors';
import workService from '../services/workService.js';
import characterInWorkService from '../services/characterInWorkService.js';
import characterInWorkController from './characterInWorkController.js';
import locationInWorkService from '../services/locationInWorkService.js';
import eventService from '../services/eventService.js';
import eventParticipantService from '../services/eventParticipantService.js';
import eventParticipantController from './eventParticipantController.js';

const stripEventResponse = event => {
    return event;
};

const createEvent = async (req, res) => {
    const { workId, locationInWorkId, description } = req.body;

    const work = await workService.getWork(workId, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId, req.appUser.id);

    if (locationInWork == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const event = await eventService.createEvent({
        work_id: workId,
        location_in_work_id: locationInWorkId,
        description: description.trim(),
    });

    res.status(201).json(stripEventResponse(event));
};

const getEvent = async (req, res) => {
    const { id } = req.params;

    const event = await eventService.getEvent(id, req.appUser.id);

    if (event == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripEventResponse(event));
};

const getEventsByWorkId = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const events = await eventService.getEventsByWorkId(id, req.appUser.id);

    res.json(events.map(stripEventResponse));
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { locationInWorkId, description } = req.body;

    const payload = {};

    if (locationInWorkId != null) {
        const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId, req.appUser.id);

        if (locationInWork == null) {
            throw createHttpError(403, 'Forbidden');
        }

        payload.location_in_work_id = locationInWorkId;
    }

    if (description != null) payload.description = description.trim();

    if (Object.keys(payload).length > 0) {
        const event = await eventService.getEvent(id, req.appUser.id);

        if (event == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await eventService.updateEvent(event, payload);
    }

    res.sendStatus(200);
};

const destroyEvent = async (req, res) => {
    const { id } = req.params;

    const event = await eventService.getEvent(id, req.appUser.id);

    if (event == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await eventService.destroyEvent(event);

    res.sendStatus(204);
};

const linkParticipant = async (req, res) => {
    const { id } = req.params;
    const { characterInWorkId } = req.body;

    const event = await eventService.getEvent(id, req.appUser.id);

    if (event == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const eventParticipant = await eventParticipantService.createEventParticipant({
        event_id: id,
        character_in_work_id: characterInWorkId,
    });

    res.status(201).json(eventParticipant);
};

const unlinkParticipant = async (req, res) => {
    const { eventParticipantId } = req.params;

    const eventParticipant = await eventParticipantService.getEventParticipant(eventParticipantId, req.appUser.id);

    if (eventParticipant == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await eventParticipantService.destroyEventParticipant(eventParticipant);

    res.sendStatus(204);
};

const getEventParticipants = async (req, res) => {
    const { id } = req.params;

    const event = await eventService.getEvent(id, req.appUser.id);

    if (event == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const eventParticipants = eventParticipantService.getEventParticipantsByEventId(id, req.appUser.id);

    res.json(eventParticipants.map(eventParticipantController.stripEventParticipantResponse));
};

const getEventPossibleParticipants = async (req, res) => {
    const { id } = req.params;

    const event = await eventService.getEvent(id, req.appUser.id);

    if (event == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const possibleParticipants = await characterInWorkService.getCharactersInWorkNotLinkedToEvent(
        event,
        req.appUser.id
    );

    res.json(possibleParticipants.map(characterInWorkController.stripCharacterInWorkResponse));
};

export default {
    stripEventResponse,
    createEvent,
    getEvent,
    getEventsByWorkId,
    getEventParticipants,
    getEventPossibleParticipants,
    updateEvent,
    destroyEvent,
    linkParticipant,
    unlinkParticipant,
};
