import { Event } from '../models/event.js';
import { EventParticipant } from '../models/eventParticipant.js';
import { CharacterInWork } from '../models/characterInWork.js';
import { Character } from '../models/character.js';
import { Work } from '../models/work.js';

const baseInclude = [
    {
        model: Event,
        as: 'event',
        required: true,
        include: [
            {
                model: Work,
                as: 'work',
                required: true,
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
            },
        ],
    },
];

const createEventParticipant = async (payload, { transaction } = {}) => {
    return EventParticipant.create(payload, { transaction });
};

const getEventParticipant = async (id, { transaction } = {}) => {
    return EventParticipant.findOne({
        where: { id },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getEventParticipantsByCharacterInWorkId = async (charcaterInWorkId, { transaction } = {}) => {
    return EventParticipant.findAll({
        where: { character_in_work_id: charcaterInWorkId },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getEventParticipantsByEventId = async (eventId, { transaction } = {}) => {
    return EventParticipant.findAll({
        where: { event_id: eventId },
        include: baseInclude,
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
    getEventParticipantsByEventId,
    getEventParticipantsByCharacterInWorkId,
    destroyEventParticipant,
};
