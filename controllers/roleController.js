const moment = require('moment')
const response = require('../helpers/response')
const Role = require('../models/Role')
const History = require('../models/History')
const { createRoleValidation, updateRoleValidation } = require('../validations/roleValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors } = require('../helpers/utils')
const generateExcel = require('../configs/excel')


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

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        // TODO: add reason to audit log
        console.log(reason)
        const role = await Role.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user._id })
        response.success(200, { data: role, message: 'ROLE_HAS_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.update = async (req, res) => {
    try {
        const { error } = updateRoleValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const id = req.params.id
        req.body.updatedBy = req.user._id
        const role = await Role.findByIdAndUpdate(id, req.body)
        response.success(200, { data: role, message: 'ROLE_HAS_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const role = await Role.findById(id)
        response.success(200, { data: role }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.history = async (req, res) => {
    try {
        const id = req.params.id
        const histories = await History.find({ moduleId: id, module: 'ROLE' })
            .populate('createdBy', 'username -_id')
            .sort({ createdAt: 'desc' })
            
        response.success(200, { data: histories }, res)
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
        const search = req.query.search?.split(' ').filter(Boolean).map(value => new RegExp(value))
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const roles = await Role.find(query).skip((skip) * limit).limit(limit).sort({ name, createdAt })
        const totalRole = await Role.count({ isDeleted: false })
        response.success(200, { data: roles, metaData: { skip, limit, total: totalRole } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._export = async (req, res) => {
    try {
        const name = req.query.name === 'asc' ? 1 : -1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1

        let query = { isDeleted: false }
        const search = req.query.search?.split(' ').filter(Boolean).map(value => new RegExp(value))
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const columns = [
            { 
                key: 'no', 
                width: 5,  
                style: {
                    alignment: {
                        vertical:'middle',
                        horizontal:'center'
                    }
                }
            },
            { 
                key: 'id', 
                width: 27,
            },
            { 
                key: 'status', 
                width: 10,
            },
            { 
                key: 'description', 
                width: 45,
            }, 
            { 
                key: 'tags', 
                width: 55,
            },
        ]
        
        const columnHeader = { no: 'NO', id: 'ID', status: 'STATUS', description: 'DESCRIPTION', tags: 'TAGS' }

        const mapRowData = (_data) => {
            return [{
                no: 1,
                id: 1,
                status: 1,
                description: 1,
                tags: 1,
            }]
        }
        const roles = await Role.find(query).sort({ name, createdAt })
        const file = await generateExcel(columns, columnHeader, mapRowData(roles))

        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename=role_${now}.xlsx`)
        
        response.success(200, { file, name: `ROLE_${now}.xlsx` }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}