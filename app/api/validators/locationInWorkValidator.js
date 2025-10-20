import Joi from 'joi';

const updateLocationInWorkValidator = Joi.object({
    attributes: Joi.object().unknown(true).required().messages({
        'object.base': 'attributes must be a JSON object',
        'any.required': 'attributes is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

export default { updateLocationInWorkValidator };
