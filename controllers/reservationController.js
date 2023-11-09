const moment = require('moment')
const response = require('../helpers/response')
const Reservation = require('../models/Reservation')
const { createReservationValidation, updateReservationValidation, refuseReservationValidation, approveReservationValidation } = require('../validations/reservationValidation')
const { ValidationError, BadRequestError } = require('../helpers/handlingErrors')
const { extractJoiErrors, convertStringToArrayRegExp } = require('../helpers/utils')
const Schedule = require('../models/Schedule')


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

exports.update = async (req, res) => {
    try {
        const { error } = updateReservationValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const id = req.params.id
        const body = req.body
        body.updatedBy = req.user?._id
        if (body.doctors?.length > 0) body.stage = 'PENDING'
        const reservation = await Reservation.findByIdAndUpdate(id, body, { new: true })
        response.success(200, { data: reservation, message: 'RESERVATION_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.refuse = async (req, res) => {
    try {
        const { error } = refuseReservationValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const note = req.body.note
        const doctorId = req.user?._id
        const reservationId = req.params.id

        const reservation = await Schedule.findOneAndUpdate({ reservation: reservationId, doctor: doctorId, approval: 'PENDING' }, { approval: 'REFUSED', note })
        if (!reservation) throw new BadRequestError('DOCTOR_IS_NOT_IN_SELECTED')
        const selectedDoctors = await Schedule.find({ reservation: reservationId, approval: 'PENDING' })
        const data = await Reservation.findByIdAndUpdate(reservationId, { 
            updatedBy: req.user?._id, 
            stage: selectedDoctors?.length === 0 ? 'REFUSED' : 'PENDING', 
            doctors: selectedDoctors?.map(item => item?.doctor) 
        }, { new: true })

        response.success(200, { data, message: 'RESERVATION_HAS_BEEN_REFUSED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.accept = async (req, res) => {
    try {
        const { error } = approveReservationValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const note = req.body?.note
        const doctorId = req.user?._id
        const reservationId = req.params.id

        const reservation = await Schedule.findOneAndUpdate({ reservation: reservationId, doctor: doctorId, approval: 'PENDING' }, { approval: 'ACCEPTED', note })
        if (!reservation) throw new BadRequestError('DOCTOR_IS_NOT_IN_SELECTED')
        const data = await Reservation.findByIdAndUpdate(reservationId, { 
            updatedBy: req.user?._id, 
            stage: 'ACCEPTED', 
            doctors: [req.user?._id] 
        }, { new: true })
        
        response.success(200, { data, message: 'RESERVATION_HAS_BEEN_ACCEPTED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const reservation = await Reservation.findById(id)
            .populate('createdBy', 'username -_id')
            .populate('updatedBy', 'username -_id')
            .populate('specialties', 'name')
            .populate('doctors', 'lastName firstName contact')
            .populate('patient', 'username contact')
        response.success(200, { data: reservation }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.list = async (req, res) => {
    try {
        const page = parseInt(req.query.page ?? 1)
        const limit = parseInt(req.query.limit ?? 5)
        const skip = page - 1
        const appointmentDate = req.query.appointmentDate === 'asc' ? 1 : -1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1

        let query = { isDeleted: false }
        if (req.user?.segment === 'DOCTOR') {
            query['stage'] = 'PENDING'
            query['doctors'] = {
                $in: req.user?._id
            }
        }
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const reservation = await Reservation.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ appointmentDate, createdAt })
            .populate('patient', 'username contact -_id')

        const totalReservation = await Reservation.count({ isDeleted: false })
        response.success(200, { data: reservation, metaData: { skip, limit, total: totalReservation } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}