import Joi from 'joi';

const createLocationValidator = Joi.object({
    title: Joi.string().trim().min(1).max(300).required().messages({
        'string.min': 'title is required',
        'string.max': 'title must contain no more than 300 characters',
        'any.required': 'title is required',
    }),
    description: Joi.string().trim().min(1).max(3000).required().messages({
        'string.min': 'description is required',
        'string.max': 'description must contain no more than 3000 characters',
        'any.required': 'description is required',
    }),
    parent_location_id: Joi.alternatives()
        .try(
            Joi.string()
                .trim()
                .guid({ version: ['uuidv4', 'uuidv1'] }),
            Joi.valid(null)
        )
        .empty('')
        .default(null)
        .messages({
            'alternatives.match': 'parent_location_id must be a valid UUID or null',
            'string.guid': 'parent_location_id must be a valid UUID',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

const updateLocationValidator = Joi.object({
    title: Joi.string().trim().min(1).max(300).messages({
        'string.min': 'title must not be empty',
        'string.max': 'title must contain no more than 300 characters',
    }),
    description: Joi.string().trim().min(1).max(3000).messages({
        'string.min': 'description must not be empty',
        'string.max': 'description must contain no more than 3000 characters',
    }),
    parent_location_id: Joi.alternatives()
        .try(
            Joi.string()
                .trim()
                .guid({ version: ['uuidv4', 'uuidv1'] }),
            Joi.valid(null)
        )
        .empty('')
        .messages({
            'alternatives.match': 'parent_location_id must be a valid UUID or null',
            'string.guid': 'parent_location_id must be a valid UUID',
        }),
})
    .or('title', 'description', 'parent_location_id')
    .messages({
        'object.missing': 'At least one of title, description, or parent_location_id must be provided',
    })
    .prefs({ abortEarly: false, stripUnknown: true });

const linkWorkValidator = Joi.object({
    work_id: Joi.alternatives()
        .try(
            Joi.string()
                .trim()
                .guid({ version: ['uuidv4', 'uuidv1'] }),
            Joi.valid(null)
        )
        .empty('')
        .messages({
            'alternatives.match': 'work_id must be a valid UUID or null',
            'string.guid': 'work_id must be a valid UUID',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

export default { createLocationValidator, updateLocationValidator, linkWorkValidator };
