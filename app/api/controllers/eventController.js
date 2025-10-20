import createHttpError from 'http-errors';
import characterInWorkService from '../services/characterInWorkService.js';
import characterInWorkController from './characterInWorkController.js';
import locationInWorkService from '../services/locationInWorkService.js';
import eventService from '../services/eventService.js';
import eventParticipantService from '../services/eventParticipantService.js';
import eventParticipantController from './eventParticipantController.js';

const stripBulkEventResponse = event => {
    return event;
};

const stripEventResponse = event => {
    return event;
};

const createEvent = async (req, res) => {
    const { location_in_work_id } = req.body;

    if (location_in_work_id != null) {
        const locationInWork = await locationInWorkService.getLocationInWork(location_in_work_id);

        if (locationInWork == null || locationInWork.work_id !== req.work.id) {
            throw createHttpError(403, 'Forbidden');
        }
    }

    const event = await eventService.createEvent({
        work_id: req.work.id,
        ...req.body,
    });

    res.status(201).json(stripEventResponse(event));
};

const getEvent = async (req, res) => {
    const { eventId } = req.params;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripEventResponse(event));
};

const getEventsByWorkId = async (req, res) => {
    const events = await eventService.getEventsByWorkId(req.work.id);

    res.json(events.map(stripBulkEventResponse));
};

const updateEvent = async (req, res) => {
    const { eventId } = req.params;
    const { location_in_work_id } = req.body;

    if (location_in_work_id != null) {
        const locationInWork = await locationInWorkService.getLocationInWork(location_in_work_id);

        if (locationInWork == null || locationInWork.work_id !== req.work.id) {
            throw createHttpError(403, 'Forbidden');
        }
    }

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    await eventService.updateEvent(event, req.body);

    res.sendStatus(200);
};

const destroyEvent = async (req, res) => {
    const { eventId } = req.params;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
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
    stripBulkEventResponse,
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
