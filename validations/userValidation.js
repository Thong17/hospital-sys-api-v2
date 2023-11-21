const Joi = require('joi')

const createUserValidation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        
    role: Joi.string()
        .required(),

    segment: Joi.string()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

const updateUserValidation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
        
    role: Joi.string()
        .required(),

    segment: Joi.string()
        .required(),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .optional()
        .allow(''),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

module.exports = { createUserValidation, updateUserValidation }