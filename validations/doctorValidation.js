const Joi = require('joi')

const createDoctorValidation = Joi.object({
    fullName: Joi.string()
        .optional()
        .allow(''),

    specialties: Joi.array(),

    shift: Joi.array(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional()
        .allow(''),

    contact: Joi.string()
        .optional()
        .allow(''),

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

const updateDoctorValidation = Joi.object({
    fullName: Joi.string()
        .optional()
        .allow(''),

    specialties: Joi.array(),

    shift: Joi.array(),

    email: Joi.string()
        .email({ tlds: { allow: false } })
        .optional()
        .allow(''),

    contact: Joi.string()
        .optional()
        .allow(''),

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

module.exports = { createDoctorValidation, updateDoctorValidation }