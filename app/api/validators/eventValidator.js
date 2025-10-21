import Joi from 'joi';

export const createEventValidator = Joi.object({
    description: Joi.string().trim().min(1).max(6000).required().messages({
        'string.min': 'description is required',
        'string.max': 'description must contain no more than 6000 characters',
        'any.required': 'description is required',
    }),
    location_in_work_id: Joi.alternatives()
        .try(
            Joi.string()
                .trim()
                .guid({ version: ['uuidv4', 'uuidv1'] }),
            Joi.valid(null)
        )
        .empty('')
        .default(null)
        .messages({
            'alternatives.match': 'location_in_work_id must be a valid UUID or null',
            'string.guid': 'location_in_work_id must be a valid UUID',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

const updateEventValidator = Joi.object({
    description: Joi.string().trim().min(1).max(6000).messages({
        'string.min': 'description must not be empty',
        'string.max': 'description must contain no more than 6000 characters',
    }),
    location_in_work_id: Joi.alternatives()
        .try(
            Joi.string()
                .trim()
                .min(1)
                .guid({ version: ['uuidv4', 'uuidv1'] }),

            Joi.valid(null)
        )
        .messages({
            'string.min': 'location_in_work_id must be a valid UUID or null',
            'alternatives.match': 'location_in_work_id must be a valid UUID or null',
            'string.guid': 'location_in_work_id must be a valid UUID',
        }),
})
    .or('description', 'location_in_work_id')
    .messages({
        'object.missing': 'At least one of description or location_in_work_id must be provided',
    })
    .prefs({ abortEarly: false, stripUnknown: true });

const linkParticipantValidator = Joi.object({
    character_in_work_id: Joi.string()
        .trim()
        .guid({ version: ['uuidv4', 'uuidv1'] })
        .min(1)
        .required()
        .messages({
            'string.min': 'character_in_work_id is required',
            'string.guid': 'character_in_work_id must be a valid UUID',
            'any.required': 'character_in_work_id is required',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

export default { createEventValidator, updateEventValidator, linkParticipantValidator };
