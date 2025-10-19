import { Event } from '../models/event.js';
import { EventParticipant } from '../models/eventParticipant.js';
import { CharacterInWork } from '../models/characterInWork.js';
import { Character } from '../models/character.js';
import { Work } from '../models/work.js';

const withOwnerInclude = ownerId => [
    {
        model: Event,
        as: 'event',
        required: true,
        include: [
            {
                model: Work,
                as: 'work',
                required: true,
                where: { owner_id: ownerId },
            },
        ],
    },
    {
        model: CharacterInWork,
        as: 'characterLink',
        required: true,
        include: [
            {
                model: Character,
                as: 'character',
                required: true,
                where: { owner_id: ownerId },
            },
        ],
    },
];

const createEventParticipant = async (payload, { transaction } = {}) => {
    return EventParticipant.create(payload, { transaction });
};

const getEventParticipant = async (id, ownerId, { transaction } = {}) => {
    return EventParticipant.findOne({
        where: { id },
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const getEventParticipantByEventIdAndCharacterInWorkId = async (
    eventId,
    characterInWorkId,
    ownerId,
    { transaction } = {}
) => {
    return EventParticipant.findOne({
        where: { event_id: eventId, character_in_work_id: characterInWorkId },
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const getEventParticipantsByEventId = async (eventId, ownerId, { transaction } = {}) => {
    return EventParticipant.findAll({
        where: { event_id: eventId },
        include: withOwnerInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const destroyEventParticipant = async (eventParticipant, { transaction } = {}) => {
    await eventParticipant.destroy({ transaction });
};

export default {
    createEventParticipant,
    getEventParticipant,
    getEventParticipantByEventIdAndCharacterInWorkId,
    getEventParticipantsByEventId,
    destroyEventParticipant,
};
