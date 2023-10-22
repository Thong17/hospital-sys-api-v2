const response = require('../helpers/response')
const Role = require('../models/Role')
const { createRoleValidation } = require('../validations/roleValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors } = require('../helpers/utils')


exports.getPermission = (_, res) => {
    const { privilege, navigation } = require('../constants/privilege')
    response.success(200, { privilege, navigation }, res)
}

exports.getPrePermission = (_, res) => {
    const { preMenu, preRole } = require('../constants/privilege')
    response.success(200, { preMenu, preRole }, res)
}

exports.create = async (req, res) => {
    try {
        const { error } = createRoleValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const role = await Role.create(req.body)
        response.success(200, { data: role, message: 'ROLE_HAS_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.list = async (req, res) => {
    try {
        const roles = await Role.find()
        response.success(200, { data: roles }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}