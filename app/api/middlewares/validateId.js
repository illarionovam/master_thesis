import createHttpError from 'http-errors';
import workService from '../services/workService.js';
import characterService from '../services/characterService.js';
import locationService from '../services/locationService.js';

const LOOKUP = {
    character: { svc: characterService, fn: 'getCharacter', attachKey: 'character' },
    work: { svc: workService, fn: 'getWork', attachKey: 'work' },
    location: { svc: locationService, fn: 'getLocation', attachKey: 'location' },
};

const validateId = (type, paramName = 'id', forbiddenCode = 403) => {
    const cfg = LOOKUP[type];
    if (!cfg) {
        throw createHttpError(400, `validateId: unknown type "${type}"`);
    }

    return async (req, res, next) => {
        const id = req.params[paramName];
        if (!id) {
            throw createHttpError(400, `Missing param :${paramName}`);
        }

        const entity = await cfg.svc[cfg.fn](id, req.appUser.id);
        if (!entity) {
            throw createHttpError(forbiddenCode, 'Forbidden');
        }

        req[cfg.attachKey] = entity;
        next();
    };
};

export default validateId;

export const validateCharacterId = (paramName = 'id', code = 403) => validateId('character', paramName, code);
export const validateWorkId = (paramName = 'id', code = 403) => validateId('work', paramName, code);
export const validateLocationId = (paramName = 'id', code = 403) => validateId('location', paramName, code);
