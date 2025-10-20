import characterInWorkService from '../services/characterInWorkService.js';
import relationshipService from '../services/relationshipService.js';

const stripBulkRelationshipResponse = relationship => {
    return relationship;
};

const stripRelationshipResponse = relationship => {
    return relationship;
};

const createRelationship = async (req, res) => {
    const { characterInWorkId } = req.params;
    const { to_character_in_work_id } = req.body;

    const characterInWork = characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const characterInWorkTo = characterInWorkService.getCharacterInWork(to_character_in_work_id);

    if (characterInWorkTo == null || characterInWorkTo.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.createRelationship({
        from_character_in_work_id: characterInWorkId,
        ...req.body,
    });

    res.status(201).json(stripRelationshipResponse(relationship));
};

const getRelationship = async (req, res) => {
    const { characterInWorkId, relationshipId } = req.params;

    const characterInWork = characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.getRelationship(relationshipId);

    if (relationship == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripRelationshipResponse(relationship));
};

const updateRelationship = async (req, res) => {
    const { characterInWorkId, relationshipId } = req.params;

    const characterInWork = characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.getRelationship(relationshipId);

    if (relationship == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await relationshipService.updateRelationship(relationship, req.body);

    res.sendStatus(200);
};

const destroyRelationship = async (req, res) => {
    const { characterInWorkId, relationshipId } = req.params;

    const characterInWork = characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationship = await relationshipService.getRelationship(relationshipId);

    if (relationship == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await relationshipService.destroyRelationship(relationship);

    res.sendStatus(204);
};

export default {
    stripBulkRelationshipResponse,
    stripRelationshipResponse,
    createRelationship,
    getRelationship,
    updateRelationship,
    destroyRelationship,
};
