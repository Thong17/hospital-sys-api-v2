const mongoose = require('mongoose')
const Schedule = require('./Schedule')
const Payment = require('./Payment')
const ExchangeRate = require('./ExchangeRate')

const schema = mongoose.Schema(
    {
        description: {
            type: String,
            required: [true, 'DESCRIPTION_IS_REQUIRED'],
        },
        price: {
            type: Number,
            default: 0
        },
        currency: {
            type: mongoose.Schema.ObjectId,
            ref: 'ExchangeRate',
            required: [true, 'CURRENCY_IS_REQUIRED'],
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const exchangeRate = await ExchangeRate.findById(id)
                            resolve(!!exchangeRate)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'CURRENCY_IS_NOT_EXIST'
            },
        },
        total: {
            type: Number,
            default: 0
        },
        cost: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        note: {
            type: String,
            default: ''
        },
        stocks: {
            type: Array,
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        customer: {
            type: mongoose.Schema.ObjectId,
            ref: 'Patient'
        },
        schedule: {
            type: mongoose.Schema.ObjectId,
            ref: 'Schedule'
        },
        stage: {
            type: String,
            enum: ['PENDING', 'COMPLETED', 'REMOVED'],
            default: 'PENDING'
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.methods.pushSchedule = function(scheduleId) {
    return new Promise(async (resolve, reject) => {
        try {
            schedule = await Schedule.findByIdAndUpdate(scheduleId, { $push: { transactions: this?._id } }, { new: true })
            resolve(schedule)
        } catch (error) {
            reject(error)
        }
    })
}

schema.methods.pullSchedule = function(scheduleId) {
    return new Promise(async (resolve, reject) => {
        try {
            schedule = await Schedule.findByIdAndUpdate(scheduleId, { $pull: { transactions: this?._id } }, { new: true })
            resolve(schedule)
        } catch (error) {
            reject(error)
        }
    })
}

schema.methods.pushPayment = function(paymentId) {
    return new Promise(async (resolve, reject) => {
        try {
            payment = await Payment.findByIdAndUpdate(paymentId, { $push: { transactions: this?._id } }, { new: true })
            resolve(payment)
        } catch (error) {
            reject(error)
        }
    })
}

schema.methods.pullPayment = function(paymentId) {
    return new Promise(async (resolve, reject) => {
        try {
            payment = await Payment.findByIdAndUpdate(paymentId, { $pull: { transactions: this?._id } }, { new: true })
            resolve(payment)
        } catch (error) {
            reject(error)
        }
    })
}

module.exports = mongoose.model('Transaction', schema)