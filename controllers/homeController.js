const response = require('../helpers/response')

exports.content = async (req, res) => {
    try {
        return response.success(200, { title: 'Hello' }, res)
    } catch (error) {
        return response.failure(error.code, { message: error.message }, res, error)
    }
}