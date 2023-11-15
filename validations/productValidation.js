const Joi = require('joi')

const createProductValidation = Joi.object({
    name: Joi.object()
        .required(),

    price: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    category: Joi.string()
        .optional(),

    symptoms: Joi.array()
        .optional(),

    code: Joi.string()
        .optional()
        .allow(''),

    isStock: Joi.boolean().optional(),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

const updateProductValidation = Joi.object({
    name: Joi.object()
        .required(),

    price: Joi.number()
        .required(),

    currency: Joi.string()
        .required(),

    category: Joi.string()
        .optional(),

    symptoms: Joi.array()
        .optional(),

    code: Joi.string()
        .optional()
        .allow(''),

    isStock: Joi.boolean().optional(),

    status: Joi.boolean().optional(),

    description: Joi.string()
        .allow(''),
})

module.exports = { createProductValidation, updateProductValidation }