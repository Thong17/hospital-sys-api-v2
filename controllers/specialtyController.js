const response = require('../helpers/response')
const Specialty = require('../models/Specialty')
const { createSpecialtyValidation } = require('../validations/specialtyValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp } = require('../helpers/utils')


exports.create = async (req, res) => {
    try {
        const { error } = createSpecialtyValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        const specialty = new Specialty(body)
        specialty.createdBy = req.user?._id
        await specialty.save()
        response.success(200, { data: specialty, message: 'SPECIALTY_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const specialty = await Specialty.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user._id })
        response.success(200, { data: specialty, message: 'SPECIALTY_HAS_BEEN_DELETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page ?? 1)
        const limit = parseInt(req.query.limit ?? 5)
        const skip = page - 1
        const lastName = req.query.lastName === 'asc' ? 1 : -1
        const firstName = req.query.firstName === 'asc' ? 1 : -1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1
        
        let query = { isDeleted: false }
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const specialty = await Specialty.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ lastName, firstName, createdAt })
            .populate('currency', 'currency -_id')

        const totalSpecialty = await Specialty.count(query)
        response.success(200, { data: specialty, metaData: { skip, limit, total: totalSpecialty } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}