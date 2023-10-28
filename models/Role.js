const mongoose = require('mongoose')

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
        createdBy: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        status: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
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

schema.pre('save', function (next) {
    const name = Object.keys(this.name).map(key => this.name[key]?.toLowerCase()).filter(Boolean)
    const description = Object.keys(this.description).map(key => this.description[key]?.toLowerCase()).filter(Boolean)
    this.tags = [...name, ...description]
    next()
})

schema.pre('findOneAndUpdate', async function (next) {
    const doc = await this.model.findById(this.getQuery()?._id)
    const name = Object.keys(doc.name).map(key => doc.name[key]?.toLowerCase()).filter(Boolean)
    const description = doc.description.split(' ').map(key => key.toLowerCase()).filter(Boolean)
    this._update.tags = [...name, ...description]
    next()
})

module.exports = mongoose.model('Role', schema)