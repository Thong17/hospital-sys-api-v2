const Joi = require('joi')

const createReservationValidation = Joi.object({
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

const updateReservationValidation = Joi.object({
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

const refuseReservationValidation = Joi.object({
    note: Joi.string()
        .allow(''),
})

const approveReservationValidation = Joi.object({
    note: Joi.string()
        .allow(''),
})

module.exports = { createReservationValidation, updateReservationValidation, refuseReservationValidation, approveReservationValidation }