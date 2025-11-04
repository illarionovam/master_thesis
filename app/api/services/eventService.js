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
    const valuesSql = data.map((_, i) => `($${i * 2 + 1}::uuid, $${i * 2 + 2}::int)`).join(', ');
    const binds = data.flatMap(({ id, order_in_work }) => [id, order_in_work]);

    await sequelize.query(
        `WITH vals(id, order_in_work) AS (VALUES ${valuesSql}) UPDATE event AS e SET order_in_work = vals.order_in_work FROM vals WHERE e.id = vals.id`,
        { bind: binds, transaction }
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
