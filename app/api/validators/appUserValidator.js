import Joi from 'joi';

const passwordRule = Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);

const signUpAppUserValidator = Joi.object({
    username: Joi.string().trim().min(3).max(60).required().messages({
        'string.base': 'username must be a string',
        'string.empty': 'username is required',
        'string.min': 'username must contain at least 3 characters',
        'string.max': 'username must contain no more than 60 characters',
        'any.required': 'username is required',
    }),
    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.min': 'email is required',
            'string.email': 'email must be a valid email address',
            'string.max': 'email must contain no more than 255 characters',
            'any.required': 'email is required',
        }),
    name: Joi.string().trim().max(255).empty('').default(null).messages({
        'string.max': 'name must contain no more than 255 characters',
    }),
    password: passwordRule.required().messages({
        'string.empty': 'password is required',
        'string.min': 'password must contain at least 8 characters',
        'string.max': 'password must contain no more than 20 characters',
        'string.pattern.base': 'password must include at least 1 lowercase letter, 1 uppercase letter, and 1 digit',
        'any.required': 'password is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

const signInAppUserValidator = Joi.object({
    email: Joi.string().trim().lowercase().min(1).required().messages({
        'string.min': 'email is required',
        'any.required': 'email is required',
    }),
    password: Joi.string().min(1).required().messages({
        'string.min': 'password is required',
        'any.required': 'password is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

const resetAppUserPasswordValidator = Joi.object({
    email: Joi.string().trim().lowercase().min(1).required().messages({
        'string.min': 'email is required',
        'any.required': 'email is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

const signOutAppUserValidator = Joi.object({
    terminate_all_sessions: Joi.boolean().truthy('true', '1', 1).falsy('false', '0', 0, '').default(false).messages({
        'boolean.base': 'terminate_all_sessions must be a boolean-like value',
    }),
})
    .default({ terminate_all_sessions: false })
    .prefs({ abortEarly: false, stripUnknown: true });

const updateAppUserNormalFieldsValidator = Joi.alternatives()
    .try(
        Joi.object({
            password: Joi.string().min(1).required().messages({
                'string.min': 'password is required',
                'any.required': 'password is required',
            }),
            new_password: passwordRule.required().messages({
                'string.empty': 'new_password is required',
                'string.min': 'new_password must contain at least 8 characters',
                'string.max': 'new_password must contain no more than 20 characters',
                'string.pattern.base':
                    'new_password must include at least 1 lowercase letter, 1 uppercase letter, and 1 digit',
                'any.required': 'new_password is required',
            }),
            name: Joi.forbidden(),
            username: Joi.forbidden(),
            avatar_url: Joi.forbidden(),
        }),
        Joi.object({
            avatar_url: Joi.string().trim().uri().min(1).required().messages({
                'string.min': 'avatar_url is required',
                'string.uri': 'avatar_url must be a valid URI',
                'any.required': 'avatar_url is required',
            }),
            name: Joi.forbidden(),
            username: Joi.forbidden(),
            password: Joi.forbidden(),
            new_password: Joi.forbidden(),
        }),
        Joi.object({
            name: Joi.alternatives().try(Joi.string().trim().min(1).max(255), Joi.valid(null)).messages({
                'string.min': 'name is required',
                'string.max': 'name must contain no more than 255 characters',
                'any.only': 'name must be null or a non-empty string',
            }),
            username: Joi.string().trim().min(3).max(60).required().messages({
                'string.base': 'username must be a string',
                'string.empty': 'username is required',
                'string.min': 'username must contain at least 3 characters',
                'string.max': 'username must contain no more than 60 characters',
                'any.required': 'username is required',
            }),
            avatar_url: Joi.forbidden(),
            password: Joi.forbidden(),
            new_password: Joi.forbidden(),
        })
    )
    .prefs({ abortEarly: false, stripUnknown: true });

const updateAppUserEmailValidator = Joi.object({
    new_email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .min(1)
        .max(255)
        .required()
        .messages({
            'string.min': 'new_email is required',
            'string.email': 'new_email must be a valid email address',
            'string.max': 'new_email must contain no more than 255 characters',
            'any.required': 'new_email is required',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

const confirmAppUserPasswordValidator = Joi.object({
    new_password: passwordRule.required().messages({
        'string.empty': 'new_password is required',
        'string.min': 'new_password must contain at least 8 characters',
        'string.max': 'new_password must contain no more than 20 characters',
        'string.pattern.base': 'new_password must include at least 1 lowercase letter, 1 uppercase letter, and 1 digit',
        'any.required': 'new_password is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

export default {
    signUpAppUserValidator,
    signInAppUserValidator,
    resetAppUserPasswordValidator,
    signOutAppUserValidator,
    updateAppUserNormalFieldsValidator,
    updateAppUserEmailValidator,
    confirmAppUserPasswordValidator,
};
