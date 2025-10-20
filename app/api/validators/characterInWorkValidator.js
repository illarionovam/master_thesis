import Joi from 'joi';

const updateCharacterInWork = Joi.alternatives()
    .try(
        Joi.object({
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
            attributes: Joi.forbidden(),
        }),
        Joi.object({
            image_url: Joi.forbidden(),
            attributes: Joi.object().unknown(true).required().messages({
                'object.base': 'attributes must be a JSON object',
                'any.required': 'attributes is required',
            }),
        })
    )
    .prefs({ abortEarly: false, stripUnknown: true });

export default { updateCharacterInWork };
