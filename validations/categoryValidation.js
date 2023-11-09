const Joi = require('joi')

const createCategoryValidation = Joi.object({
    name: Joi.object()
        .required(),

    description: Joi.string()
        .allow(''),
})

module.exports = { createCategoryValidation }