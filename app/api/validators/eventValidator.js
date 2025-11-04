import Joi from 'joi';

export const createEventValidator = Joi.object({
    title: Joi.string().trim().min(1).max(100).required().messages({
        'string.min': 'title is required',
        'string.max': 'title must contain no more than 100 characters',
        'any.required': 'title is required',
    }),
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

const updateOnlyOrder = Joi.object({
    order_in_work: Joi.number().integer().min(1).required().messages({
        'number.base': 'order_in_work must be an integer',
        'number.min': 'order_in_work must be >= 1',
        'any.required': 'order_in_work is required',
    }),
})
    .unknown(false)
    .messages({
        'object.unknown': 'Only order_in_work can be updated in this request',
    });

const updateContent = Joi.object({
    order_in_work: Joi.forbidden(),
    title: Joi.string().trim().min(1).max(100).messages({
        'string.min': 'title must not be empty',
        'string.max': 'title must contain no more than 100 characters',
    }),
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
    .or('title', 'description', 'location_in_work_id')
    .messages({
        'object.missing': 'At least one of title, description, or location_in_work_id must be provided',
    })
    .prefs({ abortEarly: false, stripUnknown: true });

const updateEventValidator = Joi.alternatives().try(updateOnlyOrder, updateContent).messages({
    'alternatives.match':
        'Provide either only order_in_work, or at least one of title, description, location_in_work_id (without order_in_work)',
});

export const reorderEventsValidator = Joi.object({
    data: Joi.array()
        .min(1)
        .required()
        .items(
            Joi.object({
                id: Joi.string()
                    .trim()
                    .guid({ version: ['uuidv4', 'uuidv1'] })
                    .required(),
                order_in_work: Joi.number().integer().min(1).required(),
            })
        )
        .messages({
            'array.min': 'data must contain at least one element',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

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

export default { createEventValidator, reorderEventsValidator, updateEventValidator, linkParticipantValidator };
