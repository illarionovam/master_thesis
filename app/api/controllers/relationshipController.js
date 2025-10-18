import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';
import relationshipService from '../services/relationshipService.js';

const stripRelationshipResponse = relationship => {
    return relationship;
};

const createRelationship = async (req, res) => {
    const { fromId, toId, type, notes } = req.body;

    const relationship = await relationshipService.createRelationship({
        from_character_in_work_id: fromId,
        to_character_in_work_id: toId,
        type: type.trim(),
        notes: normalizeOptionalText(notes),
    });

    res.status(201).json(stripRelationshipResponse(relationship));
};

const getRelationship = async (req, res) => {
    const { id } = req.params;

    const relationship = await relationshipService.getRelationship(id, req.appUser.id);

    if (relationship == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripRelationshipResponse(relationship));
};

const getRelationshipByFromIdAndToId = async (req, res) => {
    const { fromId, toId } = req.params;

    const relationship = await relationshipService.getRelationshipByFromIdAndToId(fromId, toId, req.appUser.id);

    if (relationship == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripRelationshipResponse(relationship));
};

const updateRelationship = async (req, res) => {
    const { id } = req.params;
    const { type, notes } = req.body;

    const payload = {};

    if (type != null) payload.type = type.trim();
    if (typeof notes !== 'undefined') payload.notes = normalizeOptionalText(notes);

    if (Object.keys(payload).length > 0) {
        const relationship = await relationshipService.getRelationship(id, req.appUser.id);

        if (relationship == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await relationshipService.updateRelationship(relationship, payload);
    }

    res.sendStatus(200);
};

const destroyRelationship = async (req, res) => {
    const { id } = req.params;

    const relationship = await relationshipService.getRelationship(id, req.appUser.id);

    if (relationship == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await relationshipService.destroyRelationship(relationship);

    res.sendStatus(204);
};

export default {
    stripRelationshipResponse,
    createRelationship,
    getRelationship,
    getRelationshipByFromIdAndToId,
    updateRelationship,
    destroyRelationship,
};
