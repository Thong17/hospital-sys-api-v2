const response = require('../helpers/response')
const Transaction = require('../models/Transaction')
const { createTransactionValidation, updateTransactionValidation } = require('../validations/transactionValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp, createTransactionStock, reverseTransactionStock } = require('../helpers/utils')


exports.create = async (req, res) => {
    try {
        const { error } = createTransactionValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        
        const body = req.body
        const transaction = new Transaction(body)
        transaction.createdBy = req.user?._id
        const totalPerQty = transaction.price - (transaction.discount * transaction.price / 100)
        transaction.total = totalPerQty * transaction.quantity

        const stocks = await createTransactionStock(body.product, body.quantity)
        transaction.stocks = stocks
        await transaction.save()
        await transaction.populate('currency', 'symbol')
        await transaction.populate('product', 'images -_id')
        response.success(200, { data: transaction, message: 'TRANSACTION_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.update = async (req, res) => {
    try {
        const { error } = updateTransactionValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        const transaction = new Transaction(body)
        transaction.updatedBy = req.user?._id
        await transaction.save()
        response.success(200, { data: transaction, message: 'TRANSACTION_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const transaction = await reverseTransactionStock(id)
        transaction.stage = 'REMOVED'
        transaction.updatedBy = req.user?._id
        await transaction.save()
        response.success(200, { data: transaction, message: 'TRANSACTION_HAS_BEEN_DELETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const data = await Transaction.findById(id)
        response.success(200, { data }, res)
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

        const transaction = await Transaction.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ lastName, firstName, createdAt })
            .populate('currency', 'currency -_id')

        const totalTransaction = await Transaction.count(query)
        response.success(200, { data: transaction, metaData: { skip, limit, total: totalTransaction } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}