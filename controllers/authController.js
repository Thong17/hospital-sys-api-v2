const response = require('../helpers/response')

exports.login = (req, res) => {
    response.success(200, req.body, res)
}