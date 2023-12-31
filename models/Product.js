const mongoose = require('mongoose')
const initialObject = require('./index')
const ExchangeRate = require('./ExchangeRate')

const schema = new mongoose.Schema(
    {
        name: {
            type: Object,
            required: [true, 'NAME_IS_REQUIRED'],
            validate: {
                validator: async function(name) {
                    const count = await this.model('Symptom').countDocuments({ name })
                    return count === 0
                },
                message: 'NAME_IS_ALREADY_EXIST'
            }
        },
        price: {
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
        category: {
            type: mongoose.Schema.ObjectId,
            ref: 'Category'
        },
        symptoms: [{
            type: mongoose.Schema.ObjectId,
            ref: 'Symptom'
        }],
        stocks: [{
            type: mongoose.Schema.ObjectId,
            ref: 'ProductStock'
        }],
        images: {
            type: Array,
            default: []
        },
        isStock: {
            type: Boolean,
            default: false
        },
        code: {
            type: String,
            default: ''
        },
        description: {
            type: String
        },
        ...initialObject
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
    const name = Object.keys(this.name || {}).map(key => this.name[key]?.toLowerCase()).filter(Boolean)
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...name, ...description]
    next()
})

schema.pre('findOneAndUpdate', function (next) {
    if (!this._update.name && !this._update.description) return next()
    const name = Object.keys(this._update.name || {}).map(key => this._update.name[key]?.toLowerCase()).filter(Boolean)
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...name, ...description]
    next()
})

module.exports = mongoose.model('Product', schema)