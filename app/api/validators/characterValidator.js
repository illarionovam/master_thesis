import Joi from 'joi';

const createCharacterValidator = Joi.object({
    name: Joi.string().trim().min(1).max(200).required().messages({
        'string.min': 'name is required',
        'string.max': 'name must contain no more than 200 characters',
        'any.required': 'name is required',
    }),
    appearance: Joi.string().trim().min(1).max(3000).required().messages({
        'string.min': 'appearance is required',
        'string.max': 'appearance must contain no more than 3000 characters',
        'any.required': 'appearance is required',
    }),
    personality: Joi.string().trim().min(1).max(3000).required().messages({
        'string.min': 'personality is required',
        'string.max': 'personality must contain no more than 3000 characters',
        'any.required': 'personality is required',
    }),
    bio: Joi.string().trim().min(1).max(6000).required().messages({
        'string.min': 'bio is required',
        'string.max': 'bio must contain no more than 6000 characters',
        'any.required': 'bio is required',
    }),
    attributes: Joi.object().unknown(true).default({}).messages({
        'object.base': 'attributes must be a JSON object',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

const coreUpdate = Joi.object({
    image_url: Joi.forbidden(),
    name: Joi.string().trim().min(1).max(200).messages({
        'string.min': 'name must not be empty',
        'string.max': 'name must contain no more than 200 characters',
    }),
    appearance: Joi.string().trim().min(1).max(3000).messages({
        'string.min': 'appearance must not be empty',
        'string.max': 'appearance must contain no more than 3000 characters',
    }),
    personality: Joi.string().trim().min(1).max(3000).messages({
        'string.min': 'personality must not be empty',
        'string.max': 'personality must contain no more than 3000 characters',
    }),
    bio: Joi.string().trim().min(1).max(6000).messages({
        'string.min': 'bio must not be empty',
        'string.max': 'bio must contain no more than 6000 characters',
    }),
    attributes: Joi.object().unknown(true).messages({
        'object.base': 'attributes must be a JSON object',
    }),
})
    .or('name', 'appearance', 'personality', 'bio', 'attributes')
    .messages({
        'object.missing': 'At least one of name, appearance, personality, bio, or attributes must be provided',
    });

const imageOnly = Joi.object({
    image_url: Joi.alternatives()
        .try(
            Joi.string().trim().uri().min(1).messages({
                'string.min': 'image_url is required',
                'string.uri': 'image_url must be a valid URI',
            }),
            Joi.valid(null)
        )
        .required()
        .messages({
            'any.required': 'image_url is required',
            'alternatives.match': 'image_url must be a valid URI or null',
        }),

    name: Joi.forbidden(),
    appearance: Joi.forbidden(),
    personality: Joi.forbidden(),
    bio: Joi.forbidden(),
    attributes: Joi.forbidden(),
});

const updateCharacterValidator = Joi.alternatives()
    .try(coreUpdate, imageOnly)
    .prefs({ abortEarly: false, stripUnknown: true });

export default { createCharacterValidator, updateCharacterValidator };
