const response = require('../helpers/response')
const Category = require('../models/Category')
const { createCategoryValidation } = require('../validations/categoryValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp } = require('../helpers/utils')


exports.create = async (req, res) => {
    try {
        const { error } = createCategoryValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        const category = new Category(body)
        category.createdBy = req.user?._id
        await category.save()
        response.success(200, { data: category, message: 'CATEGORY_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const category = await Category.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user._id })
        response.success(200, { data: category, message: 'CATEGORY_HAS_BEEN_DELETED' }, res)
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
        
        let query = { isDeleted: false }
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const category = await Category.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ createdAt })

        const totalCategory = await Category.count(query)
        response.success(200, { data: category, metaData: { skip, limit, total: totalCategory } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}