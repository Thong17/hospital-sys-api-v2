const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
        invoice: {
            type: String
        },
        total: {
            type: Number,
            default: 0
        },
        subtotal: {
            type: Number,
            default: 0
        },
        receiveCashes: {
            type: Array,
        },
        returnCashes: {
            type: Array,
        },
        paymentMethod: {
            type: String,
            enum: ['CASH', 'CARD', 'TRANSFER', 'INSURANCE'],
            default: 'CASH',
        },
        exchangeRate: {
            type: Object,
        },
        discounts: {
            type: Array,
        },
        services: {
            type: Array,
        },
        drawer: {
            type: mongoose.Schema.ObjectId,
            ref: 'Drawer'
        },
        customer: {
            type: mongoose.Schema.ObjectId,
            ref: 'Patient'
        },
        schedule: {
            type: mongoose.Schema.ObjectId,
            ref: 'Schedule'
        },
        transactions: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Transaction'
        }],
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('Payment', schema)