import characterInWorkService from '../services/characterInWorkService.js';
import characterController from '../controllers/characterController.js';
import workController from '../controllers/workController.js';

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
    const { attributes } = req.body;

    if (attributes != null) {
        const characterInWork = await characterInWorkService.getCharacterInWork(id, req.appUser.id);

        if (characterInWork == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await characterInWorkService.updateCharacterInWork(characterInWork, { attributes });
    }

    res.sendStatus(200);
};

export default {
    stripCharacterInWorkResponse,
    getCharacterInWork,
    updateCharacterInWork,
};
