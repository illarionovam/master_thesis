import { Event } from '../models/event.js';
import { Work } from '../models/work.js';
import { LocationInWork } from '../models/locationInWork.js';
import { Location } from '../models/location.js';
import { sequelize } from '../db/db.js';

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

const reorderEvents = async (data, { transaction } = {}) => {
    await sequelize.query(
        `
    UPDATE event e
    SET order_in_work = v.order_in_work
    FROM json_to_recordset(:payload::json)
         AS v(id uuid, order_in_work int)
    WHERE e.id = v.id
    `,
        {
            replacements: {
                payload: JSON.stringify(data),
            },
            transaction,
        }
    );
};

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
        order: [['order_in_work', 'ASC']],
    });
};

const getEventsByWorkIdAndLocationInWorkId = async (workId, locationInWorkId, { transaction } = {}) => {
    return Event.findAll({
        where: { work_id: workId, location_in_work_id: locationInWorkId },
        include: baseInclude,
        transaction,
        subQuery: false,
        order: [['order_in_work', 'ASC']],
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
    reorderEvents,
    createEvent,
    getEvent,
    getEventsByWorkId,
    getEventsByWorkIdAndLocationInWorkId,
    updateEvent,
    destroyEvent,
};
