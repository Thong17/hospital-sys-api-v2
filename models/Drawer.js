const mongoose = require('mongoose')
const User = require('./User')

const schema = mongoose.Schema(
    {
        buyRate: {
            type: Number,
            require: true
        },
        sellRate: {
            type: Number,
            require: true
        },
        cashes: {
            type: Array,
        },
        startAt: {
            type: Date,
            default: Date.now
        },
        endedAt: {
            type: Date,
        },
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.post('save', async function () {
    await User.findByIdAndUpdate(this.user, { drawer: this._id })
})

module.exports = mongoose.model('Drawer', schema)