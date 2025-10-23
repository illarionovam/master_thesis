import characterInWorkService from '../services/characterInWorkService.js';
import relationshipService from '../services/relationshipService.js';
import characterController from './characterController.js';
import relationshipController from './relationshipController.js';
import workController from './workController.js';
import createHttpError from 'http-errors';

const stripBulkCharacterInWorkResponse = characterInWork => {
    return {
        id: characterInWork.id,
        character_id: characterInWork.character_id,
        work_id: characterInWork.work_id,
        work: workController.stripBulkWorkResponse(characterInWork.work),
        character: characterController.stripBulkCharacterResponse(characterInWork.character),
    };
};

const getCharacterInWork = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(characterInWork);
};

const getCharacterInWorkRelationships = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationships = await relationshipService.getRelationships(characterInWorkId, characterInWork.work_id);

    res.json(relationships.map(relationshipController.stripBulkRelationshipResponse));
};

const getCharacterInWorkPossibleRelationships = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const possibleRelationships = await relationshipService.getPossibleRelationships(
        characterInWorkId,
        characterInWork.work_id
    );

    res.json(possibleRelationships.map(stripBulkCharacterInWorkResponse));
};

const updateCharacterInWork = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (
        characterInWork == null ||
        (req.character && characterInWork.character_id !== req.character.id) ||
        (req.work && characterInWork.work_id !== req.work.id)
    ) {
        throw createHttpError(403, 'Forbidden');
    }

    await characterInWorkService.updateCharacterInWork(characterInWork, req.body);

    res.json(characterInWork);
};

const destroyCharacterInWork = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (
        characterInWork == null ||
        (req.character && characterInWork.character_id !== req.character.id) ||
        (req.work && characterInWork.work_id !== req.work.id)
    ) {
        throw createHttpError(403, 'Forbidden');
    }

    await characterInWorkService.destroyCharacterInWork(characterInWork);

    res.sendStatus(204);
};

export default {
    stripBulkCharacterInWorkResponse,
    getCharacterInWork,
    getCharacterInWorkRelationships,
    getCharacterInWorkPossibleRelationships,
    updateCharacterInWork,
    destroyCharacterInWork,
};
