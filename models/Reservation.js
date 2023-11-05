const mongoose = require('mongoose')
const initialObject = require('./index')
const Doctor = require('./Doctor')
const Patient = require('./Patient')
const Specialty = require('./Specialty')

const schema = new mongoose.Schema(
    {
        appointmentDate: {
            type: Date,
            default: Date.now,
            set: function() {
                return this.appointmentDate || Date.now()
            }
        },
        duration: {
            type: Number,
            default: 60
        },
        category: {
            type: String,
            enum: ['NORMAL', 'MILD', 'URGENT', 'EMERGENCY'],
            default: 'NORMAL'
        },
        note: {
            type: String
        },
        stage: {
            type: String,
            enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
            default: 'PENDING'
        },
        specialties: [{
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
                message: 'SPECIALTY_IS_NOT_EXIST'
            },
        }],
        doctors: [{
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
        }],
        patient: {
            type: mongoose.Schema.ObjectId,
            ref: 'Patient',
            required: [true, 'PATIENT_IS_REQUIRED'],
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const patient = await Patient.findById(id)
                            resolve(!!patient)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'PATIENT_IS_NOT_EXIST'
            },
        },
        ...initialObject
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
    // TODO: tags
    const firstName = this.firstName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const lastName = this.lastName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...firstName, ...lastName, ...description, ...gender]
    next()
})

schema.pre('findOneAndUpdate', function (next) {
    const firstName = this._update.firstName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const lastName = this._update.lastName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this._update.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...firstName, ...lastName, ...description, ...gender]
    next()
})

module.exports = mongoose.model('Reservation', schema)