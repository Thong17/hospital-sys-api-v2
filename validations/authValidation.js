const Joi = require('joi')

const loginValidation = Joi.object({
    username: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'USERNAME_MIN_{#limit}',
            'any.required': 'USERNAME_IS_REQUIRED'
        }),

    password: Joi.string()
        .min(7)
        .required()
        .messages({
            'string.min': 'PASSWORD_MIN_{#limit}',
            'any.required': 'PASSWORD_IS_REQUIRED'
        }),
})

const registerValidation = Joi.object({
    username: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.min': 'USERNAME_MIN_{#limit}',
            'any.required': 'USERNAME_IS_REQUIRED'
        }),

    password: Joi.string()
        .min(7)
        .required()
        .messages({
            'string.min': 'PASSWORD_MIN_{#limit}',
            'any.required': 'PASSWORD_IS_REQUIRED'
        }),

    segment: Joi.string()
        .valid('GENERAL', 'DOCTOR', 'PATIENT')
})

module.exports = { loginValidation, registerValidation }