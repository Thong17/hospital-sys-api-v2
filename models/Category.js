const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
        name: {
            type: Object,
            require: true
        },
        status: {
            type: Boolean,
            default: false
        },
        description: {
            type: String,
            default: ''
        },
        products: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        }],
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('Category', schema)