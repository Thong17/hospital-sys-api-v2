const Joi = require('joi')

const createTransactionValidation = Joi.object({
    description: Joi.string()
        .required(),

    price: Joi.number()
        .required(),

    quantity: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    schedule: Joi.string()
        .required(),

    product: Joi.string()
        .required(),

    note: Joi.string()
        .allow(''),
})

const updateTransactionValidation = Joi.object({
    description: Joi.string()
        .required(),

    price: Joi.number()
        .required(),

    quantity: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    schedule: Joi.string()
        .required(),

    product: Joi.string()
        .required(),

    note: Joi.string()
        .allow(''),
})

module.exports = { createTransactionValidation, updateTransactionValidation }