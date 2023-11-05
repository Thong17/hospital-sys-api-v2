const moment = require('moment')
const response = require('../helpers/response')
const Reservation = require('../models/Reservation')
const { createReservationValidation } = require('../validations/reservationValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors } = require('../helpers/utils')


exports.create = async (req, res) => {
    try {
        const { error } = createReservationValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        const reservation = new Reservation(body)
        reservation.createdBy = req.user?._id
        await reservation.save()
        response.success(200, { data: reservation, message: 'RESERVATION_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const reservation = await Reservation.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user._id })
        response.success(200, { data: reservation, message: 'RESERVATION_HAS_BEEN_DELETED' }, res)
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
        const search = req.query.search?.split(' ').filter(Boolean).map(value => new RegExp(value))
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const reservation = await Reservation.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ lastName, firstName, createdAt })
            .populate('patient', 'lastName firstName contact -_id')

        const totalReservation = await Reservation.count()
        response.success(200, { data: reservation, metaData: { skip, limit, total: totalReservation } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}