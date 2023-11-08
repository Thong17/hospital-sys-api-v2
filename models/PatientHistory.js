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
            type: String,
            default: ''
        },
        treatments: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Category',
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const treatment = await Category.findById(id)
                            resolve(!!treatment)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'TREATMENT_IS_NOT_EXIST'
            },
        }],
        medications: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        }],
        condition: {
            type: String,
            enum: ['HEALTHY', 'NEED_SCHEDULE', 'WEAK']
        },
        comment: {
            type: String,
            default: ''
        },
        attachments: {
            type: Array,
            default: []
        },
        schedule: {
            type: mongoose.Schema.ObjectId,
            ref: 'Schedule',
            required: [true, 'SCHEDULE_IS_REQUIRED'],
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    },
)

module.exports = mongoose.model('PatientHistory', schema)