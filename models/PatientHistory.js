const mongoose = require('mongoose')
const Symptom = require('./Symptom')

const schema = new mongoose.Schema(
    {
        symptoms: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Symptom',
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const specialty = await Symptom.findById(id)
                            resolve(!!specialty)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'SYMPTOM_IS_NOT_EXIST'
            },
        }],
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
        schedule: {
            type: mongoose.Schema.ObjectId,
            ref: 'DoctorReservation',
            required: [true, 'SCHEDULE_IS_REQUIRED'],
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    },
)

module.exports = mongoose.model('PatientHistory', schema)