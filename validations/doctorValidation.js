const Joi = require('joi')

const createDoctorValidation = Joi.object({
    lastName: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),

    firstName: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),

    specialty: Joi.array(),

    dateOfBirth: Joi.string()
        .optional()
        .allow(''),

    gender: Joi.string()
        .required(),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

const updateDoctorValidation = Joi.object({
    lastName: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),

    firstName: Joi.string()
        .alphanum()
        .min(2)
        .max(30)
        .required(),

    specialty: Joi.array(),

    dateOfBirth: Joi.string()
        .optional()
        .allow(''),

    gender: Joi.string()
        .required(),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

module.exports = { createDoctorValidation, updateDoctorValidation }