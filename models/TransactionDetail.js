const mongoose = require('mongoose')
const Transaction = require('./Transaction')

const schema = mongoose.Schema(
    {
        how: {
            type: String,
        },
        dose: {
            type: String,
        },
        duration: {
            type: String,
        },
        schedules: {
            type: Array,
        },
        transaction: {
            type: mongoose.Schema.ObjectId,
            ref: 'Transaction'
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.post('findOneAndUpdate', async function (doc) {
    try {
        await Transaction.findByIdAndUpdate(doc?.transaction, { detail: doc?._id })
    } catch (error) {
        console.error(error)
    }
})

module.exports = mongoose.model('TransactionDetail', schema)