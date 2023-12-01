const Joi = require('joi')

const createPatientValidation = Joi.object({
    username: Joi.string()
        .optional()
        .allow(''),

    fullName: Joi.string()
        .optional()
        .allow(''),

    specialty: Joi.array(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional()
        .allow(''),

    contact: Joi.string()
        .required(),

    dateOfBirth: Joi.string()
        .optional()
        .allow(''),

    startTime: Joi.string()
        .optional()
        .allow(''),

    endTime: Joi.string()
        .optional()
        .allow(''),

    gender: Joi.string()
        .optional()
        .allow(''),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

const updatePatientValidation = Joi.object({
    username: Joi.string()
        .optional()
        .allow(''),
        
    fullName: Joi.string()
        .optional()
        .allow(''),

    specialty: Joi.array(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional()
        .allow(''),

    contact: Joi.string()
        .required(),

    dateOfBirth: Joi.string()
        .optional()
        .allow(''),

    startTime: Joi.string()
        .optional()
        .allow(''),

    endTime: Joi.string()
        .optional()
        .allow(''),

    gender: Joi.string()
        .optional()
        .allow(''),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

module.exports = { createPatientValidation, updatePatientValidation }