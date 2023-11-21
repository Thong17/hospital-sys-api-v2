const response = require('../helpers/response')
const Schedule = require('../models/Schedule')
const PatientHistory = require('../models/PatientHistory')
const { convertStringToArrayRegExp } = require('../helpers/utils')
const { BadRequestError } = require('../helpers/handlingErrors')
const Payment = require('../models/Payment')


exports.start = async (req, res) => {
    try {
        const id = req.params.id
        const schedule = await Schedule.findById(id)
        if (!schedule) throw new BadRequestError('SCHEDULE_NOT_EXIST')
        if (schedule.startedAt) throw new BadRequestError('SCHEDULE_HAS_ALREADY_STARTED')
        if (schedule.endedAt) throw new BadRequestError('SCHEDULE_HAS_ALREADY_ENDED')
        const patientHistory = await PatientHistory.create({ _id: id, schedule: id })
        await Schedule.findByIdAndUpdate(id, { startedAt: Date.now(), stage: 'STARTED', patientRecord: patientHistory?._id })
        response.success(200, { data: {}, message: 'SCHEDULE_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.update = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const schedule = await Schedule.findById(id)
        if (!schedule) throw new BadRequestError('SCHEDULE_NOT_EXIST')
        if (!schedule.startedAt) throw new BadRequestError('SCHEDULE_HAS_NOT_STARTED')
        if (schedule.endedAt) throw new BadRequestError('SCHEDULE_HAS_ALREADY_ENDED')
        await PatientHistory.findByIdAndUpdate(id, body)
        response.success(200, { data: {}, message: 'PATIENT_HISTORY_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.end = async (req, res) => {
    try {
        const id = req.params.id
        const body = req.body
        const schedule = await Schedule.findById(id).populate('transactions')
        if (!schedule) throw new BadRequestError('SCHEDULE_NOT_EXIST')
        if (!schedule.startedAt) throw new BadRequestError('SCHEDULE_HAS_NOT_STARTED')
        if (schedule.endedAt) throw new BadRequestError('SCHEDULE_HAS_ALREADY_ENDED')
        await Schedule.findByIdAndUpdate(id, { endedAt: Date.now(), stage: 'ENDED' })
        await PatientHistory.findByIdAndUpdate(id, body)
        const total = schedule.transactions?.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.total
        }, 0)
        const payment = {
            total,
            subtotal: total,
            schedule: id,
            transactions: schedule.transactions,
            createdBy: req.user?._id
        }
        await Payment.create(payment)
        response.success(200, { data: {}, message: 'SCHEDULE_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const schedule = await Schedule.findById(id)
            .populate('patient')
            .populate('doctor', '-_id')
            .populate('reservation', '-_id')
            .populate('patientRecord', '-_id')
            .populate({
                path: 'transactions',
                populate: {
                    path: 'product',
                    select: 'images -_id'
                }
            })

        const records = await Schedule.find({ patient: schedule?.patient?._id, stage: 'ENDED' })
            .select('-_id -patient -approval -stage')
            .sort({ createdAt: -1 })
            .populate('doctor', 'tags username -_id')
            .populate({
                path: 'patientRecord',
                populate: 'treatments symptoms'
            })

        response.success(200, { data: schedule, records }, res)
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
        
        let query = { approval: 'ACCEPTED' }
        if (req.user?.segment === 'DOCTOR') {
            query['stage'] = {
                $in: ['PENDING', 'STARTED']
            }
            query['doctor'] = req.user?._id
        }
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const schedules = await Schedule.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ createdAt })
            .populate('reservation', 'appointmentDate note -_id')
            .populate('doctor', 'username fullName contact -_id')
            .populate('patient', 'username fullName contact -_id')

        const totalSchedule = await Schedule.count({ approval: 'ACCEPTED' })
        response.success(200, { data: schedules, metaData: { skip, limit, total: totalSchedule } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}