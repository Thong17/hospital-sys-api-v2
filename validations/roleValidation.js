const Joi = require('joi')

const createRoleValidation = Joi.object({
    name: Joi.object()
        .required(),

    description: Joi.string()
        .allow(''),

    status: Joi.boolean().optional(),

    privilege: Joi.object()
        .required(),

    navigation: Joi.object()
        .required()
})

const updateRoleValidation = Joi.object({
    name: Joi.object()
        .required(),

    description: Joi.string()
        .allow(''),

    status: Joi.boolean().optional(),

    privilege: Joi.object()
        .required(),

    navigation: Joi.object()
        .required()
})

module.exports = { createRoleValidation, updateRoleValidation }