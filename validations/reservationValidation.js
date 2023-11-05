const Joi = require('joi')

const createReservationValidation = Joi.object({
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

module.exports = { createReservationValidation }