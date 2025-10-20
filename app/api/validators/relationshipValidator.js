import Joi from 'joi';

const createRelationshipValidator = Joi.object({
    from_character_in_work_id: Joi.string()
        .trim()
        .guid({ version: ['uuidv4', 'uuidv1'] })
        .min(1)
        .required()
        .messages({
            'string.min': 'from_character_in_work_id is required',
            'string.guid': 'from_character_in_work_id must be a valid UUID',
            'any.required': 'from_character_in_work_id is required',
        }),

    to_character_in_work_id: Joi.string()
        .trim()
        .guid({ version: ['uuidv4', 'uuidv1'] })
        .invalid(Joi.ref('from_character_in_work_id'))
        .min(1)
        .required()
        .messages({
            'string.min': 'to_character_in_work_id is required',
            'string.guid': 'to_character_in_work_id must be a valid UUID',
            'any.required': 'to_character_in_work_id is required',
            'any.invalid': 'to_character_in_work_id must be different from from_character_in_work_id',
        }),

    type: Joi.string().trim().min(1).max(120).required().messages({
        'string.min': 'type is required',
        'string.max': 'type must contain no more than 120 characters',
        'any.required': 'type is required',
    }),
    notes: Joi.alternatives()
        .try(
            Joi.string().trim().max(500).messages({
                'string.max': 'notes must contain no more than 500 characters',
            }),
            Joi.valid(null)
        )
        .empty('')
        .default(null),
}).prefs({ abortEarly: false, stripUnknown: true });

export const updateRelationshipValidator = Joi.object({
    type: Joi.string().trim().min(1).max(120).messages({
        'string.min': 'type must not be empty',
        'string.max': 'type must contain no more than 120 characters',
    }),
    notes: Joi.alternatives().try(
        Joi.string().trim().min(1).max(500).messages({
            'string.min': 'notes must be null or not be empty',
            'string.max': 'notes must contain no more than 500 characters',
        }),
        Joi.valid(null)
    ),
})
    .or('type', 'notes')
    .messages({
        'object.missing': 'At least one of type or notes must be provided',
    })
    .prefs({ abortEarly: false, stripUnknown: true });

export default { createRelationshipValidator, updateRelationshipValidator };
