const mongoose = require('mongoose')
const initialObject = require('./index')
const User = require('./User')
const { encryptPassword } = require('../helpers/utils')

const schema = new mongoose.Schema(
    {
        fullName: {
            type: String,
        },
        gender: {
            type: String,
            enum: ['MALE', 'FEMALE'],
            default: 'MALE'
        },
        email: {
            type: String,
        },
        contact: {
            type: String,
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
        ...initialObject
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
    const fullName = this.fullName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...fullName, ...description, ...gender]
    next()
})

schema.post('save', async function (doc) {
    try {
        const userLength = User.countDocuments({ _id: doc?._id })
        if (userLength > 0) return
        const password = await encryptPassword(`${doc?.username}${process.env.PASSWORD_DEFAULT}`)
        await User.create({ _id: doc?._id, username: doc?.username, password, segment: 'PATIENT' })
        await PatientDetail.create({ _id: doc?._id })
    } catch (error) {
        console.error(error)
    }
})

schema.pre('findOneAndUpdate', function (next) {
    const fullName = this._update.fullName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this._update.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...fullName, ...description, ...gender]
    next()
})

module.exports = mongoose.model('Patient', schema)