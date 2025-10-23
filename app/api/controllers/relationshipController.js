import characterInWorkService from '../services/characterInWorkService.js';
import relationshipService from '../services/relationshipService.js';
import createHttpError from 'http-errors';
import characterController from './characterController.js';

const stripBulkRelationshipResponse = relationship => {
    return {
        id: relationship.id,
        from_character_in_work_id: relationship.from_character_in_work_id,
        to_character_in_work_id: relationship.to_character_in_work_id,
        type: relationship.type,
        from: characterController.stripBulkCharacterResponse(relationship.from.character),
        to: characterController.stripBulkCharacterResponse(relationship.to.character),
    };
};

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

    res.status(201).json(relationship);
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
    stripBulkRelationshipResponse,
    createRelationship,
    getRelationship,
    updateRelationship,
    destroyRelationship,
};
