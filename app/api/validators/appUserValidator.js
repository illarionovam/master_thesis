import Joi from 'joi';

const passwordRule = Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/);

export const signUpAppUserValidator = Joi.object({
    username: Joi.string().trim().min(3).max(60).required().messages({
        'string.base': 'Username must be a string',
        'string.empty': 'Username is required',
        'string.min': 'Username must contain at least 3 characters',
        'string.max': 'Username must contain no more than 60 characters',
        'any.required': 'Username is required',
    }),
    email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .max(255)
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Email must be a valid email address',
            'string.max': 'Email must contain no more than 255 characters',
            'any.required': 'Email is required',
        }),
    name: Joi.string().trim().max(255).empty('').default(null).messages({
        'string.max': 'Name must contain no more than 255 characters',
    }),
    password: passwordRule.required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must contain at least 8 characters',
        'string.max': 'Password must contain no more than 20 characters',
        'string.pattern.base': 'Password must include at least 1 lowercase letter, 1 uppercase letter, and 1 digit',
        'any.required': 'Password is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

export const signInAppUserValidator = Joi.object({
    email: Joi.string().trim().lowercase().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

export const resetAppUserPasswordValidator = Joi.object({
    email: Joi.string().trim().lowercase().required().messages({
        'string.empty': 'Email is required',
        'any.required': 'Email is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

export const signOutAppUserValidator = Joi.object({
    terminate_all_sessions: Joi.boolean().truthy('true', '1', 1).falsy('false', '0', 0, '').default(false).messages({
        'boolean.base': 'Terminate All Sessions must be a boolean-like value',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });

export const updateAppUserNormalFieldsValidator = Joi.alternatives()
    .try(
        Joi.object({
            password: Joi.string().required().messages({
                'string.empty': 'Password is required',
                'any.required': 'Password is required',
            }),
            new_password: passwordRule.required().messages({
                'string.empty': 'New Password is required',
                'string.min': 'New Password must contain at least 8 characters',
                'string.max': 'New Password must contain no more than 20 characters',
                'string.pattern.base':
                    'New Password must include at least 1 lowercase letter, 1 uppercase letter, and 1 digit',
                'any.required': 'New Password is required',
            }),
            name: Joi.forbidden(),
            username: Joi.forbidden(),
            avatar_url: Joi.forbidden(),
        }),
        Joi.object({
            avatar_url: Joi.string().trim().uri().required().messages({
                'string.empty': 'Avatar URL is required',
                'any.required': 'Avatar URL is required',
            }),
            name: Joi.forbidden(),
            username: Joi.forbidden(),
            password: Joi.forbidden(),
            new_password: Joi.forbidden(),
        }),
        Joi.object({
            name: Joi.string().trim().max(255).required().messages({
                'string.max': 'Name must contain no more than 255 characters',
                'string.empty': 'Name is required',
                'any.required': 'Name is required',
            }),
            username: Joi.forbidden(),
            avatar_url: Joi.forbidden(),
            password: Joi.forbidden(),
            new_password: Joi.forbidden(),
        }),
        Joi.object({
            username: Joi.string().trim().min(3).max(60).required().messages({
                'string.base': 'Username must be a string',
                'string.empty': 'Username is required',
                'string.min': 'Username must contain at least 3 characters',
                'string.max': 'Username must contain no more than 60 characters',
                'any.required': 'Username is required',
            }),
            name: Joi.forbidden(),
            avatar_url: Joi.forbidden(),
            password: Joi.forbidden(),
            new_password: Joi.forbidden(),
        })
    )
    .prefs({ abortEarly: false, stripUnknown: true });

export const updateAppUserEmailValidator = Joi.object({
    new_email: Joi.string()
        .trim()
        .lowercase()
        .email({ tlds: { allow: false } })
        .max(255)
        .required()
        .messages({
            'string.empty': 'New Email is required',
            'string.email': 'New Email must be a valid email address',
            'string.max': 'New Email must contain no more than 255 characters',
            'any.required': 'New Email is required',
        }),
}).prefs({ abortEarly: false, stripUnknown: true });

export const confirmAppUserPasswordValidator = Joi.object({
    new_password: passwordRule.required().messages({
        'string.empty': 'New Password is required',
        'string.min': 'New Password must contain at least 8 characters',
        'string.max': 'New Password must contain no more than 20 characters',
        'string.pattern.base': 'New Password must include at least 1 lowercase letter, 1 uppercase letter, and 1 digit',
        'any.required': 'New Password is required',
    }),
}).prefs({ abortEarly: false, stripUnknown: true });
