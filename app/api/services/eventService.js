import { Work } from '../models/work.js';

async function createEvent(payload, { transaction } = {}) {
    return Event.create(payload, { transaction });
}

async function getEvent(id, ownerId, { transaction } = {}) {
    return Event.findOne({
        where: { id },
        include: [
            {
                model: Work,
                as: 'work',
                required: true,
                where: { owner_id: ownerId },
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function getEventsByWorkId(workId, ownerId, { transaction } = {}) {
    return Event.findAll({
        include: [
            {
                model: Work,
                as: 'work',
                required: true,
                where: { id: workId, owner_id: ownerId },
            },
        ],
        transaction,
        subQuery: false,
    });
}

async function updateEvent(event, payload, { transaction } = {}) {
    event.set(payload);
    await event.save({ transaction });
}

async function destroyEvent(event, { transaction } = {}) {
    await event.destroy({ transaction });
}

export default {
    createEvent,
    getEvent,
    getEventsByWorkId,
    updateEvent,
    destroyEvent,
};
