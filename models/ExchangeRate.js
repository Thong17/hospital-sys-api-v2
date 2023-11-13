const mongoose = require('mongoose')
const initialObject = require('./index')

const schema = new mongoose.Schema(
    {
        currency: {
            type: String,
            default: 'USD',
            index: {
                unique: true
            }
        },
        value: {
            type: Number,
            default: 0
        },
        symbol: {
            type: String,
            default: '&#36;'
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
    const value = this.value?.toString()
    const currency = this.currency?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...currency, ...description, value]
    next()
})

schema.pre('findOneAndUpdate', function (next) {
    const value = this._update.value?.toString()
    const currency = this._update.currency?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...value, ...currency, ...description]
    next()
})

module.exports = mongoose.model('ExchangeRate', schema)