const response = require('../helpers/response')
const Payment = require('../models/Payment')
const { createPaymentValidation, updatePaymentValidation } = require('../validations/paymentValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp } = require('../helpers/utils')


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
        const limit = parseInt(req.query.limit ?? 5)
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
            .select('invoice schedule total subtotal stage createdAt')
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