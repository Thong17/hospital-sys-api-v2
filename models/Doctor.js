const mongoose = require('mongoose')
const initialObject = require('./index')
const Specialty = require('./Specialty')
const User = require('./User')
const { encryptPassword } = require('../helpers/utils')

const schema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        username: {
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
    const fullName = this.fullName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const username = this.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...fullName, ...username, ...description, ...gender]
    next()
})

schema.post('save', async function (doc) {
    try {
        const userLength = User.countDocuments({ _id: doc?._id })
        if (userLength > 0) return
        const password = await encryptPassword(`${doc?.fullName}${process.env.PASSWORD_DEFAULT}`)
        await User.create({ _id: doc?._id, username: doc?.username, password, segment: 'DOCTOR' })
    } catch (error) {
        console.error(error)
    }
})

schema.pre('findOneAndUpdate', function (next) {
    const fullName = this._update.fullName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const username = this._update.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this._update.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...fullName, ...username, ...description, ...gender]
    next()
})

module.exports = mongoose.model('Doctor', schema)