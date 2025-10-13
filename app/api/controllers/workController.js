import createHttpError from 'http-errors';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';
import workService from '../services/workService.js';

const stripWorkResponse = work => {
    return {
        id: work.id,
        title: work.title,
        ownerId: work.owner_id,
        annotation: work.annotation,
        synopsis: work.synopsis,
        updatedAt: work.updated_at,
        createdAt: work.created_at,
    };
};

const createWork = async (req, res) => {
    const { title, annotation, synopsis } = req.body;

    const work = await workService.createWork({
        title: title.trim(),
        annotation: normalizeOptionalText(annotation),
        synopsis: normalizeOptionalText(synopsis),
        owner_id: req.appUser.id,
    });

    res.status(201).json(stripWorkResponse(work));
};

const getWork = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripWorkResponse(work));
};

const getWorks = async (req, res) => {
    const works = await workService.getWorksByOwnerId(req.appUser.id);

    res.json(works.map(stripWorkResponse));
};

const updateWork = async (req, res) => {
    const { id } = req.params;
    const { title, annotation, synopsis } = req.body;

    const payload = {};

    if (title != null) payload.title = title.trim();
    if (typeof annotation !== 'undefined') payload.annotation = normalizeOptionalText(annotation);
    if (typeof synopsis !== 'undefined') payload.synopsis = normalizeOptionalText(synopsis);

    if (Object.keys(payload).length > 0) {
        const work = await workService.getWork(id, req.appUser.id);

        if (work == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await workService.updateWork(work, payload);
    }

    res.sendStatus(200);
};

const destroyWork = async (req, res) => {
    const { id } = req.params;

    const work = await workService.getWork(id, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await workService.destroyWork(work);

    res.sendStatus(204);
};

export default {
    createWork,
    getWork,
    getWorks,
    updateWork,
    destroyWork,
};
