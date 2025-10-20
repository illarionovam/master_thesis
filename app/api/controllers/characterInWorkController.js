import characterInWorkService from '../services/characterInWorkService.js';
import characterController from './characterController.js';
import workController from './workController.js';
import relationshipService from '../services/relationshipService.js';
import relationshipController from './relationshipController.js';

const stripBulkCharacterInWorkResponse = characterInWork => {
    return {
        id: characterInWork.id,
        character_id: characterInWork.character_id,
        work_id: characterInWork.work_id,
        work: characterInWork.work,
        character: characterInWork.character,
    };
};

const stripCharacterInWorkResponse = characterInWork => {
    return {
        id: characterInWork.id,
        character_id: characterInWork.character_id,
        work_id: characterInWork.work_id,
        image_url: characterInWork.image_url,
        attributes: characterInWork.attributes,
        updated_at: characterInWork.updated_at,
        created_at: characterInWork.created_at,
        work: workController.stripWorkResponse(characterInWork.work),
        character: characterController.stripCharacterResponse(characterInWork.character),
    };
};

const getCharacterInWork = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (
        characterInWork == null ||
        (req.character && characterInWork.character_id !== req.character.id) ||
        (req.work && characterInWork.work_id !== req.work.id)
    ) {
        throw createHttpError(403, 'Forbidden');
    }

    return res.json(stripCharacterInWorkResponse(characterInWork));
};

const getCharacterInWorkRelationships = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (
        characterInWork == null ||
        (req.character && characterInWork.character_id !== req.character.id) ||
        (req.work && characterInWork.work_id !== req.work.id)
    ) {
        throw createHttpError(403, 'Forbidden');
    }

    const relationships = await relationshipService.getRelationships(characterInWorkId);

    res.json(relationships);
};

const getCharacterInWorkPossibleRelationships = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (
        characterInWork == null ||
        (req.character && characterInWork.character_id !== req.character.id) ||
        (req.work && characterInWork.work_id !== req.work.id)
    ) {
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

    return res.sendStatus(200);
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

    return res.sendStatus(204);
};

export default {
    stripBulkCharacterInWorkResponse,
    stripCharacterInWorkResponse,
    getCharacterInWork,
    getCharacterInWorkRelationships,
    getCharacterInWorkPossibleRelationships,
    updateCharacterInWork,
    destroyCharacterInWork,
};
