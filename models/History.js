const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = mongoose.Schema(
    {
        moduleId: {
            type: Schema.Types.ObjectId,
        },
        data: {
            type: Object,
        },
        url: {
            type: String,
            required: [true, 'URL_IS_REQUIRED']
        },
        module: {
            type: String,
            required: [true, 'MODULE_IS_REQUIRED']
        },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
)

module.exports = mongoose.model('History', schema)