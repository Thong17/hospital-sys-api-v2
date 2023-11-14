const mongoose = require('mongoose')

const schema = mongoose.Schema(
    {
        invoice: {
            type: String,
            unique: true
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
        updatedBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        stage: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'REMOVED'],
            default: 'PENDING'
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

schema.pre('save', async function (next) {
    const currentYear = new Date().getFullYear().toString()
    const countDocuments = await this.model('Payment').countDocuments({ createdAt: { $lt: new Date(currentYear, 0, 1) } })
    const invoiceNumber = (countDocuments + 1).toString().padStart(5, '0')
    const generatedInvoice = `${currentYear}-INV${invoiceNumber}`
    const invoice = generatedInvoice?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.invoice = generatedInvoice
    this.tags = [...invoice]
    next()
})

module.exports = mongoose.model('Payment', schema)