const mongoose = require('mongoose')
const initialObject = require('./index')
const Specialty = require('./Specialty')
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
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
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

schema.methods.onboardUser = async function (id, username) {
    try {
        const userLength = await this.model('User').countDocuments({ _id: id })
        if (userLength > 0) return
        const password = await encryptPassword(`${username}${process.env.PASSWORD_DEFAULT}`)
        await this.model('User').create({ _id: id, username, password, segment: 'DOCTOR' })
    } catch (error) {
        console.error(error)
    }
}

schema.pre('findOneAndUpdate', function (next) {
    const fullName = this._update.fullName?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const gender = this._update.gender?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...fullName, ...description, ...gender]
    next()
})

module.exports = mongoose.model('Doctor', schema)