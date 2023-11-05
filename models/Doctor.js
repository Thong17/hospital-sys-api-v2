const mongoose = require('mongoose')
const initialObject = require('./index')

const schema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: [true, 'FIRST_NAME_IS_REQUIRED']
        },
        lastName: {
            type: String,
            required: [true, 'LAST_NAME_IS_REQUIRED']
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE'],
            required: [true, 'GENDER_IS_REQUIRED']
        },
        email: {
            type: String,
        },
        contact: {
            type: String,
        },
        specialties: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Specialty',
            required: [true, 'SPECIALTY_IS_REQUIRED'],
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
        dateOfBirth: {
            type: Date
        },
        startTime: {
            type: String
        },
        endTime: {
            type: String
        },
        shift: {
            type: Array,
            default: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
        },
        description: {
            type: String
        },
        rate: {
            type: Number,
            default: 0
        },
        ...initialObject
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
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

module.exports = mongoose.model('Doctor', schema)