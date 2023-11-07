const moment = require('moment')
const response = require('../helpers/response')
const Doctor = require('../models/Doctor')
const History = require('../models/History')
const { createDoctorValidation, updateDoctorValidation } = require('../validations/doctorValidation')
const { ValidationError } = require('../helpers/handlingErrors')
const { extractJoiErrors, readExcel, convertArrayMongo, convertStringToArrayRegExp } = require('../helpers/utils')
const generateExcel = require('../configs/excel')


exports.create = async (req, res) => {
    try {
        const { error } = createDoctorValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const body = req.body
        const doctor = new Doctor(body)
        doctor.createdBy = req.user?._id
        await doctor.save()
        response.success(200, { data: doctor, message: 'DOCTOR_HAS_BEEN_CREATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._delete = async (req, res) => {
    try {
        const id = req.params.id
        const reason = req.query.reason ?? ''
        if (res.log) res.log.description = reason
        const doctor = await Doctor.findByIdAndUpdate(id, { isDeleted: true, updatedBy: req.user?._id })
        response.success(200, { data: doctor, message: 'DOCTOR_HAS_BEEN_DELETED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.update = async (req, res) => {
    try {
        const { error } = updateDoctorValidation.validate(req.body, { abortEarly: false })
        if (error) throw new ValidationError(error.message, extractJoiErrors(error))
        const id = req.params.id
        const body = req.body
        body.updatedBy = req.user?._id
        const doctor = await Doctor.findByIdAndUpdate(id, body)
        response.success(200, { data: doctor, message: 'DOCTOR_HAS_BEEN_UPDATED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.detail = async (req, res) => {
    try {
        const id = req.params.id
        const doctor = await Doctor.findById(id)
            .populate('createdBy', 'username -_id')
            .populate('updatedBy', 'username -_id')
        response.success(200, { data: doctor }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports.history = async (req, res) => {
    try {
        const id = req.params.id
        const histories = await History.find({ moduleId: id, module: 'DOCTOR' })
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
        const limit = parseInt(req.query.limit ?? 5)
        const skip = page - 1
        const username = req.query.username === 'asc' ? 1 : -1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1
        
        let query = { isDeleted: false }
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const doctors = await Doctor.find(query)
            .skip((skip) * limit)
            .limit(limit)
            .sort({ username, createdAt })
            .populate('specialties', 'name')

        const totalDoctor = await Doctor.count({ isDeleted: false })
        response.success(200, { data: doctors, metaData: { skip, limit, total: totalDoctor } }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._export = async (req, res) => {
    try {
        const languages = req.body.languages || []
        const name = req.query.name === 'asc' ? 1 : -1
        const createdAt = req.query.createdAt === 'asc' ? 1 : -1

        let query = { isDeleted: false }
        const search = convertStringToArrayRegExp(req.query.search)
        if (search?.length > 0) {
            query['tags'] = {
                $all: search
            }
        }

        const columns = [
            { 
                key: 'no', 
                width: 5,  
                style: {
                    alignment: {
                        vertical:'middle',
                        horizontal:'center'
                    }
                }
            },
            { 
                key: 'id', 
                width: 27,
            },
            { 
                key: 'username', 
                width: 27,
            },
            { 
                key: 'fullName', 
                width: 27,
            },
            { 
                key: 'gender', 
                width: 27,
            },
            { 
                key: 'dateOfBirth', 
                width: 27,
            },
            { 
                key: 'specialty', 
                width: 27,
            },
            { 
                key: 'rate', 
                width: 27,
            },
            { 
                key: 'status', 
                width: 10,
            },
            { 
                key: 'description', 
                width: 45,
            },
            { 
                key: 'isDeleted', 
                width: 15,
            },
            { 
                key: 'createdBy', 
                width: 15,
            },
            { 
                key: 'updatedBy', 
                width: 15,
            },
            { 
                key: 'createdAt', 
                width: 15,
            },
            { 
                key: 'updatedAt', 
                width: 15,
            },
            { 
                key: 'tags', 
                width: 55,
            }
        ]

        let columnHeader = { no: 'NO', id: 'ID', username: 'LAST_NAME', fullName: 'FIRST_NAME', gender: 'GENDER', dateOfBirth: 'DATE_OF_BIRTH', specialty: 'SPECIALTY', rate: 'RATE', status: 'STATUS', description: 'DESCRIPTION', isDeleted: 'IS_DELETED', createdBy: 'CREATED_BY', updatedBy: 'UPDATED_BY', createdAt: 'CREATED_BY', updatedAt: 'UPDATED_AT', tags: 'TAGS' }
        languages.forEach(item => {
            columnHeader[`role${item}`] = `ROLE.${item.toUpperCase()}`
        })

        const mapRowData = (data) => {
            return data?.map((item, index) => {
                let obj = {
                    no: index + 1,
                    id: item._id.toString(),
                    username: item.username,
                    fullName: item.fullName,
                    gender: item.gender,
                    dateOfBirth: moment(item.dateOfBirth).format('YYYY MMM DD'),
                    specialty: JSON.stringify(item.specialty),
                    status: item.status,
                    description: item.description,
                    isDeleted: item.isDeleted,
                    createdBy: item.createdBy?.username || 'N/A',
                    updatedBy: item.updatedBy?.username || 'N/A',
                    createdAt: moment(item.createdAt).format('DD MMM, YYYY h:mm:ss A'),
                    updatedAt: moment(item.updatedAt).format('DD MMM, YYYY h:mm:ss A'),
                    tags: JSON.stringify(item.tags),
                }
                languages.forEach(lang => {
                    obj[`role${lang}`] = item.role?.name?.[lang] || 'N/A'
                })
                return obj
            })
        }
        const doctors = await Doctor.find(query).sort({ name, createdAt })
            .populate('createdBy', 'username -_id')
            .populate('updatedBy', 'username -_id')
            .populate('role', 'name -_id')
        const file = await generateExcel(columns, columnHeader, mapRowData(doctors))

        const now = moment().format('YYYY-MM-DD HH:mm:ss')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename=doctor_${now}.xlsx`)
        
        response.success(200, { file, name: `DOCTOR_${now}.xlsx` }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._validate = async (req, res) => {
    try {
        const file = req.file?.buffer
        const data = await readExcel(file)
        const convertedList = convertArrayMongo(data)
        let mappedData = convertedList.map(item => ({ data: item }))
        for (let i = 0; i < convertedList.length; i++) {
            const body = convertedList[i]
            const doctor = new Doctor(body)
            await doctor.validate()
                .then(_data => {
                    mappedData[i]['result'] = {
                        status: 'SUCCESS'
                    }
                })
                .catch(error => {
                    mappedData[i]['result'] = {
                        status: 'FAILED',
                        error: error?.errors
                    }
                })
        }
        response.success(200, { data: mappedData }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}

exports._import = async (req, res) => {
    try {
        const data = req.body
        const result = await Doctor.create(data)
        response.success(200, { data: { data: result }, message: 'DOCTOR_HAS_BEEN_IMPORTED' }, res)
    } catch (error) {
        response.failure(error.code, { message: error.message, fields: error.fields }, res, error)
    }
}