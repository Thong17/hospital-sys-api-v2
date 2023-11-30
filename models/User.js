const mongoose = require('mongoose')
const Role = require('./Role')
const initialObject = require('./index')
const Patient = require('./Patient')
const PatientDetail = require('./PatientDetail')
const Doctor = require('./Doctor')

const schema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'USERNAME_IS_REQUIRED'],
            index: {
                unique: true
            }
        },
        segment: {
            type: String,
            enum: ['GENERAL', 'DOCTOR', 'PATIENT'],
            default: 'GENERAL'
        },
        password: {
            type: String,
            required: [true, 'PASSWORD_IS_REQUIRED'],
            minlength: [7, 'PASSWORD_MIN_LENGTH_VALIDATION'],
            validate: {
                validator: (password) => {
                    return new Promise((resolve, reject) => {
                        try {
                            const passwordComplexity = new RegExp('(?=.*[a-z])(?=.*[0-9])(?=.{7,})')
                            resolve(passwordComplexity.test(password))
                        } catch (error) {
                            reject(error)
                        }
                    })
                }
            }
        },
        role: {
            type: mongoose.Schema.ObjectId,
            ref: 'Role',
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const role = await Role.findById(id)
                            resolve(!!role)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'ROLE_IS_NOT_EXIST'
            },
        },
        drawer: {
            type: mongoose.Schema.ObjectId,
            ref: 'Drawer',
        },
        description: {
            type: String
        },
        ...initialObject
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
    const username = this.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const segment = this.segment?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...username, ...description, ...segment]
    next()
})

schema.post('save', async function (doc) {
    try {
        switch (true) {
            case doc?.segment === 'PATIENT':
                const patientLength = await Patient.countDocuments({ _id: doc?._id })
                if (patientLength > 0) break
                await Patient.create({ _id: doc?._id, detail: doc?._id, user: doc?._id })
                await PatientDetail.create({ _id: doc?._id })
                break
    
            case doc?.segment === 'DOCTOR':
                const doctorLength = await Doctor.countDocuments({ _id: doc?._id })
                if (doctorLength > 0) return
                await Doctor.create({ _id: doc?._id, user: doc?._id })
                break
        
            default:
                break
        }
    } catch (error) {
        console.error(error)
    }
})

schema.pre('findOneAndUpdate', function (next) {
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const username = this._update.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const segment = this._update.segment?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...username, ...description, ...segment]
    next()
})

module.exports = mongoose.model('User', schema)