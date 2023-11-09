const mongoose = require('mongoose')
const ExchangeRate = require('./ExchangeRate')

const schema = mongoose.Schema(
    {
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
        quantity: {
            type: Number,
            default: 0
        },
        discount: {
            type: Object,
            default: {
                value: 0,
                type: 'PCT',
                isFixed: false
            }
        },
        note: {
            type: String,
            default: ''
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        patient: {
            type: mongoose.Schema.ObjectId,
            ref: 'Patient'
        },
        schedule: {
            type: mongoose.Schema.ObjectId,
            ref: 'Schedule'
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('Transaction', schema)