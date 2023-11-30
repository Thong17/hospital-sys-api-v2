const response = require('../helpers/response')
const Symptom = require('../models/Symptom')
const { createSymptomValidation } = require('../validations/symptomValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp } = require('../helpers/utils')


exports.create = async (req, res) => {
    try {
        const { error } = createSymptomValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        const symptom = new Symptom(body)
        symptom.createdBy = req.user?._id
        await symptom.save()
        response.success(200, { data: symptom, message: 'SYMPTOM_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const symptom = await Symptom.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user._id })
        response.success(200, { data: symptom, message: 'SYMPTOM_HAS_BEEN_DELETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page ?? 1)
        const limit = parseInt(req.query.limit ?? 0)
        const skip = page - 1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1
        const status = req.query.status
        
        let query = { isDeleted: false }
        if (status) query.status = status === 'true'
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const symptom = await Symptom.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ createdAt })

        const totalSymptom = await Symptom.count(query)
        response.success(200, { data: symptom, metaData: { skip, limit, total: totalSymptom } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}