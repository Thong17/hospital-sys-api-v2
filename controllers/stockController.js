const response = require('../helpers/response')
const Stock = require('../models/ProductStock')
const History = require('../models/History')
const { createStockValidation, updateStockValidation } = require('../validations/stockValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp } = require('../helpers/utils')


exports.create = async (req, res) => {
    try {
        const { error } = createStockValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        body.remain = body.quantity
        const stock = new Stock(body)
        stock.createdBy = req.user?._id
        await stock.save()
        await stock.pushStock(body.product)
        response.success(200, { data: stock, message: 'STOCK_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const stock = await Stock.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user?._id })
        response.success(200, { data: stock, message: 'STOCK_HAS_BEEN_DELETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.update = async (req, res) => {
    try {
        delete req.body.images
        const { error } = updateStockValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const id = req.params.id
        const body = req.body
        body.remain = body.quantity
        body.updatedBy = req.user?._id
        const stock = await Stock.findByIdAndUpdate(id, body)
        response.success(200, { data: stock, message: 'STOCK_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const stock = await Stock.findById(id)
            .populate('createdBy', 'username -_id')
            .populate('updatedBy', 'username -_id')
        response.success(200, { data: stock }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.history = async (req, res) => {
    try {
        const id = req.params.id
        const histories = await History.find({ moduleId: id, module: 'STOCK' })
            .populate('createdBy', 'username -_id')
            .sort({ createdAt: 'desc' })
            
        response.success(200, { data: histories }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page ?? 1)
        const limit = parseInt(req.query.limit ?? 0)
        const productId = req.query.productId
        const skip = page - 1
        const username = req.query.username === 'asc' ? 1 : -1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1
        
        let query = { isDeleted: false, product: productId }
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const stocks = await Stock.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ username, createdAt })

        const totalStock = await Stock.count(query)
        response.success(200, { data: stocks, metaData: { skip, limit, total: totalStock } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}