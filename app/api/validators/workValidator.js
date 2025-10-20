import Joi from 'joi';

const createWorkValidator = Joi.object({
    title: Joi.string().trim().min(1).max(300).required().messages({
        'string.min': 'title is required',
        'string.max': 'title must contain no more than 300 characters',
        'any.required': 'title is required',
    }),
    annotation: Joi.string().trim().max(3000).empty('').default(null).messages({
        'string.max': 'annotation must contain no more than 3000 characters',
    }),
    synopsis: Joi.string().trim().max(1500).empty('').default(null).messages({
        'string.max': 'synopsis must contain no more than 1500 characters',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

const updateWorkValidator = Joi.object({
    title: Joi.string().trim().min(1).max(300).messages({
        'string.min': 'title must not be empty',
        'string.max': 'title must contain no more than 300 characters',
    }),
    annotation: Joi.string().trim().min(1).max(3000).messages({
        'string.min': 'annotation must not be empty',
        'string.max': 'annotation must contain no more than 3000 characters',
    }),
    synopsis: Joi.string().trim().min(1).max(1500).messages({
        'string.min': 'synopsis must not be empty',
        'string.max': 'synopsis must contain no more than 1500 characters',
    }),
})
    .or('title', 'annotation', 'synopsis')
    .messages({
        'object.missing': 'At least one of title, annotation, or synopsis must be provided',
    })
    .prefs({ abortEarly: false, stripUnknown: true });

const linkCharacterValidator = Joi.object({
    character_id: Joi.alternatives()
        .try(
            Joi.string()
                .trim()
                .guid({ version: ['uuidv4', 'uuidv1'] }),
            Joi.valid(null)
        )
        .empty('')
        .messages({
            'alternatives.match': 'character_id must be a valid UUID or null',
            'string.guid': 'character_id must be a valid UUID',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

const linkLocationValidator = Joi.object({
    location_id: Joi.alternatives()
        .try(
            Joi.string()
                .trim()
                .guid({ version: ['uuidv4', 'uuidv1'] }),
            Joi.valid(null)
        )
        .empty('')
        .messages({
            'alternatives.match': 'location_id must be a valid UUID or null',
            'string.guid': 'location_id must be a valid UUID',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

export default { createWorkValidator, updateWorkValidator, linkCharacterValidator, linkLocationValidator };
