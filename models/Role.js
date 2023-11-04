const mongoose = require('mongoose')
const initialObject = require('./index')

const schema = mongoose.Schema(
    {
        name: {
            type: Object,
            required: [true, 'NAME_IS_REQUIRED'],
            validate: {
                validator: async function(name) {
                    const count = await this.model('Role').countDocuments({ name })
                    return count === 0
                },
                message: 'NAME_IS_ALREADY_EXIST'
            }
        },
        description: {
            type: String
        },
        privilege: {
            type: Object,
            required: [true, 'PRIVILEGE_IS_REQUIRED']
        },
        navigation: {
            type: Object,
            required: [true, 'NAVIGATION_IS_REQUIRED']
        },
        ...initialObject
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

schema.pre('save', function (next) {
    const name = Object.keys(this.name).map(key => this.name[key]?.toLowerCase()).filter(Boolean)
    const description = this.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this.tags = [...name, ...description]
    next()
})

schema.pre('findOneAndUpdate', function (next) {
    const name = Object.keys(this._update.name || {}).map(key => this._update.name[key]?.toLowerCase()).filter(Boolean)
    const description = this._update.description?.split(' ').map(key => key?.toLowerCase()).filter(Boolean) || []
    this._update.tags = [...name, ...description]
    next()
})

module.exports = mongoose.model('Role', schema)