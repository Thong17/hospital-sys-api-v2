const Joi = require('joi')

const createSpecialtyValidation = Joi.object({
    name: Joi.object()
        .required(),

    cost: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    description: Joi.string()
        .allow(''),

    status: Joi.boolean().optional(),
})

module.exports = { createSpecialtyValidation }