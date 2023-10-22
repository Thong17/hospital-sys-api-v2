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
        const role = new Role(req.body)
        await role.save()
        response.success(200, { data: role, message: 'ROLE_HAS_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const skip = page - 1
        const name = req.query.name === 'asc' ? 1 : -1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1
        
        let query = { isDeleted: false }
        const search = req.query.search?.replace(/ /g,'')
        if (search) {
            query['tags'] = {
                $regex: search
            }
        }

        const roles = await Role.find(query).skip((skip) * limit).limit(limit).sort({ name, createdAt })
        const totalRole = await Role.count({ isDeleted: false })
        response.success(200, { data: roles, metaData: { skip, limit, total: totalRole } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}