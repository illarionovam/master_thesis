import { Event } from '../models/event.js';
import { Work } from '../models/work.js';
import { LocationInWork } from '../models/locationInWork.js';
import { Location } from '../models/location.js';

const baseInclude = [
    {
        model: Work,
        as: 'work',
        required: true,
    },
    {
        model: LocationInWork,
        as: 'locationLink',
        required: false,
        include: [
            {
                model: Location,
                as: 'location',
                required: true,
            },
        ],
    },
];

const createEvent = async (payload, { transaction } = {}) => {
    return Event.create(payload, { transaction });
};

const getEvent = async (id, { transaction } = {}) => {
    return Event.findOne({
        where: { id },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const getEventsByWorkId = async (workId, { transaction } = {}) => {
    return Event.findAll({
        where: { work_id: workId },
        include: baseInclude,
        transaction,
        subQuery: false,
    });
};

const updateEvent = async (event, payload, { transaction } = {}) => {
    event.set(payload);
    return event.save({ transaction });
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
