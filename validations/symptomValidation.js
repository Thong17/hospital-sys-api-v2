const Joi = require('joi')

const createSymptomValidation = Joi.object({
    name: Joi.object()
        .required(),

    description: Joi.string()
        .allow(''),
})

module.exports = { createSymptomValidation }