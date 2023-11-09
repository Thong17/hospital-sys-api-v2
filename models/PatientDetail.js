const mongoose = require('mongoose')

const schema = new mongoose.Schema(
    {
        bloodType: {
            type: String,
        },
        allergies: {
            type: Array,
            default: []
        },
        chronics: {
            type: Array,
            default: []
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('PatientDetail', schema)