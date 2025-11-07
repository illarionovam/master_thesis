import workService from '../services/workService.js';
import characterService from '../services/characterService.js';
import characterInWorkService from '../services/characterInWorkService.js';
import {
    stripBulkCharacterResponse,
    stripBulkCharacterInWorkResponse,
    stripBulkWorkResponse,
} from '../helpers/strippers.js';

const createCharacter = async (req, res) => {
    const character = await characterService.createCharacter({
        owner_id: req.appUser.id,
        ...req.body,
    });

    res.status(201).json(character);
};

const getCharacter = async (req, res) => {
    res.json(req.character);
};

const getCharacters = async (req, res) => {
    const characters = await characterService.getCharacters(req.appUser.id);

    res.json(characters.map(stripBulkCharacterResponse));
};

const updateCharacter = async (req, res) => {
    await characterService.updateCharacter(req.character, req.body);

    res.json(req.character);
};

const destroyCharacter = async (req, res) => {
    await characterService.destroyCharacter(req.character);

    res.sendStatus(204);
};

const getCharacterAppearances = async (req, res) => {
    const appearances = await characterInWorkService.getCharactersInWorkByCharacterId(req.character.id);

    res.json(appearances.map(stripBulkCharacterInWorkResponse));
};

const getCharacterPossibleAppearances = async (req, res) => {
    const possibleAppearances = await workService.getWorksNotLinkedToCharacter(req.character.id, req.appUser.id);

    res.json(possibleAppearances.map(stripBulkWorkResponse));
};

export default {
    createCharacter,
    getCharacter,
    getCharacters,
    updateCharacter,
    destroyCharacter,
    getCharacterAppearances,
    getCharacterPossibleAppearances,
};
