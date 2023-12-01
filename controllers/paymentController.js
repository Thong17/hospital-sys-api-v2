const response = require('../helpers/response')
const Payment = require('../models/Payment')
const Transaction = require('../models/Transaction')
const { createPaymentValidation, updatePaymentValidation } = require('../validations/paymentValidation')
const { createTransactionValidation } = require('../validations/transactionValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp, createTransactionStock, reverseTransactionStock } = require('../helpers/utils')


exports.create = async (req, res) => {
    try {
        const { error } = createPaymentValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        const payment = new Payment(body)
        payment.createdBy = req.user?._id
        await payment.save()
        response.success(200, { data: payment, message: 'PAYMENT_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const payment = await Payment.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user._id })
        response.success(200, { data: payment, message: 'PAYMENT_HAS_BEEN_DELETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.update = async (req, res) => {
    try {
        const { error } = updatePaymentValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const id = req.params.id
        const body = req.body
        body.updatedBy = req.user?._id
        const payment = await Payment.findByIdAndUpdate(id, body, { new: true })
        response.success(200, { data: payment, message: 'PAYMENT_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.complete = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        body.updatedBy = req.user?._id
        body.stage = 'COMPLETED'
        const payment = await Payment.findByIdAndUpdate(id, body, { new: true })
        await payment.completeTransaction(id)
        response.success(200, { data: payment, message: 'PAYMENT_HAS_BEEN_COMPLETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}


exports.appendTransaction = async (req, res) => {
    try {
        const { error } = createTransactionValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        
        const body = req.body
        const transaction = new Transaction(body)
        transaction.createdBy = req.user?._id
        const totalPerQty = transaction.price - (transaction.discount * transaction.price / 100)
        transaction.total = totalPerQty * transaction.quantity

        const { transactionStocks, totalCost } = await createTransactionStock(body.product, body.quantity) || {}
        transaction.stocks = transactionStocks
        transaction.cost = totalCost
        await transaction.save()
        await transaction.populate('currency', 'symbol')
        await transaction.populate('product', 'images -_id')
        await transaction.pushPayment(body.schedule)
        response.success(200, { data: transaction, message: 'TRANSACTION_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.removeTransaction = async (req, res) => {
    try {
        const id = req.params.id
        const { transactionId, reason } = req.body || {}
        if (res.log) res.log.description = reason
        const transaction = await reverseTransactionStock(transactionId)
        await transaction.pullPayment(id)
        await Transaction.findByIdAndDelete(transactionId)
        response.success(200, { data: transaction, message: 'TRANSACTION_HAS_BEEN_DELETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const payment = await Payment.findById(id)
            .populate('createdBy', 'username -_id')
            .populate('updatedBy', 'username -_id')
            .populate({
                path: 'transactions',
                populate: {
                    path: 'product',
                    select: 'images -_id'
                }
            })
        response.success(200, { data: payment }, res)
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

        let query = {}
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const payment = await Payment.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ createdAt })
            .select('invoice schedule total subtotal stage createdAt product')
            .populate({
                path: 'schedule',
                select: 'endedAt patient doctor -_id',
                populate: [
                    {
                        path: 'patient',
                        select: 'username contact -_id'
                    },
                    {
                        path: 'doctor',
                        select: 'username contact -_id'
                    }
                ]
            })

        const totalPayment = await Payment.count(query)
        response.success(200, { data: payment, metaData: { skip, limit, total: totalPayment } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}