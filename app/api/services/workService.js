import { Work } from '../models/work.js';

async function createWork(payload, { transaction } = {}) {
    return Work.create(payload, { transaction });
}

async function getWork(id, ownerId, { transaction } = {}) {
    return Work.findOne({
        where: {
            id,
            owner_id: ownerId,
        },
        transaction,
    });
}

async function getWorks(ownerId, { transaction } = {}) {
    return Work.findAll({
        where: {
            owner_id: ownerId,
        },
        transaction,
    });
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
    getWorks,
    updateWork,
    destroyWork,
};
