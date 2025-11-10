import characterInWorkService from '../services/characterInWorkService.js';
import relationshipService from '../services/relationshipService.js';
import createHttpError from 'http-errors';
import { stripBulkCharacterInWorkResponse, stripBulkRelationshipResponse } from '../helpers/strippers.js';
import { formatAttributesString } from '../helpers/formatAttributesString.js';

const generateImageUrl = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId);

    if (characterInWork == null || characterInWork.work_id !== req.work.id) {
        throw createHttpError(403, 'Forbidden');
    }

    const prompt = [
        req.character.appearance,
        formatAttributesString(req.character.attributes),
        formatAttributesString(characterInWork.attributes),
    ]
        .filter(Boolean)
        .join(' ');

    console.log(prompt);

    const url = await generateAndUploadImage(prompt);
    await characterInWorkService.updateCharacterInWork(characterInWork, { image_url: url });

    res.json(characterInWork);
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

    res.json(relationships.map(stripBulkRelationshipResponse));
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
    generateImageUrl,
    getCharacterInWork,
    getCharacterInWorkRelationships,
    getCharacterInWorkPossibleRelationships,
    updateCharacterInWork,
    destroyCharacterInWork,
};
