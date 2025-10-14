import createHttpError from 'http-errors';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';
import workService from '../services/workService.js';
import characterService from '../services/characterService.js';
import characterInWorkService from '../services/characterInWorkService.js';
import characterInWorkController from './characterInWorkController.js';
import workController from './workController.js';

const stripCharacterResponse = character => {
    return {
        id: character.id,
        name: character.name,
        ownerId: character.owner_id,
        appearance: character.appearance,
        personality: character.personality,
        bio: character.bio,
        attributes: character.attributes,
        imageUrl: character.image_url,
        updatedAt: character.updated_at,
        createdAt: character.created_at,
    };
};

const createCharacter = async (req, res) => {
    const { name, appearance, personality, bio, attributes } = req.body;

    const character = await characterService.createCharacter({
        name: name.trim(),
        appearance: appearance.trim(),
        personality: personality.trim(),
        bio: bio.trim(),
        attributes,
        owner_id: req.appUser.id,
    });

    res.status(201).json(stripCharacterResponse(character));
};

const getCharacter = async (req, res) => {
    const { id } = req.params;

    const character = await characterService.getCharacter(id, req.appUser.id);

    if (character == null) {
        throw createHttpError(403, 'Forbidden');
    }

    res.json(stripCharacterResponse(character));
};

const getCharacters = async (req, res) => {
    const characters = await characterService.getCharacters(req.appUser.id);

    res.json(characters.map(stripCharacterResponse));
};

const updateCharacter = async (req, res) => {
    const { id } = req.params;
    const { name, appearance, personality, bio, imageUrl, attributes } = req.body;

    const payload = {};

    if (name != null) payload.name = name.trim();
    if (appearance != null) payload.appearance = appearance.trim();
    if (personality != null) payload.personality = personality.trim();
    if (bio != null) payload.bio = bio.trim();
    if (typeof imageUrl !== 'undefined') payload.image_url = normalizeOptionalText(imageUrl);
    if (attributes != null) payload.attributes = attributes;

    if (Object.keys(payload).length > 0) {
        const character = await characterService.getCharacter(id, req.appUser.id);

        if (character == null) {
            throw createHttpError(403, 'Forbidden');
        }

        await characterService.updateCharacter(character, payload);
    }

    res.sendStatus(200);
};

const destroyCharacter = async (req, res) => {
    const { id } = req.params;

    const character = await characterService.getCharacter(id, req.appUser.id);

    if (character == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await characterService.destroyCharacter(character);

    res.sendStatus(204);
};

const linkWork = async (req, res) => {
    const { id } = req.params;
    const { workId } = req.body;

    const character = await characterService.getCharacter(id, req.appUser.id);

    if (character == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const work = await workService.getWork(workId, req.appUser.id);

    if (work == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const characterInWork = await characterInWorkService.createCharacterInWork({
        work_id: workId,
        character_id: id,
    });

    res.status(201).json(characterInWork);
};

const unlinkWork = async (req, res) => {
    const { characterInWorkId } = req.params;

    const characterInWork = await characterInWorkService.getCharacterInWork(characterInWorkId, req.appUser.id);

    if (characterInWork == null) {
        throw createHttpError(403, 'Forbidden');
    }

    await characterInWorkService.destroyCharacterInWork(characterInWork);

    res.sendStatus(204);
};

const getCharacterAppearances = async (req, res) => {
    const { id } = req.params;

    const appearances = await characterInWorkService.getCharactersInWorkByCharacterId(id, req.appUser.id);

    res.json(appearances.map(characterInWorkController.stripCharacterInWorkResponse));
};

const getCharacterPossibleAppearances = async (req, res) => {
    const { id } = req.params;

    const character = await characterService.getCharacter(id, req.appUser.id);

    if (character == null) {
        throw createHttpError(403, 'Forbidden');
    }

    const possibleAppearances = await workService.getWorksNotLinkedToCharacter(id, req.appUser.id);

    res.json(possibleAppearances.map(workController.stripWorkResponse));
};

export default {
    stripCharacterResponse,
    createCharacter,
    getCharacter,
    getCharacters,
    updateCharacter,
    destroyCharacter,
    linkWork,
    unlinkWork,
    getCharacterAppearances,
    getCharacterPossibleAppearances,
};
