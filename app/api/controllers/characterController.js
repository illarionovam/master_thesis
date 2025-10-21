import workService from '../services/workService.js';
import characterService from '../services/characterService.js';
import characterInWorkService from '../services/characterInWorkService.js';
import characterInWorkController from './characterInWorkController.js';
import workController from './workController.js';

const stripBulkCharacterResponse = character => {
    return {
        id: character.id,
        name: character.name,
    };
};

const stripCharacterResponse = character => {
    return {
        id: character.id,
        name: character.name,
        owner_id: character.owner_id,
        appearance: character.appearance,
        personality: character.personality,
        bio: character.bio,
        attributes: character.attributes,
        image_url: character.image_url,
        updated_at: character.updated_at,
        created_at: character.created_at,
    };
};

const createCharacter = async (req, res) => {
    const character = await characterService.createCharacter({
        owner_id: req.appUser.id,
        ...req.body,
    });

    res.status(201).json(stripCharacterResponse(character));
};

const getCharacter = async (req, res) => {
    res.json(stripCharacterResponse(req.character));
};

const getCharacters = async (req, res) => {
    const characters = await characterService.getCharacters(req.appUser.id);

    res.json(characters.map(stripBulkCharacterResponse));
};

const updateCharacter = async (req, res) => {
    await characterService.updateCharacter(req.character, req.body);

    res.json(stripCharacterResponse(req.character));
};

const destroyCharacter = async (req, res) => {
    await characterService.destroyCharacter(req.character);

    res.sendStatus(204);
};

const getCharacterAppearances = async (req, res) => {
    const appearances = await characterInWorkService.getCharactersInWorkByCharacterId(req.character.id);

    res.json(appearances.map(characterInWorkController.stripBulkCharacterInWorkResponse));
};

const getCharacterPossibleAppearances = async (req, res) => {
    const possibleAppearances = await workService.getWorksNotLinkedToCharacter(req.character.id, req.appUser.id);

    res.json(possibleAppearances.map(workController.stripBulkWorkResponse));
};

export default {
    stripBulkCharacterResponse,
    stripCharacterResponse,
    createCharacter,
    getCharacter,
    getCharacters,
    updateCharacter,
    destroyCharacter,
    getCharacterAppearances,
    getCharacterPossibleAppearances,
};
