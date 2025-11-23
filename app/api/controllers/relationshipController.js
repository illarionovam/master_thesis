import characterInWorkService from '../services/characterInWorkService.js';
import relationshipService from '../services/relationshipService.js';
import createHttpError from 'http-errors';

const createRelationship = async (req, res) => {
    const { characterInWorkId } = req.params;
    const { to_character_in_work_id } = req.body;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const characterInWorkTo = await characterInWorkService.getCharacterInWork(to_character_in_work_id);

    if (characterInWorkTo == null || characterInWorkTo.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.createRelationship({
        from_character_in_work_id: characterInWorkId,
        ...req.body,
    });

    res.status(201).json({ ...relationship.toJSON(), from: characterInWork, to: characterInWorkTo });
};

const getRelationship = async (req, res) => {
    const { characterInWorkId, relationshipId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.getRelationship(relationshipId);

    if (relationship == null || relationship.from_character_in_work_id !== characterInWorkId) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(relationship);
};

const updateRelationship = async (req, res) => {
    const { characterInWorkId, relationshipId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.getRelationship(relationshipId);

    if (relationship == null || relationship.from_character_in_work_id !== characterInWorkId) {
        throw createHttpError(403, 'Forbidden');
    }

    await relationshipService.updateRelationship(relationship, req.body);

    res.json(relationship);
};

const destroyRelationship = async (req, res) => {
    const { characterInWorkId, relationshipId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.getRelationship(relationshipId);

    if (relationship == null || relationship.from_character_in_work_id !== characterInWorkId) {
        throw createHttpError(403, 'Forbidden');
    }

    await relationshipService.destroyRelationship(relationship);

    res.sendStatus(204);
};

export default {
    createRelationship,
    getRelationship,
    updateRelationship,
    destroyRelationship,
};
