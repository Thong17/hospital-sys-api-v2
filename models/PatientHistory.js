const mongoose = require('mongoose')
const initialObject = require('./index')
const Specialty = require('./Specialty')
const Doctor = require('./Doctor')

const schema = new mongoose.Schema(
    {
        symptoms: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Specialty',
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const specialty = await Specialty.findById(id)
                            resolve(!!specialty)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'SYMPTOM_IS_NOT_EXIST'
            },
        }],
        doctors: {
            type: mongoose.Schema.ObjectId,
            ref: 'Doctor',
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const doctor = await Doctor.findById(id)
                            resolve(!!doctor)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'DOCTOR_IS_NOT_EXIST'
            },
        },
        diagnose: {
            type: String
        },
        treatment: {
            type: [String],
            enum: ['X_RAY', 'SURGERY', 'MEDICATION', 'DIET', 'CHECK_UP', 'VACCINE']
        },
        medication: {
            type: String
        },
        condition: {
            type: String,
            enum: ['HEALTHY', 'BETTER', 'NEED_SCHEDULE', 'WORSEN']
        },
        comment: {
            type: String
        },
        attachments: {
            type: Array
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    },
    { versionKey: '__v' }
)

module.exports = mongoose.model('PatientHistory', schema)