const Joi = require('joi')

const createStockValidation = Joi.object({
    cost: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    product: Joi.string()
        .required(),

    quantity: Joi.number()
        .required(),

    alertAt: Joi.number()
        .required(),

    expireAt: Joi.string()
        .optional()
        .allow(''),

    code: Joi.string()
        .optional()
        .allow(''),

    note: Joi.string()
        .allow(''),
})

const updateStockValidation = Joi.object({
    cost: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    product: Joi.string()
        .required(),

    quantity: Joi.number()
        .required(),

    alertAt: Joi.number()
        .required(),

    expireAt: Joi.string()
        .optional()
        .allow(''),

    code: Joi.string()
        .optional()
        .allow(''),

    note: Joi.string()
        .allow(''),
})

module.exports = { createStockValidation, updateStockValidation }