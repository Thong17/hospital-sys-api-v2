const response = require('../helpers/response')
const DoctorReservation = require('../models/DoctorReservation')
const { convertStringToArrayRegExp } = require('../helpers/utils')


exports.start = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        response.success(200, { data: {}, message: 'SCHEDULE_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.end = async (req, res) => {
    try {
        const id = req.params.id
        console.log(id)
        response.success(200, { data: {}, message: 'SCHEDULE_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const schedule = await DoctorReservation.findById(id)
            .populate('createdBy', 'username -_id')
            .populate('updatedBy', 'username -_id')
        response.success(200, { data: schedule }, res)
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

        const schedules = await DoctorReservation.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ createdAt })
            .populate('reservation', 'appointmentDate note -_id')
            .populate('doctor', 'username fullName contact -_id')
            .populate('patient', 'username fullName contact -_id')

        const totalSchedule = await DoctorReservation.count({ approval: 'ACCEPTED' })
        response.success(200, { data: schedules, metaData: { skip, limit, total: totalSchedule } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}