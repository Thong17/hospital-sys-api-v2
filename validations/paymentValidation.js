const Joi = require('joi')

const createPaymentValidation = Joi.object({
    appointmentDate: Joi.string()
        .optional()
        .allow(''),

    duration: Joi.number()
        .optional(),

    patient: Joi.string()
        .required(),

    category: Joi.string()
        .required(),

    specialties: Joi.array(),

    doctors: Joi.array(),

    note: Joi.string()
        .allow(''),

    status: Joi.boolean().optional(),
})

const updatePaymentValidation = Joi.object({
    appointmentDate: Joi.string()
        .required(),

    duration: Joi.number()
        .optional(),

    patient: Joi.string()
        .required(),

    category: Joi.string()
        .required(),

    specialties: Joi.array(),

    doctors: Joi.array(),

    note: Joi.string()
        .allow(''),

    status: Joi.boolean().optional(),
})

module.exports = { createPaymentValidation, updatePaymentValidation }