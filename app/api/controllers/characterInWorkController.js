import characterInWorkService from '../services/characterInWorkService.js';
import characterController from './characterController.js';
import workController from './workController.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';

const stripCharacterInWorkResponse = characterInWork => {
    return {
        id: characterInWork.id,
        characterId: characterInWork.character_id,
        workId: characterInWork.work_id,
        imageUrl: characterInWork.image_url,
        attributes: characterInWork.attributes,
        updatedAt: characterInWork.updated_at,
        createdAt: characterInWork.created_at,
        work: workController.stripWorkResponse(characterInWork.work),
        character: characterController.stripCharacterResponse(characterInWork.character),
    };
};

const getCharacterInWork = async (req, res) => {
    const { id } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(id, req.appUser.id);

    if (characterInWork == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripCharacterInWorkResponse(characterInWork));
};

const updateCharacterInWork = async (req, res) => {
    const { id } = req.params;
    const { attributes, imageUrl } = req.body;

    const payload = {};

    if (attributes != null) payload.attributes = attributes;
    if (typeof imageUrl !== 'undefined') payload.image_url = normalizeOptionalText(imageUrl);

    if (Object.keys(payload).length > 0) {
        const characterInWork = await characterInWorkService.getCharacterInWork(id, req.appUser.id);

        if (characterInWork == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await characterInWorkService.updateCharacterInWork(characterInWork, payload);
    }

    res.sendStatus(200);
};

export default {
    stripCharacterInWorkResponse,
    getCharacterInWork,
    updateCharacterInWork,
};
