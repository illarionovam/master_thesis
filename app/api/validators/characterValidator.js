import Joi from 'joi';

const createCharacterValidator = Joi.object({
    name: Joi.string().trim().max(200).required().messages({
        'string.empty': 'name is required',
        'string.max': 'name must contain no more than 200 characters',
        'any.required': 'name is required',
    }),
    appearance: Joi.string().trim().max(3000).required().messages({
        'string.empty': 'appearance is required',
        'string.max': 'appearance must contain no more than 3000 characters',
        'any.required': 'appearance is required',
    }),
    personality: Joi.string().trim().max(3000).required().messages({
        'string.empty': 'personality is required',
        'string.max': 'personality must contain no more than 3000 characters',
        'any.required': 'personality is required',
    }),
    bio: Joi.string().trim().max(6000).required().messages({
        'string.empty': 'bio is required',
        'string.max': 'bio must contain no more than 6000 characters',
        'any.required': 'bio is required',
    }),
    attributes: Joi.object().unknown(true).default({}).messages({
        'object.base': 'attributes must be a JSON object',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

/*
    image_url: Joi.string().trim().empty('').default(null).uri().messages({
        'string.uri': 'image_url must be a valid URI',
    }),
    */
export default { createCharacterValidator };
