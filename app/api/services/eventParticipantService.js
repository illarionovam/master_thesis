import { CharacterInWork } from '../models/characterInWork.js';
import { Work } from '../models/work.js';
import { Character } from '../models/character.js';
import { EventParticipant } from '../models/eventParticipant.js';

async function createEventParticipant(payload, { transaction } = {}) {
    return EventParticipant.create(payload, { transaction });
}

async function getEventParticipant(id, ownerId, { transaction } = {}) {
    return EventParticipant.findOne({
        where: { id },
        include: [
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
        ],
        transaction,
        subQuery: false,
    });
}

async function getEventParticipantByEventIdAndCharacterInWorkId(
    eventId,
    characterInWorkId,
    ownerId,
    { transaction } = {}
) {
    return EventParticipant.findOne({
        where: { event_id: eventId, character_in_work_id: characterInWorkId },
        include: [
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
        ],
        transaction,
        subQuery: false,
    });
}

async function getEventParticipantsByEventId(eventId, ownerId, { transaction } = {}) {
    return EventParticipant.findAll({
        where: { event_id: eventId },
        include: [
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
        ],
        transaction,
        subQuery: false,
    });
}

async function destroyEventParticipant(eventParticipant, { transaction } = {}) {
    await eventParticipant.destroy({ transaction });
}

export default {
    createEventParticipant,
    getEventParticipant,
    getEventParticipantByEventIdAndCharacterInWorkId,
    getEventParticipantsByEventId,
    destroyEventParticipant,
};
