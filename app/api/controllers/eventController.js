import createHttpError from 'http-errors';
import characterInWorkService from '../services/characterInWorkService.js';
import locationInWorkService from '../services/locationInWorkService.js';
import eventService from '../services/eventService.js';
import eventParticipantService from '../services/eventParticipantService.js';
import {
    stripBulkEventResponse,
    stripBulkEventParticipantResponse,
    stripBulkCharacterInWorkResponse,
} from '../helpers/strippers.js';
import { generateEventFactCheck } from './generateController.js';

const generateFactCheck = async (req, res) => {
    const { eventId } = req.params;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const eventParticipants = await eventParticipantService.getEventParticipantsByEventId(eventId);
    const events = await eventService.getEventsByWorkId(req.work.id);

    const text = await generateEventFactCheck(
        {
            description: event.description,
            location_description: event.locationLink?.location?.description ?? null,
        },
        eventParticipants.map(p => ({
            name: p.characterLink.character.name,
            character: p.characterLink.character.personality,
            bio: p.characterLink.character.bio,
        })),
        events.filter(ev => ev.order_in_work < event.order_in_work).map(ev => ev.description)
    );
    res.json({ result: text });
};

const reorderEvents = async (req, res) => {
    const events = await eventService.getEventsByWorkId(req.work.id);
    const { data } = req.body;

    const allowedIds = new Set(events.map(e => e.id));

    for (const item of data) {
        if (!allowedIds.has(item.id)) {
            throw createHttpError(403, 'Forbidden');
        }
    }

    await eventService.reorderEvents(data);

    res.sendStatus(200);
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

    res.status(201).json(event);
};

const getEvent = async (req, res) => {
    const { eventId } = req.params;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(event);
};

const getEventsByWorkId = async (req, res) => {
    const events = await eventService.getEventsByWorkId(req.work.id);

    res.json(events.map(stripBulkEventResponse));
};

const getEventsByWorkIdAndLocationInWorkId = async (req, res) => {
    const { locationInWorkId } = req.params;

    const locationInWork = await locationInWorkService.getLocationInWork(locationInWorkId);

    if (locationInWork == null || locationInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const events = await eventService.getEventsByWorkIdAndLocationInWorkId(req.work.id, locationInWorkId);

    res.json(events.map(stripBulkEventResponse));
};

const getEventParticipantsByWorkIdAndCharacterInWorkId = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const eventParticipants = await eventParticipantService.getEventParticipantsByCharacterInWorkId(characterInWorkId);

    res.json(eventParticipants.map(stripBulkEventParticipantResponse));
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

    res.json(event);
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
    const { eventId } = req.params;
    const { character_in_work_id } = req.body;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const characterInWork = await characterInWorkService.getCharacterInWork(character_in_work_id);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const eventParticipant = await eventParticipantService.createEventParticipant({
        event_id: eventId,
        ...req.body,
    });

    res.status(201).json(eventParticipant);
};

const unlinkParticipant = async (req, res) => {
    const { eventId, eventParticipantId } = req.params;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const eventParticipant = await eventParticipantService.getEventParticipant(eventParticipantId);

    if (eventParticipant == null || eventParticipant.event_id !== eventId) {
        throw createHttpError(403, 'Forbidden');
    }

    await eventParticipantService.destroyEventParticipant(eventParticipant);

    res.sendStatus(204);
};

const getEventParticipants = async (req, res) => {
    const { eventId } = req.params;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const eventParticipants = await eventParticipantService.getEventParticipantsByEventId(eventId);

    res.json(eventParticipants.map(stripBulkEventParticipantResponse));
};

const getEventPossibleParticipants = async (req, res) => {
    const { eventId } = req.params;

    const event = await eventService.getEvent(eventId);

    if (event == null || event.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const possibleParticipants = await characterInWorkService.getCharactersInWorkNotLinkedToEvent(event);

    res.json(possibleParticipants.map(stripBulkCharacterInWorkResponse));
};

export default {
    reorderEvents,
    createEvent,
    getEvent,
    getEventsByWorkId,
    getEventsByWorkIdAndLocationInWorkId,
    getEventParticipants,
    getEventPossibleParticipants,
    updateEvent,
    destroyEvent,
    linkParticipant,
    unlinkParticipant,
    getEventParticipantsByWorkIdAndCharacterInWorkId,
    generateFactCheck,
};
