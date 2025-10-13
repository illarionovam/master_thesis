import { Work } from '../models/work.js';

async function createWork(payload, { transaction } = {}) {
    const work = await Work.create(payload, { transaction });

    return work;
}

async function getWork(id, ownerId, { transaction } = {}) {
    const work = await Work.findOne({
        where: {
            id,
            owner_id: ownerId,
        },
        transaction,
    });

    return work;
}

async function getWorksByOwnerId(ownerId, { transaction } = {}) {
    const works = await Work.findAll({
        where: {
            owner_id: ownerId,
        },
        transaction,
    });

    return works;
}

async function updateWork(work, payload, { transaction } = {}) {
    work.set(payload);
    await work.save({ transaction });
}

async function destroyWork(work, { transaction } = {}) {
    await work.destroy({ transaction });
}

export default {
    createWork,
    getWork,
    getWorksByOwnerId,
    updateWork,
    destroyWork,
};
