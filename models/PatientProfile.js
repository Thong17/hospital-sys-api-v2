const mongoose = require('mongoose')
const initialObject = require('./index')

const schema = new mongoose.Schema(
    {
        bloodType: {
            type: String,
        },
        sugarLevel: {
            type: String,
        },
        allergies: {
            type: Array,
            default: []
        },
        chronic: {
            type: Array,
            default: []
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('PatientProfile', schema)