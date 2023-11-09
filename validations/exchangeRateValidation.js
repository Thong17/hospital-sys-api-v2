const Joi = require('joi')

const createExchangeRateValidation = Joi.object({
    value: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    description: Joi.string()
        .allow(''),

    status: Joi.boolean().optional(),
})

module.exports = { createExchangeRateValidation }