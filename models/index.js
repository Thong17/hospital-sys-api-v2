const mongoose = require('mongoose')

module.exports = {
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
    isDeleted: {
        type: Boolean,
        default: false
    },
    tags: {
        type: Array,
        default: []
    },
}