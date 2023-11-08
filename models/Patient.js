const mongoose = require('mongoose')
const initialObject = require('./index')
const User = require('./User')
const PatientHistory = require('./PatientHistory')
const { encryptPassword } = require('../helpers/utils')

const schema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'USERNAME_IS_REQUIRED']
        },
        fullName: {
            type: String,
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
            required: [true, 'CONTACT_IS_REQUIRED']
        },
        dateOfBirth: {
            type: Date
        },
        description: {
            type: String
        },
        point: {
            type: Number,
            default: 0
        },
        detail: {
            type: mongoose.Schema.ObjectId,
            ref: 'PatientDetail',
        },
        histories: [{
            type: mongoose.Schema.ObjectId,
            ref: 'PatientHistory',
        }],
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

schema.post('save', async function (doc) {
    try {
        const userLength = User.countDocuments({ _id: doc?._id })
        if (userLength > 0) return
        const password = await encryptPassword(`${doc?.username}${process.env.PASSWORD_DEFAULT}`)
        await User.create({ _id: doc?._id, username: doc?.username, password, segment: 'PATIENT' })
    } catch (error) {
        console.error(error)
    }
})

schema.pre('findOneAndUpdate', function (next) {
    const firstName = this._update.firstName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const lastName = this._update.lastName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this._update.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...firstName, ...lastName, ...description, ...gender]
    next()
})

module.exports = mongoose.model('Patient', schema)