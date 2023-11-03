const mongoose = require('mongoose')
const Role = require('./Role')

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
        email: {
            type: String,
            required: [true, 'EMAIL_IS_REQUIRED'],
            index: {
                unique: true
            }
        },
        contact: {
            type: String,
        },
        role: {
            type: mongoose.Schema.ObjectId,
            ref: 'Role',
            required: [true, 'ROLE_IS_REQUIRED'],
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
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        status: {
            type: Boolean,
            default: false
        },
        description: {
            type: String
        },
        isDeleted: {
            type: Boolean,
            default: false
        },
        tags: {
            type: Array,
            default: []
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
    const username = this.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const segment = this.segment?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const email = this.email?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const contact = this.contact?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...username, ...description, ...segment, ...email, ...contact]
    next()
})

schema.pre('findOneAndUpdate', function (next) {
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const username = this._update.username?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const segment = this._update.segment?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const contact = this._update.contact?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const email = this._update.email?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...username, ...description, ...segment, ...email, ...contact]
    next()
})

module.exports = mongoose.model('User', schema)