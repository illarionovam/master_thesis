import { Event } from '../models/event.js';
import { Work } from '../models/work.js';

const withOwnerWorkInclude = ownerId => [
    {
        model: Work,
        as: 'work',
        required: true,
        where: { owner_id: ownerId },
    },
];

const createEvent = async (payload, { transaction } = {}) => {
    return Event.create(payload, { transaction });
};

const getEvent = async (id, ownerId, { transaction } = {}) => {
    return Event.findOne({
        where: { id },
        include: withOwnerWorkInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const getEventsByWorkId = async (workId, ownerId, { transaction } = {}) => {
    return Event.findAll({
        where: { work_id: workId },
        include: withOwnerWorkInclude(ownerId),
        transaction,
        subQuery: false,
    });
};

const updateEvent = async (event, payload, { transaction } = {}) => {
    event.set(payload);
    await event.save({ transaction });
};

const destroyEvent = async (event, { transaction } = {}) => {
    await event.destroy({ transaction });
};

export default {
    createEvent,
    getEvent,
    getEventsByWorkId,
    updateEvent,
    destroyEvent,
};
