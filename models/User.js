const mongoose = require('mongoose')
const Role = require('./Role')

const schema = new mongoose.Schema({
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
        required: [true, 'ROLE_IS_REQUIRED'],
        validate: {
            validator: (id) => {
                return new Promise((resolve, reject) => {
                    Role.findById(id, function (err, doc) {
                        if (err) return reject(err)
                        resolve(!!doc)
                    })
                })
            },
            message: 'ROLE_IS_NOT_EXIST'
        },
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    isDisabled: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
})

module.exports = mongoose.model('User', schema)