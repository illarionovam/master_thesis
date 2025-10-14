import characterInWorkService from '../services/characterInWorkService';

const stripCharacterInWorkResponse = characterInWork => {
    return characterInWork;
};

const updateCharacterInWork = async (req, res) => {
    const { id } = req.params;
    const { attributes } = req.body;

    if (attributes != null) {
        const characterInWork = await characterInWorkService.getCharacterInWork(id, req.appUser);

        if (characterInWork == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await characterInWorkService.updateCharacterInWork(characterInWork, payload);
    }

    res.sendStatus(200);
};

export default {
    stripCharacterInWorkResponse,
    updateCharacterInWork,
};
