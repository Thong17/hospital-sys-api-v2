const mongoose = require('mongoose')
const initialObject = require('./index')
const ExchangeRate = require('./ExchangeRate')
const Product = require('./Product')

const schema = new mongoose.Schema(
    {
        cost: {
            type: Number,
            require: true
        },
        currency: {
            type: mongoose.Schema.ObjectId,
            ref: 'ExchangeRate',
            required: [true, 'EXCHANGE_RATE_IS_REQUIRED'],
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
                message: 'EXCHANGE_RATE_IS_NOT_EXIST'
            },
        },
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'product',
            required: [true, 'PRODUCT_IS_REQUIRED'],
            validate: {
                validator: (id) => {
                    return new Promise(async (resolve, reject) => {
                        try {
                            const product = await Product.findById(id)
                            resolve(!!product)
                        } catch (error) {
                            reject(error)
                        }
                    })
                },
                message: 'PRODUCT_IS_NOT_EXIST'
            },
        },
        quantity: {
            type: Number,
            require: true
        },
        remain: {
            type: Number,
            default: 0
        },
        alertAt: {
            type: Number,
            default: 50
        },
        expireAt: {
            type: Date
        },
        code: {
            type: String,
            default: ''
        },
        note: {
            type: String
        },
        ...initialObject
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...description]
    next()
})

schema.post('save', async function (doc) {
    try {
        await Product.findByIdAndUpdate(doc?.product, { $push: { stocks: doc?._id } })
    } catch (error) {
        console.error(error)
    }
})

schema.pre('findOneAndUpdate', function (next) {
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...description]
    next()
})

module.exports = mongoose.model('ProductStock', schema)